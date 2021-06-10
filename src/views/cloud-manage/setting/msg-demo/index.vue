<template>
  <div class="container">
    <div class="headerRight">
      <div class="integral tc">
        <h3>{{data.smsNum || 0}}</h3>
        <p>短信剩余条数</p>
      </div>
      <div class="mt20">
        <Button
          type="primary"
          @click="openModal('showModal')"
        >充值</Button>
      </div>
      <div class="ml20 mt20">
        <Button
        type="primary"
        @click="openModal('showWarnModal')"
        >余额预警</Button>
      </div>
      <div class="ml20 mt20">
          <p>提醒手机号：<span>{{data.sitePhone ? data.sitePhone.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2") : ''}}</span></p>
      </div>
    </div>
    <div class="mt20 theme-blue">消息模板实例</div>
    <ul class="item mt20">
      <li class="items header tc clearfix">
        <div class="w7">对象</div>
        <div class="w15">时间</div>
        <div class="w48"><p>模板内容</p></div>
        <div class="w15">公众号推送</div>
        <div class="w15">短信推送</div>
      </li>
      <li class="items clearfix">
        <div class="w7">用户</div>
        <div class="w15">发现身边</div>
        <div class="w48"><p>发现你身边有好多好玩的、好吃的。快去看看吧！</p></div>
        <div class="w15"><i class="cloud-icon">&#xe6da;</i></div>
        <div class="w15"><i class="cloud-icon">&#xe6da;</i></div>
      </li>
      <li class="items clearfix">
        <div class="w7">经营</div>
        <div class="w15">企业上云账号创建成功</div>
        <div class="w48"><p>【短信签名】你的文旅企业端账号已创建成功。登录账户：{手机号} 密码：daqsoft  请通过电脑打开：http://ct.b.jkxds.net/  进行登录。</p></div>
        <div class="w15"><i class="cloud-icon">&#xe6da;</i></div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
      </li>
      <li class="items clearfix">
        <div class="w7">用户</div>
        <div class="w15">投诉提交成功</div>
        <div class="w48"><p>
          公众号推送：<br/>
          亲爱的，您的投诉已提交成功，请耐心等候管理员的处理结果吧！<br/>
          被投诉者：{阿里巴巴}<br/>
          投诉内容：{环境差，协商不换房，不退款。}<br/>
          点击查看投诉详情</p>
        </div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
        <div class="w15"><i class="cloud-icon">&#xe6da;</i></div>
      </li>
      <li class="items clearfix">
        <div class="w7">用户</div>
        <div class="w15">投诉处理结果</div>
        <div class="w48"><p>
          公众号推送：<br/>
          亲爱的，您的投诉管理员有新的处理结果了，快去查看吧！<br/>
          被投诉者：{阿里巴巴}<br/>
          投诉内容：{环境差，协商不换房，不退款。}<br/>
          回复内容：{我们已经协商，您可静候佳音！}<br/>
          点击查看回复详情</p>
        </div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
        <div class="w15"><i class="cloud-icon">&#xe6da;</i></div>
      </li>
      <li class="items clearfix">
        <div class="w7">用户</div>
        <div class="w15">活动室预约成功</div>
        <div class="w48"><p>
          【短信签名】您提交的{文化场馆}的{活动室}预约已审核通过，时间为{2019-06-27 10:00-11:30} ,电子消费码：{02455679922}，查看详情：{页面地址}<br/>
          公众号推送：<br/>
          您提交的活动室预约已审核通过，快去查看吧！<br/>
          活动室名称：{自习室}（{文化场馆}）<br/>
          预约时间：{2019-06-27 10:00-11:30}<br/>
          活动地点：<br/>
          电子消费码：{0123456}<br/>
          点击查看详情</p>
        </div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
      </li>
      <li class="items clearfix">
        <div class="w7">用户</div>
        <div class="w15">活动室预约失败</div>
        <div class="w48"><p>
         【短信签名】您预约的{2019-06-27 10:00-11:30}使用{文化场馆}的{活动室}审核不通过，不通过原因：{不通过原因描述}，查看详情：{页面地址}<br/>
          公众号推送：<br/>
          您提交的活动室预约审核不通过。<br/>
          活动室名称：{自习室}（{文化场馆}）<br/>
          预约时间：{2019-06-27 10:00-11:30}<br/>
          活动地点<br/>
          不通过的原因：{不通过的原因}<br/>
          点击查看详情</p>
        </div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
      </li>
      <li class="items clearfix">
        <div class="w7">用户</div>
        <div class="w15">活动室预约核销</div>
        <div class="w48"><p>
          公众号推送：<br/>
          亲爱的用户，您的活动室预约订单已成功核销！<br/>
          活动室名称：{自习室}（{文化场馆}）<br/>
          预约时间：{2019-06-27 10:00-11:30}<br/>
          活动地点<br/>
          核销时间：{2019-06-27 09:59}<br/>
          点击查看详情</p>
        </div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
        <div class="w15"><i class="cloud-icon">&#xe6da;</i></div>
      </li>
      <li class="items clearfix">
        <div class="w7">用户</div>
        <div class="w15">活动预订成功</div>
        <div class="w48"><p>
          【短信签名】您已成功预订{活动名称}活动，时间：{2019-06-27 10:00-11:30}，地点：{地址}，座位号：{32排02座}，预订数量：{1}，电子消费码{02455679922}，查看详情：{页面地址}<br/>
          公众号推送：<br/>
          亲爱的，您的活动预约已成功！<br/>
          活动名称：{这里是活动名称}<br/>
          活动时间：{2019-06-27 10:00-11:30}<br/>
          活动地点：{泸州市xxxxx}<br/>
          电子消费码：{01234567489}<br/>
          内容：座位号：{32排02座} 预订数量：{1}<br/>
          点击查看详情</p>
        </div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
      </li>
      <li class="items clearfix">
        <div class="w7">用户</div>
        <div class="w15">活动预约核销</div>
        <div class="w48"><p>
          公众号推送：<br/>
          亲爱的，您的活动预约订单已成功核销！<br/>
          活动名称：{这里像是活动名称}<br/>
          活动时间：{2019-06-27 10:00-11:30}<br/>
          活动地点：{泸州市xxxxx}<br/>
          核销时间：{时间}<br/>
          点击查看详情</p>
        </div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
        <div class="w15"><i class="cloud-icon">&#xe6da;</i></div>
      </li>
      <li class="items clearfix">
        <div class="w7">用户</div>
        <div class="w15">活动报名成功</div>
        <div class="w48"><p>
         【短信签名】您已成功报名{活动名称}活动，时间：{2019-06-27 -2019-07-27}，地点：{泸州市xxxxx}，电子消费码{02455679922}，查看详情：{页面地址}<br/>
          公众号推送：<br/>
          亲爱的，您的活动报名已成功！<br/>
          活动名称：{这里是活动名称}<br/>
          活动时间：{2019-06-27 10:00-11:30}<br/>
          活动地点：{泸州市xxxxx}<br/>
          电子消费码：{01234567489}<br/>
          点击查看详情</p>
        </div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
      </li>
      <li class="items clearfix">
        <div class="w7">用户</div>
        <div class="w15">报名活动核销</div>
        <div class="w48"><p>
          公众号推送：<br/>
          亲爱的，您的报名活动订单已成功核销！<br/>
          活动名称：{这里像是活动名称}<br/>
          活动时间：{2019-06-27 10:00-11:30}<br/>
          活动地点：{泸州市xxxxx}<br/>
          核销时间：{2019-06-27 09:59}<br/>
          点击查看详情</p>
        </div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
        <div class="w15"><i class="cloud-icon">&#xe6da;</i></div>
      </li>
      <li class="items clearfix">
        <div class="w7">文旅企业端</div>
        <div class="w15">投诉提交成功</div>
        <div class="w48"><p>
          短信推送：<br/>
          管理员，有用户投诉需要处理！<br/>
          投诉者：{梦姑娘}<br/>
          投诉者手机号：{17761232445}<br/>
          被投诉者：{阿里巴巴}<br/>
          投诉内容：{环境差，协商不换房，不退款。}<br/>
          查看详情</p>
        </div>
        <div class="w15"><i class="cloud-icon">&#xe6da;</i></div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
      </li>
      <li class="items clearfix">
        <div class="w7">文旅企业端</div>
        <div class="w15">内容审核结果</div>
        <div class="w48"><p>
          短信推送：<br/>
          管理员，您提交的内容已通过审核！<br/>
          审核结果：{审核通过}；<br/>
          审核意见：{—}<br/>
          查看详情</p>
        </div>
        <div class="w15"><i class="cloud-icon">&#xe6da;</i></div>
        <div class="w15"><i class="cloud-icon">&#xe6da;</i></div>
      </li>
       <li class="items clearfix">
        <div class="w7">用户</div>
        <div class="w15">关注的社团动态</div>
        <div class="w48"><p>
          公众号推送：<br/>
          您关注的社团更新了，快去查看吧！<br/>
          名称：{活动/资讯名称}<br/>
          点击查看详情<br/>
          </p>
        </div>
        <div class="w15"><i class="cloud-icon">&#xe6da;</i></div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
      </li>
      <li class="items clearfix">
        <div class="w7">用户</div>
        <div class="w15">实名认证成功</div>
        <div class="w48"><p>
          【短信签名】尊敬的用户您好，您提交的实名认证已通过审核。查看详情：{页面地址}<br/>
          公众号推送：<br/>
          尊敬用户您好，您提交的实名认证已通过审核。<br/>
          不通过原因：{不通过原因描述}<br/>
          点击查看详情<br/>
          </p>
        </div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
      </li>
      <li class="items clearfix">
        <div class="w7">用户</div>
        <div class="w15">实名认证不成功</div>
        <div class="w48"><p>
          【短信签名】尊敬的用户您好，您提交的实名认证未通过审核，不通过原因：{不通过原因描述}。<br/>
          公众号推送：<br/>
          尊敬用户您好，您提交的实名认证未通过审核。<br/>
          点击查看详情<br/>
          </p>
        </div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
      </li>
      <li class="items clearfix">
        <div class="w7">用户</div>
        <div class="w15">做任务赚积分提醒</div>
        <div class="w48"><p>
          公众号推送：<br/>
          每日做任务赚积分的时间到啦！<br/>
          预约项目：积分任务提醒<br/>
          预约时间：10:00<br/>
          点击查看详情 (跳转至会员首页)</p>
        </div>
        <div class="w15"><i class="cloud-icon success">&#xe628;</i></div>
        <div class="w15"><i class="cloud-icon">&#xe6da;</i></div>
      </li>
    </ul>
    <!-- 余额预警弹窗 -->
    <Modal v-model="showWarnModal" title="余额预警" class="modal-local-settin-info" :closable="false">
      <Form :label-width="90" :model="data" :rules="validate" ref="warnModal">
        <FormItem label="预警手机号:" prop="sitePhone">
          <Input type="text" v-model="data.sitePhone" style="width:200px;" />
        </FormItem>
        <FormItem>
          <p>短信条数低于500条时，将通过手机短信进行提醒。每天提醒1次。</p>
        </FormItem>
      </Form>
      <div class="addModal-footer" slot="footer">
        <Button class="btn" type="text" size="large" @click="closeModal('showWarnModal')">取消</Button>
        <Button class="btn" type="primary" @click="warnModalConfirm">确定</Button>
      </div>
    </Modal>
    <!-- 机审条数充值按钮点击弹窗 -->
    <Modal v-model="showModal" title="立即充值" :width="400" class="modal-local-settin-info">
      <p style="padding-bottom:12px;">请根据以下方式联系平台客服人员进行短信充值！</p>
      <p>QQ ：2870477231</p>
      <p>微信客服：18030814301</p>
      <p>客服电话：18030814301</p>
      <div class="addModal-footer" slot="footer">
        <Button class="btn" type="text" size="large" @click="closeModal('showModal')">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import { ModalConfig, Input } from "iview/types";
import { getMenuList, upDateMenuStatus, deleteMenu, updateMenuSorts } from "@service/app";
import {getSiteConfig, updateSiteConfig, SiteConfigDataType} from "@service/setting";
import BaseTable from "@components/baseTable/baseTable.vue";
@Component({
  components: {
    BaseTable
  }
})
export default class MsgDemo extends Vue {
  private showWarnModal = false; // 余额预警弹窗
  private inputModalInput = ''; // 输入框弹窗
  private inputModalTitle = ''; // 输入框标题
  // 验证手机号码
  private validate = {
    sitePhone: [{ required: true, validator: this.validatePhone, trigger: "blur" }],
  };
  // 当前站点的数据
  private data:any = {};
  // 点击充值机审条数的弹窗
  private showModal = false;
  // 开启立即充值弹窗
  private openModal(key: string) {
    this[key] = true;
  }
  private code: any;
  // 输入框弹窗点击确定
  private InputModalConfirm () {
    let {inputModalTitle, inputModalType, code, data, inputModalInput} = this
    // 未输入值
    if (!inputModalInput.length) {
      this.$Message.error(`请输入${inputModalTitle}`);
      return false;
    }
    // 值没发生变化
    if (inputModalInput === data[code]) {
      this.$Message.error(`新的${inputModalTitle}和之前的一样`);
      return false
    }
    // 进行请求
    this.updateStatus({ [code]: inputModalInput }, `修改${inputModalTitle}`);
    this.closeInputModal()
  }
   /**
   * 禁用启用部分选项请求
   * @params params 请求用参数
   * @params title 请求成功后提示的标题
   */
   private spinShow: boolean | undefined;
  private updateStatus(params: SiteConfigDataType, title: string) {
    this.spinShow = true;
    updateSiteConfig(params)
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
      this.inputModalTitle = '';
      this.code = '';
      this.inputModalInput = '';
    }, 300)
  }
  // 余额预警弹窗点击确定
  private warnModalConfirm () {
    (this.$refs.warnModal as Vue).validate((valid: boolean) => {
      if (valid) {
        this.closeModal('showWarnModal');
        this.updateStatus({ sitePhone: this.data.sitePhone }, `修改预警手机号`);
      }
    });
  }
  // 获取站点配置
  private getSiteConfig() {
    getSiteConfig().then(res => {
      this.data = res.data;
    });
  }
  /**
   * 关闭弹窗
   * @params key {string} 需要关闭弹窗的值
   */
  private closeModal(key:string) {
    this[key] = false;
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
  mounted() {
    this.getSiteConfig();
    this.tableData;
  }
}
</script>
<style lang='scss' scoped>
.container{
  padding: 20px;
}
.headerRight {
    height: 80px;
    border-bottom: 1px solid #f2f2f2;
    .integral{
      width: 170px;
      height: 100%; 
    }
    > div {
      float: left;
      h3 {
        color: $theme;
        font-size: 24px;
      }
      p {
        color: $font04;
        font-size: 14px;
        height: 36px;
        line-height: 36px;
      }
    }
}
.item{
  width: 100%;
  border-bottom: 1px solid #ccc;
  .items{
    line-height: 22px;
    border-right: 1px solid #ccc;
    border-top: 1px solid #ccc;
    display: flex;
    div{
      // float: left;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 0;
      border-left: 1px solid #ccc;
    }
    .w7{
      width: 7%;
    }
    .w15{
      width: 15%;
    }
    .w48{
      width: 48%;
      justify-content: left;
      padding: 0 10px;
      p {
        width: 100%;
      }
    }
    .success{
      color: $success !important;
      font-size: 16px;
    }
  }
  .header{
    .w48{
      justify-content: center;
    }
  }
}
</style>
