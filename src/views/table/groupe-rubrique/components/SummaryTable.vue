<template>
  <div class="app-container">
    <el-row>
        <el-col :span="12"><div class="grid-content bg-purple"><h3>Récapitulatif {{recapData.header.name}}</h3></div></el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light" style="margin-top:10px; float:right ">
            <el-button @click="handleExporter">
              Exporter
              <i class="el-icon-download"></i>
            </el-button>
          </div>
        </el-col>
    </el-row>


    <el-table
      :data="recapData.collection"

      border
      
      show-summary
      style="width: 100%"
    >
      <el-table-column
        prop="libelle"
        :label="recapData.header.labelLabel"
        width="280"
      />
      <el-table-column
        prop="prevision"
        :label="recapData.header.previsionsLabel"
      />
      <el-table-column v-if="isPeriodeJour"
        prop="realisationsMois"

        :label="recapData.header.realisationsMoisLabel"
      />
      <el-table-column v-if="isPeriodeJour"
        prop="realisationsMoisPrecedents"

        :label="recapData.header.realisationsMoisPrecedentsLabel"
      />
      <el-table-column label-class-name="wrapper"
      
        prop="realisations"
        :label="recapData.header.realisationsLabel"
      >
      <template slot-scope="{row}">
          
            {{ row.realisations }}
        </template>
      </el-table-column>
      <el-table-column style="word-wrap: break-word; "
        prop="engagements"

        :label="recapData.header.engagementsLabel"
      />  
      <el-table-column
        prop="execution"

        :label="recapData.header.executionLabel"
      />
      <el-table-column
        prop="solde" v-if="isPeriodeJour"

        :label="recapData.header.soldeLabel"
      />
      <el-table-column
        prop="tauxExecution"

        :label="recapData.header.tauxExecutionLabel"
      >
          <template slot-scope="{row}">
            <el-progress :percentage="row.tauxExecution" />
          </template>
      </el-table-column>
      <el-table-column
        prop="amount3"
        label="Actions"
      >
      <template slot-scope="{row}">
          
        <el-button
          type="primary"
          size="mini"
          @click="handleDetails(row)"
        >
          {{ $t('table.details') }}
        </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { getGroupeFonctionnement } from '@/api/groupeFonctionnement'
import { IGroupeFonctionnement, IRecapData } from '@/api/types'
import {FiltreEtatsModule as etatsmodule, periodes} from '@/store/modules/filtre-etats'

  @Component({
    name: 'CustomTable'
  })

  export default class extends Vue {
  @Prop() private recapData!: IRecapData
  private group = {}
  private listQuery = {
    page: 1,
    limit: 10
  }
  private headerPrevision:string = ""

  @Watch('recapData', { immediate: true, deep: true })
  onRecapDataChanged(val: IRecapData, oldVal: IRecapData) {
    this.setPeriods()
    this.headerPrevision = this.recapData.header.previsionLabel
  }

  private isPeriodeJour: boolean = true
  private isPeriodeMois: boolean = false
  private isPeriodeIntervalle: boolean = false
  
  private async getGroup() {
    
  }

  private handleDetails(row:any) {
    
    const chosenEntity = row.type
    const chosenEntityId = row.id
    
    const path = this.$router.currentRoute.path
    var domaine = path.split("/")[2]
    
    var routename
    if(domaine == 'fonctionnement')
    routename = 'element-fonctionnement'
    if(domaine == 'mandat')
    routename = 'element-mandat'
      
      // console.log("at this point, the component will navigate to : " + this.chosenEntity + " with the index : " + this.chosenEntityId) 
      // var url = "/tab/custom/fonctionnement/" + this.chosenEntity + "/" + this.chosenEntityId;
    //  this.$router.push(url);
    this.$router.push({ name: routename, params: { entitytype: chosenEntity, entitykey: String(chosenEntityId) } })
  }

  private styleHeader(){
    return {'color':"#000eee", 'word-wrap': "break-word"  }
  }

  created(){
    this.setPeriods()
    this.headerPrevision = this.recapData.header.previsionLabel
  }

  updated(){

  }

  private setPeriods(){
    this.isPeriodeJour = etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY
    this.isPeriodeMois = etatsmodule.periode == periodes.MOIS || etatsmodule.periode == periodes.CEMOIS
    this.isPeriodeIntervalle = etatsmodule.periode == periodes.INTERVALLE
  }

  private getSummaries(param : any) {
        const { columns, data } = param;
        const sums :any [] = [];
        columns.forEach((column : any, index : any) => {
          if (index === 0) {
            sums[index] = 'Total';
            return;
          }
          const values = data.map((item:any) => Number(item[column.property]));
          if (!values.every((value:any) => isNaN(value))) {
            sums[index] = values.reduce((prev:any, curr:any) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0) + ' FCFA';
          } else {
            sums[index] = 'N/A';
          }
        });
        return sums;
  }

  private handleExporter(){

    const periode = (etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY) ? periodes.JOUR : 
      (etatsmodule.periode == periodes.MOIS || etatsmodule.periode == periodes.CEMOIS)?periodes.MOIS:
      (etatsmodule.periode == periodes.INTERVALLE)?periodes.INTERVALLE:'rapport_mensuel';
    
    const param = (etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY) ? etatsmodule.jourPeriodeJour : 
      etatsmodule.moisPeriodeMois

    const path = this.$router.currentRoute.path
    let checkgeneraux = path.split("/")[3]
    
    let url = ""
    if(checkgeneraux == "generaux"){
      const name = this.recapData.header.name;
      const section = name.split(" - ")[0]
      const domaine = name.split(" - ")[1]
      
      window.location.href = 'http://localhost:8000/api/export/section/'+section+'/'+domaine+'?' //window.location.href
            +'critere='+periode+'&'
            +'param='+param+'&'
            +'mois='+etatsmodule.moisPeriodeMois+'&'
            +'startmonth='+etatsmodule.debutPeriodeIntervalle+'&'
            +'endmonth='+etatsmodule.finPeriodeIntervalle
    }
    else{
      const entitytype = this.$route.params && this.$route.params.entitytype
      const entitykey = this.$route.params && this.$route.params.entitykey
      window.location.href = 'http://localhost:8000/api/export/'+entitytype+'/'+entitykey+'?'
            +'critere='+periode+'&'
            +'param='+param+'&'
            +'mois='+etatsmodule.moisPeriodeMois+'&'
            +'startmonth='+etatsmodule.debutPeriodeIntervalle+'&'
            +'endmonth='+etatsmodule.finPeriodeIntervalle
    }

    console.log("will route to : ", url)
  }
}

</script>

<style>

.wrapper{
  word-break: break-word;
}
</style>