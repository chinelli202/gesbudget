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
            :type="datePickerPeriodType"
            placeholder="Choississez un jour"
            @disabledDate="checkIfDateIsDisabled"
            @change="handleDateChanged">
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
import {FiltreEtatsModule as etatsmodule, periodes} from '@/store/modules/filtre-etats'
  
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
private periodType : string = "date"//etatsmodule.periode
private datePickerPeriodType : string = "date"
private selectedPeriod: Date = new Date
private periodTypes = {
  JOUR: 'date',
  MOIS: 'month',
  SEMAINE: 'week',
  INTERVALLE: 'daterange',
  TODAY: 'today'
}
private formatedSelectedDate: string = ""
private isDatePickerDisabled: boolean = false
private isDatePickerVisible: boolean = false
private isFilterButtonActive: boolean = false
private beginMonthSelected: number = 1
private endMonthSelected: number = 2
  
  
  created(){
    //set the date or date range value, pretty much
    if(etatsmodule.periode === periodes.JOUR){
      var day = etatsmodule.jourPeriodeJour
      this.selectedPeriod = new Date(day)
    }
    else if(etatsmodule.periode === periodes.MOIS){
      var formedDate = new Date()
      formedDate.setMonth(etatsmodule.moisPeriodeMois-1)
      this.selectedPeriod = formedDate
    } 
    else if(etatsmodule.periode === periodes.INTERVALLE){
      var beginDate = new Date()
      var endDate = new Date()
      beginDate.setMonth(etatsmodule.debutPeriodeIntervalle - 1) 
      endDate.setMonth(etatsmodule.finPeriodeIntervalle - 1) 
      this.selectedPeriod = beginDate
    }
  }


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
      label: 'Jour'
    }, 
    {
      value: 'month-selectmonth',
      label: 'Mois'
    },
    {
      value: 'monthrange-selectinterval',
      label: 'Période'
    }]
  
  private handlePeriodTypeChanged(type:string){
    // console.log("this the type selected", type)
    // this.routeFirstParam(type.split("-",2)[0])
    // this.routeSecondParam(type.split("-",2)[1])

    var param = type.split("-",2)[1]
    //disabling or enabling datepicker
    if(param === 'today' || param === 'thismonth'){
      this.isDatePickerDisabled = true
      this.isDatePickerVisible = false     
      this.isFilterButtonActive = true
    }
    else {
      this.isDatePickerDisabled = false
      this.isDatePickerVisible = true
      }
      //setting datepicker type
    if(param === 'selectday'){
      // set period to be this month and params
      // activate go button
      this.datePickerPeriodType = this.periodTypes.JOUR
    }
    if(param === 'selectmonth'){
      this.datePickerPeriodType = this.periodTypes.MOIS
      this.periodType = this.periodTypes.MOIS
      this.isDatePickerVisible = true
      this.isDatePickerDisabled = false
    }

    if(param === 'selectinterval'){
      this.datePickerPeriodType = this.periodTypes.INTERVALLE
      this.periodType = this.periodTypes.INTERVALLE
    }

    if(param === 'today'){
      this.periodType = this.periodTypes.TODAY
      this.datePickerPeriodType = this.periodTypes.JOUR
     this.formatedSelectedDate = this.formatSelectedDate(new Date())
    }
  }

  private handleDateChanged(date:any){
    if(this.periodType!= 'daterange'){
      var dateArg = new Date(date)
      this.formatedSelectedDate = this.formatSelectedDate(dateArg)
    }
    else{
      var beginDate = new Date(date[0])
      var endDate = new Date(date[1])
      console.log("begin selected : ", beginDate.getMonth())
      console.log("end selected : ", endDate.getMonth())
      this.beginMonthSelected = beginDate.getMonth() + 1
      this.endMonthSelected = endDate.getMonth() + 1
    }
    if(!this.isFilterButtonActive)
      this.isFilterButtonActive = true
  }

  private checkIfDateIsDisabled(date:string){
    return false
  }

  private handleNavigateToSetFiltre(){
    console.log("start handle navigate")
    console.log("periode type : ", this.periodType)
    var date = new Date(this.selectedPeriod) 
    switch(this.periodType){
      case this.periodTypes.JOUR:
        etatsmodule.SetPeriodeJour({jourParam:periodes.JOUR, value:this.formatedSelectedDate})
        console.log("first case")
        break
      case this.periodTypes.TODAY:
        etatsmodule.SetPeriodeJour({jourParam:periodes.TODAY, value:this.formatedSelectedDate})
        console.log("second case")
        break
    }
  }

  

  private formatSelectedDate(date:Date) : string{
    var toFormat = new Date(date);
      var MM = ((date.getMonth() + 1) < 10 ? '0' : '') 
                        + (date.getMonth() + 1);
      var formatted = date.getFullYear() + "-" + MM + "-" + date.getDate()
      return formatted
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
