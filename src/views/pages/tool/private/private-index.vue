<template>
  <div class="member">
    <!-- 基础展示部分 -->
    <div class="member-view">
      <div class="member-header">
        <h3>产品内测</h3>
        <p>产品体验邀请制，目标用户精准体验，反馈意见快速收集，产品优化快速响应。</p>
      </div>
      <div class="info">
        <p>1、内测人员：内测人员为产品部分目标用户，优先体验产品。</p>
        <p>2、内测规则：只有收到内测邀请码的用户才能进行内测，邀请码使用一次后失效，防止产品外泄。</p>
        <p>3、内测反馈：内测用户可通过 个人中心的意见反馈入口填写自己的产品体验感受、意见和建议等，产品负责人根据相关内容进行产品优化升级。</p>
      </div>
      <div class="btns">
        <div v-if="!betaStatus">
          <Button class="btn" type="primary" @click="updateSiteConfig(true)">确认开通</Button>
        </div>
        <div v-else-if="betaStatus">
          <Button class="btn" type="primary" @click="changeShowSetting">内测设置</Button>
          <Button class="btn" @click="close">关闭</Button>
        </div>
        <!-- <div v-else-if="betaStatus">
          <Button class="btn" type="primary" @click="changeShowSetting">内测设置</Button>
          <Button class="btn" @click="updateSiteConfig(true)">开启</Button>
        </div>-->
      </div>
    </div>
  </div>
</template>


<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

import { AppModule } from "@store/modules/app";
import { ModalConfig } from "iview/types";
import { getSiteUserInfo, saveCloudSite } from "@service/common";
import { getSiteConfig, updateSiteConfig } from "@service/setting";

@Component({
  components: {}
})
export default class MemberSystem extends Vue {
  // 是否开启了产品内测
  private betaStatus: boolean = false;
  // 获取站点配置
  private getSiteConfig() {
    getSiteConfig().then(res => {
      if (res.code === 0) {
        this.betaStatus = res.data.betaStatus;
      }
    });
  }

  created() {
    this.getSiteConfig();
  }
  changeShowSetting() {
    this.$router.push({ path: "/people-management" });
  }
  /**
   * 开启产品内测
   * @params betaStatus {boolean} 是否开启产品内测
   */
  updateSiteConfig(status: any) {
    updateSiteConfig({ betaStatus: status }).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success(status ? `开启内测成功` : `关闭内测成功`);
        this.getSiteConfig();
      }
    });
  }

  /**
   * close 关闭产品内测
   */
  close() {
    let config: ModalConfig = {
      title: "操作提示",
      content: `您关闭产品内测功能后，所有用户都可以正常访问！`,
      okText: "关关关",
      cancelText: "我再考虑考虑",
      onOk: () => {
        this.updateSiteConfig(false);
      }
    };
    this.$Modal.confirm(config);
  }
}
</script>

<style lang='scss' scoped>
.member-view {
  padding: 15px;
}

.member-header {
  padding: 24px;
  background: $grayDark;
  h3 {
    padding-bottom: 12px;
    font-size: 18px;
    color: $font01;
    font-weight: 700;
  }
  p {
    font-size: 14px;
  }
}

.info {
  max-width: 900px;
  padding: 12px 0 0 12px;
  font-size: 12px;
  line-height: 28px;
}

.btns {
  padding: 24px 12px;
  div {
    padding-bottom: 24px;
  }
  .btn {
    min-width: 80px;
    margin-right: 24px;
  }
}
</style>
