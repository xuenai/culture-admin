<template>
    <div class="basic-container tab-container pd20">
        <Head></Head>
        <Form ref="formInline" :label-width="100" :model="params" class="mt20" :rules="ruleValidate">
            <FormItem label="房型名称：" prop="name">
                <Input type="text" class="control" v-model="params.name" placeholder="房型名称"/>
            </FormItem>
            <FormItem class="formItem" label="创建者">
                <Select class="control" v-model="params.createCompany" :disabled="$store.state.app.userInfo.dataType !== 'SITE'">
                    <Option v-for="(item,i) in createrList" :value="item.id" :key="item.id">
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="房间面积：">
                <number :min="1" :max="99" class="control input-control" v-model="params.roomArea" placeholder="18~22" />平米
            </FormItem>
            <FormItem label="床型：">
                <RadioGroup v-model="params.bedType">
                    <Radio label="大床"></Radio>
                    <Radio label="圆床"></Radio>
                    <Radio label="双人床"></Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="床：" class="mt20" >
                <number :min="1" :max="9" class="control" v-model="params.bedLength" placeholder="长"/> x <number :min="1" :max="9" v-model="params.bedWidth" class="control " placeholder="宽"/> (长x宽)/米
            </FormItem>
            <FormItem label="可住人数(人)：" class="mt20" >
                <number :precision="0" class="control" :min="1" :max="99" v-model="params.num" placeholder="人数" /> 人
            </FormItem>
            <FormItem label="是否有窗：">
                <RadioGroup v-model="params.isWindows">
                    <Radio label="无窗"></Radio>
                    <Radio label="有窗"></Radio>
                    <Radio label="部分有窗"></Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="早餐：" class="mt20">
                <RadioGroup v-model="params.breakfast ">
                    <Radio label="含早"></Radio>
                    <Radio label="不含早"></Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="服务及其他：" class="mt20">
                <Input class="text-field" :rows="5" type="textarea" :maxlength="200" v-model="params.serviceInfo" placeholder="提供房间更详细的说明，方便游客了解。例如：吹风机、拖鞋、洗漱六件套、冰箱、热水壶、河景。" />
            </FormItem>
            <FormItem class="mt20">
                <!--<uploadImg :limit="9" @getImagesList="getImageList" :defaultImage="params.roomImages"></uploadImg>-->
                <FormItem class="form-item" label="房型照片：" prop="roomImages"></FormItem>
                <uploadImg :defaultImage="defaultImage" @getImagesList="getImagesList" :limit="9"></uploadImg>
            </FormItem>
            <!-- <FormItem label="资源互通编码：" class="mt20" >
                <Input class="control" :maxlength="100" v-model="params.resourceCode" placeholder="资源互通编码"/>
            </FormItem> -->
            <!--<FormItem label="排序：" class="mt20" v-if="$store.state.app.userInfo.dataType == 'SITE'">-->
                <!--<number :precision="0" :min="1" :max="999" class="control" v-model="params.sort" placeholder="排序" />-->
            <!--</FormItem>-->
            <FormItem label="费用包含：" class="mt20" >
                <Input class="control" :maxlength="100" v-model="params.costIncludes" placeholder="费用包含" />
            </FormItem>
            <FormItem label="720全景：" class="mt20" >
                <Input class="control" :maxlength="150" v-model="params.panoramaUrl" placeholder="720全景" />
            </FormItem>
            <FormItem label="房型特色：" class="mt20" >
                <Input class="control" :maxlength="200" v-model="params.roomFeature" placeholder="房型特色" />
            </FormItem>
            <FormItem label="房型视频：" class="mt20">
                <!--<uploadVideo :limit="1" @getVideoList="getVideoList" :defaultVideo="params.video" :cover="params.videoCover"></uploadVideo>-->
                <uploadVideo :defaultVideo="defaultVideo" @getVideoList="getVideoList" :limit="1" ></uploadVideo>
            </FormItem>
            <FormItem label="" class="submit">
                <Button type="primary" @click="save(4)">提交</Button>
                <Button class="ml20" type="primary" @click="save(3)" v-if="isEdit">存草稿</Button>
                <Button class="ml20 btn-cancel" @click="goBack">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script lang="ts">
    import {Component, Vue,Watch} from "vue-property-decorator";
    import Head from "./head.vue";
    // import uploadImg from "@components/upload/upload-image.vue";
    // import uploadVideo from "@components/upload/upload-video.vue";
    import uploadImg from "@components/upload/upload-image2.vue";
    import uploadVideo from "@components/upload/upload-video2.vue";
    import {createrList} from '@service/content';
    import {hotelRoomSave,getHotelRoomView} from '@service/place';
    interface imgType {
        id: number,
        url: string,
        name?: string
    }

    interface videoType {
        id: number,
        imgUrl: string,
        url: string,
        name?: string
    }
    @Component({
        components: {
            Head,
            uploadImg,
            uploadVideo
        }
    })
    export default class editTab extends Vue {
        private params: any = {
            createCompany: this.$store.state.app.userInfo.orgId||-1, // 创建者
            id:'',//数据id
            name: '',//名称
            roomArea: '',//房间面积
            bedType:'大床',//床型
            bedLength:'',//	长
            bedWidth:'',//	宽
            num:'',//	数量
            isWindows:'有窗',//	是否有窗
            serviceInfo:'',//服务和其他
            roomImages:'',//房间图片
            resourceCode:'',//资源编码
            // sort:999,//排序
            panoramaUrl:'',//720全景
            roomFeature:'',//房间特色
            video:'',//视频
            videoCover:'',//视频封面图
            hotelId:'',//酒店id
            status:4, //4待审核  3 草稿
            breakfast :'',//早餐
            costIncludes  :'',//费用包含
            saveType:'list'//list 列表编辑，audit 审核编辑
            // siteId:'',//站点id
            // orgId:''//组织机构id
        };
        //验证
        private ruleValidate:any= {
            name: [
                {required: true, message: "请输入房型名称"},
                {type:'string',max:100,message:'最多输入100个字符'}
            ],
            roomImages:[{required: true, message: "请选择房型照片"}]
        };
        // 创建者列表
        private createrList: object[] = [];
        // 获取创建者
        private getCreaterList () {
            createrList().then((res: any) => {
                if (res.code === 0) {
                    this.createrList = res.datas
                }
            })
        }
        // 回显图片
        private defaultImage: Array<imgType> = [
            /*{
              id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561018189648/ad20190513.jpg",
                name: "ad20190513"
            }*/
        ];
        // 回显视频
        private defaultVideo: Array<videoType> = [
            /*{
                id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561098509967/cc79b43170d504d20c9cf1f84e360a90.mp4",
                imgUrl: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561099755721/微信图片_20190422150111.jpg",
                name: "ad20190513"
            }*/
        ];
        //图片
        private getImagesList(list: Array<{ id: number }>) {
            (this.params as any).roomImages = list.map((data: any) => (data.url || '')).join(',')
        }
        //视频
        private getVideoList(list: Array<{ id: number }>) {
            (this.params as any).videoCover = list.map((data: any) => (data.imgUrl || '')).join(',');
            (this.params as any).video = list.map((data: any) => (data.url || '')).join(',');
        }
        //保存
        save(status:any){
            let _this=this;
            (_this.params as any).status=status;//状态 4待审核  3 草稿
            (_this.$refs.formInline as any).validate((valid:any)=>{
                if(valid){
                    hotelRoomSave(this.params).then((res:any)=>{
                        if(res.code===0){
                            _this.$Message.success('保存成功');
                            _this.$router.go(-1);
                        }else{
                            _this.$Message.error(res.message);
                        }
                    })
                }else{
                    _this.$Message.error('请将必填项填写正确!');
                }
            })

        }
        //详情
        //是否是修改
        private isEdit: boolean = true;
        getHotelRoomDesc(id:any){
            let _this=this;
            getHotelRoomView({roomId:id}).then((res:any)=>{
                _this.params=res.data.ctcHotelRoom;
                _this.isEdit=(res.data.ctcHotelRoom.status==3);
                delete (_this.params as any).createTime;
                delete (_this.params as any).updateTime;
                (_this.params as any).saveType=_this.$route.query.type;
                //图片回显
                let imgs=(_this.params as any).roomImages.split(",");
                if(imgs.length>1){
                    imgs.forEach((item:any,index :number)=>{
                        _this.defaultImage.push({
                            id:index,
                            url:item
                        })
                    })
                }else{
                    _this.defaultImage=imgs[0]?[{
                        id:0,
                        url:imgs[0]
                    }]:[]
                }
                //视频回显
                let videos=(_this.params as any).video.split(",");
                let videoCovers=(_this.params as any).videoCover.split(",");
                if(videos.length>1){
                    videos.forEach((item:any,index:number)=>{
                        _this.defaultVideo=[{
                            id:index,
                            url:item,
                            imgUrl:videoCovers[index]
                        }]
                    })
                }else{
                    _this.defaultVideo=videos[0] ? [{
                        id:0,
                        url:videos[0],
                        imgUrl:videoCovers[0]
                    }]:[]
                }
            })
        }
        //返回
        goBack(){
            this.$router.go(-1);
        }

        mounted(){
            let _this=this;
            _this.params.hotelId=_this.$route.query.hotelId;
            //编辑时
            if(_this.$route.query.id){
                _this.getHotelRoomDesc(_this.$route.query.id);
            }
            _this.getCreaterList();
        }
    }
</script>

<style lang="scss">
    .tab-container {
        .control {
            width: 300px;
        }
        .text-field{
            width: 500px;
        }
        .note {
            color: $lightGray;
            font-size: 13px;
        }
        .w150 {
            width: 150px;
        }
        .submit {
            margin-top: 30px;
        }
        .map {
            height: 400px;
        }
        .tips-panel {
            margin-top: 30px;
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
        .setDifferent {
            border: 1px solid $borderLight;
            padding: 10px 0 20px 0;
            .tab-wrap {
                border-bottom: 1px solid $borderLight;
            }
            .tab-name {
                padding: 0 20px;
                cursor: pointer;
                &.active {
                    position: relative;
                    &:before {
                        position: absolute;
                        content: '';
                        left: 0;
                        bottom: -1px;
                        height: 2px;
                        width: 90%;
                        background-color: $theme;
                    }
                }
            }
            .set-content {
                padding-left: 20px;
            }
        }
        .form-item {
            position: absolute;
            left: -100px;
            top: 0;
            height: 100%;
        }
    }
</style>
<style lang="scss">
    .form-item {
        .ivu-form-item-content {
            height: 100%;
        }
        .ivu-form-item-error-tip {
            width: 100%;
            margin-left: 100px !important;
        }
    }
</style>
