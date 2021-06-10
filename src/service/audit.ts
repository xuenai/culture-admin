// 引入封装好的axios请求
import request from '@/util/request';
// 内容审核
// 栏目列表
export const getContentAuditList = (params?: object) => request({ url: 'res/site/content/auditList', params })
export const getContentDetial = (params?: object) => request({ url: 'res/site/content/view', params , loading: true})
// 删除内容审核
export const delContentAuditList = (data?: object) => request({ url: 'res/site/content/deleteAudit', data, method: 'post' , loading: true})
// 内容栏目列表
export const getChannelList = (params?: object) => request({ url: 'res/site/content/getChannelList', params })
// 批量审核
export const batchAudit = (data?: object) => request({ url: 'res/site/content/batchAudit', data, method: 'post', loading: true })
// 审核
export const audit = (data?: object) => request({ url: 'res/site/content/audit', data, method: 'post' , loading: true})


// 话题审核
// 列表
export const getTopicAuditList = (params?: object) => request({ url: 'res/topic/auditList', params })
// 删除
export const delTopicAuditList = (data?: object) => request({ url: 'res/topic/deleteAudit', data, method: 'post' , loading: true})
// 保存审核话题修改数据
export const auditTopicUpdateData = (data?: object) => request({ url: 'res/topic/auditUpdateData', data, method: 'post',loading:true })
// 保存审核
export const saveTopicAuditList = (data?: object) => request({ url: 'res/topic/audit', data, method: 'post',loading:true })
// 批量审核
export const batchAuditTopicAuditList = (data?: object) => request({ url: 'res/topic/batchAudit', data, method: 'post',loading:true })

// 场所审核
// 场所(场馆，酒店，景区)审核列表
export const getAuditVenueList = (params?: object) => request({ url: 'res/site/ctcCommonPlace/getAuditVenueList', params })
// 场所(餐饮，厕所，停车场)审核列表
export const getAuditResourceList = (params?: object) => request({ url: 'res/site/ctcCommonPlace/getAuditResourceList', params })

// 场所审核提交
export const saveAuditProcess = (data?: object) => request({ url: 'res/audit/process/auditing', data,method:'post',loading:true })
// 场所列表项删除
export const delVenuesAuditList = (data?: object) => request({ url: 'res/site/ctcCommonPlace/deleteAuditById', data,method:'post' , loading: true})
// 场所审核 待审核/审核不通过 数量统计
export const getAuditCountNum = (params?: object) => request({ url: 'res/site/ctcCommonPlace/getAuditCountNumByParent', params ,noCancelRepeatRequest:true})

// 活动审核
// 活动审核列表
export const getActiveList = (params: object) => request({ url: 'res/activity/auditList', params ,noCancelRepeatRequest:true, loading: true })
// 审核
export const activeAudit = (data: object) => request({ url: 'res/audit/process/audit', data, method:'post',loading:true })
// 删除审核记录
export const delActiveAudit = (data: object) => request({ url: 'res/audit/process/deleteAudit', data, method:'post', loading: true })
// 流程
export const getActiveAuditProcessList = (params: object) => request({ url: 'res/activity/process', params })
// 活动室预约审核
export const orderAudit = (data: object) => request({ url: 'act/activity/order/orderAudit', data,method:'post',loading:true })

// 上报审核
// 内容 上报审核数据列表
export const getConReportAuditList = (params: object) => request({ url: 'res/site/content/reportAuditList', params,noCancelRepeatRequest:true  })
// 内容 删除上报记录
export const delConReportAudit = (data: object) => request({ url: 'res/site/content/deleteReport', data, method:'post' , loading: true})
// 内容 上报审核
export const reportContAudit = (data: object) => request({ url: 'res/site/content/reportAudit', data, method:'post',loading:true })
// 活动 上报审核
export const reportActiveAudit = (data: object) => request({ url: 'res/report/reportAudit', data, method:'post',loading:true })

// 8.27  志愿者审核
// 志愿者审核列表
export const getVolunteerCheckedList = (params: object) => request({ url: 'res/volunteer/auditList', params })
// 志愿者审核
export const setVolunteerChecked = (data: object) => request({ url: 'res/volunteer/audit', data, method:'post' , loading: true})
// 志愿者详情
export const getVolunteerDesc = (params: object) => request({ url: 'res/volunteer/view', params })
// 志愿者待审核
export const getVolunteerAuditNum = () => request({ url: 'res/volunteer/waitAuditNum' })
// 待审核团队
export const getTeamAuditNum = () => request({ url: 'res/volunteerTeam/waitAuditNum', loading: true})
// 团队列表
export const getTeamCheckedList = (params: object) => request({ url: 'res/volunteerTeamRelation/list', params })
// 团队审核
export const setTeamChecked = (data: object) => request({ url: 'res/volunteerTeam/audit', data, method:'post'  , loading: true})
// 入团审核详情
export const getTeamDesc = (params: object) => request({ url: 'res/volunteerTeamRelation/view', params })
//入团申请审核
export const teamRelationAuditList = (params: object) => request({ url: 'res/volunteerTeamRelation/list', params })
// 入团申请待审核数量
export const teamRelationWaitAuditNum = (params: object) => request({ url: 'res/volunteerTeamRelation/waitAuditNum', params })
// 入团记录
export const volunteerJoinTeamRecord = (params: object) => request({ url: 'res/volunteerTeamRelation/volunteerJoinTeamRecord', params })
//入团审核
export const volunteerTeamRelationAudit = (data: object) => request({ url: 'res/volunteerTeamRelation/audit', data,method:'post' })
// 入团审核记录
export const teamRelationAuditRecord = (params: object) => request({ url: 'res/volunteerTeamRelation/auditRecord', params })

// 实名认证
// 审核接口
export const auditRealName = (data: object) => request({ url: 'res/ctcRealNameAuth/auditRealName', data, method:'post'  })
// 实名认证列表
export const getRealNameList = (params: object) => request({ url: 'res/ctcRealNameAuth/list', params, noCancelRepeatRequest:true })
// 待审核数量
export const getRealNameWaitAuditNum = (params?: object) => request({ url: 'res/ctcRealNameAuth/waitAuditNum', params, noCancelRepeatRequest:true })
// 基地审核列表
export const getAuditBaseList = (params?: object) => request({ url: '/res/site/ctcCommonPlace/getAuditResourceByHeritageList', params, noCancelRepeatRequest:true })
