import {ACTIVITY_TYPE, ACTIVITY_METHOD, AUDIT_DATA_STATUS} from "@constant/index"
// 去除收尾空格
import number from "@/components/unNecessaryNumberInput";
import { uploadImage } from "@service/content";
function trim(str: any) {
  return str.replace(/(^\s*)|(\s*$)/g, "")
}

// 字符串验证
function validate(value: any, type: String) {
  value = trim(value)
  // 非空验证
  if ('require' === type) {
    return !!value
  }
  // 手机号验证
  if ('phone' === type) {
    return /^1\d{10}$/.test(value)
  }
  // 邮箱格式验证
  if ('email' === type) {
    return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value)
  }
  // 邮政编码
  if ('zipCode' === type) {
    return /^[0-9][0-9]{5}$/.test(value)
  }
}

// 过滤特殊字符
function filterChar(val: string) {
  let regEmoji = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g
  let reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！%@#￥……&*（）——|{}【】‘；：”“'。，、？]", 'g')
  if (regEmoji.test(val) || reg.test(val)) {
    val = val.replace(regEmoji, '')
    val = val.replace(reg, '')
  }
  return val
}

// 获取region及parents的region信息
function getParentsRegion(region: string | number): Array<object> {
  let resArr = [],
    curr = city[region];
  while (curr && curr.region !== '000000') {
    resArr.push(curr)
    curr = city[curr.parent]
  }
  return resArr
}

// 判断region级别 0为区， 1为市， 2为省
function getRegionLevel(region: string | number): number {
  let reg = /[0]{2,4}$/g; //检测省市区
  region = region.toString();
  let matchRes = region.match(reg);
  let length = (matchRes === null) ? 0 : matchRes[0].length; //4,2,0
  return Math.floor(length / 2);
}

/**
 * 导入excel表格，然后进行的函数
 * @param blob {blob对象} 返回的数据 需要解析文件中的json
 * @param callback 解析blob对象后执行的回调
 */
const importExcelComplete = (blob: Blob) => {
  return new Promise((resolve, reject) => {
      if (blob) {
          var reader = new FileReader();
          reader.onloadend = function (ev) {
              let res = JSON.parse(reader.result as string)
              if (res.code === 0) {
                  resolve()
              } else {
                reject(res)
              }
          }
          reader.readAsText(blob);
      }
  })
}

/**
 * getUrlParam 获取url参数
 * @parmas {sting} name 参数名字
 * @returns {string}
 */
const getUrlParam = (name:string) => {
  // @ts-ignore
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}

// 导出数据
const exportExcel = (url: string) => {
    let a: any = document.createElement("a");
    a.setAttribute("download", "");
    a.setAttribute("href", url);
    // a.setAttribute("target", '_blank');
    a.click();
    a = null;
}

// 格式化日期
const formatterDate = (stamp: number) => {
  let date = new Date(stamp)
  return date.getFullYear() + '-' + ('0' + (1 + date.getMonth())).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2)
}

// 根据code获取状态描述
const getStatusTxt: {
  [propName: number]: any,
  [propName: string]: any
} = {
  ...AUDIT_DATA_STATUS,
  ...ACTIVITY_METHOD,
  ...ACTIVITY_TYPE
}

// 根据活动方式、类型获取对应的编辑页路径
const getActivityEditPath = (data: any) => {
    let path: string = '';
    if (['ACTIVITY_MODE_VOLUNT'].indexOf(data.method) > -1) {
      path = '/edit-activity-volunt'
    } else if (['ACTIVITY_MODE_ENROLL_PAY', 'ACTIVITY_MODE_INTEGRAL_PAY'].indexOf(data.method) > -1) {
      path = '/edit-money-activity'
    } else if (['ACTIVITY_MODE_OTHER'].indexOf(data.method) > -1) {
      path = '/edit-activity-other'
    } else if (['ACTIVITY_MODE_SERVICE'].indexOf(data.method) > -1) {
      path = '/edit-ordinary'
    } else {
      path = '/ac-free-edit'
    }
    return path
}

// 获取媒体资源时长
enum MediaType {
  video = "video",
  audio = "audio",
}
function getTime (file: File): Promise<{file: any, duration: number, name: string}>
function getTime (url: string, type: MediaType): Promise<{file: any, duration: number, name: string}>
function getTime (file: any, type?: MediaType): Promise<{file: any, duration: number, name: string}> {
  return new Promise((resolve, reject) => {
    let src = ''
    let ele: MediaType
    if (typeof file === 'string') {
      src = file
      ele = type as MediaType
    } else {
      let match = /video|audio/.exec(file.type)
      if (match) {
        src = URL.createObjectURL(file)
        ele = match[0] as MediaType
      } else {
        reject('文件类型不合法')
        return
      }
    }
    let dom: HTMLAudioElement | HTMLVideoElement | null = document.createElement(ele) as HTMLAudioElement | HTMLVideoElement;
    dom.src = src;
    dom.addEventListener("loadeddata", function () {
      if (typeof file === 'string') {
        resolve({
          name: '',
          // @ts-ignore
          duration: this.duration,
          file: null
        })
      } else {
        URL.revokeObjectURL(src)
        resolve({
          name: file.name,
          // @ts-ignore
          duration: this.duration,
          file
        })
      }
      dom = null
    })
    dom.addEventListener("error", function () {
      reject('文件加载失败')
    })
  })
}

// 上传文件
function uploadFile (data: File): Promise<string>
function uploadFile (data: Blob, name: string): Promise<string>
function uploadFile (data: any, name?: string): Promise<string> {
  let formData = new FormData();
  if (name) {
    formData.append("Filedata", data, name);
  } else {
    formData.append("Filedata", data);
  }
  formData.append("path", "cultural-tourism-cloud");
  return uploadImage(formData).then((res:any) => res.safeUrl)
}

// 获取视频封面图
function getVideoCover (file: File): Promise<{file: any, duration: number, cover: string, name: string}>
function getVideoCover (url: string): Promise<{file: any, duration: number, cover: string, name: string}>
function getVideoCover (file: any): Promise<{file: any, duration: number, cover: string, name: string}> {
  return new Promise((resolve, reject) => {
    let url = ''
    if (typeof file === 'string') {
      url = file
    } else {
      if (/video/.exec(file.type)) {
        url = URL.createObjectURL(file)
      } else {
        reject('文件类型不合法')
        return
      }
    }
    let video = document.createElement("video");
    video.src = url;
    video.play()
    video.crossOrigin = 'Anonymous'
    video.addEventListener("loadeddata", function () {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let w = this.videoWidth;
        let h = this.videoHeight;
        this.width = canvas.width = w;
        this.height = canvas.height = h;
        // @ts-ignore
        ctx.drawImage(this, 0, 0, w, h);
        setTimeout(() => {
          if (typeof file !== 'string')  URL.revokeObjectURL(url)
          let duration = this.duration;
          canvas.toBlob((blob) => {
            let name = '未命名'
            let r = /(.*)\.[a-zA-Z]+$/.exec(file.name)
            if (r) name = r[1];
            uploadFile((blob as Blob), name + '.jpeg').then((url: string) => resolve({
              cover: url,
              name: name + '.jpeg',
              duration,
              file
            }))
          }, 'image/jpeg', 1)
        }, 20)
    })
    video.addEventListener("error", function () {
      reject('播放出错')
    })
  })
}

export {
  trim,
  validate,
  filterChar,
  getParentsRegion,
  importExcelComplete,
  getUrlParam,
  exportExcel,
  formatterDate,
  getStatusTxt,
  getActivityEditPath,
  getRegionLevel,
  getTime,
  getVideoCover,
  uploadFile
}
