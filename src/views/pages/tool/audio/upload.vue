<!--
 * @Author: 孙小倩
 * @since: 2019-06-05 19:27:45
 * @LastAuthor: 任智勇
 * @lastTime: 2019-06-20 10:00:12
 -->
<template>
  <div>
    <Form :model="data" :label-width="80" >
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
            <span class="ml20 theme-blue" @click="showPlaceDialog">请选择所属场所</span>
        </FormItem>
        <FormItem label="上传音频" required>
            <UploadAudio :limit="1" :defaultAudio="audioList" @getAudioList="getAudioList" :name="true"></UploadAudio>
        </FormItem>
        <FormItem label="封面图">
            <UploadImg :limit="1" @getImagesList="getImagesList"></UploadImg>
        </FormItem>
        <FormItem label="音频描述">
            <Input
            type="textarea"
            style="width: 500px;"
            v-model="data.description"
            :autosize="{minRows: 5,maxRows: 5}"
            placeholder="请输入音频描述，200字以内"
            :maxlength="200"
            />
        </FormItem>
        <FormItem label="音频时长">
            <Input
            style="width: 250px;"
            v-model="data.duration"
            disabled
            />
        </FormItem>
        <FormItem label="音频网址">
            <Input
            style="width: 250px;"
            v-model="data.website"
            placeholder="请输入链接地址"
            :maxlength="50"
            />
        </FormItem>
        <FormItem label="音频标签">
            <tags resourceType="MEDIA" labelType="AUDIO" :orgId='data.orgId' limit="5" @onChange="getTagIds"></tags>
        </FormItem>
        <FormItem label="活动排序">
            <Input
            style="width: 250px"
            v-model="data.sort"
            :maxlength="10"
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
import UploadAudio from "@components/upload/upload-audio.vue";
import BaseTable from "@components/baseTable/baseTable.vue";
import tags from "@components/tags/tags.vue";
import {PlACE_TYPES} from '@constant/index';
import uninPlace from "@components/uninPlace/uninPlace.vue";
import { saveVoice } from "@service/tool";
import { AppModule } from "@store/modules/app";
import { createrList } from "@service/content";
@Component({
    components: {
        UploadAudio,
        UploadImg,
        BaseTable,
        tags,
        uninPlace
    }
})
export default class AudioUpload extends Vue {
    // 权限列表
    get operates() {
        return AppModule.operates;
    }
    private placeTypes = PlACE_TYPES //场所类型
    mounted() {
        this.getCreaterList();// 获取创建者列表
    }
    /* 表单 */
    private data: any = {
        orgId: this.$store.state.app.userInfo.orgId||-1,//创建者ID
        imgUrl: '',//封面图
        recommend: "", // 推荐
        placeName: '', // 所属场所
        sort: '', // 排序
        placeType: "", //场所类型
        description: '', //图片描述
        placeId: '',//场所ID
        tagsStr: '', //上传需要用到的tag
        duration: '',//视频时长
    }
    
    /* S 上传音频 */
    private audioList: Array<Object> = [];
    private getAudioList(e: any) {
        this.audioList = e;
        this.data.url = e[0].url
        this.data.name = e[0].name
        this.data.duration = e[0].duration[0]
        console.log(e)
    }
    /* E 上传音频 */

    /* S 上传图片 */
    private getImagesList(item: any) {
        this.data.imgUrl = item[0]
    }
    /* E 上传图片 */

    /* S 标签选中值变化 */
    private getTagIds(ids:string){
        this.data.tagsStr = ids
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
        this.data.placeName = list[0].name
        this.data.placeType = list[0].resourceType
        this.data.placeId = list[0].id
    }
    private setPlaceName(item: any){
        this.data.placeName = '';
    }
    /* E 关联场所 */
    
    /* S 获取创建者 */
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
        if (this.audioList && this.audioList.length >= 1) {
            saveVoice({ 
                orgId: this.data.orgId, // 用户ID
                url: (this.audioList as any)[0].url, // 音频地址
                placeType: this.data.placeType, // 场所类型
                recommend: this.data.recommend, // 是否推荐
                sort: this.data.sort, // 排序值
                description: this.data.description, // 音频描述
                name: (this.audioList as any)[0].name, // 音频名称
                placeName: this.data.placeName, // 场所名称
                placeId: this.data.placeId, // 场所ID
                imgUrl: this.data.imgUrl, // 封面图
                duration: this.data.duration, // 音频时长
                website: this.data.website, // 音频网址
                tags: this.data.tagsStr // 标签
            }).then(data => {
                if(data.code === 0){
                    this.$Message.success("操作成功");
                    this.goback();
                }
            })
        } else {
            this.$Message.error("请上传音频");
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

</style>
