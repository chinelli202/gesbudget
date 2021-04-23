<template>
  <div class="container">
    <el-tabs
      tab-position="left"
      style="height: 200px;"
    >
      <el-tab-pane label="User">
        Utilisateur
      </el-tab-pane>
      <el-tab-pane label="Config">
        Config
      </el-tab-pane>
      <el-tab-pane label="Role">
        Rôle
      </el-tab-pane>
      <el-tab-pane label="Task">
        Tâche
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import 'echarts/theme/macarons.js' // Theme used in BarChart, LineChart, PieChart and RadarChart
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'ConfigEngagements',
  components: {

  }
})
export default class extends Vue {
  private tabPosition = 'left'
}
</script>

<style lang="scss" scoped>
.container {
  padding: 1.5em 30px 0px;
}
</style>
