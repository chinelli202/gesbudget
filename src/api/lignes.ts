import request from '@/utils/request'
import { getToken } from '@/utils/cookies'


export const getSoldeLigne = (data: any) =>
  request({
    url: `ligne/solde/${data.id}`,
    method: 'get',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })