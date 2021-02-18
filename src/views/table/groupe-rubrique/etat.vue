<template>
    <div>
        <entreprise-nav-bar/>
        <groupe-rubrique/>
    </div>
</template>

<script lang="ts">

import {Vue, Component} from 'vue-property-decorator'
import FiltreEtats from '@/components/FiltreEtats/index.vue'
import GroupeRubrique from './index.vue'
import EntrepriseNavbar from '@/sublayouts/etatslayout/components/EntrepriseNavBar/index.vue'

@Component({
      name: 'EtatsView',
      components: {
        GroupeRubrique,
        EntrepriseNavbar
      }
    })

export default class extends Vue {
    
}
</script>