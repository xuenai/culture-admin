/*
 * @Author: Hexg 
 * @Date: 2019-06-17 17:26:28 
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-07-04 11:15:51
 */
// 企业端独有的路由
export default [
  {
    path: '/profile',
    name: 'profile',
    meta: {
      title: '概况'
    },
    component: () => import('@views/pages/public-profile/public-profile.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: () => import('@views/login/index.vue')
  },
  {
    path: '/alarm',
    name: 'alarm',
    meta: {
      menu: '/profile',
      title: '一键求助'
    },
    component: () => import('@views/pages/alarm/alarm.vue'),
  },
]