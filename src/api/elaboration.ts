import request from '@/utils/request'
import { getToken } from '@/utils/cookies'

export const uploadMaquette = (data: any) =>
  request({
    url: `/elaboration/draft/maquette/store`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const processMaquette = (data:any) => 
request({
  url: `/elaboration/draft/maquette/load`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
})

export const getMaquetteActive = (codeentreprise:string, data:any) => 
request({
  url: `/elaboration/maquette/entreprise/'${codeentreprise}`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
})



export const watchProgress = (data:any) => 
request({
  url: `/elaboration/draft/maquette/loadprogress`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
})