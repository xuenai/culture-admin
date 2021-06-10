/*
 * @Author: 任智勇
 * @since: 2019-06-17 13:48:36
 * @LastAuthor   : 任智勇
 * @lastTime     : 2020-01-21 09:22:01
 */
// 引入封装好的axios请求
import request from '@/util/request';
// 公共 - 概况
export const getPublicSurveyCount = (params?: object) => request({ url: 'res/resourceCount/surveyCount', params })
// 公共 - 概况
export const getSiteUserInfo = (params?: object) => request({ url: 'user/cloud/site/view', params })
// 公共 - 概况 - 会员数据
export const getMemberInfos = (params?: object) => request({ url: 'user/consumUser/siteCountInfo', params })

// 列表启用、禁用数据
export const updateStatus = (data?: object) => request({ url: 'res/resourceManage/updateStatus', data, method: 'post' })
// 列表操作-推荐
export const setRecommendStatus = (data?: object) => request({ url: 'res/resourceManage/setRecommendStatus', data, method: 'post' })
// 列表操作-置顶
export const setTopStatus = (data?: object) => request({ url: 'res/resourceManage/setTopStatus', data, method: 'post' })
// 列表操作-排序
export const setSort = (data?: object) => request({ url: 'res/resourceManage/setSort', data, method: 'post' })
// 列表操作-排序
export const setSortTag = (data?: object) => request({ url: 'config/resLabel/sort', data, method: 'post' })

// 查询场所 相关资源数据
export const getResourceByType = (params?: object) => request({ url: 'res/site/ctcCommonPlace/getResourceByType', params })
// 查询城市及地区region
// export const getCityRegion = (params?: object) => request({ url: 'http://data.daqsoft.com/cityUed', params,noCancelRepeatRequest:true })
export const getCityRegion = (params?: object) => request({ url: 'res/region/citySelect', params, noCancelRepeatRequest: true })

// 标签列表 tag 带分页
export const getTags = (params?: object) => request({ url: 'config/resLabel/list', params })
// 标签列表 tag 不分页
export const getTagsSelect = (params?: object) => request({ url: 'config/resLabel/select', params, noCancelRepeatRequest: true })
// 新增标签
export const saveTags = (data?: object) => request({ url: 'config/resLabel/save', data, method: 'post' })
// p标签
export const deleteTag = (data?: object) => request({ url: 'config/resLabel/delete', data, method: 'post' })
// 更改标签状态
export const updateTagsStatus = (data?: object) => request({ url: 'config/resLabel/updateStatus', data, method: 'post' })
// 标签批量排序
export const sortTags = (data: object) => request({ url: 'config/resLabel/sort', data, method: 'post' })

// 字典详情
export const dictView = (params: object) => request({ url: 'config/dict/view', params })
// 获取某类型所有字典列表
export const dictType = (params: object) => request({ url: 'config/dict/dictType', params, noCancelRepeatRequest: true })
//批量标签查询
export const tagViewList = (params: object) => request({ url: 'config/resLabel/viewList', params })
export const tagView = (params: object) => request({ url: 'config/resLabel/view', params })

// 点评标签列表（点评）
export const reviewTagsList = (params?: object) => request({ url: 'res/site/resCommentLabel/list', params })
// 删除标签（点评）
export const delReviewTag = (data?: object) => request({ url: 'res/site/resCommentLabel/delete', data, method: 'post' })
// 修改标签状态（点评）
export const updateReviewTag = (data?: object) => request({ url: 'res/site/resCommentLabel/updateStatus', data, method: 'post' })
// 新增/修改标签（点评）
export const saveReviewTag = (data?: object) => request({ url: 'res/site/resCommentLabel/save', data, method: 'post' })
// 修改点评标签排序
export const sortReviewTags = (data?: object) => request({ url: 'res/site/resCommentLabel/sort', data, method: 'post' })


// 保存座位模板
export const saveSeatTemplate = (data?: object) => request({ url: 'res/site/resSeatTemplate/save', data, method: 'post', loading: true })
// 查看座位模板
export const seatTemplateView = (params?: object) => request({ url: 'res/site/resSeatTemplate/view', params })
export const seatTemplateInfo = (params?: object) => request({ url: 'res/site/resSeatTemplate/info', params })
// 删除座位模板
export const seatTemplateDelete = (params?: object) => request({ url: 'res/site/resSeatTemplate/delete', params })


// 上报站点列表
export const getReportSiteList = () => request({ url: 'user/cloud/site/getReportSiteList' })

// 消息通知 分页查询列表
export const getMsgList = (params?: object) => request({ url: 'res/site/siteMessageGetter/list', params, noCancelRepeatRequest: true })
// 消息通知 详情
export const getMsgDetail = (params: { id: number | string }) => request({ url: 'res/site/siteMessageNotify/view', params, loading: true })
// 消息通知 全部已读
export const setAllRead = (data?: object) => request({ url: 'res/site/siteMessageGetter/readAll', data, method: 'post' })

export const base64FileUpload = (data?: object) => request({ url: 'config/ued/base64FileUpload', data, method: 'post' })

// 获取资源库音频详情
export const getVoiceDetail = (params?: object) => request({ url: 'res/site/ctcResVoice/view', params })
// 获取资源库视频详情
export const getVideoDetail = (params?: object) => request({ url: 'res/site/ctcResVideo/view', params })
// 获取资源库图片详情
export const getImgDetail = (params?: object) => request({ url: 'res/site/ctcResImg/view', params })

// 志愿团类型
export const getDictType = (params: { type: string }) => request({ url: 'config/dict/dictType', params, noCancelRepeatRequest: true })
// 志愿团 社团 查询列表
export const getVoluntList = (params: object) => request({ url: 'res/site/ctcCommonPlace/getVolunteerTeamAndAssociationData', params, noCancelRepeatRequest: true })
// 类型列表
export const getTaskTypeList = (params: object) => request({ url: 'task/type/getTaskTypeList', params, noCancelRepeatRequest: true })
// 保存类型
export const updateTaskType = (data?: object) => request({ url: 'task/type/updateTaskType', data, method: 'post', loading: true })
// 查询诚信操作记录
export const getDishonestyList = (params: object) => request({ url: 'credit/score/list', params, noCancelRepeatRequest: true })
// 诚信用户详情
export const getCreditUser = (params: object) => request({ url: 'credit/creditUser/view', params, noCancelRepeatRequest: true })
// 站点保存
export const saveCloudSite = (data: object) => request({ url: 'user/cloud/site/save', data, method: 'post', noCancelRepeatRequest: true })

// 活动室预约 判断当前活动室是否是诚信免审用户预约的消息
export const getOrderStatusMsg = (params: object) => request({ url: 'act/activity/order/orderStatus', params })

// 活动室预约 获取站点下所有站点
export const getSiteChild = (params?: object) => request({ url: 'user/cloud/site/getSiteChild', params })
//获取所有快捷回复
export const replyAllList = (params?: object) => request({ url: 'config/quickReply/allList', params })
// 保存转移
export const saveCompanyTransfer = (params: object) => request({ url: 'res/site/ctcTransfer/dataTransfer', params })
//字典值转罗马数字
export const dictValueToRoma = (params: object) => request({ url: 'config/dict/dictValueToRoma', params })
// 快捷回复
export const getQuickReply = (params?: object) => request({ url: 'config/quickReply/allList', params })

// 站点机构
export const getSiteOrgList = (params?: object) => request({ url: 'user/siteOrg/list', params, noCancelRepeatRequest: true })
// 站点保存
export const saveSiteOrg = (data: object) => request({ url: 'user/siteOrg/save', data, method: 'post', noCancelRepeatRequest: true })
// 操作
export const updateSiteOrg = (data: object) => request({ url: 'user/siteOrg/operate', data, method: 'post' })
