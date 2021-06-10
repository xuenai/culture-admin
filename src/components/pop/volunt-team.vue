<!--
 * @Author: 任智勇
 * @since: 2019-06-19 11:01:59
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-06 15:09:34
 -->
<template>
  <div>
    <Modal
      v-model="show"
      :title="obj.title"
      @on-ok="okClick"
      @on-cancel="onClose"
      width="800"
      footer-hide
    >
      <div class="condition">
        <div class="fromItem">
          <label>{{obj.nameTxt}}</label>
          <Input
            type="text"
            style="width:150px;"
            @on-enter="getList"
            v-model="condition.name"
            placeholder="名称"
          />
        </div>
        <div class="fromItem">
          <label>{{obj.typeTxt}}</label>
          <Select @on-change="getList" v-model="condition.type" style="width:150px;">
            <Option value>全部</Option>
            <Option v-for="item in obj.types" :key="item.id" :value="item.name">{{item.name}}</Option>
          </Select>
        </div>
        <div class="fromItem">
          <Button type="primary" class="submit" @click="getList">搜索</Button>
        </div>
      </div>

      <baseTable class="table" :configure="tableConfig" @getList="getList">
        <Table
          border
          @on-selection-change="selectionTable"
          :columns="checkType.columns5"
          :loading="loading"
          :data="list"
          ref="table"
          height="468"
        >
          <template v-if="checkWay === 0" slot-scope="{ row }" slot="radio">
            <Radio
              :value="row._index === checkIndex"
              @on-change="()=>{checkIndex = row._index;selectionTable([list[row._index]])}"
            ></Radio>
          </template>
          <template slot-scope="{ row }" slot="images">
            <div class="siteInfoDiv">
              <div class="imgDiv">
                <img
                  :src="row.images.split(',')[0] || 'http://file.geeker.com.cn/uploadfile/ptisp/img/1562836442129/daq-no-data.png'"
                />
              </div>
            </div>
          </template>
          <template slot-scope="{row}" slot="name">
            <div class="name" :title="row.name">{{row.name}}</div>
          </template>
          <template slot-scope="{row}" slot="address">
            <div class="address" :title="row.address">{{row.address}}</div>
          </template>
        </Table>
      </baseTable>

      <div class="mt20 text-center">
        <Button type="primary" @click="okClick">确认</Button>
        <Button class="ml20" @click="onClose">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import { getDictType, getVoluntList } from "@service/common.ts";

@Component({ components: { baseTable } })
export default class Volunt extends Vue {
  @Prop({ default: 0 }) private type!: number; // 0: 关联志愿团队，1：关联社团
  @Prop({ default: false }) private show!: boolean; // 显示/影藏
  @Watch("show")
  refreshShow(show: boolean) {
    //            if (show && !this.list.length) this.getList();
    if (show) {
      this.condition.name = "";
      this.condition.type = "";
      this.getList();
    }
  }

  // 获取志愿团类型 社团类型
  private teamTypes: Array<{ value: any; name: string }> = [];
  private associationTypes: Array<{ value: any; name: string }> = [];
  private getDictType() {
    let type = this.type === 0 ? "VOLUNTEER_SERVICE_TYPE" : "ASSOCIATE_TYPE";
    getDictType({ type }).then((res: any) => {
      if (res.code === 0) {
        this.obj.types = res.datas;
      }
    });
  }

  private objs: Array<any> = [
    {
      title: "关联志愿团队",
      nameTxt: "团队名称",
      typeTxt: "团队类型",
      types: this.teamTypes,
      resourceType: "CONTENT_TYPE_VOLUNTEER_TEAM"
    },
    {
      title: "关联社团",
      nameTxt: "社团名称",
      typeTxt: "社团类型",
      types: this.associationTypes,
      resourceType: "CONTENT_TYPE_ASSOCIATION"
    }
  ];
  private obj: any = this.objs[this.type];

  private checkIndex: number = -1; // 单选时，当前选中的元素索引
  @Prop({ default: 1 }) private checkWay!: number; // 0 单选，1多选
  private checkTypes: Array<object> = [
    {
      columns5: [
        {
          title: "单选",
          slot: "radio",
          width: 60,
          align: "center"
        },
        {
          title: "主图",
          key: "images",
          width: 100,
          slot: "images",
          align: "center"
        },
        {
          title: "名称",
          key: "name",
          width: 250,
          slot: "name",
          align: "center"
        },
        {
          title: this.obj.typeTxt,
          key: "type",
          align: "center"
        },
        {
          title: "地址",
          key: "address",
          slot: "address",
          align: "center"
        }
      ]
    },
    {
      columns5: [
        {
          type: "selection",
          width: 60
        },
        {
          title: "主图",
          key: "images",
          width: 100,
          slot: "images",
          align: "center"
        },
        {
          title: "名称",
          key: "name",
          width: 250,
          slot: "name",
          align: "center"
        },
        {
          title: this.obj.typeTxt,
          key: "type",
          align: "center"
        },
        {
          title: "地址",
          key: "address",
          slot: "address",
          align: "center"
        }
      ]
    }
  ];
  private checkType: object = this.checkTypes[this.checkWay];

  // 默认选中id
  @Prop({ default: () => [] }) selectIds!: Array<number | string>;

  created() {
    this.getDictType();
    this.getList();
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
  private loading = true;
  // 列表数据
  private list: Array<any> = [];
  //   查询条件
  private condition: any = {
    name: "",
    type: "",
    resourceType: this.obj.resourceType,
    orgId: this.$store.state.app.userInfo.orgId || -1
  };
  // 获取列表数据的方法
  private getList(page?: any) {
    this.checkIndex = -1;
    this.loading = true;
    this.selectionList = [];
    if (page) {
      Object.assign(this.condition, page);
    } else {
      this.condition.currPage = 1;
    }
    getVoluntList(this.condition)
      .then((res: any) => {
        if (res.code === 0) {
          res.datas.forEach((item: any, i: number) => {
            if (
              this.selectIds.includes(item.id) ||
              this.selectIds.includes(item.id + "")
            ) {
              if (this.checkWay === 0) {
                this.checkIndex = i;
                this.selectionList = [item];
              } else {
                item._checked = true;
                this.selectionList.push(item);
              }
            }
          });
          this.list = res.datas;
          this.tableConfig.page = res.page;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  // 弹窗表格选中的数据项
  private selectionList: Array<any> = [];
  //  复选表格 列表选择项数据变化
  private selectionTable(data: Array<any>) {
    this.selectionList = data;
  }
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
    this.$emit("onClose", false);
  }
}
</script>

<style lang='scss' scoped>
.condition {
  margin-bottom: 10px;
  .fromItem {
    label {
      margin-right: 5px;
    }
    display: inline-block;
    margin-right: 10px;
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
