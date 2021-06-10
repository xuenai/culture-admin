<template>
  <div class="top-menu-wrapper">
    <ul class="top-menu">
      <li
        class="top-item"
        v-for="(btn, idx) in btns"
        :key="idx"
        @click="selectBtn(idx)"
        :class="{active: selectIdx === idx}"
        draggable="true"
        v-dragging="{ list: btns, item: btn, group: 'menu-btns' }"
      >
        <p class="top-item-img" :class="{'no-img': !btn.unSelectIcon}">
          <img v-if="btn.unSelectIcon" :src="btn.unSelectIcon" />
        </p>
        <p class="top-item-name">{{btn.name}}</p>
      </li>
      <li class="top-item top-item-add" @click.stop="addBtnClick">
        <span class="iconfont c-icon-untitled44"></span>
      </li>
    </ul>
    <!-- 二级菜单 -->
    <p
      style="font-size:12px;color:#999;padding:16px 0 0;"
      v-if="selectIdx > -1 && btns[selectIdx].subList.length"
    >二级菜单</p>
    <ul class="top-menu" v-if="selectIdx > -1">
      <li
        class="top-item"
        v-for="(btn, idy) in btns[selectIdx].subList"
        :key="idy"
        @click="selectSecondBtn(idy)"
        :class="{active: selectIdy === idy}"
        draggable="true"
        v-dragging="{ list: btns[selectIdx].subList, item: btn, group: 'menu-subbtns' }"
      >
        <p class="top-item-img" :class="{'no-img': !btn.unSelectIcon}">
          <img v-if="btn.unSelectIcon" :src="btn.unSelectIcon" />
        </p>
        <p class="top-item-name">{{btn.name}}</p>
      </li>
    </ul>
    <!-- 编辑底部按钮弹窗 -->
    <transition name="fade">
      <div class="custom-modal custom-modal-top" v-if="modal" style="top:-35px;">
        <div class="custom-modal-wrapper">
          <div
            class="iconfont c-icon-cuowu custom-modal-closebtn"
            v-if="closeBtnShow"
            @click.stop="closeModal"
          ></div>
          <!-- 点击菜单栏第一次出现的弹窗 -->
          <div v-if="modalStep === 0">
            <h3 class="custom-modal-title">顶部导航菜单【{{clientTypeName}}】</h3>
            <p class="custom-modal-tip"></p>
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
            <h3 class="custom-modal-title">
              菜单栏编辑【{{clientTypeName}}】
              <span
                class="custom-modal-delete-btn"
                @click="deleteMenu"
                style="float:right;font-size:12px;font-weight:normal;"
              >删除此菜单</span>
            </h3>
            <p class="custom-modal-tip"></p>
            <div class="custom-modal-con">
              <p>菜单层级</p>
              <!-- <p class="text-gray font-small">选择二级菜单后一定要选择父级菜单，否则会保存为一级菜单</p>
              <p class="text-gray font-small m-b12">如果当前菜单有二级菜单，保存为二级菜单后，子菜单会被清空</p> -->
              <div>
                <button
                  class="btn"
                  :class="{active: selectedBtn.level === 1}"
                  @click="changeBtnLevel(1)"
                >
                  <span>一级菜单</span>
                </button>
                <!-- <button
                  class="btn"
                  :class="{active: selectedBtn.level === 2}"
                  @click="changeBtnLevel(2)"
                >
                  <span>二级菜单</span>
                </button> -->
              </div>
            </div>
            <div class="custom-modal-con">
              <div class="custom-modal-icons-wrapper m-b12">
                <div class="custom-modal-info custom-modal-info-need">图标：</div>
                <p class="text-gray font-small" style="margin-left:8px;">选择图标快速设置，或者自定义上传图标</p>
                <div class="custom-modal-icons m-b12">
                  <div
                    class="custom-modal-icon"
                    v-for="icon in defaultIcons"
                    :key="icon"
                    @click="selectIcon(icon)"
                  >
                    <img :src="icon" alt />
                  </div>
                </div>
                <div class="custom-modal-info m-b12">
                  默认图片
                  <span class="custom-modal-info-tip">图片宽高比为1:1,格式为PNG</span>
                </div>
                <div class="custom-modal-upload-wrapper m-b12">
                  <MobileSettingUpload v-model="selectedBtn.unSelectIcon" borderStyle="dashed" :needCut="false"></MobileSettingUpload>
                </div>
                <div class="custom-modal-info m-b12">
                  选中图片
                  <span class="custom-modal-info-tip">图片宽高比为1:1,格式为PNG</span>
                </div>
                <div class="custom-modal-upload-wrapper">
                  <MobileSettingUpload v-model="selectedBtn.selectIcon" borderStyle="dashed" :needCut="false"></MobileSettingUpload>
                </div>
              </div>
              <div
                class="custom-modal-info custom-modal-info-need m-b12"
                v-if="selectedBtn.level === 2"
              >父级菜单：</div>
              <div class="custom-modal-info m-b12" v-if="selectedBtn.level === 2">
                <Select v-model="selectedBtn.fatherUuid" @on-change="fatherUuidChange">
                  <Option v-for="btn in fathersBtns" :key="btn.uuid" :value="btn.uuid">{{btn.name}}</Option>
                </Select>
              </div>
              <div class="custom-modal-info custom-modal-info-need m-b12">菜单名称：</div>
              <div class="custom-modal-info m-b12">
                <Input placeholder="请输入菜单名" :maxlength="4" v-model="selectedBtn.name" />
                <p class="text-gray font-small p-t8">最多4个字</p>
              </div>
              <template v-if="!selectedBtn.subList.length">
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
              </template>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { MENU_JUMPLIST } from "@constant/index";
import MobileSettingUpload from "./pic-cropper.vue";
import uuidv4 from "uuid/v4";
import { AppModule } from "@store/modules/app";

// 默认图标
const IMGS = [
  "https://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1576828445154/clientmenu-1.png",
  "https://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1576828445152/clientmenu-2.png",
  "https://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1576828445149/clientmenu-3.png",
  "https://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1576828445161/clientmenu-4.png",
  "https://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1576828445171/clientmenu-5.png",
  "https://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1576828445156/clientmenu-6.png",
  "https://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1576828445172/clientmenu-7.png",
  "https://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1576828445164/clientmenu-8.png",
  "https://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1576828445209/clientmenu-9.png",
  "https://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1576828629458/clientmenu-10.png",
  "https://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1576828629434/clientmenu-11.png",
  "https://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1576828629569/clientmenu-12.png",
  "https://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1576828629464/clientmenu-13.png",
  "https://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1576828629470/clientmenu-14.png",
  "https://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1576828629475/clientmenu-15.png"
];

@Component({
  components: {
    MobileSettingUpload
  }
})
export default class MobileMenu extends Vue {
  @Prop() data!: Array<any>;
  @Prop() clientTypeName!: string;
  @Prop() clientType!: string;
  @Prop() newsClientType!: string;
  // 默认图标
  defaultIcons = IMGS;
  // 关闭按钮
  closeBtnShow = false;
  // 弹窗是否展示
  modal = false;
  // 弹窗第几步了
  modalStep = 0;
  // 按钮列表
  btns: Array<any> = [];
  // 点击跳转列表
  get jumpList(): Array<any> {
    if (
      AppModule.siteInfo.shopCode &&
      AppModule.siteInfo.shopUrl &&
      AppModule.siteInfo.shopName
    ) {
      return MENU_JUMPLIST;
    } else {
      return MENU_JUMPLIST.filter(
        (menu: any) =>
          menu.menuCode !== "MALL" && menu.menuCode !== "MALL_DETAIL"
      );
    }
  }
  // 默认选中一级菜单的下标
  selectIdx = -1;
  // 默认选中二级菜单的下标
  selectIdy = -1;
  // 选中的菜单
  selectedBtn: any = {
    subList: [],
    externalLink: "",
    id: "",
    // 跳转类型 1 站内非详情跳转  2 外部链接  3 站内详情页跳转
    jumpType: "",
    menuCode: "",
    name: "",
    selectIcon: "",
    unSelectIcon: "",
    // 菜单等级，如果是一级菜单则为1 二级菜单则为2 自己新增的字段
    level: 1,
    // 自己新增的字段 用于判断所属问题
    uuid: "",
    // 自己新增的字段 用于判断父级是哪个菜单
    fatherUuid: ""
  };
  // 一级菜单目录
  get fathersBtns(): Array<any> {
    // 莫有菜单被选中
    if (this.selectIdx === -1) {
      return [];
    }
    if (this.selectIdy === -1) {
      // 有二级菜单被选中
      return this.btns.filter((btn: any) => btn.uuid !== this.selectedBtn.uuid);
    } else {
      // 没有二级菜单选中
      return this.btns;
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
        subList: [],
        externalLink: "",
        id: "",
        jumpType: "",
        menuCode: "",
        name: "",
        selectIcon: "",
        unSelectIcon: "",
        level: 1,
        uuid: "",
        fatherUuid: ""
      };
    } else {
      if (this.selectIdy === -1) {
        this.selectedBtn = this.btns[val];
      }
    }
  }
  /**
   * 初始化btns
   */
  initBtns(clientType: string) {
    // 判断上次是不是统一编辑
    if (clientType === "ALL") {
      // 上一次是统一编辑 取数组第一项
      this.btns = this.data[0].top;
    } else {
      this.btns = this.data.filter(
        (btn: any) => btn.clientType === clientType
      )[0].top;
    }
    this.addBtnsLevel();
  }
  /** 对btns进行一二级菜单赋值 */
  addBtnsLevel() {
    this.btns.map((btn: any) => {
      let uuid = uuidv4();
      btn.level = 1;
      btn.uuid = uuid;
      btn.fatherUuid = "";
      btn.subList.map((subBtn: any) => {
        subBtn.level = 2;
        subBtn.uuid = uuidv4();
        subBtn.fatherUuid = uuid;
        return subBtn;
      });
      return btn;
    });
  }
  /** 改变菜单层级 */
  changeBtnLevel(level: number) {
    // 如果当前菜单层级和选中的是一致的 退出
    if (this.selectedBtn.level === level) {
      return false;
    }
    this.selectedBtn.level = level;
    // 改变的层级为1级的时候 判断是不是从二级改变为1级的
    // 判断是不是二级 根据selectIdy 是不是大于 -1 来判断
    if (level === 1 && this.selectIdy > -1) {
      this.moveSelectedBtnToBtns();
      return false;
    }
    this.$set(this.btns, this.selectIdx, this.selectedBtn);
  }
  /** 选择的父级菜单改变的时候  将当前的一级菜单改变为二级菜单 */
  fatherUuidChange(fatherUuid: string) {
    // 父级uuid为空则不进行后续判断
    if (!fatherUuid) {
      return false;
    }
    this.moveSelectedBtnToSubList();
  }
  /** 将选中的二级btn移动到一级btn中 */
  moveSelectedBtnToBtns() {
    this.selectedBtn.fatherUuid = "";
    // 深度拷贝btns
    let btns = JSON.parse(JSON.stringify(this.btns));
    let selectedBtn = JSON.parse(JSON.stringify(this.selectedBtn));
    // 删除btns中的当前的btn
    let newBtns = btns[this.selectIdx].subList.filter(
      (btn: any) => btn.uuid !== this.selectedBtn.uuid
    );
    btns[this.selectIdx].subList = newBtns;
    btns.push(selectedBtn);
    this.setMenuList(btns);
    this.selectIdx = this.btns.length - 1;
    this.selectIdy = -1;
    this.selectedBtn = btns[this.selectIdx];
  }
  /** 重新设置$parents的menuList */
  setMenuList(btns: Array<any>) {
    this.$set(this, "btns", btns);
    if (this.clientType === "ALL") {
      this.$parent.menuList[0].top = btns;
    } else {
      let menu = this.$parent.menuList.find(
        (item: any) => item.clientType === this.clientType
      );
      let menuIdx = this.$parent.menuList.findIndex(
        (item: any) => item.clientType === this.clientType
      );
      menu.top = btns;
    }
  }
  /** 将选中的btn移动到对应的子菜单中 */
  moveSelectedBtnToSubList() {
    // 深度拷贝btns
    let btns = JSON.parse(JSON.stringify(this.btns));
    let { fatherUuid, uuid } = this.selectedBtn;
    // 判断当前选中的按钮是在一级菜单还是在二级菜单中
    let idx = btns.findIndex((btn: any) => btn.uuid === uuid);
    let fatherIdx = btns.findIndex((btn: any) => btn.uuid === fatherUuid);
    let currBtn: any;
    // 当前编辑的菜单在一级菜单中
    if (idx > -1) {
      // 当前按钮的子菜单清空
      currBtn = btns[idx];
      // 从数组中删除当前按钮
      btns.splice(idx, 1);
    } else {
      // 当前菜单在二级菜单中
      currBtn = btns[this.selectIdx].subList[this.selectIdy];
      btns[this.selectIdx].subList.splice(this.selectIdy, 1);
    }
    currBtn.subList = [];
    btns[fatherIdx].subList.push(currBtn);
    this.setNewBtns(fatherIdx, btns);
  }
  /** 重新设置 btns 和 父级的 menuList */
  setNewBtns(fatherIdx: number, btns: Array<any>) {
    // 设置父级的menuList
    this.setMenuList(btns);
    this.selectIdy = btns[fatherIdx].subList.length - 1;
    this.selectIdx = fatherIdx;
    this.selectedBtn = btns[fatherIdx].subList[this.selectIdy];
  }

  /**新增菜单 */
  addBtnClick() {
    this.btns.push({
      subList: [],
      externalLink: "",
      id: "",
      jumpType: "",
      menuCode: "",
      name: "菜单名",
      selectIcon: "",
      unSelectIcon: "",
      level: 1,
      uuid: uuidv4(),
      fatherUuid: ""
    });
    // 重置二级菜单选中
    this.selectIdy = -1;
    this.selectBtn(this.btns.length - 1);
  }
  /**
   * selectBtn 选中某个按钮
   */
  selectBtn(idx: number) {
    // 重置二级菜单选中状态
    this.selectIdy = -1;
    // 判断选中的是不是当前的菜单
    if (idx === this.selectIdx) {
      this.selectedBtn = this.btns[idx];
    }
    this.selectIdx = idx;
    if (this.modalStep !== 1) {
      this.showModalFirstStep();
    }
  }
  /**
   * 选中二级菜单
   */
  selectSecondBtn(idy: number) {
    this.selectIdy = idy;
    this.selectedBtn = this.btns[this.selectIdx].subList[idy];
  }
  /**
   * 蒙层初展示
   */
  showModalFirstStep() {
    this.$parent.hideChildren("top");
    this.closeBtnShow = false;
    this.modal = true;
    this.modalStep = 0;
  }
  /**
   * closeModal 关闭蒙层
   */
  closeModal() {
    this.selectIdx = -1;
    this.selectIdy = -1;
    this.closeBtnShow = false;
    this.modalStep = 0;
    this.modal = false;
  }
  /** 选中默认图片 */
  selectIcon(url: string) {
    this.selectedBtn.selectIcon = url;
    this.selectedBtn.unSelectIcon = url;
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
  /**跳转地址选择框改变 */
  menuCodeChange(menuCode: string) {
    let item = this.jumpList.find((item: any) => item.menuCode === menuCode);
    this.selectedBtn.jumpType = item ? item.jumpType : "";
  }
  /** */
  deleteMenu() {
    this.btns.splice(this.selectIdx, 1);
    this.selectIdx = this.btns.length - 1;
  }
}
</script>

<style lang='scss' scoped>
.top-menu-wrapper {
  position: relative;
  padding-bottom: 50px;
}
.top-menu {
  vertical-align: top;
  overflow: hidden;
}
.top-item {
  display: inline-block;
  vertical-align: top;
  width: 20%;
  margin-top: 20px;
  text-align: center;
  cursor: pointer;
  border: 1px dotted transparent;
  border-radius: 3px;
  transition: all 0.3s ease-in;
  &:hover {
    border-color: $borderLight;
  }
  &.active {
    border-color: $theme;
  }
  &.top-item-add {
    .iconfont {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      width: 40px;
      margin: 10px 10px 0;
      border: 1px dotted $borderDark;
      border-radius: 3px;
      transition: all 0.3s ease-in;
      font-size: 16px;
      color: #999;
    }
    &:hover {
      border-color: transparent;
      .iconfont {
        color: #666;
        border-color: $borderDark;
      }
    }
  }
  &-img {
    display: inline-block;
    vertical-align: top;
    width: 24px;
    height: 24px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
    &.no-img {
      background: $grayDark;
    }
  }
  &-name {
    padding-top: 8px;
    font-size: 12px;
    color: #333;
    line-height: 18px;
  }
}
.btn {
  display: inline-block;
  margin-right: 12px;
  margin-bottom: 0;
  font-weight: normal;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  line-height: 1.5;
  user-select: none;
  padding: 1px 7px 2px;
  font-size: 12px;
  border-radius: 4px;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, -webkit-box-shadow 0.2s linear;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, box-shadow 0.2s linear;
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear, box-shadow 0.2s linear, -webkit-box-shadow 0.2s linear;
  color: #515a6e;
  background-color: #fff;
  border-color: #dcdee2;
  > span {
    vertical-align: middle;
  }

  &:hover,
  &.active {
    border-color: #19be6b;
    color: #19be6b;
  }
  &:focus {
    box-shadow: 0 0 0 2px rgba(25, 190, 107, 0.2);
  }
}
</style>
