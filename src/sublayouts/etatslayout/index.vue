<template>
  <div>
    <EtatNavBar :domaine="domaine"/>
    <!-- <h1>NOTHING MEANS NOTHING</h1> -->
    <router-view />
  </div>
</template>

<script lang="ts">
import { EtatNavBar } from './components'
import { Component, Vue } from 'vue-property-decorator'

    @Component({
      name: 'EtatsLayout',
      components: { // this comment
        EtatNavBar,
      }
    })

export default class extends Vue {
  private domaine:string = ""

  created(){
    const path = this.$router.currentRoute.path
    this.domaine = path.split("/")[2]
    console.log("domaine found")
    console.log(this.domaine)
  }
}
</script>
