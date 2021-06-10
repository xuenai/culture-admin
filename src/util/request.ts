/*
 * @Author: Hexg
 * @Date: 2019-07-10 20:21:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-08-05 20:22:37
 */

import axios, { AxiosRequestConfig, Canceler } from 'axios'
import qs from 'qs'
import router from '@/router/index'
import CONFIG from '@/util/config'
import { cookies } from '@util/util'
import { AppModule } from "@store/modules/app";
import iView from 'iview';
import {downFile} from '@util/util';

const REPEAT_REQUST_MESSAGE = '重复请求取消'

interface PendingType {
  url: string
  func: Canceler
}

export interface ResponsePageType {
  currPage: number
  size: number
  totalPage: number
  totalSize: number
}

export interface ResponseDataType {
  code?: number | string // 小电商返回的code为字符串
  message?: string
  data?: any
  datas?: []
  page?: ResponsePageType
  msg?: string // 小电商接口返回的消息
}

interface RequestConfig extends AxiosRequestConfig {
  [propName: string]: any
}
/**
 * 消息统一处理
 * @param msg string 需要提示的消息
 */
const tip = (msg: string, type?: string) => {
  if (!type) {
    // @ts-ignore
    iView.Message.error(msg);
  } else {
    // @ts-ignore
    iView.Message.success(msg);
  }
}



/**
 * 请求失败后的错误统一处理
 * @param status 网络请求失败的状态码
 * @param othen 另外需要提示的消息
 */
const errorHandle = (status: number, other: any) => {
  switch (status) {
    // 404请求不存在
    case 404:
      tip('网络请求不存在');
      break;
    // 500 请求超时
    case 500:
      tip('网络请求超时');
      break;
    // 504 请求超时
    case 504:
      tip('网络请求超时');
      break;
    // 其他错误，直接抛出错误提示
    default:
      tip(other);
  }
}

let CancelToken = axios.CancelToken
let pending: Array<PendingType> = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax
/**
 * 统一取消重复操作
 * @param config axios的config参数 判断数组中是否存在相同的请求 如果有则执行axios的cancelToken方法
 */
let removePending = (config: AxiosRequestConfig) => {
  for (let p in pending) {
    let params = qs.stringify(config.params)
    let data = qs.stringify(config.data)
    // console.log(`${config.url}&${config.method}&${params}${data}`)
    if (pending[p].url === `${config.url}&${config.method}&${params}${data}`) { //当当前请求在数组中存在时执行函数体
      let msg = `${REPEAT_REQUST_MESSAGE}: ${config.url}`
      // console.error(pending[p].url)
      pending[p].func(msg); //执行取消操作
      pending.splice(parseInt(p), 1); //把这条记录从数组中移除
    }
  }
}
// 设置请求的默认接口
axios.defaults.baseURL = CONFIG.defaultUrl
// 设置请求的过期时间
axios.defaults.timeout = 1000 * 60;
// axios.defaults.withCredentials = true;

// 设置请求拦截器
axios.interceptors.request.use(
  config => {
    let { noCancelRepeatRequest, isRequestPayload } = config as RequestConfig
    // 判断当前接口是否需要取消重复操作
    if (!noCancelRepeatRequest) {
      removePending(config)
      config.cancelToken = new CancelToken(c => {
        let params = qs.stringify(config.params)
        let data = qs.stringify(config.data)
        pending.push({
          url: `${config.url}&${config.method}&${params}${data}`,
          func: c
        })
      })
    }
    // 小电商接口直接返回 不额外进行修改
    if ((config.baseURL as string).indexOf(CONFIG.elecRequestUrl) === 0) {
      if (config.method === 'post') {
        config.headers['Content-Type'] = 'application/json'
      }
      config.transformRequest = [function (data) {
        return JSON.stringify(data)
      }]
      return config
    }
    // 不是小电商接口
    let params = {
      token: cookies.get(`${process.env.VUE_APP_STATUS}_TOKEN`)
    }
    // 当发送post请求时,判断请求的接口是哪儿的 然后加上不同的请求头信息 同时加上token
    if (config.method === 'post' && (config.url as string).indexOf('http') === -1) {
      // 判断是不是上传文件的接口
      let { isUploadFile, contentTypeIsJson } = config as RequestConfig
      if (isUploadFile) {
        config.headers['Content-Type'] = 'multipart/form-data;charset=UTF-8'
      } else if (contentTypeIsJson) { // 接口接受内容类型为application/json
        config.url += `?token=${params.token}`
        config.headers['Content-Type'] = 'application/json'
        // config.data = Object.assign(params, config.data)
      } else {
        // 判断是否要更改data类型
        if (!isRequestPayload) {
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
          config.data = Object.assign(params, config.data)
          config.transformRequest = [function (data) {
            return qs.stringify(data)
          }]
        } else {
          config.params = params
        }
      }
    } else if (config.method === 'get') {
      // get请求时加上token
      // config.params.token = cookies.get('token')
      config.params = Object.assign(params, config.params)
    }
    let { isUploadFile } = config as RequestConfig
    if (isUploadFile) {
      config.responseType = 'blob'
    }
    return config
  },
  error => Promise.reject(error)
)

// 设置请求响应拦截器
axios.interceptors.response.use(
  response => {
    let { config, data, headers } = response
    // 在一个ajax响应后再执行一次取消操作，把已经完成的请求从pending中移除
    let { noCancelRepeatRequest, isExportExcel } = config as RequestConfig
    if (!noCancelRepeatRequest) {
      removePending(config);
    }
    const res = data;
    let contentType = headers['content-type'];
    const contentDisposition = headers['content-disposition'];
    if  (response.request.responseType === 'blob') {
      // 返回来的数据是blob文件并不是json 执行下载
      const blob = new Blob([res], { type: contentType });
      if (contentDisposition) {
        let fileName = 'unknown';
        if (contentDisposition) {
          fileName = decodeURI(contentDisposition.split('=')[1]);
        }
        downFile(blob, fileName);
        if (!isExportExcel) {
          tip('导入失败，失败数据清单已生成')
        }
        return {
          code: 0
        }
      } else {
        return blob
      }
    } else {
      return res
    }
  },
  error => {
    const { response } = error;
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      tip('请求超时');
      return Promise.reject(error.message);
		}
    if (response) {
      errorHandle(response.status, response.data.message)
      return Promise.reject(error.response);
    } else {
      // 优先判断是否是重复请求取消了
      if (error.message.includes(REPEAT_REQUST_MESSAGE) > -1) {
        console.warn(error.message)
        return Promise.reject(error.message);
      }
      // 处理断网的情况
      tip('网络连接失败')
    }
  }
);


/**
 * 统一封装的请求
 * 如果config中包含 noCancelRepeatRequest:true 键值对 则该请求不取消重复请求
 * 如果是使用文化旅游云本身接口 且config中包含 isUploadFile: true 键值对时 则更改请求的content-type格式
 * 如果接口需要覆盖整个屏幕的loading， 在config中加上loading: true
 * 如果config中有 isExportExcel: true  则请求直接导出文件并且不会做提示
 * 如果config中有 noMessage: true 则不展示code不为0的消息提示
 * 如果config中有 loading：true 自动展示加载动画
 * 如果config中有 isRequestPayload: true， data不会变为formData格式使用的是requestPayload
 * @param config axios的config
 * @param isElec {boolean} 是否是小电商 小电商请求不处理不对response做处理
 */
const request = (config: RequestConfig, isElec: boolean = false): Promise<ResponseDataType> => {
  // 设置请求的接口
  if (isElec) {
    axios.defaults.baseURL = CONFIG.elecRequestUrl
    config.noCancelRepeatRequest = true
  } else {
    axios.defaults.baseURL = CONFIG.defaultUrl
  }
  return new Promise(async (resolve, reject) => {
    // 展示蒙层
    if (config.loading) {
      AppModule.setAppFixedLoadingStatus(true)
    }
    const ajax = () => {
      axios(config).then((res: ResponseDataType) => {
        if (config.loading) {
          AppModule.setAppFixedLoadingStatus(false)
        }
        // 不是小电商
        if (!isElec) {
          // 判断token是否过期 token过期 站点端跳转企业应用中心 企业端、云端跳转登录页面
          if (res && res.code === 2) {
            // 清空老的token信息
            AppModule.setAppToken('');
            cookies.remove(`${process.env.VUE_APP_STATUS}_TOKEN`);
            cookies.remove(`sessionId`);
            // 重新进行跳转
            // router.push({ path: '/login' })
            if (process.env.VUE_APP_STATUS === 'SITE') {
              // window.location.href = CONFIG.elecLoginUrl + '/login'
              let jkbBackUrl = cookies.get('getJkbBackUrl');
              if (jkbBackUrl && jkbBackUrl !== 'undefined') {
                window.location.href = jkbBackUrl;
              } else {
                window.location.href = CONFIG.elecLoginUrl + '/login'
              }
            } else {
              router.push({ path: '/login', query: { redirect: router.currentRoute.fullPath } })
            }
          }
          if (res && res.code === 1) {
            if (!config.noMessage) {
              tip(res.message || '接口出错')
            }
          }
        }
        resolve(res)
      }).catch(err => {
        if (config.loading) {
          AppModule.setAppFixedLoadingStatus(false)
        }
        reject(err)
      })
    }
    ajax();
  })
}

export default request
