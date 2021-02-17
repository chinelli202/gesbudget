<template>
  <div>
    <el-button
      :disabled="inactive"
      type="primary"
      icon="el-icon-edit"
      @click="launchDialogForm"
    >
      Créer un engagement
    </el-button>
    <el-dialog
      v-loading="dialogFormLoading"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="engagementForm"
        :model="engagement"
        autocomplete="on"
      >
        <el-row
          type="flex"
          justify="center"
        >
          <el-col
            :span="10"
          >
            <h1 style="text-align: center">
              Créer un engagement
            </h1>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom: 1.5em"
        >
          <el-col
            :span="8"
            :offset="2"
          >
            <el-radio-group
              v-model="domain"
              size="small"
              @change="domainChange"
            >
              <el-radio-button label="Fonctionnement" />
              <el-radio-button label="Mandat" />
            </el-radio-group>
          </el-col>
        </el-row>
          <el-row :gutter="10">
            <el-col
              :span="3"
              :offset="2"
            >
              <strong>Ligne budget</strong>
            </el-col>
            <el-col :span="17">
              <el-form-item
                prop="ligne_budgetaire"
                :rules="[{ validator: validateLigne, trigger: 'blur' }]"
              >
                <el-cascader
                  v-model="cascade"
                  :options="chapitresOptions"
                  :props="{expandTrigger: 'hover'}"
                  placeholder="Choisir la ligne budgétaire"
                  class="cascade-extra-lg"
                  filterable
                  :filter-method="cascadeFilter"
                  @change="cascadeChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col
              :span="3"
              :offset="2"
            >
              <strong>Ligne budget</strong>
            </el-col>
            <el-col :span="17">
              <el-form-item
                prop="eng_date"
                :rules="[{ validator: validateDate, trigger: 'blur' }]"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="engagement.eng_date"
                  format="dd MMMM yyyy"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="date"
                  placeholder="Choississez un jour"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        <el-form-item>
          <el-row :gutter="10">
            <el-col
              :span="3"
              :offset="2"
            >
              <strong>Solde ligne</strong>
            </el-col>
            <el-col :span="17">
              <strong>{{ soldeLigne | numFormat }}</strong>
            </el-col>
          </el-row>
        </el-form-item>
        <el-row :gutter="10">
          <el-col
            :span="20"
            :offset="2"
          >
            <el-form-item
              prop="libelle"
              label="Libellé"
              :rules="[{ validator: validateLibelle, trigger: 'blur' }]"
            >
              <el-input
                v-model="engagement.libelle"
                type="textarea"
                :rows="3"
                @input="formAttributeChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 2.3em">
          <el-row :gutter="10">
            <el-col
              :span="4"
              :offset="2"
            >
              <strong>Montant TTC</strong>
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="engagement.devise"
                placeholder="Devise"
                filterable
                remote
                :remote-method="selectDevise"
                :loading="deviseLoading"
                @input="formAttributeChange"
              >
                <el-option
                  v-for="(obj) in deviseOptions"
                  :key="obj.code"
                  :label="obj.libelle"
                  :value="obj.code"
                />
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="montant_ttc"
                :rules="[{ validator: validateMontant, trigger: 'blur' }]"
              >
                <el-input-number
                  style="width: 100%"
                  v-model="engagement.montant_ttc"
                  :min="0"
                  :controls="false"
                  @input="formAttributeChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-row :gutter="10">
          <el-col
            :span="4"
            :offset="2"
          >
            <strong>Type d'engagement</strong>
          </el-col>
          <el-col
            :span="10"
          >
            <el-form-item
              prop="type"
              :rules="[{ required: true, message: 'Veuillez choisir un type pour cet engagement', trigger: 'change' }]"
            >
              <el-select
                v-model="engagement.type"
                placeholder="Type"
                style="width: 100%"
                @input="formAttributeChange"
              >
                <el-option
                  v-for="(obj) in typeOptions"
                  :key="obj.code"
                  :label="obj.libelle"
                  :value="obj.code"
                >
                  <span style="float: left">{{ obj.libelle }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ obj.code }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-row
          justify="end"
        >
          <el-col
            :span="20"
            :offset="2"
          >
            <el-button @click="dialogFormVisible = false">Annuler</el-button>
            <el-button
              type="primary"
              :disabled="submitDisabled"
              @click="preAction"
            >
              Créer l'engagement
            </el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
  
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from 'vue-property-decorator'
import { createEngagement } from '@/api/engagements'
import { Form as ElForm, Input } from 'element-ui'
import { getSoldeLigne } from '@/api/lignes'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'CreateEngButton',
  components: {
    
  }
})

export default class CreateEngButton extends Vue {
  @Prop() private inactive!: string
  @Prop() private createEngAction!: CallableFunction

  private validateLigne = (rule: any, value: number, callback: Function) => {
    if (this.selectedLigne().length === 0) {
      callback(new Error('Veuillez choisir une ligne budgétaire'))
    } else if (this.maxMontant() === 0) {
      callback(new Error('Vous ne pouvez pas créer un engagement sur une ligne avec un solde nul'))
    } else {
      callback()
    }
  }
  
  private validateLibelle = (rule: any, value: string, callback: Function) => {
    if (!value) {
      callback(new Error('Veuillez saisir un libellé à cet engagement'))
    } else if(value.length < 4) {
      callback(new Error('Le libellé saisi doit avoir au moins 4 caractères'))
    } else {
      callback()
    }
  }

  private validateMontant = (rule: any, value: number, callback: Function) => {
    if (this.maxMontant() > 1 && value < 1) {
      callback(new Error('Veuillez saisir un montant non nul'))
    } else if (this.maxMontant() < value ) {
      callback(new Error(`Le solde restant pour cette ligne budgétaire est de ${this.maxMontant().toLocaleString()} XAF.
      Vous ne pouvez pas créer un engagement d'un montant supérieur à cette somme.`))
    } else {
      callback()
    }
  }
  
  private validateDate = (rule: any, value: number, callback: Function) => {
    if (!value) {
      callback(new Error('Veuillez saisir une date pour cet engagement'))
    } else {
      callback()
    }
  }

  /** Cascader variables */
  private domain = 'Fonctionnement'
  private chapitresOptions: any = AppModule.budgetStructure.fonctionnement
  private cascade: number[] = []

  /** Dialog Form Variables */
  // Add rules validation on the form to prevent incorrect submissions
  private soldeLigne = '0'
  private formLabelWidth = '120px'
  private dialogFormVisible = false
  private dialogFormLoading = false
  private deviseLoading: boolean = false
  private deviseOptions: string[] = []
  private listeDevises: string[] = []
  private typeOptions = {}
  private natureOptions = {}
  private etatOptions = {}
  private statutOptions = {}
  private tva = 0
  private submitDisabled = true
  private todayDate = new Date()

  private engagement = {
    montant_ttc: 0,
    eng_date: new Date(),
    nature: 'PEG',
    type: '',
    devise: 'XAF',
    ligne_id: 0,
    rubrique_id: 0,
    chapitre_id: 0
  }

  private pickerOptions = {
    disabledDate(time: any) {
      return time.getTime() > Date.now();
    },
    shortcuts: [{
      text: 'Aujourd\'hui',
      onClick(picker: any) {
        picker.$emit('pick', new Date());
      }
    }, {
      text: 'Hier',
      onClick(picker: any) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        picker.$emit('pick', date);
      }
    }, {
      text: 'Il y a une semaine',
      onClick(picker: any) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', date);
      }
    }]
  }

  created() {
    this.chapitresOptions = AppModule.budgetStructure[this.domain.toLowerCase()]
  }

  private domainChange() {
    this.chapitresOptions = AppModule.budgetStructure[this.domain.toLowerCase()]
  }

  private maxMontant() {
    return 0 < +this.soldeLigne ? +this.soldeLigne : 0
  }

  private selectedLigne() {
    return this.cascade
  }

  private selectDevise(query: string) {
    if (query !== '') {
      this.deviseLoading = true;
      this.deviseLoading = false;
      this.deviseOptions = this.listeDevises.filter((item: any) => {
        return item.libelle.toLowerCase()
          .indexOf(query.toLowerCase()) > -1;
      });
    }
  }
  
  private cascadeChange() {
    console.log('cascade ', this.cascade)
    this.formAttributeChange()
    this.engagement.ligne_id = this.cascade === null ? 0 : this.cascade[2]
    this.engagement.rubrique_id = this.cascade === null ? 0 : this.cascade[1]
    this.engagement.chapitre_id = this.cascade === null ? 0 : this.cascade[0]
    getSoldeLigne({id: this.engagement.ligne_id}).then((response) => {
      this.soldeLigne = response.data.solde_restant == 0 ? 'Solde nul' : response.data.solde_restant
    })
  }

  private cascadeFilter(node: any, keyword: string) {
    return node.text.toLowerCase().includes(keyword.toLowerCase());
  }

  private resetForm() {
    this.cascade = []
    this.soldeLigne = '0'
    this.engagement = {
      montant_ttc: 0,
      eng_date: new Date(),
      nature: 'PEG',
      type: '',
      devise: 'XAF',
      ligne_id: 0,
      rubrique_id: 0,
      chapitre_id: 0
    }
  }

  private launchDialogForm() {
    this.deviseOptions = AppModule.devises
    this.typeOptions = AppModule.typesEngagement
    this.natureOptions = AppModule.naturesEngagement
    this.etatOptions = AppModule.etatsEngagement
    this.statutOptions = AppModule.statutsEngagement
    this.tva = AppModule.tva

    this.dialogFormVisible = true
  }

  private preAction() {
    (this.$refs.engagementForm as ElForm).validate(async(valid: boolean) => {
      if(valid) {
        this.dialogFormLoading = true
        let { eng_date, ...eng } = this.engagement
        console.log('eng_date ', eng_date, eng)
        this.createEngAction({eng_date: new Date(eng_date).toISOString().slice(0, 19).replace('T', ' '), ...eng})
        this.resetForm()
        this.submitDisabled = true
        this.dialogFormLoading = false
        this.dialogFormVisible = false
      } else {
        return false
      }
    })
  }

  private changeMontantHT(value: number) {
    this.engagement.montant_ttc = Math.ceil(value * (1 + this.tva / 100))
    this.formAttributeChange()
  }

  private formAttributeChange() {
    this.submitDisabled = false
  }

  public getEngagement() {
    console.log('return engagement')
    return this.engagement
  }
}
</script>

<style lang="scss" scoped>
  .cascade-extra-lg{
      width: 33.8vw;
  }

  .select-large{
    width: 19.6vw;
  }
</style>