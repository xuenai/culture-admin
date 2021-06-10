import request from '@/util/request';

// 获取站点配置
export const getSiteConfig = (params?: object) => request({ url: 'user/site/getSiteConfig', params, loading: true });
// 修改站点配置
export interface SiteConfigDataType {
  machineReview?: boolean; // 是否需要机审
  storyStatus?: boolean; // 是否需要人工审核故事攻略状态
  reviewStatus?: boolean; // 是否需要人工审核点评状态
  placeDealComplaints?: boolean; // 是否允许场所端处理投诉
  topicReview?: boolean; // 是否开启话题审核
  activityReview?: boolean; // 是否开启活动审核
  venueReview?: boolean; // 是否开启场所审核
  contentReview?: boolean; // 是否开启内容审核
  pushScenic?: boolean; // 是否开启景点推送
  pushPlace?: boolean; // 是否开启场所推送
  sitePhone?: string; // 站长手机号
  siteLogo?: string; // 站点logo
  name?: string; // 站点名称
  servicePhone?: string; // 客服电话
  siteIntroduce?: string; // 站点介绍
  serviceOnline?: boolean; // 在线服务是否打开
  serviceCode?: string; // 在线客服代码
  serviceRobot?: boolean; // 是否开启智能机器人
  phoneRegister?: boolean; // 是否开启手机注册
  vipPlayStatus?: boolean; // 是否开启会员功能
  betaStatus?: boolean; // 是否开启产品内测
}
export const updateSiteConfig = (data: SiteConfigDataType) => request({ url: 'user/site/updateSiteConfig', data, method: 'post', loading: true });

// 获取名片信息
export const getSiteVisitingCard = (params?: object) => request({ url: 'user/siteVisitingCard/view', params });
// 保存名片信息
export interface SiteVisitingCardDataType {
  id: string | number;
  introduce?: string;
  images?: string;
  videoCover?: string;
  name?: string;
  logo?: string;
  summary?: string;
  video?: string;
}
export const saveSiteVisitingCard = (data: SiteVisitingCardDataType) => request({ url: 'user/siteVisitingCard/save', data, method: 'post' })

// 获取企业端 配置
export const getCompanyConfig = (params?: object) => request({ url: 'config/companySysOrg/getCompanyConfig', params, loading: true })

// 修改企业端配置
export interface UpdateCompanyConfigDataType {
  name?: string;
  logo?: string;
  introduce?: string;
}
export const updateCompanyConfig = (data: UpdateCompanyConfigDataType) => request({ url: 'config/companySysOrg/updateCompanyConfig', data, method: 'post' });

// 获取用户端菜单配置
export const getMobileMenus = (parmas?: object) => request({ url: 'config/clientMenu/menuList', parmas });

// 获取跳转类型列表
interface getClientMenuJumpListParam {
  location: 'HOME_BOTTOM' | 'HOME_TOP' | 'OPERATION'
}
export const getClientMenuJumpList = (params: getClientMenuJumpListParam) => request({ url: 'config/clientMenu/jumpList', params });

// 新增修改菜单
export const saveClientMenu = (data: any) => request({ url: 'config/clientMenu/saveMenuList', data, method: 'post' });

// 获取运营位配置
interface getClientOpertationParam {
  location: 'OPERATION'
}
export const getClientOpertation = (params: getClientOpertationParam) => request({ url: 'config/indexModule/moduleInfo', params });

// 保存运营位配置
interface saveModuleConfigParam {
  jsonDto: string
}
export const saveModuleConfig = (data: saveModuleConfigParam) => request({ url: 'config/indexModule/saveModuleConfig', data, method: 'post' });