/*
 * @Author: Hexg
 * @Date: 2019-06-17 17:14:21
 * @Last Modified by: Hexg
 * @Last Modified time: 2020-03-23 14:07:56
 */
// 会员部分的路由
export default [
  {
    path: '/member-profile',
    name: 'member-profile',
    meta: {
      title: '概况'
    },
    component: () => import('@views/pages/member/profile/profile.vue'),
  },
  {
    path: '/member-manage',
    name: 'member-manage',
    meta: {
      title: '会员管理'
    },
    component: () => import('@views/pages/member/manage/list.vue'),
  },
  {
    path: '/member-detial',
    name: 'member-detial',
    meta: {
      title: '会员详情',
      menu: '/member-manage'
    },
    component: () => import('@views/pages/member/manage/detial.vue'),
  },
  // 以前老的会员体系 一直未使用过的
  // {
  //   path: '/member-system',
  //   name: 'member-system',
  //   meta: {
  //     title: '会员体系'
  //   },
  //   component: () => import('@views/pages/member/system/index.vue'),
  // },
  // {
  //   path: '/member-rule',
  //   name: 'member-rule',
  //   meta: {
  //     title: '会员体系规则',
  //     menu: '/member-system'
  //   },
  //   component: () => import('@views/pages/member/system/leveRule.vue'),
  // },
  // {
  //   path: '/member-analysis-point',
  //   name: 'member-analysis-point',
  //   meta: {
  //     title: '积分分析',
  //     menu: '/member-system'
  //   },
  //   component: () => import('@views/pages/member/analysis-point.vue'),
  // },
  {
    path: '/member-system',
    name: 'member-system',
    meta: {
      title: '会员体系'
    },
    component: () => import('@views/site/member/member-system/index.vue')
  },
  {
    path: '/task-add',
    name: 'task-add',
    meta: {
      title: '添加任务',
      menu: '/member-system'
    },
    component: () => import('@views/site/member/task/index.vue')
  },
  {
    path: '/task-edit',
    name: 'task-edit',
    meta: {
      title: '修改任务',
      menu: '/member-system'
    },
    component: () => import('@views/site/member/task/index.vue')
  },
  {
    path: '/task-detail',
    name: 'task-detail',
    meta: {
      title: '任务详情',
      menu: '/member-system'
    },
    component: () => import('@views/site/member/task-detail/index.vue')
  },
  {
    path: '/member-analysis-point',
    name: 'member-analysis-point',
    meta: {
      title: '积分分析',
    },
    component: () => import('@views/pages/member/analysis-point.vue'),
  },
  {
    path: '/member-log-point',
    name: 'member-log-point',
    meta: {
      title: '积分日志',
    },
    component: () => import('@views/pages/member/log-point.vue'),
  },
  {
      path: '/member-integrity-system',
      name: 'member-integrity-system',
      meta: {
          title: '用户诚信',
      },
      component: () => import('@views/pages/member/integrity/index.vue'),
  },
  {
    path: '/move-company',
    name: 'move-company',
    meta: {
        title: '转移企业账号',
    },
    component: () => import('@views/pages/self-use/move-company.vue'),
  },
]
