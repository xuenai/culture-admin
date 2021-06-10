// 菜单所属菜单 当属于顶级菜单的时候的值
export const TOP_MENU_VALUE = -1;

// 菜单的类型
export const MENU_TYPES = [
  {
    name: '目录',
    value: 'MENU_CATALOG',
  },
  {
    name: '操作菜单',
    value: 'MENU_OPERATION',
  },
];
// 启用/禁用状态
export const DATA_STATE = [
  {
    code: '',
    name: '全部',
  },
  {
    code: '1',
    name: '启用',
  },
  {
    code: '2',
    name: '禁用',
  }
];
// 推荐/不推荐状态
export const RECOMMEND_STATE = [
  {
    code: '',
    name: '全部',
  },
  {
    code: '0',
    name: '不推荐',
  },
  {
    code: '1',
    name: '推荐',
  }
];

// 权限常量列表
export const OPERATES_CODES = [
  {
    code: "list_detail",
    name: "列表/详情"
  },
  {
    code: "edit",
    name: "编辑"
  },
  {
    code: 'status',
    name: '状态'
  },
  {
    code: "delete",
    name: "删除"
  },
  {
    code: "cancel",
    name: "取消"
  },
  {
    code: "recall",
    name: "撤回"
  },
  {
    code: "save",
    name: "添加"
  },
  {
    code: "submit",
    name: "提交"
  },
  {
    code: 'saveDraft',
    name: '存草稿'
  },
  {
    code: "process",
    name: "流程"
  },
  {
    code: "deal",
    name: '处理'
  },
  {
    code: "audit",
    name: "审核"
  },
  {
    code: "setting",
    name: "配置"
  },
  {
    code: "visit",
    name: "回访"
  },
  {
    code: "recommend",
    name: "推荐"
  },
  {
    code: "cancelRecommend",
    name: "取消推荐"
  },
  {
    code: "top",
    name: "置顶"
  },
  {
    code: "cancelTop",
    name: "取消置顶"
  },
  {
    code: "sort",
    name: "排序"
  },
  {
    code: "batchDelete",
    name: "批量删除"
  },
  {
    code: "batchSave",
    name: "批量提交"
  },
  {
    code: "batchDisabled",
    name: "批量禁用"
  },
  {
    code: "batchAbled",
    name: "批量启用"
  },
  {
    code: "batchCheck",
    name: "批量审核"
  },
  {
    code: "transfer",
    name: "转移"
  },
  {
    code: "report",
    name: "上报"
  },
  {
    code: "cloudLeague",
    name: "云联盟"
  },
  {
    code: "import",
    name: "导入"
  },
  {
    code: "export",
    name: "导出"
  },
  {
    code: "activity_room",
    name: "活动室"
  },
  {
    code: "attractions",
    name: "景点"
  },
  {
    code: "guestRoom",
    name: "客房"
  },
  {
    code: "sending",
    name: "重新发码"
  },
  {
    code: 'verification',
    name: '核销'
  },
  {
    code: 'user',
    name: '用户'
  },
  {
    code: 'setCover',
    name: '设置封面'
  },
  {
    code: 'ass_person',
    name: '社团成员'
  },
  {
    code:'venue_book',
    name:'场馆预约'
  }
];

// 资源类型常量列表
export const PlACE_TYPES = [
  {
    value: '',
    name: '全部'
  },
  {
    value: 'CONTENT_TYPE_VENUE',
    name: '场馆'
  },
  {
    value: 'CONTENT_TYPE_SCENERY',
    name: '景区'
  },
  {
    value: 'CONTENT_TYPE_HOTEL',
    name: '酒店'
  },
  {
    value: 'CONTENT_TYPE_RESTAURANT',
    name: '餐饮'
  },
  {
    value: 'CONTENT_TYPE_TOILET',
    name: '厕所'
  },
  {
    value: 'CONTENT_TYPE_PARKING',
    name: '停车场'
  },
  {
    value: 'CONTENT',
    name: '内容'
  }
];
// 资源类型常量列表（点评标签）
export const REVIEW_SOURCE_TYPES = [
  {
    value: '',
    name: '全部'
  },
  {
    value: 'CONTENT_TYPE_VENUE',
    name: '场馆'
  },
  {
    value: 'CONTENT_TYPE_SCENERY',
    name: '景区'
  },
  {
    value: 'CONTENT_TYPE_HOTEL',
    name: '酒店'
  },
  {
    value: 'CONTENT_TYPE_RESTAURANT',
    name: '餐饮'
  },
  {
    value: 'CONTENT_TYPE_ACTIVITY',
    name: '活动'
  }
];
//点评类型常量列表
export const REVIEW_TYPES = [
  {
    value: '',
    name: '全部'
  },
  {
    value: '0',
    name: '好评'
  },
  {
    value: '1',
    name: '差评'
  },
  {
    value: '2',
    name: '一般'
  }
];
// 资源类型常量列表（点评管理）
export const DATAS_TYPES = [
  {
    value: '',
    name: '全部',
  },
  {
    value: 'CONTENT',
    name: '内容',
  },
  {
    value: 'CONTENT_TYPE_SCENERY',
    name: '景区',
  },
  {
    value: 'CONTENT_TYPE_HOTEL',
    name: '酒店',
  },
  {
    value: 'CONTENT_TYPE_RESTAURANT',
    name: '餐饮',
  },
  {
    value: 'CONTENT_TYPE_VENUE',
    name: '文化场馆',
  },
  {
    value: 'CONTENT_TYPE_ACTIVITY',
    name: '活动',
  },
  {
    value: 'CONTENT_TYPE_STORY',
    name: '故事',
  },
  {
    value: 'CONTENT_TYPE_ASSOCIATION',
    name: '社团',
  },
  {
    value: 'CONTENT_TYPE_VOLUNTEER_TEAM',
    name: '志愿者团队',
  },
  {
    value: 'CONTENT_TYPE_COURSE',
    name: '上学堂评论',
  }
];

//审核状态常量列表
export const AUDIT_STATUS = [
  {
    value: '',
    name: '全部'
  },
  {
    value: '4',
    name: '未处理'
  },
  {
    value: '5',
    name: '已受理'
  },
  {
    value: '6',
    name: '已处理'
  },
  {
    value: '500',
    name: '审核异常'
  }
];
//审核类型常量列表
export const AUDIT_TYPES = [
  {
    value: '',
    name: '全部'
  },
  {
    value: 'artificial',
    name: '人工审核'
  },
  {
    value: 'machine',
    name: '人工智能'
  }
];
//投诉类型常量列表
export const COMPLAINTS_TYPES = [
  {
    value: '',
    name: '全部'
  },
  {
    value: 'personnel',
    name: '人员'
  },
  {
    value: 'service',
    name: '服务'
  },
  {
    value: 'environment',
    name: '环境'
  }
];
//处理状态常量列表
export const DEAL_STATUS = [
  {
    value: '',
    name: '全部'
  },
  {
    value: '4',
    name: '待处理'
  },
  {
    value: '5',
    name: '已受理'
  },
  {
    value: '6',
    name: '已处理'
  }
];

export const icons = [
  'c-icon-gaikuang', // 概况
  'c-icon-neirong1', // 内容
  'c-icon-changguanhuodong', // 场所
  'c-icon-huodongshiguanli', // 活动
  'c-icon-huatihuodong', // 话题
  'c-icon-shenhe', // 审核
  'c-icon-huiyuan', // 会员
  'c-icon-shangyun', // 上云
  'c-icon-shezhi-xianxing', // 设置
  'c-icon-peizhi', // 配置
  'c-icon-zhandianguanli1', // 站点
]

// 活动类型
export const ACTIVITY_TYPE = {
  "ACTIVITY_TYPE_RESERVE": "预订活动",
  "ACTIVITY_TYPE_ENROLL": "报名活动",
  "ACTIVITY_TYPE_PLAIN": "宣传活动",
  "ACTIVITY_TYPE_VOLUNT": "志愿活动",
  "ACTIVITY_TYPE_SERVICE": "普通活动",
}
// 活动方式
export const ACTIVITY_METHOD = {
  "ACTIVITY_MODE_ENROLL_FREE": "免费报名",
  "ACTIVITY_MODE_ENROLL_INTEGRAL": "积分报名",
  "ACTIVITY_MODE_ENROLL_PAY": "付费报名",
  "ACTIVITY_MODE_FREE": "免费预订",
  "ACTIVITY_MODE_INTEGRAL": "积分预订",
  "ACTIVITY_MODE_INTEGRAL_PAY": "付费预订",
  "ACTIVITY_MODE_PLAIN": "普通分享活动",
  "ACTIVITY_MODE_OTHER": "其他分享活动",
  "ACTIVITY_MODE_VOLUNT": "志愿招募",
  "ACTIVITY_MODE_SERVICE": "普通活动",
}
// 审核状态、数据状态
export const AUDIT_DATA_STATUS = {
  1: '正常',
  2: '禁用',
  3: '草稿',
  4: '待审核',
  5: '审核中',
  6: '审核通过',
  7: '回退',
  8: '撤回',
  9: '终止',
  79: '审核不通过',
}

// 用户端配置 跳转类型(顶部菜单和底部菜单跳转类型)
export const MENU_JUMPLIST = [
  {
    name: '首页',
    menuCode: 'INDEX',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '活动首页',
    menuCode: 'ACTIVITY',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '时光首页',
    menuCode: 'TIME',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '商城主页',
    menuCode: 'MALL',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '商品详情',
    menuCode: 'MALL_DETAIL',
    jumpType: 3,
    resourceType: 'MALL_DETAIL',
    notMenu: true
  },
  {
    name: '个人中心首页',
    menuCode: 'USER',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '积分首页',
    menuCode: 'INTEGRAL',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '我的订单页',
    menuCode: 'ORDERS',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '我的活动页',
    menuCode: 'MY_ACTIVITY',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '我的预订页',
    menuCode: 'BOOKING',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '电子消费码页',
    menuCode: 'CONSUMPTION_CODE',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '用户诚信页',
    menuCode: 'HONESTY',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '目的地首页',
    menuCode: 'DESTINATION',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '景区列表',
    menuCode: 'SCENIC',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '景区详情',
    menuCode: 'SCENIC_DETIAL',
    jumpType: 3,
    resourceType: 'CONTENT_TYPE_SCENERY',
    notMenu: true
  },
  {
    name: '文化场馆列表',
    menuCode: 'VENUE',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '文化场馆详情',
    menuCode: 'VENUE_DETAIL',
    jumpType: 3,
    resourceType: 'CONTENT_TYPE_VENUE',
    notMenu: true
  },
  {
    name: '酒店列表',
    menuCode: 'HOTEL',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '酒店详情',
    menuCode: 'HOTEL_DETAIL',
    jumpType: 3,
    resourceType: 'CONTENT_TYPE_HOTEL',
    notMenu: true
  },
  {
    name: '餐饮列表',
    menuCode: 'FOOD',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '餐饮详情',
    menuCode: 'FOOD_DETAIL',
    jumpType: 3,
    resourceType: 'CONTENT_TYPE_RESTAURANT',
    notMenu: true
  },
  {
    name: '攻略列表',
    menuCode: 'RAIDERS',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '攻略详情',
    menuCode: 'RAIDERS_DETAIL',
    jumpType: 3,
    resourceType: 'strategy',
    notMenu: true
  },
  {
    name: '话题列表',
    menuCode: 'TOPIC',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '话题详情',
    menuCode: 'TOPIC_DETAIL',
    jumpType: 3,
    resourceType: 'CONTENT_TYPE_TOPIC',
    notMenu: true
  },
  {
    name: '志愿者首页',
    menuCode: 'VOLUNTEER',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '志愿者列表',
    menuCode: 'VOLUNTEER_LIST',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '文化社团列表',
    menuCode: 'COMMUNITY',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '文化社团详情',
    menuCode: 'COMMUNITY_DETAIL',
    jumpType: 3,
    resourceType: 'CONTENT_TYPE_ASSOCIATION',
    notMenu: true
  },
  {
    name: '自驾游列表',
    menuCode: 'zijiayou',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '公共服务首页',
    menuCode: 'COMMON',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '720列表',
    menuCode: 'PANORAMIC',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '直播列表',
    menuCode: 'LIVE',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '网红打卡首页',
    menuCode: 'HOT',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '导游查询',
    menuCode: 'GUIDE',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '旅行社',
    menuCode: 'AGENCY',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '厕所',
    menuCode: 'TOILET',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '停车场',
    menuCode: 'PARKING',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '非遗首页',
    menuCode: 'INTANGIBLE',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '非遗项目列表',
    menuCode: 'INTANGIBLE_PROJECT',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '非遗传承人列表',
    menuCode: 'INTANGIBLE_SUCCESSOR',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '项目体验基地列表',
    menuCode: 'PROJECT_EXPERIENCE_BASE',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '传习保护基地列表',
    menuCode: 'MISSION_PROTECTION_BASE',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '非遗美食列表',
    menuCode: 'INTANGIBLE_FOOD',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '非遗资讯列表',
    menuCode: 'INTANGIBLE_NEWS',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '非遗视频列表',
    menuCode: 'INTANGIBLE_VIDEO',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '非遗音频列表',
    menuCode: 'INTANGIBLE_AUDIO',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '非遗商品列表',
    menuCode: 'INTANGIBLE_GOODS',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '一键求助',
    menuCode: 'ASK_FOR_HELP',
    jumpType: 1,
    resourceType: ''
  },
  {
    name: '智能行程主页',
    menuCode: 'ITINTERARY',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '公交查询',
    menuCode: 'BUS_INQUIRY',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '火车查询',
    menuCode: 'TRAIN_INQUIRY',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '汽车票查询',
    menuCode: 'TICKET_INQUIRY',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '飞机查询',
    menuCode: 'AIRCRAFT_INQUIRY',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '智能机器人',
    menuCode: 'ROBOT',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '意见反馈',
    menuCode: 'FEEDBACK',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '上学堂',
    menuCode:'SCHOOL',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '乡村游',
    menuCode: 'COUNTRY_TOUR',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '农家乐',
    menuCode: 'FARMHOUSE',
    jumpType: 1,
    resourceType: '',
  },
  // 不进行跳转 只是点击提示的按钮
  {
    name: '开发中的功能',
    menuCode: 'DEVELOP',
    jumpType: 1,
    resourceType: '',
  },
  {
    name: '外部链接',
    menuCode: 'EXTERNAL',
    jumpType: 2,
    resourceType: ''
  }
];
//反馈类型常量列表
export const FEEDBACK_TYPES = [
  {
    value: '',
    name: '全部'
  },
  {
    value: 'EXPERIENCE',
    name: '体验问题'
  },
  {
    value: 'FUNCTION',
    name: '功能建议'
  },
  {
    value: 'SERVICE',
    name: '服务建议'
  },
  {
    value: 'OTHER',
    name: '其他'
  }
];