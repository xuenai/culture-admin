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
        <FormItem label="上传视频" required>
            <UploadVideo :limit="1"
            :defaultVideo="videoList"
            @getVideoList="getVideoList"
            :name="true"
            ></UploadVideo>
        </FormItem>
        <FormItem label="封面图">
            <UploadImg
            :limit="1"
            @getImagesList="getImagesList"
            ></UploadImg>
        </FormItem>
        <FormItem label="视频描述">
            <Input
            type="textarea"
            style="width: 500px;"
            v-model="data.description"
            :autosize="{minRows: 5,maxRows: 5}"
            placeholder="请输入视频描述，200字以内"
            :maxlength="200"
            />
        </FormItem>
        <FormItem label="视频时长">
            <Input
            style="width: 250px;"
            v-model="data.duration"
            disabled
            :maxlength="10"
            />
        </FormItem>
        <FormItem label="视频网址">
            <Input
            style="width: 250px;"
            v-model="data.website"
            placeholder="请输入链接地址"
            :maxlength="50"
            />
        </FormItem>
        <FormItem label="视频标签">
            <tags resourceType="MEDIA"
            labelType="VIDEO"
            :orgId='data.orgId'
            limit="5"
            @onChange="getTagIds"
            ></tags>
        </FormItem>
        <FormItem label="视频排序" prop="sort">
            <Input
            style="width: 250px"
            v-model="data.sort"
            :maxlength="10"
            placeholder="9999"
            />
        </FormItem>
        <FormItem label="推荐">
            <RadioGroup v-model="data.recommend">
                <Radio label="1"><span>推荐</span></Radio>
                <Radio class="ml20" label="0"><span>不推荐</span></Radio>
            </RadioGroup>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="checkMsg" v-if="operates.includes('save')">添加</Button>
            <Button class="ml20" @click="goback">取消</Button>
        </FormItem>
    </form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import UploadImg from "@components/upload/upload-image.vue";
import UploadVideo from "@components/upload/upload-video.vue";
import BaseTable from "@components/baseTable/baseTable.vue";
import { PlACE_TYPES } from '@constant/index';
import {getSiteAuditList} from '@service/cloud-manage';
import uninPlace from "@components/uninPlace/uninPlace.vue";
import tags from "@components/tags/tags.vue";
import { saveVideo } from "@service/tool";
import { AppModule } from "@store/modules/app";
import { createrList } from "@service/content";
@Component({
    components: {
        UploadVideo,
        BaseTable,
        uninPlace,
        UploadImg,
        tags
    }
})
export default class VideoUpload extends Vue {
    // 权限列表
    get operates() {
        return AppModule.operates;
    }
    private placeTypes = PlACE_TYPES; // 场所类型

    // 表单
    private data: any = {
        orgId: this.$store.state.app.userInfo.orgId||-1, // 创建者ID
        recommend: "", // 推荐
        placeName: '', // 所属场所
        sort: '', // 排序
        placeType: "", // 场所类型选中
        placeId:'', // 场所ID
        imgUrl: '', // 封面图
        description: '', // 图片描述
        tag: '', // 标签选中
        tagsStr: '', // 上传需要用到的tag
        duration: '' // 视频时长
    }

    /* S 上传视频 */
    private videoList: Array<Object> = [];
    private videoCover: Array<Object> = [];
    private getVideoList(e: any) {
        this.videoList = e.videoList;
        this.videoCover = e.videoCover;
        this.data.duration = (e.videoList as any)[0].duration;
    }
    /* E 上传视频 */

    /* S 上传封面图 */
    private getImagesList(item: any) {
        this.data.imgUrl = item[0];
    }
    /* E 上传封面图 */

    /* S 标签选中值变化 */
    private getTagIds(ids:string){
        this.data.tagsStr = ids;
    }
    /* E 标签选中值变化 */

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
        this.data.placeType = (list as any)[0].resourceType;
        this.data.placeName = (list as any)[0].name;
        this.data.placeId = (list as any)[0].id;
    }
    private setPlaceName(item: any){
        this.data.placeName = '';
    }
    /* E 关联场所 */

    mounted() {
        this.getCreaterList(); // 获取创建者列表
    }
    /* S 创建者 */
    private createrList: object[] = [];
    private getCreaterList () {
        createrList().then((res: any) => {
            if (res.code === 0) {
                this.createrList = res.datas
            }
        })
    }
    /* E 创建者 */

    /* S 提交验证 */
    private checkMsg(){
        if (this.videoList && (this.videoList as any).length >= 1) {
            saveVideo({
                orgId: this.data.orgId, // 用户ID
                url: (this.videoList as any)[0].url, // 视频地址
                placeType: this.data.placeType, // 场所类型
                recommend: this.data.recommend, // 是否推荐
                sort: this.data.sort, // 排序值
                tags: this.data.tagsStr, // 标签
                description: this.data.description, // 视频描述
                name: (this.videoList as any)[0].name, // 视频名称
                placeName: this.data.placeName, // 场所名称
                placeId: this.data.placeId, // 场所ID
                imgUrl: this.data.imgUrl || this.videoCover[0], // 封面图
                duration: this.data.duration, // 视频时长
                website: this.data.website, // 视频网址
            }).then(data => {
                if(data.code === 0){
                    this.$Message.success("操作成功");
                    this.goback();
                }
            })
        } else {
            this.$Message.error("请上传视频");
        }
    }
    /* E 提交验证 */

    /* S 返回列表页面 */
    private goback () {
        this.$router.go(-1)
    }
    /* E 返回列表页面*/
}
</script>

<style lang='scss' scoped>
.ivu-form-item{
    margin-bottom: 20px;
    .tags-box{
        position: relative;
        &:hover{
            .icon{
                display: block;
            }
        }
        .icon{
            position: absolute;
            right: 7px;
            top: -10px;
            font-size: 24px;
            cursor: pointer;
            display: none;
            &:hover {
                color: $theme;
            }
        }
    }
    .active{
        .choice-tag{
            color: #5ac858;
            border-color: #5ac858;
        }
    }
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
.pointer{
    cursor: pointer;
}

</style>
