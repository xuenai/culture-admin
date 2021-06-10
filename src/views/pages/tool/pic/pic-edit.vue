<template>
  <div class="container">
    <Form :model="params" ref="params" :label-width="80" :rules="ruleValidate">
        <FormItem label="创建者">
            <Select style="width: 200px" v-model="params.orgId">
                <Option v-for="item in createrList" :key="item.id"  :value="item.id">{{item.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="场所类型" prop="placeType">
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
        <FormItem label="所属场所" prop="placeName">
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
        <FormItem label="上传图片" required prop='url'>
            <UploadImg
            :limit="1"
            :defaultImage="imgList"
            @getImagesList="getImagesList"
            :name="true"
            ></UploadImg>
        </FormItem>
        <FormItem label="图片描述">
            <Input
            type="textarea"
            v-model="params.description"
            style="width: 500px;"
            :autosize="{minRows: 5,maxRows: 5}"
            placeholder="请输入图片描述，200字以内"
            :maxlength="200"
            />
        </FormItem>
        <FormItem label="图片标签">
            <tags resourceType="MEDIA" labelType="IMAGE" :orgId='params.orgId' limit="5" :defaultIds="params.tags" @onChange="getTagIds"></tags>
        </FormItem>
        <FormItem label="活动排序">
            <Input
            style="width: 250px"
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
import uninPlace from "@components/uninPlace/uninPlace.vue";
import { PlACE_TYPES} from '@constant/index';
import {getSiteAuditList} from '@service/cloud-manage';
import tags from "@components/tags/tags.vue";
import { AppModule } from "@store/modules/app";
import { createrList } from "@service/content";
import {
    getImgInfo,
    getUserInfo,
    saveImg,
    getResourceByType,
    } from "@service/tool";
@Component({
    components: {
        UploadImg,
        uninPlace,
        tags
    }
})
export default class PicEdit extends Vue {
    private operates = PlACE_TYPES //场所类型
    // 表单
    private params: any = {
        id: '',
        orgId: this.$store.state.app.userInfo.orgId||-1,//创建者ID
        name: '', //图片名称
        recommend: '',//  推荐
        description: '',//  描述
        placeType: '',//场所类型
        placeName: '', // 所属场所
        placeId: '',//场所ID
        sort: '', //排序
        url: '', //背景图
        tags: '', //标签选中
        tagsStr: '', //上传需要用到的tag
    }
    mounted(){
        let id = this.$route.query.id;
        if(id){
             this.params.id = id;
        }
        this.getImgInfo(); // 获取图片信息  
        this.getCreaterList ();//获取创建者列表      
    }
    
    /* S 图片上传 */
    private imgList: Array<Object> = [];
    private getImagesList(item: any) {
        this.imgList = item;
        this.params.url = item[0].url
        this.params.name = item[0].name
    }
    /* E 图片上传 */


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

    /* S 标签选中值变化 */
    private getTagIds(ids:string){
        this.params.tagsStr = ids
    }
    /* E 标签选中值变化 */

    /* S 获取详情信息 */
    private getImgInfo() {
        getImgInfo({
            id: this.params.id
        }).then(data => {
            if(data.code === 0){
                this.params = data.data.res;
                this.params.recommend = data.data.res.recommend.toString();
                // 图片默认选中
                if(this.params.url){
                    this.imgList = [
                        {
                            name: this.params.name,
                            url: this.params.url
                        }
                    ]
                }
            }
        });
    }
    /* E 获取详情信息*/
  
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

    /* S 表单验证 */
    private ruleValidate = {
        url: [{ required: true, message: "请上传图片"}]
    }
    /* E 表单验证 */

    /* S 提交验证 */
    private checkMsg(){
        (this.$refs.params as any).validate((valid: any) => {
            if (valid) {
                saveImg({ 
                    id: this.params.id,
                    orgId: this.params.orgId,//用户ID
                    placeId: this.params.placeId, //场所ID
                    placeName: this.params.placeName, //场所名称
                    placeType: this.params.placeType, //场所类型
                    recommend: this.params.recommend, //是否推荐
                    sort: this.params.sort, //排序
                    tags: this.params.tagsStr, //标签
                    description: this.params.description, //图片描述
                    url:  this.params.url, //图片地址
                    name: this.params.name, //图片名称
                 }).then(data => {
                    if(data.code === 0){
                        this.$Message.success("修改成功");
                        this.goback();
                    }
                })
            } else {
                this.$Message.error("请完善信息");
            }
        });
    }
    /* E 提交验证 */

    /* S 返回列表页面 */
    private goback () {
        this.$router.go(-1)
    }
    /* E 返回列表页面 */
    
}
</script>

<style lang='scss' scoped>
.container{
    padding: 15px 0;
    .ivu-form-item{
        margin-bottom: 20px;
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
