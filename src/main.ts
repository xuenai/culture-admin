/*
 * @Author: Hexg
 * @Date: 2019-06-28 09:16:34
 * @Last Modified by: Hexg
 * @Last Modified time: 2020-04-13 12:44:14
 */
import Vue, { CreateElement } from 'vue';
import App from './App.vue';
import store from '@/store';
import router from '@/router/index';
// 全局引入iview
import iView from 'iview';
import VueDND from 'awe-dnd'
// import 'iview/dist/styles/iview.css';
import '@/assets/styles/global.scss';
import '@/assets/styles/iview.less';
import '@/assets/styles/normalize.css';

import { AppModule } from "@store/modules/app";
 
import { cookies, session } from '@util/util'
import {auth, regPath} from '@util/routerBeforeEach'

// 自定义组件引入
import phone from '@components/unNecessaryPhoneInput/index'
import number from '@components/unNecessaryNumberInput/index'
import '@babel/polyfill';

// 注册组件内部路由钩子
import Component from 'vue-class-component';
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
]);

Vue.use(phone)
Vue.use(number)
Vue.use(iView);
Vue.use(VueDND)

// 引入路由
// 云端路由
import cloudRoutes from '@router/cloud/cloud'
// 站点端路由
import siteRoutes from '@router/site/index'
// 企业端路由
import companyRoutes from '@router/company/index'

// 根据环境变量动态添加路由
switch (process.env.VUE_APP_STATUS) {
  case 'CLOUD':
    router.addRoutes(cloudRoutes);
    break;
  case 'SITE':
    router.addRoutes(siteRoutes);
    break;
  case 'COMPANY':
    router.addRoutes(companyRoutes);
    break;
}

// http://192.168.2.158:8080/#/?JSESSIONID=1357dc86-ed79-4313-a3bb-8a4eea0b0c58
router.beforeEach(async (to, from, next) => {
  // @ts-ignore
  iView.LoadingBar.start()
  // 验证token 设置权限 设置菜单选中 设置跳转路径
  auth(to, from, next).then(() => {
    regPath(to, next);
  })
})

router.afterEach(route => {
  if (cookies.get(`${process.env.VUE_APP_STATUS}_TOKEN`)) {
    AppModule.changeUserLoginStatus(true)
  }
  if (route.path === '/login') {
    AppModule.setAppToken("");
  }
  // @ts-ignore
  iView.LoadingBar.finish();
  AppModule.setAppFixedLoadingStatus(false)
})
let bus = new Vue();
Vue.config.productionTip = false;
Vue.prototype.$cookies = cookies
Vue.prototype.$session = session
Vue.prototype.bus = bus;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
