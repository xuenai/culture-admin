/*
 * @Author: Hexg 
 * @Date: 2019-06-17 17:13:20 
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-06-17 19:56:43
 */
// 话题部分的路由
export default [
  {
    path: '/topic-profile',
    name: 'topic-profile',
    meta: {
      title: '概况'
    },
    component: () => import('@views/pages/topic/profile/profile.vue'),
  },
  {
    path: '/topic-add',
    name: '/topic-add',
    meta: {
      title: '创建话题'
    },
    component: () => import('@views/pages/topic/manage/edit.vue'),
  },
  {
    path: '/topic-list',
    name: 'topic-list',
    meta: {
      title: '话题管理'
    },
    component: () => import('@views/pages/topic/manage/list.vue'),
  },
  {
    path: '/topic-edit',
    name: '/topic-edit',
    meta: {
      title: '话题编辑',
      menu: '/topic-list'
    },
    component: () => import('@views/pages/topic/manage/edit.vue'),
  },
  {
    path: '/topic-detail',
    name: 'topic-detail',
    meta: {
      title: '话题详情',
      menu: '/topic-list'
    },
    component: () => import('@views/pages/topic/manage/detail.vue'),
  },
  {
    path: '/topic-tags',
    name: 'topic-tags',
    meta: {
      title: '标签管理'
    },
    component: () => import('@views/pages/topic/human/tag-list.vue'),
  },
  {
    path: '/story-list',
    name: 'story-list',
    meta: {
      title: '故事管理'
    },
    component: () => import('@views/pages/topic/human/story-list.vue'),
  },
  {
    path: '/story-detail',
    name: '/story-detail',
    meta: {
      title: '故事详情',
      menu: '/story-list'
    },
    component: () => import('@views/pages/topic/human/story-detail.vue'),
  },
  {
    path: '/story-detail-audit',
    name: '/story-detail-audit',
    meta: {
      title: '故事详情',
      menu: '/audit-story'
    },
    component: () => import('@views/pages/topic/human/story-detail.vue'),
  },
]