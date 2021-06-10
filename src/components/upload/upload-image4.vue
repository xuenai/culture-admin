<template>
  <div>
    <!-- 已上传列表 -->
    <ul class="images-list" ref="parentNode" :class="type ? type : ''">
      <li
        class="item"
        v-for="(item, index) in imagesList"
        :key="name ? item.url : item"
        :data-url="name ? item.url : item"
        draggable="true"
        v-dragging="{ list: imagesList, item: item, group: 'image' }"
      >
        <Icon type="ios-close-circle" class="icon" @click.stop="deleteFile(index)"></Icon>
        <p class="img-box" @click.stop="viewImage(!name ? item : item.url)">
          <img :src="name ? item.url : item" :alt="item" class="daq-img">
        </p>
        <Input
          v-model="item.name"
          placeholder="请输入名称"
          style="width: 100%; margin-top: 10px;"
           :maxlength="20"
          v-if="name"
        />
      </li>
      <li class="item upload" v-if="imagesList.length < maxLength">
        <input type="file" accept="image/*" multiple ref="fileInput" @change="acceptImage($event)">+ 添加图片
      </li>
    </ul>
    <p class="remind" v-if="maxLength && maxLength > 1">注：拖动图片可进行排序，最多上传{{maxLength}}张</p>
    <PreviewPic v-model="visible" :imgUrl="imgUrl"></PreviewPic>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { uploadImage } from "@service/content";
import {PreviewPic} from '@components/index'
/**
 * limit  最大上传数量  少于1不展示提示
 * defaultImage: 默认图  String  支持多张和一张
 * 小号  small
 * <UploadImg
            :limit="1"
            @getImagesList="getLogo"
            :defaultImage="params.logo"
            :type="small"
          ></UploadImg>
 * 调用 getLogo()
 */

@Component({ components: {PreviewPic} })
export default class UploadImages extends Vue {
  // 图片查看器的显示控制
  private visible: boolean = false;
  // 图片列表
  private imagesList: any = [];
  // 预览图片路径
  private imgUrl: String = "";
  //   限制个数
  private maxLength: any = 5;

  @Prop() private limit!: Number;
  @Prop() private type!: String;
  // 默认图
  @Prop() private defaultImage!: String;
  // 是否需要标题
  @Prop() private name!: Boolean;
  @Watch("defaultImage")
  changeImage(val: any, oldVal: any) {
    if (!val) {
      this.imagesList = [];
      return;
    }
    // 字符串
    if (!this.name) {
      if (val.indexOf(",") !== -1) {
        this.imagesList = val.split(",");
      } else {
        this.imagesList = val.split(" ");
      }
    } else {
      this.imagesList = val;
    }
  }
  // 图片拖动
  mounted() {
    if (!this.name) {
      if (this.defaultImage) {
        if (this.defaultImage.indexOf(",") !== -1) {
          this.imagesList = this.defaultImage.split(",");
        } else {
          this.imagesList = this.defaultImage.split(" ");
        }
      }
    } else {
      this.imagesList = this.defaultImage;
    }

    if (this.limit) {
      this.maxLength = this.limit;
    }
    // 拖动结束
    this.$dragging.$on("dragend", () => {
      this.$emit("getImagesList", this.imagesList as Array<string>);
    });
  }
  // 查看大图
  private viewImage(url: String) {
    this.imgUrl = url;
    this.visible = true;
  }
  // 选择图片
  private acceptImage(e: any) {
    let files = e.target.files;
    let _this = this;
    let len = files.length;
    let _input = this.$refs.fileInput as HTMLElement;
    // 超过最大限制
    let _limit = this.maxLength - this.imagesList.length;
    if (this.imagesList.length + len > this.maxLength) {
      this.$Message.error(
        `您最多${this.maxLength === 1 ? "只" : "还"}能上传${_limit}张`
      );
      return;
    }
    _input.setAttribute("type", "text");
    for (let i = 0; i < len; i++) {
      let formData = new FormData();
      formData.append("Filedata", files[i]);
      formData.append("path", "cultural-tourism-cloud");
      uploadImage(formData).then((data: any) => {
        // 需要标题
        if (_this.name) {
          _this.imagesList.push({
            url: data.safeUrl,
            name: files[i].name.split(".")[0]
          });
        } else {
          _this.imagesList.push(data.safeUrl);
        }
        if (i + 1 === len) {
          if (_this.name) {
            _this.$emit("getImagesList", _this.imagesList as Array<Object>);
          } else {
            _this.$emit("getImagesList", _this.imagesList as Array<string>);
          }
        }
      });
    }
    _input.setAttribute("type", "file");
  }
  // 删除图片
  private deleteFile(index: Number) {
    this.imagesList.splice(index, 1);
    if (this.name) {
      this.$emit("getImagesList", this.imagesList as Array<Object>);
    } else {
      this.$emit("getImagesList", this.imagesList as Array<string>);
    }
  }
}
</script>

<style lang='scss' scoped>
.images-list {
  font-size: 0;
  .item {
    cursor: pointer;
    position: relative;
    display: inline-block;
    margin: 18px 0;
    vertical-align: top;
    text-align: center;
    font-size: 12px;
    color: $theme;
    .img-box {
      width: 40px;
      height: 40px;
      // border-radius: 4px;
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
      // border: 1px dashed #dee3ed;
      cursor: pointer;
      // width: 240px;
      // height: 160px;
      // line-height: 160px;
      // border-radius: 4px;
      &:hover {
        // border-color: $theme;
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
