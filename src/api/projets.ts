import request from '@/utils/request'
import { getToken } from '@/utils/cookies'
import { IProjetData } from './types'

export const defaultProjetData: IProjetData = {
  label: '',
  description: '',
  chapitre_id:0,
  entreprise_code:''
}

export const createProjet = (data: any) =>
  request({
    url: `/projet/create`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const getProjets = (params: any) =>
  request({
    url: 'projets/getprojets',
    method: 'get',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    params
  })

  export const detailProjet = (params: any) =>
  request({
    url: `/projet/${params.id}`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  })