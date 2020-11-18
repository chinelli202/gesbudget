<template>
  <div class="app-container">
    <h4>Recapitulatif {{recapData.header.labelLabel}}</h4>
    <el-table
      :data="recapData.collection"

      border
      style="width: 100%"
    >
      <el-table-column
        prop="libelle"
        :label="recapData.header.labelLabel"
        width="180"
      />
      <el-table-column
        prop="realisations"
        :label="recapData.header.realisationsLabel"
      />
      <el-table-column
        prop="realisationsMois"

        :label="recapData.header.realisationsMoisLabel"
      />
      <el-table-column
        prop="realisationsMoisPrecedents"

        :label="recapData.header.realisationsMoisPrecedentsLabel"
      />
      <el-table-column
        prop="engagements"

        :label="recapData.header.engagementsLabel"
      />
      <el-table-column
        prop="execution"

        :label="recapData.header.executionLabel"
      />
      <el-table-column
        prop="solde"

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
        <el-button
          type="primary"
          size="mini"
          @click="handleDetails(row)"
        >
          {{ $t('table.edit') }}
        </el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'
import { getGroupeFonctionnement } from '@/api/groupeFonctionnement'
import { IGroupeFonctionnement, IRecapData } from '@/api/types'

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
  private async getGroup() {
    
  }

  private handleDetails(row:number) {
    
  }
}

</script>
