/*
 * @Author: 任智勇
 * @since: 2019-07-10 09:14:25
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-17 14:59:29
 */
// var serverUrl = 'http://192.168.0.146:7030';  // 统一接口请求地址 - 测试
var serverUrl = 'http://ctc-api.test.daqsoft.com/v2/';
// var serverUrl = 'http://www.daqctc.com/api';  // 统一接口请求地址 - 正式
// var elecServerUrl = 'http://192.168.0.208:9002';  // 小电商接口请求地址
// var elecServerUrl = 'http://api.jkxds.net';  // 小电商接口请求地址 - 正式
var elecServerUrl = 'http://api.xds.daqsoft.com';  // 小电商接口请求地址 - 测试
var server = '' // c端地址域名，用来跳转活动、场所的页面地址

window.utils = {
  dataRoute: '',
  //请求方法
  getAjaxData: function (data, fun) {
    var _this = this;
    $.ajax({
      type: data.type || 'get',
      url: data.url,
      data: data.data,
      async: data.async,
      success: function (result) {
        if (fun) {
          fun(result);
        }
      },
      error: function (e) {
        console.log(e);
      },
      beforeSend: function () {
        if (data.before) {
          data.before()
        }
      },
      complete: function () {
        if (data.complete) {
          data.complete()
        }
      }

    });
  },
  // 给body加上点击事件
  addBodyEvent: function () {
    $('body').on('click', function () {
      var route = utils.dataRoute;
      var url = window.top.location.origin + '/#/' + route;
      /**
       * 判断是不是微信浏览器 是返回true 不是返回false
       */
      function isWechatBrowsers() {
        let ua = navigator.userAgent.toLowerCase()
        if (ua.indexOf('micromessenger') !== -1) {
          return true
        } else {
          return false
        }
      }
      /**
       * 未登录 跳转登录页面
       */
      function goLoginPage () {
        if (isWechatBrowsers()) {
          // 微信环境绑定手机号页面
          window.top.location.href = window.top.location.origin + '/#/' + 'bind-phone/-1'
        } else {
          // 非微信环境登录页面
          window.top.location.href = window.top.location.origin + '/#/' + 'login'
        }
      }

      // 判断链接是否是完整的网页链接 如果是 则是跳转小电商的
      if (route.indexOf('http') > -1) {
        let userInfo = JSON.parse(window.top.localStorage.getItem('cloudUserInfo'))
        // 用户信息不存在 跳转登录页面
        if (!userInfo) {
          goLoginPage();
          return false;
        }
        // 判断是否存在unid 和 userCenterToken
        let unid = userInfo.unid;
        let userCenterToken = userInfo.userCenterToken;
        // 用户未登录
        if (!unid || !userCenterToken) {
          goLoginPage();
          return false;
        }
        // window.top.location.href = route + `&unid=${unid}&token=${userCenterToken}`;
        window.top.location.href = route + '&unid=' + unid + '&token=' + userCenterToken;
      } else {
        window.top.location.href = url;
      }
    })
  },
  /* 获取url中参数 */
  getQueryVariable: function (variable) {
    // url解码中文字符
    var query = decodeURIComponent(window.location.search.substring(1));
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return "";
  }
}
$(function () {
  utils.addBodyEvent();
})