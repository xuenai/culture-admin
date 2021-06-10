<template>
  <Modal v-model="show" title="添加活动" @on-ok="okClick" @on-cancel="onClose" width="1300" footer-hide>
    <div class="condition">
      <div class="fromItem">
        <label>活动名称</label>
        <Input type="text" style="width:150px;" @on-enter="getList()" v-model="condition.name"
          placeholder="输入活动名称" />
      </div>
      <div class="fromItem">
        <label>活动分类</label>
        <Select style="width: 200px" v-model="condition.classify" @on-change="getList()">
          <Option value="-1">全部</Option>
          <Option :value="item.id" v-for="item in activityClassify" :key="item.id">
            {{item.labelName}}</Option>
        </Select>
      </div>
      <div class="fromItem">
        <label>活动级别</label>
        <Select style="width: 200px" v-model="condition.activityLevel" @on-change="getList()">
          <Option value="-1">全部</Option>
          <Option :value="item.value" v-for="item in activityLevel" :key="item.value">{{item.labelName}}</Option>
        </Select>
      </div>
      <div class="fromItem">
        <label>活动日期</label>
        <DatePicker type="daterange" separator=" 至 "
          :value="[condition.activityStart, condition.activityEnd]"
          @on-change="time => { condition.activityStart = time[0];condition.activityEnd = time[1];getList() }"
          placeholder="选择日期筛选" placement="bottom-end" style="width: 200px"></DatePicker>
      </div>
      <div class="fromItem">
        <Button type="primary" class="submit" @click="getList()">搜索</Button>
      </div>
    </div>

    <baseTable class="table" :configure="tableConfig" @getList="getList">
      <Table border @on-selection-change="data => selectionList = data"
        :columns="checkTypes[checkWay]" :loading="loading" :data="list" height="468">
        <template v-if="checkWay === 0" slot-scope="{ row }" slot="radio">
          <Radio :value="row._index === checkIndex"
            @on-change="()=>{ checkIndex = row._index; selectionList = [list[row._index]] }">
          </Radio>
        </template>
        <template slot-scope="{ row }" slot="image">
          <div class="daq-no-photo">
            <img v-if="row.images" :src="row.images.split(',')[0]"  @click="viewImage(row.images.split(','), row.name, 0)" />
          </div>
        </template>
        <template slot-scope="{ row }" slot="name">
          <div class="title fl">
            <span class="red" v-if="row.top">[置顶]</span>
            <span class="red" v-if="row.recommendChannelHomePage || row.recommendHomePage">[推荐]</span>
            <router-link tag="a" :to="{path:'/ac-detail',query:{id:row.id}}" class="theme-blue action-btn" :title="row.name">{{row.name}}
            </router-link>
          </div>
        </template>
        <template slot-scope="{ row }" slot="activityLevel">
          <div>{{activityLevel.filter(d => d.value === row.activityLevel).length?activityLevel.filter(d => d.value === row.activityLevel)[0].labelName:'--'}}</div>
        </template>
      </Table>
    </baseTable>

    <div class="mt20 text-center">
      <Button type="primary" @click="okClick">确认</Button>
      <Button class="ml20" @click="onClose">取消</Button>
    </div>
  </Modal>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import { getActivityList } from "@service/activity";
import { getTagsSelect } from "@service/common";

@Component({ components: { baseTable } })
export default class ContentPop extends Vue {
  @Prop({ default: ()=>({}) }) params!: any;
  @Prop() excludeActivityId: any; // 排除id
  // 查询条件
  private condition: any = {
    name: "",
    classify: "-1",
    activityLevel: '-1',
    activityStart: "",
    activityEnd: "",
  }

  @Prop({ default: false }) private value!: boolean; // 显示/影藏
  @Watch("value")
  refreshValue(value: boolean) {
    this.show = value;
    if (value) {
      this.condition.excludeActivityId = this.excludeActivityId
      this.condition.name = "";
      this.condition.classify = "-1";
      this.condition.activityLevel = "-1";
      this.condition.activityStart = "";
      this.condition.activityEnd = "";
      this.selectionList = [];
      Object.assign(this.condition, this.params)
      this.getList();
    }
  }
  @Watch("show")
  refreshShow(show: boolean) {
    this.$emit("input", show);
  }
  //活动级别
  private activityLevel: Array<any> = [
    { labelName: "国家", value: "ACTIVITY_LEVEL_COUNTRY" },
    { labelName: "省", value: "ACTIVITY_LEVEL_PROVINCE" },
    { labelName: "市", value: "ACTIVITY_LEVEL_CITY" },
    { labelName: "县", value: "ACTIVITY_LEVEL_COUNTY" },
    { labelName: "其它", value: "ACTIVITY_LEVEL_OTHER" }
  ];
  private loading: boolean = true;
  private show: boolean = false;
  // 获取列表数据的方法
  private getList(page?: any) {
    this.loading = true;
    this.checkIndex = -1;
    if (page) {
      Object.assign(this.condition, page);
    } else {
      this.condition.currPage = 1;
    }
    let params = {...this.condition}
    if (params.classify === '-1') params.classify = ''
    if (params.activityLevel === '-1') params.activityLevel = ''
    getActivityList(params)
      .then((res: any) => {
        if (res.code === 0) {
          this.list = res.datas;
          this.tableConfig.page = res.page;
        }
      })
      .finally(() => (this.loading = false));
  }

  created() {
    this.show = this.value;
    this.condition.excludeActivityId = this.excludeActivityId
    this.getActivityClassify();
  }

  @Prop({ default: 1 }) private checkWay!: number; // 0 单选，1多选
  private checkTypes: Array<any> = [
    [
      {
        title: "单选",
        slot: "radio",
        width: 80,
        fixed: "left",
        align: "center"
      },
      {
        title: "主图",
        width: 240,
        slot: "image",
        fixed: "left"
      },
      {
        title: "名称",
        slot: "name",
        align: "left"
      },
      {
        title: "类型",
        key: "classifyName",
        align: "center"
      },
      {
        title: "级别",
        slot: "activityLevel",
        align: "center"
      },
      {
        title: "时间",
        key: "useStartTime",
        align: "center"
      }
    ],
    [
      {
        type: "selection",
        width: 60,
        align: "center",
        fixed: "left"
      },
      {
        title: "主图",
        width: 240,
        slot: "image",
        fixed: "left"
      },
      {
        title: "名称",
        slot: "name",
        align: "left"
      },
      {
        title: "类型",
        key: "classifyName",
        align: "center"
      },
      {
        title: "级别",
        slot: "activityLevel",
        align: "center"
      },
      {
        title: "时间",
        key: "useStartTime",
        align: "center"
      }
    ]
  ];

  // 活动分类
  private activityClassify = [];
  // 获取活动分类
  private getActivityClassify() {
    getTagsSelect({
      resourceType: "CONTENT_TYPE_ACTIVITY",
      labelType: "ACTIVITY_CLASSIFY",
      activityType: "ACTIVITY_TYPE_SERVICE"
    }).then((res: any) => {
      if (res.code === 0) {
        this.activityClassify = res.datas;
      }
    });
  }

  // 表格配置
  private tableConfig = <any>{
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0
    },
    pagePosition: "right"
  };
  // 列表数据
  private list: Array<any> = [];

  // 单选按钮选中的项
  private checkIndex: number = -1;

  // 弹窗表格选中的数据项
  private selectionList: Array<any> = [];
  // 点击弹窗确认按钮事件
  private okClick() {
    if (!this.selectionList || !this.selectionList.length) {
      this.$Message.info("未选中数据");
    } else {
      this.onClose();
      this.$emit("onOkClick", this.selectionList);
      this.$emit("onGetCondition", this.condition);
    }
  }
  // 弹窗关闭时
  private onClose() {
    this.$emit("input", false);
  }

  
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
}
</script>

<style lang='scss' scoped>
.daq-no-photo {
  width: 200px;
  height: 130px;
  padding: 10px 0 0;
  margin-bottom: 10px;
  overflow: hidden;
  img {
    width: 100%;
  }
}
.condition {
  margin-bottom: 10px;
  .fromItem {
    label {
      margin-right: 10px;
    }
    display: inline-block;
    margin-right: 20px;
  }
}

.table {
  margin-top: 10px;
  .siteInfoDiv {
    display: flex;
    margin: 5px 0;
    .imgDiv {
      width: 50px;
      height: 50px;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .address {
    max-width: 100%;
    @include ellipsis();
  }
  .name {
    max-width: 100%;
    @include ellipsis();
  }
}
</style>
