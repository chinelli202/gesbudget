<template>
  <div>
    <EtatNavBar />
    <h1>NOTHING MEANS NOTHING</h1>
    <router-view />
  </div>
</template>

<script lang="ts">
import { EtatNavBar } from './components'
import { Component, Vue } from 'vue-property-decorator'

    @Component({
      name: 'EtatsLayout',
      components: { // this comment
        EtatNavBar
      }
    })

export default class extends Vue {}
</script>
