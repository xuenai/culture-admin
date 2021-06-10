<!--
 * @Author: 任智勇
 * @since: 2019-06-19 11:01:59
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-06 15:09:34
 -->
<template>
  <div>
    <Modal
      v-model="mshow"
      :title="title ? title : '关联场所'"
      @on-ok="okClick"
      @on-cancel="onClose"
      width="800"
      footer-hide
    >
      <div class="condition">
        <div class="fromItem" v-if="useRegion">
          <label>行政区域</label>
          <VDistpicker @onChange="data => condition.region = data.region" :disabledByLevel="true"></VDistpicker>
        </div>
        <div class="fromItem">
          <label>{{ nameTxt }}</label>
          <Input type="text" style="width:150px;" v-model="condition.name" placeholder="名称"/>
        </div>
        <div class="fromItem" :class="{hide: hideTypeSelect}">
          <label>场所类型</label>
          <Select
            v-model="condition.type"
            style="width:150px;"
            :value="placeType"
            :disabled="disabled"
            @on-change="typeChange"
          >
            <Option value selected>全部</Option>
            <Option value="CONTENT_TYPE_VENUE">场馆</Option>
            <Option value="CONTENT_TYPE_SCENERY">景区</Option>
            <Option value="CONTENT_TYPE_HOTEL">酒店</Option>
            <Option value="CONTENT_TYPE_RESTAURANT">餐饮</Option>
            <Option value="CONTENT_TYPE_TOILET">厕所</Option>
            <Option value="CONTENT_TYPE_PARKING">停车场</Option>
            <Option value="CONTENT_TYPE_HERITAGE_ITEM">非遗项目</Option>
            <Option value="CONTENT_TYPE_HERITAGE_PEOPLE">非遗传承人</Option>
            <Option value="CONTENT_TYPE_HERITAGE_EXPERIENCE_BASE">非遗体验基地</Option>
            <Option value="CONTENT_TYPE_HERITAGE_TEACHING_BASE">非遗传习基地</Option>
            <Option value="CONTENT_TYPE_HERITAGE_PROTECT_BASE">非遗生产性基地</Option>
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
          :height="468"
        >
          <template slot-scope="{ row }" slot="images">
            <div class="siteInfoDiv">
              <div class="imgDiv">
                <img :src="row.images||'http://file.geeker.com.cn/uploadfile/ptisp/img/1562836442129/daq-no-data.png'">
              </div>
            </div>
          </template>
          <template slot-scope="{row}" slot="name">
            <div class="name" :title="row.name">{{row.name}}</div>
          </template>
          <template slot-scope="{ row }" slot="siteType">
            <i>{{(row.resourceTypeName)}}</i>
          </template>
          <template slot-scope="{ row }" slot="region">
            <i>{{(row.regionName)}}</i>
          </template>
          <template slot-scope="{row}" slot="address">
              <div class="address" :title="row.address">{{row.address}}</div>
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
          height="468"
        >
          <template slot-scope="{ row }" slot="radio">
            <Radio v-model="radioGroup[row._index]" @on-change="checkRadio(row)"></Radio>
          </template>
          <template slot-scope="{ row }" slot="images">
            <div class="siteInfoDiv">
              <div class="imgDiv">
                <img :src="row.images||'http://file.geeker.com.cn/uploadfile/ptisp/img/1562836442129/daq-no-data.png'">
              </div>
            </div>
          </template>
          <template slot-scope="{row}" slot="name">
            <div class="name" :title="row.name">{{row.name}}</div>
          </template>
          <template slot-scope="{ row }" slot="siteType">
            <i>{{(row.resourceTypeName)}}</i>
          </template>
          <template slot-scope="{ row }" slot="region">
            <i>{{(row.regionName)}}</i>
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
  * defaultChoose: 表格数据的默认选中项
  * isRadio: 默认不传时我复选表格， 传 true 时为单选表格
  * placeType: 场所类型条件 默认值为空
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
import { getResourceByType } from "@service/common.ts";
import VDistpicker from "@components/distPicker/distPicker.vue";
import { AppModule } from "@store/modules/app";

@Component({ components: { baseTable, Dialog, VDistpicker } })
export default class UninPlace extends Vue {
  @Prop() private title!: string;
  @Prop() private show!: boolean;
  private mshow: boolean = false;
  @Prop({default: false}) heritageType!: boolean;
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

  @Prop() private placeType!: string;
  @Watch("placeType")
  refreshType() {
    this.condition.type = this.placeType;
  }
  @Prop() private orgId!: string;
  @Watch("orgId")
  refreshOrgId() {
    this.condition.orgId = this.orgId;
    // console.log(this.condition.orgId);
  }
  @Prop() private disabled!: boolean;
  @Prop() private isRadio!: boolean;
  @Prop({default: false}) private hideTypeSelect!: boolean; // 是否影藏场所类型下拉
  @Prop({default: '场所名称'}) private nameTxt!: string; // 筛选名字
  @Prop({default: false}) private useRegion!: boolean; // 是否启用region参数
  @Prop({default: 'header0'}) private header!: string; // 选用哪个header
  // 弹窗关闭时
  private onClose() {
    this.$emit("onClose", false);
  }
  created() {
    if (this.useRegion) {
      this.condition.region = AppModule.region
    }
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
          align: "center",
          slot: "name"
        },
        {
          title: "场所类型",
          key: "siteType",
          align: "center",
          slot: "siteType"
        },
        {
          title: "地址",
          slot: "address",
          key: "address",
          align: "center"
        }
      ];
    }
    this.condition.type = this.placeType;
    if (this.orgId) this.condition.orgId = this.orgId;
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
          }
          arr.push(item);
        });
        this.data.list = arr;
      }
    }
  }
  //   搜索查询
  private handleSubmit() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  // 获取列表数据的方法
  private getList(page: any = this.tableConfig.page) {
    this.loading = true;
    Object.assign(this.condition, page);
    if (this.heritageType) {
      this.condition.heritageType = 'CONTENT_TYPE_HERITAGE_ITEM'
    }
    getResourceByType(this.condition).then((res: any) => {
      if (res.code === 0) {
        this.data.list = res.datas;
        this.updateChooseTabls()
        this.loading = false;
        this.tableConfig.page = res.page;
      }
    });
  }
  //   查询条件
  private condition: any = {
    name: "",
    type: "",
    status:1,
    orgId: this.$store.state.app.userInfo.orgId
  };
  //   表格配置
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0
    },
    pagePosition: "right"
  };
  private loading = true;

  private header0 = [
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
        align: "center",
        slot: "name"
      },
      {
        title: "场所类型",
        key: "siteType",
        align: "center",
        slot: "siteType"
      },
      {
        title: "地址",
        slot: "address",
        key: "address",
        align: "center"
      }
    ]
  private header1 = [
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
        align: "center",
        slot: "name"
      },
      {
        title: "地区",
        align: "center",
        slot: "region"
      },
      {
        title: "地址",
        slot: "address",
        key: "address",
        align: "center"
      }
    ]
  private data: any = {
    header: this[this.header],
    list: []
  };
  // 弹窗表格选中的数据项
  private selectionList: Array<any> = [];
  // 点击弹窗确认按钮事件
  private okClick() {
    if(!this.selectionList || !this.selectionList.length){
      this.$Message.error("未选中数据");
    }else if(this.dirty){
      this.onClose();
      this.$emit("onOkClick", this.selectionList);
      this.$emit("onGetCondition", this.condition);
    }else{
      this.onClose();
    }
  }
  //是否操作过 默认没有操作过
  private dirty = false;
  //  复选表格 列表选择项数据变化
  private selectionTable(data: any) {
    this.dirty = true;
    this.selectionList = data;
    // console.log(this.selectionList);
  }
  // 场所类型切换时
  private typeChange() {
    this.$emit("onTypeChange", this.condition);
  }
  // 匹配站点类型
  private getSiteTypeName(code: string) {
    if (code === "scenic") {
      return "景区";
    } else {
      return "政府";
    }
  }

  // 单选表格时
  // 单选按钮的选中状态对象集
  private radioGroup: any = [];
  //   列表选择项数据变化
  private checkRadio(data: any) {
    this.dirty = true;
    // 在有单选项切换时 将其他数据置为 false，只将当前点击的数据置为 true
    for (let key in this.radioGroup) {
      this.radioGroup[key] = false;
    }
    this.radioGroup[data._index] = true;
    this.selectionList = [data];
  }
  // 单选表格的默认选中值
  private checkedRadio(){
    if(this.defaultChoose){
      let id = this.defaultChoose[0].id||'';
      let resourceType = this.defaultChoose[0].resourceType||'';
      let data:any = {};
      this.data.list.forEach((item:any,index:any) => {
        if(item.id == id && item.resourceType == resourceType){
          data = item;
          data._index = index
        }
      });
      this.checkRadio(data);
    }
  }
}
</script>

<style lang='scss' scoped>
.hide {
  display: none!important;
}
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
  .address{
    max-width:100%;
    @include ellipsis();
  }
  .name{
    max-width:100%;
    @include ellipsis();
  }
}
</style>
