<template>
  <div class="activity-management-pub">
    <div class="topic">
      <Form class="form" ref="formInline" inline :label-width="70" :rules="ruleValidate">
        <FormItem label="关键字" prop="name">
          <Input
            type="text"
            v-model="params.name"
            placeholder="订单号或活动名称"
            class="w200"
            @on-enter="search"
          />
        </FormItem>
        <FormItem label="下单人" prop="phoneOrName">
          <Input
            type="text"
            v-model="params.phoneOrName"
            placeholder="姓名或手机号"
            class="w200"
            @on-enter="search"
          />
        </FormItem>
        <FormItem label="下单日期">
          <DatePicker
            @on-change="orderDate"
            format="yyyy/MM/dd"
            type="daterange"
            placement="bottom-end"
            placeholder="选择下单日期"
            class="w200"
          ></DatePicker>
        </FormItem>
        <FormItem label="活动日期">
          <DatePicker
            @on-change="activeDate"
            format="yyyy/MM/dd"
            type="daterange"
            placement="bottom-end"
            placeholder="选择活动日期"
            class="w200"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="search">搜索</Button>
          <Button
            icon="ios-download-outline"
            class="ml20"
            type="primary"
            @click="getOrderActivityExcel"
          >导出数据</Button>
        </FormItem>
      </Form>
    </div>

    <!-- 表格头 -->
    <ul class="orderHeader mt15">
      <li>
        <Checkbox class="fl" style="margin-left: 21px" :value="allCheck" @on-change="toggleAll"></Checkbox>
        <p class="big">
          <span class="order-title">商品信息</span>
        </p>
        <p class="middle">商品数量</p>
        <p class="middle">支付金额</p>
        <p class="middle">支付积分</p>
        <p class="middle">订单状态</p>
        <p class="middle">操作</p>
      </li>
    </ul>
    <!-- 表格行 -->
    <baseTable :configure="tableConfig" @getList="search">
      <ul class="tab" v-if="dataList.length">
        <li class="rowList clearfix" v-for="item in dataList" :key="item.id">
          <div class="colBox">
            <div class="detail-text-info">
              <Checkbox
                class="fl"
                :value="item.hasChecked"
                @on-change="checked => item.hasChecked = checked"
              ></Checkbox>
              <span class="detail-text-label">订单编号：</span>
              <span class="detail-text-text">
                <router-link
                  :to="{path: '/ac-order-detail', query: {id: item.id, activityId: item.activityId}}"
                >{{item.orderCode}}</router-link>
              </span>
            </div>
            <div class="detail-text-info">
              <span class="detail-text-label">下单时间：</span>
              <span class="detail-text-text">{{item.createTime}}</span>
            </div>
            <div class="detail-text-info">
              <span class="detail-text-label">有效期：</span>
              <span class="detail-text-text">{{item.orderStart.slice(0,-3)}} 至 {{item.orderEnd.slice(0,-3)}}</span>
            </div>
            <div class="detail-text-info" v-if="item.refundStartTime&&item.refundEndTime">
              <span class="detail-text-label">可退时间：</span>
              <span class="detail-text-text">{{item.refundStartTime.slice(0,-3)}} 至 {{item.refundEndTime.slice(0,-3)}}</span>
            </div>
          </div>
          <div class="info">
            <div class="big">
              <div class="fl mr20 ml20" :class="{
                  'faith-audit': (item.faithAuditStatus && item.faithAuditValue),
                  'faith-use': (item.faithUseStatus && item.faithUseValue)}">
                  <img :src="item.image" />
              </div>
              <div class="line">
                <router-link
                  :to="{path: '/ac-detail', query: {id: item.activityId}}"
                >{{item.orderName}}</router-link>
                <p v-if="item.type === 'ACTIVITY_TYPE_VOLUNT'">招募人数：{{item.stock}}</p>
                <p>活动地址：{{item.address}}</p>
              </div>
            </div>
            <div class="middle">x{{item.orderNum}}</div>
            <div class="middle">{{item.payMoney || '暂无'}}</div>
            <div class="middle">{{item.payIntegral || '暂无'}}</div>
            <div class="middle">{{status[item.orderStatus]}}</div>
            <div class="middle action">
              <router-link
                :to="{path: '/ac-order-detail', query: {id: item.id, activityId: item.activityId}}"
              >订单详情</router-link>
              <a
                v-if="item.orderStatus === 11"
                href="javascript:;"
                @click="reSendCode(item.id)"
              >重新发码</a>
            </div>
          </div>
        </li>
      </ul>
      <p v-else class="nodata">暂无数据</p>
    </baseTable>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import BaseTable from "@components/baseTable/baseTable.vue";
import { getActiveOrderList, restartCode } from "@service/activity";
import { AppModule } from "@store/modules/app";
import CONFIG from "@/util/config";

interface paramType {
  name: string;
  phoneOrName: string;
  indateStartTime: string;
  indateEndTime: string;
  orderStartTime: string;
  orderEndTime: string;
  resourceType: string;
  orderStatus: number | undefined;
  currPage?: number;
  pageSize?: number;
}

@Component({
  components: {
    BaseTable
  }
})
export default class ComponentName extends Vue {
  // 数据状态 全部 待消费 已完成 已失效 已取消
  @Prop() dataStatus?: number;
  // currName 全部 待消费 已完成 已失效 已取消
  @Prop({default: ''}) currName?: string;
  // 权限列表
  get operates() {
    return AppModule.operates;
	}
  // 查询条件
  private params = <paramType>{
    orderStatus: 1,
    resourceType: "CONTENT_TYPE_ACTIVITY"
  };
  // 表单验证
  private ruleValidate: any = {
    // name: [{ required: true, message: "请将信息填写完整", trigger: "blur" }],
    activityName: [{ required: true, message: "请将信息填写完整" }],
    tag: [{ required: true, message: "请将信息填写完整" }],
    startDate: [
      { required: true, message: "请将信息填写完整", trigger: "blur" }
    ],
    startTime: [
      { required: true, message: "请将信息填写完整", trigger: "blur" }
    ],
    address: [{ required: true, message: "请将信息填写完整", trigger: "blur" }],
    stock: [{ required: true, message: "请将信息填写完整", trigger: "blur" }],
    limitNum: [{ required: true, message: "请将信息填写完整" }],
    images: [{ required: true, message: "请将信息填写完整", trigger: "blur" }],
    sponsor: [{ required: true, message: "请将信息填写完整", trigger: "blur" }],
    introduce: [
      { required: true, message: "请将信息填写完整", trigger: "blur" }
    ]
  };
  // 表格配置
  private tableConfig = <any>{
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0,
      totalPage: 1
    },
    pagePosition: "right"
  };
  // 订单列表数据
  private dataList: Array<any> = [];
  // 状态
  private status = <object>{
    11: "待消费",
    12: "已完成",
    13: "已失效",
    14: "已取消"
  };
  // loading
  private loading: boolean = false;

  @Watch('currName')
  currNameChange (n:string | undefined) {
      if (n == String(this.dataStatus) || (n === 'all' && !this.dataStatus)) {
          this.search()
      }
  }
  created() {
    this.params.orderStatus = this.dataStatus;
    this.currNameChange(this.currName);

//    this.bus.$on("changeStatus", () => {
//      this.search();
//    });
  }
  // 下单日期选择
  private orderDate(date: Array<string>) {
    if (date.length > 1) {
      this.params.orderStartTime = date[0] || "";
      this.params.orderEndTime = date[1] || "";
      this.search();
    }
  }
  // 活动日期选择
  private activeDate(date: Array<string>) {
    if (date.length > 1) {
      this.params.indateStartTime = date[0] || "";
      this.params.indateEndTime = date[1] || "";
      this.search();
    }
  }
  // 重置消费ma
  private reSendCode(id: string) {
    restartCode({ id }).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("操作成功！");
      }
    });
  }
  // 搜索
  private search(page?: any) {
    this.loading = true;
    if (page) {
      this.params.currPage = page.currPage;
      this.params.pageSize = page.pageSize;
    }
    getActiveOrderList(this.params)
      .then((res: any) => {
				let {page, datas} = res
        if (page) {
          this.tableConfig.page = page;
        }
        if (datas) {
          datas.forEach((item: any) => (item.hasChecked = false));
          this.dataList = datas;
        }
      })
      .catch(() => {
        this.dataList = [];
      })
      .finally(() => {
        this.loading = false;
      });
  }

  get allCheck() {
    return this.dataList.length && this.dataList.every((item: any) => item.hasChecked);
  }
  // 全选点击
  private toggleAll(checked: boolean) {
    this.dataList.forEach((item: any) => (item.hasChecked = checked));
  }
  // 导出数据
  private getOrderActivityExcel() {
    let checked = this.dataList.filter((item: any) => item.hasChecked);
    if (checked.length) {
      this.exportExcel(
        CONFIG.defaultUrl +
          "/act/activity/order/orderActivityExcel?token=" +
          this.$cookies.get(`${process.env.VUE_APP_STATUS}_TOKEN`) +
          `&ids=${checked.map((item: any) => item.id).toString()}`
      );
    } else {
      this.$Message.info("请选择要导出的数据！");
    }
  }
  // 导出数据
  private exportExcel(url: string) {
    let a: any = document.createElement("a");
    a.setAttribute("download", "");
    a.setAttribute("href", url);
    a.click();
    a = null;
  }
}
</script>

<style lang='scss' scoped>
.nodata {
  text-align: center;
  line-height: 100px;
}
.activity-management-pub {
  .topic {
    width: 100%;
    padding-top: 15px;
    margin-bottom: 15px;
    background: $grayLight;
  }

  .orderHeader {
    padding: 16px 0;
    background-color: #e9eaec;
    li {
      overflow: hidden;
      .big,
      .middle {
        float: left;
        text-align: center;
      }
      .big {
        width: calc(37% - 45px);
        text-align: left;
        /*text-indent: 21px;*/
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
      padding-left: 15px;
      float: left;
      text-align: left !important;
      max-width: 400px;
      line-height: 15px;
      overflow: hidden;
      /*text-overflow: ellipsis;*/
      /*white-space: nowrap;*/
      p {
        margin-top: 4px;
      }
    }
    .rowList {
      div {
        float: left;
        text-align: center;
      }
      margin-top: 15px;
      border: 1px solid #e9eaec;
      line-height: 50px;
      border-bottom: 1px solid #e9eaec;
      > div.info {
        background-color: #fff;
        width: 100%;
        padding: 16px 0;
        position: relative;
        .big,
        .middle {
          float: left;
          text-align: center;
        }
        .big {
          width: 37%;
          text-align: left;
          .ml20 {
              width: 90px;
              height: 60px;
              position: relative;
              overflow: hidden;
              &.faith-use:after {
                  content: '诚信优享';
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
                  content: '诚信免审';
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
          }
          img {
              width: 100%;
          }
        }
        .middle {
          width: 12%;
          text-align: center;
          &.action {
            display: flex;
            flex-direction: column;
            height: 82px;
            justify-content: center;
            position: absolute;
            top: 0;
            left: 85%;
            line-height: 20px;
          }
          a {
            display: block;
            line-height: 20px;
            margin: 0;
            padding: 0;
          }
        }
      }
    }
    .colBox {
      background-color: #f4f9fe;
      width: 100%;
      padding-left: 20px;
      .detail-text-info {
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
      font-size: 12px;
      font-weight: 400;
    }
  }
}
</style>
