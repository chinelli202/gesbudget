import request from '@/utils/request'
import { getToken } from '@/utils/cookies'
import { IProjetData } from './types'

export const defaultProjetData: IProjetData = {
  label: '',
  description: '',
  chapitre_id:0,
  chapitre_label: '',
  entreprise_code: '',
  entreprise_name: ''
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
    url: 'projets',
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

  export const getMaquette = (params:any) =>
    request({
      url: '/projet/maquette',
      method: 'get',
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      params
    })