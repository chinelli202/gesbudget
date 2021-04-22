<template>
  <div class="app-container">
    <!-- <div v-for="groupe in (groupeRecapData, index)"
        :key="groupe.id"
        @click="handleGroupClicked(group)">
    >
      <custom-table :recapData="fonctionnementData"/>-->

    <div>
      <entreprise-nav-bar />
      <custom-table :recap-data="entrepriseData" />
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { getRecapSousSectionFonctionnement } from '@/api/sousSectionFonctionnement'
import { ISousSectionFonctionnement, IRecapData, IMonthRecapData, IMonthRecapCollection } from '@/api/types'
import CustomTable from './groupe-rubrique/components/SummaryTable.vue'

import { UserModule } from '@/store/modules/user'
import { getSectionRecapData, defaultRecapData, getEntrepriseRecapData } from '@/api/recapData'
import { FiltreEtatsModule as etatsmodule, periodes } from '@/store/modules/filtre-etats'
import EntrepriseNavBar from '@/sublayouts/etatslayout/components/EntrepriseNavBar/index.vue'

@Component({
  name: 'EtatsEntreprise',
  components: {
    CustomTable,
    EntrepriseNavBar
  }
})

export default class extends Vue {
    private entrepriseData : IRecapData [] = []

    created() {
      this.getEntrepriseRecapData()
    }

    private getEntrepriseRecapData() {
      const queryParams = this.getQueryParams()
      // load team code from user module
      const code = UserModule.loggedUser.team.entreprise_code
      // const entitytype = this.$route.params && this.$route.params.entitytype
      getEntrepriseRecapData(code, queryParams).then((response) => {
        this.entrepriseData = response.data
      })
    }

    private getQueryParams() {
      var period = (etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY) ? periodes.JOUR
        : (etatsmodule.periode == periodes.MOIS || etatsmodule.periode == periodes.CEMOIS) ? periodes.MOIS
          : (etatsmodule.periode == periodes.INTERVALLE) ? periodes.INTERVALLE : 'rapport_mensuel'

      var param = (etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY) ? etatsmodule.jourPeriodeJour
        : etatsmodule.moisPeriodeMois

      var startmonth = etatsmodule.debutPeriodeIntervalle
      var endmonth = etatsmodule.finPeriodeIntervalle
      return { critere: period, param: param, startmonth: startmonth, endmonth: endmonth }
    }
}
</script>
