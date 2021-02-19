<template>
  <div class="app-container">
    
    <div v-for="groupe in (groupeRecapData, index)"
        :key="groupe.id"
        @click="handleGroupClicked(group)">
    >
      <custom-table :recapData="fonctionnementData"/>
    </div> 
    
</template>

<script lang="ts">


import { Component, Vue } from 'vue-property-decorator'
import { getRecapSousSectionFonctionnement } from '@/api/sousSectionFonctionnement'
import { ISousSectionFonctionnement } from '@/api/types'
import CustomTable from './groupe-rubrique/components/SummaryTable.vue'
import { IRecapData, IMonthRecapData, IMonthRecapCollection } from '@/api/types'
import {getSectionRecapData, defaultRecapData} from '@/api/recapData'
import {FiltreEtatsModule as etatsmodule, periodes} from '@/store/modules/filtre-etats'

@Component({
  name: 'EtatsEntreprise',
  components:{
    CustomTable,
  }
})

export default class extends Vue {
    private groupeRecapData : IRecapData [] = []
}