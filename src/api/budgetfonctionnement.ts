import request from '@/utils/request'
import { IBudgetFonctionnement } from './types'

export const defaultBudgetFonctionnementData: IBudgetFonctionnement = {
    id: 1,
    previsions: 50000000,
    realisationsMois: 2000000,
    realisationsPrecedentes: 20000000,
    realisationsCumulees: 20000000,
    engagements: 20000000,
    execution: 20000000,
    solde: 30000000,
    tauxExecution: 13
  }
  
  export const getBudgetsFonctionnement = (params: any) =>
    request({
      url: '/budgetsfonctionnement',
      method: 'get',
      params
    })