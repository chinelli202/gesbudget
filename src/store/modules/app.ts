import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { Message } from 'element-ui'
import {
  getSidebarStatus, getSize
  , setSidebarStatus, setLanguage, setSize
} from '@/utils/cookies'
import {
  setDevises, setTypesPaiement, setEtatsEngagement, setNaturesEngagement
  , setStatutsEngagement, setTva, setTypesEngagement, getTva
  , getDevises, getTypesPaiement, getTypesEngagement, getNaturesEngagement
  , getEtatsEngagement, getStatutsEngagement
  , getLocaldbBudgetStructure, setLocaldbBudgetStructure
} from '@/utils/localdb'
import { getVariables, getBudgetStructure } from '@/api/variables'
import { UserModule } from '@/store/modules/user'
import { getLocale } from '@/lang'
import store from '@/store'
import router from '@/router'
import { PermissionModule } from '@/store/modules/permission'

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
  typesPaiement: string[]
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
  public devises : any = getDevises()
  public typesPaiement : string[] = getTypesPaiement()
  public typesEngagement = getTypesEngagement()
  public naturesEngagement = getNaturesEngagement()
  public etatsEngagement = getEtatsEngagement()
  public statutsEngagement = getStatutsEngagement()

  public budgetStructure: any = getLocaldbBudgetStructure()
  public tageffect = {
    INIT: {
      NEW: { type: 'info', effect: 'plain' },
      SAISI: { type: 'info', effect: 'plain' },
      VALIDP: { type: 'info', effect: 'plain' },
      VALIDS: { type: 'info', effect: 'light' },
      VALIDF: { type: 'info', effect: 'dark' }
    },
    PEG: {
      NEW: { type: '', effect: 'plain' },
      SAISI: { type: '', effect: 'plain' },
      VALIDP: { type: '', effect: 'plain' },
      VALIDS: { type: '', effect: 'light' },
      VALIDF: { type: '', effect: 'dark' }
    },
    IMP: {
      NEW: { type: 'success', effect: 'plain' },
      SAISI: { type: 'success', effect: 'plain' },
      VALIDP: { type: 'success', effect: 'plain' },
      VALIDS: { type: 'success', effect: 'light' },
      VALIDF: { type: 'success', effect: 'dark' }
    },
    APUR: {
      NEW: { type: 'success', effect: 'plain' },
      SAISI: { type: 'success', effect: 'plain' },
      VALIDP: { type: 'success', effect: 'plain' },
      VALIDS: { type: 'success', effect: 'light' },
      VALIDF: { type: 'success', effect: 'dark' }
    },
    CLOT: {
      SAISI: { type: 'danger', effect: '' },
      VALIDP: { type: 'danger', effect: '' },
      VALIDS: { type: 'danger', effect: '' },
      VALIDF: { type: 'danger', effect: '' }
    }
  }

  @Action
  public async fetchEngagementVariables(team: any = null) {
    if(!team) {
      console.log('!team')
      if(Object.keys(UserModule.loggedUser).length === 0) {
        try {
          await UserModule.GetUserInfo()
          const roles = UserModule.roles
          // Generate accessible routes map based on role
          PermissionModule.GenerateRoutes(roles)
          // Dynamically add accessible routes
          router.addRoutes(PermissionModule.dynamicRoutes)
        } catch (error) {
          console.error(error.message)
          return
        }
      }
      team = UserModule.loggedUser.team
    }

    let response
    let levels = 0
    let budget: Record<string, any> = {}
    let respBudget: Record<string, any> = {
      content: {}
    }
    
    try {
      response = await getBudgetStructure({})
    } catch (error) {
      console.error(error)
      return  
    }
    
    budget = response.data.content
    levels = response.data.levels

    try {
      if (levels == 4) {
        respBudget['domaines'] = Object.keys(budget)
        for (const domain in budget) {
          let chapts = budget[domain].chapitres
          respBudget['content'][domain] = chapts.map(
            (chapitre: any) => {
              return {
                label: chapitre.label,
                value: chapitre.id,
                children: chapitre.rubriques.map(
                  (rubrique: any) => {
                    return {
                      label: rubrique.label,
                      value: rubrique.id,
                      children: rubrique.lignes.map(
                        (ligne: any) => {
                          return {
                            label: ligne.label,
                            value: ligne.id
                          }
                        }
                      )
                    }
                  }
                )
              }
            }
          )
        }
      }
      else {
        respBudget['content'] = budget.chapitres.map(
          (chapitre: any) => {
            return {
              label: chapitre.label,
              value: chapitre.id,
              children: chapitre.rubriques.map(
                (rubrique: any) => {
                  return {
                    label: rubrique.label,
                    value: rubrique.id,
                    children: rubrique.lignes.map(
                      (ligne: any) => {
                        return {
                          label: ligne.label,
                          value: ligne.id
                        }
                      }
                    )
                  }
                }
              )
            }
          }
        )
      }
    } catch (error) {
      Message({
        message: 'Erreur lors de la récupération du buget',
        type: 'error',
        duration: 7 * 1000
      })
      respBudget['error'] = "ERREUR_RECUPERATION"
      console.log(error)
      return
    }
    
    respBudget['levels'] = levels
    this.SET_BUDGET_STRUCTURE(respBudget)

    response = await getVariables({ cle: 'DEVISE' })
    this.SET_DEVISES(response.data.reduce(function(all: any, obj: any) {
      all[obj.code] = { code: obj.code, libelle: obj.libelle }
      return all
    }, {}))
    
    response = await getVariables({ cle: 'TYPE_PAIEMENT' })
    this.SET_TYPES_PAIEMENT(response.data.reduce(function(all: any, obj: any) {
      all[obj.code] = { code: obj.code, libelle: obj.libelle }
      return all
    }, {}))

    response = await getVariables({ cle: 'TYPE_ENGAGEMENT' })
    this.SET_TYPES_ENGAGEMENT(response.data.reduce(function(all: any, obj: any) {
      all[obj.code] = { code: obj.code, libelle: obj.libelle }
      return all
    }, {}))

    response = await getVariables({ cle: 'NATURE_ENGAGEMENT' })
    this.SET_NATURES_ENGAGEMENT(response.data.reduce(function(all: any, obj: any) {
      all[obj.code] = { code: obj.code, libelle: obj.libelle }
      return all
    }, {}))

    response = await getVariables({ cle: 'ETAT_ENGAGEMENT' })
    this.SET_ETATS_ENGAGEMENT(response.data.reduce(function(all: any, obj: any) {
      all[obj.code] = { code: obj.code, libelle: obj.libelle }
      return all
    }, {}))

    response = await getVariables({ cle: 'STATUT_ENGAGEMENT' })
    this.SET_STATUTS_ENGAGEMENT(response.data.reduce(function(all: any, obj: any) {
      all[obj.code] = { code: obj.code, libelle: obj.libelle }
      return all
    }, {}))

    response = await getVariables({ cle: 'CONSTANTE', code: 'TVA' })
    this.SET_TVA(parseFloat(response.data[0].valeur))
  }

  @Action
  public async UpdateSession(team: any) {
    await UserModule.GetUserInfo(team)
    await this.fetchEngagementVariables(team)
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
    setTva('' + this.tva)
  }

  @Mutation
  private SET_DEVISES(devises: string[]) {
    this.devises = devises
    setDevises(this.devises)
  }
  
  @Mutation
  private SET_TYPES_PAIEMENT(typesPaiement: string[]) {
    this.typesPaiement = typesPaiement
    setTypesPaiement(this.typesPaiement)
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

  @Mutation
  private SET_BUDGET_STRUCTURE(budget: any) {
    this.budgetStructure = budget
    setLocaldbBudgetStructure(this.budgetStructure)
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
