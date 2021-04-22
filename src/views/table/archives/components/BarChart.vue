<template>
  <div
    :class="className"
    :style="{height: height, width: width}"
  />
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'
import { IMonthRecapData, IMonthRecapCollection } from '@/api/types'

const animationDuration = 6000

@Component({
  name: 'BarChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '350px' }) private height!: string
  @Prop() private recapMonths!: IMonthRecapCollection

@Watch('recapMonths') onRecapMonthsChanged(value: IMonthRecapCollection, oldValue: IMonthRecapCollection) {
    console.log('data has changed my nigga')
    this.initChart(value)
  }
// Do stuff with the watcher here.

mounted() {
  //   setTimeout(() => {
  //  // this.listLoading = false
  // }, 0.5 * 5000)
  this.$nextTick(() => {
    if (typeof this.recapMonths !== 'undefined' && Object.keys(this.recapMonths).length === 0 && this.recapMonths.constructor === Object) { this.initChart(this.recapMonths) }
  })
}

created() {
  console.log('nigga be like whaaat')
  console.log(this.recapMonths)
  // this.initChart(this.recapMonths)
}

beforeDestroy() {
  if (!this.chart) {
    return
  }
  this.chart.dispose()
  this.chart = null
}

private initChart(recap: IMonthRecapCollection) {
  // console.log("found " + (this.recapMonths.months.length) + " enregistrements")
  // if(typeof this.recapMonths.months === 'undefined'){
  //   console.log("this bar chart homie is undefined")
  // }
  // else console.log("this barchart homie is definetely not undefined")
  // console.log(this.recapMonths)

  const preparedData = this.init_series(recap.months)
  this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
  this.chart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: 10,
      right: 10,
      bottom: 20,
      top: 30,
      containLabel: true
    },
    legend: {
      data: ['Engagements', 'Réalisations', 'Exécution']
    },

    xAxis: [{
      type: 'category',
      data: preparedData.names, // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisTick: {
        alignWithLabel: true
      }
    }],
    yAxis: [{
      type: 'value',
      axisTick: {
        show: false
      }
    }],
    series: [{
      name: 'Engagements',
      type: 'bar',
      // stack: 'vistors',
      // barWidth: '60%',
      data: preparedData.engagements, // [79, 52, 200, 334, 390, 330, 220],
      animationDuration
    }, {
      name: 'Réalisations',
      type: 'bar',
      // stack: 'vistors',
      // barWidth: '60%',
      data: preparedData.realisations, // [80, 52, 200, 334, 390, 330, 220],
      animationDuration
    }, {
      name: 'Exécution',
      type: 'bar',
      // stack: 'vistors',
      // barWidth: '60%',
      data: preparedData.execution, // [30, 52, 200, 334, 390, 330, 220],
      animationDuration
    }]
  } as EChartOption<EChartOption.SeriesBar>)
}

private init_series(monthrecaps : IMonthRecapData[]) {
  const names = monthrecaps.map((mr) => {
    return mr.mois
  })

  const realisations = monthrecaps.map((mr) => {
    return mr.realisations
  })

  const engagements = monthrecaps.map((mr) => {
    return mr.engagements
  })

  const execution = monthrecaps.map((mr) => {
    return mr.execution
  })

  const preparedData = {
    names: names,
    realisations: realisations,
    engagements: engagements,
    execution: execution
  }
  return preparedData
}
}
</script>
