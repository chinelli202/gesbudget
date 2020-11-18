<template>
  <div>
    <EtatNavBar />
    <h1>NOTHING MEANS NOTHING</h1>
    <el-row>
      <el-button plain>Plein</el-button>
      <el-button type="primary" plain>Primary</el-button>
      <el-button type="success" plain>Success</el-button>
    </el-row>
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
