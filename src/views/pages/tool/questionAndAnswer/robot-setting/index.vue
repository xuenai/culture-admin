<template>
  <Form class="form" :label-width="80" ref="params" :model="params" :rules="ruleValidate">
    <h2 class="tit">机器人信息配置</h2>
    <FormItem label="机器人昵称" prop="name">
        <Input placeholder="建议不超过8个汉字" :maxlength="8" v-model="params.name" class="w300" />
    </FormItem>
    <FormItem label="机器人头像" class="photo-box">
        <div class="photo fl" :class="{'no-photo': !params.logo} ">
          <img v-if="params.logo" :src="params.logo" alt="">
          <input type="file" accept="image/*" @change="acceptImage($event)">
        </div>
        <Button type="primary" size="small" style="margin-left: 10px" @click="reset">恢复默认</Button>
    </FormItem>
    <FormItem class="formItem" label="聊天背景图">
      <UploadImg2 
        :defaultImage="params.backgroundImage?[{id:0,url:params.backgroundImage}]:''" 
        @getImagesList="list => params.backgroundImage = list[0].url" 
        :limit="1">
      </UploadImg2>
    </FormItem>
    <FormItem label="欢迎语">
      <Ueditor id="uedit1" v-model="params.welcome"></Ueditor>
    </FormItem>
    <!-- bug #37949 要求屏蔽人工功能 -->
    <!-- <FormItem label="转人工">
        <Input placeholder="百度商桥客服链接" v-model="params.humanServices" :maxlength="500" class="w300" />
    </FormItem> -->
    <FormItem>
        <Button type="primary" @click="save">保存</Button>
        <!-- <Button style="margin-left: 20px" @click="$router.go(-1)">返回</Button> -->
    </FormItem>
  </Form>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import UploadImg2 from "@components/upload/upload-image2.vue";
import Ueditor from "@components/ueditor/ueditor.vue";
import { saveRobot, getRobotInfo } from "@service/tool";
import { uploadImage } from "@service/content";

@Component({
  components: {
    UploadImg2,
    Ueditor
  }
})
export default class RobotSetting extends Vue {
  // 默认头像
  private defaultPhotoUrl: string = "";
  // post参数
  private params: any = {
    name: "",
    logo: this.defaultPhotoUrl,
    backgroundImage: "",
    welcome: "",
    humanServices: "",
  }
  // 验证规则
  private ruleValidate = <any>{
    name: [
      {
        message: "请将信息填写完整",
      }
    ]
  }
  created() {
    this.getRobotInfo()
  }
  // 选择图片文件
  private file: any;
  private acceptImage(e:any) {
    if (e.target.files && e.target.files[0]) {
      let [file] = e.target.files
      e.target.value = null
      this.file = file
      this.params.logo = URL.createObjectURL(file)
    } else {
      // this.reset()
    }
  }
  private reset() {
    this.params.logo = this.defaultPhotoUrl
    this.file = null;
  }
  // 保存
  private save() {
    this.uploadPhoto(this.file).then((logo:string | undefined) => {
      saveRobot({...this.params, logo}).then((res:any) => {
        if (res.code === 0) {
          this.$Message.success('保存成功！')
        }
      })
    })
  }
  // 上传头像
  private uploadPhoto (file: any): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      if (file) {
        let formData = new FormData();
        formData.append("Filedata", file);
        formData.append("path", "cultural-tourism-cloud");
        uploadImage(formData).then((res:any) => {
          if (res.state === 0) {
            resolve(res.safeUrl as string) 
          } else {
            reject('头像保存失败！')
          }
        }).catch(() => reject('头像保存失败！'))
      } else {
        resolve()
      }
    })
  }
  // 获取详情
  private getRobotInfo() {
    getRobotInfo().then((res:any) => {
      if (res.code === 0) {
        this.params = res.data
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.form {
  padding: 30px;
  .w300 {
    width: 300px;
  }
  .tit {
    margin: 0 8px 20px;
  }
  .photo-box {
    .photo {
      width: 42px;
      height: 42px;
      // border-radius: 50%;
      box-shadow: 0 0 5px #ddd;
      overflow: hidden;
      position: relative;
      top: -6px;
      &.no-photo {
        &::after {
          content: "+";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          border-radius: 50%;
          border: 1px dashed #23a1ee;
          color: #23a1ee;
          font-size: 30px;
          line-height: 42px;
          text-align: center;
        }
      }
      input {
        position: absolute;
        z-index: 9;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
      img {
        width: 100%;
      }
    }
  }
}
</style>