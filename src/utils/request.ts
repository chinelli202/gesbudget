import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      config.headers['X-Access-Token'] = UserModule.token
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    // Some example statuses here:
    // status == 200: success
    // status == 501: invalid access token
    // status == 502: already login in other place
    // status == 503: access token expired
    // status == 504: invalid user (user not exist)
    // status == 505: username or password is incorrect
    // You can change this part for your own usage.
    const res = response.data
    if (res.status !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 6 * 1000
      })
      if (res.status === 508 || res.status === 512 || res.status === 514) {
        MessageBox.confirm(
          'Vous avez été déconnecté, essayez de vous connecter à nouveau',
          'Message de déconnexion',
          {
            confirmButtonText: 'Me connecter',
            cancelButtonText: 'Annuler',
            type: 'warning'
          }
        ).then(() => {
          UserModule.ResetToken()
          location.reload() // To prevent bugs from vue-router
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return response.data
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
