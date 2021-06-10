<!--
 * @Author: 任智勇
 * @since: 2019-06-19 11:01:59
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-06 15:09:34
 -->
<template>
  <Modal
      v-model="show"
      title="关联品牌"
      @on-ok="okClick"
      @on-cancel="onClose"
      width="930"
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
            placeholder="名称"
            :disabled="!!propParams.keyword"
          />
        </div>
        <div class="fromItem">
          <label>创建者</label>
          <Select style="width:150px;" v-model="condition.siteName" @on-change="() => getList()">
            <Option v-for="item in createrList" :value="item.name" :key="item.id">
              {{ item.name }}
            </Option>
          </Select>
          <!-- <Input
            type="text"
            style="width:150px;"
            @on-enter="() => getList()"
            v-model="condition.siteName"
            placeholder="创建者"
            :disabled="!!propParams.siteName"
          /> -->
        </div>
        <div class="fromItem">
          <!-- v-if="siteInfo.siteVersion === 'AREA'" -->
          <label>行政区域</label>
          <VDistpicker @onChange="data => { condition.region = data.region; getList() }" :disabledByLevel="true"></VDistpicker>
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
                  v-if="row.brandImage"
                  :src="row.brandImage.split(',')[0] || 'http://file.geeker.com.cn/uploadfile/ptisp/img/1562836442129/daq-no-data.png'"
                />
              </div>
            </div>
          </template>
          <template slot-scope="{row}" slot="name">
            <p class="name line1" :title="row.name">{{row.name}}</p>
            <p class="name line1" :title="row.slogan">{{row.slogan}}</p>
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
import { brandList } from "@service/activity";
import VDistpicker from "@components/distPicker/distPicker.vue";
import { getSiteChild } from "@service/common";

@Component({ components: { baseTable, VDistpicker } })
export default class Volunt extends Vue {
  @Prop({ default: false }) private show!: boolean; // 显示/影藏
  @Watch("show")
  refreshShow(show: boolean) {
    if (show) {
      if (!this.propParams.keyword) this.condition.name = "";
      if (!this.propParams.siteName) this.condition.siteName = "";
      this.getList();
    }
  }

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
          width: 100,
          slot: "images",
          align: "center"
        },
        {
          title: "名称",
          width: 250,
          slot: "name",
          align: "center"
        },
        {
          title: "创建者",
          key: "siteName",
          align: "center"
        },
        {
          title: "目的地",
          key: "siteCount",
          align: "center"
        },
        {
          title: "景区",
          key: "scenicCount",
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
          width: 100,
          slot: "images",
          align: "center"
        },
        {
          title: "名称",
          width: 250,
          slot: "name",
          align: "center"
        },
        {
          title: "创建者",
          key: "siteName",
          align: "center"
        },
        {
          title: "目的地",
          key: "siteCount",
          align: "center"
        },
        {
          title: "景区",
          key: "scenicCount",
          align: "center"
        }
      ]
    }
  ];
  private checkType: object = this.checkTypes[this.checkWay];

  @Prop({default: {}}) private propParams!: {siteName: string, keyword: string}; // 传递的请求参数

  // 默认选中id
  @Prop({ default: () => [] }) selectIds!: Array<number | string>;

  created() {
    if(this.propParams) Object.assign(this.condition, this.propParams);
    this.getList();
    this.getSiteChild();
  }
  // 创建者列表
  private createrList: object[] = [];

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
    siteName: "",
    region: "",
    dataStatus: 1
  };
  // 获取创建者
  private getSiteChild() {
    getSiteChild().then((res: any) => {
      if (res.code === 0) {
        this.createrList = res.datas;
      }
    });
  }
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
    brandList(this.condition)
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
