<template>
  <div class="operation-wrapper">
    <div class="operation-area" v-if="resources.length">
      <div class="operation-imgs">
        <div
          class="operation-img"
          :class="{'img2-inline': imgNum === 2, 'img3-inline' : imgNum === 3, 'img4-inline': imgNum === 4, active: selectedIdx === index}"
          v-for="(resource, index) in resources"
          :key="index"
          @click="selectEditImg(index)"
          style="margin:0 4px;height:auto;min-height:50px;"
        >
          <img :src="resource.imgUrl" alt />
        </div>
      </div>
    </div>
    <div class="operation-add" @click="showModal" v-if="!resources.length">
      <span class="iconfont c-icon-untitled44"></span>
    </div>

    <!-- 编辑底部按钮弹窗 -->
    <transition name="fade">
      <div class="custom-modal custom-modal-top" v-if="modal">
        <div class="custom-modal-wrapper">
          <div
            class="iconfont c-icon-cuowu custom-modal-closebtn"
            v-if="closeBtnShow"
            @click.stop="closeModal"
          ></div>
          <!-- 点击菜单栏第一次出现的弹窗 -->
          <div v-if="modalStep === 0">
            <h3 class="custom-modal-title">运营互动资源位</h3>
            <p class="custom-modal-tip"></p>
            <div class="custom-modal-con">
              <Button type="success" ghost size="small" @click="editOperation">编辑</Button>
            </div>
          </div>
          <!-- 点击菜单栏弹出层编辑新的弹窗 -->
          <div v-if="modalStep === 1">
            <h3 class="custom-modal-title">
              运营互动资源位
              <span
                class="custom-modal-delete-btn"
                @click="deleteMenu"
                style="float:right;font-size:12px;font-weight:normal;"
              >删除运营专区配置</span>
            </h3>
            <p class="custom-modal-tip"></p>
            <div class="custom-modal-con">
              <div class="custom-modal-icons-wrapper m-b12">
                <div class="custom-modal-info custom-modal-info-need">显示样式</div>
                <p class="custom-modal-tip" style="margin-left:6px;">切换显示样式,之前编辑的内容会被清空！</p>
              </div>
              <div class="custom-modal-info m-b12">
                <button class="btn" :class="{active: imgNum === 2}" @click="changeImgNum(2)">
                  <span>两图</span>
                </button>
                <button class="btn" :class="{active: imgNum === 3}" @click="changeImgNum(3)">
                  <span>三图</span>
                </button>
                <button class="btn" :class="{active: imgNum === 4}" @click="changeImgNum(4)">
                  <span>四图</span>
                </button>
              </div>
            </div>
            <div class="custom-modal-con" v-if="imgNum > 1">
              <!-- 两图 -->
              <!-- <MobileSettingUpload :ratio="12 / 5"></MobileSettingUpload> -->
              <!-- 三图 -->
              <!-- <MobileSettingUpload :ratio="31 / 20"></MobileSettingUpload> -->
              <!-- 四图 -->
              <!-- <MobileSettingUpload :ratio="57 / 50"></MobileSettingUpload> -->
              <div class="operation-imgs m-b12">
                <div
                  class="operation-img"
                  :class="{'img2-inline': imgNum === 2, 'img3-inline' : imgNum === 3, 'img4-inline': imgNum === 4, active: selectedIdx === index}"
                  v-for="(resource, index) in resources"
                  :key="index"
                  @click="selectImg(index)"
                >
                  <MobileSettingUpload
                    v-model="resource.imgUrl"
                    :width="width"
                    :height="77"
                    :ratio="ratio"
                    :showText="true"
                    :border="false"
                    :needCut="false"
                  ></MobileSettingUpload>
                </div>
              </div>
              <!-- 图片编辑区域 -->
              <div v-if="selectedIdx > -1">
                <div class="img-edit-right">
                  <div class="custom-modal-info custom-modal-info-need m-b6">点击跳转</div>
                  <div class="custom-modal-info m-b6">
                    <Select
                      @on-change="menuCodeChange"
                      placement="top"
                      v-model="resources[selectedIdx].menuCode"
                    >
                      <Option
                        v-for="jump in jumpList"
                        :key="jump.menuCode"
                        :value="jump.menuCode"
                      >{{jump.name}}</Option>
                    </Select>
                  </div>
                  <div class="custom-modal-info" v-if="resources[selectedIdx].jumpType === 3">
                    已选择：
                    <span
                      class="resourceName"
                      v-if="resources[selectedIdx].resourceName"
                    >{{resources[selectedIdx].resourceName}}</span>
                    <span class="theme" v-else @click="changeResource">请选择</span>
                    <span class="changResourceBtn" @click="changeResource">更改</span>
                  </div>
                  <div class="custom-modal-info" v-if="resources[selectedIdx].jumpType === 2">
                    <Input v-model="resources[selectedIdx].externalLink" placeholder="请输入跳转地址" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 资源关联选择 -->
    <ResourceModal
      v-model="resourceModal"
      :resourceType="selectedIdx > -1 ? resources[selectedIdx].resourceType : ''"
      :defaultValue="selectedIdx > -1 ? resources[selectedIdx].resourceValue : ''"
      @on-checked="resourceChecked"
    ></ResourceModal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { getClientOpertation } from "@service/setting";
import { MENU_JUMPLIST } from "@constant/index";
import MobileSettingUpload from "./pic-cropper.vue";
import ResourceModal from "./resourceModal.vue";
import { AppModule } from "@store/modules/app";
import { ModalConfig } from "iview/types";

interface ResourceType {
  externalLink: string;
  resourceValue: string;
  resourceName: string;
  imgUrl: string;
  jumpType: string | number;
  menuCode: string;
  resourceType: string;
}

@Component({
  components: {
    MobileSettingUpload,
    ResourceModal
  }
})
export default class MobileOperation extends Vue {
  // 资源关联弹窗是否展示
  resourceModal = false;
  // 上传图片宽高比
  ratio = 1;
  // 上传组件的宽度
  width = 79;
  // 编辑弹窗
  modal = false;
  // 编辑弹窗关闭按钮
  closeBtnShow = false;
  // 弹窗步骤， 默认为第一步
  modalStep = 0;
  // 图片展示风格，现在全部默认为1 不管是几图都是一行展示
  style = 1;
  // 图片数量
  imgNum = 0;
  // id 后台保存后会存在一个id，编辑已有运营位的也会返回id， 保存时id这个键必须存在，值可以为空
  id: string = "";
  // 运营位位置 预留字段，现阶段值必为OPERATION
  moduleLocation = "OPERATION";
  // 运营位的图片数组
  resources: Array<ResourceType> = [];
  // 选中的图片下标 默认不选中
  selectedIdx = -1;
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
  /**展示弹窗 */
  showModal() {
    this.$parent.hideChildren("operation");
    this.modal = true;
  }
  /**关闭弹窗 */
  closeModal() {
    this.selectedIdx = -1;
    this.closeBtnShow = false;
    this.modalStep = 0;
    this.modal = false;
  }
  /** 点击弹窗编辑 */
  editOperation() {
    this.modalStep = 1;
    this.closeBtnShow = true;
  }
  showChangeNumModal(callback: () => void) {
    let _this = this;
    let config: ModalConfig = {
      title: "操作提示",
      content: `切换显示样式,之前编辑的内容会被清空！是否继续？`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        callback();
      }
    };
    if (this.imgNum !== 0) {
      this.$Modal.confirm(config);
      return;
    }
    callback();
  }
  /**
   * changeImgNum 更换图的数量 重置resources数组
   * @param {number} num 图片的数量
   */
  changeImgNum(num: number) {
    // 如果切换的图片数量和当前的图片数量一致 则不进行重构数组
    if (this.imgNum === num) {
      return false;
    }
    this.showChangeNumModal(() => {
      this.imgNum = num;
      this.resources = [];
      for (let index = 0; index < num; index++) {
        const element: ResourceType = {
          externalLink: "",
          resourceValue: "",
          resourceName: "",
          imgUrl: "",
          jumpType: "",
          menuCode: "",
          resourceType: ""
        };
        this.resources.push(element);
      }
      // 重置选中的下标
      this.selectedIdx = -1;
      this.setRatio(num);
    });
  }
  /**根据展示图片数量设置上传图片的比列 */
  setRatio(imgNum: number) {
    switch (imgNum) {
      case 2: {
        this.ratio = 12 / 5;
        this.width = 188;
        break;
      }
      case 3: {
        this.ratio = 31 / 20;
        this.width = 119;
        break;
      }
      case 4: {
        this.ratio = 57 / 50;
        this.width = 88;
        break;
      }
      default:
        break;
    }
  }
  /**
   * 选择某张图片 弹窗展示
   */
  selectEditImg(idx: number) {
    this.selectedIdx = idx;
    this.$parent.hideChildren("operation");
    this.modal = true;
    this.setRatio(this.imgNum);
  }
  /**
   * 选中当前的图片
   */
  selectImg(idx: number) {
    this.selectedIdx = idx;
  }
  /**
   * 跳转地址变化
   */
  menuCodeChange(code: string) {
    // 判断code是否存在 不存在不执行下面的方法
    if (!code) {
      return false;
    }
    let item = this.jumpList.find((jump: any) => jump.menuCode === code);
    let { resourceType, menuCode, jumpType } = item;

    this.resources[this.selectedIdx].resourceType = resourceType;
    this.resources[this.selectedIdx].menuCode = menuCode;
    this.resources[this.selectedIdx].jumpType = jumpType;

    // 判断是否存在resourceType 如果存在则是跳转具体资源弹窗
    if (resourceType) {
      this.resourceModal = true;
    }
    // 清除外链
    if (jumpType != 2) {
      this.resources[this.selectedIdx].externalLink = "";
    }
  }
  /**
   * changeResource 更改详情资源
   */
  changeResource() {
    this.resourceModal = true;
  }
  /**
   * resourceChecked 资源选中
   */
  resourceChecked(data: any) {
    if (Object.keys(data).length) {
      // 商品走的小电商接口 跳转商品详情resourceValue保存的是完整地址
      if (this.resources[this.selectedIdx].resourceType === "MALL_DETAIL") {
        this.resources[this.selectedIdx].resourceName = data.productName;
        this.resources[this.selectedIdx].resourceValue = data.url;
      } else {
        // 场馆、景区、酒店、餐饮、社团
        this.resources[this.selectedIdx].resourceName = data.name;
        this.resources[this.selectedIdx].resourceValue = data.id;
        // 攻略名称叫title 不叫name
        if (this.resources[this.selectedIdx].resourceType === "strategy") {
          this.resources[this.selectedIdx].resourceName = data.title;
        }
      }
    }
  }
  /**
   * 删除运营专区配置
   */
  deleteMenu() {
    this.style = 0;
    this.imgNum = 0;
    this.resources = [];
  }
  /**
   * 父级保存需要获取运营位置参数
   */
  getOperation() {
    let json = {
      resources: this.resources,
      style: this.style,
      imgNum: this.imgNum,
      moduleLocation: this.moduleLocation,
      id: this.id
    };
    return JSON.stringify(json);
  }
  created() {
    getClientOpertation({ location: "OPERATION" }).then(res => {
      if (res.code === 0) {
        let { id, imgNum, style, moduleLocation, resources } = res.data;
        // 取消图片列表中的创建时间 不然直接修改包含创建时间 会报错
        let newResources = resources.map((resource: any) => {
          let { createTime, ...rest } = resource;
          return { ...rest };
        });
        this.resources = newResources;
        this.id = id;
        this.imgNum = imgNum;
        this.style = style;
      }
    });
  }
}
</script>

<style lang='scss' scoped>
.operation-wrapper {
  position: relative;
  margin: 24px 0 0;
}
.operation-area {
}
.operation-add {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed $borderLight;
  border-radius: 3px;
  color: #999;
  font-size: 22px;
  cursor: pointer;
  &:hover {
    color: #666;
    border-color: $borderDark;
  }
  &.active {
    border-color: $theme;
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
.operation-imgs {
  display: flex;
  justify-content: space-between;
  .operation-img {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    border: 1px dashed $borderLight;
    border-radius: 4px;
    font-weight: bold;
    color: #999;
    cursor: pointer;

    img {
      width: 100%;
      height: auto;
    }
  }
  .img2-inline {
    width: 190px;
    height: 79px;
  }
  .img3-inline {
    width: 121px;
    height: 79px;
  }
  .img4-inline {
    width: 90px;
    height: 79px;
  }
  .active {
    border-color: #19be6b;
    color: #19be6b;
  }
}
.m-b6 {
  margin-bottom: 6px;
}
.changResourceBtn {
  float: right;
  color: $theme;
  cursor: pointer;
  &:hover {
    color: $theme-hover;
  }
}
.theme {
  color: $theme;
  cursor: pointer;
  &:hover {
    color: $theme-hover;
  }
}
.resourceName {
  display: inline-block;
  max-width: 190px;
  padding-bottom: 2px;
  @include ellipsis();
  line-height: 1;
  vertical-align: middle;
}
</style>
