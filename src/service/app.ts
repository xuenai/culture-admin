// 引入封装好的axios请求
import request from '@/util/request';

export interface LoginParams {
  username: string
  password: string
  code?: string
  loginSource: 'CLOUD' | 'SITE' | 'COMPANY'
}

// 用户
// 登录
export const login = (data: LoginParams) => request({ url: 'user/daqsoft/common/login', data, method: 'post' , loading: true})
// 登出
export const logout = (data?: any) => request({ url: 'user/user/logout', data, method: 'post' , loading: true})
// 忘记密码
export const forgetPassword = (data?: any) => request({ url: 'user/daqsoft/common/forgetPassword', data, method: 'post' , loading: true})
// 保存用户
export const saveUser = (data: any) => request({ url: 'user/user/save', data, method: 'post' , loading: true})
// 获取用户信息
interface GetUserInfoDataType {
  userId?: string | number;
}
export const getUserInfo = (params?: GetUserInfoDataType) => request({ url: 'user/user/view', params })
// 获取员工列表
export const getUserList = (params?: object) => request({ url: 'user/user/list', params })
// 删除员工
export const delUserByIds = (data?: object) => request({ url: 'user/user/delete', data, method: 'post' })
// 启用、禁用员工
export const updateUserStatus = (data?: object) => request({ url: 'user/user/updateStatus', data, method: 'post' })



// 菜单
// 获取用户菜单
export const getUserMenu = (params?: any) => request({ url: 'user/menu/getUserMenu', params })
// 获取菜单列表
export const getMenuList = (params: any) => request({ url: 'user/menu/list', params })
// 保存菜单
export const saveMenu = (data: any) => request({ url: 'user/menu/save', data, method: 'post' , loading: true})
// 删除菜单
export const deleteMenu = (data: any) => request({ url: 'user/menu/delete', data, method: 'post' , loading: true})
// 检查菜单编码
export const checkMenuCode = (params: any) => request({ url: 'user/menu/checkCode', params })
// 禁用、启用菜单
export const upDateMenuStatus = (data: any) => request({ url: 'user/menu/updateStatus', data, method: 'post' })
// 菜单详情
export const getMenuView = (params: any) => request({ url: 'user/menu/view', params , loading: true})
// 菜单批量排序
export const updateMenuSorts = (data: any) => request({ url: 'user/menu/updateSorts', data, method: 'post' , loading: true})


// 菜单权限
// 删除
export const deleteOperate = (data: any) => request({ url: 'user/operate/delete', data, method: 'post' , loading: true})
// 新增权限
export const saveOperate = (data: any) => request({ url: 'user/operate/save', data, method: 'post', loading: true })
// 权限列表
export const getOperateList = (params: any) => request({ url: 'user/operate/list', params })
// 检查编码
export const checkOperateCode = (params: any) => request({ url: 'user/operate/checkCode', params })
// 禁用/启用
export const upDateOperateStatus = (data: any) => request({ url: 'user/operate/updateStatus', data, method: 'post' })
// 批量排序
export const updateOperateSorts = (data: any) => request({ url: 'user/operate/updateSorts', data, method: 'post' })
// 权限详情
export const getOperateDetail = (params: any) => request({ url: 'user/operate/view', params , loading: true})

// 通过角色id获取菜单目录
interface GetMenuByRoleDataType {
  roleIds: string;
}
export const getMenuByRole = (params: GetMenuByRoleDataType) => request({ url: 'user/menu/getMenuByRole', params , loading: true})

// 角色
// 删除角色
export const deleteRole = (data: any) => request({ url: 'user/role/delete', data, method: 'post' , loading: true})
// 新增角色
export const saveRole = (data: any) => request({ url: 'user/role/save', data, method: 'post' , loading: true})
// 检查角色编码
export const checkRoleCode = (params: any) => request({ url: 'user/role/checkCode', params })
// 启用、禁用
export const upDateRoleStatus = (data: any) => request({ url: 'user/role/updateStatus', data, method: 'post' })
// 角色列表
export const getRoleList = (params: any) => request({ url: 'user/role/list', params })
// 角色详情
export const getRoleDetail = (params: any) => request({ url: 'user/role/view', params , loading: true})
// 批量排序
export const updateRoleSort = (data: any) => request({url: 'user/role/updateSorts', data, method: 'post', loading: true});

// 公共接口 

// 获取统一验证码图片
interface validCodeImageRequestParamsType {
  type: string
  unique: string
}
export const getValidCodeImage = (params: validCodeImageRequestParamsType) => request({ url: 'user/daqsoft/common/validCodeImage', params, responseType: 'arraybuffer' })

// 获取用户站点列表
export const getSiteListForUser = (params?: object) => request({ url: 'user/site/siteListForUser', params })

// 组织机构 获取所有组织机构 带分级
export const getOriginList = (params?: object) => request({ url: 'config/companySysOrg/treeList', params })
// 通过组织机构id获取子级组织机构
export interface GetChildOriginDataType {
  id: string | number,
  status?: number | string;
  name?: string;
}
export const getChildOriginListById = (params?: object) => request({ url: 'config/companySysOrg/cTreeList', params })
// 通过组织机构id获取父级组织机构id
interface GetParentOriginDataType {
  id: string | number
}
export const getParentOriginListById = (params?: GetParentOriginDataType) => request({ url: 'config/companySysOrg/pTreeList', params })
// 新增。编辑组织机构
interface SaveOriginDataType {
  auditObj: string;
  pid?: string;
  name: string;
  id?: string | number;
}
export const saveOrigin = (data?: SaveOriginDataType) => request({ url: 'config/companySysOrg/save', data, method: 'post' , loading: true});
interface DelOriginDataType {
  ids: string | number
}
// 删除组织机构
export const deleteOrigin = (data: DelOriginDataType) => request({ url: 'config/companySysOrg/delete', data, method: 'post' , loading: true})
// 启用、禁用
export interface UpdateStatusOriginDataType {
  ids: string | number;
  status: number;
}
export const updateStatusOrigin = (data?: UpdateStatusOriginDataType) => request({ url: 'config/companySysOrg/updateStatus', data, method: 'post' , loading: true})
// 导出
interface ExportOriginExcelDataType {
  id: string | number;
  name?: string;
  status?: number | string;
}
export const exportOriginExcel = (params?: ExportOriginExcelDataType) => request({ url: 'config/companySysOrg/export', params, isUploadFile: true, isExportExcel: true })

// 公共发送短信
interface sendPhoneMsgType {
  phone: string;
  type: 'role' | 'login' | 'SEND_ACCOUNT_REGISTER' | 'SEND_SMS_FORGET_PASSWORD' | 'SEND_ACCOUNT_REGISTER_COMPANY';
  sessionId?: string;
}
export const sendPhoneMsg = (params?: sendPhoneMsgType) => request({ url: 'user/daqsoft/common/sendMsg', params })

// 切换站点
export interface SwitchSiteDataType {
  siteId: number | string
}
export const switchSite = (data: SwitchSiteDataType) => request({ url: 'user/site/switchSite', data, method: 'post' })

// 通过sessionid获取token
interface SessionIdTokenType {
  sessionId: string
}
export const getTokenBySessionId = (params: SessionIdTokenType) => request({ url: 'user/daqsoft/common/tripartiteToken', params })

// 获取微信授权信息
export const getWechatAuthData = (params?: object) => request({ url: 'config/wechatMenu/getWechatAuthData', params , loading: true});
// 取消微信授权
export const unAuthorized = (params?: object) => request({ url: 'config/wechatMenu/unauthorized', params, loading: true });
// 获取微信菜单
export const getWechatConfigMenu = (params?: object) => request({ url: 'config/wechatMenu/getWechatConfigMenu', params , loading: true});
// 更改微信菜单
interface WechatConfigMenuItem {

}
export const saveWechatConfigMenu = (data?: WechatConfigMenuItem) => request({ url: 'config/wechatMenu/saveWechatConfigMenu', method: 'post', data , loading: true});
// 获取微信菜单模块数据（菜单内容==》文化旅游云）
export const getSiteChannel = (params?:object) => request({url: 'config/wechatMenu/getSiteChannel', params, loading: true});
// 微信菜单模块数据(文化旅游云)选择栏目所有栏目数据
export const getAllSiteChannel = (params?:object) => request({url: 'config/wechatMenu/getAllSiteChannel', params, loading: true})

// 更改密码
export interface UpdatePasswordDataType {
  oldPwd: string;
  password: string;
  userId: string | number;
}
export const updatePassword = (data: UpdatePasswordDataType) => request({ url: 'user/user/updatePassword', data, method: 'post', loading: true })

// 父级未绑定资源查询
export const getParentObjectValidPower = (params?:any) => request({url: 'res/site/ctcCommonPlace/getParentObjectValidPower', params});
// 子资源未绑定查询
interface GetChildObjectValidPowerDataType{
  resourceId: string | number;
  name?: string;
  pageSize?:number;
  currPage?:number;
}
export const getChildObjectValidPower = (params:GetChildObjectValidPowerDataType) => request({url: 'res/site/ctcCommonPlace/getChildObjectValidPower', params});
// 已绑定资源数据
export const getEchoDataValidPower = (params?:any) => request({url: 'res/site/ctcCommonPlace/getEchoDataValidPower', params});
// 平台诚信用户概况统计
export const getPlatformUserCount = (params: object) => request({url: 'credit/creditUser/platformUserCount', params});

// 获取商户中心oem配置
export const getOemConfig = (params?: any) => request({url: 'user/daqsoft/common/jkbOemConfig', params});
// 返回商户中心地址
export const getJkbBackUrl = (params?: any) => request({url: 'user/daqsoft/common/jkbBackUrl', params});


// 企业端获取 对应站点信息
export const getSiteInfoBySiteCode = (params?:any) => request({url: 'user/api/site/siteInfo', params});

// 获取角色活动类型接口
export const getRoleActivityTypeList = (params?:any) => request({url: 'user/role/roleActivityTypeList', params});