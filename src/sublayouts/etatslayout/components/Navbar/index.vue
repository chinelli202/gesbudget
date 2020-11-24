<template>
  <div
    class="etatnavbar"  
  >
      
    <el-menu
      default-active="1"
      class="el-menu-demo"
      mode="horizontal"
      :background-color="navbarstyles.backgroundColor"
      :text-color="navbarstyles.textColor"
      :active-text-color="navbarstyles.activeTextColor"
   >
      <!-- <router-link to="/tab/custom/generaux">
        <el-menu-item index="1">Général</el-menu-item>
      </router-link> -->
      <el-menu-item class="fonctionnement">
        <i class="el-icon-document fonctionnement" ></i> 
        <span class="fonctionnement">Etats {{navTitle}}</span>
        <!-- <span></span> Fonctionnement -->
      </el-menu-item> 
      <el-menu-item index="1">
        Général
      </el-menu-item> 
      <el-submenu 
      v-if="domaine == 'fonctionnement'"
      index="2">
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
      <el-submenu 
      
      v-else
      index="18">
          <template slot="title">
            Depenses
          </template>
          <el-menu-item 
          v-for="chapitre in depensesMap"
          :key="chapitre.value"
          :index="chapitre.value"
          @click="handleDepensesClick"
          >
            {{chapitre.label}}
          </el-menu-item>
      </el-submenu>
      <el-submenu index="13">
          <template slot="title">
            Recettes
          </template>
          <el-menu-item 
          v-for="chapitre in recettesMap"
          :key="chapitre.value"
          :index="chapitre.value"
          @click="handleRecettesClick"
          >
            {{chapitre.label}}
          </el-menu-item>
      </el-submenu>
      <el-menu-item @click="handleNavigate">
        Aller à...
      </el-menu-item>
      <el-menu-item @click="handleExporter">
        <i class="el-icon-download"></i>
        <span>Exporter</span> 
      </el-menu-item>
    </el-menu>

    <el-dialog :visible.sync="dialogTableVisible">
       <navigateur-etats :maquetteTree="maquetteTree" @exit-navigateur-dialog="handleExitDialogEventRecieved"/>
       
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import NavigateurEtats from '@/components/NavigateurEtats/index.vue'
import {FiltreEtatsModule as etatsmodule, periodes} from '@/store/modules/filtre-etats'
import {getFonctionnementTree, getMandatTree} from '@/api/maquetteTree'
  

  @Component({
    name: 'EtatNavbar',
    components: {
      NavigateurEtats
    }
  })

export default class extends Vue {
@Prop({ default: 'fonctionnement' }) private domaine!: string
private navTitle:String = "Fonctionnement"
private activeIndex2 : any = "dd"
private input2 : string = ""
private dialogTableVisible: boolean = false
private recettesTree:any = {}
private depensesTree: any = {}
private listQuery = {
  id:1,
  size:10
}

private navbarstyles: any = {
  backgroundColor:"",
  textColor:"",
  activeTextColor:""
}

private depensesMap: any [] = []
private recettesMap: any [] = []


private maquetteTree : any = {}
  
  created(){
    //set nav title and styling
    this.navTitle = this.domaine == 'fonctionnement'? "Fonctionnement":"Mandat"

    this.paramNavTree()
    //get NavTree and pass it as prop
  }

  private async paramNavTree(){
    if(this.domaine=='fonctionnement'){
      this.navTitle = "Fonctionnement"
      const {data} = await getFonctionnementTree(this.listQuery)
      this.maquetteTree = data
      
      this.navbarstyles.backgroundColor = "#545c64"
      this.navbarstyles.textColor = "#fff"
      this.navbarstyles.activeTextColor = "#ffd04b"
    }
    else{
      this.navTitle = "Mandat"
      const {data} = await getMandatTree(this.listQuery)
      this.maquetteTree = data
    }
    let depensesOption = this.maquetteTree.depenses.chapitres
    let recettesOption = this.maquetteTree.recettes.chapitres

    this.depensesMap= depensesOption.map((chapitre : any)=>{
      let mappedChapitre = {label: chapitre.label, value: chapitre.id}
      return mappedChapitre
    })

    this.recettesMap= recettesOption.map((chapitre : any)=>{
      let mappedChapitre = {label: chapitre.label, value: chapitre.id}
      return mappedChapitre
    })
  }

  private handleClick(element: any){
    console.log("this is the instance ", element.index)
  }

  private handleNavigate() {
    this.dialogTableVisible = true;
  }

  private checkIfDateIsDisabled(date:string){
    return false
  }

  private handleExporter(){
    console.log("route params", this.$route.params.entitytype)
    const entitytype = this.$route.params && this.$route.params.entitytype
    const entitykey = this.$route.params && this.$route.params.entitykey
    const periode = (etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY) ? periodes.JOUR : 
      (etatsmodule.periode == periodes.MOIS || etatsmodule.periode == periodes.CEMOIS)?periodes.MOIS:
      (etatsmodule.periode == periodes.INTERVALLE)?periodes.INTERVALLE:'rapport_mensuel';
    
    const param = (etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY) ? etatsmodule.jourPeriodeJour : 
      etatsmodule.moisPeriodeMois

    window.location.href = 'http://localhost:8000/api/export/'+entitytype+'/'+entitykey+'?'
          +'critere='+periode+'&'
          +'param='+param+'&'
          +'mois='+etatsmodule.moisPeriodeMois+'&'
          +'startmonth='+etatsmodule.debutPeriodeIntervalle+'&'
          +'endmonth='+etatsmodule.finPeriodeIntervalle
  }

  private handleRecettesClick(data:any){
    console.log("this is the index of the clicked item", data.index)
  }

  private handleDepensesClick(data:any){
    console.log("this is the index of the clicked item", data.index)
  }

  private handleAllerButtonClick(){
    this.dialogTableVisible = false

  }

  private handleExitDialogEventRecieved(){
    this.dialogTableVisible = false
  }
}

</script>

<style>

.fonctionnement {
  font-size : 22px;
  
  padding-bottom: 40px;
  padding-right: 20px;
  display: inline-block;
}
</style>
