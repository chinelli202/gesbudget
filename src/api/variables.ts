import request from '@/utils/request'
import { getToken } from '@/utils/cookies'

export const getVariables = (params: any) =>
  request({
    url: '/getvariables/',
    method: 'get',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    params
  })
