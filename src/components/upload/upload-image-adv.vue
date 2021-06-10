<template>
  <div>
    <!-- 已上传列表 -->
    <ul class="images-list" ref="parentNode" :class="types ? types : ''">
      <li
        class="item"
        v-for="(item, index) in imagesList"
        :key="item.url"
        :data-url="item.url"
        draggable="true"
        v-dragging="{ list: imagesList, item: item, group: 'image' }"
      >
        <Icon type="ios-close-circle" class="icon" @click.stop="deleteFile(index)"></Icon>
        <p class="img-box" @click.stop="viewImage(item.url)">
          <img :src="item.url" :alt="item.name" class="daq-img" />
        </p>
        <Select
          class="mt20"
          v-model="item.type"
          style="width: 238px;"
          @on-change="openPopFun(index,item,'1')"
        >
          <Option value="''">请选择</Option>
          <Option value="PLACE">跳转至各场所详情</Option>
          <Option value="GOODS">跳转至商品详情</Option>
          <Option value="ACTIVITY">跳转至活动详情</Option>
          <Option value="OUTSIDE">跳转至外部链接</Option>
        </Select>
        <div class="check" v-if="item.resourceName">
          已选择：
          <span class="theme-blue">{{item.resourceName}}</span>
          <span class="theme-blue ml20" @click="openPopFun(index,item)">更改</span>
        </div>
        <!-- 外链 -->
        <Input
          :maxlength="500"
          v-show="item.type === 'OUTSIDE'"
          v-model="item.jumpUrl"
          style="width: 238px; margin-top: 10px;"
        />
      </li>
      <li class="item upload" v-if="imagesList.length < maxLength">
        <input type="file" accept="image/*" multiple ref="fileInput" @change="acceptImage($event)" />+ 添加图片
      </li>
    </ul>
    <p class="remind" v-if="maxLength && maxLength > 1">注：拖动图片可进行排序，最多上传{{maxLength}}张</p>
    <!-- 关联场所 -->
    <uninPlace
      :show="showPlace"
      @onOkClick="placeChange"
      @onClose="showPlace=false"
      :isRadio="true"
    ></uninPlace>
    <!-- 关联活动 -->
    <uninActivity
      :show="showActivity"
      @onOkClick="ActivityChange"
      @onClose="showActivity=false"
      :isRadio="true"
    ></uninActivity>
    <!-- 关联产品 -->
    <uninProduct
      :show="showProduct"
      @onOkClick="ProductChange"
      @onClose="showProduct=false"
      :isRadio="true"
    ></uninProduct>
    <!-- 图片查看 -->
    <PreviewPic v-model="visible" :imgUrl="imgUrl"></PreviewPic>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue, Emit } from "vue-property-decorator";
import { uploadImage } from "@service/content";
import uninPlace from "@components/uninPlace/uninPlace.vue";
import uninProduct from "@components/uninProduct/uninProduct.vue";
import uninActivity from "@components/uninActivity/uninActivity.vue";
import { PreviewPic } from "@components/index";
/**
 * limit  最大上传数量  少于1不展示提示
 * defaultImage: 默认图  String  支持多张和一张
 * 小号  small
 * <UploadImg
      :limit="1"
      @imglist="getLogo"
      :defaultImage="params.logo"
      :types="small"
    ></UploadImg>
 * 调用 getLogo()
 */
interface placeType {
  address: string;
  id: number;
  images: string;
  name: string;
  resourceType: string;
  resourceTypeName: string;
  status: string;
}
interface imgType {
  id: string;
  url: string;
  indexI?: number;
  name?: string;
  imgUrl?: string;
  tags?: string;
  description?: string;
  placeId?: number;
  placeObj?: placeType;
}
@Component({
  components: {
    uninPlace,
    uninActivity,
    uninProduct,
    PreviewPic
  }
})
export default class UploadImageAdv extends Vue {
  // 图片查看器的显示控制
  private visible: boolean = false;
  // 图片列表
  private imagesList: any = [];
  // 预览图片路径
  private imgUrl: string = "";
  // 限制个数
  private maxLength: any = 5;

  @Prop() private limit!: number;
  @Prop() private types!: string;
  @Prop() private advWidth!: number;
  @Prop() private advHeight!: number;
  // 默认图
  @Prop() private defaultImage!: string;
  // 是否需要标题
  @Prop() private name!: boolean;
  @Emit()
  imglist() {
    return this.imagesList;
  }
  @Watch("defaultImage")
  changeImage(val: any, oldVal: any) {
    if (!val) {
      this.imagesList = [];
      return;
    }
    // 字符串
    this.imagesList = val;
  }
  // 图片拖动
  mounted() {
    if (this.defaultImage) {
      this.imagesList = this.defaultImage;
    }
    if (this.limit) {
      this.maxLength = this.limit;
    }
    // 拖动结束
    this.$dragging.$on("dragend", () => {
      this.imglist();
    });
  }
  // 查看大图
  private viewImage(url: string) {
    this.imgUrl = url;
    this.visible = true;
  }
  // 选择图片
  private acceptImage(e: any) {
    let files = e.target.files;
    let _this = this;
    let len = files.length;
    let _input = this.$refs.fileInput as any;
    // 验证图片尺寸规范
    if (e.target.files) {
      let f = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = function(e: any) {
        //加载图片获取图片真实宽度和高度
        let image: any = new Image();
        image.src = this.result;
        image.onload = function() {
          let radio = _this.advWidth / _this.advHeight;
          let imgRadio = image.naturalWidth / image.naturalHeight;
          if (radio != imgRadio) {
            _this.$Message.error(`图片宽高比例必须是：${_this.advWidth} : ${_this.advHeight}`);
            return;
          } else {
            for (let i = 0; i < len; i++) {
              let formData = new FormData();
              formData.append("Filedata", files[i]);
              formData.append("path", "cultural-tourism-cloud");
              uploadImage(formData).then((data: any) => {
                // 需要标题
                _this.imagesList.push({
                  url: data.safeUrl,
                  name: files[i].name.split(".")[0],
                  jumpUrl: "",
                  resourceName: "",
                  id: "", // 此处的id为模拟数据，i可自定义，匹配添加图片的时候是当前图片
                  type: ""
                });
                if (i + 1 === len) {
                  _this.imglist();
                }
              });
            }
          }
        };
        _input.type = 'file'
      };
    }
    // 超过最大限制
    let _limit = this.maxLength - this.imagesList.length;
    if (this.imagesList.length + len > this.maxLength) {
      this.$Message.error(
        `您最多${this.maxLength === 1 ? "只" : "还"}能上传${_limit}张`
      );
      return;
    }
    _input.type = 'text'
  }

  // 删除图片
  private deleteFile(index: number) {
    this.imagesList.splice(index, 1);
    this.imglist();
  }

  /* S 弹出框 */
  private activeId: any = "";
  //关联场所
  private showPlace: boolean = false;
  //活动详情
  private showActivity: boolean = false;
  //商品详情
  private showProduct: boolean = false;
  private openPopFun(index: number, item: any, flag?: string) {
    if (flag === "1") {
      item.jumpUrl = "";
      item.resourceName = "";
    }
    this.activeId = index;
    if (item.type === "ACTIVITY") {
      this.showActivity = true;
    }
    if (item.type === "PLACE") {
      this.showPlace = true;
    }
    if (item.type === "GOODS") {
      this.showProduct = true;
    }
  }
  // 场所选择
  private placeChange(list: any) {
    let currImg = this.imagesList[this.activeId];
    let h5Domain = this.$store.state.app.userInfo.h5Domain;
    let res = list[0];
    let path = "";
    switch (list[0].resourceType) {
      case "CONTENT_TYPE_VENUE":
        path = `${h5Domain}/#/venues-detail/${res.id}`;
        break;
      case "CONTENT_TYPE_SCENERY":
        path = `${h5Domain}/#/scenic-detail/${res.id}`;
        break;
      case "CONTENT_TYPE_HOTEL":
        path = `${h5Domain}/#/hotel-detail/${res.id}`;
        break;
      case "CONTENT_TYPE_RESTAURANT":
        path = `${h5Domain}/#/food-detail/${res.id}`;
        break;
      default: {
        path = "";
      }
    }
    if (currImg) {
      currImg.placeObj = res;
      currImg.jumpUrl = path;
      currImg.resourceName = res.name;
      currImg.resourceId = res.id;
    }
    this.$set(this.imagesList, this.activeId, currImg);
    this.imglist();
  }
  // 商品选择
  private ProductChange(list: any) {
    let currPro = this.imagesList[this.activeId];
    if (currPro) {
      currPro.jumpUrl = list.url;
      currPro.resourceName = list.productName;
      currPro.resourceId = list.productId;
    }
    this.$set(this.imagesList, this.activeId, currPro);
    this.imglist();
  }
  // 活动选择
  private ActivityChange(list: any) {
    let currAct = this.imagesList[this.activeId];
    if (currAct) {
      currAct.jumpUrl =
        this.$store.state.app.userInfo.h5Domain +
        "/#/activity-detail/" +
        list.id;
      currAct.resourceName = list.name;
      currAct.resourceId = list.id;
    }
    this.$set(this.imagesList, this.activeId, currAct);
    this.imglist();
  }
  /* E 弹出框 */
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
    text-align: center;
    font-size: 12px;
    .check {
      line-height: 15px;
      margin-top: 10px;
      text-align: left;
    }
    .img-box {
      width: 240px;
      height: 160px;
      border-radius: 4px;
      overflow: hidden;
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
      &:hover {
        border-color: $theme;
      }
      input {
        opacity: 0;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
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
