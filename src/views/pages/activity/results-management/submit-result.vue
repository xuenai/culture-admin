<template>
  <div class="perform-wrap result-submit-page" style="padding-top:20px">
    <!--活动详情-->
    <div class="tips-panel clearfix ml20">
      <span class="fl title">活动信息</span>
    </div>
    <!-- <activityDesc></activityDesc> -->
    <OrdinaryActivityDetail v-if="activityData" :data="activityData" :openAll="false"></OrdinaryActivityDetail>
    <!--活动成果详情-->
    <div class="tips-panel clearfix ml20">
      <span class="fl title">活动成果反馈</span>
    </div>
    <div class="form-wrap pd20">
      <Form
        ref="formData"
        :label-width="100"
        :model="params"
        :rules="ruleValidate"
      >
        <FormItem label="实际参加人数" prop="joinPeople">
          <InputNumber style="width:200px" :max="9999" :min="1" v-model="params.joinPeople" />
        </FormItem>
        <FormItem label="成果介绍" prop="summary">
          <Input
            type="textarea"
            :rows="8"
            :maxlength="200"
            class="control"
            v-model="params.summary"
            placeholder="请输入本次活动组织的情况，达到的效果等信息"
          />
        </FormItem>
        <FormItem>
          <FormItem label="活动图片" prop="images" class="activity-img"><p style="height: 196px;"></p></FormItem>
          <uploadImg
            class="media-item"
            :defaultImage="defaultImage"
            @getImagesList="getImagesList"
            :limit="30"
          ></uploadImg>
        </FormItem>
        <FormItem>
          <FormItem label="活动视频" prop="videos" class="activity-img"><p style="height: 196px;"></p></FormItem>
          <uploadVideo
            class="media-item"
            :defaultVideo="defaultVideo"
            @getVideoList="getVideoList"
            :limit="9"
          ></uploadVideo>
        </FormItem>
        <FormItem label class="submit">
          <Button type="primary" @click="save(4)">提交</Button>
          <Button class="ml20" type="primary" @click="save(3)" v-if="!params.id" >存草稿</Button>
          <Button class="ml20 btn-cancel" @click="$router.go(-1)">返回</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import activityDesc from '@views/pages/activity/activity-management/activity-detail.vue'
import uploadImg from '@components/upload/upload-image2.vue'
import uploadVideo from '@components/upload/upload-video2.vue'
import { getActivityDetial, resultSave, resultView } from '@service/activity'
import OrdinaryActivityDetail from "@views/pages/activity/activity-management/ordinary-detail.vue";
interface imgType {
  id: number
  url: string
  name?: string
}

interface videoType {
  id: number
  imgUrl: string
  url: string
  name?: string
}
@Component({
  components: {
    activityDesc,
    uploadImg,
    uploadVideo,
    OrdinaryActivityDetail
  }
})
export default class auditPerform extends Vue {
  private params: any = {
    id: '',
    activityId: '',
    status: 4, //4待审核  3 草稿
    joinPeople: 0, //参加人数
    videos: '',
    images: '',
    summary: ''
  }
  //验证
  private ruleValidate: any = {
    joinPeople: [ { required: true, message: '请填写参加人数（1-9999）', trigger: 'change', pattern:/^\d{1,4}$/ } ],
    summary: [{ required: true, message: '请填写成果介绍' }],
    images: [{ required: true, message: '请选择活动图片' }],
    videos: [{ required: true, message: '请选择活动视频' }]
  }
  private defaultImage: Array<imgType> = []
  private defaultVideo: Array<videoType> = []
  //图片
  private getImagesList(list: Array<{ id: number }>) {
    this.params.images = list.map((data: any) => data.url || '').join(',');
    (this.$refs.formData as any).validateField('images')
  }
  //视频
  private getVideoList(list: Array<{ id: number }>) {
    this.params.videoCover = list
      .map((data: any) => data.imgUrl || '')
      .join(',')
    this.params.videos = list.map((data: any) => data.url || '').join(',');
    (this.$refs.formData as any).validateField('videos')
  }

  
  private activityData:any = null
  private getActivityDetial() {
    getActivityDetial({id: this.$route.query.id}).then((res: any) => {
        if (res.code === 0) {
            this.activityData = res.data;
        }
    });
  } 

  save(status: any) {
    (this.$refs.formData as any).validate((valid: any) => {
      if (!valid) {
        this.$Message.error("请将信息填写完整！");
        return;
      }
      this.params.status = status;
      resultSave(this.params).then((res: any) => {
        if (res.code === 0) {
          this.$Message.success('保存成功')
          this.$router.push({
            path: '/res-list'
          })
        }
      })
    })
  }
  //详情
  getDesc() {
    resultView({ id: this.$route.query.rId }).then((res: any) => {
      if (res.code === 0) {
        this.params = Object.assign(this.params, res.data)
        if (res.data.images) {
          this.defaultImage = res.data.images.split(',').map((url: string, i: number) => ({url, id: i}))
        }
        if (res.data.videos) {
          let covers = res.data.videoCover ? res.data.videoCover.split(',') : []
          this.defaultVideo = res.data.videos.split(',').map((url: string, i: number) => ({url, id: i, imgUrl: covers[i]}))
        }
      }
    })
  }
  created() {
    this.params.activityId = this.$route.query.id
    if (this.$route.query.rId) {
      this.getDesc()
    }
    this.getActivityDetial()
  }
}
</script>


<style lang="scss">
.result-submit-page {
  .activity-img {
    .ivu-form-item-content {
      margin-left: 100px!important;
    }
  }
}
</style>
<style lang="scss" scoped>
.activity-img {
  margin-left: -100px;
  width: 300px;
}
.media-item {
  margin-top: -196px;
}
.perform-wrap {
  .control {
    width: 300px;
  }
}
.tips-panel {
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
      content: '';
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
</style>
