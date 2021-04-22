import request from '@/utils/request'
import { Collapse } from 'element-ui'
import { ISousSectionFonctionnement } from './types'

export const getRecapSousSectionFonctionnement = () =>
  request({
    url: '/etats/fonctionnement/depenses/soussection/fonctionnement',
    method: 'get'
  })

export const defaultSousSectionFonctionnement: ISousSectionFonctionnement = {
  sumrow: {},
  collection: []
}
