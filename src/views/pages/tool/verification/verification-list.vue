<template>
  <div class="content">
    <div class="topic">
      <Form class="form" ref="formInline" inline :label-width="100">
        <div>
          <span class="search-item" @click="getToday" :class="{curr: selectMod.indexOf('today') > -1}">今天</span>
          <span class="search-item" @click="getYesTerDay" :class="{curr: selectMod.indexOf('yesterday') > -1}">昨天</span>
          <span class="search-item" @click="getNearSevenDay" :class="{curr: selectMod.indexOf('seven') > -1}">最近7天</span>
          <span class="search-item" @click="getCurrentMonth" :class="{curr: selectMod.indexOf('prvTocurrent') > -1}">最近30天</span>
          <FormItem label="自定义核销时间">
            <DatePicker
            type="daterange"
            :value="value"
            :options="options"
            @on-change="selectDate"
            placeholder="请选择自定义核销时间"
            placement="bottom-end"
            style="width: 200px"
          ></DatePicker>
          </FormItem>
        </div>
        <div>
          <FormItem label="订单编号">
            <Input type="text" v-model="params.orderCode" placeholder="请输入订单编号" style="width: 200px" />
          </FormItem>
          <FormItem label="商品名称">
            <Input type="text" v-model="params.name" placeholder="请输入商品名称" style="width: 200px" />
          </FormItem>
          <FormItem label="电子消费码">
            <Input type="text" v-model="params.code" placeholder="请输入电子消费码" style="width: 200px" />
          </FormItem>
          <Button type="primary" @click="getList">搜索</Button>
          <Button class="ml20" v-if="operates.includes('export')"><a @click="outExcel($event)">导出</a></Button>
        </div>
      </Form>
    </div>
    <div class="mt20">
      <!-- 表格头 -->
      <ul class="orderHeader">
        <li>
          <p class="big"><span class="order-title">商品信息</span></p>
          <p class="middle">预订数量</p>
          <p class="lg">电子消费码</p>
          <p class="middle">核销数量</p>
          <p class="lg">核销时间</p>
          <p class="lg">核销人</p>
        </li>
      </ul>
      <!-- 表格行 -->
      <ul class="tab">
        <CheckboxGroup v-model="checkedIds"  @on-change="getCheckedList">
          <li class="rowList clearfix" v-for="(item,ind) in list" :key="ind">
            <Checkbox :label="item.id" class="colBox" >
              <div class="detail-text-info">
                <span class="detail-text-label">订单编号： </span><span class="detail-text-text"><a>{{item.orderCode}}</a></span>
              </div>
              <div class="detail-text-info">
                <span class="detail-text-label">下单时间： </span><span class="detail-text-text">{{item.orderTime}}</span>
              </div>
              <div class="detail-text-info">
                <span class="detail-text-label">有效期： </span><span class="detail-text-text">2019-05-06 09:00:00至 2019-05-12 18:00:00</span>
              </div>
            </Checkbox>
            <div class="info">
              <div class="big">
                <p class="line" v-if="item.subordinate">
                  商品名称： <span>【免费预订】{{item.name}}</span><br>
                  所属场馆： <span>{{item.subordinate}}</span>
                </p>
                <p class="line" v-else>
                  商品名称： <span>{{item.name}}</span><br>
                  活动地点： <span>{{item.address}}</span>
                </p>
              </div>
              <div class="middle text-align-center">{{item.validCount}}</div>
              <div class="lg text-align-center">{{item.consumeCode}}</div>
              <div class="middle text-align-center">{{item.validCount}}</div>
              <div class="lg text-align-center">{{item.validTime}}</div>
              <div class="lg text-align-center">{{item.operateName}} 进行核销</div>
            </div>
          </li>
          <li v-if="list.length<1" class="text-center mt10 no-data">暂无数据</li>
        </CheckboxGroup>
      </ul>
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
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import {getValidList , getUserInfo} from '@service/tool';
import { AppModule } from "@store/modules/app";
import CONFIG from '@/util/config';
@Component
export default class VerificationList extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  //获取token
  get token() {
    return AppModule.token;
  }
  private showPage: boolean = false; // 是否展示分页
  private list: Array<object> = []; // 列表
  private page: any; // 分页
  mounted() {
    this.getList();
  }
  // 用户信息
  get userInfo(){
    return AppModule.userInfo;
  }
  /* S 获取列表数据 */
  // 请求参数
  private params: any = {
    endDate: '', // 开始时间
    startDate: '', // 结束时间
    orderCode: '', // 订单编号
    name: '', // 商品名称
    code: '', // 电子消费码
    currPage: 1, // 当前第几页
    pageSize: 10, // 当前页数量
    total: 6, // 总页数
    siteId: this.userInfo.siteId, // 站点ID
  };
  getList() {
    let _this = this;
    getValidList(_this.params).then((res: any) => {
      if (res.code === 0) {
        _this.list = res.datas;
        if (res.page && res.page.total > 0) {
            _this.showPage = true;
            (_this.params as any).total = res.page.total;
            (_this.params as any).currPage = res.page.currPage;
            (_this.params as any).pageSize = res.page.pageSize;
        } else {
            _this.showPage = false;
        }
      }
    })
  }
  /* E 获取列表数据 */

  /* S 导出 */
  // 复选框
  private checkedIds: any = [];
  getCheckedList(list:any){
      this.checkedIds = list;
  }
  private outExcelApi: string = CONFIG.defaultUrl + '/act/activity/order/validExcel?';
  private outExcel(e:any){
      let _target=e.target as HTMLInputElement,_this=this;
      let checkedLen = _this.checkedIds ? _this.checkedIds.length : 0;
      if(checkedLen<1){
          this.$Message.info('请选择需要导出的数据！');
      }else{
          _target.setAttribute("href",this.outExcelApi+"token="+this.token+"&ids="+_this.checkedIds.join(","));
      }
  }
  /* E 导出 */

  /**
   * S 查询
   */
  private selectMod: string = "";
  private value: any = [];
  // 今天
  private getToday(){
    this.selectMod = 'today';
    let preSeven = new Date().getTime();
    this.value = [preSeven, preSeven];
    this.dataFun("today");
    this.getList();
  }
  // 昨天
  private getYesTerDay(){
    this.selectMod = 'yesterday';
    let preSeven = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
    this.value = [preSeven, preSeven];
    this.dataFun("yesterday");
    this.getList();
  }
  // 最近7天
  private getNearSevenDay() {
    this.selectMod = "sevenday";
    let preSeven = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
    this.value = [preSeven, new Date()];
    this.dataFun("sevenday");
    this.getList();
  }
  // 最近30天
  private getCurrentMonth() {
    this.selectMod = "prvTocurrent";
    let preSeven: any = new Date(new Date().setDate(1));
    this.value = [preSeven, new Date()];
    this.dataFun("prvTocurrent");
    this.getList();
  }

  // 日期选择
  private selectDate(date: any) {
    this.params.endDate = date[1];
    this.params.startDate = date[0];
    this.selectMod = "";
    // let start = new Date(date[0]).getTime();
    // let end = new Date(date[1]).getTime();
    // 自定义选择的时间不能超过31天
    // if (end - start > 31 * 24 * 3600 * 1000) {
    //   this.value = "";
    //   this.dateTips = "自选日期不能超过31天";
    //   this.$Notice.error({
    //     title: "自选日期不能超过31天"
    //   });
    // }
  }
  // 公用参数
  private dataFun(dataObj: string) {
    let date = new Date(),_this = this;
    switch(dataObj){
      case "today": // 今天
      (_this.params as any).endDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      (_this.params as any).startDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      break;
      case "sevenday": // 最近7天
      (_this.params as any).endDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      date.setDate(date.getDate()-7);
      (_this.params as any).startDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      break;
      case "yesterday": // 昨天
      date.setDate(date.getDate()-1);
      (_this.params as any).endDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      (_this.params as any).startDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      break;
      case "prvTocurrent": // 最近30天
      (_this.params as any).endDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      date.setDate(date.getDate()-30);
      (_this.params as any).startDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      break;
    }
  }
  // 切换页码
  private changePages(page: number) {
    (this.params as any).currPage = page;
    this.getList();
  }
  private options = {
    disabledDate(date: any) {
      const disabledDay = date.getDate();
      // 限制可选的开始日期及结束日期
      let b =
        date.getTime() < new Date("2018-12-31").getTime() ||
        (date && date.valueOf() > Date.now());
      return b;
    }
  };
  /**
   * E 查询
   */  
  // 切换页量
  private changeSize(size: number) {
      (this.params as any).pageSize = size;
      this.getList();
  }
}
</script>

<style lang='scss' scoped>
.content{
  padding: 15px;
  .topic{
    width: 100%;
    padding-top: 15px;
    background: $grayLight;
    .search-item{
      position: relative;
      top: 7px;
      color: $theme;
      margin: 0 10px;
      cursor: pointer;
      &.curr{
        color: $danger;
      }
    }
  }
  .orderHeader{
    padding: 16px 0;
    background-color: #e9eaec;
    li{
        overflow: hidden;
        .big,.middle,.lg{
            float: left;
            text-align: center;
        }
        .big{
            width: 35%;
        }
        .middle{
            width: 5%;
        }
        .lg{
            width: 18%;
        }
    }
  }
  .tab{
    position: relative;
    overflow: hidden;
    .line {
        float: left;
        text-align: left !important;
        max-width: 400px;
        line-height: 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .rowList{
        margin-top: 20px;
        line-height: 50px;
        border: 1px solid #e9eaec;
        border-bottom: 1px solid #e9eaec;
        div{
          display: inline-block;
          vertical-align: middle;
        }
        >div.info {
            width: 100%;
            padding: 15px;
            .big,.middle,.lg{
              float: left;
            }
            .middle,.lg{
              line-height: 50px;
            }
            .big{
              width: 35%;
            }
            .middle{
              width: 5%;
            }
            .lg{
              width: 18%;
            }
        }
    }
    .colBox{
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
    .detail-text-info .detail-text-text{
        display: table-cell;
        font-size: 12px;
        font-weight: 400;
    }
  }
  .text-align-center{
    text-align: center;
  }
}
</style>
