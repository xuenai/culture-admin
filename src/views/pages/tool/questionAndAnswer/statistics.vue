<template>
  <div class="container">
    <ul class="tab clearfix">
      <li class="fl"><span ref="7day" class="item" :class="{active: currTabIndex === 0}" @click="()=>{
                currTabIndex = 0;
                changeTime([new Date().getTime() - 7 * 24 * 60 * 60 * 1000, new Date().getTime()])
            }">最近7天</span></li>
      <li class="fl"><span class="item" :class="{active: currTabIndex === 1}" @click="()=>{
                currTabIndex = 1;
                changeTime([new Date().getTime() - 30 * 24 * 60 * 60 * 1000, new Date().getTime()])
            }">最近30天</span></li>
      <li class="fl">
        <span class="item">自定义时间</span>
        <DatePicker type="daterange" placeholder="选择时间范围"
          :value="[params.startDate, params.endDate]" @on-change="time => {
                                if (!time[0]) return;
                                currTabIndex = 2;
                                changeTime(time);
                            }" style="position:relative;top: -2px;width: 200px;margin-left:10px;">
        </DatePicker>
      </li>
      <li class="fl">
        <Select style="width: 200px;" v-model="params.source">
          <Option value="-1">全部来源</Option>
          <Option value="app">APP应用</Option>
          <Option value="pc">PC端</Option>
          <Option value="weChat">微信端</Option>
        </Select>
      </li>
    </ul>

    <h3 class="cloud-icon title">机器人回答构成</h3>
    <ul class="count-box">
      <li>
        <p class="name">总回答</p>{{ surveyCount.totalNum }}
      </li>
      <li>
        <p class="name">寒暄</p>{{ surveyCount.greetingNum }}
      </li>
      <li>
        <p class="name">资源回答</p>{{ surveyCount.resourceNum }}
      </li>
      <li>
        <p class="name">知识回答</p>{{ surveyCount.knowledgeNum }}
      </li>
      <li>
        <p class="name">投诉</p>{{ surveyCount.complaintNum }}
      </li>
      <li>
        <p class="name">未知回答</p>{{ surveyCount.unknownNum }}
      </li>
    </ul>
    <div class="block2">
      <LineEchart :configure="lineEchartConfig" class="chart-div"></LineEchart>
    </div>

    <h3 class="cloud-icon title">热点业务问题</h3>
    <div class="block1 block-hot">
      <Form :model="params_hot" :label-width="80" inline>
        <FormItem label="问题分类">
          <Select class="w200" v-model="params_hot.qaType">
            <Option value="-1">全部</Option>
            <Option :value="item.id" v-for="item in qaTypeList" :key="item.id">{{ item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="仓库分类">
          <Select class="w200" v-model="params_hot.depotType">
            <Option value="-1">全部</Option>
            <Option value="greeting">寒暄库</Option>
            <Option value="knowledge">问答库</Option>
          </Select>
        </FormItem>
        <FormItem label="搜关键字">
          <Input class="w200" :maxlength="100" @on-enter="e => params_hot.question = e.target.value" placeholder="输入您想搜索的问题" />
        </FormItem>
        <Button type="primary" style="margin-right: 10px;" @click="getQaDepotCount()">搜索</Button>
        <Button @click="exportExcel">导出</Button>
      </Form>
      <BaseTable :configure="tableConfig" @getList="getQaDepotCount">
        <Table border :columns="tableData.header" :data="tableData.list" :loading="loading"></Table>
      </BaseTable>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import LineEchart from "@components/groupChart/groupChart.vue";
import BaseTable from "@components/baseTable/baseTable.vue";
import {
  getQaRecordCount,
  getQaDepotCount,
  getQaselectList
} from "@service/tool";
import { formatterDate, exportExcel } from "@util/comm";
import CONFIG from "@/util/config";
import { AppModule } from "@store/modules/app";

@Component({
  components: {
    BaseTable,
    LineEchart
  }
})
export default class MemberList extends Vue {
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "right"
  };
  private tableData: any = {
    header: [
      {
        title: "排名",
        key: "ranking",
        width: 100,
        align: "center"
      },
      {
        title: "问题",
        key: "question",
        align: "left"
      },
      {
        title: "所属分类",
        key: "qaTypeName",
        width: 300,
        align: "center"
      },
      {
        title: "命中次数",
        key: "hitNum",
        width: 200,
        align: "center"
      }
    ],
    list: []
  };
  private loading: boolean = false;
  private lineEchartConfig = <any>{
    data: [
      //                 {ydata: "4.5", series: [12, 12 + 20, 12 + 30, 12 + 5]}
    ], //动态数据
    color: [
      "#5599ff",
      "#0dcdda",
      "#13d89e",
      "#5ac858",
      "#ff9051",
      "#f7bb3a",
      "#ff5b5b",
      "#987de6",
      "#e26ed3",
      "#53c168",
      "#e8aa15",
      "#ddc600",
      "#fa6286",
      "#c36ee2",
      "#7e83f1"
    ], //颜色数组
    seriesName: [
      /*"文化场馆", "酒店", '景区', '餐饮','公共资源'*/
      "总回答",
      "寒暄",
      "资源回答",
      "知识回答",
      "投诉",
      "未知回答"
    ], //系列名称
    seriesType: ["line", "line", "line", "line", "line"], //系列类型
    isLenged: true, //是否开启图例
    selectedMode: true,
    lengedPosition: ["bottom", "", "", "right"], // 上,右,下,左
    //             isLable:true,
    yCompany: ["单位：条"] // 如果不设置单位默认为个
  };
  // 当前tab索引
  private currTabIndex = 0;

  //获取token
  get token() {
    return AppModule.token;
  }
  private qaTypeList: any[] = [];
  private surveyCount: any = {
    resourceNum: 0,
    knowledgeNum: 0,
    complaintNum: 0,
    totalNum: 0,
    unknownNum: 0,
    greetingNum: 0
  };
  // 热门参数
  private params_hot: any = {
    startDate: "",
    endDate: "",
    source: "-1",
    qaType: "-1",
    depotType: "-1",
    question: ""
  };
  // 基本参数
  private params = <any>{
    startDate: "",
    endDate: "",
    source: "-1"
  };
  @Watch("params", { deep: true })
  wParams(v: any) {
    this.getQaRecordCount();
    this.params_hot = { ...this.params_hot, ...v };
  }
  @Watch("params_hot", { deep: true })
  wParamsHot(v: any) {
    this.getQaDepotCount();
  }

  mounted() {
      (this.$refs['7day'] as HTMLElement).click()
  }
  created() {
    // 获取问题分类
    getQaselectList().then((res: any) => {
      if (res.code === 0) {
        this.qaTypeList = res.datas;
      }
    });
  }
  // 获取统计数据
  private getQaRecordCount() {
    getQaRecordCount(
      this.params.source === "-1" ? { ...this.params, source: "" } : this.params
    ).then((res: any) => {
      if (res.code === 0) {
        let data = res.data;
        this.surveyCount = { ...this.surveyCount, ...data.surveyCount };
        this.lineEchartConfig.data = data.lineChartCount;
      }
    });
  }
  // 获取热门统计
  private getQaDepotCount(page?: any) {
    this.loading = true;
    if (page) {
      Object.assign(this.params_hot, page);
    } else {
      this.params_hot.currPage = 1;
    }
    
    let params_hot = {...this.params_hot};
    if (params_hot.source === "-1") params_hot.source = '';
    if (params_hot.depotType === "-1") params_hot.depotType = '';
    if (params_hot.qaType === "-1") params_hot.qaType = '';
    getQaDepotCount(params_hot)
      .then((res: any) => {
        if (res.code === 0) {
          let data = res.datas;
          this.tableData.list = data
          this.tableConfig.page = res.page;
        }
      })
      .finally(() => (this.loading = false));
  }
  // 时间切换
  private changeTime(time: Array<number | string>) {
    this.params.startDate =
      typeof time[0] === "string"
        ? time[0]
        : formatterDate(time[0] as number).split(" ")[0];
    this.params.endDate =
      typeof time[1] === "string"
        ? time[1]
        : formatterDate(time[1] as number).split(" ")[0];
  }
  private exportExcel() {
    let {
      startDate,
      endDate,
      source,
      qaType,
      depotType,
      question
    } = this.params_hot;
    exportExcel(
      `${CONFIG.defaultUrl}/res/robotQaRecord/exportQaDepotCount?token=${this.token}&startDate=${startDate}&endDate=${endDate}&source=${source}&qaType=${qaType}&depotType=${depotType}&question=${question}`
    );
  }
}
</script>

<style lang='scss' scoped>
.w200 {
  width: 200px;
}
.nodata {
  position: absolute;
  top: 40%;
  width: 100%;
  text-align: center;
}

.container {
  padding: 20px;
}

.count-box {
  height: 105px;
  background-color: $bg01;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  > li {
    flex: 1;
    margin: 0 50px;
    align-items: center;
    text-align: center;
    font-size: 20px;
    line-height: 34px;
    border-radius: 5px;
    box-shadow: 0 2px 10px #ddd;
    .name {
      margin-top: 20px;
    }
  }
}

.title::before {
  position: relative;
  top: 1px;
  content: "\e697";
  font-size: 20px;
  color: $theme;
  margin-right: 10px;
}

.tab {
  padding-bottom: 20px;
  border-bottom: 1px solid #dedede;
  .fl {
    margin-right: 15px;
    line-height: 32px;
    &:last-child {
      .item {
        margin-right: 5px;
        color: #263b4d;
        cursor: default;
      }
    }
    .item {
      font-size: 16px;
      color: #148cf3;
      cursor: pointer;
      &.active {
        color: #fc8675;
        font-weight: bold;
      }
    }
  }
}

.title {
  margin: 15px 0;
  line-height: 32px;
  color: $font01;
  font-weight: bold;
  font-size: 16px;
}

.block1 {
  display: flex;
//   height: 400px;
  margin-bottom: 20px;
  position: relative;
  .left {
    position: relative;
    flex: 0.55;
  }
  .right {
    flex: 0.45;
  }
}
.block2 {
  height: 400px;
}
.block-hot {
  display: block;
}

.info-list {
  padding: 6px 0;
  display: flex;
  align-items: center;
  .img-box {
    position: relative;
    width: 40px;
    height: 40px;
    // background: url("../../../assets/image/daq-no-data.png") no-repeat center/cover;
    border-radius: 50%;
  }
  .introduce-content {
    margin-left: 10px;
    width: calc(100% - 50px);
  }
}
.des {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
