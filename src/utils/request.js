import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { windowOpen } from '@/apis/index'
import router from '@/router/index'

const WHITE_LISTS = ['/sso/toLogin', '/sso/api/logout']

/**
 * 控制请求重试
 * @param {*} adapter 预增强的 Axios 适配器对象；
 * @param {*} options 缓存配置对象，该对象支持 2 个属性，分别用于配置不同的功能：
 *                      times：全局设置请求重试的次数；
 *                      delay：全局设置请求延迟的时间，单位是 ms。
 * @returns
 */
function retryAdapterEnhancer (adapter, options) {
  const { times = 0, delay = 300 } = options

  return async (config) => {
    const { retryTimes = times, retryDelay = delay } = config
    let __retryCount = 0

    const request = async () => {
      try {
        return await adapter(config)
      } catch (err) {
        if (!retryTimes || __retryCount >= retryTimes) {
          return Promise.reject(err)
        }

        __retryCount++

        // 延时处理
        const delay = new Promise((resolve) => {
          setTimeout(() => {
            resolve()
          }, retryDelay)
        })

        // 重新发起请求
        return delay.then(() => {
          return request()
        })
      }
    }

    return request()
  }
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  adapter: retryAdapterEnhancer(axios.defaults.adapter, {
    retryDelay: 1000
  })
})

service.defaults.withCredentials = true

service.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// 请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
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
    const { data, config } = response

    console.log('响应信息：', response)

    // if the custom code is not 20000, it is judged as an error.
    if (config.responseType === 'blob') {
      // 下载请求，不抛错误
      return data
    }

    if (config.responseType === 'arraybuffer') {
      // 获取图片的二进制流
      return response
    }

    return data
  },
  error => {
    console.log('err>>>', error.response) // for debug
    // we can't seem to catch the 302 status code as an error,
    // however, since it redirects to another domain (login.microsoftonline.com) it causes
    // a CORS error which makes error.response be undefined here.  This assumes that any time
    // error.response is undefined that we need to redirect to the login page
    if (401 === error.response.status) {
      const { config } = error.response

      if (!WHITE_LISTS.includes(config.url)) {
        MessageBox.confirm('登录过期，是否重新登录？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确 认',
          cancelButtonText: '取 消'
        })
          .then(() => {
            router.replace("/").then(() => {
              Message({
                message: "退出成功",
                type: 'success',
                duration: 5 * 1000
              })
            })
          })
          .catch(action => {
            Message({
              message: "已取消",
              type: 'info',
              duration: 5 * 1000
            })
          })
      }

      // 401为未登录或者登录过期，需要把响应数据抛给then
      return Promise.resolve(error.response)
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  }
)

export default service
