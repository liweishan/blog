export default function rem (designWidth, maxWidth) {
  const doc = document
  const win = window
  const docEl = doc.documentElement
  const remStyle = document.createElement('style')
  let tid = null

  // 浏览器竖屏与横屏转换的BUG。
  function refreshRem () {
    let width = docEl.getBoundingClientRect().width
    maxWidth = maxWidth || 540
    width > maxWidth && (width = maxWidth)
    const rem = width * 100 / designWidth
    remStyle.innerHTML = `html{font-size: ${rem}px;}`
  }

  if (docEl.firstElementChild) {
    docEl.firstElementChild.appendChild(remStyle)
  } else {
    let wrap = doc.createElement('div')
    wrap.appendChild(remStyle)
    doc.write(wrap.innerHTML)
    wrap = null
  }
  // 要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
  refreshRem()

  win.addEventListener('resize', function () {
    // 防止执行两次
    clearTimeout(tid)
    tid = setTimeout(refreshRem, 300)
  }, false)

  win.addEventListener('pageshow', function (e) {
    // 浏览器后退的时候重新计算
    if (e.persisted) {
      clearTimeout(tid)
      tid = setTimeout(refreshRem, 300)
    }
  }, false)

  if (doc.readyState === 'complete') {
    doc.body.style.fontSize = '16px'
  } else {
    doc.addEventListener('DOMContentLoaded', function (e) {
      doc.body.style.fontSize = '16px'
    }, false)
  }
}
