<template>
  <Modal
    v-model="show"
    title="内容列表"
    @on-ok="okClick"
    @on-cancel="onClose"
    width="1000"
    footer-hide
  >
    <div class="condition">
      <div class="fromItem">
        <label>标题</label>
        <Input
          type="text"
          style="width:150px;"
          @on-enter="() => getList()"
          v-model="condition.title"
          placeholder="输入内容标题"
        />
      </div>
      <div class="fromItem">
        <label>类型</label>
        <Select @on-change="() => getList()" v-model="condition.contentType" style="width:150px;">
          <Option value>全部</Option>
          <Option value="CONTENT">内容</Option>
          <Option value="IMAGE">图片</Option>
          <Option value="VIDEO">视频</Option>
          <Option value="AUDIO">音频</Option>
        </Select>
      </div>
      <div class="fromItem">
        <label>提交时间</label>
        <DatePicker
          type="daterange"
          separator=" 至 "
          @on-change="time => { condition.startDate = time[0];condition.endDate = time[1];getList() }"
          placeholder="选择日期筛选"
          placement="bottom-end"
          style="width: 200px"
        ></DatePicker>
      </div>
      <div class="fromItem">
        <Button type="primary" class="submit" @click="() => getList()">搜索</Button>
      </div>
    </div>

    <baseTable class="table" :configure="tableConfig" @getList="getList">
      <Table
        border
        @on-selection-change="data => selectionList = data"
        :columns="checkTypes[checkWay]"
        :loading="loading"
        :data="list"
        height="468"
      >
        <template v-if="checkWay === 0" slot-scope="{ row }" slot="radio">
          <Radio
            :value="row._index === checkIndex"
            @on-change="()=>{ checkIndex = row._index; selectionList = [list[row._index]] }"
          ></Radio>
        </template>
        <template slot-scope="{ row }" slot="title">
          <div class="title fl">
            <span class="red" v-if="row.top">[置顶]</span>
            <span class="red" v-if="row.recommendChannelHomePage || row.recommendHomePage">[推荐]</span>
            <router-link
                tag="a"
                :to="{path:'/con-detail',query:{id:row.id,contentType:row.contentType,modify:row.showProcess}}"
                href="javascript:;"
                class="theme-blue action-btn"
                :title="row.title"
              >{{row.title}}</router-link>
          </div>
          <i class="cloud-icon titleIcon" v-if="row.images">&#xe6f8;</i>
          <i class="cloud-icon titleIcon" v-if="row.video">&#xe6fa;</i>
          <i class="cloud-icon titleIcon" v-if="row.audio">&#xe6fb;</i>
        </template>
        <template slot-scope="{ row }" slot="contentType">
          <div>{{getStatusTxt[row.contentType]}}</div>
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
import { getContentList } from "@service/content";
import { getStatusTxt } from "@util/comm";

@Component({ components: { baseTable } })
export default class ContentPop extends Vue {
  @Prop({ default: false }) private value!: boolean; // 显示/影藏
  @Watch("value")
  refreshValue(value: boolean) {
    this.show = value
    if (value) {
      this.condition.title = "";
      this.condition.contentType = "";
      this.selectionList = []
      this.getList();
    }
  }
  @Watch("show")
  refreshShow(show: boolean) {
    this.$emit("input", show);
  }
  private getStatusTxt: object = getStatusTxt
  private loading: boolean = true;
  private show: boolean = false;
  // 获取列表数据的方法
  private getList(page?: any) {
    this.loading = true;
    this.checkIndex = -1;
    if (page) {
      Object.assign(this.condition, page);
    } else {
      this.condition.currPage = 1
    }
    getContentList(this.condition).then((res: any) => {
      if (res.code === 0) {
        this.list = res.datas;
        this.tableConfig.page = res.page;
      }
    }).finally(() => this.loading = false);
  }

  created() {
    this.getList()
    this.show = this.value
  }

  // 默认选中id
  @Prop({ default: () => [] }) selectIds!: Array<number | string>;
  @Prop({ default: 1 }) private checkWay!: number; // 0 单选，1多选
  private checkTypes: Array<any> = [
    [
      {
        title: "单选",
        slot: "radio",
        width: 80,
        fixed:'left',
        align: "center"
      },
      {
        title: "标题",
        width: 300,
        slot: "title",
        fixed:'left',
      },
      {
        title: "创建者",
        key: "createCompany",
        align: "center"
      },
      {
        title: "类型",
        key: "contentType",
        slot: "contentType",
        align: "center"
      },
      {
        title: "发布时间",
        key: "publishTime",
        align: "center"
      },
      {
        title: "浏览量",
        key: 'showNum',
        align: 'center'
      }
    ],
    [
      {
        type: "selection",
        width: 60,
        align: "center",
        fixed:'left',
      },
      {
        title: "标题",
        width: 300,
        slot: "title",
        fixed:'left',
      },
      {
        title: "创建者",
        key: "createCompany",
        align: "center"
      },
      {
        title: "类型",
        key: "contentType",
        slot: "contentType",
        align: "center"
      },
      {
        title: "发布时间",
        key: "publishTime",
        align: "center"
      },
      {
        title: "浏览量",
        key: 'showNum',
        align: 'center'
      }
    ]
  ];

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
  // 查询条件
  private condition: any = { 
    title: "",
    contentType: "",
    status: 1,
    startDate: "",
    endDate: ""
  };

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
}
</script>

<style lang='scss' scoped>
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
