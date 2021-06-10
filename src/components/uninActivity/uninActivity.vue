<!--
 * @Author: 任智勇
 * @since: 2019-06-19 11:01:59
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-20 15:07:20
 -->
<template>
  <div>
    <Modal
      v-model="mshow"
      :title="title ? title : '添加活动'"
      @on-cancel="onClose"
      width="800"
      footer-hide
    >
      <div class="condition">
        <div class="fromItem">
          <label>活动名称</label>
          <Input type="text" style="width:150px;" v-model="condition.name" placeholder="名称"/>
        </div>
        <div class="fromItem">
          <label>活动方式</label>
          <Select style="width: 150px" v-model="condition.method" :disabled="disabled" @on-change="typeChange" :value="activityType">
              <Option value>全部</Option>
              <Option value="ACTIVITY_MODE_FREE">免费预订</Option>
              <Option value="ACTIVITY_MODE_INTEGRAL">积分兑换</Option>
              <Option value="ACTIVITY_MODE_MONEY">在线支付</Option>
              <Option value=" ACTIVITY_MODE_MONEY_INTEGRAL">在线支付+积分</Option>
              <Option value="ACTIVITY_MODE_UNDER_LINE">线下报名</Option>
              <Option value="ACTIVITY_MODE_ON_LINE">线上报名</Option>
              <Option value="ACTIVITY_MODE_SERVICE">普通活动</Option>
              <Option value="ACTIVITY_MODE_PLAIN">普通分享活动</Option>
              <Option value="ACTIVITY_MODE_OTHER">其他分享活动</Option>
            </Select>
        </div>
        <div class="fromItem">
          <Button type="primary" class="submit" @click="handleSubmit">搜索</Button>
        </div>
      </div>
      <baseTable v-if="!isRadio" class="table" :configure="tableConfig" @getList="getList">
        <Table
          border
          @on-selection-change="selectionTable"
          :columns="data.header"
          :loading="loading"
          :data="data.list"
          ref="table"
          class="tabelDiv"
        >
          <template slot-scope="{ row }" slot="images">
            <div class="siteInfoDiv">
              <div class="imgDiv">
                <img :src="row.images">
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="siteType">
            <i>{{getStatusTxt[row.method]}}</i>
          </template>
        </Table>
      </baseTable>

      <baseTable v-else class="table" :configure="tableConfig" @getList="getList">
        <Table
          border
          @on-selection-change="selectionTable"
          :columns="data.header"
          :loading="loading"
          :data="data.list"
          ref="table"
          class="tabelDiv"
          :height="468"
        >
          <template slot-scope="{ row }" slot="radio">
            <Radio v-model="radioGroup[row._index]" @on-change="checkRadio(row)"></Radio>
          </template>
          <template slot-scope="{ row }" slot="images">
            <div class="siteInfoDiv">
              <div class="imgDiv">
                <img :src="row.images">
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="siteType">
            <i>{{getStatusTxt[row.method]}}</i>
          </template>
        </Table>
      </baseTable>
      <div class="mt20 text-center" >
        <Button type="primary" @click="okClick">确认</Button>
        <Button class="ml20" @click="onClose">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
/**
 * 使用示例：将下列模板 拷贝，js 部分也拷贝过去，即可以直接使用了
 * <uninPlace :show="place" @onOkClick="onOkClick" @onClose="place=false"></uninPlace>
 * 
 * js:
        private place = false;
        private showPlaceDialog(){
            this.place = true
        }
        private onOkClick(list:Array<any>){
            console.log(list)
        }
  * 
  * 参数说明
  * title: 弹窗标题,不传时默认为: 关联场所
  * show: 是否显示弹窗
  * isRadio: 默认不传时我复选表格， 传 true 时为单选表格
  * defaultChoose: 表格数据的默认选中项
  * activityType: 场所类型条件 默认值为空
  * orgId:   创建者(组织机构) id
  * disabled:  场所类型下拉框是否可以用 默认值 false，传 true 表示不可用
  * 
  * 事件
  * @onOkClick: 弹窗点击确定时调用的方法，改方法参数为 列表选中的数据 不论单选还是复选表格数据都是 数组[]
  * @onClose: 必须监听弹窗关闭时的事件，然后将 show 参数置为false,否则会有问题
  * @onTypeChange: 条件选择器 场所类型切换时触发，参数为：当前查询条件
  * 
  * 若不需要时刻监听下拉框数据变化，只需要在点击确定时才获取条件参数，则使用下面的事件
  * @onGetCondition: 条件选择器 场所类型切换时触发，参数为：当前查询条件
  * 
 */
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import Dialog from "@components/Dialog/Dialog.vue";
import { getActivityList } from "@service/activity.ts";
import {getStatusTxt} from "@util/comm";

@Component({ components: { baseTable, Dialog } })
export default class UninActivity extends Vue {
  @Prop() private title!: string;
  @Prop() private show!: boolean;
  private mshow: boolean = false;
  private getStatusTxt = getStatusTxt;
  @Watch("show")
  refreshShow() {
    this.mshow = this.show;
    if (this.mshow) {
      this.getList();
    }
  }
  /* S 默认选中的数据 */
  @Prop() private defaultChoose!: Array<any>;
  @Watch("defaultChoose",{ immediate: true, deep: true })
  refreshDefault() {
    this.selectionList = this.defaultChoose;
    this.updateChooseTabls()
  }
  /* E 默认选中的数据 */
  @Prop() private activityType!: string;
  @Watch("activityType")
  refreshType() {
    this.condition.method = this.activityType;
  }
  @Prop() private orgId!: string;
  @Watch("orgId")
  refreshOrgId() {
    this.condition.orgId = this.orgId;
    // console.log(this.condition.orgId);
  }
  @Prop() private disabled!: boolean;
  @Prop() private isRadio!: boolean;
  // 弹窗关闭时
  private onClose() {
    this.$emit("onClose", false);
  }
  mounted() {
    this.mshow = this.show;
    // 判断是单选还是复选
    if (this.isRadio) {
      this.data.header = [
        {
          key: "radio",
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
          align: "center"
        },
        {
          title: "场所类型",
          key: "siteType",
          align: "center",
          slot: "siteType"
        },
        {
          title: "地址",
          key: "address",
          align: "center"
        }
      ];
    }
    this.condition.method = this.activityType;
    this.condition.orgId = this.orgId;
    // this.getList();
  }
  //   搜索查询
  private handleSubmit() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  // 获取列表数据的方法
  private getList(page: any = this.tableConfig.page) {
    Object.assign(this.condition, page);
    getActivityList(this.condition).then((res: any) => {
      if (res.code === 0) {
        this.data.list = res.datas;
        this.updateChooseTabls()
        this.loading = false;
        this.tableConfig.page = res.page;
      }
    });
  }
  // 修改表格默认选中项
  private updateChooseTabls(){
    if(this.data.list.length && this.defaultChoose){
      if(this.isRadio){
        this.checkedRadio()
      } else {
        let arr:any = [];
        this.data.list.forEach((item:any) => {
          if(this.defaultChoose.length){
            for(let i = 0;i < this.defaultChoose.length ; i ++){
              if(this.defaultChoose[i].id == item.id && this.defaultChoose[i].resourceType == item.resourceType){
                item._checked = true;
              }
            }
            arr.push(item);
          }
        });
        this.data.list = arr;
      }
    }
  }
  //   查询条件
  private condition: any = {
    name: "",
    method: "",
    classify: "",
    activityStatus: "",
    status: 1,
    orgId: ""
  };
  //   表格配置
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 6
    },
    pagePosition: "right"
  };
  private loading = true;
  private data: any = {
    header: [
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
        title: "活动名称",
        key: "name",
        width: 250,
        align: "center"
      },
      {
        title: "活动方式",
        key: "method",
        align: "center",
        slot: "siteType"
      }
    ],
    list: []
  };
  // 弹窗表格选中的数据项
  private selectionList: Array<any> = [];
  // 点击弹窗确认按钮事件
  private okClick() {
    if(!this.selectionList){
      this.$Message.error("未选中数据");
    }else{
      this.onClose();
      this.$emit("onOkClick", this.selectionList);
      this.$emit("onGetCondition", this.condition);
    }
  }
  //  复选表格 列表选择项数据变化
  private selectionTable(data: any) {
    this.selectionList = data;
  }
  // 场所类型切换时
  private typeChange() {
    this.$emit("onTypeChange", this.condition);
  }

  // 单选表格时
  // 单选按钮的选中状态对象集
  private radioGroup: any = [];
  //   列表选择项数据变化
  private checkRadio(data: any) {
    // 在有单选项切换时 将其他数据置为 false，只将当前点击的数据置为 true
    for (let key in this.radioGroup) {
      this.radioGroup[key] = false;
    }
    this.radioGroup[data._index] = true;
    this.selectionList = data;
    console.log(this.selectionList);
  }
  // 单选表格的默认选中值
  private checkedRadio(){
    if(this.defaultChoose){
      let id = this.defaultChoose[0].id||'';
      let resourceType = this.defaultChoose[0].resourceType||'';
      let data:any = {};
      this.data.list.forEach((item:any,index:any) => {
        if(item.id == id){
          data._index = index
        }
      });
      this.checkRadio(data);
    }
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
}
</style>
