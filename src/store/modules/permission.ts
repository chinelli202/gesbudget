import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'
import {AppModule} from '@/store/modules/app'

const hasPermission = (roles: string[], route: RouteConfig) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

const belongsToTeam = (teams: string[], route: RouteConfig) => {
  if (route.meta && route.meta.teams) {
    return teams.some(team => route.meta.teams.includes(team))
  } else {
    return true
  }
}

export const filterAsyncRoutes = (routes: RouteConfig[], roles: string[], teams: string[]) => {
  const res: RouteConfig[] = []
  routes.forEach(route => {
    const r = { ...route }
    if (hasPermission(roles, r) && belongsToTeam(teams, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles, teams)
      }
      res.push(r)
    }
  })
  return res
}

export interface IPermissionState {
  routes: RouteConfig[]
  dynamicRoutes: RouteConfig[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = []
  public dynamicRoutes: RouteConfig[] = []
  public permissionCodes: Record<string, any> = {
    engagement: {
      INIT: { //actions possibles lorsque l'engagement est à l'état Initial
        SAISI:  'ENG_INIT_SAISI',
        VALIDP: 'ENG_INIT_VALIDP',
        VALIDS: 'ENG_INIT_VALIDS',
        VALIDF: 'ENG_INIT_VALIDF',
        CLOT:   'ENG_INIT_CLOT'
      },
      PEG: { //actions possibles lorsque l'engagement est à l'état pré-engagé
        SAISI:  'ENG_PEG_SAISI', // IMP
        VALIDP: 'ENG_PEG_VALIDP',
        VALIDS: 'ENG_PEG_VALIDS',
        VALIDF: 'ENG_PEG_VALIDF',
        CLOT:   'ENG_PEG_CLOT'
      },
      IMP: { //actions possibles lorsque l'engagement est à l'état Imputé
        SAISI:  'ENG_IMP_SAISI', // APUR
        VALIDP: 'ENG_IMP_VALIDP',
        VALIDS: 'ENG_IMP_VALIDS',
        VALIDF: 'ENG_IMP_VALIDF',
        REG:    'ENG_IMP_REG',
        CLOT:   'ENG_IMP_REG'
      }
    }
  }
  
  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes)
    this.dynamicRoutes = routes
  }

  @Action
  public GenerateRoutes(roles: string[], teams: string[]) {
    let accessedRoutes
    if (roles.includes('admin')) {
      accessedRoutes = asyncRoutes
      console.log("using normal routes")
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles, teams)
      console.log("filtering async routes")
    }
    this.SET_ROUTES(accessedRoutes)
  }
}

export const PermissionModule = getModule(Permission)
