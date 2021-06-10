// 引入封装好的axios请求
import request from '@/util/request';
// 话题 - 概况
export const getTopicSurveyCount = (params?: object) => request({ url: 'res/resourceCount/topicSurveyCount', params})

// 资源类型
export const getTopicList = (params?: object) => request({ url: 'res/topic/list', params})
// 保存话题
export const saveTopicList = (data?: object) => request({ url: 'res/topic/save', data, method: 'post',loading:true})
// 删除话题
export const deleteTopicList = (data?: object) => request({ url: 'res/topic/delete', data, method: 'post'})
// 提交
export const submitTopicList = (data?: object) => request({ url: 'res/topic/submit', data, method: 'post'})
// 撤回
export const withdrawTopicList = (data?: object) => request({ url: 'res/topic/withdraw', data, method: 'post'})
// 审核流程
export const getTopicAuditProcess = (params?: object) => request({ url: 'res/topic/getTopicAuditProcess', params})
// 详情
export const getTopicDesc = (params?: object) => request({ url: 'res/topic/view', params, loading: true})
// 组织架构
export const currentOrg = (params?: object) => request({ url: 'config/companySysOrg/currentOrg', params})


// 标签列表
export const getStoryTagList = (params?: object) => request({ url: 'res/storyTag/list', params})
// 保存标签
export const saveTagList = (data?: object) => request({ url: 'res/storyTag/save', data, method: 'post',loading:true})
// 删除标签
export const delTagList = (data?: object) => request({ url: 'res/storyTag/delete', data, method: 'post'})
// 启用禁用
export const updateTagStatus = (data?: object) => request({ url: 'res/storyTag/updateStatus', data, method: 'post'})
// 标签排序
export const setSort = (data?: object) => request({ url: 'res/storyTag/setSort', data, method: 'post'})
// 推荐
export const setRecommendStatus = (data?: object) => request({ url: 'res/storyTag/setRecommendStatus', data, method: 'post'})
// 置顶
export const setTopStatus = (data?: object) => request({ url: 'res/storyTag/setTopStatus', data, method: 'post'})

// 故事列表
export const getStoryList = (params?: object) => request({ url: 'res/story/list', params, loading: true})
// 故事详情
export const getStoryDesc = (params?: object) => request({ url: 'res/story/view', params, loading: true})
// 故事审核
export const storyAudit = (data?: object) => request({ url: 'res/story/audit', data, method: 'post'})
// 故事不通过原因
export const getNoPassMsg = (params?: object) => request({ url: 'res/contentDetection/getNoPassMsg', params })
// 设置封面
export const setCover = (data?: object) => request({ url: 'res/story/setCover', data, method: 'post'})
// 启用禁用数据
export const updateStoryStatus = (data?: object) => request({ url: 'res/story/updateStatus', data, method: 'post'})
