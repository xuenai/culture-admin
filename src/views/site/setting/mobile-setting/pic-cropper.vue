<template>
  <div
    class="pic-cropper"
    :class="{'border-none': !border}"
    :style="{width: width + 'px', height: height + 'px', borderStyle: borderStyle}"
  >
    <img :src="value" alt v-if="value" :style="{width: width -4 + 'px', height: height - 4 + 'px'}" />
    <div class="input-wrapper" v-else>
      <input ref="input" type="file" accept="image/*" @change="acceptImage($event)" />
      <span class="iconfont c-icon-untitled44"></span>
      <span class="input-wrapper-tip" v-if="showText">添加图片</span>
    </div>
    <span class="iconfont c-icon-cuowu" v-if="value" @click="deleteImg"></span>
    <Modal title="选择图片" v-model="cutModalShow" class="pic-preview-modal" :mask-closable="false">
      <p class="tip">滚轮可以缩放图片，拖动图片可以改变图片位置，拖动选框可以改变选框位置</p>
      <div class="preview" v-if="cutModalShow">
        <div class="left">
          <vue-cropper
            ref="cropper"
            :src="previewImgSrc"
            alt="Source Image"
            :aspect-ratio="ratio"
            preview=".right-preview"
            dragMode="move"
          />
        </div>
        <div class="right">
          <p>预览</p>
          <div class="right-preview"></div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="showFileChooser">更换图片</Button>
        <Button @click="upload" type="primary" :loading="loading">上传</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Emit, Prop } from "vue-property-decorator";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import { uploadBase, uploadImage } from "@service/content";

@Component({
  components: {
    VueCropper
  }
})
export default class MobileSettingUpload extends Vue {
  @Prop() value!: string;
  // 图片截取宽高比例
  @Prop({ default: 1 }) ratio!: number;
  // 盒子宽度
  @Prop({ default: 48 }) width!: number;
  // 盒子高度
  @Prop({ default: 48 }) height!: number;
  // 盒子边框样式 solid dashed dotted
  @Prop({ default: "solid" }) borderStyle!: string;
  // 盒子是否含有边框
  @Prop({ default: true }) border!: boolean;
  // 是否展示添加图片文字
  @Prop({ default: false }) showText!: boolean;
  // 是否需要截图
  @Prop({ default: true }) needCut!: boolean;
  loading = false;
  cutModalShow = false;
  previewImgSrc = "";
  filename = "";
  @Watch("cutModalShow")
  onCutModalShowChange(val: boolean) {
    if (!val) {
      (this.$refs.input as any).type = "file";
      this.previewImgSrc = "";
      this.filename = "";
    }
  }
  @Emit()
  input(pic: string) {
    return pic;
  }
  deleteImg() {
    this.input("");
  }
  // 选择图片
  acceptImage(e: any) {
    if (!e.target.files.length) {
      return;
    }
    const file = e.target.files[0];
    this.filename = file.name;
    if (file.type.indexOf("image/") === -1) {
      alert("请选择图片");
      return;
    }
    if (this.needCut) {
      this.showCutCard(file);
    } else {
      this.upLoadImageByFileData(file)
    }
    (this.$refs.input as any).type = "text";
  }
  upLoadImageByFileData(file:any) {
    let formData = new FormData();
    formData.append("Filedata", file);
    formData.append("path", "cultural-tourism-cloud");
    uploadImage(formData).then((res: any) => {
      // 需要标题
      this.input(res.safeUrl);
    });
  }
  // 当需要截图版的时候
  showCutCard(file: any) {
    if (typeof FileReader === "function") {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.previewImgSrc = event.target.result;
        (this.$refs.cropper as any).replace(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      this.$Message.error(
        "浏览器版本过低，不支持FileReader，请更换火狐浏览器或者谷歌浏览器"
      );
    }
    this.cutModalShow = true;
  }
  // 点击重新选择图片弹出文件选择
  showFileChooser() {
    (this.$refs.input as any).type = "file";
    (this.$refs.input as any).click();
  }
  // 上传操作
  upload() {
    //  (this.$refs.cropper as any).getCroppedCanvas({maxWidth: 600}).toBlob((blob: Blob) => {
    //    console.log(blob)
    //  })
    this.loading = true;
    let img = (this.$refs.cropper as any)
      .getCroppedCanvas({ maxWidth: 600 })
      .toDataURL();
    uploadBase([
      {
        data: img,
        path: "cultural-tourism-cloud-admin",
        fileName: this.filename
      }
    ])
      .then((res: any) => {
        this.cutModalShow = false;
        this.input(res.safeUrl);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>

<style lang='scss' scoped>
.pic-cropper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #fff;
  border: 1px solid $borderLight;
  cursor: pointer;
  &.border-none {
    border: none !important;
  }
  img {
    min-width: 44px;
    width: 44px;
    height: 44px;
  }
  .input-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    input {
      position: absolute;
      opacity: 0;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
    &-tip {
      font-size: 12px;
      color: #999;
    }
  }
  .iconfont {
    font-size: 14px;
    color: #999;
  }
  .c-icon-cuowu {
    position: absolute;
    right: -6px;
    top: -6px;
    height: 12px;
    width: 12px;
    font-size: 12px;
    cursor: pointer;
    color: #bcbcbc;
    transition: all 0.3s ease-in;
    line-height: 1;
    &:hover {
      transform: rotate(180deg);
    }
  }
}
.preview {
  display: flex;
  align-items: center;
  padding: 0 15px;
  .left {
    min-width: 300px;
    max-width: 300px;
  }
  .right {
    margin-left: 30px;
    > p {
      padding-bottom: 8px;
    }
  }
  .right-preview {
    width: 100px;
    height: 100px;
    overflow: hidden;
  }
}

.tip {
  padding-bottom: 10px;
  font-size: 12px;
  color: #999;
}
</style>
