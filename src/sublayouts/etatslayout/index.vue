<template>
  <div>
    <EtatNavBar />
    <h1>NOTHING MEANS NOTHING</h1>
        <!-- <div>      
          <el-select v-model="value" placeholder="Select">
            <el-option
              v-for="item in filterPeriod"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker slot="append"
            v-model="value1"
            type="date"
            placeholder="Choississez un jour">
          </el-date-picker>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </div> -->
        <!-- <el-input placeholder="Entrez quelque chose" v-model="input2" class="myinput">
        </el-input> -->
              <!-- <template slot="append">.com</template> -->
        
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
