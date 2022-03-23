/**
 * 校验用户名
 * @param {String} name 必须是汉字或者字母，长度为3-10
 */
export function userName(name) {
  if (!name) {
    return false
  }
  const rule = /^[\u4E00-\u9FA5|a-zA-Z]{3,10}$/
  return rule.test(name)
}

/**
 * 校验用户名
 * @param {String} psd 必须是数字或者字母，长度为6-18
 */
export function userPsd(psd) {
  if (!psd) {
    return false
  }
  const rule = /^[a-zA-Z\d]{6,18}$/
  return rule.test(psd)
}

/**
 * 校验手机号
 * @param {Number} tel 手机号码
 */
export function mobile(tel) {
  const rule = /^1[3|4|5|7|8]\d{9}$/
  return rule.test(tel)
}

/**
 * 校验手机号
 * @param {Number} code 验证码
 */
export function code(num) {
  const rule = /^\d{4}$/
  return rule.test(num)
}

/**
 * 校验栏目名
 * @param {String} name 必须是汉字或者字母，长度为2-50
 */
export function catname(name) {
  const rule = /^[\u4E00-\u9FA5|a-zA-Z|\d]{2,50}$/
  return rule.test(name)
}

/**
 * 校验标题
 * @param {String} str 必填且长度不超过50
 */
export function title(str) {
  return str && str.length <= 50
}

/**
 * 不能为空
 */
export function noEmpty(str) {
  return !!str
}
