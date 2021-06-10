<!--
 * @Author: Hexg
 * @Date: 2019-07-10 11:49:09
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-06 18:01:28
 -->
<template>
  <div>
    <div class="logo">
      <p class="name">LOGO：</p>
      <Tooltip placement="right" content="点击修改">
        <div class="img-box" :class="{'daq-no-photo': !data.logo}">
          <img v-if="data.logo" class="img" :src="data.logo" :alt="data.name" />
          <img v-else src="@assets/image/site-default.png" :alt="data.name" class="img">
          <input
            type="file"
            class="logo-upload"
            accept="image/*"
            ref="fileInput"
            @change="acceptImage($event)"
          />
        </div>
      </Tooltip>
      <span class="tip">只支持jpg，jpeg，png格式，大小不得超过256kb</span>
    </div>
    <div class="items">
      <div class="item">
        <p class="name">名称:</p>
        <p class="txt">{{data.name}}</p>
        <Tooltip placement="right" content="点击进行修改">
          <i class="cloud-icon" @click="openInputModal('名称', 'name')">&#xe6b9;</i>
        </Tooltip>
      </div>
      <div class="item">
        <span class="name">介绍：</span>
        <div class="ipt">
          <i-input type="textarea" :maxlength="50" v-model="data.introduce" :rows="3" placeholder="请输入..."></i-input>
        </div>
        <div class="button">
          <i-button
            type="primary"
            :disabled="data.introduce && !data.introduce.length"
            @click="textAreaEditNotice('introduce', '介绍')"
          >保存</i-button>
        </div>
      </div>
    </div>

    <Spin size="large" fix v-if="spinShow"></Spin>
    <!-- 输入框弹窗 -->
    <Modal
      v-model="showInputModal"
      :title="inputModalTitle"
      :width="400"
      class="modal-local-settin-info"
      :closable="false"
    >
      <Input type="text" v-model="inputModalInput" :maxlength="20" :placeholder="`请输入${inputModalTitle}`" />
      <div class="addModal-footer" slot="footer">
        <Button class="btn" type="text" size="large" @click="closeInputModal">取消</Button>
        <Button class="btn" type="primary" @click="InputModalConfirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { ModalConfig, Input } from "iview/types";
import {getCompanyConfig, updateCompanyConfig, UpdateCompanyConfigDataType} from "@service/setting";
import { uploadImage } from "@service/content";

@Component
export default class LocalInfo extends Vue {
  // 余额预警弹窗
  private showWarnModal = false
  private validate = {
    sitePhone: [{ required: true, validator: this.validatePhone, trigger: "blur" }],
  };
  // 部分输入框的弹窗
  private showInputModal = false
  private inputModalTitle = ''
  private inputModalInput = ''
  private code = '' // 需要修改的键
  // 点击充值机审条数的弹窗
  private showModal = false;
  // 进行修改时 整个页面的加载动画
  private spinShow = false;
  // 当前站点的数据
  private data:any = {};
  // 图片上传
  private acceptImage(e: any) {
    let files = e.target.files;
    let _this = this;
    let len = files.length;
    let _input = this.$refs.fileInput as HTMLElement;
    for (let i = 0; i < len; i++) {
      let formData = new FormData();
      formData.append("Filedata", files[i]);
      formData.append("path", "cultural-tourism-cloud");
      this.spinShow = true
      uploadImage(formData).then((res: any) => {
        this.spinShow = false
        this.updateConfig({ logo: res.safeUrl }, `修改LOGO`);
      }).catch(err => {
        this.spinShow = false
      });
    }
    _input.setAttribute("type", "file");
  }
  /**
   * textarea修改弹窗提示
   * @params {string} code 存储的键
   * @params {string} name 当前键的中文名字
   */
  private textAreaEditNotice (code: string, name:string) {
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否确认更改${name}?`,
      okText: `确认`,
      cancelText: "取消",
      onOk: () => {
        if (this.data[code].length > 50) {
          this.$Message.error(`介绍不能超过50`);
          return false
        }
        this.updateConfig({ [code]: this.data[code] }, `修改${name}`);
      }
    };
    this.$Modal.confirm(config);
  }
  // 开启输入框弹窗
  private openInputModal (title: string, code: string) {
    this.showInputModal = true
    this.inputModalTitle = title
    this.code = code
  }
  // 输入框弹窗点击确定
  private InputModalConfirm () {
    let {inputModalTitle, inputModalType, code, data, inputModalInput} = this
    // 未输入值
    if (!inputModalInput.length) {
      this.$Message.error(`请输入${inputModalTitle}`);
      return false
    }
    // 值没发生变化
    if (inputModalInput === data[code]) {
      this.$Message.error(`新的${inputModalTitle}和之前的一样`);
      return false
    }
    if (data[code].length >= 500 ) {
      this.$Message.error(`介绍不能超过500`);
      return false
    }
    // 进行请求
    this.updateConfig({ [code]: inputModalInput }, `修改${inputModalTitle}`);
    this.closeInputModal()
  }
    /**
   * 修改部分配置
   * @params params 请求用参数
   * @params title 请求成功后提示的标题
   */
  private updateConfig(params: UpdateCompanyConfigDataType, title: string) {
    this.spinShow = true;
    updateCompanyConfig(params)
      .then(res => {
        this.spinShow = false;
        if (res.code === 0) {
          this.$Message.success(`${title}成功`);
          this.getSiteConfig();
        }
      })
      .catch(err => {
        this.spinShow = false;
      });
  }
  // 关闭输入框输入弹窗
  private closeInputModal () {
    this.closeModal('showInputModal')
    // 重置弹簧的对应属性值
    setTimeout(()=> {
      this.inputModalTitle = ''
      this.code = ''
      this.inputModalInput = ''
    }, 300)
  }
  /**
   * 关闭弹窗
   * @params key {string} 需要关闭弹窗的值
   */
  private closeModal(key:string) {
    this[key] = false;
  }
  // 获取站点配置
  private getSiteConfig() {
    getCompanyConfig().then(res => {
      if (res.data) {
        this.data = res.data;
      }
    });
  }
  created() {
    this.getSiteConfig();
  }
}
</script>

<style lang="scss">
.modal-local-settin-info {
  .ivu-modal-header {
    border-bottom: none !important;
  }
  .ivu-modal-footer {
    border-top: none !important;
  }
}
</style>
<style lang='scss' scoped>
.logo {
  display: flex;
  align-items: center;
  padding: 16px 0 32px 32px;
  .img-box {
    position: relative;
    height: 100px;
    width: 100px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    .logo-upload{
      position:absolute;
      left:0;
      top:0;
      width:100%;
      height:100%;
      opacity: 0;
      cursor:pointer;
    }
  }
  .name {
    min-width: 5em;
  }
  .img {
    height: 100px;
    width: 100px;
  }
  .tip {
    margin-left: 8px;
    color: #999;
    align-self: flex-end;
  }
}
.items {
  .items-tit {
    padding-top: 16px;
  }
  .tit-tip {
    margin-left: 24px;
    font-size: 10px;
    color: #999;
    font-weight: normal;
  }
  .item-switch {
    margin-left: 8px;
  }
  .ivu-divider-horizontal {
    margin: 12px 0 24px;
  }
  .item {
    display: flex;
    margin-bottom: 32px;
    padding: 0 32px;
    &.check {
      flex-wrap: wrap;
      padding-left: 0;
    }
    &.inline {
      align-items: center;
    }
    &.mb-8 {
      margin-bottom: 8px;
    }
  }
  .check-item {
    min-width: 250px;
    margin: 0 0 18px 32px;
    display: flex;
    align-items: center;
  }
  .name {
    min-width: 5em;
  }
  .ipt {
    flex: 1;
    max-width: 300px;
    margin-right: 16px;
  }
  .cloud-icon {
    margin-left: 8px;
    cursor: pointer;
  }
  .button {
    align-self: flex-end;
  }
  .con-tit {
    padding-bottom: 12px;
    font-size: 14px;
  }
  .con-tip {
    font-size: 10px;
    color: #999;
    em {
      color: $theColor1;
      font-style: normal;
    }
  }
  .con-checks {
    display: flex;
    padding: 12px 0;
  }
  .con-check {
    display: flex;
    margin: 0 60px 0 0;
    .name {
      min-width: auto;
    }
  }
  .machine-check {
    .number {
      width: 110px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    }
    &-txt {
      width: 110px;
      padding: 12px 0;
      text-align: center;
    }
    &-btns {
      display: flex;
      align-items: center;
    }
    &-btn {
      margin-right: 12px;
    }
    &-btn1 {
      width: 110px;
    }
    &-phone {
      color: #999;
    }
  }
}
.ml-8 {
  margin-left: 8px;
}
.switch-box {
  position: relative;
  margin-left: 4px;
}
.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
