/*
 * @Author: Hexg 
 * @Date: 2019-07-17 09:31:08 
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-07-27 15:38:16
 */

import CryptoJS  from 'crypto-js'

const KEY = CryptoJS.enc.Utf8.parse('js7ksl3nhnfivl4m') // 加密秘钥
const IV = CryptoJS.enc.Utf8.parse('3859345501849051') // 偏移矢量

/**
 * 使用AES CBC加密
 * @param word {string} 需要加密的字符串数据
 * @return {string} 加密后的密文
 */
export const Encrypt = (word:string):string => {
  let encrypted = CryptoJS.AES.encrypt(word, KEY, {iv: IV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Iso10126 });
  return encrypted.ciphertext.toString()
}