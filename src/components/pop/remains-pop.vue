<template>
  <Modal
    v-model="show"
    title="添加非遗项目"
    @on-ok="okClick"
    @on-cancel="onClose"
    width="1000"
    footer-hide
  >
    <div class="condition">
      <div class="fromItem">
        <label>名称</label>
        <Input
          type="text"
          style="width:150px;"
          @on-enter="() => getList()"
          v-model="condition.name"
          placeholder="输入项目名称"
        />
      </div>
      <div class="fromItem">
        <label>类型</label>
        <Select @on-change="() => getList()" v-model="condition.type" style="width:150px;">
          <Option value="-1">全部</Option>
          <Option :value="type.id" v-for="type in types" :key="type.id">{{ type.name }}</Option>
        </Select>
      </div>
      <div class="fromItem">
        <label>级别</label>
        <Select @on-change="() => getList()" v-model="condition.level" style="width:150px;">
          <Option value="-1">全部</Option>
          <Option :value="level.id" v-for="level in levels" :key="level.id">{{ level.name }}</Option>
        </Select>
      </div>
      <div class="fromItem">
        <label>批次</label>
        <Select @on-change="() => getList()" v-model="condition.batch" style="width:150px;">
          <Option value="-1">全部</Option>
          <Option :value="batch.id" v-for="batch in batchs" :key="batch.id">{{ batch.name }}</Option>
        </Select>
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
        <template slot-scope="{ row }" slot="image">
          <div class="image">
            <img  v-if="row.images" :src="row.images.split(',')[0]" alt="">
          </div>
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
import { ctcHeritageList } from "@service/activity";
import { dictType } from "@service/common";

@Component({ components: { baseTable } })
export default class ContentPop extends Vue {
  @Prop({ default: false }) private value!: boolean; // 显示/影藏
  @Watch("value")
  refreshValue(value: boolean) {
    this.show = value
    if (value) {
      this.selectionList = []
      this.getList();
    }
  }
  @Watch("show")
  refreshShow(show: boolean) {
    this.$emit("input", show);
  }
  private levels: any[] = [];
  private types: any[] = [];
  private batchs: any[] = [];
  private getDictType(type: string) {
    return dictType({ type }).then((res: any) => {
      if (res.code === 0) {
        return res.datas
      } else {
        return []
      }
    })
  }
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
    let params = {...this.condition}
    if (params.level === '-1') delete params.level
    if (params.type === '-1') delete params.type
    if (params.batch === '-1') delete params.batch
    ctcHeritageList(params).then((res: any) => {
      if (res.code === 0) {
        res.datas.forEach((d:any, i:number) => {
          if (this.checkWay === 0) {
            if (this.selectIds.includes(d.id)) this.checkIndex = i
          } else {
            d._checked = this.selectIds.includes(d.id)
          }
        })
        this.list = res.datas;
        this.tableConfig.page = res.page;
      }
    }).finally(() => this.loading = false);
  }

  created() {
    this.getDictType('HERITAGE_LEVEL').then((datas:any) => this.levels = datas);
    this.getDictType('HERITAGE_TYPE').then((datas:any) => this.types = datas);
    this.getDictType('HERITAGE_BATCH').then((datas:any) => this.batchs = datas);
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
        width: 60,
        fixed:'left',
        align: "center"
      },
      {
        title: "主图",
        width: 200,
        slot: "image",
        fixed:'left',
      },
      {
        title: "名称",
        key: "name",
        align: "center"
      },
      {
        title: "项目编号",
        key: "reportCode",
        align: "center"
      },
      {
        title: "地区",
        key: "regionName",
        align: "center"
      },
      {
        title: "类别",
        key: 'type',
        align: 'center'
      },
      {
        title: "级别",
        key: 'level',
        align: 'center'
      },
      {
        title: "批次",
        key: 'batch',
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
        title: "主图",
        width: 200,
        slot: "image",
        fixed:'left',
      },
      {
        title: "名称",
        key: "name",
        align: "center"
      },
      {
        title: "项目编号",
        key: "reportCode",
        align: "center"
      },
      {
        title: "地区",
        key: "regionName",
        align: "center"
      },
      {
        title: "类别",
        key: 'type',
        align: 'center'
      },
      {
        title: "级别",
        key: 'level',
        align: 'center'
      },
      {
        title: "批次",
        key: 'batch',
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
    name: "",
    type: "-1",
    level: "-1",
    batch: "-1",
    status: 1
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
.image {
  padding:10px;
  font-size:0;
  display: flex;
  img{
    max-height:80px;
    width:auto;
    margin:0 auto;
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
