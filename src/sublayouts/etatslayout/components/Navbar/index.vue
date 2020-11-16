<template>
  <div
    class="etatnavbar"
    name="etatnavbar"
  >
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <!-- <router-link to="/tab/custom/generaux">
        <el-menu-item index="1">Général</el-menu-item>
      </router-link> -->
      <el-submenu index="1">
        <template slot="title">
          Général
        </template>
        <router-link to="/tab/custom/generaux">
          <el-menu-item index="2-1">
            Général
          </el-menu-item>
        </router-link>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          Dépenses
        </template>
        <!-- <router-link to="/tab/custom/rubrique/chargespersonnel"> -->
        <router-link to="/tab/custom/grouperubrique/chargespersonnel">
          <!-- <router-link :to="{name: 'depenses.grouperubrique', params: {groupname: 'chargespersonnel'}}"> -->
          <el-menu-item index="2-1">
            Charges de personnel
          </el-menu-item>
        </router-link>

        <!-- <router-link :to="{name: 'depenses.grouperubrique', params: {groupname: 'missions'}}"> -->
        <router-link to="/tab/custom/grouperubrique/missions">
          <el-menu-item index="2-2">
            Missions
          </el-menu-item>
        </router-link>

        <el-menu-item index="2-4">
          Diverses Représentations
        </el-menu-item>
        <el-menu-item index="2-5">
          Charges diverses de fonctionnement
        </el-menu-item>
        <el-menu-item index="2-6">
          Honoraires
        </el-menu-item>
        <el-menu-item index="2-7">
          Dons - subventions
        </el-menu-item>
        <el-menu-item index="2-8">
          Formation
        </el-menu-item>
        <el-menu-item index="2-9">
          Imprévus
        </el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">
            item quatre
          </template>
          <el-menu-item index="2-4-1">
            item un
          </el-menu-item>
          <el-menu-item index="2-4-2">
            item deux
          </el-menu-item>
          <el-menu-item index="2-4-3">
            item trois
          </el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="3">
        Recettes
      </el-menu-item>
      <el-menu-item index="4">
        <a
          href="https://www.ele.me"
          target="_blank"
        >Commandes</a>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
  @Component({
    name: 'EtatNavbar',
    components: {}
  })
export default class extends Vue {

private activeIndex2 : any = "dd"

  private handleSelect(){

  }
}

</script>
