/*
 * @Author: Hexg 
 * @Date: 2019-07-04 19:37:09 
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-11-14 16:07:47
 */
import Vue from 'vue'
import Router, {RouteConfig} from 'vue-router'

// 公共部分路由
import commonRoutes from './common'

let routes: Array<RouteConfig> = []
routes = routes.concat(commonRoutes)

Vue.use(Router)

export default new Router({
  routes
})

