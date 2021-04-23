import request from '@/utils/request'
import { IMonthRecapCollection, IMonthRecapData, IRecapData } from './types'

export const defaultRecapData: IRecapData = {
    sumrow: {},
    //collection: [],
    header:{previsionLabel:'Prévision',
            realisationsMoisLabel:'Réalisations',
            realisationsMoisPrecedentsLabel:'RéalisationsMoisPrécédents',
            realisationsLabel:'Réalisations Cumulées',
            engagementsLabel:'Engagements',
            executionLabel:'Exécution',
            soldeLabel:'Solde',
            tauxExecutionLabel:'Taux d\'Execution',          
    },
    libelle: 'Défaut',
    id: 1,
    previsions: 0,
    realisationsMois: 0,
    realisationsPrecedentes: 0,
    realisationsCumulees: 0,
    engagements: 0,
    execution: 0,
    solde: 0,
    tauxExecution: 0
  }
  
  export const defaultMonthRecapData: IMonthRecapData = {
    mois: "Janvier",
    engagements: 0,
    realisations: 0,
    execution: 0,
    tauxExecution: 0,
    collection: []
  }
  
  export const defaultMonthRecapCollection: IMonthRecapCollection = {
    months:[defaultMonthRecapData]
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

    export const getEntrepriseRecapData = (entreprise_code: string, params: any) =>
    request({
      url: `/etats/entreprise/${entreprise_code}`,
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

    export const getSectionRecapData = (sectionname: string, domainename: string, params: any) =>
    request({
      url: `/etats/section/${sectionname}/${domainename}`,
      method: 'get',
      params
    })