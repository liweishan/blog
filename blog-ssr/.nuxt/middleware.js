const middleware = {}

middleware['cookie'] = require('..\\middleware\\cookie.js')
middleware['cookie'] = middleware['cookie'].default || middleware['cookie']

middleware['route'] = require('..\\middleware\\route.js')
middleware['route'] = middleware['route'].default || middleware['route']

export default middleware
