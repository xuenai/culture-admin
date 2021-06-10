
// 引入封装好的axios请求
import request from '@/util/request';
import CONFIG from '@util/config'
// 资源类型
export const getResourceByType = (params?: object) => request({ url: 'res/site/ctcCommonPlace/getResourceByType', params })
// 获取用户信息
export const getUserInfo = (params?: object) => request({ url: 'user/user/view', params })
// 图片列表片
export const getPicList = (params?: object) => request({ url: 'res/site/ctcResImg/list', params })
// 更改图片启用/禁用状态
export const updateStatusPic = (data?: object) => request({ url: 'res/site/ctcResImg/updateStatus', data, method: 'post' })
// 新增(单次)/修改图片信息
export const saveImg = (data?: object) => request({ url: 'res/site/ctcResImg/save', data, method: 'post' })
// 批量上传图片
export const saveImgs = (data?: object) => request({ url: 'res/site/ctcResImg/multiSave', data, method: 'post' })
// 获取图片详情
export const getImgInfo = (params?: object) => request({ url: 'res/site/ctcResImg/view?', params, loading: true })
// 删除图片
export const delImgInfo = (data?: object) => request({ url: 'res/site/ctcResImg/delete', data, method: 'post' })
// 获取视频列表
export const getVideoList = (params?: object) => request({ url: 'res/site/ctcResVideo/list', params, noCancelRepeatRequest: true })
// 删除视频
export const delVideoInfo = (data?: object) => request({ url: 'res/site/ctcResVideo/delete', data, method: 'post' })
// 获取视频详情
export const getVideoInfo = (params?: object) => request({ url: 'res/site/ctcResVideo/view?', params, noCancelRepeatRequest: true, loading: true })
// 新增(单次)/修改视频信息
export const saveVideo = (data?: object) => request({ url: 'res/site/ctcResVideo/save', data, method: 'post', loading: true, noCancelRepeatRequest: true })
// 批量上传视频
export const saveVideos = (data?: object) => request({ url: 'res/site/ctcResVideo/multiSave?', data, method: 'post' })
// 更改视频启用/禁用状态
export const updateStatusVideo = (data?: object) => request({ url: 'res/site/ctcResVideo/updateStatus', data, method: 'post' })
// 获取音频列表
export const getVoiceList = (params?: object) => request({ url: 'res/site/ctcResVoice/list', params })
// 删除音频
export const delVoiceInfo = (data?: object) => request({ url: 'res/site/ctcResVoice/delete', data, method: 'post' })
// 获取音频详情
export const getVoiceInfo = (params?: object) => request({ url: 'res/site/ctcResVoice/view?', params, loading: true })
// 新增(单次)/修改音频信息
export const saveVoice = (data?: object) => request({ url: 'res//site/ctcResVoice/save', data, method: 'post', loading: true })
// 更改音频启用/禁用状态
export const updateStatusVoice = (data?: object) => request({ url: 'res/site/ctcResVoice/updateStatus', data, method: 'post' })
// 批量上传音频
export const saveVoices = (data?: object) => request({ url: 'res/site/ctcResVoice/multiSave', data, method: 'post' })
// 获取小贴士列表
export const getCtcTipsList = (params?: object) => request({ url: 'res/site/ctcTips/list?', params })
// 修改小贴士禁用/启用状态
export const updateStatusTips = (data?: object) => request({ url: 'res/site/ctcTips/updateStatus', data, method: 'post' })
// 新增小贴士
export const saveTips = (data?: object) => request({ url: 'res/site/ctcTips/save', data, method: 'post' })
// 删除小贴士
export const delTips = (data?: object) => request({ url: 'res/site/ctcTips/delete', data, method: 'post' })
// 广告列表
export const getAdLsit = (params?: object) => request({ url: 'res/site/ctcAd/list?', params })
// 删除广告
export const delAdLsit = (data?: object) => request({ url: 'res/site/ctcAd/delete?', data, method: 'post' })
// 新增||修改广告
export const saveAdLsit = (data?: object) => request({ url: 'res/site/ctcAd/save?', data, method: 'post', loading: true })
// 获取广告详情
export const getAdDesc = (params?: object) => request({ url: 'res/site/ctcAd/view?', params, noCancelRepeatRequest: true })
// 广告位列表
export const getAdPoList = (params?: object) => request({ url: 'user/cloud/position/nameList?', params, noCancelRepeatRequest: true })
// 新更改广告启用/禁用状态
export const updateStatusAdv = (data?: object) => request({ url: 'res/site/ctcAd/updateStatus?', data, method: 'post', loading: true })
// 标签详情
export const getTagDetail = (params: object) => request({ url: 'config/resLabel/view', params })
// 核销记录
export const getValidList = (params: object) => request({ url: 'act/api/activityOrder/appValidList', params, noCancelRepeatRequest: true, loading: true })

// 保存社团
export const saveAssociation = (data: object) => request({ url: 'res/site/ctcAssociation/save', data, method: 'post', loading: true })
// 社团列表
export const associationList = (params: object) => request({ url: 'res/site/ctcAssociation/list', params })
// 社团详情
export const associationView = (params: object) => request({ url: 'res/site/ctcAssociation/view', params })
// 社团删除
export const associationDelete = (data: object) => request({ url: 'res/site/ctcAssociation/delete', data, method: 'post' })
// 社团状态更新
export const updateDataStatus = (data: object) => request({ url: 'res/site/ctcAssociation/updateDataStatus', data, method: 'post' })
// 社团导入
export const associationImportExcel = (data: object) => request({ url: 'res/site/ctcAssociation/importExcel', data, method: 'post', isUploadFile: true })
// 社团排序
export const associationSetSort = (data: object) => request({ url: 'res/site/ctcAssociation/setSort', data, method: 'post' })
// 社团头部
export const associationHeadInfo = (params: object) => request({ url: 'res/site/ctcAssociation/associationHeadInfo', params })
// 社团成员列表
export const associationPersonList = (params: object) => request({ url: 'res/site/ctcAssociationPerson/list', params })
// 社团成员保存
export const saveAssociationPerson = (data: object) => request({ url: 'res/site/ctcAssociationPerson/save', data, method: 'post', loading: true })
// 社团成员详情
export const associationPersonView = (params: object) => request({ url: 'res/site/ctcAssociationPerson/view', params })
// 社团成员状态更新
export const personUpdateDataStatus = (data: object) => request({ url: 'res/site/ctcAssociationPerson/updateDataStatus', data, method: 'post' })
// 社团成员排序
export const personSetSort = (data: object) => request({ url: 'res/site/ctcAssociationPerson/setSort', data, method: 'post' })
// 社团成员导入
export const personImportExcel = (data: object) => request({ url: 'res/site/ctcAssociationPerson/importExcel', data, method: 'post', isUploadFile: true })

// 社团概况统计数量
export const getAssociationNum = (params?: object) => request({ url: 'res/site/ctcAssociation/getAssociationNum', params })
// 社团分类统计情况
export const getAssociationNumByType = (params: object) => request({ url: 'res/site/ctcAssociation/getAssociationNumByType', params })
// 最近1个月热门社团排行榜 TOP10
export const getAssociationTopTenMonth = (params: object) => request({ url: 'res/site/ctcAssociation/getAssociationTopTenMonth', params })
// 社团7天概况
export const getAssociationSummary = (params?: object) => request({ url: 'res/site/ctcAssociation/getAssociationSummary', params })
// 社团企业端折线图
export const getAssociationMonth = (params?: object) => request({ url: 'res/site/ctcAssociation/getAssociationMonth', params })
 // 最近7天新增非遗
 export const getHeritageSummary = (params: object) => request({ url: 'res/site/ctcHeritageItem/getHeritageSummary', params})
 // 非遗企业端折线图
 export const getHeritageMonth = (params: object) => request({ url: 'res/site/ctcHeritageItem/getHeritageMonth', params})
 // 非遗概况统计数量
 export const getHeritageNum = (params?: object) => request({ url: 'res/site/ctcHeritageItem/getHeritageNum', params })
// 2.28  志愿者管理
// 志愿者管理列表
export const getVolunteerManList = (params: object) => request({ url: 'res/volunteer/list', params })
// 志愿者管理详情
export const getVolunteerManDesc = (params: object) => request({ url: 'res/volunteer/view', params })
// 志愿者类型
export const getVolunteerManType = (params: object) => request({ url: 'config/dict/dictType', params })
// 志愿者推荐
export const setVolunteerRecommend = (data?: object) => request({ url: 'res/volunteer/setRecommendStatus', data, method: 'post' })
// 志愿者置顶
export const setVolunteerTop = (data?: object) => request({ url: 'res/volunteer/setTopStatus', data, method: 'post' })
// 志愿者排序
export const setVolunteerSort = (data?: object) => request({ url: 'res/volunteer/setSort', data, method: 'post' })
// 志愿者概况统计
export const getVolunteerSurveyCount = (params?: object) => request({ url: 'res/resourceCount/volunteerSurveyCount', params })
// 志愿者字典值
export const getVolunteerDictValue = (params?: object) => request({ url: 'res/volunteer/getDictValue', params })
// 志愿者删除
export const volunteerDelete = (data?: object) => request({ url: 'res/volunteer/delete', data,method:'post' })
// 志愿者提交
export const volunteerSubmit = (data?: object) => request({ url: 'res/volunteer/submit', data,method:'post' })
// 志愿者设置状态
export const setVolunteerStatus = (data?: object) => request({ url: 'res/volunteer/setVolunteerStatus', data,method:'post' })
//获取志愿者配置
export const getVolunteerConfig = (params?: object) => request({ url: 'res/volunteer/getConfig', params })
//志愿者保存
export const addVolunteer = (data?: object) => request({ url: 'res/volunteer/addVolunteer', data,method:'post' })
//志愿者审核记录
export const volunteerAuditRecord = (params?: object) => request({ url: 'res/volunteer/auditRecord',params })
// 志愿者团队审核记录
export const volunteerTeamAuditRecord = (params?: object) => request({ url: 'res/volunteerTeam/auditRecord',params })
//志愿者撤回
export const volunteerWithdraw = (data?: object) => request({ url: 'res/volunteer/withdraw',data,method:'post' })
//获取志愿团成员
export const teamVolunteerList = (params?: object) => request({ url: 'res/volunteerTeam/teamVolunteerList',params })
// 志愿者配置
export const volunteerSaveConfig = (data?: object) => request({ url: 'res/volunteer/saveConfig',data,method:'post' })
// 志愿者配置记录
export const getConfigRecord = (params?: object) => request({ url: 'res/volunteer/getConfigRecord',params })
// 获取志愿者团队配置
export const getVolunteerTeamConfig = (params?: object) => request({ url: 'res/volunteerTeam/getVolunteerTeamConfig',params })
// 修改更新志愿者团队配置
export const updateVolunteerTeamConfig = (data?: object) => request({ url: 'res/volunteerTeam/updateVolunteerTeamConfig',data,method:'post' })
//取消团队负责人
export const cancelMemberManage = (data?: object) => request({ url: 'res/volunteerTeam/cancelMemberManage',data,method:'post' })
// 转让主要负责人
export const transferManage = (data?: object) => request({ url: 'res/volunteerTeam/transfer',data,method:'post' })
// 负责人权限配置修改
export const updateTeamMemberConfig = (data?: object) => request({ url: 'res/volunteerTeam/updateTeamMemberConfig',data,method:'post' })
//添加团队负责人
export const addMemberManage = (data?: object) => request({ url: 'res/volunteerTeam/addMemberManage',data,method:'post' })
//添加团队主要负责人身份
export const addMemberFounder = (data?: object) => request({ url: 'res/volunteerTeam/addMemberFounder',data,method:'post' })

// 统计最近7天新增志愿者
export const getCountLatelyVolunteer = (params?: object) => request({ url: 'res/resourceCount/countLatelyVolunteer', params })
// 统计最近7天发布志愿者团队
export const getCountLatelyVolunteerTeam = (params?: object) => request({ url: 'res/resourceCount/countLatelyVolunteerTeam', params })
// 企业端最近一个月志愿者统计
export const getLatelyOneMonthVolunteer = (params?: object) => request({ url: 'res/resourceCount/companyCountLatelyOneMonthVolunteer', params })
// 志愿团详情
export const getVolunteerTeam = (params: object) => request({ url: 'res/volunteerTeam/view', params })
// 保存志愿者团队
export const saveVolunteerTeam = (data: object) => request({ url: 'res/volunteerTeam/save', data, method: 'post', loading: true })
// 志愿团列表
export const getVolunteerTeamList = (params: object) => request({ url: 'res/volunteerTeam/list', params })
// 获取志愿团成员
export const getVolunteerTeamItem = (params: object) => request({ url: 'res/volunteer/teamVolunteerList', params })
// 删除数据
export const deleteVolunteerTeam = (params: object) => request({ url: 'res/volunteerTeam/delete', params })
//志愿者启用，禁用，置顶，推荐
export const setTeamStatus = (data: object) => request({ url: 'res/volunteerTeam/setTeamStatus', data,method:'post' })
// 订单审核记录删除
export const orderDelete = (data: object) => request({ url: 'act/activity/order/delete', data, method: 'post' })
// 提交数据
export const submitVolunteerTeam = (data: object) => request({ url: 'res/volunteerTeam/submit', data, method: 'post' })

// 数据分析
// 获取 内容分析统计数据
interface getContentAnalyzeParams {
  title?: string;
  currPage?: number;
  channelId?: number | string;
  isAsc?: boolean;
  endDate?: string;
  startDate?: string;
  pageSize?: number;
  sortField?: string;
}
export const getContentAnalyzeCount = (params: getContentAnalyzeParams) => request({ url: 'res/site/content/analyzeCount', params });
// 获取内容分析列表
export const getContentAnalyzeList = (params: getContentAnalyzeParams) => request({ url: 'res/site/content/analyzeList', params });
// 导出内容分析内容
export const exportContentAnalyzeList = (params: getContentAnalyzeParams) => request({ url: 'res/site/content/exportAnalyzeExcel', params, isUploadFile: true, isExportExcel: true });

interface getTagTopicAnalyzeParams {
  name?: string;
  currPage?: number;
  isAsc?: boolean;
  endDate?: string;
  startDate?: string;
  pageSize?: number;
  sortField?: string;
}
// 获取标签分析列表
export const getTagAnalyzeList = (params: getTagTopicAnalyzeParams) => request({ url: 'res/storyTag/analyzeList', params });
// 导出标签分析内容
export const exportTagAnalyzeList = (params: getTagTopicAnalyzeParams) => request({ url: 'res/storyTag/exportAnalyzeExcel', params, isUploadFile: true, isExportExcel: true });
// 获取标签分析统计数据
export const getTagAnalyzeCount = (params: getTagTopicAnalyzeParams) => request({ url: 'res/storyTag/analyzeCount', params });

// 获取标签分析列表
export const getTopicAnalyzeList = (params: getTagTopicAnalyzeParams) => request({ url: 'res/topic/analyzeList', params });
// 导出标签分析内容
export const exportTopicAnalyzeList = (params: getTagTopicAnalyzeParams) => request({ url: 'res/topic/exportAnalyzeExcel', params, isUploadFile: true, isExportExcel: true });
// 获取标签分析统计数据
export const getTopicAnalyzeCount = (params: getTagTopicAnalyzeParams) => request({ url: 'res/topic/analyzeCount', params });

interface toryAnalyzeParams {
  currPage?: number;
  pageSize?: number;
  sortField?: string;
  isAsc?: boolean;
  endDate?: string;
  startDate?: string;
  keyWord?: string;
  tagName?: string;
  topicName?: string;
}
// 获取故事分析列表数据
export const getStoryAnalyzeList = (params: toryAnalyzeParams) => request({ url: 'res/story/analyzeList', params });
// 获取故事分析统计
export const getStoryAnalyzeCount = (params: toryAnalyzeParams) => request({ url: 'res/story/analyzeCount', params });

interface adsAnalyzeParams {
  currPage?: number;
  pageSize?: number;
  sortField?: string;
  isAsc?: boolean;
  endDate?: string;
  startDate?: string;
  name?: string;
  adPositionId?: string | number;
  publishChannel?: string | number;
}
// 获取广告分析列表数据
export const getAdsAnalyzeList = (params: adsAnalyzeParams) => request({ url: 'res/site/ctcAd/analyzeList', params });
// 获取广告分析统计
export const getAdsAnalyzeCount = (params: adsAnalyzeParams) => request({ url: 'res/site/ctcAd/analyzeCount', params });


// 保存机器人信息
export const saveRobot = (data: object) => request({ url: 'res/robot/save', data, method: 'post' })
// 获取机器人信息
export const getRobotInfo = () => request({ url: 'res/robot/getInfo' });
// 保存问答信息
export const saveQuesAnswer = (data: object) => request({ url: 'res/robotQaDepot/save', data, method: 'post' })
// 获取数据详情
export const getQuesAnswerInfo = (params: object) => request({ url: 'res/robotQaDepot/view', params });
// 获取问答列表
export const getQuesAnswerList = (params: object) => request({ url: 'res/robotQaDepot/list', params });
// 删除数据
export const deleteQuesAnswer = (data: object) => request({ url: 'res/robotQaDepot/delete', data, method: 'post' })
// 启用禁用数据
export const updateQuesAnswerStatus = (data: object) => request({ url: 'res/robotQaDepot/updateStatus', data, method: 'post' })
// 获取会话记录
export const getRecordList = (params: object) => request({ url: 'res/robotQaRecord/conversationQaRecordList', params });
// 获取未知答复问题列表
export const getUnknowList = (params?: object) => request({ url: 'res/robotQaRecord/list', params });
// 修改状态
export const updateUnknowStatus = (data: object) => request({ url: 'res/robotQaRecord/updateStatus', data, method: 'post' })
// 删除数据
export const deleteRecord = (data: object) => request({ url: 'res/robotQaRecord/delete', data, method: 'post' })
//内测人员列表
export const betaUserList = (params: object) => request({ url: 'user/betaUser/list', params })
//新增内测人员
export const betaUserSave = (data: object) => request({ url: 'user/betaUser/save', data, method: 'post' })
//删除内测人员
export const betaUserDelete = (data: object) => request({ url: 'user/betaUser/delete', data, method: 'post' })
// 导入内测人员
export const betaUserImportUser = (data: object) => request({ url: 'user/betaUser/importUser', data, method: 'post', isUploadFile: true })
// 导出访问记录
export const exportUserVisitList = (params: object) => request({ url: 'user/betaUser/exportUserVisitList', params })
// 访问记录
export const visitList = (params: object) => request({ url: 'user/betaUser/visitList', params })
// 重新发码
export const refreshCode = (data: object) => request({ url: 'user/betaUser/refreshCode', data, method: 'post' })

// 获取智能行程列表
interface getJourneyListParams {
  pageSize?:number;
  currPage?:number;
  name?:string;
}
export const getJourneyList = (params: getJourneyListParams) => request({url: 'resExt/journey/list', params});

// 行程相关操作
export const setJouneryOperate = (data:any) => request({url: 'resExt/journey/operate', data, method: 'post',});

// 保存行程
// 保存行程后端必须让用requestpayload格式保存，所以request.ts中进行了单独的处理，增加了个参数isRequestPayload来判断
export interface saveJouneryParams {
  personalTags?:string | number;
  fitTags?:string | number;
  travelType: 'JOURNEY_TRAVEL_SELF' | 'JOURNEY_TRAVEL_TRAFFIC';
  name: string;
  dateSaveDTOList:Array<dateSaveDTO>;
  cityRegion: number | string;
  cityName: string;
  id?: string | number;
}
export interface dateSaveDTO {
  sourceSaveDTOList:Array<sourceSaveDTO>
  processTime: string;
}
export interface sourceSaveDTO {
  timeInterval?: string;
  sourceType: string;
  sourceId: string | number;
  notes?: string;
}
export const saveJounery = (data: saveJouneryParams) => request({url: 'resExt/journey/save', data, method: 'post', isRequestPayload: true});

// 行程详情
interface getJourneyDetailParams {
  id: string;
}
export const getJourneyDetail = (params?: getJourneyDetailParams) => request({url: 'resExt/journey/view', params, loading: true});

// 获取问候语日历列表
export const getCalendarList = (params: object) => request({ url: 'res/robot/calendarList', params, noCancelRepeatRequest: true });
// 获取问候配置
export const getGreetingsConfig = () => request({ url: 'res/robot/getGreetingsConfig' });
// 模板导入
export const robotImportExc = (data: object) => request({ url: 'res/robot/importExcel', data, method: 'post', isUploadFile: true })
// 保存问候配置
export const saveGreetingsConfig = (data: object) => request({ url: 'res/robot/saveGreetingsConfig', data, method: 'post', loading: true })
// 保存日历问候语信息
export const saveDailyGreetings = (data: object) => request({ url: 'res/robot/saveDailyGreetings', data, method: 'post' })

// 获取回答记录统计
export const getQaRecordCount = (params: object) => request({ url: 'res/robotQaRecord/qaRecordCount', params });
// 获取问题统计
export const getQaDepotCount = (params: object) => request({ url: 'res/robotQaRecord/qaDepotCount', params });
// 选择列表 无分页
export const getQaselectList = () => request({ url: 'res/robotQaType/selectList' });
// 保存日历问候语信息
export const saveQaType = (data: object) => request({ url: 'res/robotQaType/save', data, method: 'post' })
// 删除分类数据
export const deleteQaType = (data: object) => request({ url: 'res/robotQaType/delete', data, method: 'post' })
// 选择列表 分页
export const getQaselectListPage = (params?: object) => request({ url: 'res/robotQaType/list', params });

// 课程类型
// 详情
export const getSchoolCourseType = (params: object) => request({ url: 'res/schoolCourseType/view', params });
// 列表
export const getSchoolCourseTypeList = (params: object) => request({ url: 'res/schoolCourseType/list', params, noCancelRepeatRequest: true });
// 添加更新
export const saveSchoolCourseType = (data: object) => request({ url: 'res/schoolCourseType/save', data, method: 'post', loading: true })
// 删除
export const deleteSchoolCourseType = (data: object) => request({ url: 'res/schoolCourseType/delete', data, method: 'post' })
// 更新状态
export const updateSchoolCourse = (data: object) => request({ url: 'res/schoolCourseType/updateStatus', data, method: 'post' })

// 讲师
// 添加更新
export const saveSchoolLecturer = (data: object) => request({ url: 'res/schoolLecturer/save', data, method: 'post', loading: true })
// 详情
export const getSchoolLecturer = (params: object) => request({ url: 'res/schoolLecturer/view', params });
// 删除
export const deleteSchoolLecturer = (data: object) => request({ url: 'res/schoolLecturer/delete', data, method: 'post' })
// 更新状态
export const updateSchoolLecturer = (data: object) => request({ url: 'res/schoolLecturer/updateStatus', data, method: 'post' })
// 列表
export const getSchoolLecturerList = (params: object) => request({ url: 'res/schoolLecturer/list', params, noCancelRepeatRequest: true });

// 课程
// 添加更新
export const saveSchoolCourse = (data: object) => request({ url: 'res/schoolCourse/save', data, method: 'post', loading: true, contentTypeIsJson: true })
// 详情
export const getSchoolCourse = (params: object) => request({ url: 'res/schoolCourse/view', params });
// 列表
export const getSchoolCourseList = (params: object) => request({ url: 'res/schoolCourse/list', params });
// 列表
export const deleteSchoolCourse = (data: object) => request({ url: 'res/schoolCourse/delete', data, method: 'post' });
// 审核列表
export const getSchoolCourseAuditList = (params?: object) => request({ url: 'res/schoolCourse/auditList', params });

// 问答
// 列表
export const getSchoolQuestionList = (params?: object) => request({ url: 'res/schoolQuestion/list', params, noCancelRepeatRequest: true });
// 回复问题
export const saveSchoolQuestion = (data: object) => request({ url: 'res/schoolQuestion/save', data, method: 'post' })
// 详情
export const getSchoolQuestion = (params: object) => request({ url: 'res/schoolQuestion/view', params });
// 更新状态
export const updateSchoolQuestion = (params: object) => request({ url: 'res/schoolQuestion/updateStatus', params })
// 
export const getSchoolRecordList = (params?: object) => request({ url: 'res/schoolRecord/list', params })
// 
export const updateCommentStatus = (params: object) => request({ url: 'res/schoolComment/updateStatus', params })
// 
export const getSchoolCommentList = (params: object) => request({ url: 'res/schoolCourse/listComment', params })

// 上传word文档并且转换成html代码
export const word2Html = (data?:object) => request({url: CONFIG.defaultUrl + '/config/ued/wordToHtml', data, loading: true, method: 'post'});
// 导游导览
// 保存
export const saveTourGuide = (data: object) => request({ url: 'res/site/guidedTour/save', data, method: 'post' })
// 删除
export const deleteTourGuide = (data: object) => request({ url: 'res/site/guidedTour/delete', data, method: 'post' })
// 列表
export const getTourGuideList = (params?: object) => request({ url: 'res/site/guidedTour/list', params })
// 详情
export const getTourGuide = (params: object) => request({ url: 'res/site/guidedTour/view', params })
// 景区列表
export const getScenicListSimple = (params: object) => request({ url: 'res/site/guidedTour/select', params })
// 获取选择资源
export const getGuidedTourResource = (params: object) => request({ url: 'res/site/guidedTourResource/list', params })
// 保存
export const saveGuidedTourResource = (data: object) => request({ url: 'res/site/guidedTourResource/save', data, method: 'post', contentTypeIsJson: true })
// 更新坐标
export const updatePosition = (data: object) => request({ url: 'res/site/guidedTourRouteResource/updatePosition', data, method: 'post' })
// 线路列表
export const getGuidedTourRoutes = (params: object) => request({ url: 'res/site/guidedTourRoute/list', params })
// 线路详情
export const getGuidedTourRoute = (params: object) => request({ url: 'res/site/guidedTourRoute/view', params })
// 线路删除
export const deleteGuidedTourRoute = (data: object) => request({ url: 'res/site/guidedTourRoute/delete', data, method: 'post' })
// 线路添加
export const saveGuidedTourRoute = (data: object) => request({ url: 'res/site/guidedTourRoute/save', data, method: 'post' })
// 线路资源保存
export const saveGuidedTourRouteResource = (data: object) => request({ url: 'res/site/guidedTourRouteResource/save', data, method: 'post', contentTypeIsJson: true })
// 线路资源列表
export const getGuidedTourRouteResource = (params: object) => request({ url: 'res/site/guidedTourRouteResource/list', params })
// 获取列表
export const getGuidedTourResourceSelect = (params: object) => request({ url: 'res/site/guidedTourResource/select', params })
// 全域版获取选择资源删除
export const deleteGuidedTourResource = (data: object) => request({ url: 'res/site/guidedTourResource/delete', data, method: 'post' })