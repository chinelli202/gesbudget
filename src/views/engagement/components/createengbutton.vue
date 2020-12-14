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
      <el-form :model="engagement">
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
        <el-form-item>
          <el-row :gutter="10">
            <el-col
              :span="3"
              :offset="2"
            >
              <strong>Ligne budget</strong>
            </el-col>
            <el-col :span="17">
              <el-cascader
                v-model="cascade"
                :options="chapitresOptions"
                :props="{expandTrigger: 'hover'}"
                placeholder="Choisir la ligne budgétaire"
                class="cascade-extra-lg"
                @change="cascadeChange"
              />
            </el-col>
          </el-row>
        </el-form-item>
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
            <el-form-item label="Libellé">
              <el-input
                v-model="engagement.libelle"
                type="textarea"
                :rows="3"
                @input="formAttributeChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-row :gutter="10">
            <el-col
              :span="4"
              :offset="2"
            >
              <strong>Montant HT</strong>
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="engagement.devise"
                placeholder="Devise"
                @input="formAttributeChange"
              >
                <el-option
                  v-for="(obj) in deviseOptions"
                  :key="obj.code"
                  :label="obj.code"
                  :value="obj.code"
                />
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="engagement.montant_ht"
                @input="changeMontantHT"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="10">
            <el-col
              :span="4"
              :offset="2"
            >
              <strong>Montant TTC</strong>
            </el-col>
            <el-col
              :span="4"
            >
              <span class="span-label">
                <strong> TVA {{ tva.toLocaleString('fr-FR') }}%</strong>
              </span>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="engagement.montant_ttc"
                
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="10">
            <el-col
              :span="10"
              :offset="2"
            >
              <span class="span-label">
                <strong>Nature</strong>
              </span>
            </el-col>
            <el-col
              :span="9"
              :offset="2"
            >
              <span class="span-label">
                <strong>Type</strong>
              </span>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col
              :span="10"
              :offset="2"
            >
              <el-select
                v-model="engagement.nature"
                placeholder="Nature"
                class="select-large"
                @input="formAttributeChange"
              >
                <el-option
                  v-for="(obj) in natureOptions"
                  :key="obj.code"
                  :label="obj.libelle"
                  :value="obj.code"
                >
                  <span style="float: left">{{ obj.libelle }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ obj.code }}</span>
                </el-option>
              </el-select>
            </el-col>
            <el-col
              :span="9"
              :offset="2"
            >
              <el-select
                v-model="engagement.type"
                placeholder="Type"
                class="select-large"
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
            </el-col>
          </el-row>
        </el-form-item>
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
  private deviseOptions = {}
  private typeOptions = {}
  private natureOptions = {}
  private etatOptions = {}
  private statutOptions = {}
  private tva = 0
  private submitDisabled = true
  private engagement = {
    montant_ht: null,
    montant_ttc: 0,
    nature: '',
    type: '',
    devise: 'XAF',
    ligne_id: 0,
    rubrique_id: 0,
    chapitre_id: 0
  }

  created() {
    this.chapitresOptions = AppModule.budgetStructure[this.domain.toLowerCase()]
  }

  private domainChange() {
    this.chapitresOptions = AppModule.budgetStructure[this.domain.toLowerCase()]
  }

  private cascadeChange() {
    this.formAttributeChange()
    this.engagement.ligne_id = this.cascade === null ? 0 : this.cascade[2]
    this.engagement.rubrique_id = this.cascade === null ? 0 : this.cascade[1]
    this.engagement.chapitre_id = this.cascade === null ? 0 : this.cascade[0]
    getSoldeLigne({id: this.engagement.ligne_id}).then((response) => {
      this.soldeLigne = response.data.solde_restant == 0 ? 'Solde nul' : response.data.solde_restant
    })
  }

  private resetForm() {
    this.cascade = []
    this.soldeLigne = '0'
    this.engagement = {
      montant_ht: null,
      montant_ttc: 0,
      nature: '',
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
    this.dialogFormLoading = true
    this.createEngAction(this.engagement)
    this.resetForm()
    this.submitDisabled = true
    this.dialogFormLoading = false
    this.dialogFormVisible = false
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
    width: 15.6vw;
  }
</style>