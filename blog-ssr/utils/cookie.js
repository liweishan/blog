/**
 * 跟cookie有关的方法
 * 浏览器携带cookie中文会乱码，存的时候用encodeURI编码，取的时候用decodeURI解码
 */
import { encode, decode } from 'js-base64'

/**
 * 设置多个cookie
 * @param {Object} opt 要设置的cookie，key对应key，val对应val
 * @param {Number} exdays 过期时间
 */
export function setCookieAll(opt, exdays) {
  const exdate = new Date()
  exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
  for (const [k, v] of Object.entries(opt)) {
    document.cookie = `${k}=${encode(v)};path=/;expires=${exdate.toUTCString()}` // 字符串拼接cookie
  }
}

/**
 * 设置单个cookie
 * @param {String} key cookie的key
 * @param {String} val cookie的val
 * @param {Number} exdays 过期时间
 */
export function setCookie(key, val, exdays) {
  const exdate = new Date()
  exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
  document.cookie = `${key}=${encode(val)};path=/;expires=${exdate.toUTCString()}` // 字符串拼接cookie
}

/**
 * 根据key获取cookie的值
 * @param {String} key cookie的key
 * @return {*} 如果有值就返回字符串，否则false
 */
export function getCookie(key, cookie) {
  // 服务端没有document
  cookie = cookie || (process.server ? '' : document.cookie)
  if (cookie.includes(key)) {
    const arr = cookie.split('; ')
    const str = arr.find(elem => elem.includes(`${key}=`))
    if (str) {
      const val = str.split('=')[1]
      return decode(val)
    }
  }
  return false
}

/**
 * 获取所有的cookie
 * @return {*} cookie有的时候返回一个对应key与val的json数据，反之则空json
 */
export function getCookieAll(cookie) {
  // 服务端没有document
  cookie = cookie || (process.server ? '' : document.cookie)
  const cookies = {}
  if (cookie) {
    const arr = cookie.split('; ')
    for (const v of arr.values()) {
      const kv = v.split('=')
      const [k, val] = kv
      cookies[k] = decode(val)
    }
  }
  return cookies
}

/**
 * 清除单个的cookie
 * @param {String} key 要清除的cookie的key
 */
export function clearCookie(key) {
  document.cookie = `${key}=;path=/;expires=${-1}`
}

/**
 * 清除所有的cookie
 * @param {Array} keys 根据key清除多个cookie
 */
export function clearCookieAll(keys) {
  const cookie = document.cookie
  if (cookie) {
    const arr = keys || cookie.split('; ')
    for (const v of arr.values()) {
      const kv = v.split('=')
      clearCookie(kv[0])
    }
  }
}
