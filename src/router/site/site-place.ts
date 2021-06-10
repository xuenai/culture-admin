/*
 * @Author: Hexg
 * @Date: 2019-06-17 17:12:35
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-10-17 15:24:58
 */
// 场所模块儿的路由
export default [
    {
        path: '/place-profile',
        name: 'place-profile',
        meta: {
            title: '概况'
        },
        component: () => import('@views/pages/place/profile/profile.vue'),
    },
    {
        path: '/venues-list',
        name: 'venues-list',
        meta: {
            title: '文化场馆',

        },
        component: () => import('@views/pages/place/venues/venues-index/list.vue'),
    },
    {
        path: '/venues-add',
        name: 'venues-add',
        meta: {
            menu: '/venues-list',
            title: '添加场馆'
        },
        component: () => import('@views/pages/place/venues/venues-index/edit.vue'),
    },
    {
        path: '/venues-search',
        name: 'venues-search',
        meta: {
            menu: '/venues-list',
            title: '添加场馆'
        },
        component: () => import('@views/pages/place/venues/venues-index/resource-search.vue'),
    },
    {
        path: '/venues-search-list',
        name: 'venues-search-list',
        meta: {
            menu: '/venues-list',
            title: '大旗生态库搜索结果'
        },
        component: () => import('@views/pages/place/venues/venues-index/resource-search-list.vue'),
    },
    {
        path: '/venues-edit',
        name: 'venues-edit',
        meta: {
            menu: '/venues-list',
            title: '编辑场馆'
        },
        component: () => import('@views/pages/place/venues/venues-index/edit.vue'),
    },
    {
        path: '/venues-detail',
        name: 'venues-detail',
        meta: {
            menu: '/venues-list',
            title: '场馆详情'
        },
        component: () => import('@views/pages/place/venues/venues-index/detail.vue'),
    },
    {
        path: '/room-list',
        name: 'room-list',
        meta: {
            menu: '/venues-list',
            title: '活动室'
        },
        component: () => import('@views/pages/place/venues/activity-room/list.vue'),
    },
    {
        path: '/room-search-list',
        name: 'room-search-list',
        meta: {
            menu: '/venues-list',
            title: '大旗生态库搜索结果'
        },
        component: () => import('@views/pages/place/venues/activity-room/search-list.vue'),
    },
    {
        path: '/room-add',
        name: 'room-add',
        meta: {
            menu: '/venues-list',
            title: '新增活动室'
        },
        component: () => import('@views/pages/place/venues/activity-room/edit.vue'),
    },
    {
        path: '/room-edit',
        name: 'room-edit',
        meta: {
            menu: '/venues-list',
            title: '活动室编辑'
        },
        component: () => import('@views/pages/place/venues/activity-room/edit.vue'),
    },
    {
        path: '/room-reserve',
        name: 'room-reserve',
        meta: {
            menu: '/venues-list',
            title: '活动室预约'
        },
        component: () => import('@views/pages/place/venues/activity-room/room-reserve.vue'),
    },
    {
        path: '/room-detail',
        name: 'room-detail',
        meta: {
            menu: '/venues-list',
            title: '活动室详情'
        },
        component: () => import('@views/pages/place/venues/activity-room/detail.vue'),
    },
    {
        path: '/scenic-list',
        name: 'scenic-list',
        meta: {
            title: '景区'
        },
        component: () => import('@views/pages/place/scenic/scenic-index/list.vue'),
    },
    {
        path: '/scenic-search',
        name: 'scenic-search',
        meta: {
            menu: '/scenic-list',
            title: '添加景区'
        },
        component: () => import('@views/pages/place/scenic/scenic-index/search.vue'),
    },
    {
        path: '/scenic-search-list',
        name: 'scenic-search-list',
        meta: {
            menu: '/scenic-list',
            title: '生态数据库搜索结果'
        },
        component: () => import('@views/pages/place/scenic/scenic-index/search-list.vue'),
    },
    {
        path: '/scenic-add',
        name: 'scenic-add',
        meta: {
            menu: '/scenic-list',
            title: '新增景区'
        },
        component: () => import('@views/pages/place/scenic/scenic-index/edit.vue'),
    },
    {
        path: '/scenic-edit',
        name: 'scenic-edit',
        meta: {
            menu: '/scenic-list',
            title: '景区编辑'
        },
        component: () => import('@views/pages/place/scenic/scenic-index/edit.vue'),
    },
    {
        path: '/scenic-detail',
        name: 'scenic-detail',
        meta: {
            menu: '/scenic-list',
            title: '景区详情'
        },
        component: () => import('@views/pages/place/scenic/scenic-index/detail.vue'),
    },
    {
        path: '/attractions-list',
        name: 'attractions-list',
        meta: {
            title: '景点',
            menu: '/scenic-list'
        },
        component: () => import('@views/pages/place/scenic/attractions/list.vue'),
    },
    {
        path: '/attractions-search',
        name: 'attractions-search',
        meta: {
            menu: '/scenic-list',
            title: '添加景点'
        },
        component: () => import('@views/pages/place/scenic/attractions/search.vue'),
    },
    {
        path: '/attractions-search-list',
        name: 'attractions-search-list',
        meta: {
            menu: '/scenic-list',
            title: '生态数据库搜索结果'
        },
        component: () => import('@views/pages/place/scenic/attractions/search-list.vue'),
    },
    {
        path: '/attractions-add',
        name: 'attractions-add',
        meta: {
            title: '添加景点',
            menu: '/scenic-list'
        },
        component: () => import('@views/pages/place/scenic/attractions/edit.vue'),
    },
    {
        path: '/attractions-edit',
        name: 'attractions-edit',
        meta: {
            title: '景点编辑',
            menu: '/scenic-list'
        },
        component: () => import('@views/pages/place/scenic/attractions/edit.vue'),
    },
    {
        path: '/attractions-detail',
        name: 'attractions-detail',
        meta: {
            title: '景点详情',
            menu: '/scenic-list'
        },
        component: () => import('@views/pages/place/scenic/attractions/detail.vue'),
    },
    {
        path: '/hotel-list',
        name: 'hotel-list',
        meta: {
            title: '酒店'
        },
        component: () => import('@views/pages/place/hotel/hotel-index/list.vue'),
    },
    {
        path: '/hotel-add',
        name: 'hotel-add',
        meta: {
            menu: '/hotel-list',
            title: '新增酒店'
        },
        component: () => import('@views/pages/place/hotel/hotel-index/edit.vue'),
    },
    {
        path: '/hotel-search',
        name: 'hotel-search',
        meta: {
            menu: '/hotel-list',
            title: '新增酒店'
        },
        component: () => import('@views/pages/place/hotel/hotel-index/resource-search.vue'),
    },
    {
        path: '/hotel-search-list',
        name: 'hotel-search-list',
        meta: {
            menu: '/hotel-list',
            title: '生态数据库搜索结果'
        },
        component: () => import('@views/pages/place/hotel/hotel-index/resource-search-list.vue'),
    },
    {
        path: '/hotel-edit',
        name: 'hotel-edit',
        meta: {
            menu: '/hotel-list',
            title: '酒店编辑'
        },
        component: () => import('@views/pages/place/hotel/hotel-index/edit.vue'),
    },
    {
        path: '/hotel-detail',
        name: 'hotel-detail',
        meta: {
            menu: '/hotel-list',
            title: '酒店详情'
        },
        component: () => import('@views/pages/place/hotel/hotel-index/detail.vue'),
    },
    {
        path: '/guestroom-list',
        name: 'guestroom-list',
        meta: {
            menu: '/hotel-list',
            title: '客房'
        },
        component: () => import('@views/pages/place/hotel/guest-room/list.vue'),
    },
    {
        path: '/guestroom-add',
        name: 'guestroom-add',
        meta: {
            menu: '/hotel-list',
            title: '新增客房'
        },
        component: () => import('@views/pages/place/hotel/guest-room/edit.vue'),
    },
    {
        path: '/guestroom-edit',
        name: 'guestroom-edit',
        meta: {
            menu: '/hotel-list',
            title: '客房编辑'
        },
        component: () => import('@views/pages/place/hotel/guest-room/edit.vue'),
    },
    {
        path: '/guestroom-detail',
        name: 'guestroom-detail',
        meta: {
            menu: '/hotel-list',
            title: '客房详情'
        },
        component: () => import('@views/pages/place/hotel/guest-room/detail.vue'),
    },
    {
        path: '/food-list',
        name: 'food-list',
        meta: {
            title: '餐饮'
        },
        component: () => import('@views/pages/place/food/list.vue'),
    },
    {
        path: '/food-search',
        name: 'food-search',
        meta: {
            menu: '/food-list',
            title: '新增餐饮'
        },
        component: () => import('@views/pages/place/food/resource-search.vue'),
    },
    {
        path: '/food-search-list',
        name: 'food-search-list',
        meta: {
            menu: '/food-list',
            title: '生态数据库搜索结果'
        },
        component: () => import('@views/pages/place/food/resource-search-list.vue'),
    },
    {
        path: '/food-add',
        name: 'food-add',
        meta: {
            menu: '/food-list',
            title: '新增餐饮'
        },
        component: () => import('@views/pages/place/food/edit.vue'),
    },
    {
        path: '/food-edit',
        name: 'food-edit',
        meta: {
            menu: '/food-list',
            title: '餐饮编辑'
        },
        component: () => import('@views/pages/place/food/edit.vue'),
    },
    {
        path: '/food-detail',
        name: 'food-detail',
        meta: {
            menu: '/food-list',
            title: '餐饮详情'
        },
        component: () => import('@views/pages/place/food/detail.vue'),
    },
    {
        path: '/toilet-list',
        name: 'toilet-list',
        meta: {
            title: '旅游厕所'
        },
        component: () => import('@views/pages/place/toilet/list.vue'),
    },
    {
        path: '/toilet-add',
        name: 'toilet-add',
        meta: {
            menu: '/toilet-list',
            title: '新增厕所'
        },
        component: () => import('@views/pages/place/toilet/edit.vue'),
    },
    {
        path: '/toilet-edit',
        name: 'toilet-edit',
        meta: {
            menu: '/toilet-list',
            title: '厕所编辑'
        },
        component: () => import('@views/pages/place/toilet/edit.vue'),
    },
    {
        path: '/toilet-detail',
        name: 'toilet-detail',
        meta: {
            menu: '/toilet-list',
            title: '厕所详情'
        },
        component: () => import('@views/pages/place/toilet/detail.vue'),
    },
    {
        path: '/parking-list',
        name: 'parking-list',
        meta: {
            title: '停车场'
        },
        component: () => import('@views/pages/place/parking/list.vue'),
    },
    {
        path: '/parking-add',
        name: 'parking-add',
        meta: {
            menu: '/parking-list',
            title: '新增停车场'
        },
        component: () => import('@views/pages/place/parking/edit.vue'),
    },
    {
        path: '/parking-edit',
        name: 'parking-edit',
        meta: {
            menu: '/parking-list',
            title: '停车场编辑'
        },
        component: () => import('@views/pages/place/parking/edit.vue'),
    },
    {
        path: '/parking-detail',
        name: 'parking-detail',
        meta: {
            menu: '/parking-list',
            title: '停车场详情'
        },
        component: () => import('@views/pages/place/parking/detail.vue'),
    },
    {
        path: '/room-order-list',
        name: 'room-order-list',
        meta: {
            title: '活动室订单'
        },
        component: () => import('@views/pages/place/order/room/list.vue'),
    },
    {
        path: '/room-order-detail',
        name: 'room-order-detail',
        meta: {
            menu: '/room-order-list',
            title: '订单详情'
        },
        component: () => import('@views/pages/place/order/room/detail.vue'),
    },
    {
        path: '/room-order-verify',
        name: 'room-order-verify',
        meta: {
            title: '订单核销'
        },
        component: () => import('@views/pages/place/order/verify.vue'),
    },
    // 农家乐
    {
        path: '/agritainment-list',
        name: 'agritainment-list',
        meta: { 
            title: '农家乐'
        },
        component: () => import('@views/pages/place/agritainment/list.vue'),
    },
    {
        path: '/agritainment-search',
        name: 'agritainment-search',
        meta: {
            menu: '/agritainment-list',
            title: '新增农家乐'
        },
        component: () => import('@views/pages/place/agritainment/resource-search.vue'),
    },
    {
        path: '/agritainment-search-list',
        name: 'agritainment-search-list',
        meta: {
            menu: '/agritainment-list',
            title: '生态数据库搜索结果'
        },
        component: () => import('@views/pages/place/agritainment/resource-search-list.vue'),
    },
    {
        path: '/agritainment-add',
        name: 'agritainment-add',
        meta: {
            menu: '/agritainment-list',
            title: '新增农家乐'
        },
        component: () => import('@views/pages/place/agritainment/edit.vue'),
    },
    {
        path: '/agritainment-edit',
        name: 'agritainment-edit',
        meta: {
            menu: '/agritainment-list',
            title: '编辑农家乐'
        },
        component: () => import('@views/pages/place/agritainment/edit.vue'),
    },
    {
        path: '/agritainment-detail',
        name: 'agritainment-detail',
        meta: {
            menu: '/agritainment-list',
            title: '农家乐详情'
        },
        component: () => import('@views/pages/place/agritainment/detail.vue'),
    },
    {
      path: '/venues-reserve',
      name: 'venues-reserve',
      meta: {
          menu: '/venues-list',
          title: '场馆预约'
      },
      component: () => import('@views/pages/place/venues/venues-index/venues-reserve.vue'),
    },
    {
      path: '/venue-inventory',
      name: 'venue-inventory',
      meta: {
          title: '场馆'
      },
      component: () => import('@views/pages/place/inventory/venues.vue'),
    },
    {
      path: '/venue-record',
      name: 'venue-record',
      meta: {
          title: '操作记录'
      },
      component: () => import('@views/pages/place/inventory/venues-record.vue'),
    },
    {
      path: '/venue-order-list',
      name: 'venue-order-list',
      meta: {
          title: '场馆订单'
      },
      component: () => import('@views/pages/place/order/venues/list.vue'),
    },
    {
      path: '/venue-order-detail',
      name: 'venue-order-detail',
      meta: {
        menu: '/venue-order-list',
        title: '订单详情'
      },
      component: () => import('@views/pages/place/order/venues/detail.vue'),
    },
    {
      path: '/venue-guide',
      name: 'venue-guide',
      meta: {
        title: '添加场馆'
      },
      component: () => import('@views/pages/place/venues/venues-index/guide.vue'),
    },
]
