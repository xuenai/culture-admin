<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 20:28:25
 * @lastTime: 2019-11-22 11:09:50
 * @LastAuthor: 陈艳玲
 -->
<template>
  <div class="container">
    <!--tab切换-->
    <Tabs active-key="key2" class="tab-wrap" :animated="false" @on-click="setStatus">
      <Tab-pane label="全部" key="key1"></Tab-pane>
      <Tab-pane label="待消费" key="key2"></Tab-pane>
      <Tab-pane label="已完成" key="key3"></Tab-pane>
      <Tab-pane label="已失效" key="key4"></Tab-pane>
      <Tab-pane label="已取消" key="key5"></Tab-pane>
    </Tabs>
    <div class="topic">
      <Form class="form" ref="formInline" inline :label-width="70">
        <FormItem label="关键字">
          <Input type="text" placeholder="订单号/活动室名称" v-model="params.name" style="width: 200px" />
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
        <FormItem label="预约时间">
          <DatePicker
            format="yyyy-MM-dd"
            type="daterange"
            @on-change="getIndateStartTime"
            placement="bottom-start"
            placeholder="选择提交日期"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <div class="submit">
          <Button type="primary" @click="getList">搜索</Button>
          <!--<Button icon="ios-download-outline" class="ml20" type="primary">导出数据</Button>-->
          <a class="ivu-btn ivu-btn-default ml10" @click="outExcel($event)">导出</a>
        </div>
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
          <p class="middle">预约时间</p>
          <p class="middle">联系电话</p>
          <p class="middle">支付金额</p>
          <p class="middle">订单状态</p>
          <p class="middle">操作</p>
        </li>
      </ul>
      <!-- 表格行 -->
      <ul class="tab">
        <CheckboxGroup v-model="checkedIds" @on-change="getCheckedList">
          <li class="rowList clearfix" v-for="(item,index) in list" :key="index">
            <div class="colBox">
              <Checkbox :label="item.id" class="chk-box"></Checkbox>
              <div class="detail-text-info">
                <span class="detail-text-label">订单编号：</span>
                <span class="detail-text-text">
                  <router-link
                    :to="{path:'/room-order-detail',query:{id:item.id,activityId:item.activityId}}"
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
              <div class="detail-text-info" v-if="item.refundStartTime&&item.refundEndTime">
                <span class="detail-text-label">可退时间：</span>
                <span class="detail-text-text">{{item.refundStartTime}} 至 {{item.refundEndTime}}</span>
              </div>
            </div>
            <div class="info">
              <div class="big">
                <div class="block ml20">
                  <img :src="item.image" class="img fl mr20 daq-no-photo" />
                  <span class="credit-icon" v-if="item.faithAuditStatus==1">诚信免审</span>
                </div>
                <p class="line">
                  <span class="txt title">{{item.orderName}}</span>
                  <span class="txt address">所属场馆：{{item.address}}</span>
                </p>
                <p class="remark" v-if="item.remark">预约备注：{{item.remark}}</p>
              </div>
              <div class="middle">{{item.userName}}</div>
              <div class="middle">{{item.useNum}}</div>
              <div class="middle">{{item.orderStart}}</div>
              <div class="middle">{{item.userPhone}}</div>
              <div class="middle">{{item.payMoney}}</div>
              <div class="middle">{{getOrderStatusTxt(item.orderStatus)}}</div>
              <div class="middle">
                <router-link
                  :to="{path:'/room-order-detail',query:{id:item.id,activityId:item.activityId}}"
                >订单详情</router-link>
                <a v-if="item.orderStatus==11" @click="resetCode(item.id)">重新发码</a>
              </div>
            </div>
          </li>
          <li v-if="list.length<1" class="text-center mt10 no-data">暂无数据</li>
        </CheckboxGroup>
      </ul>
      <Page
        class="pages mg20 text-right"
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
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { orderList, restartCode } from "@service/place";
import { AppModule } from "@store/modules/app";
import CONFIG from "@/util/config";

@Component
export default class ComponentName extends Vue {
  // 获取token
  get token() {
    return AppModule.token;
  }
  /* S 导出 */
  private outExcelApi: string =
    CONFIG.defaultUrl + "/act/activity/order/orderActivityRoomExcel?";
  outExcel(e: any) {
    let _target = e.target as HTMLInputElement,
      _this = this;
    let checkedLen = _this.checkedIds ? _this.checkedIds.length : 0;
    if (checkedLen < 1) {
      this.$Message.error("请选择需要导出的数据！");
    } else {
      _target.setAttribute(
        "href",
        this.outExcelApi +
          "token=" +
          this.token +
          "&ids=" +
          _this.checkedIds.join(",")
      );
    }
  }
  /*E 导出*/
  // 复选框
  private checkedIds: any = [];
  getCheckedList(list: any) {
    console.log(list);
    this.checkedIds = list;
  }
  // 请求参数
  private params: object = {
    resourceType: "CONTENT_TYPE_ACTIVITY_SHIU", // 资源类型
    orderStatus: "", // 订单状态
    name: "", // 关键字
    phoneOrName: "", // 下单人/手机号
    orderStartTime: "", // 下单日期
    indateStartTime: "", // 预约日期
    currPage: 1, // 当前第几页
    pageSize: 10, // 当前页数量
    total: 6 // 总页数
  };
  private list: Array<object> = [];
  private page: any;
  // 获取列表
  getList() {
    let _this = this;
    orderList(_this.params).then((res: any) => {
      if (res.code === 0) {
        _this.list = res.datas;
        if (res.page.total > 0) {
          (_this.params as any).total = res.page.total;
          (_this.params as any).currPage = res.page.currPage;
          (_this.params as any).pageSize = res.page.pageSize;
        }
      }
    });
  }

  // 下单日期
  getOrderStartTime(date: any) {
    (this.params as any).orderStartTime = date[0] || "";
    (this.params as any).orderEndTime = date[1] || "";
  }

  // 预约日期
  getIndateStartTime(date: any) {
    (this.params as any).indateStartTime = date[0] || "";
    (this.params as any).indateEndTime = date[1] || "";
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
          (_this.params as any).orderStatus = "11";
        }
        break;
      case 2:
        {
          (_this.params as any).orderStatus = "12";
        }
        break;
      case 3:
        {
          (_this.params as any).orderStatus = "13";
        }
        break;
      case 4:
        {
          (_this.params as any).orderStatus = "14";
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

  // 获取订单状态
  private getOrderStatusTxt(status: number) {
    // 待审核的也是未消费状态
    switch (status) {
      case 0: {
        return "待消费";
      }
      case 4: {
        return "待消费";
      }
      case 6: {
        return "待消费";
      }
      case 11: {
        return "待消费";
      }
      case 12: {
        return "已完成";
      }
      case 13: {
        return "已失效";
      }
      case 14: {
        return "已取消";
      }
      case 79: {
        return "不通过";
      }
      default:
        return "-";
    }
  }

  mounted() {
    this.getList();
  }
}
</script>

<style lang='scss' scoped>
.container {
  padding: 0 15px 20px;
  .orderHeader {
    padding: 15px 0;
    background-color: #f8f8f9;
    li {
      overflow: hidden;
      display: flex;
      .big,
      .middle {
        float: left;
        text-align: center;
      }
      .big {
        width: 28%;
        padding-left: 20px;
        text-align: left;
      }
      .middle {
        width: 12%;
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
    .remark {
      margin-left: 20px;
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
          float: left;
          font-size: 12px;
          text-align: center;
        }
        .big {
          width: 28%;
          text-align: left;
          color: $font01;
          .img {
            width: 105px;
            height: 60px;
            float: left;
          }
        }
        .middle {
          width: 12%;
          text-align: center;
          a {
            display: block;
            line-height: 20px;
            margin: 0;
            padding: 0;
          }
        }
        .block {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          .credit-icon {
            display: inline-block;
            position: absolute;
            width: 100%;
            height: 20px;
            line-height: 20px;
            bottom: 0;
            right: 0;
            font-size: 12px;
            font-style: italic;
            text-align: center;
            color: #fff;
            background-color: #2cdb6a;
          }
        }
      }
    }
    .colBox {
      background-color: #f4f9fe;
      width: 100%;
      padding-left: 20px;
      line-height: 50px;
      .chk-box {
        vertical-align: top;
        font-size: 0;
      }
      .detail-text-info {
        vertical-align: top;
        padding-right: 40px !important;
        .detail-text-label {
          white-space: nowrap;
        }
        .detail-text-text {
          color: #7b8292;
        }
      }
    }
    .detail-text-info .detail-text-label,
    .detail-text-info .detail-text-text {
      display: table-cell;
      vertical-align: top;
      font-size: 12px;
      font-weight: 400;
    }
  }
  .topic {
    width: 100%;
    padding-top: 15px;
    background: $grayLight;
    .submit {
      display: inline-block;
      margin: 0 0 15px 10px;
    }
    .ivu-form-item {
      margin-bottom: 15px !important;
    }
  }
  .pages {
    position: relative;
    z-index: 999;
  }
  .no-data {
    font-size: 13px;
  }
}
</style>
