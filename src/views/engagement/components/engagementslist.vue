<template>
  <div>
    <el-row>
      <el-col :span="8">
        <h1 
          v-if="title"
          style="margin-top: 0px">
          {{ title }}
        </h1>
        <span v-else>
          .
        </span>
      </el-col>
      <el-col :span="12">
        <el-radio-group
          v-if="displayEtatRadio"
          v-model="etatLibelle"
          size="small"
          @change="etatChange"
        >
          <el-radio-button label="Initiés"/>
          <el-radio-button label="Pré Engagés"/>
          <el-radio-button label="Imputés"/>
          <el-radio-button label="Apurés"/>
          <el-radio-button label="Clôturés"/>
        </el-radio-group>
        <span v-else>
          .
        </span>
      </el-col>
      <el-col :span="4"
      >
        <div>
          <el-button
            v-if="canCreateEngagement && displayCreateButton"
            type="primary"
            @click="launchDialogForm"
          >
            Créer un engagement
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="initiatedEngagements"
      :height="tableHeight ? tableHeight: '78vh'"
      style="width: 100%"
    >
      <el-table-column
        fixed
        prop="id"
        label="ID"
        width="70"
      />
      <el-table-column
        fixed
        prop="latest_edited_at"
        :formatter="dateFormatter"
        label="Mis à jour le"
        width="130"
      />
      <el-table-column
        fixed
        prop="code"
        label="Code"
        width="170"
      />
      <el-table-column
        prop="statut"
        label="Statut"
        width="110"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.next_statut ? 'warning' : tageffect[scope.row.etat][scope.row.latest_statut].type"
            :effect="tageffect[scope.row.etat][scope.row.latest_statut].effect"
            disable-transitions
          >
            {{ scope.row.etat }}_{{ scope.row.latest_statut }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="libelle"
        label="Libellé"
        width="250"
      />
      <el-table-column
        prop="ligne_libelle"
        label="Ligne Budgétaire"
        width="300"
      />
      <el-table-column
        prop="montant_ht"
        :formatter="numFormatter"
        label="Montant HT"
        width="150"
      />
      <el-table-column
        prop="montant_ttc"
        :formatter="numFormatter"
        label="Montant TTC"
        width="150"
      />
      <el-table-column
        prop="devise"
        label="Devise"
        width="75"
      />
      <el-table-column
        prop="nature"
        label="Nature"
        width="75"
      />
      <el-table-column
        prop="type"
        label="Type"
        width="75"
      />
      <el-table-column
        prop="saisisseur_name"
        label="Saisi par"
        width="100"
      />
      <el-table-column
        fixed="right"
        label="Opérations"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit-outline"
            size="small"
            @click="detail(scope.$index, scope.row)"
          >
            Detail
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="paginationTotal>0"
      :total="paginationTotal"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="padding: 5px 16px 0px"
      @pagination="getEngagements"
    />
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
                :disabled="true"
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
              @click="createEngagement"
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
import { Component, Vue, Prop } from 'vue-property-decorator'
import { getEngagements, createEngagement } from '@/api/engagements'
import { IEngagementData } from '@/api/types'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import { getBudgetStructure } from '@/api/variables'
import { REPLEval } from 'repl'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'EngagementsList',
  components: {
    Pagination
  }
})

export default class EngagementsList extends Vue {
  @Prop() private title!: string
  @Prop({ required: true }) private displayCreateButton!: boolean
  @Prop() private displayEtatRadio!: boolean
  @Prop({ default: false }) private displayFilter!: boolean
  @Prop() private icon!: string
  @Prop() private tableHeight!: string

  @Prop() private periode!: any[]
  @Prop() private libelle!: string
  @Prop() private ligne!: string
  @Prop() private rubrique!: string
  @Prop() private chapitre!: string
  @Prop() private etat!: string
  @Prop() private statut!: string
  @Prop() private nature!: string
  @Prop() private type!: string
  @Prop() private saisisseur!: string
  @Prop() private valideur_first!: string
  @Prop() private valideur_second!: string
  @Prop() private valideur_final!: string

  private initiatedEngagements: IEngagementData[] = []
  private listLoading = true
  private canCreateEngagement = true
  private paginationTotal = 0
  private listQuery: Record<string,any> = {
    page: 1,
    limit: 30
  }

  /** Radio Button variables */
  private etatLibelle = 'Initiés'
  private libelleEtat: Record<string, any> = {
    'INIT' : {libelle: 'Initiés'},
    'PEG' : {libelle: 'Pré Engagés'},
    'IMP' : {libelle: 'Imputés'},
    'APUR' : {libelle: 'Apurés'},
    'CLOT' : {libelle: 'Clôturés'},
  }

  private etatsLibelle: Record<string, any> = {
    'Initiés': {code: 'INIT', title: 'Pré engagements initiés'},
    'Pré Engagés': {code: 'PEG', title: 'Liste des Pré engagements'},
    'Imputés': {code: 'IMP', title: 'Engagements imputés'},
    'Apurés': {code: 'APUR', title: 'Engagements apurés'},
    'Clôturés': {code: 'CLOT', title: 'Pré engagements clôturés'}
  }

  private etatChange() {
    this.etat = this.etatsLibelle[this.etatLibelle].code
    this.title = this.etatsLibelle[this.etatLibelle].title
    // this.$router.push({ name: 'EngagementList', params: { etat: this.etat } })
  }

  /** Cascader variables */
  private domain = 'Fonctionnement'
  private chapitresOptions: any = AppModule.budgetStructure.fonctionnement
  private cascade: number[] = []

  /** Dialog Form Variables */
  // Add rules validation on the form to prevent incorrect submissions
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
    ligne_id: 0
  }

  private tageffect = {
    INIT: {
      NEW: { type: 'info', effect: 'plain' },
      SAISI: { type: 'info', effect: 'plain' },
      VALIDP: { type: 'info', effect: 'plain' },
      VALIDS: { type: 'info', effect: 'light' },
      VALIDF: { type: 'info', effect: 'dark' }
    },
    PEG: {
      NEW: { type: '', effect: 'plain' },
      SAISI: { type: '', effect: 'plain' },
      VALIDP: { type: '', effect: 'plain' },
      VALIDS: { type: '', effect: 'light' },
      VALIDF: { type: '', effect: 'dark' }
    },
    IMP: {
      NEW: { type: 'success', effect: 'plain' },
      SAISI: { type: 'success', effect: 'plain' },
      VALIDP: { type: 'success', effect: 'plain' },
      VALIDS: { type: 'success', effect: 'light' },
      VALIDF: { type: 'success', effect: 'dark' }
    },
    APUR: {
      NEW: { type: 'success', effect: 'plain' },
      SAISI: { type: 'success', effect: 'plain' },
      VALIDP: { type: 'success', effect: 'plain' },
      VALIDS: { type: 'success', effect: 'light' },
      VALIDF: { type: 'success', effect: 'dark' }
    },
    CLOT: {
      SAISI: { type: 'danger', effect: '' },
      VALIDP: { type: 'danger', effect: '' },
      VALIDS: { type: 'danger', effect: '' },
      VALIDF: { type: 'danger', effect: '' }
    }
  }

  created() {
    this.getEngagements()
    this.initializeVariables()
    this.chapitresOptions = AppModule.budgetStructure[this.domain.toLowerCase()]
    console.log('tableHeigh', this.tableHeight)
  }

  mounted() {
    this.$watch('etat', etat => {
      console.log('etat ', etat, '-', this.etat, '-')
      this.getEngagements()
      this.initializeVariables()
    }, { immediate: true })
  }

  private initializeVariables() {
    this.canCreateEngagement = this.hasPermission(PermissionModule.permissionCodes.engagement.INIT.SAISI)
  }

  private hasPermission(permission: string) {
    return UserModule.permissions.filter(item => item.code === permission).length > 0
  }

  detail(value: any, engagement: any) {
    this.$router.push({ name: 'DetailEngagement', params: { id: engagement.id } })
  }

  deleteRow(index: any, rows: any) {
    rows.splice(index, 1)
  }

  numFormatter(value: any, row: any, column: any) {
    return column ? column.toLocaleString() : column
  }

  dateFormatter(value: any, row: any, column: any) {
    const currentDatetime = new Date(column)
    const formattedDate = currentDatetime.getDate() +
      '/' + (currentDatetime.getMonth() + 1) +
      '/' + currentDatetime.getFullYear() +
      ' ' + currentDatetime.getHours() + ':' + currentDatetime.getMinutes()
    return formattedDate
  }

  private async getEngagements() {
    this.listLoading = true
    
    this.listQuery.periode = this.periode
    this.listQuery.libelle = this.libelle
    this.listQuery.ligne = this.ligne
    this.listQuery.rubrique = this.rubrique
    this.listQuery.chapitre = this.chapitre
    this.listQuery.etat = this.etat
    this.listQuery.statut = this.statut
    this.listQuery.nature = this.nature
    this.listQuery.type = this.type
    this.listQuery.saisisseur = this.saisisseur
    this.listQuery.valideur_first = this.valideur_first
    this.listQuery.valideur_second = this.valideur_second
    this.listQuery.valideur_final = this.valideur_final
    
    console.log('listQuery ', this.listQuery)

    const response = await getEngagements(this.listQuery)
    this.paginationTotal = response.total
    console.log('paginationTotal ', this.paginationTotal)
    this.initiatedEngagements = response.data
    this.listLoading = false
  }

  private domainChange() {
    this.chapitresOptions = AppModule.budgetStructure[this.domain.toLowerCase()]
  }

  private cascadeChange() {
    console.log(this.cascade)
    this.formAttributeChange()
    this.engagement.ligne_id = this.cascade === null ? 0 : this.cascade[2]
  }

  private resetEngagement() {
    this.engagement = {
      montant_ht: null,
      montant_ttc: 0,
      nature: '',
      type: '',
      devise: 'XAF',
      ligne_id: 0
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

  private createEngagement() {
    this.dialogFormLoading = true
    console.log('this.engagement : ', this.engagement)
    createEngagement(this.engagement).then((response) => {
      const newEngagement = response.data
      this.initiatedEngagements.push(newEngagement)
      this.initiatedEngagements.sort((a, b) => b.id - a.id)
      this.resetEngagement()
      this.submitDisabled = true
      this.dialogFormLoading = false
      this.dialogFormVisible = false
    })
  }

  private changeMontantHT(value: number) {
    this.engagement.montant_ttc = Math.ceil(value * (1 + this.tva / 100))
    this.formAttributeChange()
  }

  private formAttributeChange() {
    this.submitDisabled = false
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
