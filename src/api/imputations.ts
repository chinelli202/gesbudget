import request from '@/utils/request'
import { getToken } from '@/utils/cookies'


export const imputerEngagement = (data: any) =>
  request({
    url: `/imputation/create/`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const apurerEngagement = (data: any) =>
  request({
    url: `/apurer/create/`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const updateImputation = (data: any) =>
  request({
    url: `/imputation/update/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const resendUpdateImputation = (data: any) =>
  request({
    url: `/imputation/resend/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const addComment = (data: any) =>
  request({
    url: `/imputation/addcomment/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const closeImputation = (data: any) =>
  request({
    url: `/imputation/close/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const restoreImputation = (data: any) =>
  request({
    url: `/imputation/restore/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const sendBack = (data: any) =>
  request({
    url: `/imputation/sendback/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const validationImputation = (data: any) =>
  request({
    url: `/imputation/valider/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

export const cancelValidationImputation = (data: any) =>
  request({
    url: `/imputation/cancelvalider/${data.id}`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

