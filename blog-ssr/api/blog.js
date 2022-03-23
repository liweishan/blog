import request from '@/utils/request'

export function getArt(params) {
  return request({
    url: '/getArt',
    params
  })
}

export function getArtDetails(artId) {
  return request({
    url: `/getArtDetails?art_id=${artId}`
  })
}

export function getCat() {
  return request({
    url: '/getCat'
  })
}

export function getComment(artId) {
  return request({
    url: `/getComment?art_id=${artId}`
  })
}

export function addComment(data) {
  return request({
    url: '/addComment',
    method: 'POST',
    data
  })
}

export function readnum(data) {
  return request({
    url: '/readnum',
    method: 'POST',
    data
  })
}
