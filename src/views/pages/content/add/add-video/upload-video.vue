<template>
  <div>
    <!-- <div class="demo-upload-list" > -->
    <div class="demo-upload-list" v-for="item in uploadList" :key="item.url">
      <template v-if="item.status === 'finished'">
        <!-- <template > -->
        <div class="img-box">
          <img :src="item.url" class="daq-img">
          <div class="demo-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
        </div>
        <Input placeholder="请填写视频名称" class="name-input"/>
        <div>
          <a class="add-more" @click.stop="addContent('showPlace')">关联场所</a>
          <a class="add-more" @click.stop="addContent('showDescribe')">描述</a>
          <a class="add-more" @click.stop="addContent('showTag')">标签</a>
          <a class="add-more" @click.stop="addContent('showTag')">设置封面</a>
        </div>
      </template>
    </div>
    <Upload
      ref="upload"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="['mp4']"
      :max-size="2048"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      multiple
      type="drag"
      action="//jsonplaceholder.typicode.com/posts/"
      style="display: inline-block;width:200px;height:100px;line-height: 100px; vertical-align:top;"
    >
      <div style="width: 200px;height:100px;line-height: 100px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="View Image" v-model="visible">
      <img
        :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'"
        v-if="visible"
        style="width: 100%"
      >
    </Modal>
    <!-- 关联场所 -->
    <PopPlace :show="showPlace"></PopPlace>
    <!-- 图片描述 -->
    <PopDescribe :show="showDescribe" type="视频"></PopDescribe>
    <!-- 标签 -->
    <PopTag :show="showTag"></PopTag>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import PopPlace from "@components/pop/place-pop.vue";
import PopDescribe from "@components/pop/describe-pop.vue";
import PopTag from "@components/pop/tag-pop.vue";

@Component({
  components: {
    PopPlace,
    PopDescribe,
    PopTag
  }
})
export default class uploadImg extends Vue {
  // 场所显示
  private showPlace = false;
  // 图片描述
  private showDescribe = false;
  // 标签
  private showTag = false;
  // 添加场所
  addContent(type: any) {
    this[type] = true;
  }
  private defaultList: any = [
    {
      name: "a42bdcc1178e62b4694c830f028db5c0",
      url: "https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar"
    }
  ];
  private imgName: string = "";
  private visible: boolean = false;
  private uploadList: any = [];

  handleView(name: any) {
    this.imgName = name;
    this.visible = true;
  }
  handleRemove(file: any) {
    const fileLists = (this.$refs.upload as any).fileList;
    (this.$refs.upload as any).fileList.splice(fileLists.indexOf(file), 1);
  }
  handleSuccess(res: any, file: any) {
    file.url =
      "https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar";
    file.name = "7eb99afb9d5f317c912f08b5212fd69a";
  }
  handleFormatError(file: any) {
    this.$Notice.warning({
      title: "The file format is incorrect",
      desc:
        "File format of " +
        file.name +
        " is incorrect, please select jpg or png."
    });
  }
  handleMaxSize(file: any) {
    this.$Notice.warning({
      title: "Exceeding file size limit",
      desc: "File  " + file.name + " is too large, no more than 2M."
    });
  }
  handleBeforeUpload() {
    const check = this.uploadList.length < 5;
    if (!check) {
      this.$Notice.warning({
        title: "Up to five pictures can be uploaded."
      });
    }
    return check;
  }
  mounted() {
    this.uploadList = (this.$refs.upload as any).fileList;
  }
}
</script>
<style lang="scss" scoped>
.demo-upload-list {
  display: inline-block;
  width: 200px;
  margin-right: 12px;
  text-align: center;
  background: #fff;
  position: relative;
  .name-input {
    width: 100%;
    margin: 12px 0;
  }
  .img-box {
    width: 200px;
    height: 100px;
    border-radius: 4px;
    overflow: hidden;
    &:hover {
      .demo-upload-list-cover {
        display: flex;
      }
    }
  }
  &-cover {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 100px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    i {
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      margin: 0 2px;
    }
  }
  .add-more {
    margin-right: 12px;
    color: $theme;
    cursor: pointer;
    &:hover {
      color: $theme-hover;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
