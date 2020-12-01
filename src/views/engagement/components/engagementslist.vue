<template>
  <div>
    <el-row
      type="flex"
      justify="space-between"
      style="margin: 0.5em 0px"
    >
      <el-col :span="10">
        <h1 
          v-if="showTitle"
          style="margin-top: 0px">
          {{ libelleEtat[etat].title }}
        </h1>
        <span v-else>
          .
        </span>
      </el-col>
      <el-col :span="10">
        
      </el-col>
      <el-col
        v-if="canCreateEngagement && displayCreateButton"
        :span="9"
        :offset="7"
      >
        <el-button-group>
      
          <el-button
            :disabled="!canCreateEngagement || !displayCreateButton"
            type="primary"
            icon="el-icon-edit"
            @click="launchDialogForm"
          >
            Créer un engagement
          </el-button>
          <el-button
            @click="console.log('Exporter')"
          >
            Exporter la liste <i class="el-icon-download el-icon-right"></i>
          </el-button>
        </el-button-group>
      </el-col>
      <el-col
        v-else
        :span="4"
        :offset="9"
      >
        <el-button-group>
          <el-button
            @click="console.log('Exporter')"
          >
            Exporter la liste <i class="el-icon-download el-icon-right"></i>
          </el-button>
        </el-button-group>
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
import { Component, Vue, Prop, Watch} from 'vue-property-decorator'
import { getEngagements, createEngagement } from '@/api/engagements'
import { IEngagementData } from '@/api/types'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'
import { getBudgetStructure } from '@/api/variables'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'EngagementsList',
  components: {
    Pagination
  }
})

export default class EngagementsList extends Vue {
  @Prop() private title!: string
  @Prop({ default : true }) private showTitle!: boolean
  @Prop() private displayEtatRadio!: boolean
  @Prop({ required: true }) private displayCreateButton!: boolean
  @Prop({ default: false }) private displayFilter!: boolean
  @Prop() private icon!: string
  @Prop() private tableHeight!: string

  @Prop() private periode!: any[]
  @Prop() private libelle!: string
  @Prop() private lignes!: string
  @Prop() private rubriques!: string
  @Prop() private chapitres!: string
  @Prop() private etat!: string
  @Prop() private statut!: string
  @Prop() private nature!: string
  @Prop() private type!: string
  @Prop() private saisisseurs!: string
  @Prop() private valideursP!: string
  @Prop() private valideursS!: string
  @Prop() private valideursF!: string

  private initiatedEngagements: IEngagementData[] = []
  private listLoading = true
  private canCreateEngagement = true
  private paginationTotal = 0
  private listQuery: Record<string,any> = {
    page: 1,
    limit: 30
  }

  private libelleEtat: Record<string, any> = {
    'INIT' : {libelle: 'Initiés', title: 'Pré engagements initiés'},
    'PEG' : {libelle: 'Pré Engagés', title: 'Liste des Pré engagements'},
    'IMP' : {libelle: 'Imputés', title: 'Engagements imputés'},
    'APUR' : {libelle: 'Apurés', title: 'Engagements apurés'},
    'CLOT' : {libelle: 'Clôturés', title: 'Pré engagements clôturés'},
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
    ligne_id: 0,
    rubrique_id: 0,
    chapitre_id: 0
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

  @Watch('etat')
  @Watch('statut')
  @Watch('lignes')
  @Watch('saisisseurs')
  @Watch('valideursP')
  @Watch('valideursS')
  @Watch('valideursF')
  private updateView(newVal: any) {
    console.log(newVal)
    this.getEngagements()
    this.initializeVariables()
  }

  mounted() {
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
    
    if (this.periode) {
      this.listQuery.periode = this.periode
    } else {
      delete this.listQuery.periode
    }
    if (this.libelle) {
      this.listQuery.libelle = this.libelle
    } else {
      delete this.listQuery.libelle
    }
    if (this.lignes) {
      this.listQuery.lignes = this.lignes
    } else {
      delete this.listQuery.lignes
    }
    if (this.rubriques) {
      this.listQuery.rubriques = this.rubriques
    } else {
      delete this.listQuery.rubriques
    }
    if (this.chapitres) {
      this.listQuery.chapitres = this.chapitres
    } else {
      delete this.listQuery.chapitres
    }
    if (this.etat) {
      this.listQuery.etat = this.etat
    } else {
      delete this.listQuery.etat
    }
    if (this.statut) {
      this.listQuery.statut = this.statut
    } else {
      delete this.listQuery.statut
    }
    if (this.nature) {
      this.listQuery.nature = this.nature
    } else {
      delete this.listQuery.nature
    }
    if (this.type) {
      this.listQuery.type = this.type
    } else {
      delete this.listQuery.type
    }
    if (this.saisisseurs) {
      this.listQuery.saisisseurs = this.saisisseurs
    } else {
      delete this.listQuery.saisisseurs
    }
    if (this.valideursP) {
      this.listQuery.valideurs_first = this.valideursP
    } else {
      delete this.listQuery.valideurs_first
    }
    if (this.valideursS) {
      this.listQuery.valideurs_second = this.valideursS
    } else {
      delete this.listQuery.valideurs_second
    }
    if (this.valideursF) {
      this.listQuery.valideurs_final = this.valideursF
    } else {
      delete this.listQuery.valideurs_final
    }
    
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
    this.engagement.rubrique_id = this.cascade === null ? 0 : this.cascade[1]
    this.engagement.chapitre_id = this.cascade === null ? 0 : this.cascade[0]
  }

  private resetEngagement() {
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
