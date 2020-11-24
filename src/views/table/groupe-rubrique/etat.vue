<template>
    <div>
        <filtre-etats/>
        <groupe-rubrique/>
    </div>
</template>

<script lang="ts">

import {Vue, Component} from 'vue-property-decorator'
import FiltreEtats from '@/components/FiltreEtats/index.vue'
import GroupeRubrique from './index.vue'

@Component({
      name: 'EtatsView',
      components: {
        GroupeRubrique,
        FiltreEtats
      }
    })

export default class extends Vue {
    
}
</script>