<template>
  <div class="wechat-menu">
    <h4 class="tit">说明</h4>
    <p class="tit-tip">由于微信接口延迟，创建菜单后需要30分钟左右才会更新至公众号。如需公众号菜单即时生效，可先取消关注，再重新关注。</p>
    <!-- 模拟菜单区域 -->
    <div class="menu-setting-area">
      <!-- 左侧预览菜单区域 -->
      <div class="menu-preview-area">
        <!-- 菜单预览 -->
        <div class="mobile-menu-preview">
          <p class="mobile-hd">{{nickName}}</p>
          <div class="mobile-bd">
            <ul class="pre-menu-list">
              <li
                class="pre-menu-item"
                v-for="(btn, idx) in btns"
                :key="`${btn.name}-${idx}`"
                :class="{curr: idx === currSelectButtonIdx && subBtnSelectedIdx === -1}"
              >
                <p class="pre-menu-name" @click.stop="selectMenuIdx(idx)">{{btn.name}}</p>
                <transition name="fade">
                  <div class="sub-pre-menu-box">
                    <ul class="sub-pre-menu-list">
                      <li class="sub-pre-menu-item" v-if="btn.sub_button.length < 5" @click="addMenu('child', idx)">
                        <p class="sub-pre-menu-item-name"><i class="cloud-icon">&#xe604;</i></p>
                      </li>
                      <li
                        class="sub-pre-menu-item"
                        v-for="(sub_btn, sub_index) in btn.sub_button"
                        :key="`${sub_btn.name}-${sub_index}`"
                        :class="{curr: sub_index === subBtnSelectedIdx && idx === currSelectButtonIdx}"
                        @click.stop="selectSubMenu(sub_index, idx)"
                      >
                        <p class="sub-pre-menu-item-name">{{sub_btn.name}}</p>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
              <li class="pre-menu-item no-extra" v-if="btns.length < 3" @click="addMenu('father')">
                <p class="pre-menu-name">
                  <i class="cloud-icon">&#xe604;</i>
                </p>
              </li>
            </ul>
          </div>
        </div>
        <!-- 保存按钮 -->
        <Button type="primary" class="save-btn" @click="saveMenuHandle">保存并发布</Button>
      </div>
      <!-- 右侧编辑区域 -->
      <div class="menu-form-area">
        <!-- 点击编辑提示 -->
        <p class="menu-initial-tips" v-if="!Object.keys(btnEdit).includes('name')">点击左侧菜单进行编辑操作</p>
        <!-- 选中菜单的编辑项 -->
        <div class="protable-editor" v-else>
          <div class="menu-form-hd">
            <p class="menu-form-hd-name">{{btnEdit.name}}</p>
            <a href="javascript:void(0);" @click="deleteMenu">删除菜单</a>
          </div>
          <div class="menu-form-bd">
            <p class="menu-form-bd-tip" v-if="Object.keys(btnEdit).length && btnEdit.sub_button.length">已添加子菜单，仅可设置菜单名称。</p>
            <div class="form-group">
              <label for class="form-label">菜单名称</label>
              <div class="form-controls">
                <Input class="form-ipt" v-model="btnEdit.name" />
                <p class="form-msg fail" v-if="compareLength(btnEdit.name)">字数超过上限</p>
                <p class="form-msg fail" v-if="!btnEdit.name.length">请输入菜单名称</p>
                <p class="form-tips">{{getMenuNameTip()}}</p>
              </div>
            </div>
            <div v-if="Object.keys(btnEdit).length && btnEdit.sub_button.length === 0">
              <div class="form-group">
                <label for class="form-label">菜单内容</label>
                <div class="form-controls">
                  <RadioGroup v-model="btnEdit.btnTypeTxt" @on-change="radioGroupChange">
                    <Radio label="文化旅游云" class="form-radio"></Radio>
                    <!-- <Radio label="发送消息" class="form-radio"></Radio> -->
                    <Radio label="外部链接" class="form-radio"></Radio>
                    <!-- <Radio label="小程序" class="form-radio"></Radio> -->
                  </RadioGroup>
                </div>
              </div>
              <!-- 跳转文化旅游云 -->
              <div class="menu-content-container" :class="{error: showLinkError}" v-if="btnEdit.btnTypeTxt === '文化旅游云'">
                <div class="ctc-content">
                  <p class="form-tips">订阅者点击该菜单会跳到以下链接</p>
                  <div class="form-btns">
                    <button class="form-btn" v-for="btn in allBtns" :key="`${btn.name}-${btn.url}`" :class="{disabled: !btn.url, active: btnEdit.url === btn.url && btn.url}" @click="checkChannel(btn.url)" v-if="btn.url">{{btn.name}}</button>
                    <!-- <button class="form-btn">选择栏目</button> -->
                  </div>
                </div>
              </div>
              <!-- 发送消息 -->
              <!-- <div class="menu-content-container" v-if="menutype === '发送消息'">
                <div class="form-group">
                  <label for class="form-label">发送内容</label>
                  <div class="form-controls">
                    <Input
                      type="textarea"
                      :rows="4"
                      :autosize="{minRows: 4, maxRows: 8}"
                      placeholder="请输入要发送的内容文字"
                    />
                  </div>
                </div>
              </div> -->
              <!-- 跳转网页 -->
              <div class="menu-content-container" :class="{error: showLinkError}" v-if="btnEdit.btnTypeTxt === '外部链接'">
                <div class="menu-content">
                  <p class="form-tips">订阅者点击该菜单会跳转到以下链接</p>
                  <div class="form-group">
                    <label for class="form-label">网页地址</label>
                    <div class="form-controls">
                      <Input class="form-ipt" placeholder="请填写http、https开头的域名" v-model="btnEdit.url"/>
                      <!-- <p class="form-msg fail">字数超过上限</p> -->
                      <p class="form-msg fail" v-if="!urlReg(btnEdit.url)">请输入正确的域名</p>
                      <p class="form-tips">请填写http、https开头的域名</p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 小程序 -->
              <!-- <div class="menu-content-container weapp-container" v-if="menutype === '小程序'">
                <div class="menu-content">
                  <p class="form-tips">
                    说明：微信公众号仅支持跳转已关联的小程序，请登录微信公众平台，将需要跳转的小程序关联至当前公众号，否将无法跳转。
                    <a
                      href="https://mp.weixin.qq.com/cgi-bin/loginpage"
                      target="_blank"
                      class="form-link"
                    >立即登录</a>
                    <a
                      href="http://kf.qq.com/faq/120911VrYVrA150210BBJvei.html"
                      target="_blank"
                      class="form-link"
                    >查看帮助</a>
                  </p>
                  <div class="weapp-btn">
                    <Button size="large">其他小程序</Button>
                  </div>
                  <div class="form-group">
                    <label for class="form-label weapp-label">小程序 APPID</label>
                    <div class="form-controls">
                      <Input class="form-ipt" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label for class="form-label weapp-label">小程序页面路径</label>
                    <div class="form-controls">
                      <Input class="form-ipt" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label for class="form-label weapp-label">备用网页</label>
                    <div class="form-controls">
                      <Input class="form-ipt" />
                    </div>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { getWechatConfigMenu, saveWechatConfigMenu, getSiteChannel, getAllSiteChannel } from "@service/app";
import axios from 'axios';
import CONFIG from '@util/config';


interface WechatMenuType {
  name?: string;
  sub_button : Array<WechatMenuType>;
  type?: 'view' | 'click' | 'miniprogram';
  key?: string; // click等点击类型必须 菜单KEY值，用于消息接口推送，不超过128字节
  url?: string; // view、miniprogram类型必须 网页 链接，用户点击菜单可打开链接，不超过1024字节。 type为miniprogram时，不支持小程序的老版本客户端将打开本url。
  media_id?: string | number; // media_id类型和view_limited类型必须 调用新增永久素材接口返回的合法media_id
  appid?:string; // miniprogram类型必须 小程序的appid（仅认证公众号可配置）
  pagepath?: string; // miniprogram类型必须 小程序的页面路径
  btnTypeTxt?: string; // 自定义的字段
}

interface cbtnType {
  level: number;
  name: string;
  url: string;
}

const BTN_TYPE_LINK = '外部链接';
const BTN_TYPE_WEAPP = '小程序';
const BTN_TYPE_C = '文化旅游云';

@Component
export default class Authorized extends Vue {
  @Prop() readonly value!: string;
  // 默认选中的菜单类型
  private menutype = "文化旅游云";
  // 公众号名字
  private nickName = "";
  // 处理后的菜单数据 清空了初始菜单中一级菜单不存在的项
  private btns: Array<WechatMenuType> = [];
  // 一级菜单当前选中下标
  private currSelectButtonIdx: number = -1;
  // 二级菜单当前选中下标
  private subBtnSelectedIdx: number = -1;
  // 保存菜单的请求参数
  private saveMenuRequestData = {
    button: []
  }
  // 信息没填完整
  private showLinkError = false;
  private cbtns:Array<cbtnType> = [];
  private allBtns:Array<cbtnType> = [];
  // 当前编辑的按钮
  get btnEdit () {
    if (this.currSelectButtonIdx === -1) {
      return {sub_button: []}
    }
    if (this.currSelectButtonIdx > -1) {
      if (this.subBtnSelectedIdx === -1) {
        return this.btns[this.currSelectButtonIdx]
      }
      return this.btns[this.currSelectButtonIdx].sub_button[this.subBtnSelectedIdx]
    }
  };
  @Watch("value", { immediate: true, deep: true })
  onValueChange(val: string) {
    this.nickName = val;
  }
  radioGroupChange () {
    // @ts-ignore
    if (Object.keys(this.btnEdit).includes('url')) {
      // @ts-ignore
      this.btnEdit.url = ''
    }
  }
  /**
   * saveMenuHandle 保存按钮点击
   */
  saveMenuHandle () {
    let button = this.formatSaveRequestData();
    if (this.validateSaveRequestData(button)) {
      this.saveRequest(button)
    } else {
      this.$Message.error(`请将数据填写完整！`);
    }
  }
  /**
   * saveRequest 保存菜单请求
   */
  saveRequest (button?: Array<WechatMenuType>) {
    saveWechatConfigMenu({button: JSON.stringify(button)}).then(res => {
      if (res.code === 0) {
        this.$Message.success('保存成功');
      } else {
        console.warn(res)
      }
    })
  }
  /**
   * formatSaveRequestData 请求保存菜单的参数
   */
  formatSaveRequestData () {
    let button = [];
    button = JSON.parse(JSON.stringify(this.btns));
    return button
  }
  /**
   * validateSaveRequestData 验证保存菜单的请求参数
   * @returns {boolean} 验证是否通过 通过返回true, 失败返回false
   */
  validateSaveRequestData (button: Array<WechatMenuType>) {
    let flag = true;
    let x = -1;
    let y = -1;
    let len = button.length;
    for(let i = 0; i < len; i ++) {
      let btn = button[i];
      if(btn.sub_button.length) {
        let subLen = btn.sub_button.length;
        for (let j=0; j < subLen; j++) {
          let subBtn = btn.sub_button[j];
          if (subBtn.type === 'view') {
            if (!this.urlReg(subBtn.url as string, true)) {
              flag = false
              x = i;
              y = j;
              break;
            }
          }
        }
      } else {
        if (btn.type === 'view') {
          if (!this.urlReg(btn.url as string, true)) {
            flag = false;
            x = i;
            break;
          }
        }
      }
    }
    if (!flag) {
      this.showLinkError = true;
      this.currSelectButtonIdx = x;
      this.subBtnSelectedIdx = y;
    }
    return flag;
  }
  /**
   * urlReg 正则匹配url 判断是否是以http、htttps开头的正确域名
   * @params url {string} 判断的url
   * @params flag {boolean} 是否不判断url为空
   * @return {boolean} 如果是 返回true 不是返回false
   */
  urlReg (url: string, flag?: boolean) {
    // url 不存在 返回true
    if(!url && !flag) {
      return true
    }
    let res = !!url.match(/^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i);
    if (res) {
      this.showLinkError = false;
    }
    return res;
  }
  /**
   * compareLength 比较字符串长度是否超过标准
   * @return {boolean} 如果长度超过标准 则返回true 未超过则返回false
   */
  compareLength (str: string) {
    let len = this.getStringChartLength(str)
    let maxLen = 10;
    if (this.subBtnSelectedIdx > -1) {
      maxLen = 16
    }
    return len > maxLen;
  }
  /**
   * getStringChartLength 获取字符串字符长度，中文算2，英文算1
   * @return {number} 返回字符串的长度
   */
  getStringChartLength (str: string) {
    if (str == null) return 0;
    return str.replace(/[^\x00-\xff]/g,"01").length
  }
  /**
   * getMenuNameTip 获取右侧菜单名字的提示，用于判断多少个字符
   * @return {string} 菜单名提示
   */
  getMenuNameTip () {
    let len = 5;
    if (this.subBtnSelectedIdx > -1) {
      len = 5;
    }
    let lenX2 = len * 2;
    return `仅支持中英文和数字，字数不超过${len}个汉字或${lenX2}个字母`
  }
  /**
   * selectMenuIdx 一级菜单点击
   * @params idx {number} 当前点击的下标
   */
  selectMenuIdx(idx: number) {
    this.currSelectButtonIdx = idx;
    this.subBtnSelectedIdx = -1;
  }
  /**
   * selectSubMenu 二级菜单点击选择
   * @params idx {number} 当前点击二级菜单的下标
   * @parmas firIdx {number} 当前点击的一级菜单下标
   */
  selectSubMenu (idx: number, firIdx: number) {
    this.subBtnSelectedIdx = idx
    this.currSelectButtonIdx = firIdx
  }
  /**
   * addFirstMenu 添加新的按钮
   * @params type {'father' | 'child'} 智能是这两个值之一 用于判断菜单名称
   * @parmas idx {number} 一级菜单下标
   */
  addMenu (type: 'father' | 'child', idx?: number) {
    let name:string = type === 'father' ? '新建菜单' : '子菜单';
    let newBtn:WechatMenuType;
    if (idx as number >= 0) {
      this.currSelectButtonIdx = idx as number;
    }
    // 如果加的是一级菜单
    if (type === 'father') {
      let len = this.btns.length + 1;
      newBtn = {
        name: `${name}${len}`,
        type: 'view',
        sub_button: [],
        btnTypeTxt: BTN_TYPE_C
      }
      this.btns.push(newBtn)
      // 重新设置聚焦
      this.currSelectButtonIdx = this.btns.length - 1;
      this.subBtnSelectedIdx = -1;
    }
    if (type === 'child') {
      let len = this.btns[this.currSelectButtonIdx].sub_button.length + 1;
      newBtn = {
        name: `${name}${len}`,
        sub_button: [],
        type: 'view',
        url: '',
        btnTypeTxt: BTN_TYPE_C
      }
      this.btns[this.currSelectButtonIdx].sub_button.push(newBtn);
      this.subBtnSelectedIdx = this.btns[this.currSelectButtonIdx].sub_button.length - 1;
      Object.keys(this.btns[this.currSelectButtonIdx]).includes('url') && delete this.btns[this.currSelectButtonIdx].url;
    }
    this.showLinkError = false;
  }
  /**
   * 删除菜单
   */
  deleteMenu () {
    // 当前选中的是一级菜单
    if(this.subBtnSelectedIdx === -1) {
      this.btns.splice(this.currSelectButtonIdx, 1);
      this.currSelectButtonIdx = this.btns.length - 1;
    } else {
      // 选中的二级菜单
      this.btns[this.currSelectButtonIdx].sub_button.splice(this.subBtnSelectedIdx, 1);
      this.subBtnSelectedIdx = this.btns[this.currSelectButtonIdx].sub_button.length -1;
      // @ts-ignore
      if (this.subBtnSelectedIdx === -1 && Object.keys(this.btnEdit).length) {
        // // @ts-ignore
        // this.btnEdit.type = 'view'
        // // @ts-ignore
        // this.btnEdit.btnTypeTxt = BTN_TYPE_C;
        // // @ts-ignore
        // this.btnEdit.url = ''
        let newBtn:WechatMenuType = {
          type: 'view',
          btnTypeTxt: BTN_TYPE_C,
          url: '',
          name: this.btns[this.currSelectButtonIdx].name,
          sub_button: []
        }
        this.$set(this.btns, this.currSelectButtonIdx,  newBtn)
      }
    }
    this.showLinkError = false;
  }
  /**
   * menuBtnsFormat 对请求回来的菜单数据进行格式化
   * @params datas { Array<WechatMenuType>} 需要处理的菜单原始数据
   */
  menuBtnsFormat (datas: Array<WechatMenuType>) {
    datas.map((data:WechatMenuType) => {
      if (Object.keys(data).includes('name')) {
        data.sub_button.map((sub: WechatMenuType) => {
          // 进行判断是否是view类型的 先判断是跳转文化云菜单 还是 直接自己填地址
          if (sub.type === 'view') {
            let idx = this.allBtns.findIndex(e => e.url === sub.url);
            sub.btnTypeTxt = idx > -1 ? BTN_TYPE_C : BTN_TYPE_LINK;
          }
        })
        if (data.type === 'view') {
          let idx = this.allBtns.findIndex(e => e.url === data.url);
          data.btnTypeTxt = idx > -1 ? BTN_TYPE_C : BTN_TYPE_LINK;
        }
        this.btns.push(data)
      }
    })
  }
  /**
   * checkChannel 选取栏目数据
   */
  checkChannel (url: string) {
    (this.btnEdit as any).url = url
    if (this.subBtnSelectedIdx === -1) {
      let curr = this.btns[this.currSelectButtonIdx]
      curr.url = url
      this.$set(this.btns, this.currSelectButtonIdx, curr)
    } else {
      let curr = this.btns[this.currSelectButtonIdx].sub_button[this.subBtnSelectedIdx];
      curr.url = url
      this.$set(this.btns[this.currSelectButtonIdx].sub_button, this.subBtnSelectedIdx, curr)
    }
  }
  created() {
    axios.all([getWechatConfigMenu(), getAllSiteChannel(), getSiteChannel()])
          .then(axios.spread((menuRes, allBtnsRes, btnsRes)=> {
            if (menuRes.code === 0 && allBtnsRes.code === 0 && btnsRes.code === 0) {
              this.cbtns = btnsRes.datas as Array<cbtnType>;
              this.allBtns = allBtnsRes.datas as Array<cbtnType>;
              if (Object.keys(menuRes.data).includes("menu")) {
                // this.btns = res.data.menu.button;
                this.menuBtnsFormat(menuRes.data.menu.button)
              } else {
                this.$Message.error(menuRes.data.errmsg);
              }
            }
          }))
  }
}
</script>

<style lang='scss' scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translate(1em, 1em);
}
.wechat-menu {
  padding: 20px 30px 80px;
  .tit {
    font-size: 14px;
  }
  .tit-tip {
    font-size: 14px;
  }
  .mobile-menu-preview {
    position: relative;
    width: 294px;
    height: 580px;
    background: transparent url(../../../assets/image/bg_mobile_head.png) no-repeat 0 0;
    background-position-x: 0px;
    background-position-y: 0px;
    background-size: contain;
    background-position: 0 0;
    border: 1px solid #e7e7eb;
  }
  .mobile-hd {
    color: #fff;
    text-align: center;
    padding-top: 30px;
    font-size: 15px;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    margin: 0 30px;
  }
  .pre-menu-list {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    height: 50px;
    border-top: 1px solid #e7e7eb;
    background: transparent url(../../../assets/image/bg_mobile_foot.png)
      no-repeat 0 0;
    background-position-x: 0px;
    background-position-y: 0px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-repeat: no-repeat;
    padding-left: 43px;
  }
  .pre-menu-item {
    position: relative;
    flex: 1;
    min-width: 33%;
    cursor: pointer;
    font-size: 14px;
    user-select: none;
    transition: all 0.2s linear;
    border: 1px solid transparent;
    border-left-color: #e7e7eb;
    &.no-extra {
      font-size: 22px;
      color: #8d8d8d;
      font-weight: bold;
    }
    &.curr {
      color: $theme;
      border-color: $theme;
      background-color: #fff;
    }
  }
  .pre-menu-name {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    max-width: 100%;
  }
  .sub-pre-menu-box {
    position: absolute;
    bottom: 60px;
    left: 0;
    width: 100%;
    border: 1px solid #d0d0d0;
    background-color: #fafafa;
    border-top-width: 0;
  }
  .sub-pre-menu-list {
    li:first-child {
      border-top: 1px solid #d0d0d0;
      .sub-pre-menu-item-name {
        border-top-width: 0;
      }
      &.curr{
        border-top-color:$theme;
      }
    }
  }
  .sub-pre-menu-item {
    text-align: center;
    line-height: 44px;
    padding: 0 0.5em;
    &:hover {
      background-color: #eee;
    }
    &.curr {
      background:#fff;
      border:1px solid $theme;
    }
  }
  .sub-pre-menu-item-name {
    border-top: 1px solid #e7e7eb;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    color: #616161;
    text-decoration: none;
  }
  .menu-preview-area {
    float: left;
    margin-right: 24px;
    position: relative;
  }
  .menu-setting-area {
    margin: 40px 40px 0;
    display: block;
    &::after {
      content: "\200B";
      display: block;
      height: 0;
      clear: both;
    }
  }
  .menu-form-area {
    display: table-cell;
    vertical-align: top;
    float: none;
    width: auto;
    max-width:800px;
    &::after {
      content: " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ";
      visibility: hidden;
      clear: both;
      height: 0 !important;
      display: block;
      line-height: 0;
    }
  }
  .menu-initial-tips {
    display: block;
    text-align: center;
    padding-top: 200px;
    color: #8d8d8d;
  }
  .protable-editor {
    min-height: 580px;
    padding: 0 20px 20px;
    padding-bottom: 5px;
    background-color: #f4f5f9;
    border: 1px solid #e7e7eb;
    border-radius: 0;
    -moz-border-radius: 0;
    -webkit-border-radius: 0;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
  }
  .menu-form-hd {
    display: flex;
    align-items: center;
    padding: 20px 10px 10px;
    border-bottom: 1px solid #e7e7eb;
    font-size: 14px;
  }
  .menu-form-hd-name {
    flex: 1;
  }
  .menu-form-bd {
  }
  .menu-form-bd-tip {
    padding-top: 10px;
    color: #8d8d8d;
  }
  .form-group {
    padding: 30px 10px 10px;
    font-size: 14px;
    &::after {
      content: "\200B";
      display: block;
      height: 0;
      clear: both;
    }
  }
  .form-label {
    float: left;
    width: 5em;
    margin-top: 0.3em;
    margin-right: 1em;
  }
  .form-controls {
    display: table-cell;
    vertical-align: top;
    float: none;
    width: auto;
    &::after {
      content: " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ";
      visibility: hidden;
      clear: both;
      height: 0 !important;
      display: block;
      line-height: 0;
    }
  }
  .form-tips,
  .form-msg {
    padding-top: 4px;
  }
  .form-tips {
    color: #8d8d8d;
  }
  .form-msg {
    overflow: hidden;
    &.fail {
      color: $danger;
    }
  }
  .form-ipt {
    max-width: 300px;
  }
  .menu-content-container {
    border: 1px solid transparent;
    &.error {
      border-color:$danger;
    }
  }
  .menu-content {
    padding: 16px 20px;
    border: 1px solid #e7e7eb;
    background-color: #fff;
  }
  .ctc-content {
    padding-left: 6em;
    font-size: 14px;
  }
  .form-btns {
    padding-top: 10px;
    font-size: 0;
  }
  .form-btn {
    display: inline-block;
    min-width: 7em;
    padding: 6px 15px;
    margin: 0 10px 10px 0;
    font-weight: normal;
    text-align: center;
    vertical-align: top;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    white-space: nowrap;
    line-height: 1.5;
    user-select: none;
    font-size: 12px;
    border-radius: 4px;
    background-color: #fff;
    border-color: #dcdee2;
    transition: color 0.2s linear, background-color 0.2s linear, border 0.2s linear, box-shadow 0.2s linear, -webkit-box-shadow 0.2s linear;
    &:hover {
      color: $theme-hover;
      border-color: $theme-hover;
    }
    &:active,
    &.active {
      color: $theme-active;
      border-color: $theme-active;
    }
    &:focus {
      box-shadow: 0 0 0 2px rgba(35, 161, 238, 0.2);
    }
    &.disabled {
      color: #ccc;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
  .form-link,
  .form-radio {
    margin-right: 8px;
  }
  .weapp-btn {
    padding-top: 16px;
  }
  .weapp-label {
    width: 7em;
    text-align: right;
  }
  .weapp-container {
    margin-bottom: 10px;
    .form-group {
      font-size: 12px;
      padding-top: 20px;
    }
  }
  .save-btn {
    position: absolute;
    left: 0;
    bottom: -60px;
  }
}
</style>
