<template>
  <div>
    <Modal class="pic-preview-modal" v-model="show">
      <div class="transfer-form">
        <span>名称：</span>
        <Input v-model="params.name" class="transfer-ipt" />
        <Button type="primary" @click="searchHandle">搜索</Button>
      </div>
      <BaseTable :configure="configure" @getList="getList">
        <Table
          :columns="columns"
          :data="datas"
          border
          :loading="loading"
          @on-selection-change="onTableSelectHandle"
        >
          <template slot-scope="{ row }" slot="resourceType">{{row.pname}}</template>
        </Table>
      </BaseTable>
      <div slot="footer" class="pics-modal-footer">
        <Button type="text" @click="onHideModalHandle">取消</Button>
        <Button type="primary" @click="onSubmitHandle">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import { BaseTable } from "@components/index";
import { getChildObjectValidPower } from "@service/app";

interface ResourseDataType {
  name: string;
  resourceId: string;
  resourceType:
    | "CONTENT_TYPE_VENUE"
    | "CONTENT_TYPE_HOTEL"
    | "CONTENT_TYPE_SCENERY"
    | "CONTENT_TYPE_ACTIVITY_SHIU"
    | "CONTENT_TYPE_SCENIC_SPOTS"
    | "CONTENT_TYPE_HOTEL_ROOM"
    | "CONTENT_TYPE_RESTAURANT"
    | "CONTENT_TYPE_TOILET"
    | "CONTENT_TYPE_PARKING";
  child?: Array<ResourseDataType>;
  pname?: string;
  pid?:string;
  ptype?: string;
  _disabled?: boolean;
}

@Component({
  components: { BaseTable }
})
export default class TransferModal extends Vue {
  // v-model 弹窗是否展示
  @Prop({ default: false }) readonly value!: boolean;
  // 父级资源id
  @Prop() readonly id!: string;
  @Prop() readonly name!: string;
  @Prop() readonly resourceType!: string;
  @Prop() readonly targetKeys!:Array<ResourseDataType>;
  // 弹窗是否显示隐藏
  private show: boolean = false;
  // 组件baseTable配置信息
  private configure = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0,
      totalPage: 1
    },
    pagePosition: "right"
  };
  // 表单表头
  private columns = [
    {
      type: "selection",
      width: 60,
      align: "center"
    },
    {
      title: "名称",
      key: "name"
    },
    {
      title: "类型",
      slot: "pname"
    }
  ];
  // 表单展示数据列表
  private datas: Array<ResourseDataType> = [];
  // 表单加载动画
  private loading: boolean = false;
  // 请求列表参数
  private params = {
    resourceId: "",
    name: "",
    currPage: 1,
    pageSize: 10
  };
  // 表单选中数据
  private tableSelection: Array<ResourseDataType> = [];
  // v-model获取数据
  @Watch("value", { immediate: true, deep: true })
  onValueChange(val: boolean) {
    this.show = val;
    if (val) {
      this.tableSelection = [];
      this.params.resourceId = this.id;
      this.resetPage();
      this.getList();
    }
  }
  // 监听本身是否显示变化
  @Watch("show", { immediate: true, deep: true })
  omShowChange() {
    this.input();
  }
  // 监听父级的资源类型变化
  @Watch("resourceType", { immediate: true, deep: true })
  onResourceTypeChange(val: string) {
    let titleObj: any = {
      CONTENT_TYPE_VENUE: "活动室",
      CONTENT_TYPE_SCENERY: '景点',
      CONTENT_TYPE_HOTEL: '客房'
    };
    let title2Obj: any = {
      CONTENT_TYPE_VENUE: "文化场馆",
      CONTENT_TYPE_SCENERY: '景区',
      CONTENT_TYPE_HOTEL: '酒店'
    };
    let title = titleObj[val];
    let title2 = title2Obj[val];
    this.$set(this.columns, 1, { title: `${title}名称`, key: "name" });
    this.$set(this.columns, 2, { title: `所属${title2}`, key: "pname" });
  }
  // v-model绑定弹窗显示隐藏
  @Emit()
  input() {
    return this.show;
  }
  /**
   * getList 获取列表
   * @params page 当前的分页信息
   */
  getList(page?: any) {
    this.loading = true;
    if (page) {
      this.params.currPage = page.currPage;
      this.params.pageSize = page.pageSize;
    }
    getChildObjectValidPower(this.params)
      .then(res => {
        this.loading = false;
        if (res.code === 0) {
          let datas = res.datas as Array<ResourseDataType>;
          this.datasFormat(datas);
        }
      })
      .catch(err => {
        this.loading = false;
      });
  }
  /**
   * datasFormat 数据处理 为每条数据添加上父级资源的名字 并且设置父级已经选择的选项设置为不可选择
   *
   */
  datasFormat(datas: Array<ResourseDataType>) {
    datas.map(data => {
      data.pname = this.name;
      data.pid = this.id;
      data.ptype = this.resourceType;
      if (this.targetKeys.some(item => item.resourceId === data.resourceId)) {
        data._disabled = true;
      }
    });
    this.datas = datas;
  }
  // 表单左侧选择框选中
  onTableSelectHandle(val: Array<ResourseDataType>) {
    this.tableSelection = val;
  }
  // 搜索按钮
  searchHandle() {
    this.resetPage();
    this.getList();
  }
  // 取消弹窗按钮
  onHideModalHandle() {
    this.show = false;
  }
  // 点击确定弹窗按钮
  onSubmitHandle() {
    // 判断是否选中资源
    if (!this.tableSelection.length) {
      this.$Message.error("请选择需要添加的资源");
      return false;
    }
    // 选中了资源
    let data: Array<ResourseDataType> = [];
    this.tableSelection.map(item => {
      let { _disabled,...newData } = item;
      data.push(newData);
    });
    this.$parent.addChildResource(data);
    this.onHideModalHandle()
  }
  // 重置分页信息
  resetPage() {
    this.configure.page.pageSize = 10;
    this.configure.page.currPage = 1;
    this.params.pageSize = 10;
    this.params.currPage = 1;
  }
}
</script>

<style lang='scss' scoped>
.transfer-form {
  padding: 40px 0 15px;
}
.transfer-ipt {
  max-width: 160px;
  margin-right: 16px;
}
</style>
