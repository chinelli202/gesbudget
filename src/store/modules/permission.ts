import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'

const hasPermission = (roles: string[], route: RouteConfig) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export const filterAsyncRoutes = (routes: RouteConfig[], roles: string[]) => {
  const res: RouteConfig[] = []
  routes.forEach(route => {
    const r = { ...route }
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles)
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
      INIT: { //enregistrer
        SAISI: 'saisir-pre-engagement',
        VALIDP: 'validerp-pre-engagement',
        VALIDS: 'validers-pre-engagement',
        VALIDF: 'validerf-pre-engagement'
      },
      CLOT: { //cloture
        SAISI: 'cloturer-pre-engagement', //CLOT
        VALIDP: 'validerp-cloture-preg',
        VALIDS: 'validers-cloture-preg',
        VALIDF: 'validerf-cloture-preg'
      },
      IMP: { //imputer
        SAISI: 'saisir-imputation', // IMP
        VALIDP: 'validerp-imputation',
        VALIDS: 'validers-imputation',
        VALIDF: 'validerf-imputation',
      },
      APUR: { //apurer
        SAISI: 'saisir-apurement', // APUR
        VALIDP: 'validerp-apurement',
        VALIDS: 'validers-apurement',
        VALIDF: 'validerf-apurement'
      }, 
      REG: {
        IMP: 'regulariser-imputation'
      }
    }
  }
  
  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes)
    this.dynamicRoutes = routes
  }

  @Action
  public GenerateRoutes(roles: string[]) {
    let accessedRoutes
    if (roles.includes('admin')) {
      accessedRoutes = asyncRoutes
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    }
    this.SET_ROUTES(accessedRoutes)
  }
}

export const PermissionModule = getModule(Permission)
