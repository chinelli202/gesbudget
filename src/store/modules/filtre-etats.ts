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

const periodes : any = {
    TODAY: 'today',
    JOUR: 'jour',
    MOIS: 'mois',
    INTERVALLE: 'intervalle'
}

@Module({ dynamic: true, store, name: 'filtre-etats' })
class FiltreEtats extends VuexModule implements IFiltreEtats {
  public section = defaultFiltreEtat.section
  public periode = defaultFiltreEtat.periode
  public jourPeriodeJour = defaultFiltreEtat.jourPeriodeJour
  public moisPeriodeMois = defaultFiltreEtat.moisPeriodeMois
  public debutPeriodeIntervalle = defaultFiltreEtat.debutPeriodeIntervalle
  public finPeriodeIntervalle = defaultFiltreEtat.finPeriodeIntervalle

  @Mutation
  private SET_PERIODE_JOUR(payload: { jourParam: string, value: string }) {
    const { jourParam, value } = payload
    if(jourParam == periodes.TODAY){
        this.periode = periodes.TODAY
    }
    else if (jourParam == periodes.JOUR){
        this.periode = periodes.JOUR
        this.jourPeriodeJour = value
    }
  }

  @Mutation
  private SET_PERIODE_MOIS(payload: { mois: number }) {
    const { mois } = payload
    this.periode = periodes.MOIS
    this.moisPeriodeMois = mois
  }

  @Mutation
  private SET_PERIODE_INTERVALLE(payload: { debut: number, fin: number }) {
    const { debut, fin } = payload
    this.periode = periodes.MOIS 
    this.debutPeriodeIntervalle = debut
    this.finPeriodeIntervalle = fin    
  }

  @Action
  public SetPeriodeJour(payload: { jourParam: string, value: string }){
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
}

export const FiltreEtatsModule = getModule(FiltreEtats)
