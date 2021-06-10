/*
 * @Author: Hexg
 * @Date: 2019-06-17 17:15:00
 * @Last Modified by: Hexg
 * @Last Modified time: 2020-04-07 11:58:23
 */
// 工具部分的路由
export default [
  {
    path: '/tool-list',
    name: 'tool-list',
    component: () => import('@/views/pages/tool/tool.vue'),
    meta: {
      title: '工具'
    }
  },
  {
    path: '/verification-list',
    name: 'verification-list',
    component: () => import('@/views/pages/tool/verification/verification-list.vue'),
    meta: {
      title: '核销记录',
    }
  },
  {
    path: '/content-tags',
    name: 'content-tags',
    component: () => import('@/views/pages/tool/tag/tags-list.vue'),
    meta: {
      title: '内容标签'
    }
  },
  {
    path: '/venues-tags',
    name: 'venues-tags',
    component: () => import('@/views/pages/tool/tag/tags-type-list.vue'),
    meta: {
      title: '文化场馆'
    }
  },
  {
    path: '/scence-tags',
    name: 'scence-tags',
    component: () => import('@/views/pages/tool/tag/tags-type-list.vue'),
    meta: {
      title: '景区'
    }
  },
  {
    path: '/hotel-tags',
    name: 'hotel-tags',
    component: () => import('@/views/pages/tool/tag/tags-type-list.vue'),
    meta: {
      title: '酒店'
    }
  },
  {
    path: '/food-tags',
    name: 'food-tags',
    component: () => import('@/views/pages/tool/tag/tags-type-list.vue'),
    meta: {
      title: '餐饮'
    }
  },
  {
    path: '/activity-tags',
    name: 'activity-tags',
    component: () => import('@/views/pages/tool/tag/tags-list.vue'),
    meta: {
      title: '活动标签'
    }
  },
  {
    path: '/order-verification',
    name: 'order-verification',
    component: () => import('@views/pages/place/order/verify.vue'),
    meta: {
      title: '预约核销'
    }
  },
  {
    path: '/verification-app',
    name: 'verification-app',
    component: () => import('@views/pages/tool/verification/verification-app.vue'),
    meta: {
      title: '电子消费码核销APP',
      menu: '/tool-list'
    }
  },
  {
    path: '/volunteers-management',
    name: 'volunteers-management',
    component: () => import('@views/pages/tool/volunteers/volunteers-management/volunteers-management-company.vue'),
    meta: {
      title: '志愿者管理'
    }
  },
  {
    path: '/volunteers-edit',
    name: 'volunteers-edit',
    component: () => import('@views/pages/tool/volunteers/volunteers-management/add.vue'),
    meta: {
      title: '添加'
    }
  },
  {
    path: '/volunteers-management-desc/:id/:status',
    name: 'volunteers-management-desc',
    component: () => import('@views/pages/tool/volunteers/volunteers-management-desc/volunteers-management-desc.vue'),
    meta: {
      menu: '/volunteers-management',
      title: '志愿者管理详情'
    }
  },
  {
    path: '/volunteers-view',
    name: 'volunteers-view',
    component: () => import('@views/pages/tool/volunteers/view.vue'),
    meta: {
      title: '概况'
    }
  },
  {
    path: '/volunteers-add-team',
    name: 'volunteers-add-team',
    component: () => import('@views/pages/tool/volunteers/volunteer-team/add-team.vue'),
    meta: {
      menu: '/volunteers-list-team',
      title: '添加志愿团队'
    }
  },
  {
    path: '/volunteers-detail-team/:id',
    name: 'volunteers-detail-team',
    component: () => import('@views/pages/tool/volunteers/volunteer-team/detail-team.vue'),
    meta: {
      title: '志愿团队详情'
    }
  },
  {
    path: '/volunteers-list-team',
    name: 'volunteers-list-team',
    component: () => import('@views/pages/tool/volunteers/volunteer-team/list-team.vue'),
    meta: {
      title: '志愿团队'
    }
  },
  {
      path: '/community-profile',
      name: 'community-profile',
      component: () => import('@views/pages/tool/community/profile/profile.vue'),
      meta: {
          title: '概况'
      }
  },
  {
      path: '/community-add',
      name: 'community-add',
      component: () => import('@views/pages/tool/community/community-index/edit.vue'),
      meta: {
          menu: '/community-list',
          title: '添加社团'
      }
  },
  {
      path: '/community-list',
      name: 'community-list',
      component: () => import('@views/pages/tool/community/community-index/list.vue'),
      meta: {
          title: '社团管理'
      }
  },
  {
      path: '/community-detail',
      name: 'community-detail',
      component: () => import('@views/pages/tool/community/community-index/detail.vue'),
      meta: {
          menu: '/community-list',
          title: '社团详情'
      }
  },
  {
      path: '/community-member-list',
      name: 'community-member-list',
      component: () => import('@views/pages/tool/community/community-member/list.vue'),
      meta: {
          menu: '/community-list',
          title: '社团成员'
      }
  },
  {
      path: '/community-member-add',
      name: 'community-member-add',
      component: () => import('@views/pages/tool/community/community-member/edit.vue'),
      meta: {
          menu: '/community-list',
          title: '添加成员'
      }
  },
  {
      path: '/community-member-detail',
      name: 'community-member-detail',
      component: () => import('@views/pages/tool/community/community-member/detail.vue'),
      meta: {
          menu: '/community-list',
          title: '成员详情'
      }
  },
  {
    path: '/course-list',
    name: 'course-list',
    component: () => import('@views/pages/tool/study/course/list.vue'),
    meta: {
      title: '课程列表'
    }
  },
  {
    path: '/course-add',
    name: 'course-add',
    component: () => import('@views/pages/tool/study/course/add.vue'),
    meta: {
      title: '添加课程'
    }
  },
  {
    path: '/course-edit',
    name: 'course-edit',
    component: () => import('@views/pages/tool/study/course/add.vue'),
    meta: {
      menu: '/course-list',
      title: '修改课程'
    }
  },
  {
    path: '/course-detail/:id',
    name: 'course-detail',
    component: () => import('@views/pages/tool/study/course/detail.vue'),
    meta: {
      menu: '/course-list',
      title: '课程详情'
    }
  },
  {
    path: '/course-question',
    name: 'course-question',
    component: () => import('@views/pages/tool/study/course-question/list.vue'),
    meta: {
      title: '课程问答'
    }
  },
  {
    path: '/course-history',
    name: 'course-history',
    component: () => import('@views/pages/tool/study/history.vue'),
    meta: {
      menu: '/course-list',
      title: '学习记录'
    }
  },
  {
    path: '/course-comment',
    name: 'course-comment',
    component: () => import('@views/pages/tool/study/comment.vue'),
    meta: {
      menu: '/course-list',
      title: '学习评论'
    }
  },
  {
    path: '/course-class-list',
    name: 'course-class-list',
    component: () => import('@views/pages/tool/study/course-class/list.vue'),
    meta: {
      title: '课程类型'
    }
  },
  {
    path: '/course-class-add',
    name: 'course-class-add',
    component: () => import('@views/pages/tool/study/course-class/add.vue'),
    meta: {
      menu: '/course-class-list',
      title: '添加类型'
    }
  },
  {
    path: '/lecturer-add',
    name: 'lecturer-add',
    component: () => import('@views/pages/tool/study/lecturer/add.vue'),
    meta: {
      menu: '/lecturer-list',
      title: '添加讲师'
    }
  },
  {
    path: '/lecturer-list',
    name: 'lecturer-list',
    component: () => import('@views/pages/tool/study/lecturer/list.vue'),
    meta: {
      title: '讲师列表'
    }
  },
]
