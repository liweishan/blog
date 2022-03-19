import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login', // 请求地址
    method: 'POST', // 请求类型
    data
  })
}

export function register(data) {
  return request({
    url: '/register',
    method: 'POST',
    data
  })
}

export function editPwd(data) {
  return request({
    url: '/editPwd',
    method: 'POST',
    data
  })
}

export function retrievePwd(data) {
  return request({
    url: '/retrievePwd',
    method: 'POST',
    data
  })
}

export function sms(data) {
  return request({
    url: '/sms',
    method: 'POST',
    data
  })
}
