import crypto from 'crypto'
import axios from 'axios'
import { getToken } from '~/utils/cookies'

const hashSeed = (secret, method) =>
  crypto.createHash(method).update(secret).digest('hex')

export const clientService = axios.create({
  baseURL: '/api',
  timeout: 5000
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
clientService.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (getToken()) {
      config.headers['X-Custom-Auth'] = getToken()
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

export const serverService = axios.create({
  baseURL: process.env.SERVER_API,
  timeout: 5000
})

serverService.interceptors.request.use(
  (config) => {
    return config
  }, (error) => {
    Promise.reject(error)
  }
)

export const loginService = axios.create({
  baseURL: process.env.LOGIN_API, // url = base url + request url
  timeout: 5000
  // withCredentials: true // send cookies when cross-domain requests
})

// Response interceptors
loginService.interceptors.response.use(
  (response) => {
    // general response:
    // { code: 200/201/204/400, message: ... }
    return response.data
  }
)

export const login = data =>
  loginService({
    url: '/',
    method: 'post',
    data: {
      id: data.id,
      token: hashSeed(data.password, 'md5')
    },
    responseType: 'json'
  })

export const getService = () => {
  return process.server ? serverService : clientService
}

export const getQnaireById = (id) => {
  return getService().get('/qnaire', {
    params: {
      id
    }
  })
}

export const getChinaArea = () =>
  getService()({
    url: '/china_area',
    method: 'GET'
  })

export const uploadURL = '/api/upload'

export const deleteFile = filePath =>
  getService()({
    url: '/upload',
    method: 'DELETE',
    data: {
      file: filePath
    }
  })

export const submitAnswer = (answer, qnaireId) =>
  getService()({
    url: '/answer',
    method: 'POST',
    data: {
      answer,
      qnaire_id: qnaireId
    }
  })

export const getUserInfo = token =>
  getService()({
    url: '/user',
    method: 'GET',
    headers: {
      'X-Custom-Auth': token
    }
  })
