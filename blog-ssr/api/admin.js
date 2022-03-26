import { service as request } from '~/plugins/axios'

export function addCat(data) {
  return request({
    url: '/addCat',
    method: 'POST',
    data
  })
}

export function deleteCat(data) {
  return request({
    url: '/deleteCat',
    method: 'POST',
    data
  })
}

export function editCat(data) {
  return request({
    url: '/editCat',
    method: 'POST',
    data
  })
}

export function addArt(data) {
  return request({
    url: '/addArt',
    method: 'POST',
    data
  })
}

export function deleteArt(data) {
  return request({
    url: '/deleteArt',
    method: 'POST',
    data
  })
}

export function editArt(data) {
  return request({
    url: '/editArt',
    method: 'POST',
    data
  })
}

export function uploadImage(data) {
  return request({
    url: '/uploadImage',
    method: 'POST',
    data
  })
}
