/*
 * @Author: Hexg 
 * @Date: 2019-06-17 17:11:53 
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-07-04 11:48:59
 */
// 内容模块儿的路由
export default [
  {
    path: '/con-profile',
    name: 'con-profile',
    meta: {
      title: '概况'
    },
    component: () => import('@views/pages/content/profile/profile.vue'),
  },
  {
    path: '/con-add-index',
    name: 'con-add-index',
    meta: {
      title: '添加内容'
    },
    component: () => import('@views/pages/content/add/add-index/add-index.vue')
  },
  {
    path: '/con-add-content',
    name: 'con-add-content',
    meta: {
      title: '添加内容',
      menu: '/con-add-index'
    },
    component: () => import('@views/pages/content/add/add-content/add-content.vue')
  },
  {
    path: '/con-add-image',
    name: 'con-add-image',
    meta: {
      title: '添加图片',
      menu: '/con-add-index',
    },
    component: () => import('@views/pages/content/add/add-image/add-image.vue')
  },
  {
    path: '/con-add-video',
    name: 'con-add-video',
    meta: {
      menu: '/con-add-index',
      title: '添加视频'
    },
    component: () => import('@views/pages/content/add/add-video/add-video.vue')
  },
  {
    path: '/con-add-audio',
    name: 'con-add-audio',
    meta: {
      menu: '/con-add-index',
      title: '添加音频'
    },
    component: () => import('@views/pages/content/add/add-audio/add-audio.vue')
  },
  {
    path: '/con-list',
    name: 'con-list',
    meta: {
      title: '内容管理'
    },
    component: () => import('@views/pages/content/management-index/management-index.vue')
  },
  {
    path: '/con-detail',
    name: 'con-detail',
    meta: {
      title: '内容详情',
      menu: '/con-list'
    },
    component: () => import('@views/pages/audit/content/content-audit-detail.vue'),

  },
  {
    path: '/con-edit-content',
    name: 'con-edit-content',
    meta: {
      title: '编辑内容',
      menu: '/con-list'
    },
    component: () => import('@views/pages/content/add/add-content/add-content.vue')
  },
  {
    path: '/con-edit-image',
    name: 'con-edit-image',
    meta: {
      title: '编辑图片',
      menu: '/con-list',
    },
    component: () => import('@views/pages/content/add/add-image/add-image.vue')
  },
  {
    path: '/con-edit-video',
    name: 'con-edit-video',
    meta: {
      menu: '/con-list',
      title: '编辑视频'
    },
    component: () => import('@views/pages/content/add/add-video/add-video.vue')
  },
  {
    path: '/con-edit-audio',
    name: 'con-edit-audio',
    meta: {
      menu: '/con-list',
      title: '编辑音频'
    },
    component: () => import('@views/pages/content/add/add-audio/add-audio.vue')
  },
  {
    path: '/con-report',
    name: 'con-report',
    meta: {
      title: '上报管理'
    },
    component: () => import('@views/pages/content/report/report.vue')
  },
  {
    path: '/con-report-desc',
    name: 'con-report-desc',
    meta: {
      title: '上报详情',
      menu: '/con-report'
    },
    component: () => import('@views/pages/content/report/report-desc.vue')
  },
  {
    path: '/con-column-list',
    name: 'con-column-list',
    meta: {
      title: '栏目管理'
    },
    component: () => import('@views/pages/content/column-management/column-management.vue')
  },
  {
    path: '/con-column-add',
    name: 'con-column-add',
    meta: {
      title: '添加栏目',
      menu: '/con-column-list'
    },
    component: () => import('@views/pages/content/add-column/add-column.vue')
  },
  {
    path: '/con-comments-list',
    name: 'con-comments-list',
    meta: {
      title: '点评管理'
    },
    component: () => import('@views/pages/content/comments-management/comments-management.vue')
  },
  {
    path: '/con-complaint-list',
    name: 'con-complaint-list',
    meta: {
      title: '投诉管理',
    },
    component: () => import('@views/pages/content/complaint-handling/complaint-handling.vue')
  },
  {
    path: '/con-complaint-detail',
    name: 'con-complaint-detail',
    meta: {
      title: '投诉详情',
      menu: '/con-complaint-list'
    },
    component: () => import('@views/pages/content/complaint-detail/complaint-detail.vue')
  },
  {
    path: '/con-fields',
    name: 'con-fields',
    meta: {
      title: '字段配置'
    },
    component: () => import('@views/cloud-manage/setting/content-fields/content-fields.vue')
  },
  {
    path: '/con-fields-add',
    name: 'con-fields-add',
    meta: {
      title: '添加字段',
      menu: '/con-fields'
    },
    component: () => import('@views/cloud-manage/setting/add-content-fields/add-content-fields.vue')
  },
  {
    path: '/feedback-list',
    name: 'feedback-list',
    meta: {
      title: '意见反馈',
    },
    component: () => import('@views/pages/content/feedback/list.vue')
  },
  {
    path: '/feedback-list1',
    name: 'feedback-list1',
    meta: {
      title: '意见反馈',
    },
    component: () => import('@views/pages/content/feedback/list.vue')
  },
  {
    path: '/feedback-detail',
    name: 'feedback-detail',
    meta: {
      menu: '/feedback-list',
      title: '反馈详情',
    },
    component: () => import('@views/pages/content/feedback/detail.vue')
  },
]