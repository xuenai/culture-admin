/*
 * @Author: Hexg 
 * @Date: 2019-06-17 17:11:17 
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-07-05 10:18:32
 */
// 公共部分的路由
import {RouteConfig} from 'vue-router'
const commonRoutes:Array<RouteConfig> = [
  {
    path: '/sys-msg',
    name: 'sys-msg',
    meta: {
      title: '消息通知'
    },
    component: () => import('@views/pages/msg/sys-msg/index.vue')
  },
  {
    path: '/sys-msg-detail',
    name: 'sys-msg-detail',
    meta: {
      title: '通知详情'
    },
    component: () => import('@views/pages/msg/sys-msg-detail/index.vue')
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '404'
    },
    component: () => import('@views/404/index.vue')
  },
  {
    path: '/error',
    name: 'error',
    meta: {
      title: '出错啦'
    },
    component: () => import('@views/error/index.vue')
  },
  {
    path: '*',
    component: () => import('@views/404/index.vue')
  },
]

export default commonRoutes