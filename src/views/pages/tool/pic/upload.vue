<template>
  <div>
    <Form :model="data" :label-width="80">
      <FormItem label="创建者">
        <Select style="width: 200px" v-model="data.orgId">
          <Option v-for="item in createrList" :key="item.id" :value="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="场所类型">
        <Select
        style="width: 200px"
        v-model="data.placeType"
        @on-change="setPlaceName"
        >
          <Option
              v-for="item in placeTypes"
              :key="item.value"
              :value="item.value"
          >{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="所属场所">
        <uninPlace
        :show="place"
        @onOkClick="onOkClick"
        @onClose="place=false"
        :placeType="data.placeType"
        :disabled='uninPlaceFlag'
        :isRadio="true"
        ></uninPlace>
        <Input
          style="width: 200px;"
          disabled
          placeholder="请选择所属场所"
          v-model="data.placeName"
          />
        <span class="ml20 theme-blue pointer" @click="showPlaceDialog">请选择所属场所</span>
      </FormItem>
      <FormItem label="上传图片" required>
        <UploadImg :limit="1" :defaultImage="imgList" @getImagesList="getImagesList" :name="true"></UploadImg>
      </FormItem>
      <FormItem label="图片描述">
        <Input
          type="textarea"
          style="width: 500px;"
          v-model="data.description"
          :autosize="{minRows: 5,maxRows: 5}"
          placeholder="请输入图片描述，200字以内"
          :maxlength="200"
        />
      </FormItem>
      <FormItem label="图片标签">
        <tags resourceType="MEDIA" limit="5" labelType="IMAGE" :orgId='data.orgId' @onChange="getTagIds"></tags>
      </FormItem>
      <FormItem label="活动排序">
        <Input style="width: 250px" v-model="data.sort" :maxlength="10"/>
      </FormItem>
      <FormItem label="推荐">
        <RadioGroup v-model="data.recommended">
          <Radio label="0">推荐</Radio>
          <Radio class="ml20" label="1">不推荐</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="checkMsg" v-if="operates.includes('save')">添加</Button>
        <Button class="ml20" @click="goback">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import UploadImg from "@components/upload/upload-image.vue";
import uninPlace from "@components/uninPlace/uninPlace.vue";
import BaseTable from "@components/baseTable/baseTable.vue";
import tags from "@components/tags/tags.vue";
import { saveImg } from "@service/tool";
import { PlACE_TYPES} from '@constant/index';
import { AppModule } from "@store/modules/app";
import { createrList } from "@service/content";
@Component({
  components: {
    UploadImg,
    BaseTable,
    uninPlace,
    tags
  }
})
export default class OicUpload extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  private placeTypes = PlACE_TYPES; // 场所类型

  // 图片上传
  private imgList: Array<Object> = [];
  private getImagesList(item: any) {
    this.imgList = item;
  }

  // 用户信息
  get userInfo(){
    return AppModule.userInfo;
  }

  // 标签选中值变化
  private getTagIds(ids:string){
      this.data.tagsStr = ids
  }

  // 表单
  private data: any = {
    orgId: this.$store.state.app.userInfo.orgId||-1,//创建者ID
    recommended: "", // 推荐
    placeType: "", //场所类型选中
    placeName: "", // 所属场所
    sort: "", // 排序
    placeId:'',//场所ID
    description: "", //图片描述
    tag: "", //标签选中
    tagsStr: "" //上传需要用到的tag
  };
  mounted(){
      this.getCreaterList ();
  }
  
  /* S 关联场所 */
  private place = false;
  private uninPlaceFlag:boolean = false;
  private showPlaceDialog(){
    if(!this.data.placeType){
      this.uninPlaceFlag = false;
    }else{
      this.uninPlaceFlag = true;
    }
    this.place = true;
  }
  private onOkClick(list:any){
    this.data.placeName = list[0].name;
    this.data.placeId = list[0].id;
    this.data.placeType = list[0].resourceType;
  }
  // 每次选择场所类型的时候初始化所属场所
  private setPlaceName(item: any){
      this.data.placeName = '';
  }
  /* E 关联场所 */

  /* S 获取创建者 */
  private createrList: object[] = [];
  private getCreaterList () {
      createrList().then((res: any) => {
          if (res.code === 0) {
              this.createrList = res.datas
          }
      })
  }
  /* E 获取创建者 */

  /* S 提交验证 */
  private checkMsg() {
    if(this.imgList && this.imgList.length >= 1){
      saveImg({
        orgId: this.data.orgId,//用户ID
        url:  (this.imgList as any)[0].url,
        placeType: this.data.placeType,
        recommend: this.data.recommended,
        sort: this.data.sort,
        tags: this.data.tagsStr,
        description: this.data.description,
        name: (this.imgList as any)[0].name,
        placeName: this.data.placeName,
        placeId: this.data.placeId
      }).then(data => {
        if (data.code === 0) {
          this.$Message.success("操作成功");
          this.goback();
        }
      });
    }else{
      this.$Message.error("请上传图片");
    }
  }
  /* E 提交验证 */

  /* S 返回上级页面 */
  private goback () {
    this.$router.go(-1)
  }
  /* E 返回上级页面*/
}
</script>

<style lang='scss' scoped>
.ivu-form-item {
  margin-bottom: 20px;
}
.info-list {
  margin: 15px 0;
  height: 65px;
  overflow: hidden;
  img {
    height: 100%;
    min-width: 100%;
  }
}
.btn-group {
  width: 100%;
  text-align: right;
}
.pointer{
  cursor: pointer;
}
</style>
