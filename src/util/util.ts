import Cookies from 'js-cookie'
export const session = {
  set: (key: string, value: any): any => {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  },
  get: (key: string): any => {
    let value: any = window.sessionStorage.getItem(key)
    return (value && value.length) ? JSON.parse(value) : ''
  },
  remove: (key: string): any => {
    window.sessionStorage.removeItem(key)
  },
  clear: (): any => {
    window.sessionStorage.clear()
  },
}
// 设置cookie过期时间为 5个小时
const expires = 6 / 24;
export const cookies = {
  // 设置指定cookie
  set: (key: string, value: any): void => {
    Cookies.set(key, value, { expires })
  },
  // 获取指定cookie
  get: (key: string): any => {
    return Cookies.getJSON(key) || '';
  },
  // 清除指定cookie
  remove: (key: string): void => {
    Cookies.remove(key)
  },
  // 清除所有可见cookie
  clear: (): void => {
    Object.keys(Cookies.get()).forEach(function (cookieName) {
      Cookies.remove(cookieName);
    });
  }
}

/**
 * localStorage相关方法
 */
export const storage = {
  // 设置键值
  set: (key: string, value: any): void => {
    let val = JSON.stringify(value)
    localStorage.setItem(key, val)
  },
  // 读取值
  get: (key: string): any => {
    let value: any = localStorage.getItem(key)
    return (value && value.length) ? JSON.parse(value) : null
  },
  // 删除值
  remove: (key: string): any => {
    localStorage.removeItem(key)
  },
  // 清空
  clear: (): void => {
    localStorage.clear()
  }
}

/**
 * 导出excel
 * @param href {string} 导出按钮
 */
export const exportExcel = (href: string): void => {
  let link = document.createElement('a');
  let div = document.createElement('div');
  link.href = href; // 创建下载的链接
  link.style.display = 'none';
  document.body.appendChild(link);
  link.appendChild(div)
  div.click(); // 点击下载
  document.body.removeChild(link); // 下载完成移除元素
}

/**
 * 文件下载
 * @param blob 文件流
 * @param fileName 文件名字
 */
export const downFile = (blob: Blob, fileName: string) => {
  // 非IE下载
  if ('download' in document.createElement('a')) {
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob); // 创建下载的链接
    link.download = fileName; // 下载后文件名
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click(); // 点击下载
    window.URL.revokeObjectURL(link.href); // 释放掉blob对象
    document.body.removeChild(link); // 下载完成移除元素
  } else {
    // IE10+下载
    window.navigator.msSaveBlob(blob, fileName);
  }
}


/**
 * getAuditPathByMsgData 获取 待审核的路由
 * @param data ws单条数据
 */
const getAuditPathByMsgData = (data: any): string => {
  let path = ''
  switch (data.resourceType) {
    // 内容
    case 'CONTENT': {
      path = `/audit-content-detail?id=${data.resourceId}&checked=true&contentId=${data.auditId}`;
      break;
    }
    // 场馆
    case 'CONTENT_TYPE_VENUE': {
      path = `/audit-venues-edit?id=${data.resourceId}&resourceName=${data.resourceName}`;
      break;
    }
    // 活动室
    case 'CONTENT_TYPE_ACTIVITY_SHIU': {
      path = `/audit-room-edit?id=${data.resourceId}&venueId=${data.parentResourceId}&resourceName=${data.resourceName}`;
      break;
    }
    // 景区
    case 'CONTENT_TYPE_SCENERY': {
      path = `/audit-scenic-edit?id=${data.resourceId}&resourceName=${data.resourceName}`;
      break;
    }
    // 景点
    case 'CONTENT_TYPE_SCENIC_SPOTS': {
      path = `/audit-attractions-edit?id=${data.resourceId}&scenicId=${data.parentResourceId}&resourceName=${data.resourceName}`;
      break;
    }
    // 酒店
    case 'CONTENT_TYPE_HOTEL': {
      path = `/audit-hotel-edit?id=${data.resourceId}&resourceName=${data.resourceName}`;
      break;
    }
    // 客房
    case 'CONTENT_TYPE_HOTEL_ROOM': {
      path = `/audit-guestroom-edit?id=${data.resourceId}&hotelId=${data.parentResourceId}&resourceName=${data.resourceName}`;
      break;
    }
    // 餐饮
    case 'CONTENT_TYPE_RESTAURANT': {
      path = `/audit-food-edit?id=${data.resourceId}&resourceName=${data.resourceName}`;
      break;
    }
    // 厕所
    case 'CONTENT_TYPE_TOILET': {
      path = `/audit-toilet-edit?id=${data.resourceId}&resourceName=${data.resourceName}`;
      break;
    }
    // 停车场
    case 'CONTENT_TYPE_PARKING': {
      path = `/audit-parking-edit?id=${data.resourceId}&resourceName=${data.resourceName}`;
      break;
    }
    // 农家乐
    case 'CONTENT_TYPE_AGRITAINMENT': {
      path = `/audit-agritainment-edit?id=${data.resourceId}&resourceName=${data.resourceName}`;
      break;
    }
    case 'CONTENT_TYPE_ACTIVITY': {
      path = `/audit-ac-audit?id=${data.resourceId}&auditStatus=4`;
      break;
    }
    case 'CONTENT_TYPE_TOPIC': {
      path = `/audit-topic-detail?id=${data.resourceId}&topicId=${data.auditId}&resourceName=${data.resourceName}&checked=true`;
      break;
    }
    // 非遗项目
    case 'CONTENT_TYPE_HERITAGE_ITEM': {
      path = `/audit-project-edit?id=${data.resourceId}&resourceName=${data.resourceName}&checked=true`;
      break;
    }
    // 非遗传承人

    case 'CONTENT_TYPE_HERITAGE_PEOPLE': {
      path = `/audit-people-edit?id=${data.resourceId}&pid=${data.parentResourceId}&resourceName=${data.resourceName}&checked=true`;
      break;
    }
    // 非遗保护基地
    case 'CONTENT_TYPE_HERITAGE_PROTECT_BASE': {
      path = `/protect-detail/${data.resourceId}?isAudit=true`;
      break;
    }
    // 非遗传习基地
    case 'CONTENT_TYPE_HERITAGE_TEACHING_BASE': {
      path = `/inherit-detail/${data.resourceId}?isAudit=true`;
      break;
    }
    // 非遗体验基地
    case 'CONTENT_TYPE_HERITAGE_EXPERIENCE_BASE': {
      path = `/experience-detail/${data.resourceId}?isAudit=true`;
      break;
    }
    // 活动成果
    case 'CONTENT_TYPE_ACTIVITY_RESULT': {
      path = `/audit-activity-result-form?id=${data.parentResourceId}&rId=${data.resourceId}&manageId=${data.auditId}&audit=true`;
      break;
    }
    // 课程
    case 'CONTENT_TYPE_COURSE': {
      path = `/course-detail-audit/${data.resourceId}?isAudit=true`;
      break;
    }

  }
  return path
}
/**
 * getAuditDetailPathByMsgData 获取 审核后的路由
 * @param data ws单条数据
 */
const getAuditDetailPathByMsgData = (data: any): string => {
  let path = ''
  switch (data.resourceType) {
    case 'CONTENT': {
      path = `/audit-content-detail?id=${data.resourceId}`;
      break;
    }
    case 'CONTENT_TYPE_VENUE': {
      path = `/audit-venues-detail?type=audit&id=${data.resourceId}`;
      break;
    }
    // 活动室
    case 'CONTENT_TYPE_ACTIVITY_SHIU': {
      path = `/audit-room-detail?id=${data.resourceId}&venueId=${data.parentResourceId}&type=audit`;
      break;
    }
    // 景区
    case 'CONTENT_TYPE_SCENERY': {
      path = `/audit-scenic-detail?id=${data.resourceId}&type=audit`
      break;
    }
    // 景点
    case 'CONTENT_TYPE_SCENIC_SPOTS': {
      path = `/audit-attractions-detail?id=${data.resourceId}&scenicId=${data.parentResourceId}&type=audit`
      break;
    }
    // 酒店
    case 'CONTENT_TYPE_HOTEL': {
      path = `/audit-hotel-edit?id=${data.resourceId}&resourceName=${data.resourceName}`
      break;
    }
    // 客房
    case 'CONTENT_TYPE_HOTEL_ROOM': {
      path = `/audit-guestroom-detail?id=${data.resourceId}&hotelId=${data.parentResourceId}&type=audit`
      break;
    }
    // 餐饮
    case 'CONTENT_TYPE_RESTAURANT': {
      path = `/audit-food-detail?id=${data.resourceId}&type=audit`
      break;
    }
    // 厕所
    case 'CONTENT_TYPE_TOILET': {
      path = `/audit-toilet-detail?id=${data.resourceId}&type=audit`
      break;
    }
    // 停车场
    case 'CONTENT_TYPE_PARKING': {
      path = `/audit-parking-detail?id=${data.resourceId}&type=audit`
      break;
    }
    // 农家乐
    case "CONTENT_TYPE_AGRITAINMENT": {
      path = `/audit-agritainment-edit?id=${data.resourceId}&type=audit`
      break;
    }
    case 'CONTENT_TYPE_ACTIVITY': {
      path = `/ac-detail?id=${data.resourceId}`;
      break;
    }
    case 'CONTENT_TYPE_TOPIC': {
      path = `/audit-topic-detail?id=${data.resourceId}`;
      break;
    }
    // 非遗项目
    case 'CONTENT_TYPE_HERITAGE_ITEM': {
      path = `/audit-project-detail?id=${data.resourceId}&resourceName=${data.resourceName}`;
      break;
    }
    // 非遗传承人
    case 'CONTENT_TYPE_HERITAGE_PEOPLE': {
      path = `/audit-inheritor-detail?id=${data.resourceId}&pid=${data.auditId}&resourceName=${data.resourceName}`;
      break;
    }
    // 非遗保护基地
    case 'CONTENT_TYPE_HERITAGE_PROTECT_BASE': {
      path = `/protect-detail/${data.resourceId}`;
      break;
    }
    // 非遗传习基地
    case 'CONTENT_TYPE_HERITAGE_TEACHING_BASE': {
      path = `/inherit-detail/${data.resourceId}`;
      break;
    }
    // 非遗体验基地
    case 'CONTENT_TYPE_HERITAGE_EXPERIENCE_BASE': {
      path = `/experience-detail/${data.resourceId}`;
      break;
    }
    // 活动成果
    case 'CONTENT_TYPE_ACTIVITY_RESULT': {
      path = `/audit-res-detail?id=${data.parentResourceId}&rId=${data.resourceId}&manageId=${data.auditId}`;
      break;
    }
    // 课程
    case 'CONTENT_TYPE_COURSE': {
      path = `/course-detail-audit/${data.resourceId}`;
      break;
    }
  }
  return path
}

// 上报审核的路由
const getReportPathByMsgData = (data: any): string => {
  let path = '';
  switch (data.resourceType) {
    case 'CONTENT': {
      path = `/audit-content-detail?id=${data.resourceId}&auditId=${data.auditId}&auditType=2&contentType=CONTENT`;
      break;
    }
    case 'CONTENT_TYPE_ACTIVITY': {
      path = `/audit-ac-audit?id=${data.resourceId}&auditType=2&reportId=${data.auditId}`;
      break;
    }
  }
  return path;
}

// 上报审核反馈的路由
const getReprotDetailByMsgData = (data: any): string => {
  let path = '';
  switch (data.resourceType) {
    case 'CONTENT': {
      path = `/con-report-desc?id=${data.auditId}`;
      break;
    }
    case 'CONTENT_TYPE_ACTIVITY': {
      path = `/ac-detail?id=${data.resourceId}`;
      break;
    }
  }
  return path;
}

/**
 * getToPathByWsMsg 通过消息数据获取到需要跳转的页面
 * @param data ws的单条消息数据
 */
export const getToPathByWsMsg = (data: any): string => {
  let path = ''
  if (data.enableJump === 1) {

    switch (data.jumpType) {
      // 上报资源待审核跳转
      case 1: {
        path = getReportPathByMsgData(data);
        break;
      }
      // 活动预订订单列表跳转
      case 2: {
        path = `/ac-order-list`;
        break;
      }
      // 活动室订单审核列表跳转
      case 3: {
        path = `/audit-appointment`
        break;
      }
      // 资源待审核跳转
      case 4: {
        path = getAuditPathByMsgData(data);
        break;
      }
      // 资源审核反馈跳转
      case 5: {
        path = getAuditDetailPathByMsgData(data)
        break;
      }
      // 投诉跳转
      case 6: {
        path = `/audit-complaint-detail?id=${data.resourceId}`
        break;
      }
      // 投诉反馈跳转
      case 7: {
        path = `/audit-complaint-detail?id=${data.resourceId}`
        break;
      }
      // 用户申请为志愿者
      case 8: {
        path = `/volunteers-audit-desc/${data.resourceId}`;
        break;
      }
      // 志愿者申请加入志愿团队
      case 9: {
        path = `/team-audit-desc/${data.resourceId}`;
        break;
      }
      // 志愿活动审核列表
      case 10: {
        path = `/audit-ac-volunt-list`;
        break;
      }
      // 活动订单详情
      case 11: {
        path = `/ac-order-detail?id=${data.resourceId}&activityId=${data.auditId}`;
        break;
      }
      // 活动室订单详情
      case 12: {
        path = `/room-order-detail?id=${data.resourceId}&activityId=${data.auditId}`;
        break;
      }
      // 上报审核反馈
      case 13: {
        path = getReprotDetailByMsgData(data);
        break;
      }
      // 场馆预约订单详情
      case 15: {
        path = `/venue-order-detail?id=${data.resourceId}`;
        break;
      }
    }
  } else {
    path = `/sys-msg-detail?id=${data.id}`
  }
  return path
}