<template>

  <div class="app-container">

    <h2>Liste des projets</h2>

    <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="date"
      label="Libelle"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="Description"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="Chapitre / Unité">
    </el-table-column>
    <el-table-column
      prop="address"
      label="Entreprise / Représentation">
    </el-table-column>
  </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

export default class extends Vue {
    data() {
      return {
        tableData: [{
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }, {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }, {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }, {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }]
      }
    }
  }
</script>