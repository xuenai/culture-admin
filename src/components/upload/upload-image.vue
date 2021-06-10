<!--
 * @Author: Hexg
 * @Date: 2019-07-11 21:23:07
 * @LastAuthor: 陈艳玲
 * @lastTime: 2019-11-25 15:16:54
 -->
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
        :style="imgBoxStyle"
      >
        <Icon type="ios-close-circle" class="icon" @click.stop="deleteFile(index)"></Icon>
        <p class="img-box" @click.stop="viewImage(index)" :style="imgBoxStyle">
          <!-- SXQ修改（修复点击删除图片 url 报错问题） -->
          <!-- <p class="img-box" @click.stop="viewImage(item.url)"> -->
          <img :src="name ? item.url : item" :alt="item" class="daq-img" />
        </p>
        <Input
          v-if="name"
          v-model="item.name"
          placeholder="请输入名称"
          style="width: 100%; margin-top: 10px;"
          :maxlength="100"
        />
      </li>
      <li class="item upload" v-if="imagesList.length < maxLength">
        <div v-if="!loading">
          <input
            class="upload-file"
            type="file"
            accept="image/*"
            multiple
            ref="fileInput"
            @change="acceptImageMin($event)"
            unselectable="on"
          />+ 添加图片
        </div>
        <Icon custom="iconfont c-icon-jiazai upload-loading" size="24" v-if="loading"></Icon>
      </li>
    </ul>
    <p class="remind" v-if="maxLength && maxLength > 1">注：拖动图片可进行排序，最多上传{{maxLength}}张</p>
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="currIndex"></PreviewPics>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { uploadImage } from "@service/content";
import { PreviewPics } from "@components/index";
import { base64FileUpload } from "@service/common";
import Compressor from "compressorjs";
/**
 * limit  最大上传数量  少于1不展示提示
 * defaultImage: {string(以逗号或者空格隔开的字符串) | array<string> （url数组）} 默认图   支持多张和一张
 * 小号  small
 * <UploadImg
            :limit="1"
            @getImagesList="getLogo"
            :defaultImage="params.logo"
            :type="small"
          ></UploadImg>
 * 调用 getLogo()
 */

@Component({ components: { PreviewPics } })
export default class UploadImages extends Vue {
  // 图片查看器的显示控制
  private visible: boolean = false;
  // 图片列表
  private imagesList: any = [];
  // 预览图片路径
  private imgUrl: Array<string> = [];
  //   限制个数
  private maxLength: any = 5;
  // 浏览图片的下标
  private currIndex = 0;

  @Prop({ default: "" }) private imgBoxStyle!: string;
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
      // 判断传过来的是不是数组
      if (Object.prototype.toString.call(val) === "[object Array]") {
        this.imagesList = val;
      } else {
        // 为空格或者逗号隔开的字符串
        this.imagesList = val.split(",");
        /* else { // 不能用空格作为分隔，部分图片名称包含空格
          this.imagesList = val.split(" ");
        }*/
      }
    } else {
      this.imagesList = val;
    }
  }
  // 图片拖动
  mounted() {
    if (!this.name) {
      if (this.defaultImage) {
        if (
          Object.prototype.toString.call(this.defaultImage) === "[object Array]"
        ) {
          this.imagesList = this.defaultImage;
        } else if (this.defaultImage.indexOf(",") !== -1) {
          this.imagesList = this.defaultImage.split(",");
        }
        /* else { // 不能用空格作为分隔，部分图片名称包含空格
          this.imagesList = this.defaultImage.split(" ");
        }*/
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
  private viewImage(index: number) {
    this.imgUrl = [];
    this.imagesList.map((e: any) => {
      if (e.url) {
        this.imgUrl.push(e.url);
      } else {
        this.imgUrl.push(e);
      }
    });
    this.currIndex = index;
    setTimeout(() => {
      this.visible = true;
    }, 100);
  }
  //加载loading 图
  private loading: boolean = false;
  // 选择图片
  private acceptImageMin(e: any) {
    let _this = this;
    let files = e.target.files;
    let len = files.length;
    let _input = this.$refs.fileInput as HTMLElement;
    for (let i = 0; i < len; i++) {
      if (!(/(\/png)|(\/jpeg)|(\/jpg)/.test(files[i].type))) {
        this.$Message.info("只能上传.png .jpg格式的图片");
        for (let j = 0; j < len; j++) {
          files[j].value = null;
        }
        return;
      }
    }
    // 超过最大限制
    let _limit = this.maxLength - this.imagesList.length;
    if (this.imagesList.length + len > this.maxLength) {
      this.$Message.error(
        `您最多${
          this.maxLength === 1 || this.imagesList.length === 0 ? "只" : "还"
        }能上传${_limit}张`
      );
      return;
    }
    _input.setAttribute("type", "text");
    this.loading = true;
    let oldLen = this.imagesList.length;
    //    let count: number = 0; //统计finish
    for (let i = 0; i < len; i++) {
      let file = files[i];
      let formData = new FormData();
      // @ts-ignore
      formData.append("Filedata", file);
      formData.append("path", "cultural-tourism-cloud");
      uploadImage(formData).then((data: any) => {
        // 需要标题
        if (_this.name) {
          _this.imagesList.push({
            url: data.safeUrl,
            name: (files[i].name as any).substr(0, 100)
          });
        } else {
          _this.imagesList.push(data.safeUrl);
        }
        if (_this.imagesList.length === len || i + 1 === len) {
          if (_this.name) {
            _this.$emit("getImagesList", _this.imagesList as Array<Object>);
            _this.loading = false;
          } else {
            _this.$emit("getImagesList", _this.imagesList as Array<string>);
            _this.loading = false;
          }
        }
      });
      // new Compressor(file, {
      //   quality: 0.8,
      //   convertSize: 1000000,
      //   success(result:any) {
      //     let formData = new FormData();
      //     // @ts-ignore
      //     formData.append("Filedata", result, result.name);
      //     formData.append("path", "cultural-tourism-cloud");
      //     uploadImage(formData).then((data: any) => {
      //       // 需要标题
      //       if (_this.name) {
      //         _this.imagesList.push({
      //           url: data.datas.url,
      //           name: (files[i].name as any).substr(0, 100)
      //         });
      //       } else {
      //         _this.imagesList.push(data.datas.url);
      //       }
      //       if (_this.imagesList.length === len || i + 1 === len) {
      //         if (_this.name) {
      //           _this.$emit("getImagesList", _this.imagesList as Array<Object>);
      //           _this.loading = false;
      //         } else {
      //           _this.$emit("getImagesList", _this.imagesList as Array<string>);
      //           _this.loading = false;
      //         }
      //       }
      //     });
      //   },
      //   error(err:any) {
      //     console.log(err.message);
      //   }
      // });
    }
    _input.setAttribute("type", "file");
  }
  // 删除图片
  private deleteFile(index: Number) {
    this.imagesList.splice(index, 1);
    this.$emit("getImagesList", this.imagesList);
    this.$emit("getMediaList", this.imagesList);
    // this.imagesList.splice(index, 1);
    // if (this.name) {
    //   this.$emit("getImagesList", this.imagesList as Array<Object>);
    // } else {
    //   this.$emit("getImagesList", this.imagesList as Array<string>);
    // }
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
    margin: 0 10px 10px 0;
    vertical-align: top;
    text-align: center;
    font-size: 12px;
    color: $theme;
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
        font-size: 0;
        cursor: pointer;
      }
    }
    input {
      outline: medium;
      appearance: none;
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
      width: 100px;
      height: 100px;
      line-height: 100px;
      .img-box {
        width: 80px;
        height: 50px;
      }
    }
    .img-box {
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
