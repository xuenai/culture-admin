// 引入封装好的axios请求
import request from '@/util/request';
// 待处理列表
export const waitProcess = (params?: object) => request({ url: 'config/emergency/waitProcess', params })
// 已处理列表
export const processList = (params?: object) => request({ url: 'config/emergency/processList', params })
// 删除求助信息
export const deleteEmergency = (data?: object) => request({ url: 'config/emergency/delete', data, method: 'post' })
// 求助信息处理
export const handleEmergency = (data?: object) => request({ url: 'config/emergency/handle', data, method: 'post' })