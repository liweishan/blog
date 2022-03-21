import axios from 'axios'
// import { Message } from 'ant-design-vue'
// import store from '@/store'
let lock = true
const axiosSource = axios.CancelToken.source()
// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASEURL, // url = base url + request url
  baseURL: process.env.NUXT_ENV.baseURL, // url = base url + request url
  // baseURL: 'http://liweishan.top:8000', // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  cancelToken: axiosSource.token
  // timeout: 5000 // request timeout
})
// axiosSource.cancel() // 调用这个方法关闭请求
// let loadingInstance  = null
// request interceptor
service.interceptors.request.use(
  config => {
    if (config.isLock) {
      if (!lock) return {}
      lock = false
    }
    // do something before request is sent
    // if (store.getters.token) {
    //   config.headers.token = store.getters.token
    // }
    return config
  },
  error => {
    lock = true
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    lock = true
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // Message.error(res.message || 'error')
      return Promise.reject(res.message || 'error')
    }
    return res
  },
  error => {
    lock = true
    const data = error.response && error.response.data
    if (data) {
      // const message = data.error && data.error.message // error一般是网络问题
      // Message({
      //   content: message || 'error',
      //   top: '100px',
      //   duration: 3
      // })
    }
    return Promise.reject(data)
  }
)

export default service
