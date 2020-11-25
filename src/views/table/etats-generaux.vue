<template>
  <div class="app-container">
    
    <div v-if="domaine == 'fonctionnement'">
      <custom-table :recapData="fonctionnementData"/>
    </div> 
    
    <div v-if="domaine == 'fonctionnement'">
      <custom-table :recapData="investissementData"/>
    </div>
    
    <div v-if="domaine == 'mandat'">
      <custom-table :recapData="depenseData"/>
    </div>
    
    <custom-table :recapData="recetteData"/>
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
  name: 'EtatsGeneraux',
  components:{
    CustomTable,
  }
})

export default class extends Vue {
private group = {}
private listQuery = {
  page: 1,
  limit: 10
}

private domaine:string ="fonctionnement"

private listLoading = true
private fonctionnementData: IRecapData = defaultRecapData
private investissementData: IRecapData = defaultRecapData
private depenseData: IRecapData = defaultRecapData
private recetteData: IRecapData = defaultRecapData

created() {
  const path = this.$router.currentRoute.path
  this.domaine = path.split("/")[2]
  this.getRecetteData()
  if(this.domaine == 'fonctionnement'){
     this.getFonctionnementData()
     this.getInvestissementData()   
  }
  else{
    this.getDepenseData()
  }
}

private async getFonctionnementData() {
   this.listLoading = true
  let queryParams = this.getQueryParams()
  //const groupename = this.$route.params && this.$route.params.groupename
  const { data } = await getSectionRecapData('fonctionnement', this.domaine, queryParams)
  this.fonctionnementData = data
  setTimeout(() => {
    this.listLoading = false
  }, 0.5 * 3000)
}

private async getInvestissementData() {
  this.listLoading = true
  let queryParams = this.getQueryParams()
  //const groupename = this.$route.params && this.$route.params.groupename
  const { data } = await getSectionRecapData('investissement', this.domaine, queryParams)
  this.investissementData = data
  setTimeout(() => {
    this.listLoading = false
  }, 0.5 * 3000)
}

private async getRecetteData() {
  this.listLoading = true
  let queryParams = this.getQueryParams()
  //const groupename = this.$route.params && this.$route.params.groupename
  const { data } = await getSectionRecapData('recettes', this.domaine, queryParams)
  this.recetteData = data
  setTimeout(() => {
    this.listLoading = false
  }, 0.5 * 3000)
}

private async getDepenseData() {
  this.listLoading = true
  let queryParams = this.getQueryParams()
  //const groupename = this.$route.params && this.$route.params.groupename
  const { data } = await getSectionRecapData('depenses', this.domaine, queryParams)
  this.depenseData = data
  setTimeout(() => {
    this.listLoading = false
  }, 0.5 * 3000)
}

private getQueryParams(){
      var period = (etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY) ? periodes.JOUR : 
      (etatsmodule.periode == periodes.MOIS || etatsmodule.periode == periodes.CEMOIS)?periodes.MOIS:
      (etatsmodule.periode == periodes.INTERVALLE)?periodes.INTERVALLE:'rapport_mensuel';
    
    var param = (etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY) ? etatsmodule.jourPeriodeJour : 
      etatsmodule.moisPeriodeMois

      var startmonth = etatsmodule.debutPeriodeIntervalle
      var endmonth = etatsmodule.finPeriodeIntervalle
      return {'critere':period, param:param, startmonth:startmonth, endmonth:endmonth}
    }
}

</script>
