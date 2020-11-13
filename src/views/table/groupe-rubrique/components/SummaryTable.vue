<template>
  <div class="app-container">
    <h4>Chapitres</h4>
    <el-table
      :data="tableData"

      border
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="LIBELLES"
        width="180"
      />
      <el-table-column
        prop="name"
        label="Prévisions 2020"
      />
      <el-table-column
        prop="amount1"

        label="Réalisations du en cours"
      />
      <el-table-column
        prop="amount2"

        label="Réalisations précédentes"
      />
      <el-table-column
        prop="amount3"

        label="Réalisations cumulées à ce jour"
      />
      <el-table-column
        prop="amount3"

        label="Exécution à ce jour"
      />
      <el-table-column
        prop="amount3"

        label="Solde"
      />
      <el-table-column
        prop="amount3"

        label="Taux d'exécution"
      >
        <el-progress :percentage="45" />
      </el-table-column>
      <el-table-column
        prop="amount3"

        label="Actions"
      >
        <el-button
          type="primary"
          size="mini"
          @click="handleDetails(row)"
        >
          {{ $t('table.edit') }}
        </el-button>
      </el-table-column>
    </el-table>
    <p>Displaying data for {{ group.libelle }}</p>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { getGroupeFonctionnement } from '@/api/groupeFonctionnement'
import { IGroupeFonctionnement } from '@/api/types'

@Component({
  name: 'CustomTable'
})

export default class extends Vue {
private group = {}
private listQuery = {
  page: 1,
  limit: 10
}

created() {
  this.getGroup()
}

private async getGroup() {
  // const id = this.$route.params && this.$route.params.id
  const groupename = this.$route.params && this.$route.params.groupename
  const { data } = await getGroupeFonctionnement(groupename, this.listQuery)
  this.group = data
}

data() {
  return {
    tableData: [{
      id: '12987122',
      name: 'Tom',
      amount1: '234',
      amount2: '3.2',
      amount3: 10
    }, {
      id: '12987123',
      name: 'Tom',
      amount1: '165',
      amount2: '4.43',
      amount3: 12
    }, {
      id: '12987124',
      name: 'Tom',
      amount1: '324',
      amount2: '1.9',
      amount3: 9
    }, {
      id: '12987125',
      name: 'Tom',
      amount1: '621',
      amount2: '2.2',
      amount3: 17
    }, {
      id: '12987126',
      name: 'Tom',
      amount1: '539',
      amount2: '4.1',
      amount3: 15
    }]
  }
}
}

</script>
