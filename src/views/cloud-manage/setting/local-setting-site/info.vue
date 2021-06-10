<template>
  <div>
    <div class="logo">
      <p class="name">LOGO：</p>
      <Tooltip placement="right" content="点击修改">
        <div class="img-box" :class="{'daq-no-photo': !data.siteLogo}">
          <img v-if="data.siteLogo" class="img" :src="data.siteLogo" :alt="data.name" />
          <img v-else src="@assets/image/site-default.png" :alt="data.name" class="img" />
          <input type="file" class="logo-upload" accept="image/*" ref="fileInput" @change="acceptImage($event)" />
        </div>
      </Tooltip>
      <span class="tip">只支持jpg，jpeg，png，gif格式，大小不得超过256kb</span>
    </div>
    <div class="items">
      <div class="item">
        <p class="name">站点名称:</p>
        <p class="txt">{{data.name}}</p>
        <Tooltip placement="right" content="点击进行修改">
          <i class="cloud-icon" @click="openInputModal('站点名称', 'name')">&#xe6b9;</i>
        </Tooltip>
      </div>
      <div class="item">
        <p class="name">客服电话：</p>
        <p class="txt">{{data.servicePhone}}</p>
        <Tooltip placement="right" content="点击进行修改">
          <i class="cloud-icon" @click="openInputModal('客服电话', 'servicePhone')">&#xe6b9;</i>
        </Tooltip>
      </div>
      <div class="item">
        <span class="name">站点介绍：</span>
        <div class="ipt">
          <i-input type="textarea" :maxlength="50" v-model="data.siteIntroduce" :rows="3" placeholder="请输入..."></i-input>
        </div>
        <div class="button">
          <i-button type="primary" :disabled="data.siteIntroduce && !data.siteIntroduce.length" @click="textAreaEditNotice('siteIntroduce', '站点介绍')">保存</i-button>
        </div>
      </div>
    </div>
    <!-- 在线客服 -->
    <div class="items">
      <h3 class="items-tit">在线客服</h3>
      <Divider />
      <div class="item inline">
        <p class="name">在线客服：</p>
        <p class="txt">
          {{data.serviceOnline ? '启用' : '禁用'}}
          <span class="switch-box">
            <i-switch class="tab-switch" :value="data.serviceOnline"></i-switch>
            <i class="mask" @click="statusChangeHandle(data.serviceOnline, 'serviceOnline', '在线客服')"></i>
          </span>
        </p>
      </div>
      <div class="item mb-8">
        <span class="name">客服代码:</span>
        <div class="ipt">
          <i-input type="textarea" :maxlength="200" v-model="data.serviceCode" :rows="3" placeholder="请输入..."></i-input>
        </div>
        <div class="button">
          <i-button type="primary" :disabled="data.serviceCode && !data.serviceCode.length" @click="textAreaEditNotice('serviceCode', '客服代码')">保存</i-button>
        </div>
      </div>
      <div class="item">
        <span class="name"></span>
        <p>请将第三方客服系统的调用代码粘贴到此处。推荐使用免费在线客服工具</p>
        <a class="ml-8" href="https://qiao.baidu.com/" target="_blank">百度商桥</a>
      </div>
    </div>
    <!-- 发现身边 -->
    <div class="items">
      <h3 class="items-tit">发现身边</h3>
      <Divider />
      <div class="item inline">
        <p class="name">是否开启场所推送：</p>
        <p class="txt">
          {{data.pushPlace ? '启用' : '禁用'}}
          <span class="switch-box">
            <i-switch class="tab-switch" :value="data.pushPlace"></i-switch>
            <i class="mask" @click="statusChangeHandle(data.pushPlace, 'pushPlace', '场所推送')"></i>
          </span>
        </p>
        <p class="tit-tip">注：主动向用户推送周边2KM内的场所。APP主动推送，H5及小程序需要打开首页才可推送。</p>
      </div>
      <div class="item inline">
        <p class="name">是否开启景点推送：</p>
        <p class="txt">
          {{data.pushScenic ? '启用' : '禁用'}}
          <span class="switch-box">
            <i-switch class="tab-switch" :value="data.pushScenic"></i-switch>
            <i class="mask" @click="statusChangeHandle(data.pushScenic, 'pushScenic', '景点推送')"></i>
          </span>
        </p>
        <p class="tit-tip">注：主动向用户推送周边1KM内的景点。APP主动推送，H5及小程序需要打开首页才可推送。</p>
      </div>
    </div>
    <!-- 上报审核 -->
    <div class="items">
      <h3 class="items-tit">
        上报审核
        <span class="tit-tip">由文旅企业端发布的信息是否需要审核</span>
      </h3>
      <Divider />
      <div class="item check">
        <div class="check-item">
          <p class="name">内容审核：</p>
          <p class="txt">
            {{data.contentReview ? '启用' : '禁用'}}
            <span class="switch-box">
              <i-switch class="tab-switch" :value="data.contentReview"></i-switch>
              <i class="mask" @click="statusChangeHandle(data.contentReview, 'contentReview', '内容审核')"></i>
            </span>
          </p>
        </div>
        <div class="check-item">
          <p class="name">场所审核：</p>
          <p class="txt">
            {{data.venueReview ? '启用' : '禁用'}}
            <span class="switch-box">
              <i-switch class="tab-switch" :value="data.venueReview"></i-switch>
              <i class="mask" @click="statusChangeHandle(data.venueReview, 'venueReview', '场所审核')"></i>
            </span>
          </p>
        </div>
        <div class="check-item">
          <p class="name">活动审核：</p>
          <p class="txt">
            {{data.activityReview ? '启用' : '禁用'}}
            <span class="switch-box">
              <i-switch class="tab-switch" :value="data.activityReview"></i-switch>
              <i class="mask" @click="statusChangeHandle(data.activityReview, 'activityReview', '活动审核')"></i>
            </span>
          </p>
        </div>
        <div class="check-item">
          <p class="name">话题审核：</p>
          <p class="txt">
            {{data.topicReview ? '启用' : '禁用'}}
            <span class="switch-box">
              <i-switch class="tab-switch" :value="data.topicReview"></i-switch>
              <i class="mask" @click="statusChangeHandle(data.topicReview, 'topicReview', '话题审核')"></i>
            </span>
          </p>
        </div>
        <div class="check-item">
          <p class="name">允许文旅企业端处理投诉：</p>
          <p class="txt">
            {{data.placeDealComplaints ? '启用' : '禁用'}}
            <span class="switch-box">
              <i-switch class="tab-switch" :value="data.placeDealComplaints"></i-switch>
              <i class="mask" @click="statusChangeHandle(data.placeDealComplaints, 'placeDealComplaints', '文旅企业端处理投诉')"></i>
            </span>
          </p>
        </div>
        <div class="check-item">
          <p class="name">非遗审核：</p>
          <p class="txt">
            {{data.ichReview ? '启用' : '禁用'}}
            <span class="switch-box">
              <i-switch class="tab-switch" :value="data.ichReview"></i-switch>
              <i class="mask" @click="statusChangeHandle(data.ichReview, 'ichReview', '非遗审核')"></i>
            </span>
          </p>
        </div>
      </div>
    </div>
    <!-- 内容安全 -->
    <div class="items">
      <h3 class="items-tit">内容安全</h3>
      <Divider />
      <div class="con-item">
        <p class="con-tit">人工审核</p>
        <p class="con-tip">由用户发布的故事、攻略、点评是否需要人工审核</p>
        <div class="con-checks">
          <div class="con-check">
            <p class="name">点评：</p>
            <p class="txt">
              {{data.reviewStatus ? '启用' : '禁用'}}
              <span class="switch-box">
                <i-switch class="tab-switch" :value="data.reviewStatus"></i-switch>
                <i class="mask" @click="statusChangeHandle(data.reviewStatus, 'reviewStatus', '人工审核点评')"></i>
              </span>
            </p>
          </div>
          <div class="con-check">
            <p class="name">故事/攻略：</p>
            <p class="txt">
              {{data.storyStatus ? '启用' : '禁用'}}
              <span class="switch-box">
                <i-switch class="tab-switch" :value="data.storyStatus"></i-switch>
                <i class="mask" @click="statusChangeHandle(data.storyStatus, 'storyStatus', '人工审核故事/攻略')"></i>
              </span>
            </p>
          </div>
        </div>
      </div>
      <Divider />
      <div class="con-item">
        <p class="con-tit">人工智能</p>
        <p class="con-tip">
          由用户发布的故事、攻略、点评等内容通过人工智能对文字、图片、视频、音频进行智能审核。
          <em>开启人工智能后建议关闭【人工审核】。</em>
        </p>
        <div class="con-checks">
          <div class="con-check">
            <p class="name">开启机审功能：</p>
            <p class="txt">
              {{data.machineReview ? '启用' : '禁用'}}
              <span class="switch-box">
                <i-switch class="tab-switch" :value="data.machineReview"></i-switch>
                <i class="mask" @click="statusChangeHandle(data.machineReview, 'machineReview', '机审功能')"></i>
              </span>
            </p>
          </div>
        </div>
        <div class="con-checks">
          <div class="machine-check">
            <p class="number">{{data.auditNum}}</p>
            <p class="machine-check-txt">剩余审核条数</p>
            <div class="machine-check-btns">
              <Button class="machine-check-btn machine-check-btn1" @click="openModal('showModal')">立即充值</Button>
              <Button class="machine-check-btn" @click="openModal('showWarnModal')">余额预警</Button>
              <p class="machine-check-phone">提醒手机号：{{data.sitePhone ? data.sitePhone.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2") : ''}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 第一期暂未开通此功能，然后先给屏蔽了 -->
    <!-- 智能机器人 -->
    <div class="items">
      <h3 class="items-tit">其他设置</h3>
      <Divider />
      <div class="item inline">
        <p class="name">是否开启智能机器人：</p>
        <p class="txt">
          {{data.serviceRobot ? '启用' : '禁用'}}
          <span class="switch-box">
            <i-switch class="tab-switch" :value="data.serviceRobot"></i-switch>
            <i class="mask" @click="statusChangeHandle(data.serviceRobot, 'serviceRobot', '智能机器人')"></i>
          </span>
        </p>
      </div>
      <!-- <div class="item inline">
        <p class="name">手机号注册：</p>
        <p class="txt">
          {{data.phoneRegister ? '启用' : '禁用'}}
          <span class="switch-box">
            <i-switch class="tab-switch" :value="data.phoneRegister"></i-switch>
            <i
              class="mask"
              @click="statusChangeHandle(data.phoneRegister, 'phoneRegister', '手机号注册')"
            ></i>
          </span>
        </p>
        <p class="tit-tip">开启后，在用户端下单时，需用户通过手机号注册后方能购买。</p>
      </div> -->
      <div class="item inline">
        <p class="name">是否开启智能实名认证：</p>
        <p class="txt">
          {{data.realNameValidation ? '启用' : '禁用'}}
          <span class="switch-box">
            <i-switch class="tab-switch" :value="data.realNameValidation"></i-switch>
            <i
              class="mask"
              @click="statusChangeHandle(data.realNameValidation, 'realNameValidation', '实名认证')"
            ></i>
          </span>
        </p>
        <p class="tit-tip">开启后，可快速验证身份信息真伪</p>
      </div>
      <div class="item inline">
        <p class="name">一键求助电话号码配置：</p>
        <div class="txt">
          <!-- {{data.emergencyStatus ? '启用' : '禁用'}}
          <span class="switch-box">
            <i-switch class="tab-switch" :value="data.emergencyStatus"></i-switch>
            <i class="mask" @click="statusChangeHandle(data.emergencyStatus, 'emergencyStatus', '一键求助')"></i>
          </span>-->
          <div style="display:inline-block;" class="ml20">
            <phone v-model="data.emergencyPhone" class="control"></phone>
            <Button
              class="btn ml10"
              type="primary"
              size="large"
              @click.stop="updateStatus({ emergencyPhone: data.emergencyPhone }, `配置一键求助手机号`)"
            >提交</Button>
          </div>
        </div>
      </div>
       <div class="item inline">
        <p class="name">是否开启站点跳转：</p>
        <p class="txt">
          {{data.enableOutSite ? '启用' : '禁用'}}
          <span class="switch-box">
            <i-switch class="tab-switch" :value="data.enableOutSite"></i-switch>
            <i
              class="mask"
              @click="statusChangeHandle(data.enableOutSite, 'enableOutSite', '站点跳转')"
            ></i>
          </span>
        </p>
      </div>
      <div class="item inline" v-if="data.enableOutSite">
        <p class="name">是否开启第三方跳转：</p>
        <p class="txt">
          {{data.outsideStatus ? '启用' : '禁用'}}
          <span class="switch-box">
            <i-switch class="tab-switch" :value="data.outsideStatus"></i-switch>
            <i
              class="mask"
              @click="statusChangeHandle(data.outsideStatus, 'outsideStatus', '第三方跳转')"
            ></i>
          </span>
        </p>
        <Input type="text" v-model="data.outsideLink" :maxlength="500" style="width:300px;margin-left:20px;"/>
        <Button
          class="btn ml10"
          type="primary"
          size="large"
          @click.stop="updateStatus({ outsideLink: data.outsideLink }, `配置第三方跳转地址`)"
        >提交</Button>
      </div>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <!-- 机审条数充值按钮点击弹窗 -->
    <Modal v-model="showModal" title="立即充值" :width="400" class="modal-local-settin-info">
      <p style="padding-bottom:12px;">请根据以下方式联系平台客服人员进行人工智能审核条数充值！</p>
      <p>QQ ：2870477231</p>
      <p>微信客服：18030814301</p>
      <p>客服电话：18030814301</p>
      <div class="addModal-footer" slot="footer">
        <Button class="btn" type="text" size="large" @click="closeModal('showModal')">关闭</Button>
      </div>
    </Modal>
    <!-- 输入框弹窗 -->
    <Modal v-model="showInputModal" :title="inputModalTitle" :width="400" class="modal-local-settin-info" :closable="false">
      <Form :label-width="0" :model="data" :rules="validate" ref="warnModal">
        <FormItem label prop="siteTel">
          <Input type="text" :maxlength="20" v-model="inputModalInput" :placeholder="`请输入${inputModalTitle}`" />
        </FormItem>
      </Form>
      <div class="addModal-footer" slot="footer">
        <Button class="btn" type="text" size="large" @click="closeInputModal">取消</Button>
        <Button class="btn" type="primary" @click="InputModalConfirm">确定</Button>
      </div>
    </Modal>
    <!-- 余额预警弹窗 -->
    <Modal v-model="showWarnModal" title="余额预警" class="modal-local-settin-info" :closable="false">
      <Form :label-width="90" :model="data" :rules="validate" ref="warnModal">
        <FormItem label="预警手机号:" prop="sitePhone">
          <Input type="text" v-model="data.sitePhone" style="width:200px;" />
        </FormItem>
        <FormItem>
          <p>人工智能审核条数低于500条时，将通过手机短信进行提醒。每天提醒1次。</p>
        </FormItem>
      </Form>
      <div class="addModal-footer" slot="footer">
        <Button class="btn" type="text" size="large" @click="closeModal('showWarnModal')">取消</Button>
        <Button class="btn" type="primary" @click="warnModalConfirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { ModalConfig, Input } from "iview/types";
import {
  getSiteConfig,
  updateSiteConfig,
  SiteConfigDataType
} from "@service/setting";
import { uploadImage } from "@service/content";
import { AppModule } from "@store/modules/app";

@Component
export default class LocalInfo extends Vue {
  // 余额预警弹窗
  private showWarnModal = false;
  private validate = {
    sitePhone: [
      { required: true, validator: this.validatePhone, trigger: "blur" }
    ]
  };
  // 部分输入框的弹窗
  private showInputModal = false;
  private inputModalTitle = "";
  private inputModalInput = "";
  private code = ""; // 需要修改的键
  // 点击充值机审条数的弹窗
  private showModal = false;
  // 进行修改时 整个页面的加载动画
  private spinShow = false;
  // 当前站点的数据
  private data: any = {};
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
      this.spinShow = true;
      uploadImage(formData)
        .then((res: any) => {
          this.spinShow = false;
          this.updateStatus({ siteLogo: res.safeUrl }, `修改LOGO`);
        })
        .catch(err => {
          this.spinShow = false;
        });
    }
    _input.setAttribute("type", "file");
  }
  // 手机号验证
  private validatePhone(rule: any, value: any, callback: any) {
    if (!value) {
      return callback(new Error("请输入手机号码"));
    } else if (!/^1\d{10}$/.test(value)) {
      callback("手机号不正确");
    } else {
      callback();
    }
  }
  /**
   * 点击switch按钮进行对应的弹窗提示
   * @params status {boolean} 当前按钮的值
   * @parmas code {string} 当前选项的键
   * @params name {string} 当前选项对应的名称
   */
  private emergencyPhone: string = ""; //一键求助电话号码
  private statusChangeHandle(status: boolean, code: string, name: string) {
    console.log(status);
    let _this = this;
    let title = status ? "禁用" : "启用";
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否${title}${name}?`,
      okText: `确认${title}`,
      cancelText: "取消",
      onOk: () => {
        this.updateStatus({ [code]: !status }, `${title}${name}`);
      }
    };
    this.$Modal.confirm(config);
  }
  /**
   * textarea修改弹窗提示
   * @params {string} code 存储的键
   * @params {string} name 当前键的中文名字
   */
  private textAreaEditNotice(code: string, name: string) {
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否确认更改${name}?`,
      okText: `确认`,
      cancelText: "取消",
      onOk: () => {
        this.updateStatus({ [code]: this.data[code] }, `修改${name}`);
      }
    };
    this.$Modal.confirm(config);
  }
  /**
   * 禁用启用部分选项请求
   * @params params 请求用参数
   * @params title 请求成功后提示的标题
   */
  private updateStatus(params: SiteConfigDataType, title: string) {
    this.spinShow = true;
    updateSiteConfig(params)
      .then(res => {
        this.spinShow = false;
        if (res.code === 0) {
          this.$Message.success(`${title}成功`);
          this.getSiteConfig();
          AppModule.getAppSiteList({ pageSize: 1000 });
        }
      })
      .catch(err => {
        this.spinShow = false;
      });
  }
  // 开启立即充值弹窗
  private openModal(key: string) {
    this[key] = true;
  }
  // 开启输入框弹窗
  private openInputModal(title: string, code: string) {
    this.showInputModal = true;
    this.inputModalTitle = title;
    this.inputModalInput = this.data[code];
    this.code = code;
  }
  // 输入框弹窗点击确定
  private InputModalConfirm() {
    let { inputModalTitle, inputModalType, code, data, inputModalInput } = this;
    let Telyz = /^[0-9\-]{8,13}$/;
    // 未输入值
    if (!inputModalInput.length) {
      this.$Message.error(`请输入${inputModalTitle}`);
      return false;
    }
    // 值没发生变化
    if (inputModalInput === data[code]) {
      this.$Message.error(`新的${inputModalTitle}和之前的一样`);
      return false;
    }
    // 验证客服电话
    if (code === "servicePhone") {
      if (!Telyz.test(inputModalInput)) {
        this.$Message.error(`客服电话格式错误`);
        return false;
      }
    }
    // 进行请求
    this.updateStatus({ [code]: inputModalInput }, `修改${inputModalTitle}`);
    this.closeInputModal();
  }
  // 关闭输入框输入弹窗
  private closeInputModal() {
    this.closeModal("showInputModal");
    // 重置弹簧的对应属性值
    setTimeout(() => {
      this.inputModalTitle = "";
      this.code = "";
      this.inputModalInput = "";
    }, 300);
  }
  // 余额预警弹窗点击确定
  private warnModalConfirm() {
    (this.$refs.warnModal as Vue).validate((valid: boolean) => {
      if (valid) {
        this.closeModal("showWarnModal");
        this.updateStatus({ sitePhone: this.data.sitePhone }, `修改预警手机号`);
      }
    });
  }
  /**
   * 关闭弹窗
   * @params key {string} 需要关闭弹窗的值
   */
  private closeModal(key: string) {
    this[key] = false;
  }
  // 获取站点配置
  private getSiteConfig() {
    getSiteConfig().then(res => {
      this.data = res.data;
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
    .logo-upload {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
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
.control {
  width: 300px !important;
}
</style>
