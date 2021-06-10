/*
 * @Author: Hexg 
 * @Date: 2019-06-21 15:06:54 
 * @Last Modified by: Hexg
 * @Last Modified time: 2020-01-10 10:21:15
 */

// 云端相关路由

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: () => import('@views/login/index.vue')
  },
  {
    path: '/cloud-site-audit',
    name: 'cloud-site-audit',
    meta: {
      title: '站点审核'
    },
    component: () => import('@views/cloud-manage/site/audit/list.vue')
  },
  {
    path: '/cloud-site',
    name: 'cloud-site',
    meta: {
      title: '站点管理'
    },
    component: () => import('@views/cloud-manage/site/manage/list/index.vue')
  },
  {
    path: '/cloud-site-edit',
    name: 'cloud-site-edit',
    meta: {
      menu: '/cloud-site',
      title: '站点配置'
    },
    component: () => import('@views/cloud-manage/site/manage/edit/index.vue')
  },
  {
    path: '/cloud-alliance',
    name: 'cloud-alliance',
    meta: {
      title: '云联盟'
    },
    component: () => import('@views/cloud-manage/site/cloudAlliance/list.vue')
  },
  {
    path: '/cloud-alliance-edit',
    name: 'cloud-alliance-edit',
    meta: {
      title: '云联盟编辑',
      menu: '/cloud-alliance'
    },
    component: () => import('@views/cloud-manage/site/cloudAlliance/edit.vue')
  },
  {
    path: '/cloud-ads',
    name: 'cloud-ads',
    meta: {
      title: '广告位管理'
    },
    component: () => import('@views/cloud-manage/utils/adPositionManage/list.vue')
  },
  {
    path: '/cloud-ads-edit',
    name: 'cloud-ads-edit',
    meta: {
      menu: '/cloud-ads',
      title: '广告位编辑'
    },
    component: () => import('@views/cloud-manage/utils/adPositionManage/edit.vue')
  },
  // 云端 菜单 权限
  {
    path: '/domain',
    name: 'domain',
    meta: {
      title: '域名管理'
    },
    component: () => import('@cloud/setting/domain/index.vue')
  },
  {
    path: '/cloud-menu',
    name: 'cloud-menu',
    meta: {
      title: '菜单管理'
    },
    component: () => import('@cloud/setting/menu-list/index.vue')
  },
  {
    path: '/cloud-menu-add',
    name: 'cloud-menu-add',
    meta: {
      menu: '/cloud-menu',
      title: '添加'
    },
    component: () => import('@cloud/setting/menu-add/index.vue')
  },
  {
    path: '/cloud-menu-detail',
    name: 'cloud-menu-detail',
    meta: {
      menu: '/cloud-menu',
      title: '详情'
    },
    component: () => import('@cloud/setting/menu-detail/index.vue')
  },
  {
    path: '/cloud-menu-edit',
    name: 'cloud-menu-edit',
    meta: {
      menu: '/cloud-menu',
      title: '修改'
    },
    component: () => import('@cloud/setting/menu-edit/index.vue')
  },
  // 站点端 
  {
    path: '/site-menu',
    name: 'site-menu',
    meta: {
      title: '菜单管理'
    },
    component: () => import('@cloud/setting/menu-list/index.vue')
  },
  {
    path: '/site-menu-add',
    name: 'site-menu-add',
    meta: {
      menu: '/site-menu',
      title: '添加'
    },
    component: () => import('@cloud/setting/menu-add/index.vue')
  },
  {
    path: '/site-menu-detail',
    name: 'site-menu-detail',
    meta: {
      menu: '/site-menu',
      title: '详情'
    },
    component: () => import('@cloud/setting/menu-detail/index.vue')
  },
  {
    path: '/site-menu-edit',
    name: 'site-menu-edit',
    meta: {
      menu: '/site-menu',
      title: '修改'
    },
    component: () => import('@cloud/setting/menu-edit/index.vue')
  },

  // 企业端
  {
    path: '/company-menu',
    name: 'company-menu',
    meta: {
      title: '菜单管理'
    },
    component: () => import('@cloud/setting/menu-list/index.vue')
  },
  {
    path: '/company-menu-add',
    name: 'company-menu-add',
    meta: {
      menu: '/company-menu',
      title: '添加'
    },
    component: () => import('@cloud/setting/menu-add/index.vue')
  },
  {
    path: '/company-menu-detail',
    name: 'company-menu-detail',
    meta: {
      menu: '/company-menu',
      title: '详情'
    },
    component: () => import('@cloud/setting/menu-detail/index.vue')
  },
  {
    path: '/company-menu-edit',
    name: 'company-menu-edit',
    meta: {
      menu: '/company-menu',
      title: '修改'
    },
    component: () => import('@cloud/setting/menu-edit/index.vue')
  },

  // 云端的菜单操作相关
  {
    path: '/cloud-operate',
    name: 'cloud-operate',
    meta: {
      title: '操作管理'
    },
    component: () => import('@cloud/setting/operate-list/index.vue')
  },
  {
    path: '/cloud-operate-add',
    name: 'cloud-operate-add',
    meta: {
      menu: '/cloud-operate',
      title: '添加'
    },
    component: () => import('@cloud/setting/operate-add/index.vue')
  },
  {
    path: '/cloud-operate-edit',
    name: 'cloud-operate-edit',
    meta: {
      menu: '/cloud-operate',
      title: '修改'
    },
    component: () => import('@cloud/setting/operate-edit/index.vue')
  },
  {
    path: '/cloud-operate-detail',
    name: 'cloud-operate-detail',
    meta: {
      menu: '/cloud-operate',
      title: '详情'
    },
    component: () => import('@cloud/setting/operate-detail/index.vue')
  },

  // 站点端 菜单权限相关操作
  {
    path: '/site-operate',
    name: 'site-operate',
    meta: {
      title: '操作管理'
    },
    component: () => import('@cloud/setting/operate-list/index.vue')
  },
  {
    path: '/site-operate-add',
    name: 'site-operate-add',
    meta: {
      menu: '/site-operate',
      title: '添加'
    },
    component: () => import('@cloud/setting/operate-add/index.vue')
  },
  {
    path: '/site-operate-edit',
    name: 'site-operate-edit',
    meta: {
      menu: '/site-operate',
      title: '修改'
    },
    component: () => import('@cloud/setting/operate-edit/index.vue')
  },
  {
    path: '/site-operate-detail',
    name: 'site-operate-detail',
    meta: {
      menu: '/site-operate',
      title: '详情'
    },
    component: () => import('@cloud/setting/operate-detail/index.vue')
  },
  // 企业端 菜单权限相关操作
  {
    path: '/company-operate',
    name: 'company-operate',
    meta: {
      title: '操作管理'
    },
    component: () => import('@cloud/setting/operate-list/index.vue')
  },
  {
    path: '/company-operate-add',
    name: 'company-operate-add',
    meta: {
      menu: '/company-operate',
      title: '添加'
    },
    component: () => import('@cloud/setting/operate-add/index.vue')
  },
  {
    path: '/company-operate-edit',
    name: 'company-operate-edit',
    meta: {
      menu: '/company-operate',
      title: '修改'
    },
    component: () => import('@cloud/setting/operate-edit/index.vue')
  },
  {
    path: '/company-operate-detail',
    name: 'company-operate-detail',
    meta: {
      menu: '/site-operate',
      title: '详情'
    },
    component: () => import('@cloud/setting/operate-detail/index.vue')
  },

  // 标签管理
  {
    path: '/cloud-tags-content',
    name: 'cloud-tags-content',
    meta: {
      title: '内容'
    },
    component: () => import('@cloud/setting/cloud-tags/index.vue')
  },
  {
    path: '/cloud-tags-itinerary',
    name: 'cloud-tags-itinerary',
    meta: {
      title: '智能行程'
    },
    component: () => import('@cloud/setting/cloud-tags/index.vue')
  },
  {
    path: '/cloud-tags-review',
    name: 'cloud-tags-review',
    meta: {
      title: '点评'
    },
    component: () => import('@cloud/setting/cloud-tags-review/index.vue')
  },
  {
    path: '/cloud-tags-venue',
    name: 'cloud-tags-venue',
    meta: {
      title: '文化场馆'
    },
    component: () => import('@cloud/setting/cloud-tags/index.vue')
  },
  {
    path: '/cloud-tags-scenic',
    name: 'cloud-tags-scenic',
    meta: {
      title: '景区'
    },
    component: () => import('@cloud/setting/cloud-tags/index.vue')
  },
  {
    path: '/cloud-tags-hotel',
    name: 'cloud-tags-hotel',
    meta: {
      title: '酒店'
    },
    component: () => import('@cloud/setting/cloud-tags/index.vue')
  },
  {
    path: '/cloud-tags-food',
    name: 'cloud-tags-food',
    meta: {
      title: '餐饮'
    },
    component: () => import('@cloud/setting/cloud-tags/index.vue')
  },
  {
    path: '/cloud-tags-ac',
    name: 'cloud-tags-ac',
    meta: {
      title: '活动'
    },
    component: () => import('@cloud/setting/cloud-tags/activity.vue')
  },
  {
    path: '/cloud-tags-media',
    name: 'cloud-tags-media',
    meta: {
      title: '媒体'
    },
    component: () => import('@cloud/setting/cloud-tags/index.vue')
  },
  {
    path: '/cloud-tags-topic',
    name: 'cloud-tags-topic',
    meta: {
      title: '话题'
    },
    component: () => import('@cloud/setting/cloud-tags/index.vue')
  },
  {
    path: '/cloud-tags-inherit',
    name: 'cloud-tags-inherit',
    meta: {
      title: '传习基地'
    },
    component: () => import('@cloud/setting/cloud-tags/index.vue')
  },
  {
    path: '/cloud-tags-experience',
    name: 'cloud-tags-experience',
    meta: {
      title: '体验基地'
    },
    component: () => import('@cloud/setting/cloud-tags/index.vue')
  },
  {
    path: '/dictionaries',
    name: 'dictionaries',
    meta: {
      title: '字典管理'
    },
    component: () => import('@cloud/setting/dictionaries/index.vue')
  },
  {
    path: '/areas',
    name: 'areas',
    meta: {
      title: '地区管理'
    },
    component: () => import('@cloud/setting/areas/index.vue')
  },
  {
    path: '/role-list',
    name: 'role-list',
    meta: {
      title: '角色管理',
    },
    component: () => import('@cloud/setting/role-list/index.vue')
  },
  {
    path: '/role-add',
    name: 'role-add',
    meta: {
      menu: '/role-list',
      title: '添加角色',
    },
    component: () => import('@cloud/setting/role-add/index.vue')
  },
  {
    path: '/role-detail',
    name: 'role-detail',
    meta: {
      menu: '/role-list',
      title: '查看角色',
    },
    component: () => import('@cloud/setting/role-detail/index.vue')
  },
  {
    path: '/role-edit',
    name: 'role-edit',
    meta: {
      menu: '/role-list',
      title: '编辑角色',
    },
    component: () => import('@cloud/setting/role-edit/index.vue')
  },
  {
    path: '/cloud-msg-list',
    name: 'cloud-msg-list',
    meta: {
      title: '消息管理',
    },
    component: () => import('@cloud/utils/messageManage/list.vue')
  },
  {
    path: '/cloud-msg-edit',
    name: 'cloud-msg-edit',
    meta: {
      menu: '/cloud-msg-list',
      title: '消息编辑',
    },
    component: () => import('@cloud/utils/messageManage/edit.vue')
  },
  {
    path: '/cloud-msg-detail',
    name: 'cloud-msg-detail',
    meta: {
      menu: '/cloud-msg-list',
      title: '消息详情',
    },
    component: () => import('@cloud/utils/messageManage/detail.vue')
  },
  {
    path: '/vip-task',
    name: 'vip-task',
    meta: {
      title: '会员任务'
    },
    component: () => import('@cloud/setting/vip-task/index.vue')
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
    path: '/feedback-detail',
    name: 'feedback-detail',
    meta: {
      title: '反馈详情',
      menu: '/feedback-list'
    },
    component: () => import('@views/pages/content/feedback/detail.vue')
  },
  {
    path: '/fast-reply',
    name: 'fast-reply',
    meta: {
      title: '快捷回复',
    },
    component: () => import('@cloud/setting/fast-reply/index.vue')
  },
]
