<!--
 * @Author: 任智勇
 * @since: 2019-06-19 11:01:59
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-20 15:06:36
 -->
<template>
  <div>
    <Modal
      v-model="mshow"
      :title="title ? title : '选择商品 ---' + '  当前店铺:' + (userInfo.shopName||'未绑定')"
      @on-cancel="onClose"
      width="800"
      footer-hide
    >
      <div class="condition">
        <div class="fromItem">
          <label>商品名称</label>
          <Input type="text" style="width:120px;" v-model="condition.productName" placeholder="名称"/>
        </div>
        <div class="fromItem">
          <label>销售方式</label>
          <Select
            v-model="condition.saleType"
            style="width:100px;"
            :value="condition.saleType"
            :disabled="disabled"
            @on-change="typeChange"
          >
            <Option value="-1" selected>全部</Option>
            <Option value="1">普通</Option>
            <Option value="2">秒杀</Option>
          </Select>
        </div>
        <div class="fromItem">
          <label>商品类目</label>
          <Select
            v-model="condition.productCategoryId"
            style="width:100px;"
            :value="condition.productCategoryId"
            :disabled="disabled"
            @on-change="typeChange"
          >
            <Option value selected>全部</Option>
            <Option
              :value="item.id"
              v-for="item in productCategoryIdList"
              :key="item.id"
            >{{item.categoryName}}</Option>
          </Select>
        </div>
        <div class="fromItem">
          <label>商品类型</label>
          <Select
            v-model="condition.productType"
            style="width:100px;"
            :value="condition.productType"
            :disabled="disabled"
            @on-change="typeChange"
          >
            <Option value="-1" selected>全部</Option>
            <Option value="1">实物</Option>
            <Option value="2">虚拟</Option>
            <Option value="3">门票</Option>
            <Option value="6">线路</Option>
          </Select>
        </div>
        <div class="fromItem">
          <Button type="primary" class="submit" @click="handleSubmit">搜索</Button>
        </div>
      </div>
      <div v-if="!isRadio">
        <Table
          border
          @on-selection-change="selectionTable"
          :columns="data.header"
          :loading="loading"
          :data="data.list"
          ref="table"
          height="468"
          class="tabelDiv"
        >
          <template slot-scope="{ row }" slot="images">
            <div class="siteInfoDiv">
              <div class="imgDiv">
                <img :src="row.image||'http://file.geeker.com.cn/uploadfile/ptisp/img/1562836442129/daq-no-data.png'">
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="sale">
            <i v-if="row.minSalePrice === row.maxSalePrice">¥{{(row.minSalePrice)}}</i>
            <i v-else>¥{{(row.minSalePrice)}} ~ ¥{{(row.maxSalePrice)}}</i>
          </template>
        </Table>
        <div class="pageDiv">
          <Page
            class="pages"
            @on-change="changePages"
            @on-page-size-change="changeSize"
            :total="productData.total"
            :current="productData.pageNum"
            :page-size-opts="[10,20,50,100]"
            show-elevator
            show-sizer
            show-total
          />
        </div>
      </div>

      <div v-else>
        <Table
          border
          @on-selection-change="selectionTable"
          :columns="data.header"
          :loading="loading"
          :data="data.list"
          ref="table"
          class="tabelDiv"
          height="468"
        >
          <template slot-scope="{ row }" slot="radio">
            <Radio v-model="radioGroup[row._index]" @on-change="checkRadio(row)"></Radio>
          </template>
          <template slot-scope="{ row }" slot="images">
            <div class="siteInfoDiv">
              <div class="imgDiv">
                <img :src="row.image||'http://file.geeker.com.cn/uploadfile/ptisp/img/1562836442129/daq-no-data.png'">
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="sale">
            <i>¥{{(row.minSalePrice)}} ~ ¥{{(row.maxSalePrice)}}</i>
          </template>
        </Table>
        <div>
          <Page
            class="pages"
            @on-change="changePages"
            @on-page-size-change="changeSize"
            :total="productData.total"
            :current="productData.pageNum"
            :page-size-opts="[10,20,50,100]"
            show-elevator
            show-sizer
            show-total
          />
        </div>
      </div>
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
  * title: 弹窗标题,不传时默认为: 关联商品
  * show: 是否显示弹窗
  * isRadio: 默认不传时我复选表格， 传 true 时为单选表格
  * disabled:  商品类型下拉框是否可以用 默认值 false，传 true 表示不可用
  * 
  * 事件
  * @onOkClick: 弹窗点击确定时调用的方法，改方法参数为 列表选中的数据 不论单选还是复选表格数据都是 数组[]
  * @onClose: 必须监听弹窗关闭时的事件，然后将 show 参数置为false,否则会有问题
  * @onTypeChange: 条件选择器 商品类型切换时触发，参数为：当前查询条件
  * 
  * 若不需要时刻监听下拉框数据变化，只需要在点击确定时才获取条件参数，则使用下面的事件
  * @onGetCondition: 条件选择器 商品类型切换时触发，参数为：当前查询条件
  * 
 */
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import Dialog from "@components/Dialog/Dialog.vue";
import { getProductList, findProductCategory } from "@service/elec.ts";
import { AppModule } from "@store/modules/app";

@Component({ components: { baseTable, Dialog } })
export default class uniProduct extends Vue {
  @Prop() private title!: string;
  @Prop() private show!: boolean;
  private mshow: boolean = false;
  @Watch("show")
  refreshShow() {
    this.mshow = this.show;
    if (this.mshow) {
      this.getList();
    }
  }

  @Prop() private disabled!: boolean;
  @Prop() private isRadio!: boolean;
  // 弹窗关闭时
  private onClose() {
    this.$emit("onClose", false);
  }
  // 获取用户信息
  get userInfo() {
    return AppModule.userInfo;
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
          title: "商品图",
          key: "images",
          width: 100,
          slot: "images",
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
          slot: "sale"
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
    }
    this.getList();
    findProductCategory().then((res: any) => {
      if (res.code == 1) {
        this.productCategoryIdList = res.data;
      }
    });
  }
  // 类目下拉数据
  private productCategoryIdList = [];
  //   搜索查询
  private handleSubmit() {
    this.getList();
  }
  // 获取列表数据的方法
  private productData: any = {};
  private getList() {
    if(!this.condition.sysCode){
      this.loading = false;
      return;
    }
    getProductList(this.condition).then((res: any) => {
      // console.log(res);
      this.loading = false;
      if (res.code == 1) {
        this.productData = res.data;
        this.data.list = res.data.list;
        this.condition.pageNum = res.data.pageNum;
        this.condition.pageSize = res.data.pageSize;
      }
    });
  }
  // 切换页码
  private changePages(page: number) {
    this.condition.pageNum = page;
    this.getList()
  }
  // 切换页量
  private changeSize(size: number) {
    this.condition.pageSize = size;
    this.getList()
  }
  // 查询条件
  private condition: any = {
    pageNum: 1,
    pageSize: 10,
    productName: "",
    saleType: "",
    productCategoryId: "",
    productType: "",
    sysCode: this.userInfo.shopCode
  };
  private loading = true;
  private data: any = {
    header: [
      {
        type: "selection",
        width: 60
      },
      {
          title: "商品图",
          key: "images",
          width: 100,
          slot: "images",
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
          slot: "sale"
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
    ],
    list: []
  };
  // 弹窗表格选中的数据项
  private selectionList: Array<any> = [];
  // 点击弹窗确认按钮事件
  private okClick() {
    if(this.selectionList.length === 0){
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
    // console.log(this.selectionList);
  }
  // 商品类型切换时
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
.pageDiv {
  display: flex;
  justify-content: flex-end;
}
.pages {
  // display: inline-block;
  text-align: center;
}
</style>
