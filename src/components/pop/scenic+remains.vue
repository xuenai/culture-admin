<template>
  <Modal v-model="show" title="添加资源" @on-ok="okClick" @on-cancel="onClose" width="1000" footer-hide>
    <div class="condition">
      <div class="fromItem">
        <label>名称</label>
        <Input type="text" style="width:150px;" @on-enter="() => getList()" v-model="condition.name"
          placeholder="输入名称" />
      </div>
      <div class="fromItem">
        <label>资源类型</label>
        <Select @on-change="() => getList()" v-model="condition.resourceType" style="width:150px;">
          <!-- <Option value="-1">全部</Option> -->
          <Option value="CONTENT_TYPE_SCENERY">景区</Option>
          <Option value="CONTENT_TYPE_HERITAGE_EXPERIENCE_BASE">非遗</Option>
        </Select>
      </div>
      <div class="fromItem">
        <Button type="primary" class="submit" @click="() => getList()">搜索</Button>
      </div>
    </div>

    <baseTable class="table" :configure="tableConfig" @getList="getList">
      <Table border :columns="columns" :loading="loading" :data="list" height="330">
        <template slot-scope="{ row }" slot="action"><a href="javascript:;" @click="() => { 
            if (!checkedList.some(d=>d.resourceId==row.resourceId && d.resourceType==row.resourceType)) { 
              checkedList.push(row)
            } 
          }">选择</a></template>
      </Table>
    </baseTable>

    <h3 style="line-height:40px">已选资源 {{checkedList.length}}个</h3>
    <div>
      <span class="pt" v-for="(item,i) in checkedList" :key="item.resourceId + item.resourceType">{{ item.name }}<span @click="checkedList.splice(i,1)"></span></span>
    </div>

    <div class="mt20 text-center">
      <Button type="primary" @click="okClick">保存</Button>
      <Button class="ml20" @click="onClose">取消</Button>
    </div>
  </Modal>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import { getGuidedTourResourceSelect, saveGuidedTourResource } from "@service/tool";

@Component({ components: { baseTable } })
export default class ContentPop extends Vue {
  @Prop({ default: false }) private value!: boolean; // 显示/影藏
  @Prop() private tourId: any;
  @Watch("value")
  refreshValue(value: boolean) {
    this.show = value;
    if (value) {
      this.checkedList = [];
      this.getList();
    }
  }
  @Watch("show")
  refreshShow(show: boolean) {
    this.$emit("input", show);
  }
  private checkedList: any[] = [];
  private loading: boolean = true;
  private show: boolean = false;
  // 获取列表数据的方法
  private getList(page?: any) {
    this.loading = true;
    if (page) {
      Object.assign(this.condition, page);
    } else {
      this.condition.currPage = 1;
    }
    let params = { ...this.condition };
    if (params.resourceType === "-1") delete params.resourceType;
    getGuidedTourResourceSelect(params)
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
    this.condition.tourId = this.tourId
  }

  private columns: Array<any> = [
    {
      title: "名称",
      key: "name",
      align: "left"
    },
    {
      title: "操作",
      slot: "action",
      align: "center"
    }
  ];

  // 表格配置
  private tableConfig = <any>{
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "center"
  };
  // 列表数据
  private list: Array<any> = [];
  // 查询条件
  private condition: any = {
    name: "",
    resourceType: 'CONTENT_TYPE_SCENERY'
  };
  // 点击弹窗确认按钮事件
  private okClick() {
    if (!this.checkedList || !this.checkedList.length) {
      this.$Message.info("未选中数据");
    } else {
      this.loading = true
      saveGuidedTourResource({
        tourId: this.tourId,
        resources: this.checkedList.map((d:any) => ({resourceType: d.resourceType, resourceId: d.resourceId}))
      }).then((res:any) => {
        this.onClose();
        this.$emit("select", this.checkedList);
      }).finally(() => this.loading = false)
    }
  }
  // 弹窗关闭时
  private onClose() {
    this.$emit("input", false);
  }
}
</script>

<style lang='scss' scoped>
.pt {
  display: inline-block;
  margin-right: 15px;
  position: relative;
  &:nth-last-of-type(1) {
    margin-right: 25px;
  }
  span {
    display: block;
    width: 0;
    &::after {
      content: "×";
      position: absolute;
      right: -15px;
      top: -4px;
      width: 15px;
      height: 15px;
      text-align: center;
      line-height: 13px;
      font-size: 15px;
      color: #fff;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      border: 1px solid #fff;
      cursor: pointer;
    }
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
