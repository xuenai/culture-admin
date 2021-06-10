<template>
  <div class="custom">
    <div class="custom-setting-area">
      <!-- 模拟手机展示-->
      <div class="custom-preview-area">
        <div class="custom-menu-preview">
          <!-- 选择切换客户端 -->
          <div class="custom-menu-select">
            <Dropdown @on-click="dorpDownClick" trigger="click">
              {{clientTypeName}}
              <Icon type="ios-arrow-down"></Icon>
              <DropdownMenu slot="list">
                <DropdownItem name="ALL" :selected="clientType === 'ALL'">统一菜单栏</DropdownItem>
                <DropdownItem name="WEB" :selected="clientType === 'WEB'">微端</DropdownItem>
                <DropdownItem name="APP" :selected="clientType === 'APP'">APP</DropdownItem>
                <DropdownItem name="APPLET" :selected="clientType === 'APPLET'">小程序</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <!-- 顶部标题 -->
          <p class="custom-mobile-hd">{{siteName}}</p>
          <!-- 中间内容区域 -->
          <div class="custom-mobile-body">
            <!-- 顶部导航区域 -->
            <div>
              <p class="title">顶部导航菜单</p>
              <p class="tip">一排不超过5个菜单</p>
              <!-- 顶部菜单列表 -->
              <MobileMenu
                ref="Top"
                :clientType="clientType"
                :clientTypeName="clientTypeName"
                :newsClientType="newsClientType"
                :data="menuList"
              ></MobileMenu>
            </div>
            <!-- 运营专区 -->
            <div>
              <p class="title">运营互动资源位</p>
              <p class="tip">一排不超过4个菜单</p>
              <MobileOperation ref="Operation"></MobileOperation>
            </div>
          </div>
          <!-- 移动端底部导航 -->
          <div class="custom-mobile-footer">
            <MobileFooter
              ref="Footer"
              :clientType="clientType"
              :clientTypeName="clientTypeName"
              :newsClientType="newsClientType"
              :data="menuList"
            ></MobileFooter>
          </div>
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="custom-btns">
        <dropCode
          :value="$store.state.app.userInfo.h5Domain+'/#/index'"
          id="asda"
          position="top"
        >
          <span class="btn ivu-btn btn-gray">预览</span>
        </dropCode>
        <Button class="btn" type="success" @click="onSaveHandle">保存</Button>
        <!-- 和小电商逻辑不一样 不要取消或者关闭按钮 -->
        <!-- <Button class="btn btn-gray">取消</Button> -->
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import { AppModule } from "@store/modules/app";
import dropCode from "@components/DropCode/DropCode.vue";
import MobileFooter from "./footer.vue";
import MobileMenu from "./menu.vue";
import MobileOperation from "./operation.vue";
import axios from 'axios';


// 默认的底部菜单
const DEFAULT_BOTTOM = [
  {
    id: '',
    name: "首页",
    selectIcon: "https://file.geeker.com.cn/cultural-tourism-cloud-admin/1576219018362/index-active.png",
    unSelectIcon: "https://file.geeker.com.cn/cultural-tourism-cloud-admin/1576218893099/index.png",
    jumpType: 1,
    menuCode: "INDEX",
    externalLink: "",
    subList: []
  },
  {
    id: '',
    name: "我的",
    selectIcon: "https://file.geeker.com.cn/cultural-tourism-cloud-admin/1576219301362/me-active.png",
    unSelectIcon: "https://file.geeker.com.cn/cultural-tourism-cloud-admin/1576219279733/me.png",
    jumpType: 1,
    menuCode: "USER",
    externalLink: "",
    subList: []
  }
];

import {
  getMobileMenus,
  saveClientMenu,
  saveModuleConfig
} from "@service/setting";

@Component({
  components: {
    MobileFooter,
    MobileMenu,
    MobileOperation,
    dropCode
  }
})
export default class MobileSetting extends Vue {
  // 顶部菜单
  menuList: Array<any> = [];
  // 菜单类型
  clientType: string = "";
  // 上一次修改的菜单类型
  newsClientType: string = "";
  // 菜单类型名称
  clientTypeName: string = "";
  // 站点信息
  get siteName() {
    return AppModule.siteInfo.name;
  }
  @Watch("clientType")
  onClientTypeChange(val: "ALL" | "WEB" | "APP" | 'APPLET') {
    this.clientTypeName = {
      ALL: "统一菜单栏",
      WEB: "微端",
      APPLET: "小程序",
      APP: "APP"
    }[val];
  }
  /**
   * 顶部客户端类型点击
   */
  dorpDownClick(clientType: "ALL" | "WEB" | "APPLET" | "APP") {
    this.clientType = clientType;
  }
  /**
   * hideChildren 顶部菜单展示、底部菜单展示、运营专区展示 其余板块隐藏
   * @param type {string} 当前展示的组件位置 top 顶部菜单 operation 运营专区 bottom 底部菜单
   */
  hideChildren(type: "top" | "operation" | "bottom") {
    let Footer = this.$refs.Footer as any;
    let Operation = this.$refs.Operation as any;
    let Top = this.$refs.Top as any;
    switch (type) {
      case "top": {
        Operation.closeModal();
        Footer.closeModal();
        break;
      }
      case "operation": {
        Top.closeModal();
        Footer.closeModal();
        break;
      }
      case "bottom": {
        Top.closeModal();
        Operation.closeModal();
        break;
      }
      default:
        break;
    }
  }
  /**
   * onSaveHandle 保存操作
   */
  onSaveHandle() {
    let Footer = this.$refs.Footer as any;
    let menuListJson: Array<any> = this.menuList;

    let Operation = this.$refs.Operation as any;
    let operationJsonString = Operation.getOperation();

    if (this.clientType === "ALL") {
      menuListJson = [
        {
          clientType: "ALL",
          bottom: this.menuList[0].bottom,
          top: this.menuList[0].top
        }
      ];
    }
    AppModule.setAppFixedLoadingStatus(true);
    // 执行保存操作
    axios.all([
      saveClientMenu({ jsonDto: JSON.stringify(menuListJson) }),
      saveModuleConfig({ jsonDto: operationJsonString })
    ])
      .then(axios.spread((saveMenuRes: any, saveOperationRes: any) => {
        if (saveMenuRes.code === 0 && saveOperationRes.code === 0) {
          this.$Message.success("保存成功！");
        }
      }))
      .finally(() => {
        AppModule.setAppFixedLoadingStatus(false);
      })
  }
  created() {
    // 获取初始菜单
    getMobileMenus().then(res => {
      if (res.code === 0) {
        let { newsClientType, menuList } = res.data;
        menuList.map((menu:any) => {
          if(menu.bottom.length === 0) {
            menu.bottom = JSON.parse(JSON.stringify(DEFAULT_BOTTOM));
          }
          return menu;
        })

        this.clientType = newsClientType || 'ALL';
        this.newsClientType = newsClientType || 'ALL';
        this.menuList = menuList;
      }
    });
  }
}
</script>
<style lang="scss">
.custom-modal {
  position: absolute;
  left: 326px;
  &.custom-modal-top {
    top: 0;
  }
  &.custom-modal-footer {
    left: 350px;
    bottom: 0;
    .custom-modal-wrapper::before {
      bottom: 13px;
    }
  }
  &-wrapper {
    position: relative;
    width: 428px;
    padding: 15px 15px 10px;
    border: 1px solid $borderLight;
    border-radius: 6px;
    background: #f8f8f8;
    &::before {
      position: absolute;
      left: 1px;
      content: "";
      height: 10px;
      width: 10px;
      border: 1px solid $borderLight;
      background: #f8f8f8;
      transform: rotate(45deg) translateX(-100%);
      border-right: none;
      border-top: none;
      border-radius: 0 0 0 3px;
    }
  }
  &-title {
    color: #595961;
  }
  &-tip {
    padding: 5px 0;
    font-size: 12px;
    color: #999;
  }
  &-delete-btn {
    color: $theme;
    cursor: pointer;
    &:hover {
      color: $theme-hover;
    }
    &:active {
      color: $theme-active;
    }
  }
  &-con {
    padding: 15px 0;
    border-top: 1px solid $borderLight;
  }
  &-edit-tit {
    padding-bottom: 10px;
  }
  &-edit-btns {
  }
  &-edit-btn {
    display: inline-block;
    vertical-align: top;
    text-align: center;
    margin-right: 24px;
    p {
      padding: 0 0 5px;
    }
  }
  &-closebtn {
    position: absolute;
    right: -10px;
    top: -10px;
    height: 20px;
    width: 20px;
    font-size: 20px;
    color: #bcbcbc;
    transition: all 0.3s ease-in;
    line-height: 1;
    cursor: pointer;
    &:hover {
      color: #666;
      transform: rotate(180deg);
    }
  }
  &-icons-wrapper {
  }
  &-info {
    position: relative;
    padding-left: 8px;
    &-need {
      &::before {
        position: absolute;
        left: 0;
        top: 2px;
        content: "*";
        color: $theColor1;
      }
    }
    &-tip {
      margin-left: 8px;
      font-size: 12px;
      color: #999;
    }
  }
  .m-b12 {
    margin-bottom: 12px;
  }
  .text-gray {
    color: #999;
  }
  .font-small {
    font-size: 12px;
  }
  .p-t8 {
    padding-top: 8px;
  }
  &-upload-wrapper {
    width: 48px;
    height: 48px;
    margin-left: 8px;
    img {
      width: 44px;
      height: 44px;
    }
    .iconfont {
      font-size: 14px;
      color: #999;
    }
    .c-icon-cuowu {
      position: absolute;
      right: -6px;
      top: -6px;
      height: 12px;
      width: 12px;
      font-size: 12px;
      cursor: pointer;
      color: #bcbcbc;
      transition: all 0.3s ease-in;
      line-height: 1;
      &:hover {
        transform: rotate(180deg);
      }
    }
  }
  &-icons {
    padding: 12px 0 8px 8px;
    font-size: 0;
    border-bottom: 1px dashed $borderLight;
  }
  &-icon {
    vertical-align: top;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    margin: 0 8px 8px 0;
    background: #fff;
    border: 1px solid $borderLight;
    cursor: pointer;
    img {
      width: 44px;
      height: 44px;
    }
  }
}
</style>
<style lang='scss' scoped>
.custom {
  position: relative;
  &-setting-area {
    display: flex;
    flex-direction: column;
  }
  &-preview-area {
    height: calc(100vh - 264px);
    max-height: calc(100vh - 264px);
    min-height: calc(100vh - 264px);
    padding: 50px 0 230px;
    position: relative;
    overflow-y: scroll;
  }
  &-menu-preview {
    position: relative;
    width: 322px;
    min-height: 548px;
    margin-left: 90px;
    border: 1px solid #e7e7eb;
  }
  &-menu-select {
    line-height: 40px;
    cursor: pointer;
    .ivu-dropdown {
      display: block;
      text-align: center;
    }
  }
  &-mobile-hd {
    width: auto;
    height: 64px;
    padding: 32px 70px 10px;
    color: #fff;
    text-align: center;
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    background: transparent url(../../../../assets/image/bg_mobile_head.png)
      no-repeat 0 0;
    background-position-x: 0px;
    background-position-y: 0px;
    background-size: contain;
    background-position: 0 0;
  }
  &-mobile-body {
    padding: 24px 24px 80px;
    .title {
      font-size: 14px;
      color: #333;
      font-weight: bold;
      line-height: 16px;
    }
    .tip {
      padding: 5px 0 0;
      font-size: 12px;
      color: #999;
      line-height: 14px;
    }
  }
  &-mobile-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 54px;
    border-top: 1px solid $borderLight;
  }

  &-btns {
    padding: 40px 0 40px 90px;
    border-top: 1px solid $borderLight;
    .btn {
      margin-right: 12px;
    }
    .btn-gray {
      background: #f7f7f7;
      &:hover {
        background: #fff;
      }
    }
  }
}
</style>
