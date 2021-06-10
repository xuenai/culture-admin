<template>
  <div class="container">
    <Form :model="params" ref="params" :label-width="80" :rules="ruleValidate">
        <FormItem label="创建者">
            <Select style="width: 200px" v-model="params.orgId">
                <Option v-for="item in createrList" :key="item.id" :value="item.id">{{item.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="场所类型">
            <Select
            style="width: 200px"
            v-model="params.placeType"
            @on-change="setPlaceName"
            >
                <Option
                    v-for="operate in operates"
                    :key="operate.value"
                    :value="operate.value"
                >{{operate.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="所属场所">
            <uninPlace
            :show="place"
            @onOkClick="onOkClick"
            @onClose="place=false"
            :placeType="params.placeType"
            :disabled='uninPlaceFlag'
            :isRadio="true"
            ></uninPlace>
            <Input
            style="width: 200px;"
            disabled
            placeholder="请选择所属场所"
            v-model="params.placeName"
            />
            <span class="ml20 theme-blue" @click="showPlaceDialog">请选择所属场所</span>
        </FormItem>
        <FormItem label="上传视频" prop="url">
            <uploadVideo :limit="1" @getVideoList="getVideoList" :name="true" :defaultVideo="videoList" :cover="[params.videoCover]"></uploadVideo>
        </FormItem>
        <FormItem label="封面图">
            <uploadImg :limit="1" @getImagesList="getImagesList" :defaultImage="params.imgUrl"></uploadImg>
        </FormItem>
        <FormItem label="视频描述">
            <Input
            type="textarea"
            style="width: 500px;"
            :autosize="{minRows: 5,maxRows: 5}"
            placeholder="请输入视频描述，200字以内"
            v-model="params.description"
            :maxlength="200"
            />
        </FormItem>
        <FormItem label="视频时长">
            <Input
            style="width: 200px;"
            v-model="params.duration"
            :maxlength="10"
            disabled
            />
        </FormItem>
        <FormItem label="视频网址">
            <Input
            style="width: 200px;"
            v-model="params.website"
            placeholder="请输入链接网址"
            :maxlength="50"
            />
        </FormItem>
        <FormItem label="视频标签">
            <tags resourceType="MEDIA" limit="5" labelType="VIDEO" :orgId='params.orgId' :defaultIds="params.tags" @onChange="getTagIds"></tags>
        </FormItem>
        <FormItem label="视频排序">
            <Input style="width: 350px" placeholder="9999" v-model="params.sort" :maxlength="20" />
        </FormItem>
        <FormItem label="推荐">
            <RadioGroup v-model="params.recommend">
                <Radio label="1">推荐</Radio>
                <Radio class="ml20" label="0">不推荐</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="checkMsg()">完成</Button>
            <Button class="ml20" @click="goback">取消</Button>
        </FormItem>
    </form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue , Watch } from 'vue-property-decorator';
import UploadImg from "@components/upload/upload-image.vue";
import UploadVideo from "@components/upload/upload-video.vue";
import { PlACE_TYPES } from '@constant/index';
import { getSiteAuditList } from '@service/cloud-manage';
import uninPlace from "@components/uninPlace/uninPlace.vue";
import tags from "@components/tags/tags.vue";
import { AppModule } from "@store/modules/app";
import { createrList } from "@service/content";
import {
    getVideoInfo,
    getUserInfo,
    saveVideo,
    } from "@service/tool";
@Component({
    components: {
        UploadImg,
        UploadVideo,
        uninPlace,
        tags
    }
})
export default class VideoEdit extends Vue {
    private operates = PlACE_TYPES ; // 场所类型

    // 表单
    private params: any = {
        id: '',//ID
        orgId: this.$store.state.app.userInfo.orgId||-1, // 创建者ID
        name: '', // 视频名称
        recommend: '', // 推荐
        placeType: '', // 场所类型
        placeName: '',  // 所属场所
        placeId: '', // 场所ID
        contact: '', // 创建者选中
        sort: '', // 排序
        url: '', // 视频地址
        tags: '', // 标签选中
        tagsStr: '', // 上传需要用到的tag
        duration:'', // 视频时长
        imgUrl:'', // 封面图
        website:'', // 视频网址
        videoCover: '' // 视频封面图
    }
    mounted(){
        let id = this.$route.query.id;
        if(id){
             this.params.id = id;
        }
        this.getVideoInfo(); // 获取视频详情
        this.getCreaterList(); // 获取创建者列表
    }

    /* S 上传视频 */
    private videoList: Array<Object> = [];
    private getVideoList(data: any) {
        this.videoList = data.videoList;
        this.params.url = data.videoList[0].url;
        this.params.name = data.videoList[0].name;
        this.params.duration = data.videoList[0].duration;
        this.params.videoCover = data.videoCover[data.videoCover.length-1];
    }
    /* E 上传视频 */

    /* S 上传封面图 */
    private getImagesList(imgPath: any) {
        this.params.imgUrl = imgPath.join(",");
    }
    /* E 上传封面图 */

    /* S 关联场所 */
    private place = false;
    private uninPlaceFlag:boolean = false;
    private showPlaceDialog(){
        if(!this.params.placeType){
        this.uninPlaceFlag = false;
        }else{
        this.uninPlaceFlag = true;
        }
        this.place = true;
    }
    private onOkClick(list:any){
        this.params.placeType = list[0].resourceType;
        this.params.placeName = list[0].name;
        this.params.placeId = list[0].id;
    }
    private setPlaceName(item: any){
        this.params.placeName = '';
    }
    /* E 关联场所 */

    /* S 获取详情信息 */
    private getVideoInfo() {
        getVideoInfo({
            id: this.params.id
        }).then(data => {
            if(data.code === 0){
                this.params = data.data.res;
                this.params.videoCover = this.params.imgUrl;
                this.params.recommend = data.data.res.recommend.toString();
                // 视频默认选中
                if(this.params.url){
                    this.videoList = [
                        {
                            name: this.params.name,
                            url: this.params.url
                        }
                    ]
                }
            }
        });
    }
    /* E 获取详情信息 */

    /* S 获取创建者*/
    private createrList: object[] = [];
    private getCreaterList () {
        createrList().then((res: any) => {
            if (res.code === 0) {
                this.createrList = res.datas;
            }
        })
    }
    /* E 获取创建者 */

    /* S 提交验证 */
    private checkMsg(){
        (this.$refs.params as any).validate((valid: any) => {
            if (valid && this.params.url ) {
                saveVideo({
                    id: this.params.id,
                    orgId: this.params.orgId, // 用户ID
                    placeId: this.params.placeId, // 场所ID
                    placeName: this.params.placeName, // 场所名称
                    placeType: this.params.placeType, // 场所类型
                    recommend: this.params.recommend, // 是否推荐
                    sort: this.params.sort, // 排序
                    tags: this.params.tagsStr, // 标签
                    description: this.params.description, // 图片描述
                    website: this.params.website, // 视频网址
                    duration: this.params.duration, // 视频时长
                    imgUrl: this.params.imgUrl, // 封面图
                    url: (this.videoList[0] as any).url, // 视频地址
                    name: (this.videoList[0] as any).name // 视频名称
                 }).then(data => {
                    if(data.code === 0){
                        this.$Message.success("修改成功");
                        this.goback();
                    }
                })
            } else {
                this.$Message.error("请完善信息");
            }
        })
    }
    /* E 提交验证 */

    // 表单验证
    private ruleValidate = {
        url: [{ required: true, message: "请上传视频"}]
    }

    // 标签选中值变化
    private getTagIds(ids:string){
        this.params.tagsStr = ids
    }

    // 返回上级页面
    private goback () {
        this.$router.go(-1)
    }
}
</script>

<style lang='scss' scoped>
.container{
    padding: 15px;
    .ivu-form-item{
    margin-bottom: 20px;
    }
    .info-list{
        margin: 15px 0;
        height: 65px;
        overflow: hidden;
        img{
            height: 100%;
            min-width: 100%;
        }
    }
    .btn-group{
        width: 100%;
        text-align: right;
    }
    .theme-blue{
        cursor: pointer;
    }
}

</style>
