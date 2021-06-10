/*
 * @Author: Hexg
 * @Date: 2019-07-10 21:34:06
 * @LastAuthor   : 任智勇
 * @lastTime     : 2020-01-07 09:16:31
 */
/*
 * @Author: 任智勇
 * @since: 2019-06-04 17:30:44
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-26 17:00:07
 */
// 引入封装好的axios请求
import request from '@/util/request';
// 栏目列表
export const getContentSurveyCount = (params?: object) => request({ url: 'res/resourceCount/contentSurveyCount', params })
// 栏目列表
export const getColumnList = (params?: object) => request({ url: 'res/site/channel/list', params })
// 栏目列表
export const getColumnSelect = (params?: object) => request({ url: 'res/site/channel/select', params })
// 添加栏目
export const saveColumn = (data?: object) => request({ url: 'res/site/channel/save', data, method: 'post' })
// 删除栏目
export const delColumn = (data?: object) => request({ url: 'res/site/channel/delete', data, method: 'post' })
// 启动和禁用
export const updateStatusColumn = (data?: object) => request({ url: 'res/site/channel/updateStatus', data, method: 'post' })
// 栏目详情
export const getColumDesc = (params?: object) => request({ url: 'res/site/channel/view', params, loading: true })
// 栏目选择列表
export const getColumChoice = (params?: object) => request({ url: 'res/site/channel/select', params })
// 栏目-导出栏目信息
export const getChannelExcel = () => request({ url: 'res/site/channel/exportExcel' })
// 栏目-导入栏目信息
export const postChannelExcel = (data?: object) => request({ url: 'res/site/channel/importExcel', data, method: 'post', isUploadFile: true })
// 生成栏目编码
export const generateChannelCode = (params?: object) => request({ url: 'res/site/channel/generateChannelCode', params })
// 上传图片
export const uploadImage = (data?: object) => request({ url: 'http://file.geeker.com.cn/uploadOSS', data, method: 'post', noCancelRepeatRequest: true, timeout: 0 })
// 上传base64图片
export const uploadBase = (data?: any) => request({ url: 'http://file.geeker.com.cn/uploadBase', data, method: 'post', noCancelRepeatRequest: true });
// 获取栏目列表
export const getChannelList = (params?: object) => request({ url: 'res/site/content/getChannelList', params })
// 获取内容管理列表
export const getContentList = (params?: object) => request({ url: 'res/site/content/list', params })
// 内容管理列表操作-撤回
export const contentWithdraw = (data?: object) => request({ url: 'res/site/content/withdraw', data, method: 'post' })
// 内容管理列表操作-删除
export const contentDelete = (data?: object) => request({ url: 'res/site/content/delete', data, method: 'post' })
// 内容管理列表操作-流程
export const getContentAuditProcess = (params?: object) => request({ url: 'res/site/content/getContentAuditProcess', params })
// 内容管理列表操作-批量提交
export const patchSubmit = (data?: object) => request({ url: 'res/site/content/submit', data, method: 'post', loading: true })
// 内容管理列表操作-上报站点获取
export const getReportSiteList = (params?: object) => request({ url: 'user/cloud/site/getReportSiteList', params })
// 内容管理列表操作-上报
export const reportSite = (data?: object) => request({ url: 'res/site/content/report', data, method: 'post', loading: true })
// 内容管理列表操作-转移
export const transferSite = (data?: object) => request({ url: 'res/site/content/transfer', data, method: 'post', loading: true })
// 内容管理列表操作-云联盟-获取联盟数据列表
export const getUnionList = (params?: object) => request({ url: 'res/site/content/unionList', params })
// 内容管理列表操作-云联盟-获取加入的联盟列表
export const getSiteUnionList = (params?: object) => request({ url: 'user/cloud/union/siteUnionList', params })
// 内容管理列表操作-云联盟-获取联盟站点下拉数据
export const getUnionSiteList = (params?: object) => request({ url: 'user/cloud/union/unionSiteList', params })
// 内容管理列表操作-内容数据导出
export const getContentExcel = () => request({ url: 'res/site/content/exportExcel' })
// 内容管理列表操作-云联盟-获取联盟数据至本地
export const getUnionData = (data?: object) => request({ url: 'res/site/content/getUnionData', data, method: 'post', loading: true })
// 内容管理列表操作-内容数据导入
export const postContentExcel = (data: object) => request({ url: 'res/site/content/importExcel', data, method: 'post', isUploadFile: true })


// 上报管理   
// 上报数据列表
export const getReportList = (params?: object) => request({ url: 'res/site/content/reportList', params })
// 上报审核列表数据
export const getCheckedList = (params?: object) => request({ url: 'res/site/content/reportAuditList', params })
// 上报数据详情
export const getReportDesc = (params?: object) => request({ url: 'res/site/content/reportDataDetail', params, loading: true })
// 撤回上报
export const withdrawReport = (data?: object) => request({ url: 'res/site/content/withdrawReport', data, method: 'post' })
// 删除上报
export const deleteReport = (data?: object) => request({ url: 'res/site/content/deleteReport', data, method: 'post' })

// 添加内容-获取栏目列表
export const getContentColumnList = (params?: object) => request({ url: 'res/site/content/getChannelList', params })
// 添加内容-获取栏目扩展字段信息
export const getContentExtendColumn = (params?: object) => request({ url: 'res/site/content/getExtendFields', params })
// 添加内容-保存添加内容
export const saveAddContent = (data?: object) => request({ url: 'res/site/content/save', data, method: 'post', loading: true })
// 添加内容-审核时保存添加内容
export const saveAuditUpdateData = (data?: object) => request({ url: 'res/site/content/auditUpdateData', data, method: 'post', loading: true })
// 添加内容-获取标签列表(不带分页)
export const getLabelList = (params?: object) => request({ url: 'config/resLabel/select', params })
// 添加内容-分页获取图片列表
export const getSourceImgList = (params?: object) => request({ url: 'res/site/ctcResImg/list', params, noCancelRepeatRequest: true })
// 添加内容-分页获取视频列表
export const getSourceVideoList = (params?: object) => request({ url: 'res/site/ctcResVideo/list', params })
// 添加内容-分页获取音频列表
export const getSourceAudioList = (params?: object) => request({ url: 'res/site/ctcResVoice/list', params })
// 添加内容-批量上传图片
export const saveMultiImage = (data?: object) => request({ url: 'res/site/ctcResImg/multiSave', data, method: 'post' })
// 添加内容-批量上传视频
export const saveMultiVideo = (data?: object) => request({ url: 'res/site/ctcResVideo/multiSave', data, method: 'post' })
// 添加内容-批量上传音频
export const saveMultiVoice = (data?: object) => request({ url: 'res/site/ctcResVoice/multiSave', data, method: 'post' })
// 添加内容-新增标签
export const saveAddTag = (data?: object) => request({ url: 'config/resLabel/save', data, method: 'post' })
// 添加内容-获取当前组织架构
export const createrList = (params?: object) => request({ url: 'config/companySysOrg/currentOrg', params, noCancelRepeatRequest: true })
// 添加内容-获取数据详情
export const getContent = (params?: object) => request({ url: 'res/site/content/view', params, loading: true })
// 添加内容-获取音频详情
export const getVoiceDetail = (params?: object) => request({ url: 'res/site/ctcResVoice/view', params, loading: true })
// 添加内容-获取视频详情
export const getVideoDetail = (params?: object) => request({ url: 'res/site/ctcResVideo/view', params, loading: true })
// 添加内容-获取图片详情
export const getImgDetail = (params?: object) => request({ url: 'res/site/ctcResImg/view', params, loading: true })


// 点评管理列表
export const getCommentList = (params?: object) => request({ url: 'res/comment/list', params, noCancelRepeatRequest: true, loading: true })
// 点评管理-审核
export const setCommentAudit = (data?: object) => request({ url: 'res/comment/audit', data, method: 'post' })
// 点评管理-批量审核
export const setCommentBatchAudit = (data?: object) => request({ url: 'res/comment/batchAudit', data, method: 'post' })

//投诉管理列表
export const getComplaintsList = (params?: object) => request({ url: 'res/complaints/list', params, loading: true })
//投诉管理详情
export const getComplaintsDetail = (params?: object) => request({ url: 'res/complaints/view', params, noCancelRepeatRequest: true })
//处理投诉
export const saveComplaints = (data?: object) => request({ url: 'res/complaints/handle', data, method: 'post' })
//关闭或展示栏目
export const shutOrShow = (data: object) => request({ url: 'res/site/channel/shutOrShow', data, method: 'post' })
//栏目排序
export const channelSetSort = (data?: object) => request({ url: 'res/site/channel/setSort', data, method: 'post' })

//反馈列表
export const feedBackList = (params?: object) => request({ url: 'user/feedBack/list', params })
//反馈详情
export const feedBackView = (params?: object) => request({ url: 'user/feedBack/view', params })
//反馈回复
export const feedBackReply = (data?: object) => request({ url: 'user/feedBack/reply', data, method: 'post' })
//获取内容作者\内容来源使用记录
export const contentGetRecord = (params?: object) => request({ url: 'res/site/content/getRecord', params })
//清除记录
export const contentClearRecord = (params?: object) => request({ url: 'res/site/content/clearRecord', params })
