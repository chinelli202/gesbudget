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
      <el-menu-item @click="handleNavigate">
        Aller à...
      </el-menu-item>
      <el-menu-item style="float:right;">
        <div>      
          <el-select v-model="periodTypeSelected" placeholder="Select" @change="handlePeriodTypeChanged">
            <el-option
              v-for="item in periodTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="selectedPeriod"
            :disabled="isDatePickerDisabled"
            v-if="isDatePickerVisible"
            :type="periodType"
            placeholder="Choississez un jour"
            @disabledDate="checkIfDateIsDisabled">
          </el-date-picker>
          <el-button slot="append" icon="el-icon-search" @click="handleNavigateToSetFiltre"></el-button>
        </div>
        <!-- <el-input placeholder="Entrez quelque chose" v-model="input2" class="myinput">
        </el-input> -->
              <!-- <template slot="append">.com</template> -->
        
      </el-menu-item>
    </el-menu>

    <el-dialog :visible.sync="dialogTableVisible">
       <navigateur-etats/>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NavigateurEtats from '@/components/NavigateurEtats/index.vue'
import {FiltreEtatsModule as etatsmodule} from '@/store/modules/filtre-etats'
  
export interface periodTypeSelection {
  value: string,
  label: string
}
  @Component({
    name: 'EtatNavbar',
    components: {
      NavigateurEtats
    }
  })

export default class extends Vue {

private activeIndex2 : any = "dd"
private input2 : string = ""
private dialogTableVisible: boolean = false
private periodType : string = "date"
private selectedPeriod: string = ""
private periodTypes : any = {
  JOUR: 'date',
  MOIS: 'month',
  SEMAINE: 'week',
  INTERVALLE: 'daterange',
}
private isDatePickerDisabled: boolean = false
private isDatePickerVisible: boolean = false
  private handleSelect(){

  }

  private handleClick(element: any){
    console.log("this is the instance ", element.index)
  }

  private handleNavigate() {
    this.dialogTableVisible = true;
  }

  private periodTypeSelected : periodTypeSelection = {
      value: 'date-today',
      label: 'Aujourd\'hui',
  }

  private periodTypeOptions:periodTypeSelection [] =  [{
      value: 'date-today',
      label: 'Aujourd\'hui',
    }, {
      value: 'month-thismonth',
      label: 'Ce mois çi'
    }, {
      value: 'date-selectday',
      label: 'Choisir le jour'
    }, {
      value: 'week-selectweek',
      label: 'Choisir la semaine'
    },
    {
      value: 'month-selectmonth',
      label: 'Choisir le mois '
    },
    {
      value: 'monthrange-selectinterval',
      label: 'Choisir la période'
    }]
  
  private handlePeriodTypeChanged(type:string){
    console.log("this the type selected", type)
    this.routeFirstParam(type.split("-",2)[0])
    this.routeSecondParam(type.split("-",2)[1])
  }

  private routeFirstParam(type:string){
    if(type == this.periodTypes.JOUR){
      this.periodType = this.periodTypes.JOUR
    }
    if(type == this.periodTypes.MOIS){
      this.periodType = this.periodTypes.MOIS
    }
    if(type == this.periodTypes.SEMAINE){
      this.periodType = this.periodTypes.SEMAINE
    }
    if(type == this.periodTypes.INTERVALLE){
      this.periodType = this.periodTypes.INTERVALLE
    }
  }

  private routeSecondParam(param:string){
    if(param == 'today'){
      this.isDatePickerDisabled = true
      this.isDatePickerVisible = false
      
    }
    else {
      this.isDatePickerDisabled = false
      this.isDatePickerVisible = true
      }
  }

  private checkIfDateIsDisabled(date:string){
    return false
  }

  private handleNavigateToSetFiltre(){
    console.log("selected section ", etatsmodule.section)
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
