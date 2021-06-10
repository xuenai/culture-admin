<!--
 * @Author: 任智勇
 * @since: 2019-06-03 11:32:50
 * @LastAuthor: 任智勇
 * @lastTime: 2019-06-03 17:43:54
 -->
<template>
  <div>
    <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index" v-show="show">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="demo-upload-list-cover">
          <div class="controlDiv">
            <Upload
            v-if="config.btn.join().indexOf('update') > -1"
              ref="upload"
              :show-upload-list="false"
              :default-file-list="uploadList"
              :on-success="handleSuccess"
              :format="config.type"
              :accept="config.minType"
              :max-size="1024*config.size"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              action="//jsonplaceholder.typicode.com/posts/"
              style="display: inline-block;"
            >
              <Icon type="md-create" title="修改"></Icon>
            </Upload>
            <Icon type="ios-eye-outline" v-if="config.btn.join().indexOf('view') > -1" title="查看大图" @click.native="handleView(item.name)"></Icon>
            <Icon type="ios-trash-outline" v-if="config.btn.join().indexOf('delete') > -1" title="删除" @click.native="handleRemove(item)"></Icon>
          </div>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      ref="upload"
      :show-upload-list="false"
      :default-file-list="uploadList"
      :on-success="handleSuccess"
      :format="config.type"
      :accept="config.minType"
      :max-size="1024*config.size"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      action="//jsonplaceholder.typicode.com/posts/"
      style="display: inline-block;"
      type="drag"
    >
      <div class="addIcon" v-if="!show">
        <Icon type="md-add" size="30"></Icon>
        <span class="tips">只能上传{{config.type.join(',')}}格式，且文件大小不能超过{{config.size}}M</span>
      </div>
    </Upload>
    <Modal title="图片查看" v-model="visible">
      <img v-if="url" :src="url" style="width: 100%">
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
/**
 * 单图片上传组件
 * <upload :url="fromData.imgUrl" :name="fromData.imgName"></upload>
 * 参数 配置项说明
 * url: 默认图片路径
 * name: 图片名称
 * size: 图片限制大小 默认 2   单位 M
 * type: 图片类型限制，如：['jpg','jpeg','png']
 * minType: 原生input的accept属性 ，如："image/png, image/jpeg,image/jpg"
 * btn: 鼠标悬停时的操作按钮 update: 修改, view: 查看大图 , delete: 删除  默认三个都显示
 *
 * 事件
 * onSucess: 上传成时触发,返回值为 file
 * onChange: 文件变化时 包括上传成功、删除等,返回值为数组
 */
@Component({ components: {} })
export default class ComponentName extends Vue {
  private config: any = {
    size: 2,
    type: ["jpg", "jpeg", "png"],
    minType: "image/png, image/jpeg,image/jpg",
    btn: ['update','view','delete']
  };
  //   文件列表显示 与 添加文件上传的按钮显示
  private show: boolean = true;
  private visible: boolean = false; // 图片查看器的显示控制
  private uploadList: any;
  @Prop() private url!: string;
  @Prop() private name!: string;
  @Prop() private size!: number;
  @Prop() private type!: Array<string>;
  @Prop() private minType!: string;
  @Prop() private btn!: Array<string>;
  created() {
    // 将参数转为上传组件需要的数组形式
    this.uploadList = [
      {
        name: this.name || "",
        url: this.url
      }
    ];
    // 合并配置参数
    if (this.size) {
      this.config.size = this.size;
    }
    if (this.type && this.type.length > 0) {
      this.config.type = this.type;
    }
    if (this.minType) {
      this.config.minType = this.minType;
    }
    if (this.btn && this.btn.length > 0) {
      this.config.btn = this.btn;
    }
  }
  mounted() {}
  // 查看大图
  private handleView(name: any) {
    this.visible = true;
  }
  //   删除图片
  private handleRemove(file: any) {
    this.uploadList = [];
    this.show = false;
    this.$emit("onChange", this.uploadList);
  }
  //   文件上传成功时
  private handleSuccess(res: any, file: any) {
    this.show = true;
    this.uploadList = [
      {
        name: file.name || "",
        url: file.url || ""
      }
    ];
    this.$emit("onChange", this.uploadList);
    this.$emit("onSucess", file);
  }
  //   文件格式验证失败
  private handleFormatError(file: any) {
    this.$Notice.warning({
      title: "文件格式错误",
      desc: "只能上传 " + this.config.type.join(",") + " 格式的文件"
    });
  }
  //   验证文件大小限制
  private handleMaxSize(file: any) {
    this.$Notice.warning({
      title: "文件尺寸错误",
      desc: "只能上传不大于 " + this.config.size + "M 的文件"
    });
  }
  //   上传文件之前 验证文件个数
  private handleBeforeUpload() {
    const check = this.uploadList.length < 5;
    if (!check) {
      this.$Notice.warning({
        title: "Up to five pictures can be uploaded."
      });
    }
    return check;
  }
}
</script>

<style lang='scss' scoped>
.demo-upload-list {
  display: inline-block;
  width: 200px;
  height: 150px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: $bg01;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.addIcon {
  width: 200px;
  height: 150px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .tips {
    padding: 0 15px;
  }
}
.controlDiv {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
