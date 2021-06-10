<template>
  <div>
    <Form ref="formInline" :label-width="0">
      <FormItem>
        <RadioGroup v-model="orderAddressManage.orderAddressType" v-if="shopName">
          <!-- 绑定小电商 -->
          <Radio label="ds">
            <span>使用小电商{{title}}</span>
            <Input type="text" class="ml10" readonly v-model="shopName" />
          </Radio>
          <br />
          <Radio label="pt" class="mt20">
            <span>使用第三方平台{{title}}</span>
          </Radio>
          <span
            v-if="orderAddressManage.orderAddressType==='pt'"
            class="cloud-icon add-list ml10 mt20"
            :class="addOrder ? 'active' : ''"
            @click="addOrder = true"
          >&#xe604;</span>
        </RadioGroup>
        <div v-else>
          <!-- 未绑定小电商 -->
          <Radio label="ds" disabled>
            <span>使用小电商{{title}}</span>
            <span class="no-order">暂未绑定小电商预订地址</span>
          </Radio>
          <br />
          <Checkbox true-value="pt" false-value=""  v-model="orderAddressManage.orderAddressType">使用第三方平台{{title}}</Checkbox>
          <span
            v-if="orderAddressManage.orderAddressType==='pt'"
            class="cloud-icon add-list ml10 mt20"
            :class="addOrder ? 'active' : ''"
            @click="addOrder = true"
          >&#xe604;</span>
        </div>
      </FormItem>
    </Form>
    <table
      aria-colspan="0"
      aria-rowspan="0"
      class="table"
      v-if="orderAddressManage.orderAddressType==='pt'"
    >
      <tr v-for="(item, index) in orderList" :key="index" v-if="item.orderType==='pt'">
        <td>
          平台名称：
          <span v-if="!item.change">{{item.platformName}}</span>
          <Input
            v-if="item.change"
            placeholder="请输入第三方平台名称"
            class="write"
            :class="'item' + item.id"
            :value="item.platformName"
            :maxlength="50"
          />
        </td>
        <td>
          <span class="label">标识图片：</span>
          <div class="img-panel">
            <p class="img daq-no-photo" v-if="!item.change">
              <img :src="item.logo" :alt="item.platformName" v-if="item.logo" class="daq-img" />
            </p>
            <uploadImg
              v-if="item.change"
              :limit="1"
              @getImagesList="getChangeImage($event, 'orderList', index)"
              :defaultImage="item.logo"
              type="small"
              class="small"
            ></uploadImg>
          </div>
        </td>
        <td>
          URL地址：
          <a :href="item.url" v-if="!item.change">{{item.url}}</a>
          <Input
            v-if="item.change"
            placeholder="请输入第三方平台销售地址"
            class="write"
            :class="'item0' + item.id"
            :value="item.url"
            :maxlength="1000"
          />
        </td>
        <td>
          <span class="theme-blue action-btn" @click.stop="changeOrder(item)" v-if="!item.change">编辑</span>
          <span
            class="theme-blue action-btn ml10"
            @click.stop="delMyAdd(index,item)"
            v-if="!item.change"
          >删除</span>
          <Button type="primary" v-if="item.change" @click.stop="saveChangeOrder(item,item.id)">保存</Button>
        </td>
      </tr>
      <!-- 添加 -->
      <tr v-show="addOrder">
        <td>
          平台名称：
          <Input placeholder="请输入第三方平台名称" class="write" ref v-model="platformName" :maxlength="50" />
        </td>
        <td>
          <span class="label">标识图片：</span>
          <div class="img-panel">
            <uploadImg
              :limit="1"
              @getImagesList="getDsImage"
              :defaultImage="logo"
              type="small"
              class="small"
            ></uploadImg>
          </div>
        </td>
        <td>
          URL地址：
          <Input placeholder="请输入第三方平台销售地址" class="write" v-model="url" :maxlength="1000" />
        </td>
        <td>
          <Button type="primary" @click="saveOrder">保存</Button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import uploadImg from "@components/upload/upload-image.vue";
import {
  orderAddress,
  getShopList,
  saveOrderAddress,
  deleteOrderAddress
} from "@service/place";

@Component({
  components: {
    uploadImg
  }
})
export default class edit extends Vue {
  @Prop() data: any;
  /*S 预订地址*/
  // 添加预订地址
  private addOrder: Boolean = false;
  private resourceType: string = "";
  private orderAddressManage: object = {
    orderAddressType: "pt",
    list: []
  };

  @Watch("orderAddressManage", { immediate: true, deep: true })
  getOrderAddressManage(data:any) {
    // (this.orderAddressManage as any).list.map((item: any) => {
    //   if (item.url) {
    //     return item;
    //   }
    // });
    this.$emit("getData", this.orderAddressManage);
  }
  //不同资源类型 下的销售标题
  private title: string = "";
  @Watch("data", { immediate: true, deep: true })
  getDatas(data: any) {
    let _this = this;
    (this.orderAddressManage as any).orderAddressType = data.orderAddressType;
    switch (data.resourceType) {
      case "CONTENT_TYPE_HOTEL":
        _this.title = "预订客房";
        break;
      case "CONTENT_TYPE_SCENERY":
        _this.title = "销售门票";
        break;
      case "CONTENT_TYPE_RESTAURANT":
        _this.title = "预订美食";
        break;
    }
  }

  // 新增的预订地址
  private platformName: String = "";
  private logo: String = "";
  private url: String = "";

  // 预订地址
  private orderList: Array<Object> = [];

  //获取预订地址列表
  private getOrderList() {
    orderAddress({
      id: this.$route.query.id,
      resourceType: this.resourceType
    }).then((data: any) => {
      (data.datas as []).map((item: any) => {
        item.change = false;
      });

      this.orderList = data.datas as [];
      delete (this.orderList as any).createTime;
      delete (this.orderList as any).updateTime;
      (this.orderAddressManage as any).list =
        data.datas && data.datas.length ? this.orderList : [];
      this.$emit("getData", this.orderAddressManage);
    });
  }

  // 小电商销售门票
  private shopName: string = "";

  private getShopList() {
    getShopList().then((res: any) => {
      this.shopName = res.data.shopName;
      //没有绑定小电商店铺 单选框就不赋值小电商选项
      if ((this.orderAddressManage as any).orderAddressType === "ds") {
        (this.orderAddressManage as any).orderAddressType = res.data.shopName
          ? this.data.orderAddressType
          : "";
      }
      if (this.orderList.length < 1) {
        this.orderList.push({
          platformName: res.data.shopName,
          logo: "",
          url: res.data.shopUrl,
          shopId: res.data.shopCode,
          status: 2, //1：启用  2：禁用
          orderType: "ds"
        });
      }
       (this.orderAddressManage as any).list = this.orderList;
        this.$emit("getData", this.orderAddressManage);
    });
  }

  // 平台图片
  private getDsImage(e: any) {
    this.logo = e.join(",");
  }

  // 保存预订地址
  private saveOrder() {
    let _this = this;
    if (!this.platformName) {
      _this.$Message.error("请输入平台名称");
      return;
    }
    if (!this.logo) {
      _this.$Message.error("请上传第三方平台图片");
      return;
    }
    if (!this.url) {
      _this.$Message.error("请输入第三方平台地址");
      return;
    }
    this.orderList.push({
      platformName: this.platformName,
      logo: this.logo,
      url: this.url,
      shopId: "",
      status: 2, //1：启用  2：禁用
      orderType: "pt"
    });
    this.platformName = "";
    this.logo = "";
    this.url = "";
    (this.orderAddressManage as any).list = this.orderList.map((item: any) => {
      if (item.url) {
        return item;
      }
    });
    this.$emit("getData", this.orderAddressManage);
    
  }

  // 保存编辑图片
  private getChangeImage(e: any, type: any, index: any) {
    this[type][index].logo = e.join(",");
  }

  // 删除自己添加的数据
  private delMyAdd(index: any, item: any) {
    let _this = this;

    let config: any = {
      title: "操作提示",
      content: `确认要删除？`,
      okText: "确认删除",
      cancelText: "取消",
      onOk: () => {
        if (item.id) {
          deleteOrderAddress({
            id: item.id,
            type: this.resourceType
          }).then((res: any) => {
            if (res.code === 0) {
              _this.$Message.success("删除成功");
              _this.orderList.splice(index, 1);
            }
          });
        } else {
          _this.orderList.splice(index, 1);
        }
        (_this.orderAddressManage as any).list = this.orderList;
        _this.$emit("getData", this.orderAddressManage);
      }
    };
    _this.$Modal.confirm(config);
  }

  // 编辑预订地址
  private changeOrder(item: any) {
    this.$set(item, "change", true);
  }

  // 保存编辑预订项
  private saveChangeOrder(item: any, index: any) {
    let _name = "item" + index;
    let _url = "item0" + index;
    let _nameNode = document.getElementsByClassName(_name)[0].childNodes;
    let _urlNode = document.getElementsByClassName(_url)[0].childNodes;
    let name;
    let url;
    for (let i = 0; i < _nameNode.length; i++) {
      if (
        _nameNode[i].nodeName === "INPUT" ||
        _nameNode[i].nodeName === "input"
      ) {
        // @ts-ignore
        name = _nameNode[i].value;
      }
    }
    for (let i = 0; i < _urlNode.length; i++) {
      if (
        _urlNode[i].nodeName === "INPUT" ||
        _urlNode[i].nodeName === "input"
      ) {
        // @ts-ignore
        url = _urlNode[i].value;
      }
    }
    if (!name) {
      this.$Message.error("请输入平台名称");
      return;
    }
    if (!item.logo) {
      this.$Message.error("请上传第三方平台图片");
      return;
    }
    if (!url) {
      this.$Message.error("请输入第三方平台地址");
      return;
    }
    item.platformName = name;
    item.url = url;
    item.change = false;
    delete item.createTime;
    delete item.updateTime;
    if (item.id) {
      saveOrderAddress(item).then((res: any) => {
        if (res.code === 0) {
          this.$Message.success("保存成功");
          (this.orderAddressManage as any).list = this.orderList;
          this.$emit("getData", this.orderAddressManage);
        }
      });
    }
  }

  /*E 预订地址*/
  mounted() {
    (this
      .orderAddressManage as any).orderAddressType = this.data.orderAddressType;
    this.resourceType = this.data.resourceType;
    this.getOrderList();
    this.getShopList();
  }
}
</script>
<style lang="scss">
//地区插件样式
.distpicker-address-wrapper select {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  padding: 0 5px;
}

.table {
  .img-box {
    width: 98px !important;
    height: 98px !important;
  }
  .images-list {
    .item {
      margin-top: 20px;
    }
    .item.upload {
      margin-top: 0;
    }
  }
}
</style>
<style lang="scss" scoped>
.tab-container {
  padding: 10px 15px;
  .control {
    width: 300px !important;
  }
  .note {
    color: $lightGray;
    font-size: 13px;
  }
  .w150 {
    width: 150px;
  }
  .submit {
    margin-top: 30px;
  }
  .map {
    height: 400px;
  }
  .tips-panel {
    margin-top: 30px;
    background-color: $grayLight;
    padding: 20px;
    .title {
      position: relative;
      padding-left: 10px;
      color: $font01;
      font-weight: 600;
      font-size: 16px;
      &:after {
        position: absolute;
        left: 0;
        top: 4px;
        content: "";
        width: 3px;
        height: 16px;
        border-radius: 1.5px;
        background-color: $theme;
      }
    }
    .tag-content {
      margin-left: 30px;
      color: $font02;
    }
  }
  .setDifferent {
    border: 1px solid $borderLight;
    padding: 10px 0 20px 0;
    .tab-wrap {
      border-bottom: 1px solid $borderLight;
    }
    .tab-name {
      padding: 0 20px;
      cursor: pointer;
      &.active {
        position: relative;
        &:before {
          position: absolute;
          content: "";
          left: 0;
          bottom: -1px;
          height: 2px;
          width: 90%;
          background-color: $theme;
        }
      }
    }
    .set-content {
      padding-left: 20px;
    }
  }
  .table {
    width: 100%;
    border: 1px solid $borderLight;
    border-top: none;
    td {
      border-top: 1px solid $borderLight;
    }
    .write {
      max-width: 60%;
    }
    .img {
      display: inline-block;
      width: 90px;
      height: 60px;
      margin: 5px 0;
      overflow: hidden;
      vertical-align: middle;
    }
  }
  .add-list {
    display: inline-block;
    border: 1px dashed $borderLight;
    font-size: 13px;
    cursor: pointer;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    vertical-align: middle;
    &:hover,
    &.active {
      color: $theme;
      border-color: $theme;
    }
  }
  .no-order {
    color: #ccc;
  }
  .label {
    float: left;
    line-height: 105px;
  }
  .img-panel {
    margin-left: 60px;
    height: 105px;
    line-height: 105px;
  }
  .action-btn {
    cursor: pointer;
  }
}
</style>
