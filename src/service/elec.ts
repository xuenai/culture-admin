/*
 * @Author: Hexg
 * @Date: 2019-07-08 20:44:10
 * @Last Modified by:   Hexg
 * @Last Modified time: 2019-07-08 20:44:10
 */
// 小电商接口

// 引入封装好的axios请求
import request from '@/util/request';

// 通过userSn获取店铺列表
export const getShopListByUserSn = (params?: object) => request({url: 'culturalcloud/1.0/product/relationSubstationList', params }, true)
// 获取商品类目
export const findProductCategory = (params?: object) => request({url: 'culturalcloud/1.0/product/findProductCategory', params }, true)
// 查询小电商商品
export const getProductList = (data?: object) => request({ url: 'culturalcloud/1.0/product/list', data , method: 'post'} , true)