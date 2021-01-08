<template>
    <div>   
        <label>trier selon</label>   
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
        <el-button slot="append" icon="el-icon-refresh" @click="handleRefreshWithNewFilterParams"></el-button>
      </div>
</template>

<script lang="ts">


import {Vue, Component} from 'vue-property-decorator'
import {FiltreEtatsModule as etatsmodule, periodes} from '@/store/modules/filtre-etats'

export interface periodTypeSelection {
  value: string,
  label: string
}

@Component({
      name: 'FiltreEtats',
})

export default class extends Vue {
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
    private monthSelected: number = 1

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

    created(){
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

    private handlePeriodTypeChanged(type:string){

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
    if(param === 'jour'){
      this.periodType = this.periodTypes.JOUR
      this.datePickerPeriodType = this.periodTypes.JOUR
      this.formatedSelectedDate = this.formatSelectedDate(new Date())
    }
  }

  private handleDateChanged(date:any){
    if(this.periodType!= 'daterange'){
      var dateArg = new Date(date)
      this.formatedSelectedDate = this.formatSelectedDate(dateArg)
      this.monthSelected = dateArg.getMonth() + 1
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

  private handleRefreshWithNewFilterParams(){
    console.log("start handle navigate")
    console.log("periode type : ", this.periodType)
    var date = new Date(this.selectedPeriod) 
    switch(this.datePickerPeriodType){
      case this.periodTypes.JOUR:
        etatsmodule.SetPeriodeJour({jourParam:periodes.JOUR, value:this.formatedSelectedDate})
        console.log("first case")
        break
      case this.periodTypes.TODAY:
        etatsmodule.SetPeriodeJour({jourParam:periodes.TODAY, value:this.formatedSelectedDate})
        console.log("second case")
        break
      case this.periodTypes.MOIS:
        etatsmodule.SetPeriodeMois({mois:this.monthSelected})
        console.log("second case")
        break
      case this.periodTypes.INTERVALLE:
        etatsmodule.SetPeriodeIntervalle({debut:this.beginMonthSelected, fin:this.endMonthSelected})
        break
    }
    var formatted = this.formatedSelectedDate
    console.log("formatted date ", this.formatedSelectedDate)
    console.log("will save this month in module")
    var fdate = new Date(formatted)
    console.log(fdate.getMonth())
    this.$emit('filter-refreshed')
  }

  private formatSelectedDate(date:Date) : string{
    var toFormat = new Date(date);
      var MM = ((date.getMonth() + 1) < 10 ? '0' : '') 
                        + (date.getMonth() + 1);
      var formatted = date.getFullYear() + "-" + MM + "-" + date.getDate()
      return formatted
  }

  private checkIfDateIsDisabled():boolean{
    return this.isDatePickerDisabled
  }
}
</script>