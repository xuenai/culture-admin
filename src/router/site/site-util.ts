/*
 * @Author: Hexg
 * @Date: 2019-06-17 17:15:00
 * @Last Modified by: Hexg
 * @Last Modified time: 2020-04-09 19:53:01
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
    path: '/tips-list',
    name: 'tips-list',
    component: () => import('@/views/pages/tool/tips-list.vue'),
    meta: {
      title: '文化小贴士'
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
    path: '/advert-list',
    name: 'advert-list',
    component: () => import('@/views/pages/tool/advert/advert-list.vue'),
    meta: {
      title: '广告管理'
    }
  },
  {
    path: '/advert-detail',
    name: 'advert-detail',
    component: () => import('@/views/pages/tool/advert/advert-detail.vue'),
    meta: {
      title: '广告详情',
      menu: '/advert-list'
    }
  },
  {
    path: '/advert-edit',
    name: 'advert-edit',
    component: () => import('@/views/pages/tool/advert/advert-edit.vue'),
    meta: {
      title: '广告修改',
      menu: '/advert-list'
    }
  },
  {
    path: '/advert-upload',
    name: 'advert-upload',
    component: () => import('@/views/pages/tool/advert/upload.vue'),
    meta: {
      title: '广告新增',
      menu: '/advert-list'
    }
  },
  {
    path: '/pic-list',
    name: 'pic-list',
    component: () => import('@/views/pages/tool/pic/pic-list.vue'),
    meta: {
      title: '图库管理'
    }
  },
  {
    path: '/pic-upload',
    name: 'pic-upload',
    component: () => import('@/views/pages/tool/pic/pic-upload.vue'),
    meta: {
      title: '图库上传',
      menu: '/pic-list'
    }
  },
  {
    path: '/pic-edit',
    name: 'pic-edit',
    component: () => import('@/views/pages/tool/pic/pic-edit.vue'),
    meta: {
      title: '图库修改',
      menu: '/pic-list'
    }
  },
  {
    path: '/pic-detail',
    name: 'pic-detail',
    component: () => import('@/views/pages/tool/pic/pic-detail.vue'),
    meta: {
      title: '图库详情',
      menu: '/pic-list'
    }
  },
  {
    path: '/audio-list',
    name: 'audio-list',
    component: () => import('@/views/pages/tool/audio/audio-list.vue'),
    meta: {
      title: '音频管理'
    }
  },
  {
    path: '/audio-upload',
    name: 'audio-upload',
    component: () => import('@/views/pages/tool/audio/audio-upload.vue'),
    meta: {
      title: '音频上传',
      menu: '/audio-list'
    }
  },
  {
    path: '/audio-edit',
    name: 'audio-edit',
    component: () => import('@/views/pages/tool/audio/audio-edit.vue'),
    meta: {
      title: '音频修改',
      menu: '/audio-list'
    }
  },
  {
    path: '/audio-detail',
    name: 'audio-detail',
    component: () => import('@/views/pages/tool/audio/audio-detail.vue'),
    meta: {
      title: '音频详情',
      menu: '/audio-list'
    }
  },
  {
    path: '/video-list',
    name: 'video-list',
    component: () => import('@/views/pages/tool/video/video-list.vue'),
    meta: {
      title: '视频管理'
    }
  },
  {
    path: '/video-upload',
    name: 'video-upload',
    component: () => import('@/views/pages/tool/video/video-upload.vue'),
    meta: {
      title: '视频上传',
      menu: '/video-list'
    }
  },
  {
    path: '/video-edit',
    name: 'video-edit',
    component: () => import('@/views/pages/tool/video/video-edit.vue'),
    meta: {
      title: '视频修改',
      menu: '/video-list'
    }
  },
  {
    path: '/video-detail',
    name: 'video-detail',
    component: () => import('@/views/pages/tool/video/video-detail.vue'),
    meta: {
      title: '视频详情',
      menu: '/video-list'
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
  // {
  //   path: '/review-tags',
  //   name: 'review-tags',
  //   component: () => import('@/views/pages/tool/tag/review-tag.vue'),
  //   meta: {
  //     title: '点评标签'
  //   }
  // },
  {
    path: '/venues-tags',
    name: 'venues-tags',
    component: () => import('@/views/pages/tool/tag/tags-type-list.vue'),
    meta: {
      title: '场馆标签'
    }
  },
  {
    path: '/scence-tags',
    name: 'scence-tags',
    component: () => import('@/views/pages/tool/tag/tags-type-list.vue'),
    meta: {
      title: '景区标签'
    }
  },
  {
    path: '/hotel-tags',
    name: 'hotel-tags',
    component: () => import('@/views/pages/tool/tag/tags-type-list.vue'),
    meta: {
      title: '酒店标签'
    }
  },
  {
    path: '/food-tags',
    name: 'food-tags',
    component: () => import('@/views/pages/tool/tag/tags-type-list.vue'),
    meta: {
      title: '餐饮标签'
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
    path: '/media-tags',
    name: 'media-tags',
    component: () => import('@/views/pages/tool/tag/tags-type-list.vue'),
    meta: {
      title: '多媒体标签'
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
    path: '/volunteers-management',
    name: 'volunteers-management',
    component: () => import('@views/pages/tool/volunteers/volunteers-management/volunteers-management.vue'),
    meta: {
      title: '志愿者管理'
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
      menu: '/volunteers-list-team',
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
    path: '/volunteers-team-setting',
    name: 'volunteers-team-setting',
    component: () => import('@views/pages/tool/volunteers/volunteer-team/team-setting.vue'),
    meta: {
      title: '配置'
    }
  },
  {
    path: '/volunteers-setting',
    name: 'volunteers-setting',
    component: () => import('@views/pages/tool/volunteers/volunteers-setting/setting.vue'),
    meta: {
      title: '配置'
    }
  },
  {
    path: '/content-analysis',
    name: 'content-analysis',
    component: () => import('@views/pages/tool/analysis/content-analysis/content-analysis.vue'),
    meta: {
      title: '内容分析'
    }
  },
  {
    path: '/tag-analysis',
    name: 'tag-analysis',
    component: () => import('@views/pages/tool/analysis/tag-analysis/tag-analysis.vue'),
    meta: {
      title: '标签分析'
    }
  },
  {
    path: '/topic-analysis',
    name: 'topic-analysis',
    component: () => import('@views/pages/tool/analysis/topic-analysis/topic-analysis.vue'),
    meta: {
      title: '话题分析'
    }
  },
  {
    path: '/story-analysis',
    name: 'story-analysis',
    component: () => import('@views/pages/tool/analysis/story-analysis/story-analysis.vue'),
    meta: {
      title: '故事分析'
    }
  },
  {
    path: '/ads-analysis',
    name: 'ads-analysis',
    component: () => import('@views/pages/tool/analysis/ads-analysis/ads-analysis.vue'),
    meta: {
      title: '广告分析'
    }
  },
  {
    path: '/robot-setting',
    name: 'robot-setting',
    component: () => import('@views/pages/tool/questionAndAnswer/robot-setting/index.vue'),
    meta: {
      title: '机器人配置'
    }
  },
  {
    path: '/ques-base/greeting',
    name: 'ques-base-greeting',
    component: () => import('@views/pages/tool/questionAndAnswer/ques-list.vue'),
    meta: {
      title: "寒暄库"
    }
  },
  {
    path: '/ques-base/knowledge',
    name: 'ques-base-knowledge',
    component: () => import('@views/pages/tool/questionAndAnswer/ques-list.vue'),
    meta: {
      title: "知识库"
    }
  },
  {
    path: '/ques-add/greeting',
    name: 'ques-add-greeting',
    component: () => import('@views/pages/tool/questionAndAnswer/add-ques.vue'),
    meta: {
      title: "添加问题",
      menu: "/ques-base/greeting"
    }
  },
  {
    path: '/ques-add/knowledge',
    name: 'ques-add-knowledge',
    component: () => import('@views/pages/tool/questionAndAnswer/add-ques.vue'),
    meta: {
      title: "添加问题",
      menu: "/ques-base/knowledge"
    }
  },
  {
    path: '/smart-learning',
    name: 'smart-learning',
    component: () => import('@views/pages/tool/questionAndAnswer/smart-learning.vue'),
    meta: {
      title: "智能学习"
    }
  },
  {
    path: '/private-index',
    name: 'private-index',
    component: () => import('@views/pages/tool/private/private-index.vue'),
    meta: {
      menu: '/tool-list',
      title: "产品内测"
    }
  },
  {
    path: '/people-management',
    name: 'people-management',
    component: () => import('@views/pages/tool/private/people-management.vue'),
    meta: {
      title: "人员管理"
    }
  },
  {
    path: '/access-record',
    name: 'access-record',
    component: () => import('@views/pages/tool/private/access-record.vue'),
    meta: {
      title: "访问记录"
    }
  },
  {
    path: '/greeting',
    name: 'greeting',
    component: () => import('@views/pages/tool/questionAndAnswer/greeting.vue'),
    meta: {
      title: "问候语"
    }
  },
  {
    path: '/ques-statistics',
    name: 'ques-statistics',
    component: () => import('@views/pages/tool/questionAndAnswer/statistics.vue'),
    meta: {
      title: "问答统计"
    }
  },
  {
    path: '/ques-add-class',
    name: 'ques-add-class',
    component: () => import('@views/pages/tool/questionAndAnswer/add-class.vue'),
    meta: {
      menu: '/ques-base/knowledge',
      title: "添加分类"
    }
  },
  {
    path: '/itinerary-list',
    name: 'itinerary-list',
    component: () => import('@views/pages/tool/itinerary/itinerary-list/itinerary-list.vue'),
    meta: {
      title: '行程信息'
    }
  },
  {
    path: '/add-itinerary',
    name: 'add-itinerary',
    component: () => import('@views/pages/tool/itinerary/add-itinerary/add-itinerary.vue'),
    meta: {
      title: '添加行程',
      menu: '/itinerary-list',
    }
  },
  {
    path: '/user-itinerary',
    name: 'user-itinerary',
    component: () => import('@views/pages/tool/itinerary/user-itinerary/user-itinerary.vue'),
    meta: {
      title: '游客行程',
    }
  },
  {
    path: '/itinerary-detail',
    name: 'itinerary-detail',
    component: () => import('@views/pages/tool/itinerary/itinerary-detail/itinerary-detail.vue'),
    meta: {
      title: '行程详情',
      menu: '/itinerary-list'
    }
  },
  {
    path: '/user-itinerary-detail',
    name: 'user-itinerary-detail',
    component: () => import('@views/pages/tool/itinerary/itinerary-detail/itinerary-detail.vue'),
    meta: {
      title: '行程详情',
      menu: '/user-itinerary'
    }
  },
  {
    path: '/itinerary-edit',
    name: 'itinerary-edit',
    component: () => import('@views/pages/tool/itinerary/add-itinerary/add-itinerary.vue'),
    meta: {
      title: '编辑行程',
      menu: '/itinerary-list'
    }
  },
  // 上学堂S
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
    path: '/course-class-list',
    name: 'course-class-list',
    component: () => import('@views/pages/tool/study/course-class/list.vue'),
    meta: {
      title: '课程类型'
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
    path: '/course-list',
    name: 'course-list',
    component: () => import('@views/pages/tool/study/course/list.vue'),
    meta: {
      title: '课程列表'
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
  // 上学堂E

  // 导游导览S
  {
    path: '/tourguide-list',
    name: 'tourguide-list',
    component: () => import('@views/pages/tool/tour-guide/list.vue'),
    meta: {
      title: '导游导览'
    }
  },
  {
    path: '/tourguide-add',
    name: 'tourguide-add',
    component: () => import('@views/pages/tool/tour-guide/add.vue'),
    meta: {
      menu: '/tourguide-list',
      title: '添加'
    }
  },
  {
    path: '/tourguide-setting-scenic',
    name: 'tourguide-setting-scenic',
    component: () => import('@views/pages/tool/tour-guide/setting-scenic.vue'),
    meta: {
      menu: '/tourguide-list',
      title: '配置'
    }
  },
  {
    path: '/tourguide-setting-area',
    name: 'tourguide-setting-area',
    component: () => import('@views/pages/tool/tour-guide/setting-area.vue'),
    meta: {
      menu: '/tourguide-list',
      title: '配置'
    }
  },
  // 导游导览E
]
