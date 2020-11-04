import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getSidebarStatus, getSize
      , setSidebarStatus, setLanguage, setSize } from '@/utils/cookies'
import { setDevises, setEtatsEngagement, setNaturesEngagement
      , setStatutsEngagement, setTva, setTypesEngagement, getTva
      , getDevises, getTypesEngagement, getNaturesEngagement
      , getEtatsEngagement, getStatutsEngagement } from '@/utils/localdb'
import { getVariables } from '@/api/variables'
import { getLocale } from '@/lang'
import store from '@/store'
import { mapGetters } from 'vuex'

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface IAppState {
  device: DeviceType
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  language: string
  size: string
  tva: number
  devises: string[]
  typesEngagement: string[]
  naturesEngagement: string[]
  etatsEngagement: string[]
  statutsEngagement: string[]
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public sidebar = {
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false
  }

  public device = DeviceType.Desktop
  public language = getLocale()
  public size = getSize() || 'medium'
  public tva = parseFloat(getTva());
  public devises : string[] = getDevises()
  public typesEngagement : string[] = getTypesEngagement()
  public naturesEngagement : string[] = getNaturesEngagement()
  public etatsEngagement : string[] = getEtatsEngagement()
  public statutsEngagement : string[] = getStatutsEngagement()

  @Action
  public async fetchEngagementVariables(){
    let response = await getVariables({ cle: 'DEVISE' });
    this.SET_DEVISES(response.data);

    response = await getVariables({ cle: 'TYPE_ENGAGEMENT' });
    this.SET_TYPES_ENGAGEMENT(response.data);

    response = await getVariables({ cle: 'NATURE_ENGAGEMENT' });
    this.SET_NATURES_ENGAGEMENT(response.data);

    response = await getVariables({ cle: 'ETAT_ENGAGEMENT' });
    this.SET_ETATS_ENGAGEMENT(response.data);

    response = await getVariables({ cle: 'STATUT_ENGAGEMENT' });
    this.SET_STATUTS_ENGAGEMENT(response.data);

    response = await getVariables({ cle: 'CONSTANTE', code: 'TVA' });
    this.SET_TVA(parseFloat(response.data[0].valeur));
  }

  @Mutation
  private TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
    if (this.sidebar.opened) {
      setSidebarStatus('opened')
    } else {
      setSidebarStatus('closed')
    }
  }

  @Mutation
  private CLOSE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus('closed')
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device
  }

  @Mutation
  private SET_LANGUAGE(language: string) {
    this.language = language
    setLanguage(this.language)
  }

  @Mutation
  private SET_SIZE(size: string) {
    this.size = size
    setSize(this.size)
  }


  @Mutation
  private SET_TVA(tva: number) {
    this.tva = tva
    setTva(''+this.tva);
  }

  @Mutation
  private SET_DEVISES(devises: string[]) {
    this.devises = devises
    setDevises(this.devises)
  }

  @Mutation
  private SET_TYPES_ENGAGEMENT(types: string[]) {
    this.typesEngagement = types
    setTypesEngagement(this.typesEngagement)
  }

  @Mutation
  private SET_NATURES_ENGAGEMENT(natures: string[]) {
    this.naturesEngagement = natures
    setNaturesEngagement(this.naturesEngagement)
  }

  @Mutation
  private SET_ETATS_ENGAGEMENT(etats: string[]) {
    this.etatsEngagement = etats
    setEtatsEngagement(this.etatsEngagement)
  }

  @Mutation
  private SET_STATUTS_ENGAGEMENT(statuts: string[]) {
    this.statutsEngagement = statuts
    setStatutsEngagement(this.statutsEngagement)
  }

  @Action
  public ToggleSideBar(withoutAnimation: boolean) {
    this.TOGGLE_SIDEBAR(withoutAnimation)
  }

  @Action
  public CloseSideBar(withoutAnimation: boolean) {
    this.CLOSE_SIDEBAR(withoutAnimation)
  }

  @Action
  public ToggleDevice(device: DeviceType) {
    this.TOGGLE_DEVICE(device)
  }

  @Action
  public SetLanguage(language: string) {
    this.SET_LANGUAGE(language)
  }

  @Action
  public SetSize(size: string) {
    this.SET_SIZE(size)
  }
}

export const AppModule = getModule(App)
