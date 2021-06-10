/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 20:28:25
 * @LastEditTime: 2019-08-10 14:35:11
 * @LastEditors: Please set LastEditors
 */
// 引入封装好的axios请求
import request from '@/util/request';

/* 概况 */
// 获取统计数据
export const getTotalList = (params?: object) => request({ url: 'user/consumUserRecord/getTotal', params ,noCancelRepeatRequest:true})
// 获新增会员数量
export const getNewNumsList = (params?: object) => request({ url: 'user/consumUserRecord/getNewNums', params ,noCancelRepeatRequest:true })
// 导出表格
export const getExportExcel = (params?: object) => request({ url: 'user/consumUserRecord/exportExcel', params })
// 会员数据详情(分页)
export const getNumsList = (params?: object) => request({ url: 'user/consumUserRecord/list', params,noCancelRepeatRequest:true })

/* 会员管理 */
// 获取用户列表
export const getUserList = (params?: object) => request({ url: 'user/consumUser/list', params })
// 收货人信息
export const consumUserReceiveInfo = (params?: object) => request({ url: 'user/consumUser/receiveList', params })
// 常用联系人
export const consumUserContactsInfo = (params?: object) => request({ url: 'user/consumUser/contactsList', params })
// 会员积分信息
export const consumUserPointInfo = (params?: object) => request({ url: 'user/consumUser/pointInfo', params })
// 会员基本信息
export const consumUserDetail = (params?: object) => request({ url: 'user/consumUser/view', params , noCancelRepeatRequest:true,loading: true })

/* 会员体系 */
//获取用户积分等级配置
export const getUserPointList = (params?: object) => request({ url: 'user/consumUserPoints/list', params })
//获取 赠送积分活动详情
export const getUserPointsActivityDetail = (params?: object) => request({ url: 'user/consumUserPointsActivity/list', params })
//新增/修改 积分活动
export const saveUserPointsActivity = (data?: object) => request({ url: 'user/consumUserPointsActivity/save', data , method: 'post',loading:true})
//新增/修改 用户积分等级配置
export const saveUserPoints = (data?: object) => request({ url: 'user/consumUserPoints/save', data , method: 'post',loading:true})
//会员积分等级配置删除
export const delUserPoints = (data?: object) => request({ url: 'user/consumUserPoints/delete', data , method: 'post',loading:true});
// 会员体系同步小电商状态修改
interface changeConsumUserPointsStatusType {
  status: number
}
export const changeConsumUserPointsStatus = (data: changeConsumUserPointsStatusType) => request({url: 'user/consumUserPoints/updateStatus',method: 'post', data, loading:true});
// 获取用户积分体系和配置
export const getUserPointSetting = (params?: object) => request({url: 'user/consumUserPoints/list', params});
// 新增。修改 用户积分体系和配置
interface updateUserPointSettingType {
  jsonDto: string
}
export const updateUserPointSetting = (data: updateUserPointSettingType) => request({url: 'user/consumUserPoints/save',method: 'post', data, loading: true});

// 获取任务列表
export const getTaskList = (params?:object) => request({url: 'task/list/list', params});
// 启用/禁用任务状态
export interface changeTaskStatusType {
  status: number;
  userId: string;
  ids: string | number;
}
export const changeTaskStatus = (data: changeTaskStatusType) => request({url: 'task/list/updateStatus', data, method: 'post', loading: true});
// 删除任务
interface deleteTaskType {
  userId: string;
  ids: string | number;
}
export const deleteTask = (data: deleteTaskType) => request({url: 'task/list/delete', data, method: 'post'});
// 任务详情
export const getTaskDetail = (params?: object) => request({url: 'task/list/view', params, loading: true});
// 发布任务
interface saveTaskType {
  taskRoleCode: string;
  taskLastStatus: string | number;
  id?: string| number;
  endTime: string;
  startTime: string;
  name: string;
  publisChannel: string;
  userId: string;
  taskTypeCode: string;
  sort?: number | string;
  synopsis: string;
  icon: string;
  rewardType: string;
  cruxValue: string;
  atuoDraw: string;
  rewardIntegral?: string;
  conditionValue?: string;
  externalUrl?:string;
}
export const saveTask = (data: saveTaskType) => request({url: 'task/list/save', data, method: 'post', loading: true});
// 任务排序
interface saveTaskSortType {
  params: string;
  userId: string | number;
}
export const saveTaskSort = (data: saveTaskSortType) => request({url: 'task/list/updateSorts', data, method: 'post', loading: true});

//积分日志
export const getTaskRecord = (params?: object) => request({ url: 'user/taskRecord/list', params });
//会员都喜欢在什么时间领任务
export const getTaskByHourCount = (params?: object) => request({ url: 'task/statistics/getTaskByHourCount', params });
//会员都喜欢做那些任务来获得积分
export const getIntegralTaskType = (params?: object) => request({ url: 'task/statistics/getIntegralTaskType', params });
//共计送出积分
export const getIntegralCount = (params?: object) => request({ url: 'task/statistics/getIntegralCount', params });
//任务类型数量统计
export const getTaskListCount = (params?: object) => request({ url: 'task/statistics/getTaskListCount', params });
// 获取任务类型列表
interface getTaskTypeListType {
  publishChannel: string;
}
export const getTaskTypeList = (params: getTaskTypeListType) => request({url: 'task/type/getTaskTypeList', params, loading: true});
// 获取开通小电商的URL
export const getOpenUrl = (params?:Object) => request({url: 'user/user/getOpenUrl', params});

// 获取诚信规则列表
export const getRuleList = (params?:Object) => request({url: 'credit/rule/config', params});
// 获取诚信等级规则列表
export const getLevelRuleList = (params?:Object) => request({url: 'credit/level/rule/list', params});
// 获取诚信行为列表
export const getActionRuleList = (params?:Object) => request({url: 'credit/action/rule/list', params});
// 获取失约会员统计列表
export const getLosePromiseUserList = (params?:Object) => request({url: 'user/consumUser/losePromiseUserList', params});
// 获取平台诚信用户概况统计
export const getPlatformUserCount = (params?:Object) => request({url: 'credit/creditUser/platformUserCount', params});
