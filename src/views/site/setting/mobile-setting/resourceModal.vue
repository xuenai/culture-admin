<template>
  <Modal v-model="modalshow" :title="title" @on-cancel="onClose" width="800" footer-hide>
    <baseTable class="table" :configure="tableConfig" @getList="getList">
      <Table border :columns="columns" :loading="loading" :data="datas" ref="table" :height="468">
        <!-- 场馆、景区、酒店、餐饮、文化社团 -->
        <template slot-scope="{ row }" slot="placeRadio">
          <Radio :value="radio.id == row.id" @on-change="checkRadio(row)"></Radio>
        </template>
        <template slot-scope="{ row }" slot="placeImages">
          <div class="siteInfoDiv">
            <div class="imgDiv">
              <img
                :src="row.images||'http://file.geeker.com.cn/uploadfile/ptisp/img/1562836442129/daq-no-data.png'"
              />
            </div>
          </div>
        </template>
        <template slot-scope="{row}" slot="address">
          <div class="address" :title="row.address">{{row.address}}</div>
        </template>
        <!-- 商品 -->
        <template slot-scope="{ row }" slot="productRadio">
          <Radio :value="radio.id == row.url" @on-change="checkRadio(row)"></Radio>
        </template>
        <template slot-scope="{ row }" slot="productImg">
          <div class="siteInfoDiv">
            <div class="imgDiv">
              <img
                :src="row.image||'http://file.geeker.com.cn/uploadfile/ptisp/img/1562836442129/daq-no-data.png'"
              />
            </div>
          </div>
        </template>
        <template slot-scope="{ row }" slot="productPrice">
          <i v-if="row.minSalePrice === row.maxSalePrice">¥{{(row.minSalePrice)}}</i>
          <i v-else>¥{{(row.minSalePrice)}} ~ ¥{{(row.maxSalePrice)}}</i>
        </template>
        <!-- 攻略 -->
        <template slot-scope="{row}" slot="strategyTag">
          <span>#{{row.tagName}}#</span>
        </template>
        <template slot-scope="{row}" slot="strategyTopic">
          <div v-for="topic in row.topicName.split(',')" :key="topic">#{{topic}}#</div>
        </template>
        <template slot-scope="{ row }" slot="strategyPublisher">
          <img :src="row.vipHead" alt="" v-if="row.vipHead" class="strategyPublisher">
          <img v-else src="@assets/image/site-default.png" alt="" class="strategyPublisher">
          <p class="strategyPublisherName" :title="row.vipNickName">{{row.vipNickName}}</p>
        </template>
        <!-- 故事 -->
        <template slot-scope="{ row }" slot="topicImg">
          <div class="siteInfoDiv">
            <div class="imgDiv">
              <img
                :src="row.image||'http://file.geeker.com.cn/uploadfile/ptisp/img/1562836442129/daq-no-data.png'"
              />
            </div>
          </div>
        </template>
        <template slot-scope="{row}" slot="TopicName">
          <span>#{{row.name}}#</span>
        </template>
        <template slot-scope="{row}" slot="topicTime">
          <span>{{row.startDate}}&nbsp;至&nbsp;{{row.endDate}}</span>
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
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import { getVoluntList } from "@service/common";
import { getProductList } from "@service/elec";
import { getStoryList, getTopicList } from "@service/topic";
import { AppModule } from "@store/modules/app";

// 场馆、景区、酒店、餐饮、社团 的表单头
const placeColumns = [
  {
    slot: "placeRadio",
    width: 60,
    align: "center"
  },
  {
    title: "主图",
    width: 100,
    slot: "placeImages",
    align: "center"
  },
  {
    title: "名称",
    key: "name",
    width: 250,
    align: "center"
  },
  {
    title: "地址",
    slot: "address",
    align: "center"
  }
];
// 商品的表单头
const productColumns = [
  {
    slot: "productRadio",
    width: 60,
    align: "center"
  },
  {
    title: "商品图",
    width: 100,
    slot: "productImg",
    align: "center"
  },
  {
    title: "商品名称",
    key: "productName",
    width: 250,
    align: "center"
  },
  {
    title: "价格",
    align: "center",
    slot: "productPrice"
  },
  {
    title: "服务商",
    key: "businessName",
    align: "center"
  },
  {
    title: "销售方式",
    key: "saleTypeValue",
    align: "center"
  }
];
// 攻略表头
const strategyColumns = [
  {
    slot: "placeRadio",
    width: 60,
    align: "center"
  },
  {
    key:'title',
    title: '名称',
    align: 'center',
  },
  {
    title: '所属标签',
    slot: 'strategyTag',
    align: 'center',
  },
  {
    title: '发布人',
    slot: 'strategyPublisher',
    align: 'center',
  }
];
const topicColumns = [
  {
    slot: "placeRadio",
    width: 60,
    align: "center"
  },
  {
    slot: 'topicImg',
    width: 100,
    align: 'center',
  },
  {
    slot:'TopicName',
    title: '名称',
    align: 'center',
  },
  {
    title: '时间',
    slot: 'topicTime',
    align: 'center',
  }
]

@Component({
  components: {
    baseTable
  }
})
export default class ResourceModal extends Vue {
  // 默认弹窗是否展示
  @Prop({ default: false }) readonly value!: boolean;
  // 弹窗展示列表的资源类型
  @Prop({ default: "CONTENT_TYPE_VENUE" }) readonly resourceType!: string;
  // 弹窗默认选中项的id
  @Prop() readonly defaultValue!: string;
  // 获取用户信息
  get userInfo() {
    return AppModule.userInfo;
  }
  title = "选择场馆";
  // 弹窗是否展示
  modalshow = false;
  //   表格配置
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0
    },
    pagePosition: "right"
  };
  // 表格loading
  loading = false;
  // 表格头
  columns: Array<any> = [];
  // 表格数据
  datas: Array<any> = [];
  // 单选框选中数据
  radio: any = {};
  // 判断初始值是否变化
  @Watch("value", { immediate: true, deep: true })
  onValueChange(val: boolean) {
    this.modalshow = val;
  }
  // 监听弹窗是否展示
  @Watch("modalshow", { immediate: true, deep: true })
  onShowChange(val: boolean) {
    if (val !== this.value) {
      this.input();
    }
    if (val) {
      this.getResourceByMenuCode();
    }
    if (!val) {
      this.radio = {};
      this.tableConfig.currPage = 1;
      (this.tableConfig.pageSize = 10), (this.tableConfig.total = 0);
    }
  }
  // 监听默认选中值变化
  @Watch("defaultValue", { immediate: true, deep: true })
  onDefaultValue(val: any) {
    this.radio.id = val;
  }
  /** v-model双向绑定弹窗是否展示 */
  @Emit()
  input() {
    return this.modalshow;
  }
  @Emit()
  onChecked() {
    return this.radio;
  }
  // 通过menuCode获取资源列表 同时设置表格头部
  getResourceByMenuCode() {
    switch (this.resourceType) {
      // 场馆
      case "CONTENT_TYPE_VENUE": {
        this.title = "选择场馆";
        this.columns = placeColumns;
        this.getPlaces();
        break;
      }
      // 景区
      case "CONTENT_TYPE_SCENERY": {
        this.title = "选择景区";
        this.columns = placeColumns;
        this.getPlaces();
        break;
      }
      // 酒店
      case "CONTENT_TYPE_HOTEL": {
        this.title = "选择酒店";
        this.columns = placeColumns;
        this.getPlaces();
        break;
      }
      // 餐饮
      case "CONTENT_TYPE_RESTAURANT": {
        this.title = "选择餐饮";
        this.columns = placeColumns;
        this.getPlaces();
        break;
      }
      // 文化社团
      case "CONTENT_TYPE_ASSOCIATION": {
        this.title = "选择文化社团";
        this.columns = placeColumns;
        this.getPlaces();
        break;
      }
      // 商品详情
      case "MALL_DETAIL": {
        this.title = "选择商品";
        this.columns = productColumns;
        this.getProducts();
        break;
      }
      // 攻略
      case "strategy": {
        this.title = "选择攻略";
        this.columns = strategyColumns;
        this.getStoryList();
        break;
      }
      // 话题
      case "CONTENT_TYPE_TOPIC": {
        this.title = "选择话题";
        this.columns = topicColumns;
        this.getTopicList()
        break;
      }
      default:
        break;
    }
  }
  /**
   * 获取 场馆、景区、酒店、餐饮、文化社团列表
   */
  getPlaces() {
    this.loading = true;
    let { currPage, pageSize } = this.tableConfig.page;
    getVoluntList({
      currPage,
      pageSize,
      resourceType: this.resourceType
    })
      .then(res => {
        if (res.code === 0) {
          this.datas = res.datas as Array<any>;
          this.tableConfig.page = res.page;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  // 获取话题列表
  getTopicList() {
    this.loading = true;
    let { currPage, pageSize } = this.tableConfig.page;
    getTopicList({
      currPage,
      pageSize,
      status: 1
    })
      .then(res => {
        if (res.code === 0) {
          this.datas = res.datas as Array<any>;
          this.tableConfig.page = res.page;
        }
      })
      .finally(() => {
        this.loading = false;
      })
  }
  // 获取攻略列表
  getStoryList () {
    this.loading = true;
    let { currPage, pageSize } = this.tableConfig.page;
    getStoryList({
      auditStatus: 6,
      storyType: 'strategy',
      currPage,
      pageSize
    })
      .then(res => {
        if (res.code === 0) {
          this.datas = res.datas as Array<any>;
          this.tableConfig.page = res.page;
        }
      })
      .finally(() => {
        this.loading = false;
      })
  }
  /** 获取商品 */
  getProducts() {
    this.loading = true;
    let { currPage, pageSize } = this.tableConfig.page;
    getProductList({
      pageNum: currPage,
      pageSize: pageSize,
      productName: "",
      saleType: "",
      productCategoryId: "",
      productType: "",
      sysCode: this.userInfo.shopCode
    })
      .then(res => {
        if (res.code == 1) {
          // this.productData = res.data;
          this.datas = res.data.list;
          this.tableConfig.page.currPage = res.data.pageNum;
          this.tableConfig.page.pageSize = res.data.pageSize;
          this.tableConfig.page.total = res.data.total;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  /**
   * 获取列表
   */
  getList(page: any = this.tableConfig.page) {
    this.tableConfig.page = page;
    this.getResourceByMenuCode();
  }
  /** 单选框选中 */
  checkRadio(row: any) {
    this.radio = row;
  }
  /**
   * 点击底部确定按钮
   */
  okClick() {
    this.onChecked();
    this.onClose();
  }
  /**
   * 点击底部取消按钮
   */
  onClose() {
    this.modalshow = false;
  }
}
</script>

<style lang='scss' scoped>
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
  .strategyPublisher{
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .strategyPublisherName{
    max-width: 100%;
    @include ellipsis();
  }
}
</style>
