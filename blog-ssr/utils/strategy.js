import * as validates from './validateForm'

/**
 * 生成表单自定义校验函数
 * @param {String} msg 提示文字
 */
export const formValidateGene = (key, msg, required) => (rule, val, cb) => {
  const validate = key instanceof Array ? key.some(e => validates[e](val)) : validates[key](val)
  if ((!required && !val) || validate) {
    cb()
  } else {
    cb(new Error(msg))
  }
}

/**
 * 获取参数
 * @param {Object} item 对应antd的校验参数
 */
function getOpt(item) {
  const {
    key,
    fnKey,
    msg,
    required
  } = item
  const isRequired = typeof required === 'undefined' ? true : required
  const opt = {
    required: isRequired,
    message: msg
  }
  if (key || fnKey) {
    opt.validator = formValidateGene(fnKey || key, msg, isRequired)
  }
  return opt
}

/**
 * 获取校验参数
 * @param {Object} opt 参数
 * @param {Array} 返回一个数组
 */
export default function getRules(opt) {
  const obj = {}
  for (const [k, v] of Object.entries(opt)) {
    const rules = []
    let validateTrigger
    if (v instanceof Array) {
      for (const e of v.values()) {
        rules.push(getOpt(e))
        validateTrigger = e.validateTrigger
      }
    } else if (v && typeof v === 'object') {
      rules.push(getOpt(v))
      validateTrigger = v.validateTrigger
    }
    obj[k] = [
      k,
      {
        rules,
        validateFirst: true,
        validateTrigger
      }
    ]
  }

  return obj
}
