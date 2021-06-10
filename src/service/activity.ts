/*
 * @Author: 任智勇
 * @since: 2019-06-17 15:38:43
 * @LastAuthor: 陈艳玲
 * @lastTime: 2020-02-24 16:54:22
 */
// 引入封装好的axios请求
import request from '@/util/request'

// 概况 - 数量统计
export const getCountStatistics = (params?: object) =>
  request({ url: 'res/activity/countStatistics', params })
// 概况 - 活动类型
export const getCountProportion = (params?: object) =>
  request({ url: 'res/activity/countProportion', params })
// 概况 - 活动方式
export const getMethodCountProportion = (params?: object) =>
  request({ url: 'res/activity/methodCountProportion', params })
// 概况 - 活动分类统计
export const getClassifyCountProportion = (params?: object) =>
  request({ url: 'res/activity/classifyCountProportion', params })
// 概况 - 最近一月活动统计
export const getBrokenLineActivity = (params?: object) =>
  request({ url: 'res/activity/brokenLineActivity', params })
// 概况 - 活动近七天统计
export const getBrokenLineByLatelySeventh = (params?: object) =>
  request({ url: 'res/activity/brokenLineByLatelySeventh', params })

// 根据场所ids获取 活动室列表
export const getActivityRoomList = (params?: object) =>
  request({ url: 'res/site/ctcActivityRoom/getActivityRoomList', params })
// 活动列表
export const getActivityList = (params?: object) =>
  request({ url: 'res/activity/list', params })
// 活动列表-详情
export const getActivityDetial = (params?: object) =>
  request({ url: 'res/activity/view', params, loading: true })
// 列表启用、禁用数据
export const updateStatus = (data?: object) =>
  request({
    url: 'res/activity/updateStatus',
    data,
    method: 'post',
    loading: true
  })
// 活动列表-撤回
export const getWithdraw = (data: object) =>
  request({
    url: 'res/audit/process/withdraw',
    data,
    method: 'post',
    loading: true
  })
// 活动列表-流程
export const getProcess = (params?: object) =>
  request({ url: 'res/activity/process', params, loading: true })
// 列表删除数据
export const activityDelete = (data?: object) =>
  request({ url: 'res/activity/delete', data, method: 'post', loading: true })
// 提交
export const activitySubmit = (data?: object) =>
  request({ url: 'res/activity/submit', data, method: 'post', loading: true })
// 保存
export const activitySave = (data?: object) =>
  request({ url: 'res/activity/save', data, method: 'post', loading: true })
// 删除上报记录
export const delActiveReport = (data: object) =>
  request({
    url: 'res/report/deleteReport',
    data,
    method: 'post',
    loading: true
  })
// 撤回上报
export const withdrawReport = (data: object) =>
  request({
    url: 'res/site/content/withdrawReport',
    data,
    method: 'post',
    loading: true
  })
// 重置消费码
export const restartCode = (data: object) =>
  request({
    url: 'act/activity/order/restartCode',
    data,
    method: 'post',
    loading: true
  })
// 审核记录
export const getRecords = (params: object) =>
  request({ url: 'res/activity/auditRecords', params, loading: true })
// 待审核数量
export const getWaitActivity = (params: object) =>
  request({ url: 'res/audit/process/getWaitAuditCount', params, loading: true })
// 待审核数量
export const getWaitReportActivity = (params: object) =>
  request({
    url: 'res/audit/process/getReportWaitCount',
    params,
    loading: true
  })
// 上报列表
export const getReportList = (params: object) =>
  request({
    url: 'res/activity/reportList',
    params,
    noCancelRepeatRequest: true
  })
// 活动订单列表
export const getActiveOrderList = (params: object) =>
  request({
    url: 'act/activity/order/orderList',
    params,
    noCancelRepeatRequest: true
  })
// 订单详情
export const getActiveOrderDetail = (params: object) =>
  request({ url: 'act/activity/order/orderInfo', params, loading: true })
// 联盟列表
export const getActivityUnionList = (params: object) =>
  request({ url: 'res/activity/unionList', params })
// 拉取指定联盟数据
export const concatUnionData = (data: object) =>
  request({
    url: 'res/activity/pullUnionData',
    data,
    method: 'post',
    loading: true
  })
// 上报
export const activityReport = (data: object) =>
  request({ url: 'res/report/report', data, method: 'post', loading: true })
// 活动分类标签列表
export const getActivityClassList = (params?: object) =>
  request({ url: '/config/resLabel/activityClassifyList', params })

// 品牌保存
export const brandSave = (data: object) =>
  request({ url: 'res/brand/save', data, method: 'post', loading: true })
// 品牌列表
export const brandList = (params?: object) =>
  request({ url: 'res/brand/list', params })
// 品牌详情
export const brandView = (params?: object) =>
  request({ url: 'res/brand/view', params })
// 品牌启用/禁用
export const brandUpdate = (data: object) =>
  request({ url: 'res/brand/updateStatus', data, method: 'post' })
// 品牌删除
export const brandDelete = (data: object) =>
  request({ url: 'res/brand/delete', data, method: 'post' })
// 品牌操作接口
export const brandOperate = (data: object) =>
  request({ url: 'res/brand/operate', data, method: 'post' })
// 子站点列表
export const getSubsiteList = (params?: object) =>
  request({ url: 'res/brand/site/list', params })
// 子站点删除
export const subsiteDelete = (data: object) =>
  request({ url: 'res/brand/site/delete', data, method: 'post' })
// 子站点启用/禁用
export const subsiteUpdate = (data: object) =>
  request({ url: 'res/brand/site/updateStatus', data, method: 'post' })
// 非遗项目列表
export const ctcHeritageList = (params: object) =>
  request({ url: 'res/site/ctcHeritageItem/list', params })
// 非遗项目导入
export const ctcHeritageImport = (data: object) =>
  request({ url: 'res/site/ctcHeritageItem/importExcel', data, method: 'post' })
// 非遗项目导出
export const ctcHeritageExport = (params: object) =>
  request({ url: 'res/site/ctcHeritageItem/exportExcel', params })
// 非遗项目详情
export const ctcHeritageView = (params: object) =>
  request({ url: 'res/site/ctcHeritageItem/view', params })
// 非遗项目保存
export const ctcHeritageSave = (data: object) =>
  request({ url: 'res/site/ctcHeritageItem/save', data, method: 'post' })
// 非遗项目撤回
export const ctcHeritageWithdraw = (data: object) =>
  request({ url: 'res/site/ctcHeritageItem/withdraw', data, method: 'post' })
// 非遗传承人列表
export const ctcHeritagePeopleList = (params: object) =>
  request({ url: 'res/site/ctcHeritagePeople/list', params })
// 非遗传承人导入
export const ctcHeritagePeopleImport = (data: object) =>
  request({
    url: 'res/site/ctcHeritagePeople/importExce',
    data,
    method: 'post'
  })
// 非遗传承人导出
export const ctcHeritagePeopleExport = (params: object) =>
  request({ url: 'res/site/ctcHeritagePeople/exportExcel', params })
// 非遗传承人撤回
export const ctcHeritagePeopleWithdraw = (data: object) =>
  request({ url: 'res/site/ctcHeritagePeople/withdraw', data, method: 'post' })
// 非遗传承人详情
export const ctcHeritagePeopleView = (params: object) =>
  request({ url: 'res/site/ctcHeritagePeople/view', params })
// 非遗传承人保存
export const ctcHeritagePeopleSave = (data: object) =>
  request({ url: 'res/site/ctcHeritagePeople/save', data, method: 'post' })
// 非遗传承人所属项目
export const getByHeritageItemId = (params: object) =>
  request({ url: 'res/site/ctcHeritageItem/getByHeritageItemId', params })

// 体验基地保存
export const saveExperienceBase = (data: object) =>
  request({
    url: 'res/site/ctcHeritageExperienceBase/save',
    data,
    method: 'post',
    loading: true
  })
// 体验基地详情
export const getExperienceBase = (params: { id: number }) =>
  request({ url: 'res/site/ctcHeritageExperienceBase/view', params })
// 体验基地撤回
export const experienceWithdraw = (data: {id: string}) =>
  request({ url: 'res/site/ctcHeritageExperienceBase/withdraw', data, method: 'post' })
// 非遗项目详情
export const getHeritageItem = (params: { id: number }) =>
  request({ url: 'res/site/ctcHeritageItem/view', params })
// 体验基地导入
export const ctcHeritageExperienceBaseImport = (data: object) =>
  request({
    url: 'res/site/ctcHeritageExperienceBase/importExcel',
    data,
    method: 'post',
    isUploadFile: true
  })
// 列表查询
export const getExperienceBaseList = (params: object) =>
  request({ url: 'res/site/ctcHeritageExperienceBase/list', params })
// 传习基地保存
export const saveInheritBase = (data: object) =>
  request({
    url: 'res/site/ctcHeritageTeachingBase/save',
    data,
    method: 'post',
    loading: true
  })
// 传习基地详情
export const getInheritBase = (params: { id: number }) =>
  request({ url: 'res/site/ctcHeritageTeachingBase/view', params })
// 传习基地撤回
export const teachWithdraw = (data: {id: string}) =>
  request({ url: 'res/site/ctcHeritageTeachingBase/withdraw', data, method: 'post' })
// 传习基地导入
export const ctcHeritageTeachingBaseImport = (data: object) =>
  request({
    url: 'res/site/ctcHeritageTeachingBase/importExcel',
    data,
    method: 'post',
    isUploadFile: true
  })
// 传习基地列表查询
export const getHeritageTeachingBaseList = (params: object) =>
  request({ url: 'res/site/ctcHeritageTeachingBase/list', params })

// 生产性保护基地保存
export const saveProtectBase = (data: object) =>
  request({
    url: 'res/site/ctcHeritageProtectBase/save',
    data,
    method: 'post',
    loading: true
  })
// 生产性保护基地详情
export const getProtectBase = (params: { id: number }) =>
  request({ url: 'res/site/ctcHeritageProtectBase/view', params })
// 生产性保护基地列表查询
export const getProtectList = (params: object) =>
  request({ url: 'res/site/ctcHeritageProtectBase/list', params })
// 生产性保护基地撤回
export const protectWithdraw = (data: {id: string}) =>
  request({ url: 'res/site/ctcHeritageProtectBase/withdraw', data, method: 'post' })
// 生产线保护基地导入
export const ctcHeritageProtectBaseImport = (data: object) =>
  request({
    url: 'res/site/ctcHeritageProtectBase/importExcel',
    data,
    method: 'post',
    isUploadFile: true
  })
// 非遗概况
export const getHeritageOverview = (params: object) =>
  request({ url: 'res/site/ctcHeritageItem/getHeritageOverview', params })
// 非遗概况右下批次
export const getHeritageItemByLevel = (params: object) =>
  request({ url: 'res/site/ctcHeritageItem/getHeritageItemByLevel', params })
// 非遗概况左下批次统计
export const getHeritageItemByBatch = (params: object) =>
  request({ url: 'res/site/ctcHeritageItem/getHeritageItemByBatch', params })
// 非遗项目及代表性传承人统计情况
export const getHeritageItemByType = (params: object) =>
  request({ url: 'res/site/ctcHeritageItem/getHeritageItemByType', params })
//非遗验证手机号是否重复
export const checkHeritagePeople = (params: object) =>
  request({ url: 'res/site/ctcHeritageItem/checkHeritagePeople', params })

//角色活动类型列表
export const roleActivityTypeList = (params: object) =>
  request({ url: 'user/role/roleActivityTypeList', params })
// 成果保存
export const resultSave = (data: object) =>
  request({ url: 'res/activity/result/save', data, method: 'post' })
// 成果管理
export const resultList = (params: object) => request({ url: 'res/activity/result/list', params,noCancelRepeatRequest:true })
// 成果管理提交
export const resultSubmit = (data: object) => request({ url: 'res/activity/result/submit', data,method:'post' })
// 成果管理删除
export const resUpdateStatus = (data: object) => request({ url: 'res/activity/result/updateStatus', data,method:'post' })
// 成果管理详情
export const resultView = (params: object) => request({ url: 'res/activity/result/view', params,noCancelRepeatRequest:true })
// 成果审核列表
export const getWaitActivityResultAuditList = (params: object) => request({ url: 'res/activity/result/waitAuditList', params,noCancelRepeatRequest:true })
// 活动数据排行榜
export const getActivityRanking = (params: object) => request({ url: 'res/activity/activityDataRanking', params })

// 修改直播地址
export const updateLiveUrl = (data: object) => request({ url: 'res/activity/updateLiveUrl', data,method:'post' })
