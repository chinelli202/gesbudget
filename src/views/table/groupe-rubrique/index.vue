<template>
  <div class="dashboard-editor-container">
    <!-- Panel Group -->
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <!-- Bar Chart, Line Chart -->
    <el-row :gutter="8">
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
      >
        <bar-chart />
      </el-col>
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
      >
        <line-chart :chart-data="lineChartData" />
      </el-col>
    </el-row>
    <!-- Summary Table -->
    <summary-table />
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import SummaryTable from './components/SummaryTable.vue'
import PanelGroup from './components/PanelGroup.vue'
import LineChart, { ILineChartData } from './components/LineChart.vue'
import BarChart from './components/BarChart.vue'

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
        SummaryTable
      }
    })

export default class extends Vue {
    private lineChartData = lineChartData.newVisitis

    private handleSetLineChartData(type: string) {
      this.lineChartData = lineChartData[type]
    }
}

</script>
