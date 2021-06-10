/*
 * @Author: Hexg
 * @Date: 2019-07-12 10:16:48
 * @Last Modified by: Hexg
 * @Last Modified time: 2020-04-10 15:11:00
 */
// export default {
//   // 用于src\components\ueditor\ueditor.vue文件 判断新增到富文本编辑器的iframe是测试环境的还是正式环境的
//   ueditorIsTest: true,
//   // defaultUrl: 'http://192.168.2.54:7030',
//   // defaultUrl: 'http://192.168.0.146:7030', // 开发环境
//   defaultUrl: 'http://ctc-api.test.daqsoft.com/v2/', // 测试环境
//   // defaultUrl: 'http://www.daqctc.com/api', // 正式
//   // websocketUrl地址
//   // websocketUrl: 'www.daqctc.com/websocket', // 正式环境ws
//   // websocketUrl: '',
//   // websocketUrl: '192.168.0.139:8000',
//   websocketUrl: '192.168.0.107:8000', // 测试环境
//   // websocketUrl: '192.168.2.17:8000',
//   // 小电商接口请求地址
//   // elecRequestUrl: 'http://api.jkxds.net', // 正式环境
//   elecRequestUrl: 'http://api.test.jkxds.net', // 测试环境
//   // 小电商登录接口
//   elecLoginUrl: 'http://test.jkxds.com/#/', // 测试
//   // elecLoginUrl: 'http://apps.daqsoft.com/#/', // 正式 商户中心
//   appname: '智慧文化旅游云',
//   region: 510500
// }

export default {
  // 正式环境
  // ueditorIsTest: false,
  // defaultUrl: 'http://www.daqctc.com/api',
  // websocketUrl: 'www.daqctc.com/websocket',
  // elecRequestUrl: 'http://api.jkxds.net',
  // elecLoginUrl: 'http://apps.daqsoft.com/#/',

  // defaultUrl: 'http://admin-ctc.dev.daqsoft.com/api/',
  // http://admin-ctc.dev.daqsoft.com/api/user/common/setJkbValid?f`lag=false
  // defaultUrl: 'http://10.252.251.32:7030',
  // defaultUrl: 'http://10.252.251.29:7030',
  // defaultUrl: 'http://10.252.251.38:7030',
  // websocketUrl: 'admin-ctc.dev.daqsoft.com/websocket/',


  // 测试环境
  ueditorIsTest: true,
  defaultUrl: 'http://ctc-api.test.daqsoft.com/v2/',
  // defaultUrl: 'http://10.252.251.29:80',
  // defaultUrl: 'http://wenhai.utools.club',
  websocketUrl: '10.252.252.14:8000',
  elecRequestUrl: 'http://api.test.jkxds.net',
  elecLoginUrl: 'http://test.jkxds.com/#/',


  appname: '智慧文化旅游云',
  region: 510500
}
