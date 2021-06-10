/*
 * @Author: Hexg
 * @Date: 2019-07-05 01:41:28
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-08-06 10:30:20
 */
import { VuexModule, Module, MutationAction, getModule, Action } from 'vuex-module-decorators'
import store from '@/store'
import {getUserMenu, getUserInfo, getSiteListForUser, switchSite, getTokenBySessionId } from '@service/app'

import {cookies} from '@util/util'
import router from '@/router/index';

interface navSelectedType {
  x: number
  y: number
  z: number
  f: number
}
export interface breadcrumbType {
  name: string
  url : string
}

export interface setCurrSite {
  idx: number;
  callback: () => void;
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule {
  // 页面是否请求了用户信息、菜单列表、站点列表
  public isReady = false;
  // 用户token
  public token:string = cookies.get(`${process.env.VUE_APP_STATUS}_TOKEN`) || ''
  // 默认未登录状态
  public userLoginStatus = false;
  // 当前选中的菜单下标
  public navSelected = {
    x: 0,
    y: -1,
    z: -1,
    f: -1
  }
  // 用户菜单列表
  public nav:Array<any> = []
  // 二级菜单
  get secNav () {
    return this.nav[this.navSelected.x] || {}
  }
  get region () {
    if (this.siteInfo) {
      let {region} = AppModule.siteInfo;
      return region;
    }
    return ''
  }
  get regionName () {
    if (this.siteInfo) {
      let {regionName} = AppModule.siteInfo;
      return regionName;
    }
    return ''
  }
  get regionPath() {
    if (this.siteInfo) {
        let {region} = AppModule.siteInfo;
        if (region) {
            let province = region.slice(0,2);
            let city = region.slice(0,4);
            // 直接是省
            if (region.slice(2, 6) === '0000') {
                return region
            }
            // 只到正常的市级
            if (region.slice(4, 6) === '00') {
                return `${province}0000,${city}00`
            }
            return `${province}0000,${city}00,${region}`
        }
    }
    return ''
}
  // 用户信息
  public userInfo:any = {}
  // 站点列表
  public siteList:Array<any> = []
  // 当前选中的站点下标
  get currSiteIndex () {
    if (this.siteList.length === 0 || this.userInfo.siteId === '') {
      return 0
    }
    return this.siteList.findIndex((e:any) => e.id === this.userInfo.siteId)
  }
  // 当前的权限
  public operates = []
  // 当前页面的面包屑
  public breadCrumb:Array<breadcrumbType> = []
  // home页面spin弹窗
  public fixedLoadingShow = false;
  // 页面刷新
  public refresh = false;
  // 当前页面刷新
  @MutationAction({mutate: ['refresh']})
  public async pageRefresh(refresh: boolean) {
    return {refresh}
  }
  // 设置home页面加载弹窗
  @MutationAction({mutate: ['fixedLoadingShow']})
  public async setAppFixedLoadingStatus(status: boolean) {
    return {fixedLoadingShow: status}
  }
  // 设置token
  @MutationAction({mutate: ['token']})
  public async setAppToken(token: string) {
    cookies.set(`${process.env.VUE_APP_STATUS}_TOKEN`, token)
    return {token}
  }
  @MutationAction({mutate: ['userInfo', 'nav', 'siteList', 'isReady']})
  public async setNecessaryData (data:any) {
    let {userInfo, nav, siteList} = data
    return {
      userInfo,
      nav,
      siteList,
      isReady: true
    }
  }
  // 站点信息
  public siteInfo:any = {}
  // 获取当前的站点信息
  @MutationAction({mutate: ['siteInfo']})
  public async setAppSiteInfo(siteInfo: any) {
    return {siteInfo}
  }
  // 获取当前的用户信息
  @MutationAction({mutate: ['userInfo']})
  public async setAppUserInfo(userInfo: any) {
    return {userInfo}
  }
  // 获取菜单目录
  @MutationAction({mutate: ['nav']})
  public async  setAppMenu (nav: Array<any>) {
    return {nav}
  }
  @Action
  public async getAppUserInfo () {
    getUserInfo().then(res => {
      if (res.code === 0) {
        this.setAppUserInfo(res.data)
      } else {
        router.push({path: '/error', query: {msg: res.message}})
      }
    }).catch(err => {
      router.push({path: '/error', query: {msg: err}})
    })
  }
  @Action
  public async getAppMenu (firstShow ?:boolean) {
    if (!firstShow) {
      firstShow = false
    }
    getUserMenu({type: process.env.VUE_APP_STATUS, firstShow}).then(res => {
      if (res.code === 0) {
        this.setAppMenu(res.datas || [])
      } else if (res.code ===1 && firstShow) {
        router.push({path: '/error', query: {msg: res.message}})
      }
    }).catch(err => {
      if (firstShow) {
        router.push({path: '/error', query: {msg: err}})
      }
    })
  }
  // 获取当前站点信息
  @MutationAction({mutate: ['siteList']})
  public async setAppSiteList (siteList: Array<any>) {
    return {siteList}
  }
  @Action
  public async getAppSiteList (params: object) {
    getSiteListForUser(params).then(res => {
      if (res.code === 0) {
        this.setAppSiteList(res.datas || [])
      } else if (res.code === 1) {
        router.push({path: '/error', query: {msg: res.message}})
      }
    })
  }
  // 站点切换
  @Action
  public async appCurrSiteChange(params: setCurrSite) {
    this.setAppFixedLoadingStatus(true);
    switchSite({siteId: this.siteList[params.idx].id}).then(res => {
      if (res.code === 0) {
        this.getNewData(params.callback);
      }
    })
  }
  //
  @Action
  public async getNewData (callback: () => void) {
    await this.getAppUserInfo();
    await this.getAppMenu();
    setTimeout(() => {
      this.setAppFixedLoadingStatus(false);
      callback()
    }, 600)
  }

  // 菜单选择
  @MutationAction({mutate: ['navSelected']})
  public async appMenuSelect (payload: navSelectedType) {
    return {navSelected: payload}
  }
  // 设置权限
  @MutationAction({mutate: ['operates']})
  public async appSetOperates (payload: Array<string>) {
    return {operates: payload}
  }
  // 设置面包屑
  @MutationAction({mutate: ['breadCrumb']})
  public async appSetBreadCrumb (payload: Array<breadcrumbType>) {
    return {breadCrumb: payload}
  }
  // 登出操作
  @MutationAction({mutate: ['token', 'userInfo', 'siteList', 'nav', 'isReady']})
  public async appLogout () {
    return {
      token: '',
      userInfo: {},
      siteList: [],
      nav: [],
      isReady: false
    }
  }
  @MutationAction({mutate: ['userLoginStatus']})
  public async changeUserLoginStatus(status: boolean) {
    return {
      userLoginStatus: status
    }
  }
  // 通过sessionid获取token
  @Action
  public async getAppTokenBySessionId (sessionId: string) {
    getTokenBySessionId({sessionId}).then(res => {
      if (res.code === 0) {
        this.setAppToken(res.data.token)
      } else if (res.code === 1) {
        router.push({path: '/error', query: {msg: res.message}})
      }
    })
  }

  mobileSiteInfo:any = {}
  @MutationAction({mutate: ['mobileSiteInfo']})
  async setMobileSiteInfo (mobileSiteInfo: any) {
    return {
      mobileSiteInfo
    }
  }
}

export const AppModule = getModule(App)