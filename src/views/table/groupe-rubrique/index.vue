<template>
  <div class="dashboard-editor-container">
    <!-- Panel Group -->
    <!-- <h2>this is me having fun {{funnyProp}}</h2> -->
    
    <el-row>
        <el-col :span="12"><div class="grid-content bg-purple"><h3>Budget {{recapData.header.name}} - {{periodeLabel}}</h3></div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light" style="margin-top:15px"><filtre-etats @filter-refreshed="handleFiltreRefreshed"/></div></el-col>
    </el-row>
    <panel-group :recapData="recapData" @handleSetLineChartData="handleSetLineChartData" />
    <!-- Bar Chart, Line Chart -->
    <el-row :gutter="8">
      <el-col :offset="chartOffset" :span="12"
        
      >
        <bar-chart :recapMonths="monthsRecapCollection"/>  
      </el-col>
      <el-col :offset="chartOffset" :span="12"
        >
        <line-chart :chart-data="lineChartData" v-if="isPeriodeJour"/>
      </el-col>
      <!-- <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}">
        <line-chart :chart-data="lineChartData" v-if="isPeriodeJour"/>
      </el-col> -->
    </el-row>
    <!-- Summary Table -->
    <summary-table v-if="recapData.type && recapData.type!= 'ligne'" :recapData="recapData"/>
    <h3 v-if="recapData.type == 'ligne'" class="box-card">Récapitulatif</h3>
    <el-card v-if="recapData.type == 'ligne'" class="box-card">
      <el-row>
        <el-col span="8">
          <span style="font-weight: bold;">{{recapData.header.previsionsLabel}}</span>
        </el-col>
        <el-col span="8">
          <span>{{recapData.prevision.toLocaleString("fr-FR")}}</span>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col span="8">
          <span style="font-weight: bold;">{{recapData.header.realisationsMoisLabel}}</span>
        </el-col>
        <el-col span="8">
          <span>{{recapData.realisationsMois.toLocaleString("fr-FR")}}</span>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col span="8">
          <span style="font-weight: bold;">{{recapData.header.realisationsMoisPrecedentsLabel}}</span>
        </el-col>
        <el-col span="8">
          <span>{{recapData.realisationsMoisPrecedents.toLocaleString("fr-FR")}}</span>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col span="8">
          <span style="font-weight: bold;">{{recapData.header.realisationsLabel}}</span> 
        </el-col>
        <el-col span="8">
          <span>{{recapData.realisations.toLocaleString("fr-FR")}}</span>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col span="8">
          <span style="font-weight: bold;">{{recapData.header.engagementsLabel}}</span>
        </el-col>
        <el-col span="8">
          <span>{{recapData.engagements.toLocaleString("fr-FR")}}</span>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col span="8">
          <span style="font-weight: bold; color:#61A0A8">{{recapData.header.soldeLabel}}</span>
        </el-col>
        <el-col span="8">
          <span style="font-weight: bold;  color:#61A0A8">{{recapData.solde.toLocaleString("fr-FR")}}</span>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col span="8">
          <span style="font-weight: bold;">{{recapData.header.tauxExecutionLabel}}</span>
        </el-col>
        <el-col span="8">
          <el-progress :percentage="recapData.tauxExecution" />
        </el-col>
      </el-row>
      <el-divider></el-divider>
    </el-card>
  
  </div>
</template>

<script lang="ts">

import { Component, Vue, Watch } from 'vue-property-decorator'
import SummaryTable from './components/SummaryTable.vue'
import PanelGroup from './components/PanelGroup.vue'
import LineChart, { ILineChartData } from './components/LineChart.vue'
import BarChart from './components/BarChart.vue'
import FiltreEtats from '@/components/FiltreEtats/index.vue'
import {getRecapData, defaultRecapData, getMonthsRecapCollection, defaultMonthRecapCollection} from '@/api/recapData'
import { IRecapData, IMonthRecapData, IMonthRecapCollection } from '@/api/types'
import {FiltreEtatsModule as etatsmodule, periodes} from '@/store/modules/filtre-etats'
import {Store} from 'vuex'


const lineChartData: ILineChartData = {
  months: [],
  executions: [],
  engagements: []
}

    @Component({
      name: 'GroupeRubrique',
      components: {
        BarChart,
        LineChart,
        PanelGroup,
        SummaryTable,
        FiltreEtats
      }
    }) //97 160 168

export default class extends Vue {
    private lineChartData = lineChartData

    private handleSetLineChartData(type: string) {
      //this.lineChartData = lineChartData[type]
    }

    private recapData: IRecapData = defaultRecapData
    private monthsRecapCollection: IMonthRecapCollection = defaultMonthRecapCollection
    
    private listQuery = {
      critere: 'jour',
      startmonth:1,
      endmonth:6
    }

    private periodeLabel: string = ""
    private isPeriodeJour: boolean = true
    private isPeriodeMois: boolean = false
    private isPeriodeIntervalle: boolean = false
    private chartOffset: number = 0

    public getproprieteRecap() {
      console.log("Etats module was changed,  ", etatsmodule.jourPeriodeJour)
      return etatsmodule.jourPeriodeJour
    }

    @Watch('$store.state.FiltreEtatsModule.periode',{immediate:true})
    private onPeriodeChange(value: string, oldValue: string){
      console.log("watcher captured periode change");
    }

    public get critereParam(): string {
      console.log("etat module has changed for some reason into this" + etatsmodule.periode)
      return etatsmodule.periode
    }

    public get funnyProp() : string{
      this.listQuery.critere = ''
      console.log('slizy homie has tried to change state behind my back')
      return etatsmodule.periode + ' the heck nigga'
    }
    
    created() {
      this.getRecapData()
      this.getMonthRecapCollection()
      this.refreshPeriodeLabel()
      this.setPeriods()
    }

    private getRecapData() {
      let queryParams = this.getQueryParams()
      const entitytype = this.$route.params && this.$route.params.entitytype
      const entitykey = this.$route.params && this.$route.params.entitykey
      getRecapData(entitytype, entitykey,  queryParams).then((response) => {
        this.recapData = response.data
      })
    }

    private getMonthRecapCollection(){
      let queryParams = this.getQueryParams()
      const entitytype = this.$route.params && this.$route.params.entitytype
      const entitykey = this.$route.params && this.$route.params.entitykey
      queryParams.critere = 'intervalle'
      
      getMonthsRecapCollection(entitytype, entitykey,  queryParams).then((response) => {
        this.$nextTick()
        console.log("data is not null at this point ", response)
        this.monthsRecapCollection = response.data

        //compute linechart data
        var months = this.monthsRecapCollection.months.map((monthrow)=>{
          return monthrow.mois
        })

        console.log("mois : ", months)

        var executions = this.monthsRecapCollection.months.map((monthrow, index)=>{
          var sumExecutions = 0
          for(var i = 0; i <= index; i++){
            sumExecutions += this.monthsRecapCollection.months[i].execution
          }
          
          return sumExecutions
        })

        var engagements = this.monthsRecapCollection.months.map((monthrow, index)=>{
          var sumEngagements = 0
          for(var i = 0; i <= index; i++){
            sumEngagements += this.monthsRecapCollection.months[i].engagements
          }
          
          return sumEngagements
        })

        console.log("engagements : ", engagements)

        // var engagements = this.monthsRecapCollection.months.map((monthrow)=>{
        //   var sumEngagements = 0
        //   this.monthsRecapCollection.months.forEach((monthdata)=>{
        //     if(monthdata.mois <= monthrow.mois){
        //       sumEngagements += monthdata.engagements
        //     }
        //   })
        //   return sumEngagements
        // })

        console.log("engagements : ", engagements)

        this.lineChartData = {months: months, executions: executions, engagements: engagements}
      })
    }

    private handleFiltreRefreshed(){
      this.setPeriods()
      this.getRecapData()
      this.getMonthRecapCollection()
      this.refreshPeriodeLabel()
    }

    private refreshPeriodeLabel(){
      const moment = require('moment');
      let m = moment(); 
      if(etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY){
        m = moment(etatsmodule.jourPeriodeJour)
        this.periodeLabel = m.format('D/MM/yyyy')
      }
      if(etatsmodule.periode == periodes.MOIS || etatsmodule.periode == periodes.CEMOIS){
        m.month(etatsmodule.moisPeriodeMois - 1)
        this.periodeLabel = m.format('dd/MM/yyyy')
      }
      if(etatsmodule.periode == periodes.INTERVALLE){
        m.month(etatsmodule.debutPeriodeIntervalle - 1)
        var firstMonth = m.format('MM/yyyy')
        
        m.month(etatsmodule.finPeriodeIntervalle - 1)
        var lastMonth = m.format('MM/yyyy')

        this.periodeLabel = firstMonth + " à " + lastMonth
      }
    }

    private setPeriods(){
    this.isPeriodeJour = (etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY)
    this.isPeriodeMois = (etatsmodule.periode == periodes.MOIS || etatsmodule.periode == periodes.CEMOIS)
    this.isPeriodeIntervalle = etatsmodule.periode == periodes.INTERVALLE
    this.chartOffset = this.isPeriodeJour?0:6
  }

    private getQueryParams(){
      var period = (etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY) ? periodes.JOUR : 
      (etatsmodule.periode == periodes.MOIS || etatsmodule.periode == periodes.CEMOIS)?periodes.MOIS:
      (etatsmodule.periode == periodes.INTERVALLE)?periodes.INTERVALLE:'rapport_mensuel';
    
    var param = (etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY) ? etatsmodule.jourPeriodeJour : 
      etatsmodule.moisPeriodeMois

      var startmonth = etatsmodule.debutPeriodeIntervalle
      var endmonth = etatsmodule.finPeriodeIntervalle
      return {'critere':period, param:param, startmonth:startmonth, endmonth:endmonth}
    }
}

</script>

<style>
.box-card {
    width: 100%;
    margin:20px auto;
  }
.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>