<template>
  <div class="container pd20">
    <Head resourceType="CONTENT_TYPE_ACTIVITY_SHIU"></Head>
    <Form ref="formInline" :label-width="100" :model="params" :rules="ruleValidate">
      <!--个性标签-->
      <div class="tips-panel clearfix">
        <span class="fl title">预约信息</span>
      </div>
      <FormItem label="开放预约：" prop="isOpen" class="mt20">
        <RadioGroup v-model="isOpen">
          <Radio label="开放"></Radio>
          <Radio label="不开放"></Radio>
        </RadioGroup>
      </FormItem>
      <FormItem class="mt20 ruleTime" label="预约时间：" v-if="params.isOpen==1">
        <span class="required">*</span>
        <RadioGroup v-model="setRule">
          <Radio label="通用规则"></Radio>
          <Radio label="分别设置"></Radio>
        </RadioGroup>
        <!--通用规则设置时间段-->
        <div class="date-item mt10" v-if="setRule==='通用规则'">
          <div v-for="(item,index) in orderRuleData[0].data" :key="index" class="mt10">
            <TimePicker
              type="timerange"
              class="time"
              format="HH:mm"
              :disabled-hours="index>0 ? disabledHours:[]"
              :editable="false"
              :clearable="false"
              placement="bottom-start"
              placeholder="请选择时间段"
              confirm
              v-model="item.time"
            ></TimePicker>
            <Input class="control ml10" placeholder="备注信息" :maxlength="50" v-model="item.remarks" />
            <span
              class="cloud-icon opera minus"
              @click="deleteLine(0,'',index)"
              v-if="index==orderRuleData[0].data.length-1"
            >&#xe65d;</span>
            <span
              class="cloud-icon opera add"
              v-if="index==orderRuleData[0].data.length-1"
              @click="addLine(0,index)"
            >&#xe604;</span>
          </div>
        </div>
        <!--分开设置时间段-->
        <div class="setDifferent mt10" v-else>
          <!--周一至周日切换-->
          <ul class="clearfix tab-wrap">
            <li
              class="fl tab-name"
              v-for="(item,index) in orderRuleData"
              :key="index"
              :class="index===activedIndex ? 'active':''"
              @click="changeTab(index)"
            >{{item.name}}</li>
          </ul>
          <!--时间段输入-->
          <div class="set-content mt10">
            <div
              class="date-item"
              :class="parentIndex"
              v-if="parentIndex===activedIndex"
              v-for="(parentItem,parentIndex) in orderRuleData"
              :key="parentIndex"
            >
              <div v-for="(childItem,childIndex) in parentItem.data" :key="childIndex" class="mt10">
                <TimePicker
                  type="timerange"
                  confirm
                  class="time"
                  format="HH:mm"
                  :disabled-hours="childIndex>0 ? disabledHours:[]"
                  :editable="false"
                  :clearable="false"
                  placement="bottom-start"
                  placeholder="请选择时间段"
                  v-model="childItem.time"
                ></TimePicker>
                <Input
                  class="control ml10"
                  v-model="childItem.remarks"
                  :maxlength="50"
                  placeholder="备注信息"
                />
                <span
                  class="cloud-icon opera minus"
                  @click="deleteLine(parentIndex,childItem.id||'',childIndex)"
                  v-if="childIndex==parentItem.data.length-1"
                >&#xe65d;</span>
                <span
                  class="cloud-icon opera add"
                  v-if="childIndex==parentItem.data.length-1"
                  @click="addLine(parentIndex,childIndex)"
                >&#xe604;</span>
              </div>
            </div>
          </div>
        </div>
      </FormItem>
      <FormItem
        class="free-trial mt20"
        label
        :error="faithAuditStatus && !faithAuditValue?faithAuditError='请设置用户诚信分值':faithAuditError=''"
        v-if="params.isOpen==1 && $store.state.app.siteInfo.creditStatus === 1"
      >
        <div class="label">
          <img src="@assets/image/credit_icon1.png" alt />
        </div>
        <div class="item">
          <i-switch
            v-model="faithAuditStatus"
            @on-change="setStatus"
            true-color="#19BE6B"
            size="large"
          >
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
          <span class="tips">（只有诚信分值达到设置标准的用户预约活动室不需要审核，直接预约成功）</span>
        </div>
        <div class="item mt10" v-if="faithAuditStatus">
          用户诚信分值达
          <InputNumber v-model="faithAuditValue" class="inp-control w150" :max="9999" :min="0"></InputNumber>分以上可享受预约免审核权益
          <span class="check-level" @click="CreditLevelShow=true">用户诚信等级</span>
        </div>
      </FormItem>
      <FormItem
        class="mt20 cancel-set"
        label="取消设置："
        prop="cancelStatus"
        :error="params.cancelStatus==3&&!params.cancelTime?cancelTimeError='请输入自定义取消时间':cancelTimeError=''"
        v-if="params.isOpen==1"
      >
        <RadioGroup v-model="params.cancelStatus">
          <Radio label="0">不可取消</Radio>
          <Radio label="1">随时取消</Radio>
          <Radio label="2">开始使用24小时前可取消</Radio>
          <Radio label="3">
            自定义可取消时间：
            <div class="item">
              开始使用
              <InputNumber
                :precision="0"
                class="w150"
                type="text"
                v-if="params.cancelStatus==3"
                v-model="params.cancelTime"
                placeholder="请输入小时数"
              />
              <InputNumber
                :precision="0"
                class="w150"
                disabled
                type="text"
                v-else
                placeholder="请输入小时数"
              />小时前可取消
            </div>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="座位模板：" class="mt20" v-if="!params.templateName && params.isOpen==1">
        <Button type="primary" @click="editTemplate('edit')">添加</Button>
      </FormItem>
      <FormItem label="座位模板名称：" class="mt20" v-if="params.templateName && params.isOpen==1">
        <p class="template-name">{{params.templateName}}</p>
        <div class>
          <a href="javascript:;" class="theme-blue" @click="checkTemplate">查看</a>
          <a href="javascript:;" class="theme-blue ml5" @click="editTemplate('edit')">修改</a>
          <a href="javascript:;" class="theme-blue ml5" @click="seatTemplateDelete">删除</a>
        </div>
      </FormItem>
      <FormItem label class="submit">
        <Button class="w150" type="primary" @click="handleSumit">保存</Button>
        <Button class="w150 ml20 btn-cancel" @click="goBack">返回</Button>
      </FormItem>
    </Form>
    <!--座位模板弹窗-->
    <seatTemplate
      :show="templateShow"
      :data="templateData"
      @getData="getSeatInfo"
      :state="templateState"
      :footer="footerShow"
      @onClose="templateShow=false"
    ></seatTemplate>
    <CreditLevel :show="CreditLevelShow" @close="CreditLevelShow = false"></CreditLevel>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Head from "./head.vue";
import uploadImg from "@components/upload/upload-image.vue";
import seatTemplate from "@components/seatTemplate/seatTemplate.vue";
import CreditLevel from "@components/pop/credit-level.vue";
import {
  saveOrderRule,
  deleteRule,
  getRuleDataInfo,
  deleteTemplateAndActivityRoom
} from "@service/place";

const list = [
  {
    name: "周日",
    data: [{ time: [], remarks: "", price: 0 }]
  },
  {
    name: "周一",
    data: [{ time: [], remarks: "", price: 0 }]
  },
  {
    name: "周二",
    data: [{ time: [], remarks: "", price: 0 }]
  },
  {
    name: "周三",
    data: [{ time: [], remarks: "", price: 0 }]
  },
  {
    name: "周四",
    data: [{ time: [], remarks: "", price: 0 }]
  },
  {
    name: "周五",
    data: [{ time: [], remarks: "", price: 0 }]
  },
  {
    name: "周六",
    data: [{ time: [], remarks: "", price: 0 }]
  }
];
@Component({
  components: {
    uploadImg,
    Head,
    seatTemplate,
    CreditLevel
  }
})
export default class roomReserve extends Vue {
  //请求参数
  private params: any = {
    roomId: "", //活动室id
    venueId: "", //场馆id
    templateId: "", //模板id
    templateName: "",
    isOpen: 0, //是否开放 0:不开放 1:开放
    setType: 1, //分别设置
    orderRuleData: [], //预约时间
    faithAuditStatus: 0, //1开启免审 0关闭免审
    faithAuditValue: 500, //用户诚信值
    cancelStatus: "0", //不可取消0，随时取消1，24小时内2，自定义取消时间3
    cancelTime: "" //取消时间
  };
  private faithAuditValue: number = 500;
  private faithAuditError: string = ""; //用户诚信值错误提示
  private cancelTimeError: string = ""; //自定义取消时间错误提示
  /*S用户等级弹窗*/
  //等级弹窗显示布尔值
  private CreditLevelShow: boolean = false;
  /*E用户等级弹窗*/

  /*S 预约时间 */
  private activedIndex: number = 0;
  //通用时间
  private time: Array<object> = [];
  private setRule: string = "分别设置";

  @Watch("setRule")
  //设置开放时间段
  getSetRule() {
    (this.params as any).setType = this.setRule == "通用规则" ? 0 : 1;
  }

  /*S诚信免审*/
  private faithAuditStatus: boolean = false;
  setStatus(val: any) {
    (this.params as any).faithAuditStatus = val === true ? 1 : 0;
  }

  /*E诚信免审*/

  //tab 切换
  //活动室预约时间规则
  private orderRuleData: any = list;

  //切换开放时间
  changeTab(index: number) {
    this.activedIndex = index;
  }

  //新增一行时间段设置
  private disabledHours: Array<any> = [];

  addLine(parentIndex: any, childIndex: any) {
    let _this = this,
      startTime = (_this.orderRuleData as any)[parentIndex].data[childIndex]
        .time[0], //开始时间
      endTime = (_this.orderRuleData as any)[parentIndex].data[childIndex]
        .time[1]; //结束时间
    if (!startTime || !endTime) {
      _this.$Message.error("请先填写时间段再添加");
    } else {
      //添加一行
      if ((this.params as any).setType == 0) {
        //通用规则
        for (let i = 0; i < _this.orderRuleData.length; i++) {
          (_this.orderRuleData as any)[i].data.push({
            time: [],
            remarks: "",
            price: 0,
            id: ""
          });
        }
      } else {
        (_this.orderRuleData as any)[parentIndex].data.push({
          //分别设置
          time: [],
          remarks: "",
          price: 0,
          id: ""
        });
      }
      let timeCount =
        parseInt(endTime.substr(0, 1)) > 0
          ? endTime.substr(0, 2)
          : endTime.substr(1, 1);
      _this.disabledHours = [];
      for (let i = 0; i < timeCount; i++) {
        if (i <= 9) {
          _this.disabledHours.push(parseInt("0" + i));
        } else {
          _this.disabledHours.push(i);
        }
      }
    }
  }

  //删除一行时间段设置
  /**
   * 参数 parentIndex:周一~ 周天的索引
   *      id:当前行id
   *      index:点击索引值
   * */
  deleteLine(parentIndex: any, id: any, index: any) {
    let _this = this,
      _ids: any = [],
      ids = "";

    if ((this.params as any).setType == 0) {
      //通用规则
      for (let i = 0; i < _this.orderRuleData.length; i++) {
        let item = (_this.orderRuleData as any)[i].data[index];
        if (item.id && item.time[0] && item.time[1]) {
          _ids.push(item.id);
        }
      }
    } else {
      //分别设置
      _ids.push(id);
    }
    ids = _ids.join(",");
    if (ids.length > 0) {
      //有id值 则是请求借口删除
      let config: any = {
        title: "提示",
        content: "确认删除？",
        okText: "确认",
        cancelText: "关闭",
        onOk: () => {
          deleteRule({ ids: ids }).then((res: any) => {
            if (res.code === 0) {
              _this.$Message.success("删除成功");
              (_this.orderRuleData as any)[parentIndex].data.pop();
              _this.getInitRuleList(parentIndex, index); //初始化
            }
          });
        }
      };
      _this.$Modal.confirm(config);
    } else {
      //静态删除
      (_this.orderRuleData as any)[parentIndex].data.pop();
      _this.getInitRuleList(parentIndex, index); //初始化
    }
  }

  //初始化预约字段
  getInitRuleList(parentIndex: any, index: any) {
    if (index == 0) {
      this.orderRuleData[parentIndex].data.push({
        time: [],
        remarks: "",
        price: 0
      });
    }
  }

  //分别设置时间
  private orderRuleList: Array<object> = [];
  /*E 预约时间 */

  /*S 保存 */
  private isOpen: string = "不开放";

  @Watch("isOpen")
  getIsOpen() {
    (this.params as any).isOpen = this.isOpen == "不开放" ? 0 : 1;
  }

  private templateState: string = "";
  //验证
  private ruleValidate: any = {
    isOpen: [{ required: true, message: "请选择活动室是否开放" }],
    cancelStatus: [{ required: true, message: "请选择取消设置规则" }],
    faithAuditValue: [{ required: true, message: "请将信息填写完整" }]
  };

  //保存
  handleSumit() {
    let _this = this;
    //活动室预约时间
    _this.orderRuleList = [];
    if ((_this.params as any).setType == 1) {
      // setType=1 分别设置
      _this.orderRuleData.forEach((item: any, parentIndex: any) => {
        item.data.forEach((childItem: any) => {
          (_this.orderRuleList as any).push({
            roomId: parseInt((_this.params as any).id), //活动室id
            startTime: childItem.time[0] || "",
            endTime: childItem.time[1] || "",
            week: parentIndex + 1,
            remarks: childItem.remarks,
            price: childItem.price,
            id: childItem.id || ""
          });
        });
      });
    } else {
      // setType=0 通用规则
      for (let i = 0; i < _this.orderRuleData.length; i++) {
        for (
          let child = 0;
          child < (_this.orderRuleData as any)[0].data.length;
          child++
        ) {
          (_this.orderRuleList as any).push({
            roomId: (_this.params as any).id, //活动室id
            startTime:
              (_this.orderRuleData as any)[0].data[child].time[0] || "",
            endTime: (_this.orderRuleData as any)[0].data[child].time[1] || "",
            week: i + 1,
            remarks: (_this.orderRuleData as any)[0].data[child].remarks,
            price: (_this.orderRuleData as any)[0].data[child].price,
            id: (_this.orderRuleData as any)[i].data[child]
              ? (_this.orderRuleData as any)[i].data[child].id || ""
              : ""
          });
        }
      }
    }
    (_this.params as any).orderRuleData = _this.orderRuleList;
    (_this.params as any).venueId = this.$route.query.venueId;
    (_this.params as any).faithAuditStatus = this.faithAuditStatus ? 1 : 0;
    (_this.params as any).faithAuditValue =
      (_this.params as any).faithAuditStatus == 1 ? _this.faithAuditValue : "";
    console.log(_this.params);
    //保存
    let validate = _this.getValidate();
    (_this.$refs.formInline as any).validate((valid: any) => {
      if (
        valid &&
        validate &&
        !_this.faithAuditError &&
        !_this.cancelTimeError
      ) {
        saveOrderRule({ str: JSON.stringify(_this.params) }).then(
          (res: any) => {
            if (res.code === 0) {
              this.$Message.success("保存成功");
              this.$router.go(-1);
            }
          }
        );
      } else {
        this.$Message.error("请将必填项填写完整");
      }
    });
  }

  //验证预约时间段是否填写
  getValidate() {
    let _this = this,
      valid = true,
      count = 0;
    _this.orderRuleList.forEach((item: any) => {
      if (
        (_this.params as any).setType == 0 &&
        !item.startTime &&
        !item.endTime
      ) {
        valid = false;
      } else if (
        (_this.params as any).setType == 1 &&
        item.startTime &&
        item.endTime
      ) {
        count += 1;
      } else {
        valid = true;
      }
    });
    if ((_this.params as any).setType == 1 && count < 1) {
      valid = false;
    }
    return valid;
  }

  /*E 保存 */

  /*S 座位模板 */
  //座位模板弹窗是否显示
  private templateShow: boolean = false;
  //查看模板
  private templateData: any = {
    id: "", //模板id
    name: "" //模板名称
  };
  private footerShow: boolean = false;

  //查看模板
  checkTemplate() {
    let _this = this;
    _this.templateState = "view";
    _this.templateShow = true;
    _this.footerShow = true;
    _this.setTemplateMsg();
  }

  //修改模板
  editTemplate(value: any) {
    let _this = this;
    _this.templateState = "edit";
    _this.templateShow = true;
    _this.footerShow = false;
    if (value == "edit") {
      _this.setTemplateMsg();
    }
  }

  //模板信息
  setTemplateMsg() {
    let _this = this;
    _this.templateData = {
      id: (_this.params as any).templateId,
      name: (_this.params as any).templateName
    };
  }

  //删除模板
  seatTemplateDelete() {
    let params = {
      roomId: (this.params as any).roomId,
      tempId: (this.params as any).templateId
    };
    let config: any = {
      title: "操作提示",
      content: "确认要删除座位模板？",
      okText: "确认删除",
      cancelText: "取消",
      onOk: () => {
        deleteTemplateAndActivityRoom(params).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("删除成功");
            (this.params as any).templateName = "";
            (this.params as any).templateId = "";
          }
        });
      }
    };
    this.$Modal.confirm(config);
  }

  //获取模板信息
  getSeatInfo(data: any) {
    let _this = this;
    (_this.params as any).templateId = data.ID;
    (_this.params as any).templateName = data.NAME;
  }

  /*E 座位模板 */

  /*S 获取页面详情 */
  getRuleDataInfo() {
    let _this = this;
    getRuleDataInfo({
      id: this.$route.query.id
    }).then((data: any) => {
      _this.params = data.data;
      //预约时间段
      let newRuleList: any = [];
      data.data.orderRuleData.forEach((item: any, index: any) => {
        if (item.data.length > 0) {
          newRuleList.push(item);
        } else {
          newRuleList.push({
            name: item.name,
            data: [{ time: [], remarks: "", price: 0 }]
          });
        }
      });
      _this.orderRuleData = newRuleList;
      _this.isOpen = data.data.isOpen == 0 ? "不开放" : "开放";
      _this.setRule = data.data.setType == 0 ? "通用规则" : "分别设置";
      _this.faithAuditStatus = data.data.faithAuditStatus == 1;
      _this.faithAuditValue = data.data.faithAuditValue;
      (_this.params as any).cancelStatus = data.data.cancelStatus.toString();
    });
  }

  /*E 获取页面详情 */

  //返回
  goBack() {
    this.$router.go(-1);
  }

  mounted() {
    if (this.$route.query.id) {
      (this.params as any).id = this.$route.query.id;
      this.getRuleDataInfo();
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  .ruleTime {
    position: relative;
    .required {
      position: absolute;
      left: -84px;
      top: 0;
      font-size: 12px;
      color: #ed4014;
    }
  }
  .w150 {
    width: 150px;
  }
  .control {
    width: 300px;
  }
  .note {
    color: $lightGray;
    font-size: 13px;
  }
  .map {
    height: 400px;
  }
  .tips-panel {
    margin-top: 30px;
    background-color: $grayLight;
    padding: 20px;
    .title {
      position: relative;
      padding-left: 10px;
      color: $font01;
      font-weight: 600;
      font-size: 16px;
      &:after {
        position: absolute;
        left: 0;
        top: 4px;
        content: "";
        width: 3px;
        height: 16px;
        border-radius: 1.5px;
        background-color: $theme;
      }
    }
    .tag-content {
      margin-left: 30px;
      color: $font02;
    }
  }
  .submit {
    margin-top: 35px;
  }
  .opera {
    display: inline-block;
    margin-left: 10px;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
    vertical-align: middle;
    border: 1px solid $borderDark;
    &:hover {
      color: $bg01;
      background-color: $theme;
      border: 1px solid $theme;
    }
  }

  .setDifferent {
    width: 90%;
    border: 1px solid $borderLight;
    padding: 10px 0 20px 0;
    .tab-wrap {
      border-bottom: 1px solid $borderLight;
    }
    .tab-name {
      padding: 0 20px;
      cursor: pointer;
      &.active {
        position: relative;
        &:before {
          position: absolute;
          content: "";
          left: 0;
          bottom: -1px;
          height: 2px;
          width: 90%;
          background-color: $theme;
        }
      }
    }
    .set-content {
      padding-left: 20px;
    }
  }
  .cancel-set {
    .item {
      display: inline-block;
      color: $lightGray;
    }
  }
  .inp-control {
    height: 32px;
    margin: 0 5px 0;
    border: 1px solid #dcdee2;
    border-radius: 4px;
  }
  .free-trial {
    position: relative;
    .tips {
      color: $theColor2;
    }
    .check-level {
      cursor: pointer;
      color: $theColor5;
    }
    .label {
      position: absolute;
      left: -84px;
      top: 0;
      color: #19be6b;
      font-weight: bold;
      img {
        width: 78px;
        height: 16px;
        margin-right: 2px;
        position: relative;
        top: 4px;
      }
    }
  }
}

.template-warp {
  .topic {
    width: 100%;
  }
  .title {
    width: 100%;
    height: 30px;
    background: #f2f4f7;
    margin: 15px 0;
    text-align: center;
    line-height: 30px;
    border-radius: 0 0 30px 30px;
  }
  .sit-list {
    width: 725px;
    margin: 5px auto;
    text-align: center;
    line-height: 24px;
    .sit-l {
      width: 24px;
      height: 24px;
      background: #ccc;
    }
    .sit-r {
      margin-left: 40px;
      .sit-item {
        display: block;
        width: 25px;
        height: 24px;
        margin-right: 5px;
        background: #ccc;
        background: url(../../../../../assets/image/sitBg.png);
        &.curr {
          background: url(../../../../../assets/image/sitNoBg.png) !important;
        }
      }
    }
  }
  .footer {
    margin-top: 40px;
    text-align: center;
  }
}
</style>
