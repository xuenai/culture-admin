// 引入封装好的axios请求
import request from '@/util/request';
// 定义自己需要的
export const testRequest = (params?: object) => request({ url: 'article/list', params })
