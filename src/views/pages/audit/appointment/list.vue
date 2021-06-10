<!--
 * @Author: 任智勇
 * @since: 2019-07-02 09:58:23
 * @LastAuthor   : 任智勇
 * @lastTime     : 2019-12-31 15:11:52
 -->
<template>
  <div class="container">
    <!--tab切换-->
    <Tabs active-key="key2" class="tab-wrap" :animated="false" @on-click="setStatus">
      <Tab-pane label="全部" key="key1"></Tab-pane>
      <Tab-pane :label="waitNum>0?waitLabel:'待审核'" key="key2"></Tab-pane>
      <Tab-pane label="不通过" key="key3"></Tab-pane>
    </Tabs>
    <div class="topic">
      <Form class="form" ref="formInline" inline :label-width="70">
        <FormItem label="关键字">
          <Input type="text" placeholder="订单号/活动名称" v-model="params.name" style="width: 200px" />
        </FormItem>
        <FormItem label="下单人">
          <Input type="text" placeholder="姓名/手机" v-model="params.phoneOrName" style="width: 200px" />
        </FormItem>
        <FormItem label="下单日期">
          <DatePicker
            format="yyyy-MM-dd"
            type="daterange"
            @on-change="getOrderStartTime"
            placement="bottom-start"
            placeholder="选择活动日期"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <FormItem label="预约日期">
          <DatePicker
            format="yyyy-MM-dd"
            type="daterange"
            @on-change="getIndateStartTime"
            placement="bottom-start"
            placeholder="选择提交日期"
            style="width: 200px"
          ></DatePicker>
          <Button class="ml20" type="primary" @click="getList">搜索</Button>
          <!-- <Button icon="ios-download-outline" class="ml20" type="primary">导出数据</Button> -->
        </FormItem>
      </Form>
    </div>
    <div class="table">
      <!-- 表格头 -->
      <ul class="orderHeader mt15">
        <li>
          <p class="big">
            <span class="order-title">商品信息</span>
          </p>
          <p class="middle">预约人</p>
          <p class="middle">使用人数</p>
          <p class="middle time">预约时间</p>
          <p class="middle">联系电话</p>
          <p class="middle" v-if="siteInfo.creditStatus == 1">诚信分值</p>
          <p class="middle">支付金额</p>
          <p class="middle">订单状态</p>
          <p class="middle">操作</p>
        </li>
      </ul>
      <!-- 表格行 -->
      <ul class="tab">
        <CheckboxGroup v-model="checkList" @on-change="setChecked">
          <li class="rowList clearfix" v-for="(item,index) in list" :key="index">
            <div class="rowlist-top">
              <Checkbox :label="item.id" class="colBox"></Checkbox>
              <div class="detail-text-info">
                <span class="detail-text-label">订单编号：</span>
                <span class="detail-text-text">
                  <router-link
                    :to="{path: 'audit-appointment-detail', query: {id: item.id, activityId: item.activityId}}"
                  >{{item.orderCode}}</router-link>
                </span>
              </div>
              <div class="detail-text-info">
                <span class="detail-text-label">下单时间：</span>
                <span class="detail-text-text">{{item.createTime}}</span>
              </div>
              <div class="detail-text-info">
                <span class="detail-text-label">有效期：</span>
                <span class="detail-text-text">{{item.orderStart}} 至 {{item.orderEnd}}</span>
              </div>
            </div>
            <div class="info">
              <div class="big">
                <div
                  class="fl mr20 ml20 daq-no-photo img-box"
                  :class="{
                                  'faith-audit': (item.faithAuditStatus && item.faithAuditValue),
                                  'faith-use': (item.faithUseStatus && item.faithUseValue)}"
                >
                  <img :src="item.image" @click.stop="viewImage(item.image,item.orderName)" />
                </div>
                <p class="line">
                  <span class="txt title">{{item.orderName}}</span>
                  <span class="txt address">所属场馆：{{item.address}}</span>
                </p>
                <!--<p class="remark" v-if="item.remark">预约备注：{{item.remark}}</p>-->
                <!--<p class="remark" style="background-color: #f7f7f7">审核备注：</p>-->
              </div>
              <div class="middle">{{item.userName}}</div>
              <div class="middle">{{item.useNum}}</div>
              <div class="middle time">{{item.orderStart}} - {{item.orderEnd.split(" ")[1]}}</div>
              <div class="middle">{{item.userPhone}}</div>
              <div class="middle" v-if="siteInfo.creditStatus == 1">{{item.creditScore || '--'}}</div>
              <div class="middle">{{item.payMoney}}</div>
              <div class="middle">
                <span v-if="item.orderStatus==4">待审核</span>
                <span v-else-if="item.orderStatus==79">不通过</span>
              </div>
              <div class="middle">
                <a v-if="item.orderStatus==4" @click="setAudit(item)">审核</a>
                <a v-else @click="deleteRow(item,index)">删除</a>
                <!-- <a v-else @click="setAudit(item.id,item.orderStatus)">复审</a> -->
              </div>
            </div>
            <div class="remark-panel">
              <p class="item" v-if="item.remark">预约备注：{{item.remark}}</p>
              <p class="item audit-remark" v-if="item.auditRemark">审核备注：{{item.auditRemark}}</p>
            </div>
          </li>
          <li v-if="list.length<1" class="text-center mt10 no-data">暂无数据</li>
        </CheckboxGroup>
      </ul>
      <div class="action-buttons mt15" v-if="list && list.length>1">
        <Checkbox v-model="allChecked" @click.prevent.native="setAllChecked">全选</Checkbox>
        <Button type="primary" @click="deleteRow('',-1)">批量删除</Button>
      </div>
      <Page
        class="pages mg20 text-right"
        v-if="showPage"
        @on-change="changePages"
        @on-page-size-change="changeSize"
        :total="params.total"
        :current="params.currPage"
        :page-size-opts="[10,20,50,100]"
        show-elevator
        show-sizer
        show-total
        placement="top"
      />
    </div>
    <Modal
      v-model="modalShow"
      title="审核意见"
      width="500"
      :footer-hide="true"
      :mask-closable="false"
      @on-cancel="cancel"
    >
      <p v-if="statusMsg" class="statusMsg">{{statusMsg}}</p>
      <Form ref="formData" :model="params">
        <FormItem span="24" label class="btn-box form-item">
          <Button
            class="pass audit-btn"
            :class="auditParams.status===11?'active':''"
            :disabled="auditItem.stock !== auditItem.surplusStock"
            @click="setAuditStatus(11)"
          >通过</Button>
          <Button
            class="un-pass audit-btn ml20"
            :class="auditParams.status===79 ?'active':''"
            @click="setAuditStatus(79)"
          >不通过</Button>
        </FormItem>
        <FormItem
          span="24"
          class="mt20 form-item"
          v-if="auditParams.status===79"
          :required="true"
          :error="error"
        >
          <Input
            type="textarea"
            :rows="4"
            :maxlength="200"
            v-model="auditParams.remark"
            placeholder="请写下审核备注，不通过时审核备注必须填写。"
          />
          <span>200字以内</span>
        </FormItem>
        <FormItem span="24" class="mt20 form-item" v-else>
          <Input
            type="textarea"
            :rows="4"
            :maxlength="200"
            v-model="auditParams.remark"
            placeholder="请写下审核备注，不通过时审核备注必须填写。"
          />
          <span>200字以内</span>
        </FormItem>
      </Form>
      <div class="footer text-right">
        <Button class="cancel" @click="cancel" v-if="!wait">取消</Button>
        <Button type="primary" class="ml20" @click="ok" v-if="!wait">确定</Button>
        <Button disabled v-if="wait">取消</Button>
        <Button disabled class="ml20" v-if="wait">确定</Button>
      </div>
    </Modal>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex" :title="imgTitle"></PreviewPics>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { orderList, restartCode } from "@service/place";
import { orderAudit } from "@service/audit";
import { PreviewPics } from "@components/index";
import { orderDelete } from "@service/tool";
import { AppModule } from "@store/modules/app";
import { getCreditUser, getOrderStatusMsg } from "@service/common";

@Component({
  components: {
    PreviewPics
  }
})
export default class ComponentName extends Vue {
  // 审核上面的消息提示
  statusMsg = "";
  auditItem: any = {};
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  get siteInfo() {
    return AppModule.siteInfo;
  }
  //全选e
  private allChecked: any = false;
  // 复选框
  private checkList: any = [];
  private showPage: boolean = false;
  // 请求参数
  private params: object = {
    resourceType: "CONTENT_TYPE_ACTIVITY_SHIU", // 资源类型
    orderStatus: "", // 订单状态
    name: "", // 关键字
    phoneOrName: "", // 下单人/手机号
    orderStartTime: "", // 下单日期
    indateStartTime: "", // 预约日期
    valid: "1", // 1为审核列表
    currPage: 1, // 当前第几页
    pageSize: 10, // 当前页数量
    total: 6 // 总页数
  };
  private list: Array<object> = [];

  /* S 查看大图 */
  private visible: Boolean = false;
  private imgUrl: Array<string> = [];
  private imgTitle: String = "";
  private currIndex = 0;
  private viewImage(url: any, name: String, index?: number) {
    // 判断url的类型 如果是数组 则直接赋值 如果不是数组 则先清空数组 再将url写到数组里面去
    if (Object.prototype.toString.call(url) === "[object Array]") {
      this.imgUrl = url;
    }
    if (Object.prototype.toString.call(url) === "[object String]") {
      this.imgUrl = [];
      this.imgUrl.push(url);
    }
    this.imgTitle = name;
    this.visible = true;
    this.currIndex = index || 0;
  }
  /* E 查看大图 */

  // 获取列表
  getList() {
    let _this = this;
    orderList(_this.params).then((res: any) => {
      if (res.code === 0) {
        let tels: string = "";
        _this.list = res.datas.map((item: any) => {
          item.creditScore = "";
          if (item.accountPhone) tels += (item.accountPhone as string) + ",";
          return item;
        });
        if (tels) {
          getCreditUser({
            platformCode: this.$store.state.app.userInfo.siteCode,
            platformChannel: "cultural",
            phone: tels
          }).then((res: any) => {
            if (res.code === 0) {
              this.list.forEach((data: any) => {
                if (data.accountPhone) {
                  let curr: any = res.datas.find(
                    (item: any) => item.phone === data.accountPhone
                  );
                  if (curr) {
                    data.creditScore =
                      curr.creditScore + "（" + curr.levelName + ")";
                  }
                }
              });
            }
          });
        }
        if (res.page.total > 0) {
          _this.showPage = true;
          (_this.params as any).total = res.page.total;
          (_this.params as any).currPage = res.page.currPage;
          (_this.params as any).pageSize = res.page.pageSize;
        } else {
          _this.showPage = false;
        }
      }
    });
    this.getWaitNum();
  }

  // 下单日期
  getOrderStartTime(date: any) {
    (this.params as any).orderStartTime = date[0];
    (this.params as any).orderEndTime = date[1];
  }

  // 预约日期
  getIndateStartTime(date: any) {
    (this.params as any).indateStartTime = date[0];
    (this.params as any).indateEndTime = date[1];
  }

  // tab切换
  setStatus(index: any) {
    let _this = this;
    switch (index) {
      case 0:
        {
          (_this.params as any).orderStatus = "";
        }
        break;
      case 1:
        {
          (_this.params as any).orderStatus = "4";
        }
        break;
      case 2:
        {
          (_this.params as any).orderStatus = "79";
        }
        break;
    }
    _this.getList();
  }

  // 切换页码
  private changePages(page: number) {
    (this.params as any).currPage = page;
    this.getList();
  }

  // 切换页量
  private changeSize(size: number) {
    (this.params as any).pageSize = size;
    this.getList();
  }

  // 重置消费码
  resetCode(id: any) {
    restartCode({
      id: id
    }).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("消费码重置成功");
      }
    });
  }

  /* S 审核 */
  private modalShow: boolean = false;
  private auditParams: any = {
    id: "",
    status: 11, //审核状态：11 通过待消费 79 不通过
    remark: "" // 审核备注
  };

  // 审核弹窗
  setAudit(item: any) {
    let { id } = item;
    this.modalShow = true;
    (this.auditParams as any).id = id;
    (this.auditParams as any).status = 11;
    if (item.stock !== item.surplusStock) {
      (this.auditParams as any).status = 79;
    }
    this.auditItem = item;
    getOrderStatusMsg({ id }).then(res => {
      if (res.code === 0) {
        this.statusMsg = res.message as string;
      }
    });
  }

  // 确定审核
  private error: any = "";
  private wait: boolean = false;
  ok() {
    let _this = this;
    if (
      (_this.auditParams as any).status === 79 &&
      !(_this.auditParams as any).remark
    ) {
      _this.error = "请填写备注信息";
    } else {
      _this.wait = true;
      orderAudit(_this.auditParams)
        .then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("审核成功");
            _this.modalShow = false;
            (_this.auditParams as any).remark = "";
          } else {
            _this.$Message.error(res.message);
          }
        })
        .finally(() => {
          if (!_this.modalShow) {
            _this.getList();
            _this.wait = false;
          }
          this.auditItem = {};
          this.statusMsg = "";
        });
    }
  }
  cancel() {
    this.modalShow = false;
    (this.auditParams as any).remark = "";
    this.auditItem = {};
    this.statusMsg = "";
  }
  // 审核状态
  setAuditStatus(status: number) {
    (this.auditParams as any).status = status;
  }

  /* E 审核 */
  //单选
  private setChecked(data: any) {
    let list = this.list.map((data: any) => data.id || "");
    if (this.allChecked && data.length < list.length) {
      this.allChecked = false;
    } else if (!this.allChecked && data.length === list.length) {
      this.allChecked = true;
    }
  }
  //全选
  private setAllChecked() {
    if (this.allChecked) {
      this.checkList = [];
    } else {
      this.checkList = this.list.map((data: any) => data.id || "");
    }
    this.allChecked = !this.allChecked;
  }
  /* S 删除 */
  private deleteRow(item: any, index: number) {
    let _this = this,
      checkedLen = _this.checkList.length >= 1 ? _this.checkList.length : 0;
    if (index === -1 && !checkedLen) {
      _this.$Message.error("请选择你要删除的订单");
      return;
    }
    let config: any = {
      title: "操作提示",
      content: `确认要删除“${item.orderName ||
        "选中"}”订单？删除后用户端将不再展示！`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        orderDelete({
          ids: index == -1 ? _this.checkList.join(",") : item.id
        }).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("删除成功");
            _this.getList();
          }
        });
      }
    };
    this.$Modal.confirm(config);
  }
  /* E 删除 */

  /* S 审核/不通过  数量 */
  private waitNum: any = 0; // 待审核
  // 待审核
  getWaitNum() {
    let _this = this;
    orderList({
      resourceType: "CONTENT_TYPE_ACTIVITY_SHIU",
      orderStatus: 4,
      valid: "1" // 1为审核列表
    }).then((res: any) => {
      if (res.code === 0) {
        _this.waitNum = res.page ? res.page.total : 0;
      }
    });
  }

  // tab 状态待审核数量
  private waitLabel(h: any) {
    let _this = this;
    return h("div", [
      h("span", "待审核"),
      h("Badge", {
        props: {
          count: _this.waitNum
        }
      })
    ]);
  }

  /* E 审核/不通过  数量 */
  mounted() {
    this.getList();
    // 待审核
    this.getWaitNum();
  }
}
</script>

<style lang='scss' scoped>
.statusMsg {
  margin: 0 0 15px;
  padding: 5px 0;
  text-align: center;
  background: rgba(255, 255, 204, 1);
  border-radius: 4px;
}
.container {
  padding: 0 15px 15px;
  .orderHeader {
    padding: 16px 0;
    background-color: #f8f8f9;
    li {
      overflow: hidden;
      display: flex;
      .big {
        width: 30%;
        padding-left: 20px;
        text-align: left;
      }
      .middle {
        flex: 1;
        text-align: center;
        a.help {
          background: #ed3f14;
          font-size: 10px;
          color: #fff;
          border-radius: 50%;
          position: relative;
          top: 0;
          left: 8px;
          display: inline-block !important;
          width: 15px;
          height: 15px;
          line-height: 17px !important;
          padding-top: 1px;
        }
      }
      .time {
        flex: 1.5;
      }
    }
  }
  .tab {
    position: relative;
    overflow: hidden;
    .line {
      position: relative;
      text-align: left !important;
      max-width: 400px;
      height: 60px;
      line-height: 25px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .txt {
        display: block;
        @include ellipsis(100%);
        padding-left: 5px;
      }
      .title {
        font-weight: 600;
      }
      .address {
        position: absolute;
        bottom: 0;
      }
    }
    .rowList {
      .detail-text-info {
        display: inline-block;
        vertical-align: middle;
      }
      .info {
        div {
          float: left;
          text-align: center;
        }
      }
      .remark-panel {
        font-size: 12px;
        .item {
          height: 34px;
          line-height: 34px;
          padding-left: 20px;
        }
        .audit-remark {
          background-color: #f7f7f7;
        }
      }
      margin-top: 15px;
      border: 1px solid #e9eaec;
      line-height: 50px;
      border-bottom: 1px solid #e9eaec;
      > div.info {
        background-color: #fff;
        width: 100%;
        padding: 16px 0;
        display: flex;
        .big,
        .middle {
          font-size: 12px;
        }
        .big {
          width: 30%;
          text-align: left;
          color: $font01;
          .img-box {
            position: relative;
            width: 90px;
            height: 60px;
            overflow: hidden;
            &.faith-use:after {
              content: "诚信优享";
              position: absolute;
              bottom: 0;
              right: 0;
              padding: 0 5px;
              color: #fff;
              background: rgba(255, 102, 0, 1);
              line-height: 20px;
              text-align: center;
              border-radius: 4px;
            }
            &.faith-audit:after {
              content: "诚信免审";
              position: absolute;
              bottom: 0;
              right: 0;
              padding: 0 5px;
              color: #fff;
              background: rgba(20, 204, 86, 1);
              line-height: 20px;
              text-align: center;
              border-radius: 4px;
            }
            img {
              width: 100%;
            }
          }
        }
        .middle {
          flex: 1;
          text-align: center;
          a {
            display: block;
            margin: 0;
            padding: 0;
          }
        }
        .time {
          flex: 1.5;
        }
      }
    }
    .colBox {
      // width: 100%;
      padding-left: 20px;
      font-size: 0;
      vertical-align: top;
    }
    .rowlist-top {
      background-color: #f4f9fe;
    }
    .detail-text-info {
      padding-right: 40px !important;
      .detail-text-label {
        white-space: nowrap;
      }
      .detail-text-text {
        color: #7b8292;
      }
    }
    .detail-text-info .detail-text-label,
    .detail-text-info .detail-text-text {
      display: table-cell;
      font-size: 12px;
      font-weight: 400;
    }
  }
  .topic {
    width: 100%;
    padding-top: 15px;
    background: $grayLight;
  }
  .pages {
    position: relative;
    z-index: 999;
  }
  .audit-btn {
    &.active {
      border: 1px solid $theme-active;
    }
  }
  .action-buttons {
    padding-left: 20px;
  }
}
.btn-box {
  display: flex;
  justify-content: center;
}
.form-item {
  margin-bottom: 0;
}
</style>
