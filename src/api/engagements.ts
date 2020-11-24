import request from '@/utils/request'
import { IEngagementData } from './types'
import { getToken } from '@/utils/cookies'

export const defaultArticleData: IEngagementData = {
  id: 0,
  created_at: '',
  updated_at: '',
  code: '',
  libelle: '',
  montant_ht: 0,
  montant_ttc: 0,
  devise: '',
  nature: '',
  type: '',
  etat: '',
  statut: '',
  nb_imputations: 0,
  cumul_imputations: 0,
  nb_apurements: 0,
  cumul_apurements: 0,
  saisisseur: '',
  valideur_first: '',
  valideur_second: '',
  valideur_final: '',
  source: ''
}

export const createEngagement = (data: any) =>
  request({
    url: `/engagement/create`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

  export const getEngagements = (params: any) =>
  request({
    url: '/getengagements',
    method: 'get',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    params
  })

export const detailEngagement = (params: any) =>
  request({
    url: `/engagement/${params.id}`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })

export const updateEngagement = (data: any) =>
  request({
    url: `/engagement/update/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const resendUpdateEngagement = (data: any) =>
  request({
    url: `/engagement/resend/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const addComment = (data: any) =>
  request({
    url: `/engagement/addcomment/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const closePreeng = (data: any) =>
  request({
    url: `/engagement/close/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const restorePreeng = (data: any) =>
  request({
    url: `/engagement/restore/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const sendBack = (data: any) =>
  request({
    url: `/engagement/sendback/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const validationpPreeng = (data: any) =>
  request({
    url: `/engagement/valider/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const cancelValidationpPreeng = (data: any) =>
  request({
    url: `/engagement/cancelvalider/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })



