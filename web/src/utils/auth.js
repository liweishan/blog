export function getToken() {
  return sessionStorage.token || ''
}

export function setToken(token) {
  sessionStorage.setItem('token', token)
}

export function getUser() {
  const userInfo = sessionStorage.user
  if (userInfo) {
    return JSON.parse(userInfo)
  }
  return {}
}

export function setUser(userInfo) {
  sessionStorage.setItem('user', JSON.stringify(userInfo))
}

export function clearStorage() {
  sessionStorage.clear()
}
