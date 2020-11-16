import request from '@/utils/request'
import { IRecapData } from './types'

export const defaultRecapData: IRecapData = {
    sumrow: Object,
    //collection: [],
    //header:Object
  }
  
  export const getGroupeRecapData = (groupename: string, params: any) =>
    request({
      url: `/etats/fonctionnement/depenses/groupe/'${groupename}`,
      method: 'get',
      params
    })

    export const getRubriqueRecapData = (rubriqueid: string, params: any) =>
    request({
      url: `/etats/fonctionnement/rubrique/'${rubriqueid}`,
      method: 'get',
      params
    })

    export const getChapitreRecapData = (chapitreid: string, params: any) =>
    request({
      url: `/etats/fonctionnement/chapitre/'${chapitreid}`,
      method: 'get',
      params
    })

    export const getLigneRecapData = (ligneid: string, params: any) =>
    request({
      url: `/etats/fonctionnement/ligne/'${ligneid}`,
      method: 'get',
      params
    })

    export const getRecapData = (entitytype: string, entitykey: any, params: any) =>
    request({
      url: `/etats/fonctionnement/${entitytype}/${entitykey}`,
      method: 'get',
      params
    })

    export const getMonthsRecapCollection = (entitytype: string, entitykey: any, params: any) =>
      request({
        url: `/etats/fonctionnement/monthsrecap/${entitytype}/${entitykey}`,
        method: 'get',
        params
    })