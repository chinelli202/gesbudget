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
        <bar-chart v-if="monthsRecapCollection" :recapMonths="monthsRecapCollection"/>  
      </el-col>
      <!-- <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
      >
        <line-chart :chart-data="lineChartData" />
      </el-col> -->
    </el-row>
    <!-- Summary Table -->
    <summary-table :recapData="recapData"/>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import SummaryTable from './components/SummaryTable.vue'
import PanelGroup from './components/PanelGroup.vue'
import LineChart, { ILineChartData } from './components/LineChart.vue'
import BarChart from './components/BarChart.vue'
import {getRecapData, defaultRecapData, getMonthsRecapCollection} from '@/api/recapData'
import NavigateurEtats from '@/components/NavigateurEtats/index.vue'
import { IRecapData, IMonthRecapData } from '@/api/types'

const lineChartData: { [type: string]: ILineChartData } = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
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
    private lineChartData = lineChartData.newVisitis

    private handleSetLineChartData(type: string) {
      this.lineChartData = lineChartData[type]
    }

    private recapData: IRecapData = defaultRecapData
    private monthsRecapCollection: any
    
    private listQuery = {
      critere: 'jour',
      param: '2020-06-12',
      startmonth:1,
      endmonth:6
    }

    created() {
      this.getRecapData()
      this.getMonthRecapCollection()
      console.log("nigga say hooo" + this.monthsRecapCollection)
    }

    private async getRecapData() {
      // const id = this.$route.params && this.$route.params.id
      const entitytype = this.$route.params && this.$route.params.entitytype
      const entitykey = this.$route.params && this.$route.params.entitykey
      const { data } = await getRecapData(entitytype, entitykey,  this.listQuery)
      //toggle the entity type and load the appropriate data
      this.recapData = data
    }

    private async getMonthRecapCollection(){
      const entitytype = this.$route.params && this.$route.params.entitytype
      const entitykey = this.$route.params && this.$route.params.entitykey
      this.listQuery.critere= 'groupemois'
      const { data } = await getMonthsRecapCollection(entitytype, entitykey,  this.listQuery)
      //toggle the entity type and load the appropriate data
      this.$nextTick()
      if(data.months == undefined)  
        console.log("this homie is undefined")
      else 
        console.log("this homie is definetely defined and has a size of " + data.months.length)
      console.log("data is not null at this point")
      this.monthsRecapCollection = data
    }
}

</script>
