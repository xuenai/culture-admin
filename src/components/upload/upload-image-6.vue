<template>
  <div>
    <!-- 已上传列表 -->
    <ul class="images-list">
      <li
        class="item"
        v-for="(url, index) in imagesList"
        :key="index"
        v-dragging="{ list: imagesList, item: url, group: 'imagesList' }"
        :style="imgBoxStyle"
      >
        <Icon type="ios-close-circle" class="icon" @click.stop="deleteFile(index)"></Icon>
        <div class="img-box" @click.stop="viewImage(index)" :style="imgBoxStyle">
          <img :src="url" :alt="url" />
        </div>
      </li>
      <li class="item upload" v-if="imagesList.length < limit">
        <div v-show="!loading">
          <input
            class="upload-file"
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            multiple
            ref="fileInput"
            @change="acceptImageMin($event)"
            unselectable="on"
          />+ 添加图片
        </div>
        <Icon custom="iconfont upload-loading" size="24" v-if="loading"></Icon>
      </li>
    </ul>
    <p class="remind">注：支持.jpg .jpeg .png格式{{ (limit && limit > 1) ? `，拖动图片可进行排序，最多上传${limit}张` : '' }}</p>
    <PreviewPics v-model="visible" :imgs="imagesList" :currIndex="currIndex"></PreviewPics>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { uploadImage } from "@service/content";
import { PreviewPics } from "@components/index";
/**
 * 本地上传图片组件
 * 裁剪图片参数wToh: {ratio?: number, width?: number, height?: number}
 */
interface wTohType {
  ratio?: number, width?: number, height?: number
}

@Component({ components: { PreviewPics } })
export default class UploadImages extends Vue {
  // 图片查看器的显示控制
  private visible: boolean = false;
  // 图片列表
  private imagesList: any = [];
  // 预览图片路径
  private imgUrl: Array<string> = [];
  // 浏览图片的下标
  private currIndex = 0;

  @Prop({ default: () => {} }) private imgBoxStyle!: string;
  @Prop({default: 0}) private limit!: any;
  // @Prop({default: 0}) private singleSizeLimit!: number; // 单张大小限制
  // 默认图
  @Prop({default: () => []}) private defaultImage!: string[];
  @Prop() private wToh!: wTohType; // 宽高比 w/h
  @Prop({default: .8}) private compress!: number; // 压缩比率
  @Watch("defaultImage")
  changeImage(val: any, oldVal: any) {
    this.imagesList = val || [];
  }
  created() {
    this.imagesList = this.defaultImage || [];
  }
  mounted() {
    // 拖动结束
    this.$dragging.$on("dragend", () => {
      this.$emit("getImagesList", this.imagesList as Array<string>);
    });
  }
  // 查看大图
  private viewImage(index: number) {
    this.currIndex = index;
    this.visible = true;
  }
  //加载loading 图
  private loading: boolean = false
  // 选择图片
  private acceptImageMin(e: any) {
    let files = e.target.files;
    let len = files.length;
    let oInput = this.$refs.fileInput as HTMLElement;
    let reg = new RegExp('(/png)|(/jpeg)|(/jpg)$');
    let oldLen = this.imagesList.length;
    let countArea = this.countArea;
    let wToh = this.wToh;
    let compress = this.compress;
    let _this = this

    // 超过最大数量限制
    if (oldLen + len > this.limit) {
      this.$info.error(
        `您最多${
          this.limit === 1 || oldLen === 0 ? "只" : "还"
        }能上传${this.limit - oldLen}张`
      );
      return;
    }
    // 格式限制
    if ( Array.prototype.some.call(files, file => reg.test(file.type) === false) ) {
      this.$Message.info("只能上传.png .jpg .jpeg格式的图片");
      return;
    }

    oInput.setAttribute("type", "text");
    this.loading = true;
    Array.prototype.forEach.call(files, file => {
      let url = URL.createObjectURL(file);
      let oImage = new Image();
      oImage.src = url;
      oImage.onload = function() {
        let oCanvas = document.createElement("canvas");
        let arr = countArea((this as any).width, (this as any).height, wToh)
        oCanvas.width = arr[6];
        oCanvas.height = arr[7];
        let ctx = oCanvas.getContext("2d") as any;
        ctx.drawImage(this, ...arr);
        URL.revokeObjectURL(url);
        oCanvas.toBlob((blob: any) => {
          _this.uploadImage({file, blob}).then(() => {
            if (_this.imagesList.length === oldLen + files.length) {
              _this.$emit("getImagesList", _this.imagesList);
              _this.loading = false
              oInput.setAttribute("type", "file")
            }
          })
        }, 'image/jpeg', compress);
      }
    })
  }
  // 计算canvas大小和drawImage(img,sx,sy,swidth,sheight,x,y,width,height)的各个参数计算
  // 参数 原图片的宽高 和 裁剪配置参数
  // 实现的裁剪方式属于缩放式裁剪，使裁剪后的得到的图片尽可能包含多的图片内容
  private countArea (imgW: number, imgH: number, wToh: wTohType): number[] {
    let { ratio, width, height } = wToh as any;
    let w: number = 0, h: number = 0; // canvas的宽高 也是最终裁剪图片的宽高
    let sx = 0, sy = 0, swidth = 0, sheight = 0, x = 0, y = 0;
    let natureRatio = imgW / imgH
    // 组合情况 2 * 2 * 2
    let pass1 = ratio && width && height
    let pass2 = ratio && width && !height
    let pass3 = ratio && !width && height
    let pass4 = ratio && !width && !height
    let pass5 = !ratio && width && height
    let pass6 = !ratio && width && !height
    let pass7 = !ratio && !width && height
    let pass8 = !ratio && !width && !height
 
    // 如果三个值全设置，那么忽略ratio，当pass5处理
    if (pass1 || pass5) {
      w = width as number
      h = height as number
    }
    else if (pass2) {
      w = width as number
      h = w / ratio as number
    }
    else if (pass3) {
      h = height as number
      w = h * ratio as number
    }
    else if (pass4) {
      if (natureRatio < ratio) { // 图片原始宽高比小于设置宽高比
        w = imgW as number
        h = w / ratio as number
      } else if (natureRatio == ratio) { // 图片原始宽高比等于设置宽高比
        w = imgW as number
        h = imgH as number
      } else { // 图片原始宽高比大于设置宽高比
        h = imgH as number
        w = h * ratio as number
      }
    }
    else if (pass6) {
      w = width as number
      h = w / natureRatio as number
    }
    else if (pass7) {
      h = height as number
      w = h * natureRatio as number
    }
    else if (pass8) {
      h = imgH as number
      w = imgW as number
    }

    ratio = ratio || w / h;
    if (natureRatio < ratio) { // 图片原始宽高比小于设置宽高比
      swidth = imgW as number
      sheight = swidth / ratio as number
      sx = 0 as number
      sy = (imgH - sheight) / 2 as number
    } else if (natureRatio == ratio) { // 图片原始宽高比等于设置宽高比
      swidth = imgW as number
      sheight = imgH as number
      sx = 0
      sy = 0
    } else { // 图片原始宽高比大于设置宽高比
      sheight = imgH as number
      swidth = sheight * ratio as number
      sx = (imgW - swidth) / 2 as number
      sy = 0
    }

    return [sx, sy, swidth, sheight, x, y, w, h]
  }
  // 上传封面图
  private uploadImage (fileData: {file: any, blob: Blob}): Promise<any> {
    let formData = new FormData();
    let name = '未命名';
    let r = /(.*)\.[a-zA-Z]+$/.exec(fileData.file.name)
    if (r) name = r[1];
    formData.append("Filedata", fileData.blob,  name + '.jpg');
    formData.append("path", "cultural-tourism-cloud");
    return uploadImage(formData).then((res:any) => {
      this.imagesList.push(res.url)
    })
  }
  // 删除图片
  private deleteFile(index: number) {
    this.imagesList.splice(index, 1);
    this.$emit("getImagesList", this.imagesList);
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
      box-shadow: 0 1px 10px 0px #ccc;
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
