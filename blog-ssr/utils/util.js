
/**
 * 补零
 * @param {Number|String} num Number或者字符串数字
 * @return {String} 返回一个字符串
 */
export function zeroize(num) {
  if (num <= 9) {
    return `0${num}`
  }
  return `${num}`
}

/**
 * 格式化时间
 * @param {String} format 格式化规则
 * @param {Number|Null} times 需要格式化的时间戳，默认当前时间
 * @return {String} format 操作之后的值
 */
export function getFormatTime(format, times) {
  let oDate
  if (!times) {
    oDate = new Date()
  } else {
    oDate = new Date(times)
  }
  const year = oDate.getFullYear()
  const month = oDate.getMonth() + 1
  const day = oDate.getDate()
  const hour = oDate.getHours()
  const minute = oDate.getMinutes()
  const second = oDate.getSeconds()
  const formats = ['Y', 'M', 'D', 'h', 'm', 's']
  const returnArr = [year, month, day, hour, minute, second]
  for (const [i, v] of returnArr.entries()) {
    format = format.replace(formats[i], zeroize(v))
  }

  return format
}

/**
 * 深度拷贝
 */
export function getCopyObj(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 倒计时
 * @param {Number} num 倒计时的值
 */
export function countDown(num, callback) {
  let tid = null
  let isLock = true
  let start = null
  let close = () => {
    isLock = false
    num = -1
    clearTimeout(tid)
    close = null
    start = null
  }

  start = () => {
    if (num < 0 || !isLock) {
      if (close) close()
      return
    }
    callback(num, close)
    tid = setTimeout(() => {
      num -= 1
      // 暴露一个close方法用于关闭倒计时
      start()
    }, 1000)
  }
  start()
}
