// 引入封装好的axios请求
import request from '@/util/request';
// 审核列表、驳回列表、管理列表
export const getSiteAuditList = (params?: object) => request({ url: 'user/cloud/site/list', params })
// 审核
export const siteAudit = (data?: object) => request({ url: 'user/cloud/site/audit', data, method: 'post', loading: true })
// 站点启用、禁用
export const siteUpdateStatus = (data?: object) => request({ url: 'user/cloud/site/updateStatus', data, method: 'post', loading: true })
// 站点详情
export const getSiteAuditDetials = (params?: object) => request({ url: 'user/cloud/site/view', params, loading: true })
// 短信充值
export const getMsmRecharge = (data?: object) => request({ url: 'user/cloud/site/recharge', data, method: 'post', loading: true })
// 取消关联
export const cacelShopBind = (data?: object) => request({ url: 'user/cloud/site/cancelBinDingShop', data, method: 'post', loading: true });
// 短信充值记录
export const getRechargeRecord = (params?: object) => request({ url: 'user/cloud/site/rechargeRecord', params })
// 通过站点id获取userSn
export const getUserSnBySiteId = (params?: object) => request({ url: 'user/cloud/site/getUserSn', params })
// 广告位列表
export const getadPositionList = (params?: object) => request({ url: 'user/cloud/position/list', params })
// 广告位启用、禁用
export const positionUpdateStatus = (data?: object) => request({ url: 'user/cloud/position/updateStatus', data, method: 'post' })
// 广告位详情
export const positionUpdateDetials = (params?: object) => request({ url: 'user/cloud/position/view', params, loading: true })
// 广告位保存
export const adPositionSave = (data?: object) => request({ url: 'user/cloud/position/save', data, method: 'post', loading: true })
// 广告位编码校验
export const adCheckCode = (params?: object) => request({ url: 'user/cloud/position/checkCode', params })
// 云联盟列表
export const getUnionList = (params?: object) => request({ url: 'user/cloud/union/list', params })
// 联盟启用、禁用
export const unionUpdateStatus = (data?: object) => request({ url: 'user/cloud/union/updateStatus', data, method: 'post' })
// 联盟删除
export const unionDelete = (data?: object) => request({ url: 'user/cloud/union/delete', data, method: 'post', loading: true })
// 联盟详情
export const unionView = (params?: object) => request({ url: 'user/cloud/union/view', params })
// 联盟编辑保存
export const unionSave = (params?: object) => request({ url: 'user/cloud/union/save', params, method: 'post', loading: true })

// 内容配置列表
export const getExtendFieldList = (params?: object) => request({ url: 'res/site/extendField/list', params })
// 删除内容配置
export const deleteExtendFieldList = (data?: object) => request({ url: 'res/site/extendField/delete', data, method: 'post', loading: true })
// 内容配置详情
export const extendFieldDesc = (params?: object) => request({ url: 'res/site/extendField/view', params })
// 栏目列表
export const getFielChannelList = (params?: object) => request({ url: 'res/site/extendField/channelList', params })
// 栏目列表
export const saveExtendField = (data?: object) => request({ url: 'res/site/extendField/save', data, method: 'post', loading: true })
// 验证类型
export const dictType = (params?: object) => request({ url: 'config/dict/dictType', params })

// 字典管理相关
// 字典管理列表
export const getDictList = (params?: object) => request({ url: 'config/dict/list', params })
// 修改字典状态
export const updateDictStatus = (data?: object) => request({ url: 'config/dict/updateStatus', data, method: 'post', loading: true })
// 获取字典列表（不带分页）
export const getDictSelectList = (params?: object) => request({ url: 'config/dict/select', params })
// 新增/修改 字典
export const saveOrEditDict = (data?: object) => request({ url: 'config/dict/save', data, method: 'post', loading: true })
// 删除字典
export const delDict = (data?: object) => request({ url: 'config/dict/delete', data, method: 'post', loading: true })
// 修改字典的排序值
export const sortDict = (data?: object) => request({ url: 'config/dict/sort', data, method: 'post', loading: true })


// 域名管理
export const getDomainList = (params?: object) => request({ url: 'user/config/configInfo', params })
// 保存域名管理
export const saveDomainList = (data?: object) => request({ url: 'user/config/saveConfig', data, method: 'post', loading: true })
// 消息管理列表获取
export const getSiteMessageNotifyList = (params?: object) => request({ url: 'res/site/siteMessageNotify/list', params })
// 删除消息
interface deleteSiteMessageNotifyParams {
  ids: string
}
export const deleteSiteMessageNotify = (data?: deleteSiteMessageNotifyParams) => request({ url: 'res/site/siteMessageNotify/delete', method: 'post', data });
// 修改字典的排序值
export const saveNotifyList = (data?: object) => request({ url: 'res/site/siteMessageNotify/save', data, method: 'post', loading: true });
// 审核活动分类站点标签为云端标签（云端）
export const upgradeLabel = (data?: object) => request({ url: 'config/resLabel/upgradeLabel', data, method: 'post' });
//快捷回复列表
export const replyList = (params?: object) => request({ url: 'config/quickReply/list', params });
//保存快捷回复
export const saveReply = (data?: object) => request({ url: 'config/quickReply/save', data, method: 'post' });
//删除快捷回复
export const replyDelete = (data?: object) => request({ url: 'config/quickReply/delete', data, method: 'post' });
//快捷回复启用禁用
export const replyUpdateStatus = (data?: object) => request({ url: 'config/quickReply/updateStatus', data, method: 'post' });
//快捷回复排序
export const replySetSort = (data?: object) => request({ url: 'config/quickReply/setSort', data, method: 'post' });