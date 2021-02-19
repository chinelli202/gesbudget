import request from '@/utils/request'
import { getToken } from '@/utils/cookies'

// Login function
export const login = (data: any) =>
  request({
    url: '/user-login',
    method: 'post',
    data
  })

export const logout = (data: any) =>
  request({
    url: '/user-logout',
    method: 'get',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    data
  })

// Get user info
export const getUserInfo = (params: any) =>
  request({
    url: '/user-detail',
    method: 'get',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    params
  })

export const getUsers = (params: any) =>
  request({
    url: '/users/list',
    method: 'get',
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    params
  })

// TO EDIT
export const getUserByName = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'get'
  })

export const updateUser = (username: string, data: any) =>
  request({
    url: `/users/${username}`,
    method: 'put',
    data
  })

export const deleteUser = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'delete'
  })

export const register = (data: any) =>
  request({
    url: '/users/register',
    method: 'post',
    data
  })
