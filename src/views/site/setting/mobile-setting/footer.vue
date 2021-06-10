<template>
  <div>
    <ul class="footer-btns" :class="{active: modal}">
      <li
        class="footer-btn"
        v-for="(btn, idx) in btns"
        :key="idx"
        @click="selectBtn(idx)"
        :class="{active: selectIdx === idx}"
        draggable="true"
        v-dragging="{ list: btns, item: btn, group: 'footer-btns' }"
      >
        <p class="footer-icon" :class="{'no-img': !btn.unSelectIcon}">
          <img v-if="btn.unSelectIcon" :src="btn.unSelectIcon" />
        </p>
        <p class="footer-name">{{btn.name}}</p>
      </li>
      <li class="footer-btn footer-add-btn" @click.stop="addBtnClick" v-if="btns.length < 5">
        <span class="iconfont c-icon-untitled44"></span>
      </li>
    </ul>
    <!-- 编辑底部按钮弹窗 -->
    <transition name="fade">
      <div class="custom-modal custom-modal-footer" v-if="modal">
        <div class="custom-modal-wrapper">
          <div
            class="iconfont c-icon-cuowu custom-modal-closebtn"
            v-if="closeBtnShow"
            @click.stop="closeModal"
          ></div>
          <!-- 点击菜单栏第一次出现的弹窗 -->
          <div v-if="modalStep === 0">
            <h3 class="custom-modal-title">底部菜单栏【{{clientTypeName}}】</h3>
            <p class="custom-modal-tip">屏幕底部菜单栏</p>
            <div class="custom-modal-con">
              <p class="custom-modal-edit-tit">统一菜单栏</p>
              <Button type="success" ghost size="small" @click="changeClient('ALL')">编辑</Button>
            </div>
            <div class="custom-modal-con">
              <p class="custom-modal-edit-tit">各端单独配置菜单栏</p>
              <div class="custom-modal-edit-btns">
                <div class="custom-modal-edit-btn">
                  <p>微端</p>
                  <Button type="success" ghost size="small" @click.stop="changeClient('WEB')">编辑</Button>
                </div>
                <div class="custom-modal-edit-btn">
                  <p>APP</p>
                  <Button type="success" ghost size="small" @click.stop="changeClient('APP')">编辑</Button>
                </div>
                <div class="custom-modal-edit-btn">
                  <p>小程序</p>
                  <Button type="success" ghost size="small" @click.stop="changeClient('APPLET')">编辑</Button>
                </div>
              </div>
            </div>
          </div>
          <!-- 点击菜单栏弹出层编辑新的弹窗 -->
          <div v-if="modalStep === 1">
            <h3 class="custom-modal-title">菜单栏编辑【{{clientTypeName}}】</h3>
            <p class="custom-modal-tip">
              最多可创建5个菜单，最少2个菜单！
              <span class="custom-modal-delete-btn" @click="deleteMenu">删除此菜单</span>
            </p>
            <div class="custom-modal-con">
              <div class="custom-modal-icons-wrapper m-b12">
                <div class="custom-modal-info custom-modal-info-need">图标：</div>
                <p class="text-gray font-small" style="margin-left:8px;">选择图标快速设置，或者自定义上传图标</p>
                <div class="custom-modal-icons m-b12">
                  <div
                    class="custom-modal-icon"
                    v-for="(icon, index) in defaultIcons"
                    :key="index"
                    @click="selectIcon(icon)"
                  >
                    <img :src="icon.normal" alt />
                  </div>
                </div>
                <div class="custom-modal-info m-b12">
                  默认图片
                  <span class="custom-modal-info-tip">图片宽高比为1:1,格式为PNG</span>
                </div>
                <div class="custom-modal-upload-wrapper m-b12">
                  <MobileSettingUpload v-model="selectedBtn.unSelectIcon" borderStyle="dashed"></MobileSettingUpload>
                </div>
                <div class="custom-modal-info m-b12">
                  选中图片
                  <span class="custom-modal-info-tip">图片宽高比为1:1,格式为PNG</span>
                </div>
                <div class="custom-modal-upload-wrapper">
                  <MobileSettingUpload v-model="selectedBtn.selectIcon" borderStyle="dashed"></MobileSettingUpload>
                </div>
              </div>
              <div class="custom-modal-info custom-modal-info-need m-b12">菜单名称：</div>
              <div class="custom-modal-info m-b12">
                <Input placeholder="请输入菜单名" :maxlength="4" v-model="selectedBtn.name" />
                <p class="text-gray font-small p-t8">最多4个字</p>
              </div>
              <div class="custom-modal-info custom-modal-info-need m-b12">点击跳转：</div>
              <div class="custom-modal-info m-b12">
                <Select v-model="selectedBtn.menuCode" @on-change="menuCodeChange">
                  <Option
                    v-for="jump in jumpList"
                    :key="jump.menuCode"
                    :value="jump.menuCode"
                    v-if="!jump.notMenu"
                  >{{jump.name}}</Option>
                </Select>
              </div>
              <div class="custom-modal-info" v-if="selectedBtn.jumpType === 2">
                <Input placeholder="请输入跳转地址" v-model="selectedBtn.externalLink" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import MobileSettingUpload from "./pic-cropper.vue";
import { MENU_JUMPLIST } from "@constant/index";
import { AppModule } from "@store/modules/app";

let icons = [
  {
    normal:
      "https://file.geeker.com.cn/cultural-tourism-cloud-admin/1576218893099/index.png",
    active:
      "https://file.geeker.com.cn/cultural-tourism-cloud-admin/1576219018362/index-active.png"
  },
  {
    normal:
      "https://file.geeker.com.cn/cultural-tourism-cloud-admin/1576219053313/activity.png",
    active:
      "https://file.geeker.com.cn/cultural-tourism-cloud-admin/1576219141794/activity-active.png"
  },
  {
    normal:
      "https://file.geeker.com.cn/cultural-tourism-cloud-admin/1576219163984/time.png",
    active:
      "https://file.geeker.com.cn/cultural-tourism-cloud-admin/1576219186603/time-active.png"
  },
  {
    normal:
      "https://file.geeker.com.cn/cultural-tourism-cloud-admin/1576219216996/shop.png",
    active:
      "https://file.geeker.com.cn/cultural-tourism-cloud-admin/1576219254581/shop-active.png"
  },
  {
    normal:
      "https://file.geeker.com.cn/cultural-tourism-cloud-admin/1576219279733/me.png",
    active:
      "https://file.geeker.com.cn/cultural-tourism-cloud-admin/1576219301362/me-active.png"
  }
];

// 跳转类型 1 站内详情跳转 2 站内外部链接 3 站内详情页跳转

@Component({
  components: {
    MobileSettingUpload
  }
})
export default class MobileFooter extends Vue {
  @Prop() data!: Array<any>;
  @Prop() clientTypeName!: string;
  @Prop() clientType!: string;
  @Prop() newsClientType!: string;
  // 默认图标
  defaultIcons = icons;
  // 关闭按钮
  closeBtnShow = false;
  // 弹窗是否展示
  modal = false;
  // 弹窗第几步了
  modalStep = 0;
  // 按钮列表
  btns: Array<any> = [];
  // 选中的下标(-1为未选中)
  selectIdx = -1;
  // 选中的菜单
  selectedBtn: any = {
    externalLink: "",
    id: "",
    // 跳转类型 1 站内非详情跳转  2 外部链接  3 站内详情页跳转
    jumpType: "",
    menuCode: "",
    name: "",
    selectIcon: "",
    unSelectIcon: "",
  };
  // 点击跳转列表
  get jumpList ():Array<any> {
    if (AppModule.siteInfo.shopCode && AppModule.siteInfo.shopUrl && AppModule.siteInfo.shopName) {
      return MENU_JUMPLIST
    } else {
      return MENU_JUMPLIST.filter((menu: any) => menu.menuCode !== 'MALL' && menu.menuCode !== 'MALL_DETAIL')
    }
  }
  /**
   * 监听类型变化
   */
  @Watch("clientType")
  onDataChange(val: string, oldVal: string) {
    // 先判断是不是第一次进入页面
    this.initBtns(val);
  }
  // 监听选中下标变化
  @Watch("selectIdx")
  onSelectIdxChange(val: number) {
    if (val === -1) {
      this.selectedBtn = {
        externalLink: "",
        id: "",
        jumpType: "",
        menuCode: "",
        name: "",
        selectIcon: "",
        unSelectIcon: "",
      };
    } else {
      this.selectedBtn = this.btns[val];
    }
  }
  /**默认图标选择 */
  selectIcon(item: any) {
    this.selectedBtn.selectIcon = item.active;
    this.selectedBtn.unSelectIcon = item.normal;
  }
  /**
   * 初始化btns
   */
  initBtns(clientType: string) {
    // 判断上次是不是统一编辑
    if (clientType === "ALL") {
      // 上一次是统一编辑 取数组第一项
      this.btns = this.data[0].bottom;
    } else {
      this.btns = this.data.filter(
        (btn: any) => btn.clientType === clientType
      )[0].bottom;
    }
  }
  /**
   * 选择编辑（统一菜单栏、微端、app、小程序）
   */
  changeClient(clientType: string) {
    this.modalStep = 1;
    this.closeBtnShow = true;
    if (clientType !== this.newsClientType) {
      this.$parent.clientType = clientType;
    }
  }
  /**
   * closeModal 关闭蒙层
   */
  closeModal() {
    this.selectIdx = -1;
    this.closeBtnShow = false;
    this.modalStep = 0;
    this.modal = false;
  }
  /**
   * 点击增加按钮
   */
  addBtnClick() {
    this.btns.push({
      externalLink: "",
      id: "",
      jumpType: "",
      menuCode: "",
      name: "菜单名",
      selectIcon: "",
      unSelectIcon: "",
    });
    this.selectBtn(this.btns.length - 1);
  }
  /**
   * selectBtn 选中某个按钮
   */
  selectBtn(idx: number) {
    this.selectIdx = idx;
    if (this.modalStep !== 1) {
      this.showModalFirstStep();
    }
  }
  /**
   * 蒙层初展示
   */
  showModalFirstStep() {
    this.$parent.hideChildren("bottom");
    this.closeBtnShow = false;
    this.modal = true;
    this.modalStep = 0;
  }
  /**
   * editMenu 点击编辑
   * @params type {sting} 编辑的类型 统一：ALL 微端：WEB 小程序：APPLET APP：APP
   */
  editMenu(type: string) {
    this.modalStep = 1;
    this.closeBtnShow = true;
  }
  /**删除此菜单 */
  deleteMenu() {
    if(this.btns.length <= 2) {
      this.$Message.error("底部菜单最少2个！");
      return false;
    }
    this.btns.splice(this.selectIdx, 1);
    this.selectIdx = this.btns.length - 1;
  }
  /**跳转地址选择框改变 */
  menuCodeChange(menuCode: string) {
    let item = this.jumpList.find((item: any) => item.menuCode === menuCode);
    this.selectedBtn.jumpType = item ? item.jumpType : '';
  }
}
</script>

<style lang='scss' scoped>
.footer-btns {
  overflow: hidden;
  display: flex;
  border: 1px dotted transparent;
  transition: all 0.3s ease-in;
  &.active {
    border-color: $theme;
  }
}
.footer-btn {
  flex: 1;
  height: 52px;
  padding-top: 10px;
  text-align: center;
  cursor: pointer;
  border: 1px dotted transparent;
  transition: all 0.3s ease-in;
  border-top: none;
  border-bottom: none;
  &.active {
    border-color: $theme;
  }
  &.footer-add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    padding-top: 0;
    &:hover {
      color: #666;
    }
  }
}
.footer-icon {
  height: 22px;
  width: 22px;
  margin: 0 auto;
  font-size: 0;
  &.no-img {
    background: $grayDark;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
.footer-name {
  font-size: 12px;
  color: #a8b4ba;
  line-height: 18px;
}
</style>
