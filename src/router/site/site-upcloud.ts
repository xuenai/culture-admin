/*
 * @Author: Hexg 
 * @Date: 2019-06-17 17:15:54 
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-06-19 17:49:51
 */
// 上云部分路由
export default [
  {
    path: '/up-cloud',
    name: 'up-cloud',
    meta: {
      title: '上云'
    },
    component: () => import('@views/pages/cloud/cloud/list.vue'),
  },
  {
    path: '/up-cloud-edit',
    name: 'up-cloud-edit',
    meta: {
      title: '修改',
      menu: '/up-cloud'
    },
    component: () => import('@views/pages/cloud/cloud/edit.vue'),
  },
  {
    path: '/up-cloud-add',
    name: 'up-cloud-add',
    meta: {
      title: '添加',
      menu: '/up-cloud'
    },
    component: () => import('@views/pages/cloud/cloud/edit.vue'),
  },
]