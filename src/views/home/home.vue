/*
 * @Author: Hexg 
 * @Date: 2019-07-15 14:39:17 
 * @Last Modified by: Hexg
 * @Last Modified time: 2020-03-25 22:29:20
 */
<template>
  <div class="page">
    <div class="header">
      <div class="header-left">
        <div v-if="!headLogo" class="logo-default" alt="文化旅游云"></div>
        <div v-else-if="isSite" class="logo-custom">
          <img :src="headLogo" alt />
        </div>
        <div v-else class="logo-custom-company">
          <img :src="headLogo" alt />
        </div>
        <p
          class="sitename"
          v-if="siteList.length && isSite"
        >{{siteList.length && siteList[currSiteIndex].name ? siteList[currSiteIndex].name : ''}}</p>
        <p class="sitename" v-else-if="appType === 'COMPANY'">{{companySiteName}}</p>
        <!-- 左侧站点列表 -->
        <Dropdown
          class="site-name-dropdown"
          trigger="click"
          @on-click="siteSelectHandle"
          v-if="siteList.length"
        >
          <a href="javascript:void(0);" class="site-change-btn cloud-icon">&#xe687;</a>
          <DropdownMenu slot="list">
            <div class="sitename-search">
              <Input
                class="sitename-search-ipt"
                suffix="ios-search"
                v-model="siteNameKeyword"
                placeholder="请输入关键字"
              />
            </div>
            <DropdownItem
              v-for="(site, idx) in sites"
              :key="site.id"
              :name="site.id"
              :selected="idx === currSiteIndex"
            >{{site.name}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <!-- 右侧消息提示 个人头像 -->
      <div class="header-right">
        <div class="notice" @click="msgListShow = true">
          <div class="cloud-icon">&#xe7a8;</div>
          <p class="num" v-if="messageCount && messageCount < 100">{{messageCount}}</p>
          <p class="num" v-else-if="messageCount > 99">99+</p>
        </div>
        <Dropdown trigger="click" @on-click="logoutHandle">
          <a href="javascript:void(0);" class="user">
            <div class="avator">
              <img src="@assets/image/home-avator.png" alt />
            </div>
            <p class="username">{{userInfo.name}}</p>
            <span class="cloud-icon">&#xe6af;</span>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="editpassword">修改密码</DropdownItem>
            <DropdownItem name="logout">退出</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="cloud-content">
      <aside class="sidebar">
        <nav class="first-menu">
          <div
            v-for="(item, index) in navList"
            :key="item.name"
            class="first-menu-item"
            :class="{active: index === navSelected.x}"
            @click="navClickHandle(index)"
          >
            <Icon :custom="`iconfont ${item.cron}`" />
            <i class="name">{{item.name}}</i>
            <span
              v-if="item.waitNum > 0"
              class="menu-label"
            >{{item.waitNum > 99 ? '99+' : item.waitNum}}</span>
          </div>
          <a
            href="javascript:void(0);"
            class="fixed-btn"
            v-if="isSite"
            @click.stop="backToElec"
          >返回应用中心</a>
        </nav>
      </aside>
      <section class="body">
        <nav class="bread-crumb">
          <span class="txt">你的位置：</span>
          <Breadcrumb separator="/" class="crumbs">
            <BreadcrumbItem
              v-for="(item, idx) in breadCrumb"
              :key="idx"
              v-if="item.url"
              :to="item.url"
            >{{item.name}}</BreadcrumbItem>
            <BreadcrumbItem :key="idx" v-else>{{item.name}}</BreadcrumbItem>
          </Breadcrumb>
        </nav>
        <div class="body-content">
          <div v-if="Object.keys(secNav).length && secNav.menuUrl">
            <nav
              class="second-menus"
              v-if="secNav.child.length && navSelected.y > -1 && secNav.child[navSelected.y].child.length"
            >
              <div
                v-for="(item,idx) in secNav.child[navSelected.y].child"
                :key="`${item.name}${idx}`"
              >
                <p
                  v-if="item.menuType === 'MENU_OPERATION'"
                  class="second-menu-item"
                  :class="{active: idx === navSelected.z}"
                  @click="thirdNavClick(navSelected.x, navSelected.y, idx, item.url)"
                >
                  <span class="menu-item-name">
                    {{item.name}}
                    <span
                      v-if="item.waitNum > 0"
                      class="menu-label"
                    >{{item.waitNum > 99 ? '99+' : item.waitNum}}</span>
                  </span>
                </p>
                <div class="has-children" v-else>
                  <p class="second-menu-name">{{item.name}}</p>
                  <p
                    v-for="(sub, i) in item.child"
                    :key="`sbchild${i}`"
                    class="second-menu-item"
                    :class="{active: i === navSelected.f && idx === navSelected.z}"
                    @click="fourthNavClick(navSelected.x,navSelected.y, idx, i, sub.url)"
                  >
                    <span class="menu-item-name">
                      {{sub.name}}
                      <span
                        v-if="sub.waitNum > 0"
                        class="menu-label"
                      >{{sub.waitNum > 99 ? '99+' : sub.waitNum}}</span>
                    </span>
                  </p>
                </div>
              </div>
            </nav>
            <div
              class="sub-page"
              :class="{'no-sidebar' : !(secNav.child.length && navSelected.y > -1 && secNav.child[navSelected.y].child.length)}"
            >
              <router-view v-if="isRouterAlive"></router-view>
              <Spin size="large" fix v-if="spinShow"></Spin>
            </div>
          </div>
          <div v-else>
            <nav class="second-menus" v-if="Object.keys(secNav).length && secNav.child.length">
              <div v-for="(item,idx) in secNav.child" :key="`${item.name}${idx}`">
                <p
                  v-if="item.menuType === 'MENU_OPERATION'"
                  class="second-menu-item"
                  :class="{active: idx === navSelected.y}"
                  @click="secNavClick(navSelected.x, idx, item.url)"
                >
                  <span class="menu-item-name">
                    {{item.name}}
                    <span
                      v-if="item.waitNum > 0"
                      class="menu-label"
                    >{{item.waitNum > 99 ? '99+' : item.waitNum}}</span>
                  </span>
                </p>
                <div class="has-children" v-else>
                  <p class="second-menu-name">{{item.name}}</p>
                  <p
                    v-for="(sub, i) in item.child"
                    :key="`sbchild${i}`"
                    class="second-menu-item"
                    :class="{active: i === navSelected.z && idx === navSelected.y}"
                    @click="thirdNavClick(navSelected.x, idx, i, sub.url)"
                  >
                    <span class="menu-item-name">
                      {{sub.name}}
                      <span
                        v-if="sub.waitNum > 0"
                        class="menu-label"
                      >{{sub.waitNum > 99 ? '99+' : sub.waitNum}}</span>
                    </span>
                  </p>
                </div>
              </div>
            </nav>
            <div
              class="sub-page"
              :class="{'no-sidebar' : (Object.keys(secNav).length && !secNav.child.length) || navSelected.x == -1}"
            >
              <router-view v-if="isRouterAlive"></router-view>
              <Spin size="large" fix v-if="spinShow"></Spin>
            </div>
          </div>
        </div>
      </section>
    </div>
    <transition name="fade">
      <div class="dropMsg" v-if="msgListShow">
        <div class="dropMsg-title">
          <h3>消息中心</h3>
          <i class="iconfont c-icon-guanbi fr" @click="msgListShow = false"></i>
        </div>
        <div class="dropMsg-content" v-if="msgList.length">
          <div
            class="dropMsg-content-item"
            v-for="(item) in msgList"
            :key="item.id"
            @click="openDetails(item)"
          >
            <h3 v-html="(item.resourceType) ? item.content : item.title"></h3>
            <p>{{item.createTime}}</p>
          </div>
        </div>
        <div class="dropMsg-content" v-else>
          <div class="dropMsg-content-noMsg">
            <span class="iconfont">&#xe6f6;</span>
            <span>暂时没有新最新通知</span>
          </div>
        </div>
        <div class="dropMsg-showMore" @click="toMsg">查看全部消息</div>
      </div>
    </transition>
    <!-- websocket全局消息通知 -->
    <template v-for="(msg,i) in msgDialogList">
      <transition appear name="animation" :key="msg.id">
        <MsgTip
          :key="msg.id"
          @close="msgDialogList.splice(i,1)"
          @closeAll="msgDialogList = []"
          :data="msg"
        ></MsgTip>
      </transition>
    </template>
    <!-- 修改密码弹窗 -->
    <PwdEdit v-model="showEditPwdModal"></PwdEdit>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import { AppModule, breadcrumbType } from "@store/modules/app";
import { logout } from "@service/app";
import { getMsgList, getMsgDetail } from "@service/common";
import CONFIG from "@util/config";
import MsgTip from "@views/home/msg-tip.vue";
import PwdEdit from "./pwd-edit.vue";
import { ModalConfig } from "iview/types";
import { getToPathByWsMsg, cookies } from "@util/util";
import {
  getOemConfig,
  getJkbBackUrl,
  getSiteInfoBySiteCode
} from "@service/app";
@Component({
  components: {
    MsgTip,
    PwdEdit
  }
})
export default class home extends Vue {
  // 左侧一级目录
  get navList() {
    return AppModule.nav;
  }
  // 左侧二级目录
  get secNav() {
    return AppModule.secNav;
  }
  // 面包屑
  get breadCrumb() {
    return AppModule.breadCrumb;
  }
  // 目录选中
  get navSelected() {
    return AppModule.navSelected;
  }
  // 站点目录选中
  get siteList() {
    return AppModule.siteList;
  }
  // 获取vuex中的用户信息
  get userInfo() {
    return AppModule.userInfo;
  }
  // 获取当前站点的下标
  get currSiteIndex() {
    return AppModule.currSiteIndex;
  }
  get fixedLoadingShow() {
    return AppModule.fixedLoadingShow;
  }
  get pageRefresh() {
    return AppModule.refresh;
  }
  get sites() {
    if (this.siteNameKeyword) {
      return AppModule.siteList.filter((e: any) =>
        e.name.includes(this.siteNameKeyword)
      );
    } else {
      return AppModule.siteList;
    }
  }
  @Watch("fixedLoadingShow", { immediate: true, deep: true })
  onFixedLoadingShowChange(val: boolean) {
    this.spinShow = val;
  }
  @Watch("pageRefresh", { immediate: true, deep: true })
  onPageRefreshChange(val: boolean) {
    if (val) {
      this.pageReload();
    }
  }
  appType = process.env.VUE_APP_STATUS;
  companySiteName = "";
  private isSite = process.env.VUE_APP_STATUS === "SITE";
  private spinShow = false;
  // router-view是否展示
  private isRouterAlive = true;
  // 消息信息
  private messageCount = 0;
  private msgWebSocket: any;
  private msgWebSocketResponseTime = new Date().getTime();
  private msgWebSocketIntervalTime = 0;
  private bubblesWebSocket: any;
  private bubblesWebSocketResponseTime = new Date().getTime();
  private bubblesWebSocketIntervalTime = 0;
  private socketHandles = <any>{
    SOCKET_TYPE_MSG_NOTIFY: this.msgRender, // 消息
    SOCKET_TYPE_MENU_HINT: this.renderAppMenu // 刷新菜单
  };
  private msgList: Array<any> = []; // 消息下拉列表
  private msgListShow = false; // 消息下拉框
  private msgDialogList: Array<any> = []; // 消息弹窗
  private showEditPwdModal = false;
  siteNameKeyword = "";
  // 跳转商户中心
  private backToElec() {
    if (!this.backUrl) {
      window.location.href = CONFIG.elecLoginUrl;
    } else {
      window.location.href = this.backUrl;
    }
  }
  // 左侧一级菜单点击
  private navClickHandle(index: number): void {
    this.firstMenuClick(index);
  }
  // 二级目录点击
  private secNavClick(x: number, y: number, path: string) {
    if (
      x === this.navSelected.x &&
      y === this.navSelected.y &&
      this.breadCrumb.length === 2
    ) {
      this.pageSelectReload();
    } else {
      AppModule.appMenuSelect({ x, y, z: -1, f: -1 });
      this.$router.push({ path });
    }
  }
  // 三级目录点击
  private thirdNavClick(x: number, y: number, z: number, path: string) {
    if (
      x === this.navSelected.x &&
      y === this.navSelected.y &&
      z === this.navSelected.z &&
      this.breadCrumb.length === 3
    ) {
      this.pageSelectReload();
    } else {
      AppModule.appMenuSelect({ x, y, z, f: -1 });
      this.$router.push({ path });
    }
  }
  // 四级目录点击
  private fourthNavClick(
    x: number,
    y: number,
    z: number,
    f: number,
    path: string
  ) {
    if (
      x === this.navSelected.x &&
      y === this.navSelected.y &&
      z === this.navSelected.z &&
      f === this.navSelected.f &&
      this.breadCrumb.length === 4
    ) {
      this.pageSelectReload();
    } else {
      AppModule.appMenuSelect({ x, y, z, f });
      this.$router.push({ path });
    }
  }
  // 登出操作
  private logoutHandle(name: string) {
    // 退出登录操作
    if (name === "logout") {
      let _this = this;
      let config: ModalConfig = {
        title: "操作提示",
        content: `是否确定退出登录?`,
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          _this.loginOut();
        }
      };
      this.$Modal.confirm(config);
    }
    // 修改密码弹窗
    if (name === "editpassword") {
      // 站点端跳转小电商页面
      if (process.env.VUE_APP_STATUS === "SITE") {
        window.location.href = CONFIG.elecLoginUrl + "business/uppwd";
      } else {
        this.showEditPwdModal = true;
      }
    }
  }
  // 登出
  private loginOut() {
    let params: any = {};
    if (process.env.VUE_APP_STATUS === "SITE") {
      params.sessionId = this.$cookies.get("sessionId");
    }
    logout(params).then(res => {
      if (res.code === 0) {
        AppModule.setAppToken("");
        this.$cookies.remove(`${process.env.VUE_APP_STATUS}_TOKEN`);
        this.$cookies.remove(`sessionId`);
        if (process.env.VUE_APP_STATUS === "SITE") {
          // window.location.href = CONFIG.elecLoginUrl + "login";
          let jkbBackUrl = this.$cookies.get("getJkbBackUrl");
          if (jkbBackUrl) {
            window.location.href = jkbBackUrl;
          } else {
            window.location.href = CONFIG.elecLoginUrl + "/login";
          }
        } else {
          this.$router.push("/login");
        }
      }
    });
  }
  // 站点选择点击
  private siteSelectHandle(id: number) {
    let _this = this;
    let idx = this.siteList.findIndex((e: any) => e.id == id);
    AppModule.appCurrSiteChange({
      idx,
      callback: function() {
        _this.pageReload(function() {
          AppModule.appMenuSelect({ x: 0, y: -1, z: -1, f: -1 });
          _this.$router.push({ path: "/" });
          // 清除消息
          _this.msgDialogList = [];
        });
      }
    });
  }
  pageSelectReload() {
    this.isRouterAlive = false;
    this.spinShow = true;
    this.$nextTick(() => {
      setTimeout(() => {
        this.isRouterAlive = true;
        this.spinShow = false;
      }, 600);
    });
  }
  // 刷新页面
  private pageReload(callback?: () => void) {
    this.WebSocket.close();
    this.isRouterAlive = false;
    this.spinShow = true;
    this.$nextTick(() => {
      callback && callback();
      setTimeout(() => {
        this.isRouterAlive = true;
        this.spinShow = false;
        this.createWebsocket();
        this.getMsgList();
        AppModule.pageRefresh(false);
      }, 600);
    });
  }
  // 一级菜单点击的时候 判断跳转路径
  private firstMenuClick(index: number) {
    // 如果点击的当前目录是 操作菜单 直接跳转对应的路由 如果不是操作菜单 则跳转下级的第一个操作菜单的路由
    let { navList } = this;
    if (!navList.length) {
      return false;
    }
    let menu = navList[index] as any;
    if (menu.menuUrl) {
      this.goPath(menu.menuUrl, index);
      return false;
    }
    if (menu.menuType === "MENU_OPERATION") {
      this.goPath(menu.url, index);
      return false;
    }
    let { child } = menu;
    // 存在二级菜单
    if (child.length) {
      for (var i = 0; i < child.length; i++) {
        let childMenu = child[i];
        if (childMenu.menuType === "MENU_OPERATION") {
          this.goPath(childMenu.url, index);
          break;
        }
        // 存在三级菜单
        if (childMenu.child.length) {
          if (childMenu.child[0].menuType === "MENU_OPERATION") {
            this.goPath(childMenu.child[0].url, index);
            return false;
          }
        }
      }
    }
  }
  /**
   * 跳转新路径 判断新路径是不是和当前的一致 一致不跳转
   */
  private goPath(newPath: string, index: number) {
    let { path } = this.$route;
    if (newPath === path) {
      return false;
    }
    AppModule.appMenuSelect({ x: index, y: -1, z: -1, f: -1 });
    this.$router.push({ path: newPath });
  }
  // 查看消息对应的详情页
  private openDetails(data: any) {
    let path = getToPathByWsMsg(data);
    this.$router.push({
      path
    });
    getMsgDetail({ id: data.id });
    this.msgListShow = false;
  }
  private toMsg() {
    this.msgListShow = false;
    this.$router.push({ path: "/sys-msg" });
  }
  /* S websocket全局消息通知 */
  private socketDataRender(data: any) {
    console.log("websocket接收到", data);
    data &&
      this.socketHandles[data.socketType] &&
      this.socketHandles[data.socketType](data);
  }
  // 处理消息
  private msgRender(data: any) {
    if (data.code === 0) {
      this.messageCount = data.page && data.page.total;
    }
    if (data.data && data.data.length) {
      this.msgDialogList.push(data.data[0]);
      this.msgList = data.data;
    } else if (data.datas) {
      this.msgList = data.datas;
    }
  }
  // 获取消息数量
  private getMsgList() {
    getMsgList({ readStatus: 0, pageSize: 3 }).then((res: any) => {
      this.msgRender(res);
    });
  }
  /* E websocket全局消息通知 */

  // appmenu
  private renderAppMenu() {
    AppModule.getAppMenu();
  }
  /**
   * @description: 初始化Websocket连接
   * @param {string} name 对应存存储websocket对象的变量名字
   * @param {string} url 长连接地址
   * @param {function} callback 长连接返回消息时的回调
   * @return: void
   */
  private initWebsocket(
    name: string,
    url: string,
    callback: (res: any) => void
  ) {
    try {
      this[name] = new WebSocket(
        `ws://${url}?token=${this.$store.state.app.token}`
      );
    } catch (error) {
      console.log(error);
      return;
    }
    this[name].onmessage = function(res: any) {
      this[`${name}ResponseTime`] = res.resonseTime;
      callback && callback(JSON.parse(res.data));
    };
    // 对长连接 进行守护 如果超过2分钟未接收消息 则重新连接长链
    let _this = this;
    clearInterval(_this[`${name}IntervalTime`]);
    _this[`${name}IntervalTime`] = setInterval(() => {
      let time = _this[`${name}ResponseTime`];
      if (time && new Date().getTime() - time > 2 * 60 * 1000) {
        _this.initWebsocket(name, url, callback);
      }
    }, 10 * 1000);
  }
  // 创建链接
  createWebsocket() {
    this.initWebsocket("WebSocket", CONFIG.websocketUrl, (data: any) => {
      this.socketDataRender(data);
    });
  }

  headLogo = "";
  backUrl = "";
  getOemInfo() {
    // 获取商户中心logo
    getOemConfig().then(res => {
      if (res.code === 0) {
        if (res.data.pc.headLogo) {
          this.headLogo = res.data.pc.headLogo;
          if (res.data.pc.icon) {
            this.addLinkElement(res.data.pc.icon);
          } else {
            this.addLinkElement();
          }
        }
      }
    });
    // 返回商户中心的url
    getJkbBackUrl().then(res => {
      if (res.code === 0) {
        if (Object.keys(res.data).length) {
          this.backUrl = res.data.url;
          cookies.set("getJkbBackUrl", res.data.url);
        }
      }
    });
  }
  addLinkElement(src?: string) {
    let link = (document.querySelector("link[rel*='icon']") ||
      document.createElement("link")) as HTMLLinkElement;
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    let href =
      "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1582805002396/favicon.ico";
    if (src) {
      href = src;
    }
    link.href = href;
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  mounted() {
    this.getMsgList();
    this.renderAppMenu();
    this.createWebsocket();

    if (this.isSite) {
      this.getOemInfo();
    } else if (process.env.VUE_APP_STATUS === "COMPANY") {
      getSiteInfoBySiteCode().then(res => {
        if (res.code === 0) {
          this.companySiteName = res.data.name;
          this.headLogo = res.data.siteLogo;
          this.addLinkElement(res.data.siteLogo);
        }
      });
    } else {
      this.addLinkElement();
    }
  }
}
</script>

<style lang='scss' scoped>
.site-name-dropdown {
  .ivu-dropdown-menu {
    padding-top: 64px;
    max-height: 500px;
    overflow-y: scroll;

    .sitename-search {
      position: absolute;
      left: 0;
      top: 0;
      padding: 16px;
      background: #fff;
      width: 100%;
    }
  }
}

/* 定义动画S */
@-webkit-keyframes hinge {
  0% {
    -webkit-transform-origin: top left;
    transform-origin: top left;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
  }

  20%,
  60% {
    -webkit-transform: rotate(80deg);
    transform: rotate(80deg);
    -webkit-transform-origin: top left;
    transform-origin: top left;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
  }

  40%,
  80% {
    -webkit-transform: rotate(60deg);
    transform: rotate(60deg);
    -webkit-transform-origin: top left;
    transform-origin: top left;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
    opacity: 1;
  }

  to {
    -webkit-transform: translate3d(0, 700px, 0);
    transform: translate3d(0, 700px, 0);
    opacity: 0;
  }
}

@keyframes hinge {
  0% {
    -webkit-transform-origin: top left;
    transform-origin: top left;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
  }

  20%,
  60% {
    -webkit-transform: rotate(80deg);
    transform: rotate(80deg);
    -webkit-transform-origin: top left;
    transform-origin: top left;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
  }

  40%,
  80% {
    -webkit-transform: rotate(60deg);
    transform: rotate(60deg);
    -webkit-transform-origin: top left;
    transform-origin: top left;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
    opacity: 1;
  }

  to {
    -webkit-transform: translate3d(0, 700px, 0);
    transform: translate3d(0, 700px, 0);
    opacity: 0;
  }
}

.animation-leave-active {
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: hinge;
  animation-name: hinge;
}

@-webkit-keyframes zoomInDown {
  0% {
    opacity: 0;
    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  60% {
    opacity: 1;
    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
}

@keyframes zoomInDown {
  0% {
    opacity: 0;
    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  60% {
    opacity: 1;
    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
}

.animation-enter-active {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-name: zoomInDown;
  animation-name: zoomInDown;
}
/* 定义动画E */

.page {
  position: relative;
  height: 100vh;
  width: 100%;
  background: $grayDark;
  overflow: hidden;
  .header {
    display: flex;
    align-items: center;
    height: 60px;
    background: $theme;
  }
  .logo-default {
    width: 179px;
    min-width: 179px;
    height: 24px;
    margin: 0 10px 0 20px;
    background: url(../../assets/image/logo.png) no-repeat center center/100%
      100%;
  }
  .logo-custom {
    width: 123px;
    height: 32px;
    margin: 0 10px 0 20px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .logo-custom-company {
    margin: 0 10px 0 20px;
    height: 40px;
    width: 40px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .sitename {
    height: 20px;
    line-height: 20px;
    padding: 0 10px;
    font-size: 16px;
    color: #fff;
    border-left: 1px solid #fff;
  }
  .site-change-btn {
    display: inline-flex;
    height: 22px;
    width: 40px;
    min-width: 40px;
    align-items: center;
    justify-content: center;
    color: $theme;
    background: #fff;
    border-radius: 11px;
    cursor: pointer;
  }
  .header-left {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .header-right {
    display: flex;
    margin-right: 40px;
    align-items: center;
    .notice {
      display: flex;
      align-items: center;
      height: 24px;
      margin-right: 28px;
      cursor: pointer;
      .cloud-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        font-size: 24px;
        color: #fff;
      }
      .num {
        position: relative;
        padding: 0 8px;
        height: 20px;
        margin-left: -8px;
        margin-top: -14px;
        border-radius: 10px;
        line-height: 20px;
        background: $theColor1;
        color: #fff;
      }
    }
    .user {
      display: flex;
      align-items: center;
      color: #fff;
      cursor: pointer;
      .avator {
        height: 26px;
        width: 26px;
        margin-right: 10px;
        font-size: 0;
        img {
          width: 100%;
          height: 100%;
          vertical-align: top;
        }
      }
      .username {
        margin-right: 4px;
      }
    }
  }
  .cloud-content {
    position: relative;
    min-height: calc(100vh - 60px);
  }
  .sidebar {
    position: absolute;
    width: 120px;
    height: 100%;
    background: $frameBg;
  }
  .first-menu {
  }
  .fixed-btn {
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
    padding-left: 0;
    text-align: center;
    background: #404d61;
    color: #94a1b5;
    &:hover {
      background: #58677e;
      color: #b6c7d9;
    }
  }
  .first-menu-item {
    display: block;
    height: 36px;
    margin: 15px 0;
    padding-left: 16px;
    line-height: 36px;
    font-size: 14px;
    color: #90a0b9;
    cursor: pointer;
    font-weight: normal !important;
    .name {
      padding-left: 7px;
      font-style: normal;
    }
    /* &.router-link-active, */
    &.active {
      color: #fff;
      background: $theme;
      &:hover {
        color: #fff;
        background: $theme;
      }
    }
    &:hover {
      background: #3c4b61;
    }
  }
  .body {
    position: relative;
    height: calc(100vh - 60px);
    margin-left: 120px;

    &-content {
      position: relative;
      height: calc(100vh - 142px);
      margin: 15px;
      overflow: auto;
      box-sizing: border-box;
    }
    .sub-page {
      position: relative;
      min-height: calc(100vh - 142px);
      margin-left: 150px;
      background: #fff;

      &.no-sidebar {
        margin-left: 0;
      }
    }
  }
  .bread-crumb {
    height: 52px;
    padding-left: 30px;
    line-height: 52px;
    background: #fff;
    border-bottom: 1px solid #eaeaea;
    font-size: 14px;
    .crumbs {
      display: inline-block;
    }
  }
  .second-menus {
    position: fixed;
    left: 120px;
    top: 112px;
    width: 150px;
    height: calc(100vh - 112px);
    padding: 12px 12px 0;
    font-size: 12px;
    background: #fff;
    overflow-y: auto;
  }
  .has-children {
    margin-bottom: 12px;
    border-bottom: 1px solid #eaeaea;
    border-top: 1px solid #eaeaea;
    .second-menu-item {
      font-weight: normal !important;
    }
  }
  .second-menu-name {
    padding: 18px 0 12px 10px;
    line-height: 18px;
    font-weight: 700;
  }
  .second-menu-item {
    display: block;
    height: 36px;
    margin-bottom: 12px;
    padding-left: 10px;
    border-radius: 4px;
    line-height: 36px;
    font-weight: 700;
    color: #515a6e;
    cursor: pointer;
    &:hover {
      color: $theme;
    }
    &.active,
    &.router-link-active {
      background: #dadce3;
      &:hover {
        background: #dadce3;
      }
    }
  }
  .menu-label {
    display: inline-block;
    height: 16px;
    padding: 0 8px;
    margin-left: 8px;
    border-radius: 8px;
    line-height: 16px;
    font-size: 10px;
    color: #fff;
    background: $danger;
  }
  .menu-item-name {
    position: relative;
    .menu-label {
      position: absolute;
      right: -4px;
      top: 50%;
      transform: translate(100%, -50%);
    }
  }
}
.dropMsg {
  position: fixed;
  top: 60px;
  right: 0;
  width: 300px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  background-color: $bg01;
  z-index: 2;
  &-title {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    align-items: center;
    height: 50px;
    h3 {
      font-size: 14px;
      font-weight: bold;
    }
    i {
      margin-top: -2px;
      font-size: 12px;
      transition: 0.3s;
      color: #8ba0b3;
      cursor: pointer;
      &:hover {
        transform: rotate(180deg);
        text-shadow: 0 0 1px #666;
      }
    }
  }
  &-content {
    border-top: 1px solid $borderLight;
    border-bottom: 1px solid $borderLight;
    &-item {
      padding: 20px 0;
      margin: 0 25px;
      border-bottom: 1px solid $borderLight;
      cursor: pointer;
      h3 {
        font-size: 14px;
      }
      p {
        margin-top: 8px;
        font-size: 12px;
        color: $lightGray;
      }
      &:hover {
        color: $theme;
        p {
          color: $theme;
        }
      }
      &:last-child {
        border: none;
      }
    }
    &-noMsg {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 30px;
      .iconfont {
        font-size: 54px;
      }
    }
  }
  &-showMore {
    text-align: center;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    &:hover {
      color: $theme;
    }
  }
}
</style>
