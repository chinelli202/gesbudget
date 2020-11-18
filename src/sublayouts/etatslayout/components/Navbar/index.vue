<template>
  <div
    class="etatnavbar"  
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
      <el-menu-item class="fonctionnement">
        <i class="el-icon-document fonctionnement" ></i> 
        <span class="fonctionnement">Etats Fonctionnement</span>
        <!-- <span></span> Fonctionnement -->
      </el-menu-item> 
      <el-menu-item index="1">
        Général
      </el-menu-item> 
      <el-submenu index="2">
        <template slot="title">
          Dépenses
        </template>
        <!-- <router-link to="/tab/custom/rubrique/chargespersonnel"> -->
          <!-- <router-link :to="{name: 'depenses.grouperubrique', params: {groupname: 'chargespersonnel'}}"> -->
        <!-- <el-menu-item index="2-1">
          Charges de personnel
        </el-menu-item> -->
        <!-- <router-link :to="{name: 'depenses.grouperubrique', params: {groupname: 'missions'}}"> -->
        <!-- <el-menu-item index="2-2">
          Missions
        </el-menu-item> -->
        <el-submenu index="2-4">
          <template slot="title">
            Fonctionnement
          </template>
          <el-menu-item index="2-4-1" @click="handleClick">
            Charges de personnel
          </el-menu-item>
          <el-menu-item index="2-4-2">
            Missions
          </el-menu-item>
          <el-menu-item index="2-4-3">
            Diverses Représentations
          </el-menu-item>
          <el-menu-item index="2-4-4">
            Charges diverses de fonctionnement
          </el-menu-item>
          <el-menu-item index="2-4-5">
            Honoraires
          </el-menu-item>
          <el-menu-item index="2-4-6">
            Dons - subventions
          </el-menu-item>
          <el-menu-item index="2-4-7">
            Formations
          </el-menu-item>
          <el-menu-item index="2-4-8">
            Imprévus
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2-5">
          <template slot="title">
            Investissement
          </template>
          <el-menu-item index="2-5-1">
            Equipements-Immobilisations
          </el-menu-item>
          <el-menu-item index="2-5-2">
            Dépenses d'Hydrocarbures
          </el-menu-item>
          <el-menu-item index="2-5-3">
            Investissements  Financiers
          </el-menu-item>
        </el-submenu>
      </el-submenu>
      
      <el-submenu index="3">
          <template slot="title">
            Recettes
          </template>
          <el-menu-item index="3-1">
            Produits financiers
          </el-menu-item>
          <el-menu-item index="3-2">
            Remboursements prêts
          </el-menu-item>
          <el-menu-item index="3-3">
            Recettes pétrolières 
          </el-menu-item>
          <el-menu-item index="3-4">
            Recettes de la Barge Rio Del Rey
          </el-menu-item>
          <el-menu-item index="3-5">
            Autres recettes
          </el-menu-item>
      </el-submenu>
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

  private handleClick(element: any){
    console.log("this is the instance ", element.index)
  }
}

</script>

<style>

.fonctionnement {
  font-size : 22px;
  color : white; 
  
  padding-bottom: 40px;
  padding-right: 20px;
  display: inline-block;
}
</style>
