/*
 * @Author: Hexg
 * @Date: 2019-06-17 17:13:00
 * @Last Modified by: Hexg
 * @Last Modified time: 2020-04-07 16:55:45
 */
// 活动部分的路由
export default [
  {
    path: '/ac-survey',
    name: 'ac-survey',
    meta: {
      title: '概况'
    },
    component: () =>
      import('@/views/pages/activity/activity-survey/activity-survey.vue')
  },
  {
    path: '/ac-survey-res',
    name: 'ac-survey-res',
    meta: {
      title: '概况'
    },
    component: () => import('@/views/pages/activity/activity-survey/activity-survey-res.vue'),
  },
  {
    path: '/ac-add',
    name: 'ac-add',
    meta: {
      title: '创建活动'
    },
    component: () =>
      import('@/views/pages/activity/add-activity/booking-activity.vue')
  },
  {
    path: '/ac-free-add',
    name: 'ac-free-add',
    component: () =>
      import('@/views/pages/activity/add-activity/free-booking.vue'),
    meta: {
      title: '免费预订',
      menu: '/ac-add'
    }
  },
  {
    path: '/ac-free-edit',
    name: 'ac-free-edit',
    component: () =>
      import('@/views/pages/activity/add-activity/free-booking.vue'),
    meta: {
      title: '免费预订',
      menu: '/ac-list'
    }
  },
  {
    path: '/add-activity-volunt',
    name: 'add-activity-volunt',
    component: () =>
      import('@/views/pages/activity/add-activity/add-activity-volunt.vue'),
    meta: {
      title: '志愿招募',
      menu: '/ac-add'
    }
  },
  {
    path: '/edit-activity-volunt',
    name: 'edit-activity-volunt',
    component: () =>
      import('@/views/pages/activity/add-activity/add-activity-volunt.vue'),
    meta: {
      title: '志愿招募',
      menu: '/ac-list'
    }
  },
  {
    path: '/add-money-activity',
    name: 'add-money-activity',
    component: () =>
      import('@/views/pages/activity/add-activity/add-money-activity.vue'),
    meta: {
      title: '付费活动',
      menu: '/ac-add'
    }
  },
  {
    path: '/edit-money-activity',
    name: 'edit-money-activity',
    component: () =>
      import('@/views/pages/activity/add-activity/add-money-activity.vue'),
    meta: {
      title: '修改付费活动',
      menu: '/ac-list'
    }
  },
  {
    path: '/add-activity-other',
    name: 'add-activity-other',
    component: () =>
      import('@/views/pages/activity/add-activity/add-activity-other.vue'),
    meta: {
      title: '其他活动',
      menu: '/ac-add'
    }
  },
  {
    path: '/edit-activity-other',
    name: 'edit-activity-other',
    component: () =>
      import('@/views/pages/activity/add-activity/add-activity-other.vue'),
    meta: {
      title: '其他活动',
      menu: '/ac-list'
    }
  },
  {
    path: '/add-ordinary',
    name: 'add-ordinary',
    component: () => import('@/views/pages/activity/add-activity/add-ordinary.vue'),
    meta: {
      title: '普通活动',
      menu: '/ac-add'
    }
  },
  {
    path: '/edit-ordinary',
    name: 'edit-ordinary',
    component: () => import('@/views/pages/activity/add-activity/add-ordinary.vue'),
    meta: {
      title: '普通活动',
      menu: '/ac-list'
    }
  },
  {
    path: '/ac-list',
    name: 'ac-list',
    component: () =>
      import(
        '@/views/pages/activity/activity-management/activity-management.vue'
      ),
    meta: {
      title: '活动管理'
    }
  },
  {
    path: '/ac-detail',
    name: 'ac-detail',
    component: () =>
      import('@/views/pages/activity/activity-management/activity-detail.vue'),
    meta: {
      title: '活动详情',
      menu: '/ac-list'
    }
  },
  {
    path: '/ac-report',
    name: 'ac-report',
    component: () =>
      import(
        '@/views/pages/activity/activity-management/report-management.vue'
      ),
    meta: {
      title: '上报管理'
    }
  },
  {
    path: '/ac-order-list',
    name: 'ac-order-list',
    component: () =>
      import('@/views/pages/activity/activity-order/order-list.vue'),
    meta: {
      title: '活动订单'
    }
  },
  {
    path: '/ac-order-detail',
    name: 'ac-order-detail',
    component: () =>
      import('@/views/pages/activity/activity-order/order-detail.vue'),
    meta: {
      title: '订单详情',
      menu: '/ac-order-list'
    }
  },
  {
    path: '/ac-order-verification',
    name: 'ac-order-verification',
    component: () => import('@views/pages/place/order/verify.vue'),
    meta: {
      title: '订单核销'
    }
  },
  {
    path: '/activity-class',
    name: 'activity-class',
    component: () => import('@views/pages/activity/activity-class/index.vue'),
    meta: {
      title: '活动分类'
    }
  },
  {
    path: '/brand-list',
    name: 'brand-list',
    component: () => import('@views/pages/activity/brand/brand-list.vue'),
    meta: {
      title: '品牌管理'
    }
  },
  {
    path: '/brand-add',
    name: 'brand-add',
    component: () => import('@views/pages/activity/brand/brand-add.vue'),
    meta: {
      title: '添加品牌',
      menu: '/brand-list'
    }
  },
  {
    path: '/brand-detail/:id',
    name: 'brand-detail',
    component: () => import('@views/pages/activity/brand/brand-detail.vue'),
    meta: {
      title: '品牌详情',
      menu: '/brand-list'
    }
  },
  {
    path: '/manage-subsite',
    name: 'manage-subsite',
    component: () => import('@views/pages/activity/manage-subsite/list.vue'),
    meta: {
      title: '子站点管理'
    }
  },
  {
    path: '/experience-add',
    name: 'experience-add',
    component: () =>
      import('@views/pages/activity/remains/experience-base/add.vue'),
    meta: {
      menu: '/experience-list',
      title: '添加体验基地'
    }
  },
  {
    path: '/experience-list',
    name: 'experience-list',
    component: () =>
      import('@views/pages/activity/remains/experience-base/list.vue'),
    meta: {
      title: '体验基地'
    }
  },
  {
    path: '/experience-detail/:id',
    name: 'experience-detail',
    component: () =>
      import('@views/pages/activity/remains/experience-base/detail.vue'),
    meta: {
      menu: '/experience-list',
      title: '体验基地详情'
    }
  },
  {
    path: '/inherit-add',
    name: 'inherit-add',
    component: () =>
      import('@views/pages/activity/remains/inherit-base/add.vue'),
    meta: {
      menu: '/inherit-list',
      title: '添加传习基地'
    }
  },
  {
    path: '/inherit-list',
    name: 'inherit-list',
    component: () =>
      import('@views/pages/activity/remains/inherit-base/list.vue'),
    meta: {
      title: '传习基地'
    }
  },
  {
    path: '/inherit-detail/:id',
    name: 'inherit-detail',
    component: () =>
      import('@views/pages/activity/remains/inherit-base/detail.vue'),
    meta: {
      menu: '/inherit-list',
      title: '传习基地详情'
    }
  },
  {
    path: '/protect-add',
    name: 'protect-add',
    component: () =>
      import('@views/pages/activity/remains/protect-base/add.vue'),
    meta: {
      menu: '/protect-list',
      title: '添加生产性保护基地'
    }
  },
  {
    path: '/protect-list',
    name: 'protect-list',
    component: () =>
      import('@views/pages/activity/remains/protect-base/list.vue'),
    meta: {
      title: '生产性基地'
    }
  },
  {
    path: '/protect-detail/:id',
    name: 'protect-detail',
    component: () =>
      import('@views/pages/activity/remains/protect-base/detail.vue'),
    meta: {
      menu: '/protect-list',
      title: '生产性基地详情'
    }
  },
  {
    path: '/basic-search/:resourceType',
    name: 'basic-search',
    component: () => import('@views/pages/activity/remains/basic-search.vue'),
    meta: {
      title: '大旗生态数据库'
    }
  },
  {
    path: '/remains-profile',
    name: 'remains-profile',
    component: () =>
      import('@views/pages/activity/remains/profile/profile.vue'),
    meta: {
      title: '概况'
    }
  },
  {
    path: '/remains-project',
    name: 'remains-project',
    component: () => import('@views/pages/activity/remains/project/list.vue'),
    meta: {
      title: '非遗项目'
    }
  },
  {
    path: '/project-search',
    name: 'project-search',
    component: () => import('@views/pages/activity/remains/project/search.vue'),
    meta: {
      menu: '/remains-project',
      title: '添加非遗项目'
    }
  },
  {
    path: '/project-search-list',
    name: 'project-search-list',
    component: () =>
      import('@views/pages/activity/remains/project/search-list.vue'),
    meta: {
      menu: '/remains-project',
      title: '生态数据库搜索结果'
    }
  },
  {
    path: '/project-add',
    name: 'project-add',
    component: () => import('@views/pages/activity/remains/project/edit.vue'),
    meta: {
      menu: '/remains-project',
      title: '添加'
    }
  },
  {
    path: '/project-edit',
    name: 'project-edit',
    component: () => import('@views/pages/activity/remains/project/edit.vue'),
    meta: {
      menu: '/remains-project',
      title: '编辑'
    }
  },
  {
    path: '/project-detail',
    name: 'project-detail',
    component: () => import('@views/pages/activity/remains/project/detail.vue'),
    meta: {
      menu: '/remains-project',
      title: '详情'
    }
  },
  {
    path: '/remains-people',
    name: 'remains-people',
    component: () => import('@views/pages/activity/remains/people/list.vue'),
    meta: {
      menu: '/remains-project',
      title: '非遗传承人'
    }
  },
  {
    path: '/inheritor-search-list',
    name: 'inheritor-search-list',
    component: () =>
      import('@views/pages/activity/remains/people/search-list.vue'),
    meta: {
      menu: '/remains-project',
      title: '大旗生态库搜索结果'
    }
  },
  {
    path: '/inheritor-add',
    name: 'inheritor-add',
    component: () => import('@views/pages/activity/remains/people/edit.vue'),
    meta: {
      menu: '/remains-project',
      title: '添加'
    }
  },
  {
    path: '/inheritor-edit',
    name: 'inheritor-edit',
    component: () => import('@views/pages/activity/remains/people/edit.vue'),
    meta: {
      menu: '/remains-project',
      title: '编辑'
    }
  },
  {
    path: '/inheritor-detail',
    name: 'inheritor-detail',
    component: () => import('@views/pages/activity/remains/people/detail.vue'),
    meta: {
      menu: '/remains-project',
      title: '详情'
    }
  },
  {
    path: '/res-list',
    name: 'res-list',
    component: () =>
      import('@/views/pages/activity/results-management/list.vue'),
    meta: {
      title: '成果管理'
    }
  },
  {
    path: '/res-detail',
    name: 'res-detail',
    component: () =>
      import('@/views/pages/activity/results-management/detail.vue'),
    meta: {
      menu: '/res-list',
      title: '详情'
    }
  },
  {
    path: '/res-submit',
    name: 'res-submit',
    component: () =>
      import('@/views/pages/activity/results-management/submit-result.vue'),
    meta: {
      menu: '/ac-list',
      title: '提交活动成果'
    }
  },
  {
    path: '/res-submit-md',
    name: 'res-submit-md',
    component: () =>
      import('@/views/pages/activity/results-management/submit-result.vue'),
    meta: {
      menu: '/res-list',
      title: '修改活动成果'
    }
  }
]
