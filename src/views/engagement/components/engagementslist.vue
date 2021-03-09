<template>
  <div>
    <el-row
      type="flex"
      justify="space-between"
      style="margin: 0.5em 0px"
    >
      <el-col :span="13">
        <h2 
          v-if="showTitle"
          style="margin-top: 0px">
          {{ title ? title : libelleEtat[etat].title }} 
        </h2>
        <span v-else>
          .
        </span>
      </el-col>
      <el-col :span="10">
        
      </el-col>
      <el-col
        :span="9"
        :offset="6"
      >
        <el-button-group>
          <el-button
            type="success"
            v-if="displayExportButton"
            @click="handleExport"
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
        prop="code"
        label="Code"
        width="120"
      />
      <el-table-column
        fixed
        prop="eng_date"
        :formatter="dateFormatterShort"
        label="Date engagement"
        width="100"
      />
      <el-table-column
        fixed
        prop="latest_edited_at"
        :formatter="dateFormatter"
        label="Dernière mise à jour"
        width="130"
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
        width="345"
      >
        <template slot-scope="scope">
            {{ scope.row.chapitre_libelle }} // {{ scope.row.rubrique_libelle }} // {{ scope.row.ligne_libelle }}
        </template>
      </el-table-column>
      <el-table-column
        prop="montant_ttc"
        :formatter="numFormatter"
        label="Montant TTC"
        width="125"
      />
      <el-table-column
        prop="devise"
        label="Devise"
        width="75"
      />
      
      <el-table-column
        prop="saisisseur_name"
        label="Saisi par"
        width="120"
      />
      <el-table-column
        prop="type"
        label="Type"
        width="75"
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from 'vue-property-decorator'
import { formatJson } from '@/utils'
import { exportJson2Excel } from '@/utils/excel'
import { getEngagements } from '@/api/engagements'
import { getSoldeLigne } from '@/api/lignes'
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
  @Prop({ default: true }) private displayExportButton!: boolean
  @Prop({ default: false }) private displayFilter!: boolean
  @Prop() private icon!: string
  @Prop() private tableHeight!: string

  @Prop() private periode!: any[]
  @Prop() private libelle!: string
  @Prop() private lignes!: string
  @Prop() private rubriques!: string
  @Prop() private chapitres!: string
  @Prop() private etat!: string
  @Prop() private code!: string
  @Prop() private statut!: string
  @Prop() private nature!: string
  @Prop() private type!: string
  @Prop() private saisisseurs!: string
  @Prop() private valideursP!: string
  @Prop() private valideursS!: string
  @Prop() private valideursF!: string
  @Prop() private fallbackPayload!: any

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


  private tageffect = AppModule.tageffect

  created() {
    this.getEngagements()
    this.initializeVariables()
  }

  @Watch('code')
  @Watch('etat')
  @Watch('statut')
  @Watch('lignes')
  @Watch('saisisseurs')
  @Watch('valideursP')
  @Watch('valideursS')
  @Watch('valideursF')
  private updateView(newVal: any) {
    this.getEngagements()
    this.initializeVariables()
  }

  mounted() {
  }

  private initializeVariables() {
    this.canCreateEngagement = this.hasPermission(PermissionModule.permissionCodes.engagement.INIT.SAISI)
  }

  private hasPermission(permission: string) {
    return UserModule.loggedUser.permissions.filter((item: any) => item.code === permission).length > 0
  }
  /** test dd */
  private async handleExport() {
    this.listLoading = true
    const tHeader = ['Code', 'Date', 'Dernière mise à Jour le', 'Etat', 'Statut', 'Libellé', 'Domaine', 'Ligne budgétaire', 'Rubrique du Budget', 'Chapitre du Budget'
                    , 'Devise', 'Montant TTC', 'Cumul des imputations', 'Cumul des apurements', 'Type engagement', 'Saisi par'
                    , 'Saisi le', 'Validé au 1er niveau par', 'Validé au 2nd niveau par', 'Validé au niveau final par']
    const filterVal = ['code', 'eng_date', 'latest_edited_at', 'etat_libelle', 'latest_statut', 'libelle', 'domaine', 'ligne_libelle', 'rubrique_libelle', 'chapitre_libelle'
                    , 'devise', 'montant_ttc', 'cumul_imputations', 'cumul_apurements' ,'type_libelle', 'saisisseur_name'
                    , 'created_at', 'valideurp_name', 'valideurs_name', 'valideurf_name']
    const { page, limit, ...fullQuery } = this.listQuery
    let list: any
    const response = await getEngagements(fullQuery)
    list = response.data
    const fileNameSuffix = Object.keys(fullQuery).reduce((all: string, newKey: string) => {
      return all + '--' + newKey + '_' + fullQuery[newKey]
    }, '')
    const data = formatJson(filterVal, list)
    exportJson2Excel(tHeader, data, 'Liste des engagements '+ fileNameSuffix, undefined, undefined, true, 'xlsx')
    this.listLoading = false
  }

  detail(value: any, engagement: any) {
    this.$router.push({ name: 'engagementDetailView', params: { id: engagement.id , fallbackPayload : this.fallbackPayload} })
  }

  deleteRow(index: any, rows: any) {
    rows.splice(index, 1)
  }

  numFormatter(value: any, row: any, column: any) {
    return column ? column.toLocaleString() : column
  }

  dateFormatterShort(value: any, row: any, column: any) {
    if (column !== undefined && column !== "") {
      var myDate = new Date(column);
      var month = [
        "Jan",
        "Fev",
        "Mar",
        "Avr",
        "Mai",
        "Jun",
        "Jul",
        "Aou",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][myDate.getMonth()];
      let d = myDate.getDate()
      let dd = d<10 ? '0'+d: d
      var str =  dd + " " + month + " " + myDate.getFullYear();
      return str;
    }
    return "";
  }

  dateFormatter(value: any, row: any, column: any) {
    const str = this.dateFormatterShort(value, row, column)
    const myDate = new Date(column)
    let h = myDate.getHours()
    let hh = h<10 ? '0'+h: h
    let m = myDate.getMinutes()
    let mm = m<10 ? '0'+m: m

    const formattedDate = str +
      '|' + hh + ':' + mm
    return formattedDate
  }

  private async getEngagements() {
    this.listLoading = true
    
    if (this.code) {
      this.listQuery.code = this.code
    } else {
      delete this.listQuery.code
    }
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
      this.listQuery.latest_statut = this.statut
    } else {
      delete this.listQuery.latest_statut
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

    getEngagements(this.listQuery).then(response => {
      this.paginationTotal = response.total
      this.initiatedEngagements = response.data
      this.listLoading = false
    })
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
