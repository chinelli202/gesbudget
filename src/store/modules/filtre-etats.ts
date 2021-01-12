import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import elementVariables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

export interface IFiltreEtats {
  section: string
  periode: string
  jourPeriodeJour: string
  moisPeriodeMois: number
  debutPeriodeIntervalle: number
  finPeriodeIntervalle: number
}

const defaultFiltreEtat : IFiltreEtats = {
    section : 'Dépenses',
    periode: 'today',
    jourPeriodeJour: '2020-06-12',
    moisPeriodeMois: 1,
    debutPeriodeIntervalle: 1,
    finPeriodeIntervalle: 1
}

export const periodes = {
    TODAY: 'today',
    JOUR: 'jour',
    MOIS: 'mois',
    CEMOIS: 'thismonth',
    INTERVALLE: 'intervalle'
}

@Module({ dynamic: true, store, name: 'filtre-etats' })
class FiltreEtats extends VuexModule implements IFiltreEtats {
  public section = defaultFiltreEtat.section
  public periode = defaultFiltreEtat.periode
  public jourPeriodeJour = this.getDate()
  //public jourPeriodeJour = defaultFiltreEtat.jourPeriodeJour
  public moisPeriodeMois = defaultFiltreEtat.moisPeriodeMois
  public debutPeriodeIntervalle = defaultFiltreEtat.debutPeriodeIntervalle
  public finPeriodeIntervalle = defaultFiltreEtat.finPeriodeIntervalle

  @Mutation
  private SET_PERIODE_JOUR(payload: { jourParam: string, value: string }) {
    const { jourParam, value } = payload
    if(jourParam == periodes.TODAY){
        this.periode = periodes.TODAY
        this.jourPeriodeJour = value
        var vdate = new Date(value)
        this.moisPeriodeMois = vdate.getMonth() + 1
        console.log("from within module periode today")
        this.debutPeriodeIntervalle = 1
        this.finPeriodeIntervalle = vdate.getMonth()
    }
    else if (jourParam == periodes.JOUR){
      console.log("from within module periode jour")
        this.periode = periodes.JOUR
        this.jourPeriodeJour = value
        var vdate = new Date(value)
        this.debutPeriodeIntervalle = 1
        this.finPeriodeIntervalle = vdate.getMonth()
    }
  }

  @Mutation
  private SET_PERIODE_MOIS(payload: { mois: number }) {
    const { mois } = payload
    this.periode = periodes.MOIS
    this.moisPeriodeMois = mois
    this.debutPeriodeIntervalle = mois
    this.finPeriodeIntervalle = mois
  }

  @Mutation
  private SET_PERIODE_INTERVALLE(payload: { debut: number, fin: number }) {
    const { debut, fin } = payload
    this.periode = periodes.INTERVALLE 
    this.debutPeriodeIntervalle = debut
    this.finPeriodeIntervalle = fin    
  }

  @Action
  public SetPeriodeJour(payload: { jourParam: string, value: string }){
    console.log("from within module periode jour ttrrryyyyy")
      this.SET_PERIODE_JOUR(payload)
  }
  @Action
  public SetPeriodeMois(payload: { mois: number }){
      this.SET_PERIODE_MOIS(payload)
  }
  @Action
  public SetPeriodeIntervalle(payload: { debut: number, fin: number }){
      this.SET_PERIODE_INTERVALLE(payload)
  }

  private getDate(){
    const moment = require('moment');
    let m = moment();
    let my_date = m.format('yyyy-MM-D')
    console.log("date : ",my_date)
    return my_date
  }
}

export const FiltreEtatsModule = getModule(FiltreEtats)
