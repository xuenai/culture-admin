<template>
  <div class="member">
    <!-- 基础展示部分 -->
    <div class="member-view" v-if="!showSetting">
      <div class="member-header">
        <h3>会员体系</h3>
        <p>管理会员等级，创建积分任务</p>
      </div>
      <div class="info">
        <p>1、会员营销：激励会员、引导会员行为、提升会员活跃度的一种有效营销机制。可建立会员体系，可动态添加会员等级，可自定义编辑等级名称、等级积分段、等级图标等，让会员营销更具灵活性。</p>
        <p>2、成长体系：可以对会员积分的获取与消耗方式进行自定义。比如通过签到、消费、参与活动获得积分。</p>
        <p>3、积分兑换：会员可通过参与活动消耗积分也可在积分商城中消耗积分等。</p>
      </div>
      <div class="btns">
        <div v-if="!vipPlayStatus">
          <Button class="btn" type="primary" @click="updateSiteConfig(true)">确认开通</Button>
        </div>
        <div v-else>
          <Button class="btn" type="primary" @click="changeShowSetting">配置规则</Button>
          <Button class="btn" @click="close" type="error">关闭</Button>
        </div>
      </div>
    </div>
    <!-- 会员等级配置和任务配置 -->
    <div v-else>
      <MemberSetting />
    </div>
  </div>
</template>


<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { ModalConfig } from "iview/types";

import MemberSetting from './member-setting.vue';
import { AppModule } from "@store/modules/app";
import { getSiteConfig, updateSiteConfig} from "@service/setting";

@Component({
  components: {
    MemberSetting
  }
})
export default class MemberSystem extends Vue {
  // 是否开启了会员玩法
  vipPlayStatus = false;
  // 是否展示会员等级配置和任务配置；
  showSetting = false;
  created () {
    this.getLocalSettingData()
  }
  /**
   * getLocalSettingData 获取站点的基本配置，判断用户是否开启会员玩法
   */
  getLocalSettingData () {
    // 全局弹窗蒙层
    AppModule.setAppFixedLoadingStatus(true)
    getSiteConfig().then(res => {
      if (res.code === 0) {
        this.vipPlayStatus = res.data.vipPlayStatus;
        if (this.vipPlayStatus && this.$route.query.name) {
          this.showSetting = true;
        }
      } else {
        this.$router.push({path: '/error', query: {
          msg: res.message
        }})
      }
    }).finally(() => {
      AppModule.setAppFixedLoadingStatus(false)
    })
  }
  /**
   * 开启关闭会员体系
   * @params vipPlayStatus {boolean} 是否开启会员体系
   */
  updateSiteConfig (vipPlayStatus: boolean) {
    updateSiteConfig({vipPlayStatus}).then(res => {
      if (res.code === 0) {
        this.$Message.success(vipPlayStatus ? `开启会员体系成功` : `关闭会员体系成功`)
        this.vipPlayStatus = vipPlayStatus;
      }
    })
  }
  /**
   * close 关闭会员体系
   */
  close () {
    this.closeModalStep1()
  }
  // 关闭会员体系弹窗1
  closeModalStep1 () {
    let config: ModalConfig = {
      title: "操作提示",
      content: `您关闭会员体系后，会员积分和等级将失效不在展示！`,
      okText: "我再考虑考虑",
      cancelText: "知道了，下一步",
      onCancel: () => {
        setTimeout(this.closeModalStep2, 400)
      }
    };
    this.$Modal.confirm(config);
  }
  // 关闭会员体系弹窗2
  closeModalStep2 () {
    let config: ModalConfig = {
      title: "操作提示",
      content: `您关闭会员体系后，会员将无法活得积分`,
      okText: "知道了，下一步",
      cancelText: "我再考虑考虑",
      onOk: () => {
        setTimeout(this.closeModalStep3, 400)
      }
    };
    this.$Modal.confirm(config);
  }
  // 关闭会员体系弹窗3
  closeModalStep3 () {
    let config: ModalConfig = {
      title: "操作提示",
      content: `您关闭会员体系后，用户将不能再积分商城兑换商品`,
      okText: "关关关",
      cancelText: "我再考虑考虑",
      onOk: () => {
        this.updateSiteConfig(false)
      }
    };
    this.$Modal.confirm(config);
  }
  // 点击配置规则
  changeShowSetting () {
    AppModule.setAppFixedLoadingStatus(true);
    this.showSetting = !this.showSetting;
    setTimeout(() => {
      AppModule.setAppFixedLoadingStatus(false);
    }, 300)
  }

}
</script>

<style lang='scss' scoped>
.member-view{
  padding:15px;
}
.member-header{
  padding:24px;
  background: $grayDark;
  h3{
    padding-bottom:12px;
    font-size:18px;
    color:$font01;
    font-weight: 700;
  }
  p{
    font-size:14px;
  }
}
.info{
  max-width: 900px;
  padding:12px 0 0 12px;
  font-size:12px;
  line-height:28px;
}
.btns{
  padding:24px 12px;
  div{
    padding-bottom:24px;
  }
  .btn{
    min-width:80px;
    margin-right:24px;
  }
}
</style>
