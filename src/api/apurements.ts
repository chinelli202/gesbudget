import request from '@/utils/request'
import { getToken } from '@/utils/cookies'


export const apurerEngagement = (data: any) =>
  request({
    url: `/apurement/create`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const updateApurement = (data: any) =>
  request({
    url: `/apurement/update/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const resendUpdateApurement = (data: any) =>
  request({
    url: `/apurement/resend/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const addComment = (data: any) =>
  request({
    url: `/apurement/addcomment/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const closeApurement = (data: any) =>
  request({
    url: `/apurement/close/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const restoreApurement = (data: any) =>
  request({
    url: `/apurement/restore/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const sendBack = (data: any) =>
  request({
    url: `/apurement/sendback/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const validationApurement = (data: any) =>
  request({
    url: `/apurement/valider/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const cancelValidationApurement = (data: any) =>
  request({
    url: `/apurement/cancelvalider/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

