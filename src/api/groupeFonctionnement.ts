import request from '@/utils/request'
import { IGroupeFonctionnement } from './types'

export const defaultGroupeFonctionnement: IGroupeFonctionnement = {
    libelle: "Groupe Par Defaut",
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
  
  export const getGroupeFonctionnement = (groupename: string, params: any) =>
    request({
      url: `/etats/fonctionnement/depenses/groupe/'${groupename}`,
      method: 'get',
      params
    })