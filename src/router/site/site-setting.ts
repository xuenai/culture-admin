/*
 * @Author: Hexg 
 * @Date: 2019-06-17 17:15:24 
 * @Last Modified by: Hexg
 * @Last Modified time: 2020-03-25 10:28:50
 */
// 设置部分的路由
export default [
  {
    path: '/local-setting',
    name: 'local-setting',
    meta: {
      title: '基本配置',
    },
    component: () =>  import('@cloud/setting/local-setting-site/index.vue')
  },
  {
    path: '/organization-list',
    name: 'organization-list',
    meta: {
      title: '组织机构管理',
    },
    component: () =>  import('@cloud/setting/organization-list/index.vue')
  },
  {
    path: '/organization-list-site',
    name: 'organization-list-site',
    meta: {
      title: '组织机构管理',
    },
    component: () =>  import('@cloud/setting/organization-list/list-site.vue')
  },
  {
    path: '/people-list',
    name: 'people-list',
    meta: {
      title: '员工管理',
    },
    component: () =>  import('@cloud/setting/people-list/index.vue')
  },
  {
    path: '/people-add',
    name: 'people-add',
    meta: {
      menu:  '/people-list',
      title: '添加员工',
    },
    component: () =>  import('@cloud/setting/people-add/index.vue')
  },
  {
    path: '/people-edit',
    name: 'people-edit',
    meta: {
      menu:  '/people-list',
      title: '编辑',
    },
    component: () =>  import('@cloud/setting/people-edit/index.vue')
  },
  {
    path: '/people-detail',
    name: 'people-detail',
    meta: {
      menu:  '/people-list',
      title: '详情',
    },
    component: () =>  import('@cloud/setting/people-detail/index.vue')
  },
  {
    path: '/role-list',
    name: 'role-list',
    meta: {
      title: '角色管理',
    },
    component: () =>  import('@cloud/setting/role-list/index.vue')
  },
  {
    path: '/role-add',
    name: 'role-add',
    meta: {
      menu: '/role-list',
      title: '添加角色',
    },
    component: () =>  import('@cloud/setting/role-add/index.vue')
  },
  {
    path: '/role-detail',
    name: 'role-detail',
    meta: {
      menu: '/role-list',
      title: '查看角色',
    },
    component: () =>  import('@cloud/setting/role-detail/index.vue')
  },
  {
    path: '/role-edit',
    name: 'role-edit',
    meta: {
      menu: '/role-list',
      title: '编辑角色',
    },
    component: () =>  import('@cloud/setting/role-edit/index.vue')
  },
  {
    path: '/wechat',
    name: 'wechat',
    meta: {
      title: '公众号'
    },
    component: () => import('@views/site/wechat/index.vue')
  },
  {
    path: '/wechat-menu',
    name: 'wechat-menu',
    meta: {
      title: '自定义菜单'
    },
    component: () => import('@views/site/wechat-menu/index.vue')
  },
  {
    path: '/msg-demo',
    name: 'msg-demo',
    meta: {
      title: '消息模板',
    },
    component: () =>  import('@cloud/setting/msg-demo/index.vue')
  },
  {
    path: '/mobile-setting',
    name: 'mobile-setting',
    meta: {
      title: '用户端配置',
    },
    component: () =>  import('@views/site/setting/mobile-setting/mobile-setting.vue')
  },
]