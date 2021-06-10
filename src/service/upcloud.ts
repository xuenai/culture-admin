// 引入封装好的axios请求
import request from '@/util/request';
// 用户列表
export const getUserList = (params?: object) => request({ url: 'user/user/company/list', params})
// 修改用户禁用/启用状态
export const updateStatus = (data?: object) => request({ url: 'config/companySysOrg/updateStatus', data, method: 'post'})
// 修改用户信息
export const updateuserInfo = (data?: object) => request({ url: 'user/user/company/updateStatus', data, method: 'post'})
// 新增用户信息
export const saveUser = (data?: object) => request({ url: 'user/user/company/save', data, method: 'post'})
// 角色列表
export const userList = (params?: object) => request({ url: 'user/role/getSystemRole', params})
// 获取用户详情
export const getUserInfo = (params?: object) => request({ url: 'user/user/company/view', params})
// 获取上云默认密码
export const getUpCloudPwd = (params?:object) => request({url: 'user/user/getOrgDefaultPassword', params})
