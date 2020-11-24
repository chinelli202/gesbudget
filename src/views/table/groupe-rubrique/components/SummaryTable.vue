<template>
  <div class="app-container">
    <h4>Recapitulatif {{recapData.header.labelLabel}}</h4>
    <el-table
      :data="recapData.collection"

      border
      style="width: 100%"
      @header-cell-style="styleHeader"
    >
      <el-table-column
        prop="libelle"
        :label="recapData.header.labelLabel"
        width="180"
      />
      <el-table-column v-if="isPeriodeJour"
        prop="realisationsMois"

        :label="recapData.header.realisationsMoisLabel"
      />
      <el-table-column v-if="isPeriodeJour"
        prop="realisationsMoisPrecedents"

        :label="recapData.header.realisationsMoisPrecedentsLabel"
      />
      <el-table-column 
      
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

  @Watch('recapData', { immediate: true, deep: true })
  onRecapDataChanged(val: IRecapData, oldVal: IRecapData) {
    this.setPeriods()
  }

  private isPeriodeJour: boolean = true
  private isPeriodeMois: boolean = false
  private isPeriodeIntervalle: boolean = false
  
  private async getGroup() {
    
  }

  private handleDetails(row:number) {
    
  }

  private styleHeader(){
    return {'color':"#000eee", 'word-wrap': "break-word"  }
  }

  created(){
    this.setPeriods()
  }

  updated(){

  }

  private setPeriods(){
    this.isPeriodeJour = etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY
    this.isPeriodeMois = etatsmodule.periode == periodes.MOIS || etatsmodule.periode == periodes.CEMOIS
    this.isPeriodeIntervalle = etatsmodule.periode == periodes.INTERVALLE
  }
}

</script>
