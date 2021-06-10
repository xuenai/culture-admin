<template>
  <div>
    <!-- 已上传列表 -->
    <ul class="images-list">
      <li
        class="item"
        v-for="(item, index) in imagesList"
        :key="item.url + index"
        draggable="true"
        v-dragging="{ list: imagesList, item: item, group: 'image' }"
        @click="activeItem = item"
      >
        <Icon type="ios-close-circle" class="icon" @click.stop="deleteFile(index, item)"></Icon>
        <div class="img-box" @click.stop="() => {viewPicShow = true; currImgUrl = item.url}">
          <img :src="item.url" :alt="item.name">
        </div>
        <Select class="mt10" v-model="item.jumpType" @on-change="openPopFun(item, true)">
          <Option value="请选择">请选择</Option>
          <!--<Option value="PLACE">跳转至各场所详情</Option> 这个PLACE是自定的，后台目前没得-->
          <Option value="ACTIVITY_JUMP_TYPE_INFO">跳转至商品详情</Option>
          <!--<Option value="ACTIVITY">跳转至活动详情</Option> 这个ACTIVITY是自定的，后台目前没得-->
          <Option value="ACTIVITY_JUMP_TYPE_EXTERNAL">跳转至外部链接</Option>
        </Select>
        <div class="check" v-if="item.jumpUrl && item.jumpType === 'ACTIVITY_JUMP_TYPE_INFO'">
          <span class="line1" :title="item.jumpName">{{item.jumpName || '--'}}</span>
          <span class="ml20" @click="openPopFun(item)">更改</span>
        </div>
        <!-- 外链 -->
        <Input :maxlength="500"
           v-show="item.jumpType === 'ACTIVITY_JUMP_TYPE_EXTERNAL'"
           v-model="item.jumpUrl"
           placeholder="请输入外链"
           style="margin-top: 10px;"/>
      </li>
      <li class="item upload" @click="showMedia = true" v-if="imagesList.length < limit">
          <div class="img-wrap">+ 添加图片</div>
      </li>
    </ul>
    <p class="remind" v-if="limit > 1">注：拖动图片可进行排序，最多上传{{limit}}张</p>

    <!-- 关联产品 -->
    <uninProduct :show="showProduct" @onOkClick="ProductChange" @onClose="showProduct=false" :isRadio="true"></uninProduct>
    <!-- 图片查看 -->
    <PreviewPic v-model="viewPicShow" :imgUrl="currImgUrl"></PreviewPic>
      <!-- 资源选择弹出 -->
    <MediaPop :show="showMedia" :close="() => showMedia = false" @onSure="selectSourceDatas" :sourceType="0"></MediaPop>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
//import uninPlace from "@components/uninPlace/uninPlace.vue";
import uninProduct from "@components/uninProduct/uninProduct.vue";
//import uninActivity from "@components/uninActivity/uninActivity.vue";
import {PreviewPic} from '@components/index'
import MediaPop from "@components/pop/media-pop.vue";

interface placeType {
  address: string,
  id: number,
  images: string,
  name: string,
  resourceType: string,
  resourceTypeName: string,
  status: string
}
interface imgType {
  id: string,
  url: string,
  [propName:string]: any
}

@Component({ 
  components: {
    uninProduct,
    PreviewPic,
    MediaPop
  } 
})
export default class UploadImageAdv extends Vue {
  // 图片查看器的显示控制
  private viewPicShow: boolean = false;
  private showMedia: boolean = false;
  private currImgUrl: string = '';
  private activeItem: imgType | null = null; // 当前操作元素
  // 图片列表
  private imagesList: Array<imgType> = [];

  @Prop({default: 1}) private limit!: number;
  // 默认图
  @Prop() private value!: Array<imgType>;

  @Watch("value")
  changeImage(val: any, oldVal: any) {
    if (val) {
      val.forEach((item:any) => {
        if (!item.jumpUrl) item.jumpUrl = '';
        if (!item.jumpName) item.jumpName = '';
        if (!item.jumpType) item.jumpType = '';
        if (!item.product) item.product = '';
      })
    }
    this.imagesList = val || [];
  }

  // 图片拖动
  mounted () {
    if (this.value && this.value.length) {
        this.imagesList =  this.value;
    }
    // 拖动结束
    this.$dragging.$on("dragend", () => {
      this.$emit("input", this.imagesList);
    });
  }

  private selectSourceDatas (list: Array<any>) {
      // 过滤已选项
      list = list.filter((data:any) => {
          return data.isLocalAdd || !this.imagesList.some((data2:imgType) => (data2.id === data.id || data2.url === data.url))
      })
      list.forEach((data:any) => {
          data.jumpType = '请选择';
          data.jumpUrl = '';
          data.jumpName = '';
          data.product = '';
          if (!data.id) data.virtualId = data.url + '_' + new Date().getTime()
      })
      // 条数限制
      if ((list.length + this.imagesList.length) > this.limit) {
          this.$Message.error("已超出最大条数限制！");
          return
      }
      this.imagesList = this.imagesList.concat(list.map((item:any) => Object.assign({}, item)));
      this.$emit("input", this.imagesList);
  }

  // 删除图片
  private deleteFile(index: number, item:any) {
    if (this.activeItem === item) this.activeItem = null;
    this.imagesList.splice(index, 1);
    this.$emit("input", this.imagesList);
  }

  //商品详情
  private showProduct: boolean = false;

  private openPopFun(item:any, reset?: boolean){
    if (reset === true) {
        item.jumpUrl = '';
        item.jumpName = '';
        item.product = '';
    }
    let keyTokey = <any>{
        ACTIVITY_JUMP_TYPE_INFO: 'showProduct',
        PLACE: 'showPlace',
        ACTIVITY: 'showActivity',
    }
    if (keyTokey[item.jumpType]) this[keyTokey[item.jumpType]] = true
  }
  // 商品选择
  private ProductChange(list: Array<any>){
    if (Object.prototype.toString.call(list) === '[object Object]') list = [list];
    if (list[0]) {
        if (this.activeItem) {
            this.activeItem.product = list[0]
            this.activeItem.jumpUrl = list[0].url;
            this.activeItem.jumpName = list[0].productName;
            this.$emit("input", this.imagesList);
        }
    }
  }
}
</script>

<style lang='scss' scoped>
.images-list {
  font-size: 0;
  .item {
    width: 238px;
    cursor: pointer;
    position: relative;
    display: inline-block;
    margin: 0 10px 10px 0;
    vertical-align: top;
    font-size: 12px;
    .check{
      line-height: 15px;
      margin-top: 10px;
      text-align:left;
        span:first-child {
            display: inline-block;
            width: calc(100% - 45px);
            vertical-align: middle;
            cursor: default;
        }
        span:last-child {
            color: #23a1ee;
            vertical-align: middle;
        }
    }
    .img-box {
      width: 240px;
      height: 160px;
      border-radius: 4px;
      overflow: hidden;
        border: 1px solid #eee;
        img {
            width: 100%;
        }
    }
    .icon {
      position: absolute;
      right: -12px;
      top: -12px;
      z-index: 1;
      color: #90a0b9;
      font-size: 24px;
      &:hover {
        color: $theme;
      }
    }
    &.upload {
      border: 1px dashed #dee3ed;
      cursor: pointer;
      width: 240px;
      height: 160px;
      line-height: 160px;
      border-radius: 4px;
      text-align: center;
      color: $theme;
      &:hover {
        border-color: $theme;
      }
    }
  }
  .cover {
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  &.small {
    .item {
      width: 90px;
      height: 60px;
      line-height: 60px;
    }
  }
}
.remind {
  font-size: 12px;
  line-height: 14px;
  color: #999;
  margin-top: 12px;
}
</style>
