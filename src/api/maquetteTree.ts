import request from '@/utils/request'
import { IGroupeFonctionnement } from './types'

  export const getFonctionnementTree = (params:any) =>
    request({
      url: '/maquettes/fonctionnement',
      method: 'get',
      params
    })