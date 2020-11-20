<template>
  <div class="dashboard-editor-container">
    <!-- Panel Group -->
    <navigateur-etats/>
    <h3>Budget {{recapData.header.name}}</h3>
    <panel-group :recapData="recapData" @handleSetLineChartData="handleSetLineChartData" />
    <!-- Bar Chart, Line Chart -->
    <el-row :gutter="8">
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
      >
        <bar-chart :recapMonths="monthsRecapCollection"/>  
      </el-col>
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}">
        <line-chart :chart-data="lineChartData" />
      </el-col>
    </el-row>
    <!-- Summary Table -->
    <summary-table :recapData="recapData"/>
  </div>
</template>

<script lang="ts">

import { Component, Vue, Watch } from 'vue-property-decorator'
import SummaryTable from './components/SummaryTable.vue'
import PanelGroup from './components/PanelGroup.vue'
import LineChart, { ILineChartData } from './components/LineChart.vue'
import BarChart from './components/BarChart.vue'
import {getRecapData, defaultRecapData, getMonthsRecapCollection, defaultMonthRecapCollection} from '@/api/recapData'
import NavigateurEtats from '@/components/NavigateurEtats/index.vue'
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
        NavigateurEtats,
      }
    })

export default class extends Vue {
    private lineChartData = lineChartData

    private handleSetLineChartData(type: string) {
      //this.lineChartData = lineChartData[type]
    }

    private recapData: IRecapData = defaultRecapData
    private monthsRecapCollection: IMonthRecapCollection = defaultMonthRecapCollection
    
    private listQuery = {
      critere: 'jour',
      param: '2020-06-12',
      startmonth:1,
      endmonth:6
    }

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
    created() {
      this.getRecapData()
      this.getMonthRecapCollection()
      console.log("nigga say hooo " + this.monthsRecapCollection)
      //this.$store.watch((FiltreEtatsModule)=>{console.log("filtre module change catched by watcher")},(val)=>{})
      console.log("my property, ",this.getproprieteRecap)
    }

    private getRecapData() {
      // const id = this.$route.params && this.$route.params.id
      console.log("getRecapData")
      const entitytype = this.$route.params && this.$route.params.entitytype
      const entitykey = this.$route.params && this.$route.params.entitykey
      getRecapData(entitytype, entitykey,  this.listQuery).then((response) => {
        this.recapData = response.data
      })
      //toggle the entity type and load the appropriate data
    }

    private getMonthRecapCollection(){
      const entitytype = this.$route.params && this.$route.params.entitytype
      const entitykey = this.$route.params && this.$route.params.entitykey
      this.listQuery.critere= 'intervalle'
      getMonthsRecapCollection(entitytype, entitykey,  this.listQuery).then((response) => {
        //toggle the entity type and load the appropriate data
        this.$nextTick()
        // if(response.data.months == undefined)  
        //   console.log("this homie is undefined")
        // else 
        //   console.log("this homie is definetely defined and has a size of " + response.data.months.length)
        console.log("data is not null at this point ", response)
        this.monthsRecapCollection = response.data

        //compute linechart data
        var months = this.monthsRecapCollection.months.map((monthrow)=>{
          return monthrow.mois
        })

        console.log("mois : ", months)

        var executions = this.monthsRecapCollection.months.map((monthrow)=>{
          var sumExecutions = 0
          this.monthsRecapCollection.months.forEach((monthdata)=>{
            if(monthdata.mois <= monthrow.mois){
              sumExecutions += monthdata.execution
            }
          })
          return sumExecutions
        })

        console.log("executions : ", executions)

        var engagements = this.monthsRecapCollection.months.map((monthrow)=>{
          var sumEngagements = 0
          this.monthsRecapCollection.months.forEach((monthdata)=>{
            if(monthdata.mois <= monthrow.mois){
              sumEngagements += monthdata.engagements
            }
          })
          return sumEngagements
        })

        console.log("engagements : ", engagements)

        this.lineChartData = {months: months, executions: executions, engagements: engagements}

      })
    }
}

</script>
