/*
 * @Author: Hexg
 * @Date: 2019-06-17 17:13:59
 * @Last Modified by: Hexg
<<<<<<< HEAD
 * @Last Modified time: 2020-03-21 15:34:03
=======
 * @Last Modified time: 2020-03-23 14:04:39
>>>>>>> v1.4.0
 */
// 审核部分的路由
export default [
    {
        path: '/audit-venues',
        name: 'audit-venues',
        meta: {
            title: '文化场馆'
        },
        component: () => import('@views/pages/audit/venues/venues-audit/list.vue'),
    },
    {
        path: '/audit-venues-edit',
        name: 'audit-venues-edit',
        meta: {
            menu: '/audit-venues',
            title: '文化场馆审核'
        },
        component: () => import('@views/pages/audit/venues/venues-audit/venues-edit.vue'),
    },
    {
        path: '/audit-room-edit',
        name: 'audit-room-edit',
        meta: {
            menu: '/audit-venues',
            title: '活动室审核'
        },
        component: () => import('@views/pages/audit/venues/venues-audit/activityRoom-edit.vue'),
    },
    {
        path: '/audit-venues-modify',
        name: 'audit-venues-modify',
        meta: {
            menu: '/audit-venues',
            title: '场馆编辑'
        },
        component: () => import('@views/pages/place/venues/venues-index/edit.vue'),
    },
    {
        path: '/audit-venues-detail',
        name: 'audit-venues-detail',
        meta: {
            menu: '/audit-venues',
            title: '场馆详情'
        },
        component: () => import('@views/pages/place/venues/venues-index/detail.vue'),
    },
    {
        path: '/audit-room-detail',
        name: 'audit-room-detail',
        meta: {
            menu: '/audit-venues',
            title: '活动室详情'
        },
        component: () => import('@views/pages/place/venues/activity-room/detail.vue'),
    },
    {
        path: '/audit-room-add',
        name: 'audit-room-add',
        meta: {
            menu: '/audit-venues',
            title: '活动室编辑'
        },
        component: () => import('@views/pages/place/venues/activity-room/edit.vue'),
    },
    {
        path: '/audit-room-reserve',
        name: 'audit-room-reserve',
        meta: {
            menu: '/audit-venues',
            title: '活动室预约'
        },
        component: () => import('@views/pages/place/venues/activity-room/room-reserve.vue'),
    },
    {
        path: '/audit-scenic',
        name: 'audit-scenic',
        meta: {
            title: '景区'
        },
        component: () => import('@views/pages/audit/venues/scenic-audit/list.vue'),
    },
    {
        path: '/audit-scenic-edit',
        name: 'audit-scenic-edit',
        meta: {
            menu: '/audit-scenic',
            title: '景区审核'
        },
        component: () => import('@views/pages/audit/venues/scenic-audit/scenic-edit.vue'),
    },
    {
        path: '/audit-attractions-edit',
        name: 'audit-attractions-edit',
        meta: {
            menu: '/audit-scenic',
            title: '景点审核'
        },
        component: () => import('@views/pages/audit/venues/scenic-audit/attractions-edit.vue'),
    },
    {
        path: '/audit-scenic-modify',
        name: 'audit-scenic-modify',
        meta: {
            menu: '/audit-scenic',
            title: '景区编辑'
        },
        component: () => import('@views/pages/place/scenic/scenic-index/edit.vue'),
    },
    {
        path: '/audit-scenic-detail',
        name: 'audit-scenic-detail',
        meta: {
            menu: '/audit-scenic',
            title: '景区详情'
        },
        component: () => import('@views/pages/place/scenic/scenic-index/detail.vue'),
    },
    {
        path: '/audit-attractions-detail',
        name: 'audit-attractions-detail',
        meta: {
            title: '景点详情',
            menu: '/audit-scenic'
        },
        component: () => import('@views/pages/place/scenic/attractions/detail.vue'),
    },
    {
        path: '/audit-attractions-modify',
        name: 'audit-attractions-modify',
        meta: {
            title: '景点编辑',
            menu: '/audit-scenic'
        },
        component: () => import('@views/pages/place/scenic/attractions/edit.vue'),
    },
    {
        path: '/audit-hotel',
        name: 'audit-hotel',
        meta: {
            title: '酒店'
        },
        component: () => import('@views/pages/audit/venues/hotel-audit/list.vue'),
    }, {
        path: '/audit-hotel-edit',
        name: 'audit-hotel-edit',
        meta: {
            menu: '/audit-hotel',
            title: '酒店审核'
        },
        component: () => import('@views/pages/audit/venues/hotel-audit/hotel-edit.vue'),
    },
    {
        path: '/audit-guestroom-edit',
        name: 'audit-guestroom-edit',
        meta: {
            menu: '/audit-hotel',
            title: '客房审核'
        },
        component: () => import('@views/pages/audit/venues/hotel-audit/room-edit.vue'),
    },
    {
        path: '/audit-hotel-modify',
        name: 'audit-hotel-modify',
        meta: {
            menu: '/audit-hotel',
            title: '酒店编辑'
        },
        component: () => import('@views/pages/place/hotel/hotel-index/edit.vue'),
    },
    {
        path: '/audit-hotel-detail',
        name: 'audit-hotel-detail',
        meta: {
            menu: '/audit-hotel',
            title: '酒店详情'
        },
        component: () => import('@views/pages/place/hotel/hotel-index/detail.vue'),
    },
    {
        path: '/audit-guestroom-detail',
        name: 'audit-guestroom-detail',
        meta: {
            menu: '/audit-hotel',
            title: '客房详情'
        },
        component: () => import('@views/pages/place/hotel/guest-room/detail.vue'),
    },
    {
        path: '/audit-guestroom-modify',
        name: 'audit-guestroom-modify',
        meta: {
            menu: '/audit-hotel',
            title: '客房编辑'
        },
        component: () => import('@views/pages/place/hotel/guest-room/edit.vue'),
    },
    {
        path: '/audit-food',
        name: 'audit-food',
        meta: {
            title: '餐饮'
        },
        component: () => import('@views/pages/audit/venues/food-audit/list.vue'),
    },
    {
        path: '/audit-food-edit',
        name: 'audit-food-edit',
        meta: {
            menu: '/audit-food',
            title: '餐饮审核'
        },
        component: () => import('@views/pages/audit/venues/food-audit/edit.vue'),
    },
    {
        path: '/audit-food-modify',
        name: 'audit-food-modify',
        meta: {
            menu: '/audit-food',
            title: '餐饮编辑'
        },
        component: () => import('@views/pages/place/food/edit.vue'),
    },
    {
        path: '/audit-food-detail',
        name: 'audit-food-detail',
        meta: {
            menu: '/audit-food',
            title: '餐饮详情'
        },
        component: () => import('@views/pages/place/food/detail.vue'),
    },
    {
        path: '/audit-toilet',
        name: 'audit-toilet',
        meta: {
            title: '旅游厕所'
        },
        component: () => import('@views/pages/audit/venues/toilet-audit/list.vue'),
    },
    {
        path: '/audit-toilet-edit',
        name: 'audit-toilet-edit',
        meta: {
            menu: '/audit-toilet',
            title: '厕所审核'
        },
        component: () => import('@views/pages/audit/venues/toilet-audit/edit.vue'),
    },
    {
        path: '/audit-toilet-modify',
        name: 'audit-toilet-modify',
        meta: {
            menu: '/audit-toilet',
            title: '厕所编辑'
        },
        component: () => import('@views/pages/place/toilet/edit.vue'),
    },
    {
        path: '/audit-toilet-detail',
        name: 'audit-toilet-detail',
        meta: {
            menu: '/audit-toilet',
            title: '厕所详情'
        },
        component: () => import('@views/pages/place/toilet/detail.vue'),
    },
    {
        path: '/audit-parking',
        name: 'audit-parking',
        meta: {
            title: '停车场'
        },
        component: () => import('@views/pages/audit/venues/parking-audit/list.vue'),
    },
    {
        path: '/audit-parking-edit',
        name: 'audit-parking-edit',
        meta: {
            menu: '/audit-parking',
            title: '停车场审核'
        },
        component: () => import('@views/pages/audit/venues/parking-audit/edit.vue'),
    },
    {
        path: '/audit-parking-modify',
        name: 'audit-parking-modify',
        meta: {
            menu: '/audit-parking',
            title: '停车场编辑'
        },
        component: () => import('@views/pages/place/parking/edit.vue'),
    },
    {
        path: '/audit-parking-detail',
        name: 'audit-parking-detail',
        meta: {
            menu: '/audit-parking',
            title: '停车场详情'
        },
        component: () => import('@views/pages/place/parking/detail.vue'),
    },
    {
        path: '/audit-content',
        name: 'audit-content',
        meta: {
            title: '内容审核'
        },
        component: () => import('@views/pages/audit/content/content-audit-list.vue'),
    },
    {
        path: '/audit-content-site',
        name: 'audit-content',
        meta: {
            title: '内容审核'
        },
        component: () => import('@views/pages/audit/content/content-audit-list.vue'),
    },
    {
        path: '/audit-content-company',
        name: 'audit-content',
        meta: {
            title: '内容审核'
        },
        component: () => import('@views/pages/audit/content/content-audit-list.vue'),
    },
    {
        path: '/audit-content-detail',
        name: 'audit-content-detail',
        meta: {
            menu: '/audit-content',
            title: '内容详情'
        },
        component: () => import('@views/pages/audit/content/content-audit-detail.vue'),
    },
    {
        path: '/audit-content-detail-site',
        name: 'audit-content-detail',
        meta: {
            menu: '/audit-content-site',
            title: '内容详情'
        },
        component: () => import('@views/pages/audit/content/content-audit-detail.vue'),
    },
    {
        path: '/audit-content-detail-company',
        name: 'audit-content-detail',
        meta: {
            menu: '/audit-content-company',
            title: '内容详情'
        },
        component: () => import('@views/pages/audit/content/content-audit-detail.vue'),
    },
    {
        path: '/audit-topic',
        name: 'audit-topic',
        meta: {
            title: '话题'
        },
        component: () => import('@views/pages/audit/topic/topic-audit-list.vue'),

    },
    {
        path: '/audit-topic-detail',
        name: 'audit-topic-detail',
        meta: {
            title: '话题审核',
            menu: '/audit-topic',
        },
        component: () => import('@views/pages/topic/manage/detail.vue'),
    },
    {
        path: '/audit-story',
        name: 'audit-story',
        meta: {
            menu: '/audit-story',
            title: '故事'
        },
        component: () => import('@views/pages/audit/topic/story-audit-list.vue'),

    },
    {
        path: '/audit-ac-list',
        name: 'audit-ac-list',
        component: () => import('@/views/pages/audit/activity/activity-audit-list.vue'),
        meta: {
            title: '活动审核'
        }
    },
    {
        path: '/audit-ac-audit',
        name: '/audit-ac-audit',
        component: () => import('@/views/pages/audit/activity/audit.vue'),
        meta: {
            menu: '/audit-ac-list',
            title: '审核'
        }
    },
    {
        path: '/audit-ac-volunt-list',
        name: 'audit-ac-volunt-list',
        component: () => import('@/views/pages/audit/activity/volunt-list.vue'),
        meta: {
            title: '志愿申请审核'
        }
    },
    {
        path: '/audit-ac-volunt-detail',
        name: 'audit-ac-volunt-detail',
        component: () => import('@/views/pages/activity/activity-order/order-detail.vue'),
        meta: {
            menu: '/audit-ac-volunt-list',
            title: '订单详情'
        }
    },
    {
        path: '/audit-ac-edit',
        name: '/audit-ac-edit',
        component: () => import('@/views/pages/audit/activity/audit-edit.vue'),
        meta: {
            menu: '/audit-ac-list',
            title: '修改'
        }
    },
    {
        path: '/audit-review',
        name: 'audit-review',
        meta: {
            title: '点评审核'
        },
        component: () => import('@views/pages/content/review-audit/review-audit.vue')
    },
    {
        path: '/audit-complaint',
        name: 'audit-complaint',
        meta: {
            title: '投诉审核'
        },
        component: () => import('@views/pages/audit/content/audit-complaint.vue')
    },
    {
        path: '/audit-complaint-detail',
        name: 'audit-complaint-detail',
        meta: {
            title: '投诉详情',
            menu: '/audit-complaint'
        },
        component: () => import('@views/pages/audit/content/complaint-detail.vue')
    },
    {
        path: '/audit-appointment',
        name: 'audit-appointment',
        meta: {
            title: '预约活动室'
        },
        component: () => import('@views/pages/audit/appointment/list.vue')
    },
    {
        path: '/audit-appointment-detail',
        name: 'audit-appointment-detail',
        meta: {
            menu: '/audit-appointment',
            title: '订单详情'
        },
        component: () => import('@views/pages/place/order/room/detail.vue')
    },
    {
        path: '/audit-report-content',
        name: 'audit-report-content',
        component: () => import('@/views/pages/audit/report/content/content-audit-list.vue'),
        meta: {
            title: '内容上报审核'
        }
    },
    {
        path: '/audit-report-activity',
        name: 'audit-report-activity',
        component: () => import('@/views/pages/audit/report/activity/activity-audit-list.vue'),
        meta: {
            title: '活动上报审核'
        }
    },
    {
        path: '/join-team-audit',
        name: 'join-team-audit',
        component: () => import('@/views/pages/audit/volunteers/join-team-audit/list.vue'),
        meta: {
            title: '加入志愿团队'
        }
    },
    {
        path: '/join-team-desc/:id',
        name: 'join-team-desc',
        component: () => import('@/views/pages/audit/volunteers/join-team-audit/desc.vue'),
        meta: {
            menu: '/team-audit',
            title: '团队审核'
        }
    },
    {
        path: '/volunteers-audit',
        name: 'volunteers-audit',
        component: () => import('@/views/pages/audit/volunteers/volunteers-audit/list.vue'),
        meta: {
            title: '成为志愿者'
        }
    },
    {
        path: '/volunteers-audit-desc/:id',
        name: 'volunteers-audit-desc',
        component: () => import('@/views/pages/audit/volunteers/volunteers-audit/desc.vue'),
        meta: {
            menu: '/volunteers-audit',
            title: '志愿者审核'
        }
    },
    {
        path: '/certification',
        name: 'certification',
        component: () => import('@/views/pages/audit/certification/index.vue'),
        meta: {
            title: '实名认证审核'
        }
    },
    {
        path: '/audit-project',
        name: 'audit-project',
        component: () => import('@/views/pages/audit/remains/project/list.vue'),
        meta: {
            title: '非遗项目'
        }
    },
    {
        path: '/audit-project-edit',
        name: 'audit-project-edit',
        component: () => import('@/views/pages/audit/remains/project/project-edit.vue'),
        meta: {
            menu: '/audit-project',
            title: '非遗项目审核'
        }
    },
    {
        path: '/audit-project-modify',
        name: 'audit-project-modify',
        component: () => import('@views/pages/activity/remains/project/edit.vue'),
        meta: {
            menu: '/audit-project',
            title: '编辑'
        }
    },
    {
        path: '/audit-project-detail',
        name: 'audit-project-detail',
        component: () => import('@views/pages/activity/remains/project/detail.vue'),
        meta: {
            menu: '/audit-project',
            title: '详情'
        }
    },
    {
        path: '/audit-people-edit',
        name: 'audit-people-edit',
        component: () => import('@/views/pages/audit/remains/project/people-edit.vue'),
        meta: {
            menu: '/audit-project',
            title: '非遗传承人审核'
        }
    },
    {
        path: '/audit-inheritor-modify',
        name: 'audit-inheritor-modify',
        component: () => import('@views/pages/activity/remains/people/edit.vue'),
        meta: {
            menu: '/audit-project',
            title: '编辑'
        }
    },
    {
        path: '/audit-inheritor-detail',
        name: 'audit-inheritor-detail',
        component: () => import('@views/pages/activity/remains/people/detail.vue'),
        meta: {
            menu: '/audit-project',
            title: '详情'
        }
    },
    {
        path: '/audit/:resourceType',
        name: 'audit-base',
        component: () => import('@/views/pages/audit/remains/experience.vue'),
        meta: {
            title: '基地'
        }
    },
    {
        path: '/audit-course',
        name: 'audit-course',
        component: () => import('@/views/pages/audit/study/course.vue'),
        meta: {
            title: '课程'
        }
    },
    {
      path: '/course-detail-audit/:id',
      name: 'course-detail-audit',
      component: () => import('@views/pages/tool/study/course/detail.vue'),
      meta: {
        menu: '/audit-course',
        title: '课程详情'
      }
    },
    {
        path: '/audit-question',
        name: 'audit-question',
        component: () => import('@/views/pages/audit/study/question.vue'),
        meta: {
            title: '问答审核'
        }
    },
    // 农家乐审核
    {
        path: '/audit-agritainment',
        name: 'audit-agritainment',
        meta: {
            title: '农家乐'
        },
        component: () => import('@views/pages/audit/venues/agritainment-audit/list.vue'),
    },
    {
        path: '/audit-agritainment-edit',
        name: 'audit-agritainment-edit',
        meta: {
            menu: '/audit-agritainment',
            title: '农家乐审核'
        },
        component: () => import('@views/pages/audit/venues/agritainment-audit/edit.vue'),
    },
    {
        path: '/audit-agritainment-modify',
        name: 'audit-agritainment-modify',
        meta: {
            menu: '/audit-agritainment',
            title: '农家乐编辑'
        },
        component: () => import('@views/pages/place/agritainment/edit.vue'),
    },
    {
        path: '/audit-agritainment-detail',
        name: 'audit-agritainment-detail',
        meta: {
            menu: '/audit-agritainment',
            title: '农家乐详情'
        },
        component: () => import('@views/pages/place/agritainment/detail.vue'),
    },
    {
        path: '/audit-activity-result',
        name: 'audit-activity-result',
        component: () => import('@/views/pages/audit/results-management/list.vue'),
        meta: {
            title: '活动成果审核列表'
        }
    },
    {
        path: '/audit-res-detail',
        name: 'audit-res-detail',
        component: () =>
            import('@/views/pages/activity/results-management/detail.vue'),
        meta: {
            menu: '/audit-activity-result',
            title: '详情'
        }
    },
    {
        path: '/audit-activity-result-form',
        name: 'audit-activity-result-form',
        component: () => import('@/views/pages/activity/results-management/detail.vue'),
        meta: {
            menu: '/audit-activity-result',
            title: '活动成果审核'
        }
    },
    {
      path: '/volunteers-team-audit',
      name: 'volunteers-team-audit',
      component: () => import('@/views/pages/audit/volunteers/volunteers-team-audit/list.vue'),
      meta: {
          title: '志愿团队'
      }
  },
  {
    path: '/team-audit-desc/:id',
    name: 'team-audit-desc',
    component: () => import('@/views/pages/audit/volunteers/volunteers-team-audit/desc.vue'),
    meta: {
        title: '审核'
    }
},
]
