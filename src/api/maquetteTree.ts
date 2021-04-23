import request from '@/utils/request'
import { IGroupeFonctionnement } from './types'

export const getFonctionnementTree = (params:any) =>
  request({
    url: '/maquettes/fonctionnement',
    method: 'get',
    params
  })

export const getMandatTree = (params:any) =>
  request({
    url: '/maquettes/mandat',
    method: 'get',
    params
  })

export const getEntrepriseTree = (params:any) =>
  request({
    url: '/maquettes',
    method: 'get',
    params
  })

export const getSectionsFonctionnementTree = (params:any) =>
  request({
    url: '/maquettes/fonctionnement/sections',
    method: 'get',
    params
  })
