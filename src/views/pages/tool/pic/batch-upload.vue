<template>
  <div>
    <Form :label-width="80">
        <FormItem label="创建者">
            <Select style="width: 200px" v-model="orgId">
            <Option v-for="item in createrList" :key="item.id" :value="item.id">{{item.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="上传图片" required>
            <UploadImg3 @getMediaList="getMediaList" :limit="100" :sourceType="0"></UploadImg3>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit" v-if="operates.includes('save')">添加</Button>
            <Button class="ml20" @click="goback">取消</Button>
        </FormItem>
    </form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue , Watch} from 'vue-property-decorator'
import UploadImg3 from "@components/upload/upload-image5.vue";
import { saveImgs } from "@service/tool";
import { PlACE_TYPES} from '@constant/index';
import { AppModule } from "@store/modules/app";
import { createrList } from "@service/content";
interface imgType {
    id: number,
    url: string,
    name?: string,
    tags?:string,
    description?:string,
    placeId?:number,
    placeType?:string,
    placeObj?:any,
    placeName?:string
};
@Component({
    components: {
        UploadImg3
    }
})

export default class BatchUpload extends Vue {
    // 权限列表
    get operates() {
        return AppModule.operates;
    }

    /* S 获取创建者 */
    // 创建者ID
    private orgId:any = this.$store.state.app.userInfo.orgId||-1;
    private createrList: object[] = [];
    private getCreaterList () {
        createrList().then((res: any) => {
            if (res.code === 0) {
                this.createrList = res.datas
            }
        })
    }
    /* E 获取创建者 */

    /* S 选择图片 */
    private imgList?: Array<any>;
    private getMediaList(list: Array<any>) {
        this.imgList = list;
    }
    /* E 选择图片 */

    /* S 提交 */
    private handleSubmit () {
        // (this.$refs.data as any).validate((valid: any) => {
        if (this.imgList && this.imgList.length) {
            let list = (this.imgList as any).map((img: imgType) => ({
                url: img.url,
                name: img.name,
                description: img.description,
                tags: img.tags,
                placeId: (img.placeObj?img.placeObj.id: ''),
                placeType: (img.placeObj?img.placeObj.resourceType: ''),
                placeName: (img.placeObj?img.placeObj.name: ''),
                orgId: this.orgId
            }));
            // let unpass = list.some((item: any) => (!item.placeType && !item.placeName));
            // if (unpass) {
            //     this.$Message.error("请选择所属场所");                    
            //     return;
            // }
            saveImgs({jsonDto: JSON.stringify(list)}).then(res => {
                if(res.code === 0){
                    this.$Message.success("保存成功");
                    this.goback();
                }
            })
        }else{
            this.$Message.error("请上传图片");
        }
        // });
    }
    /* E 提交 */   

    mounted() {
        this.getCreaterList();// 获取创建者列表
    }
    // 返回
    private goback () {
        this.$router.go(-1)
    }
}

</script>

<style lang='scss' scoped>
.ivu-form-item{
    margin-bottom: 20px;
}
</style>
