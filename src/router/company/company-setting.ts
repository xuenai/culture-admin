/*
 * @Author: Hexg 
 * @Date: 2019-06-17 17:15:24 
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-08-06 09:49:25
 */
// 设置部分的路由
export default [
  {
    path: '/local-setting',
    name: 'local-setting',
    meta: {
      title: '基本配置',
    },
    component: () =>  import('@cloud/setting/local-setting/index.vue')
  },
  // 
  {
    path: '/organization-list',
    name: 'organization-list',
    meta: {
      title: '组织机构管理',
    },
    component: () =>  import('@cloud/setting/organization-list/index.vue')
  },
  {
    path: '/people-list',
    name: 'people-list',
    meta: {
      title: '员工管理',
    },
    component: () =>  import('@views/company/setting/people-list/index.vue')
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
    component: () =>  import('@views/company/setting/people-edit/index.vue')
  },
  {
    path: '/people-detail',
    name: 'people-detail',
    meta: {
      menu:  '/people-list',
      title: '详情',
    },
    component: () =>  import('@views/company/setting/people-detail/index.vue')
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
]