export function getClientWidth() {
  return document.body.clientWidth
}

export function getClientHeight() {
  return document.body.clientHeight
}

export function hasPc() {
  const clientWidth = getClientWidth()
  return clientWidth >= 1200
}
