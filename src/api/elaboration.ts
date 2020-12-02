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