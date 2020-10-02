import request from '@/utils/request'

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
      Authorization: `Bearer ${data.token}`
    }
  })

// Get user info
export const getUserInfo = (data: any) =>
  request({
    url: '/user-detail',
    method: 'get',
    headers: {
      Authorization: `Bearer ${data.token}`
    }
  })

// TO EDIT
export const getUsers = (params: any) =>
  request({
    url: '/users',
    method: 'get',
    params
  })

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
