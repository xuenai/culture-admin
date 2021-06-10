/*
 * @Author: Hexg
 * @Date: 2019-07-22 09:51:59
 * @Last Modified by: Hexg
 * @Last Modified time: 2020-02-26 20:56:48
 */
import { AppModule, breadcrumbType } from "@store/modules/app";
import { cookies } from '@util/util'
import { getUrlParam } from '@util/comm'
import CONFIG from '@util/config'
import { getTokenBySessionId, getUserMenu, getUserInfo, getSiteListForUser, getSiteInfoBySiteCode, getJkbBackUrl } from '@service/app'
import { getSiteUserInfo } from "@service/common";
import { Route, Location } from 'vue-router';
import Vue from 'vue';
import axios from 'axios'

// 不进行路由判断的路径
const unCheckRoutes = [
  '/login',
  '/error'
]

/**
 * auth 判断是否存在token，如果没有判断是不是商户中心跳转的，如果是商户中心进来的通过JSESSIONID获取token，如果不是跳转登录页，存在token执行下一步
 * @params to router.beforeEach的to
 * @params form router.beforeEach的from
 * @params next router.beforeEach的next
 */
const auth = (to: Route, from: Route, next: (to?: string | false | void | Location | ((vm: Vue) => any) | undefined) => void): Promise<any> => {
  // 先判断是否存在token
  // 先判断是商户中心进来的
  // 然后在获取token
  return new Promise((resolve, reject) => {

    // 判断是否是前往login页面
    if (unCheckRoutes.includes(to.path)) {
      resolve()
      document.title = to.meta.title
      return false;
    }

    // 判断是不是商户中心跳转过来的
    // 没有token 判断是否是是站点 商户中心跳转过来的
    isSiteVistor(next).then(() => {
      // 是商户中心过来的 且已经获取到了 token
      // 有token 获取菜单目录 用户站点列表 用户信息
      getNecessaryData(resolve, next, to)

    }).catch(() => {
      // 不是商户中心过来的 而且没有token 则跳转到登录页面
      checkToken().then(() => {
        // 有token 获取菜单目录 用户站点列表 用户信息
        getNecessaryData(resolve, next, to)
      }).catch(() => {
        // 没有token 跳转登录
        next({ path: '/login', query: { redirect: to.fullPath } })
      })
    })
  })
}

/**
 * checkToken 判断是否含有token
 */
const checkToken = () => {
  return new Promise((resolve, reject) => {
    let token = cookies.get(`${process.env.VUE_APP_STATUS}_TOKEN`)
    if (token) {
      resolve()
    } else {
      reject()
    }
  })
}
/**
 * isSiteVistor 判断是否是站点端访问者 如果是商户中心跳转过来的 则通过sessionid获取token
 * @param next router.beforeEach的next
 */
const isSiteVistor = (next: (to?: string | false | void | Location | ((vm: Vue) => any) | undefined) => void) => {
  return new Promise((resolve, reject) => {
    // 判断seesionId 是否存在 当前是站点端
    if (process.env.VUE_APP_STATUS === 'SITE') {
      let sessionId = getUrlParam('JSESSIONID');
      // 判断sessionid是否存在
      if (sessionId) {
        // sessionId 存在 通过sessionId 获取token
        // 首先清除以前的token
        getTokenBysession(sessionId, next).then(() => {
          resolve()
        })
      } else {
        // sessionId不存在 并且token不存在 跳转小电商重新登录
        checkToken().then(() => {
          resolve()
        }).catch(err => {
          // window.location.href = CONFIG.elecLoginUrl
          // 返回商户中心的url
          getJkbBackUrl().then(res => {
            if (res.code === 0) {
              if (Object.keys(res.data).length) {
                window.location.href = res.data.url;
              } else {
                window.location.href = CONFIG.elecLoginUrl
              }
            }
          })
        })
      }
    } else {
      // 不是商户中心过来的
      reject()
    }
  })
}
/**
 * getTokenBysession 通过sessionid 获取token
 * @param sessionId {string} sessionid
 * @param next router.beforeEach的next
 */
const getTokenBysession = (sessionId: string, next: (to?: string | false | void | Location | ((vm: Vue) => any) | undefined) => void) => {
  return new Promise((resolve, reject) => {
    getTokenBySessionId({ sessionId }).then(res => {
      if (res.code === 0) {
        cookies.set('sessionId', sessionId);
        AppModule.setAppToken(res.data.token);
        getJkbBackUrl().then(jkb => {
          if (jkb.code === 0) {
            // window.location.href = res.data.url;
            if (Object.keys(jkb.data).length) {
              cookies.set('getJkbBackUrl', jkb.data.url)
            }
          }
        })
        // next()
        resolve()
      } else if (res.code === 1) {
        next({ path: '/error', query: { msg: res.message, JSESSIONID: sessionId } })
      }
    }).catch(err => {
      next({ path: '/error', query: { msg: err, JSESSIONID: sessionId } })
    })
  })
}

/**
 * getNecessaryData 获取用户目录、用户站点列表、用户信息
 * @param resolve auth的resolve参数
 */
const getNecessaryData = (resolve: () => void, next: (to?: string | false | void | Location | ((vm: Vue) => any) | undefined) => void, to: Route) => {
  // 判断vuex中 是否已经存储了 用户信息 用户菜单目录 用户站点列表
  let { isReady } = AppModule
  // 获取过了 直接进行下一步
  if (isReady) {
    setDocumentTitle(to);
    resolve()
    return false;
  }
  // 不存在 重新进行获取 然后再进行下一步
  getNecessaryDataPromise(to).then(() => {
    resolve()
  }).catch(err => {
    next({ path: '/error', query: { msg: err } })
  })
}

/**
 * getNecessaryDataPromise 获取用户目录、用户站点列表、用户信息请求
 */
const getNecessaryDataPromise = (to: Route) => {
  return new Promise(async (resolve, reject) => {
    axios.all([
      getUserMenu({ type: process.env.VUE_APP_STATUS, firstShow: true }),
      getUserInfo(),
      getSiteListForUser({ pageSize: 1000 })
    ])
      .then(axios.spread((menuRes: any, infoRes: any, siteRes: any) => {
        if (menuRes.code === 0 && infoRes.code === 0 && siteRes.code === 0) {
          // 获取站点信息
          getSiteInfoAndSetAppModule(infoRes.data.siteId, to);
          AppModule.setNecessaryData({
            userInfo: infoRes.data,
            nav: menuRes.datas,
            siteList: siteRes.datas || []
          }).then(() => {
            resolve()
          })
        } else {
          // 三个必须的接口 有一个没返回数据 则执行
          reject('数据获取失败，请刷新页面')
        }
      }))
      .catch(err => {
        reject('数据获取失败，请刷新页面')
      })
  })
}

/**
 * getSiteInfoAndSetAppModule 获取站点信息 并且将信息保存到store里面
 * @param id 站点id
 */
const getSiteInfoAndSetAppModule = (id: string | number, to: Route) => {
  // 云端不用获取站点信息
  if (process.env.VUE_APP_STATUS === 'CLOUD') {
    return false;
  }
  getSiteUserInfo({ id }).then((res: any) => {
    if (res.code === 0) {
      AppModule.setAppSiteInfo(res.data);
      setTimeout(() => {
        setDocumentTitle(to);
      }, 200)
    }
  })
}

/**
 * setDocumentTitle 设置文档标题
 * @param to {Route} 前往的路由
 */
const setDocumentTitle = (to: Route) => {
  // 站点端和企业端走的不同路径需要获取不同的值
  // 站点端走的oem 企业端直接获取的 对应站点端的名字
  if (unCheckRoutes.includes(to.path)) {
    document.title = to.meta.title
    return false;
  }
  let appname = CONFIG.appname;
  switch(process.env.VUE_APP_STATUS) {
    case 'CLOUD': {
      let title = to.meta.title ? to.meta.title + '-' : ''
      document.title = `${title}${appname}`
      break;
    }
    case 'SITE': {
      // 判断 vuex中是否存在 oem配置信息
      let {name} = AppModule.siteInfo;
      let title = to.meta.title ? to.meta.title + '-' : ''
      if(name) {
        document.title = `${title}${name}`
      } else {
        document.title = to.meta.title || ''
      }
      break;
    }
    case 'COMPANY': {
      // 判断 vuex中是否存在站点相关信息
      let title = to.meta.title ? to.meta.title + '-' : ''
      let {mobileSiteInfo} = AppModule;
      if (Object.keys(mobileSiteInfo).length) {
        let {name} = AppModule.mobileSiteInfo;
        document.title = `${title}${name}`
      } else {
        getSiteInfoBySiteCode().then(res => {
          if (res.code === 0) {
            AppModule.setMobileSiteInfo(res.data)
            document.title = `${title}${res.data.name}`
          }
        })
      }
      break;
    }
    default:
      break;
  }
}

/**
 * regPath 匹配当前路由属于哪个菜单 然后设置菜单选中状态 并且设置对应的权限
 * @param to {Route} 前往的路由
 */
const regPath = (to: Route, next: (to?: string | false | void | Location | ((vm: Vue) => any) | undefined) => void) => {
  // 匹配当前路由属于哪个菜单 然后设置菜单选中状态
  let path = to.meta.menu || to.path
  let menus = AppModule.nav
  // console.log(AppModule.nav)
  // 菜单初始选中
  let index = {
    x: 0,
    y: -1,
    z: -1,
    f: -1
  }
  // 页面的操作权限
  let operates: Array<string> = []
  // 面包屑
  let breadCrumb: Array<breadcrumbType> = []

  if (path === '/sys-msg' || path === '/sys-msg-detail') {
    // 设置当前页面菜单选中下标
    AppModule.appMenuSelect({ x: -1, y: -1, z: -1, f: -1 })
    // 设置当前页面权限
    AppModule.appSetOperates([])
    if (path === '/sys-msg') {
      // 设置当前页面面包屑
      breadCrumb.push({
        name: to.meta.title,
        url: ''
      })
    } else {
      breadCrumb.push({
        name: '消息通知',
        url: '/sys-msg'
      })
      breadCrumb.push({
        name: to.meta.title,
        url: ''
      })
    }
    AppModule.appSetBreadCrumb(breadCrumb)
    next()
    return false
  }

  if (path === '/error' || path === '/404') {
    AppModule.appMenuSelect({ x: -1, y: -1, z: -1, f: -1 })
    AppModule.appSetOperates([])
    breadCrumb.push({
      name: to.meta.title,
      url: ''
    })
    AppModule.appSetBreadCrumb(breadCrumb)
    next()
    return false
  }

  // 第一次登陆应该进入
  if (path === '/') {
    if (menus.length === 0) {
      next({ path: '/' })
      return false;
    }

    if (menus.length && menus[0].menuType === 'MENU_OPERATION') {
      next({ path: menus[0].url })
      return false;
    } else if (menus.length && menus[0].child.length) {
      let { child } = menus[0]
      // 存在二级菜单
      if (child.length) {
        let childMenu = child[0];
        if (childMenu.menuType === "MENU_OPERATION") {
          next({ path: childMenu.url });
          return false;
        }
        // 存在三级菜单
        if (childMenu.child.length) {
          if (childMenu.child[0].menuType === "MENU_OPERATION") {
            next({ path: childMenu.child[0].url });
            return false;
          }
        }
      }
    }
  }
  // 第一层循环
  menus.length && menus.map((f: any, i: number) => {
    if (f.url === path || f.menuUrl === path) {
      index.x = i
      f.operates.length && f.operates.map((operate: any) => {
        operates.push(operate.operateCode)
      })
      breadCrumb.push({
        name: f.name,
        url: f.url || f.menuUrl
      })
      if (to.path !== f.url && to.path !== f.menuUrl) {
        breadCrumb.push({
          name: to.meta.title,
          url: ''
        })
      }
      return;
    }
    // 第二次循环
    f.child && f.child.map((s: any, j: number) => {
      if (s.url && s.url === path) {
        index.x = i
        index.y = j
        s.operates.length && s.operates.map((operate: any) => {
          operates.push(operate.operateCode)
        })
        breadCrumb.push({
          name: f.name,
          url: f.url || f.menuUrl
        })
        breadCrumb.push({
          name: s.name,
          url: s.url
        })
        if (to.path !== s.url) {
          breadCrumb.push({
            name: to.meta.title,
            url: ''
          })
        }
        return
      }
      // 第三次循环
      s.child && s.child.map((t: any, k: number) => {
        if (t.url && t.url === path) {
          index.x = i
          index.y = j
          index.z = k
          t.operates.length && t.operates.map((operate: any) => {
            operates.push(operate.operateCode)
          })
          breadCrumb.push({
            name: f.name,
            url: f.url || f.menuUrl
          })
          breadCrumb.push({
            name: s.name,
            url: s.url
          })
          breadCrumb.push({
            name: t.name,
            url: t.url
          })
          if (to.path !== t.url) {
            breadCrumb.push({
              name: to.meta.title,
              url: ''
            })
          }
          return
        }
        // 第四次循环
        t.child && t.child.map((n: any, l: number) => {
          if (n.url && n.url === path) {
            index.x = i
            index.y = j
            index.z = k
            index.f = l
            n.operates.length && n.operates.map((operate: any) => {
              operates.push(operate.operateCode)
            })
            breadCrumb.push({
              name: f.name,
              url: f.url || f.menuUrl
            })
            breadCrumb.push({
              name: s.name,
              url: s.url
            })
            breadCrumb.push({
              name: t.name,
              url: t.url
            })
            breadCrumb.push({
              name: n.name,
              url: n.url
            })
            if (to.path !== n.url) {
              breadCrumb.push({
                name: to.meta.title,
                url: ''
              })
            }
            return
          }
        })
      })
    })
  })
  // @ts-ignore
  // iView.Spin.hide()
  // 设置页面标题
  setDocumentTitle(to)

  // 设置当前页面菜单选中下标
  AppModule.appMenuSelect(index)
  // 设置当前页面权限
  AppModule.appSetOperates(operates)
  // 设置当前页面面包屑
  AppModule.appSetBreadCrumb(breadCrumb)
  next()
}

export {
  auth,
  regPath
}