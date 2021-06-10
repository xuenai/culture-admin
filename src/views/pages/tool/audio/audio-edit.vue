<template>
  <div class="content">
    <Form :model="params" :label-width="80">
        <FormItem label="创建者">
            <Select style="width: 200px" v-model="params.orgId">
                <Option
                v-for="item in createrList" :key="item.id" 
                :value="item.id"
                >{{item.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="场所类型">
            <Select
            style="width: 200px"
            v-model="params.placeType"
            @on-change="setPlaceName"
            >
                <Option
                    v-for="operate in placeTypes"
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
        <FormItem label="上传音频" required>
            <UploadAudio :limit="1" :defaultAudio="audioList" @getAudioList="getAudioList" :name="true"></UploadAudio>
        </FormItem>
        <FormItem label="封面图">
            <!-- <UploadImg :limit="1" :defaultImage="imgList" @getImagesList="getImagesList" :name="true"></UploadImg> -->
            <uploadImg :limit="1" @getImagesList="getImagesList" :defaultImage="params.imgUrl"></uploadImg>
        </FormItem>
        <FormItem label="音频描述">
            <Input
            type="textarea"
            style="width: 500px;"
            :autosize="{minRows: 5,maxRows: 5}"
            placeholder="请输入音频描述，200字以内"
            v-model="params.description"
            :maxlength="200"
            />
        </FormItem>
        <FormItem label="音频时长">
            <Input
            style="width: 200px;"
            v-model="params.duration"
            disabled
            :maxlength="10"
            />
        </FormItem>
        <FormItem label="音频网址">
            <Input
            style="width: 200px;"
            v-model="params.website"
            placeholder="请输入链接网址"
            :maxlength="50"
            />
        </FormItem>
        <FormItem label="音频标签">
            <tags resourceType="MEDIA" labelType="AUDIO" :orgId='params.orgId' limit="5" :defaultIds="params.tags" @onChange="getTagIds"></tags>
        </FormItem>
        <FormItem label="活动排序">
            <Input
            style="width: 350px"
            v-model="params.sort"
            :maxlength="10"
            />
        </FormItem>
        <FormItem label="推荐">
            <RadioGroup v-model="params.recommend">
                <Radio label="0"><span>推荐</span></Radio>
                <Radio class="ml20" label="1"><span>不推荐</span></Radio>
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
import { Component, Vue } from 'vue-property-decorator';
import UploadImg from "@components/upload/upload-image.vue";
import UploadAudio from "@components/upload/upload-audio.vue";
import uninPlace from "@components/uninPlace/uninPlace.vue";
import { PlACE_TYPES} from '@constant/index';
import { getVoiceInfo , getUserInfo , saveVoice , getResourceByType } from "@service/tool";
import { getSiteAuditList } from '@service/cloud-manage';
import tags from "@components/tags/tags.vue";
import { AppModule } from "@store/modules/app";
import { createrList } from "@service/content";
@Component({
    components: {
        UploadImg,
        UploadAudio,
        uninPlace,
        tags
    }
})
export default class AudioList extends Vue {
    private placeTypes = PlACE_TYPES //场所类型
    //表单
    private params: any = {
        id: '',
        orgId: this.$store.state.app.userInfo.orgId||-1,//创建者ID
        recommend: '',//推荐
        placeType: '', //场所类型
        placeName: '', // 所属场所
        placeId: '',//场所ID
        tags: '',//标签选中
        sort: '', //排序
        tagsStr: '', //上传需要用到的tag
        duration:'',//音频时长
        imgUrl:'',//封面图
        website:'',//音频网址
    }
    mounted(){
        let id = this.$route.query.id;
        if(id){
            this.params.id = id;
        }
        this.getVoiceInfo() // 获取音频详情
        this.getCreaterList ();//获取创建者列表
    }
    
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
        this.params.placeName = list[0].name
        this.params.placeType = list[0].resourceType
        this.params.placeId = list[0].id
    }
    private setPlaceName(item: any){
        this.params.placeName = '';
    }
    /* E 关联场所 */

    /* S 上传音频 */
    private audioList: Array<Object> = [];
    private getAudioList(e: any) {
        this.audioList = e;
        console.log(e,999)
        if(e.length<=1){
            this.params.duration = e[0].duration[0];
        }
    }
    /* E 上传音频 */

    /* S 上传图片 */
    private getImagesList(item: any) {
        this.params.imgUrl = item.join(",");
    }
    /* E 上传图片 */

    /* S 标签选中值变化 */
    private getTagIds(ids:string){
        this.params.tagsStr = ids
    }
    /* E 标签选中值变化 */

    /* S 获取详情信息 */
    private getVoiceInfo() {
        getVoiceInfo({
            id: this.params.id
        }).then(data => {
            if(data.code === 0){
                this.params = data.data.res;
                this.params.recommend = data.data.res.recommend.toString();
                this.audioList = [
                    {
                        name: (data.data.res as any).name,
                        url: (data.data.res as any).url
                    }
                ]
            }
        });
    }
    /* E 获取详情信息 */

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
    private checkMsg(){
        if (this.audioList && this.audioList.length >= 1) {
            saveVoice({ 
                id: this.params.id,
                orgId: this.params.orgId,//用户ID
                placeId: this.params.placeId, //场所ID
                placeName: this.params.placeName, //场所名称
                placeType: this.params.placeType, //场所类型
                recommend: this.params.recommend, //是否推荐
                sort: this.params.sort, //排序
                tags: this.params.tagsStr, //标签
                description: this.params.description, //音频描述
                website: this.params.website, //音频网址
                duration: this.params.duration, //音频时长
                imgUrl: this.params.imgUrl,//封面图
                url: (this.audioList as any)[0].url, //音频地址
                name: (this.audioList as any)[0].name, //音频名称
                }).then(data => {
                if(data.code === 0){
                    this.$Message.success("修改成功");
                    this.goback();
                }
            })
        } else {
            this.$Message.error("请上传音频");
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
.content{
    padding: 15px 0;
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
