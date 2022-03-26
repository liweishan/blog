import { setCookie, getCookie, clearCookie } from './cookie'

export function getToken() {
  return getCookie('token') || ''
}

export function setToken(token) {
  setCookie('token', token)
}

export function getUser() {
  const userInfo = getCookie('user')
  if (userInfo) {
    return JSON.parse(userInfo)
  }
  return {}
}

export function setUser(userInfo) {
  setCookie('user', JSON.stringify(userInfo))
}

export function clearStorage() {
  clearCookie('user')
  clearCookie('token')
}
