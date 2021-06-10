<template>
  <div>
    <Form :label-width="80">
      <FormItem label="创建者">
        <Select style="width: 200px" v-model="orgId">
          <Option v-for="item in createrList" :key="item.id" :value="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="上传音频" required>
        <UploadVideo5 @getMediaList="getMediaList" :sourceType="2" :limit="10"></UploadVideo5>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit" v-if="operates.includes('save')">添加</Button>
        <Button class="ml20" @click="goback">取消</Button>
      </FormItem>
    </form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import UploadVideo5 from "@components/upload/upload-image5.vue";
import { saveVoices } from "@service/tool";
import { AppModule } from "@store/modules/app";
import { createrList } from "@service/content";
interface videoType {
  id: number;
  url: string;
  name?: string;
  tags?: string;
  description?: string;
  placeId?: number;
  placeType?: string;
  placeObj?: any;
  placeName?: string;
  duration?: number;
  imgUrl?: string;
}
@Component({
  components: {
    UploadVideo5
  }
})
export default class UploadBatch extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }

  /* S 获取创建者 */
  // 创建者ID
  private orgId: any = this.$store.state.app.userInfo.orgId || -1;
  private createrList: object[] = [];
  private getCreaterList() {
    createrList().then((res: any) => {
      if (res.code === 0) {
        this.createrList = res.datas;
      }
    });
  }
  /* E 获取创建者 */
  // 创建者ID

  // 回显视频数据
  private defaultVideo: Array<any> = [];
  /* S 选择图片 */
  private videoList?: Array<any>;
  private getMediaList(list: Array<any>) {
    this.videoList = list;
  }
  /* E 选择图片 */

  /* S 提交 */
  private handleSubmit() {
    // (this.$refs.data as any).validate((valid: any) => {
    if (this.videoList && this.videoList.length >= 1) {
      let list = (this.videoList as any).map((video: videoType) => ({
        url: video.url,
        name: video.name,
        description: video.description,
        tags: video.tags,
        placeId: video.placeObj ? video.placeObj.id : "",
        placeType: video.placeObj ? video.placeObj.resourceType : "",
        placeName: video.placeObj ? video.placeObj.name : "",
        orgId: this.orgId,
        duration: video.duration,
        imgUrl: video.imgUrl
      }));
      // let unpass = list.some((item: any) => (!item.placeType && !item.placeName));
      // if (unpass) {
      //     this.$Message.error("请选择所属场所");
      //     return;
      // }
      saveVoices({ jsonDto: JSON.stringify(list) }).then(res => {
        if (res.code === 0) {
          this.$Message.success("保存成功");
          this.goback();
        }
      });
    } else {
      this.$Message.error("请上传音频");
    }
    // });
    // if (this.videoList) {
    //     let list = this.videoList.map((video: videoType) => ({
    //         url: video.url,
    //         name: video.name,
    //         imgUrl: video.imgUrl,
    //         placeId: video.placeId,
    //         description: video.description,
    //         tags: video.tags
    //     }))
    //     saveVoices({jsonDto: JSON.stringify(list)}).then(res => {
    //        if(res.code === 0){
    //             this.$Message.success("保存成功！");
    //             this.goback();
    //         }
    //     })
    // }
  }
  /* E 提交 */

  mounted() {
    this.getCreaterList(); // 获取创建者列表
  }
  // 返回
  private goback() {
    this.$router.go(-1);
  }
}
</script>

<style lang='scss' scoped>
.ivu-form-item {
  margin-bottom: 20px;
}
</style>
