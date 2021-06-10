/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 20:28:25
 * @LastEditTime: 2019-08-12 10:44:29
 * @LastEditors: Please set LastEditors
 */
// 引入封装好的axios请求
import request from '@/util/request';
// 景区列表
export const getScenicList = (params?: object) => request({ url: 'res/site/ctcScenic/list', params })
// 场馆列表
export const getVenuesList = (params?: object) => request({ url: 'res/site/ctcVenue/list', params })
// 地区
export const getRegionSelect = (params?: object) => request({ url: 'res/region/select', params })
// 地区带分页
export const getRegionList = (params?:object) => request({url: 'res/region/list', params})
// 场馆保存
export const saveVenue = (data?: object) => request({ url: 'res/site/ctcVenue/save', data, method: 'post' ,loading:true})
// 场馆撤回
export const venueWithdraw = (data?: object) => request({ url: 'res/site/ctcVenue/withdraw', data,method:'post'})
// 列表删除
export const deleteCol = (data?: object) => request({ url: 'res/site/ctcCommonPlace/deleteResourceById', data, method: 'post' })
// 列表提交
export const submitBatch = (data?: object) => request({ url: 'res/site/ctcCommonPlace/submitBatchById', data, method: 'post' })

// 场馆详情
export const venueView = (params?: object) => request({ url: 'res/site/ctcVenue/view', params, loading: true })
// 场馆审核流程
export const getVenueAuditProcess = (params?: object) => request({ url: 'res/site/ctcVenue/getVenueAuditProcess', params })
// 场馆导入
export const venueImportExcel = (data: object) => request({ url: 'res/site/ctcVenue/importExcel', data , method: 'post', isUploadFile: true})

// 活动室列表
export const activityRoomList = (params?: object) => request({ url: 'res/site/ctcActivityRoom/list', params })
// 活动室场馆
export const getVenueData = (params?: object) => request({ url: 'res/site/ctcVenue/getVenueDataById', params })
// 活动室详情
export const activityRoomView = (params?: object) => request({ url: 'res/site/ctcActivityRoom/view', params, loading: true })
// 活动室保存
export const  activityRoomSave = (data?: object) => request({ url: 'res/site/ctcActivityRoom/save', data,method:'post',loading:true})
// 活动室撤回
export const activityRoomWithdraw = (data?: object) => request({ url: 'res/site/ctcActivityRoom/withdraw', data, method: 'post' })
// 活动室预约保存
export const  saveOrderRule = (data?: object) => request({ url: 'res/site/ctcActivityRoomOrderRule/saveOrderRule', data,method:'post',loading:true})

// 删除活动室预约时间段
export const  deleteRule = (data?: object) => request({ url: 'res/site/ctcActivityRoomOrderRule/deleteRuleById', data,method:'post'})
// 活动室预约详情
export const  getRuleDataInfo = (params?: object) => request({ url: 'res/site/ctcActivityRoomOrderRule/getRuleDataInfo', params, loading: true})
// 活动室座位模板删除
export const deleteTemplateAndActivityRoom = (data?: object) => request({ url: 'res/site/ctcActivityRoom/deleteTemplateAndActivityRoom', data,method:'post'})
// 活动室审核流程
export const getcAitivityRoomAuditProcess= (params?: object) => request({ url: 'res/site/ctcActivityRoom/getActivityRoomAuditProcess',params})
// 活动室导入
export const activityRoomImportExcel = (data: object) => request({ url: 'res/site/ctcActivityRoom/importExcel', data , method: 'post', isUploadFile: true})

// 景区详情
export const getScenicDesc = (params?: object) => request({ url: 'res/site/ctcScenic/view', params, loading: true })
// 景区保存
export const saveScenic = (data?: object) => request({ url: 'res/site/ctcScenic/save', data, method: 'post' ,loading:true})
// 景区撤回
export const scenicWithdraw = (data?: object) => request({ url: 'res/site/ctcScenic/withdraw', data,method:'post', loading: true})
// 景区导入
export const scenicImportExcel = (data: object) => request({ url: 'res/site/ctcScenic/importExcel', data , method: 'post', isUploadFile: true})

// 保存景区预订地址
export const saveOrderAddress = (data?: object) => request({ url: 'res/site/ctcOrderAddressMannage/saveOrderAddress', data, method: 'post',loading:true })
// 删除预订地址
export const deleteOrderAddress = (data?: object) => request({ url: 'res/site/ctcOrderAddressMannage/deleteOrderAddress', data, method: 'post' })
// 景点详情所属景区
export const getScenicPoint = (params?: object) => request({ url: 'res/site/ctcScenic/getScenicInfo', params , loading: true})
export const getScenicPointDesc = (params?: object) => request({ url: 'res/site/ctcScenicSpots/view', params , loading: true})
// 景点列表
export const getScenicPointList = (params?: object) => request({ url: 'res/site/ctcScenicSpots/list', params })
// 景点撤回
export const scenicSpotsWithdraw = (data?: object) => request({ url: 'res/site/ctcScenicSpots/withdraw', data,method:'post'})
// 查询预订地址
export const orderAddress = (params?: object) => request({ url: 'res/site/ctcOrderAddressMannage/getOrderAddressInfo', params })
// 保存景点
export const saveScecnicPonit = (data?: object) => request({ url: 'res/site/ctcScenicSpots/save', data, method: 'post',loading:true })
// 景点导入
export const scenicSpotsImportExcel = (data: object) => request({ url: 'res/site/ctcScenicSpots/importExcel', data , method: 'post', isUploadFile: true})

// 删除标签
export const searchTag = (params?: object) => request({ url: 'config/resLabel/delete', params})
// 删除资源
export const deleteResourceById = (data?: object) => request({ url: 'res/site/ctcCommonPlace/deleteResourceById', data, method: 'post' })
// 启用禁用
export const commonUpdateStatus = (data?: object) => request({ url: 'res/resourceManage/updateStatus', data, method: 'post' })

// 酒店列表
export const getHotelList = (params?: object) => request({ url: 'res/site/ctcHotel/list', params ,noCancelRepeatRequest:true })
// 酒店撤回
export const hotelWithdraw = (data?: object) => request({ url: 'res/site/ctcHotel/withdraw', data,method:'post'})
// 景区流程
export const getScenicAuditProcess = (params?: object) => request({ url: 'res/site/ctcScenic/getScenicAuditProcess', params })
// 景点流程
export const getScenicSpotsAuditProcess = (params?: object) => request({ url: 'res/site/ctcScenicSpots/getScenicSpotsAuditProcess', params })
// 保存酒店
export const saveHotel = (data?: object) => request({ url: 'res/site/ctcHotel/save', data,method:'post',loading:true })
// 酒店详情
export const getHotelView = (params?: object) => request({ url: 'res/site/ctcHotel/view', params, loading: true})
// 酒店审核流程
export const getHotelAuditProcess= (params?: object) => request({ url: 'res/site/ctcHotel/getHotelAuditProcess',params})
// 酒店导入
export const hotelImportExcel = (data: object) => request({ url: 'res/site/ctcHotel/importExcel', data , method: 'post', isUploadFile: true})

// 客房列表
export const getHotelRoomList = (params?: object) => request({ url: 'res/site/ctcHotelRoom/list', params})
// 客房保存
export const hotelRoomSave = (data?: object) => request({ url: 'res/site/ctcHotelRoom/save', data,method:'post' ,loading:true})
// 客房撤回
export const hotelRoomWithdraw = (data?: object) => request({ url: 'res/site/ctcHotelRoom/withdraw', data,method:'post'})
// 客房详情
export const getHotelRoomView = (params?: object) => request({ url: 'res/site/ctcHotelRoom/view', params, loading: true})
// 酒店头部详情
export const getHotelHeadDesc = (params?: object) => request({ url: 'res/site/ctcHotel/getHotelDataById', params})
// 客房审核流程
export const getRoomAuditProcess= (params?: object) => request({ url: 'res/site/ctcHotelRoom/getHotelRoomAuditProcess',params})
// 客房导入
export const hotelRoomImportExcel = (data: object) => request({ url: 'res/site/ctcHotelRoom/importExcel', data , method: 'post', isUploadFile: true})

// 餐饮列表
export const getFoodList = (params?: object) => request({ url: 'res/site/ctcDining/list', params})
// 餐饮保存
export const foodSave = (data?: object) => request({ url: 'res/site/ctcDining/save', data,method:'post',loading:true })
// 餐饮撤回
export const diningRoomWithdraw = (data?: object) => request({ url: 'res/site/ctcDining/withdraw', data,method:'post'})
// 餐饮详情
export const foodView = (params?: object) => request({ url: 'res/site/ctcDining/view', params, loading: true})
// 餐饮审核流程
export const getDiningAuditProcess= (params?: object) => request({ url: 'res/site/ctcDining/getDiningAuditProcess',params})
// 餐饮导入
export const diningImportExcel = (data: object) => request({ url: 'res/site/ctcDining/importExcel', data , method: 'post', isUploadFile: true})

// 停车场列表
export const getParkingList = (params?: object) => request({ url: 'res/site/ctcParkingLot/list', params})
// 停车场详情
export const getParkingView= (params?: object) => request({ url: 'res/site/ctcParkingLot/view', params, loading: true})
// 停车场撤回
export const parkingWithdraw = (data?: object) => request({ url: 'res/site/ctcParkingLot/withdraw', data,method:'post'})
// 保存停车场
export const saveParking= (data?: object) => request({ url: 'res/site/ctcParkingLot/save', data,method:'post',loading:true})
// 停车场审核流程
export const getParkingAuditProcess= (params?: object) => request({ url: 'res/site/ctcParkingLot/getParkingAuditProcess',params})
// 停车场导入
export const parkingLotImportExcel = (data: object) => request({ url: 'res/site/ctcParkingLot/importExcel', data , method: 'post', isUploadFile: true})

// 厕所列表
export const getToiletList = (params?: object) => request({ url: 'res/site/ctcToilet/list', params})
// 厕所详情
export const getToiletView= (params?: object) => request({ url: 'res/site/ctcToilet/view', params, loading: true})
// 餐饮撤回
export const toiletWithdraw = (data?: object) => request({ url: 'res/site/ctcToilet/withdraw', data,method:'post'})
// 保存厕所
export const saveToilet= (data?: object) => request({ url: 'res/site/ctcToilet/save', data,method:'post',loading:true})
// 厕所审核流程
export const getToiletAuditProcess= (params?: object) => request({ url: 'res/site/ctcToilet/getToiletAuditProcess',params})
// 厕所导入
export const ctcToiletImportExcel = (data: object) => request({ url: 'res/site/ctcToilet/importExcel', data , method: 'post', isUploadFile: true})

// 场所概况
export const getPieChart = (params?: object) => request({ url: 'res/site/ctcCommonPlace/getOverview', params})
// 场所概况分类折线图(近7天新增场所)
export const getLineChart = (params?: object) => request({ url: 'res/site/ctcCommonPlace/getLineChart', params})
// 场所概况分类折线图(最近一月活动室预约数量统计)
export const getActivityRoomOrderMonthData = (params?: object) => request({ url: 'res/site/ctcCommonPlace/getActivityRoomOrderMonthData', params})
 // 场所概况分类折线图(最近一月场馆预约数量统计)
 export const getVenueOrderMonth = (params?: object) => request({ url: 'res/site/ctcVenueOrderSetUp/getVenueOrderMonth', params}) 
//场馆预约数量
 export const getVenueOrderNum = (params?: object) => request({ url: 'res/site/ctcVenueOrderSetUp/getVenueOrderNum', params})

// 批量提交或单个提交
export const submitBatchById = (data?: object) => request({ url: 'res/site/ctcCommonPlace/submitBatchById', data,method:'post' })

// 活动室预约订单列表
export const orderList = (params?: object) => request({ url: 'act/activity/order/orderList',params, loading: true})
// 活动室预约订单详情
export const orderDesc = (params?: object) => request({ url: 'act/activity/order/orderInfo',params, loading: true})

// 重置消费码
export const restartCode = (data?: object) => request({ url: 'act/activity/order/restartCode',data,method:'post',loading:true})
// 预约订单 活动室详情信息
export const orderActivityRoomInfo = (params?: object) => request({ url: 'res/site/ctcActivityRoom/getOrderActivityRoomInfo',params, loading: true})
// 通过消费码查询商品信息
export const orderInfoByCode = (params?: object) => request({ url: 'act/activity/order/orderInfoByCode',params,noMessage: true})
// 核销订单
export const validOrder = (data?: object) => request({ url: 'act/activity/order/validOrder',data,method:'post',loading:true,noMessage: true})

// 小电商销售门票
export const getShopList = (params?: object) => request({ url: 'res/site/ctcCommonPlace/getShopList',params})

// 资源库数据列表
export const basicList = (params: object) => request({ url: 'res/basic/list', params,  loading: true })
// 使用资源库数据
export const basicBind = (data: object) => request({ url: 'res/basic/bind', data,method:'post', loading: true })
// 资源详情
export const basicView = (params: object) => request({ url: 'res/basic/view', params, loading: true})



// 农家乐列表
export const getAgritainmentList = (params?: object) => request({ url: '/res/agritainment/list', params})
// 农家乐保存
export const agritainmentSave = (data?: object) => request({ url: '/res/agritainment/save', data,method:'post',loading:true })
// 农家乐撤回
export const agritainmentWithdraw = (data?: object) => request({ url: '/res/agritainment/withdraw', data,method:'post'})
// 农家乐详情
export const agritainmentView = (params?: object) => request({ url: '/res/agritainment/view', params, loading: true})
// 农家乐审核流程
export const getAgritainmentStatus = (params?: object) => request({ url: '/res/agritainment/auditProcess',params})
// 农家乐导入
export const agritainmentImportExcel = (data: object) => request({ url: '/res/agritainment/importExcel', data , method: 'post', isUploadFile: true})
// 场馆预约保存
export const ctcVenueOrderSetUpSave = (data: object) => request({ url: 'res/site/ctcVenueOrderSetUp/save', data,method:'post', loading: true})
//场馆预约详情
export const getVenueOrderInfo = (params: object) => request({ url: 'res/site/ctcVenueOrderSetUp/getVenueOrderInfo', params})
//查询开放预约的场馆列表
export const getVenueIsOpenList = (params: object) => request({ url: 'res/site/ctcVenue/getVenueIsOpenList', params})
//（预约库存）查询日历集合(所有数量)
export const getOrderStockList = (params: object) => request({ url: 'res/site/ctcVenueOrderSetUp/getOrderStockList', params})
//场馆日期预定数量
export const venueOrderDateNumFromSite = (params: object) => request({ url: 'act/activity/order/venueOrderDateNumFromSite', params})
//场馆预约批量设置
export const updateVenueSetUpParameter = (data: object) => request({ url: 'res/site/ctcVenueOrderSetUp/updateVenueSetUpParameter', data,method:'post'})
//查询某一天预约详情
export const getVenueOrderInfoByDate = (params: object) => request({ url: 'res/site/ctcVenueOrderSetUp/getVenueOrderInfoByDate', params})
//查询操作记录
export const getVenueSetUpLog = (params: object) => request({ url: 'res/site/ctcVenueOrderSetUp/getVenueSetUpLog', params})
//场馆订单列表
export const venueOrderList = (params: object) => request({ url: 'act/activity/order/venueOrderList', params})
//场馆订单详情
export const venueOrderInfo = (params: object) => request({ url: 'act/activity/order/orderInfo', params})
//场馆类型标签列表
export const getVenueType = (params: object) => request({ url: 'res/site/ctcCommonPlace/getVenueType', params})
