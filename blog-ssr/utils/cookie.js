/** 跟cookie有关的方法 */

/**
 * 设置多个cookie
 * @param {Object} opt 要设置的cookie，key对应key，val对应val
 * @param {Number} exdays 过期时间
 */
export function setCookieAll(opt, exdays) {
  const exdate = new Date()
  exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
  for (const [k, v] of Object.entries(opt)) {
    document.cookie = `${k}=${v};path=/;expires=${exdate.toUTCString()}` // 字符串拼接cookie
  }
}

/**
 * 设置单个cookie
 * @param {String} key cookie的key
 * @param {String} val cookie的val
 * @param {Number} exdays 过期时间
 */
export function setCookie(key, val, exdays = 0) {
  const exdate = new Date()
  exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
  document.cookie = `${key}=${val};path=/;expires=${exdate.toUTCString()}` // 字符串拼接cookie
}

/**
 * 根据key获取cookie的值
 * @param {String} key cookie的key
 * @return {*} 如果有值就返回字符串，否则false
 */
export function getCookie(key) {
  const cookies = process.server ? '' : document.cookie
  if (cookies.includes(key)) {
    const arr = cookies.split('; ')
    const str = arr.find(elem => elem.includes(`${key}=`))
    if (str) {
      const val = str.split('=')[1]
      return val
    }
  }
  return false
}

/**
 * 获取所有的cookie
 * @return {*} cookie有的时候返回一个对应key与val的json数据，反之则空json
 */
export function getCookieAll() {
  const cookies = document.cookie
  const obj = {}
  if (cookies) {
    const arr = cookies.split('; ')
    for (const v of arr.values()) {
      const kv = v.split('=')
      const [k, val] = kv
      obj[k] = val
    }
  }
  return obj
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
 */
export function clearCookieAll() {
  const cookies = document.cookie
  if (cookies) {
    const arr = cookies.split('; ')
    for (const v of arr.values()) {
      const kv = v.split('=')
      clearCookie(kv[0])
    }
  }
}
