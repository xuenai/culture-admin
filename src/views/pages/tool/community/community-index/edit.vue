<template>
<!-- 工具 - 社团 - 添加社团 -->
    <div class="container">
        <Form ref="params" :label-width="100" :model="params" :rules="ruleValidate">
            <!--tab切换-->
            <Tabs active-key="key2" class="tab-wrap" :animated="false" type="line">
                <!--基础资料-->
                <Tab-pane label="基本资料" key="key1">

                    <FormItem label="社团名称：" prop="name">
                        <Input type="text" class="control" v-model="params.name" placeholder="社团名称"/>
                    </FormItem>
                    <FormItem label="社团类型：" class="mt20" prop="type">
                        <span class="choice-tag" :class="params.type===item.id ? 'active' : ''" v-for="item in typeList" :key="item.id" v-if="item.pid" @click="handlerType(item.id)">{{item.name}}</span>
                        <Input type="text" v-model="params.type" v-show="false" />
                    </FormItem>
                    <FormItem label="成立时间：">
                        <DatePicker type="date" format="yyyy-MM-dd" confirm placement="bottom-start" placeholder="成立时间"
                                    @on-change="(time)=>{params.startTime = time}"
                                    :value="params.startTime"></DatePicker>
                    </FormItem>
                    <FormItem label="社团星级：" class="mt20">
                        <span class="choice-tag" :class="params.level===item ? 'active':''" v-for="item in levelList" @click="handlerLevel(item)">{{item}}</span>
                    </FormItem>
                    <FormItem label="所在地区：" class="mt20" prop="region">
                        <distPicker :default="regionPath" @onChange="getRegion"></distPicker>
                        <Input type="text" v-model="params.region" v-show="false" />
                    </FormItem>
                    <FormItem label="详细地址：" class="mt20" prop="address">
                        <Input class="control" placeholder="详细地址" :maxlength="100" v-model="params.address" />
                    </FormItem>
                    <FormItem label="联系电话：" class="mt20" >
                        <phone class="control" v-model="params.phone" ></phone>
                    </FormItem>
                    <FormItem label="负责人：" class="mt20" >
                        <Input class="control" v-model="params.dutyPerson" :maxlength="20"  placeholder="请输入负责人姓名" />
                        <phone class="control ml10" v-model="params.dutyPersonPhone"  placeholder="请输入负责人电话号码"></phone>
                    </FormItem>
                    <FormItem label="社团人数：" class="mt20" >
                        <number class="control" :min="1" :max="999999" :precision="0" placeholder="请输入社团人数" v-model="params.personNum" />
                    </FormItem>
                    <FormItem label="主管单位：" class="mt20">
                        <Input class="control" :maxlength="50" placeholder="请输入主管单位"  v-model="params.manageUnit" />
                    </FormItem>
                    <FormItem label="社团位置：" class="mt20" prop="longitude">
                        <div>
                            <mapMarker id="map" :region="params.region" @getAddress="getLongLat" :address="(params.id && (params.longitude && params.latitude))? [params.longitude, params.latitude]:''"></mapMarker>
                            <Input type="text" v-model="params.longitude" v-show="false" />
                        </div>
                    </FormItem>
                </Tab-pane>

                <!--团队介绍-->
                <Tab-pane label="团队介绍" key="key2" class="item">
                    <FormItem label="社团标志：">
                        <uploadImg :defaultImage="defaultIcon" @getImagesList="getImagesIcon" :limit="1"></uploadImg>
                    </FormItem>
                    <FormItem label="社团照片："  prop="associaImage">
                            <uploadImg class="upload-img" :defaultImage="defaultImage" @getImagesList="getImagesList" :limit="30"></uploadImg>
                    </FormItem>
                    <FormItem label="语音介绍：" class="mt20">
                        <uploadAudio :defaultVoice="defaultVoice" @getVoiceList="getVoiceList" :limit="5"></uploadAudio>
                    </FormItem>
                    <FormItem label="视频：" class="mt20">
                        <uploadVideo :defaultVideo="defaultVideo" @getVideoList="getVideoList" :limit="1" ></uploadVideo>
                    </FormItem>
                    <FormItem label="社团概况：" class="mt20">
                        <Input class="control" :maxlength="20"  v-model="params.associaSummary" placeholder="一句话描述社团特点"/>
                        <span class="note ml10">社团概述用于用户端社团列表页展示。最多20个汉字。</span>
                    </FormItem>
                    <FormItem label="团队介绍：" class="mt20">
                        <div class="uedit">
                            <ueditor v-model="params.associaIntroduce" id="venues_uedit"></ueditor>
                        </div>
                    </FormItem>
                </Tab-pane>
            </Tabs>

            <FormItem label="" class="submit">
                <Button type="primary" @click="handleSubmit(1)">提交</Button>
                <Button class="ml20" type="primary" @click="handleSubmit(3)" v-if="!params.status ||params.status===3">存草稿</Button>
                <Button class="ml20 btn-cancel" @click="goBack">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script lang="ts">
    import {Component, Vue,Watch} from "vue-property-decorator";
    import mapMarker from "@components/map/marker.vue";
    // import uploadVideo from "@components/upload/upload-video.vue";
    // import uploadAudio from "@components/upload/upload-audio.vue";
    // import uploadImg from "@components/upload/upload-image.vue";
    import uploadImg from "@components/upload/upload-image2.vue";
    import uploadVideo from "@components/upload/upload-video2.vue";
    import uploadAudio from "@components/upload/upload-voice.vue";
    import ueditor from "@components/ueditor/ueditor.vue";
    import distPicker from "@components/distPicker/distPicker.vue";
    import Tags from "@components/tags/tags.vue";
    import {saveAssociation,associationView} from "@service/tool";
    import {dictType,getImgDetail,getVoiceDetail,getVideoDetail} from "@service/common";
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

    interface voiceType {
        id: number | string;
        url: string;
        imgUrl?: string;
        name?: string;

        [propName: string]: any;
    }
    @Component({
        components: {
            mapMarker,
            uploadVideo,
            uploadAudio,
            uploadImg,
            ueditor,
            Tags,
            distPicker//地区插件
        }
    })
    export default class edit extends Vue {
        /*S 社团类型*/
        private typeList: Array<object> = [];
        getTypeList(){
            dictType({
                type: 'ASSOCIATE_TYPE'
            }).then((res:any)=>{
                this.typeList=res.datas;
                this.params.type= this.params.id ? this.params.type:res.datas[0].id ;
            })
        }
        handlerType(id:any){
            this.params.type=id;
        }
        /*E 社团类型*/

        /*S 社团星级*/
        private levelList:Array<any>=['一星级','二星级','三星级','四星级','五星级']
        handlerLevel(item:any){
            this.params.level=item;
        }

        /*E 社团星级*/

        /*S 提交保存*/
        //保存参数
        private params: any = {
            name: '',//社团名称
            type: -1,//社团类型
            level: '',//社团等级
            region: '',//地区编码
            address: '',//详细地址
            phone: '',//电话号码
            startTime: '',//成立时间
            dutyPerson: '',//负责人
            dutyPersonPhone: '',//负责人电话
            personNum: '',//社团人数
            manageUnit: '',//主管单位
            longitude: '',//经度
            latitude: '',//纬度
            associaImage: '',//图片集
            associaIcon: '',//社团标志
            associaAudio: '',//音频集地址
            associaVideo: '',//视频地址
            videoCover:'',//视频封面图
            associaSummary: '',//团队描述
            associaIntroduce: '',//团队介绍
            status:'', //4待审核  3 草稿
            // saveType:'list'//list 列表编辑，audit 审核编辑
        };
        private audio:Array<any>=[];
        //地区编码
        private regionPath:string='';
        //验证
        private ruleValidate: any = {
            name: [
                {required: true, message: '社团名称不能为空', trigger: 'blur'},
                {type:'string',max:100,message:'最多输入100个字符'}
            ],
            type:[{required: true, message: '社团类型必选'}],
            region: [
                {required: true, message: '请选择所在地区'}
            ],
            address: [
                {required: true, message: '详细地址不能为空', trigger: 'blur'},
                {type:'string',max:100,message:'最多输入100个字符'}
            ],
            longitude:[{required: true, message: '请选择经纬度'}],
            associaImage: [{required: true, message: '请上传社团图集'}],
            associaIcon: [{required: true, message: '请上传社团标记'}],

        };
        //获取地区region
        getRegion(data:any){
            (this.params as any).region=data.region;
        }
        //保存
        handleSubmit(status:number) {
            let _this = this;
            _this.params.status=status;//状态 4待审核  3 草稿
            _this.params.associaAudio=_this.audio.length>0?JSON.stringify(_this.audio.map((item:any)=>({
                name:item.name,
                url:item.url,
                time:item.duration
            }))):'';
            //验证并保存
            (_this.$refs.params as any).validate((valid: any) => {
                if (valid) {
                    saveAssociation(_this.params).then((res: any) => {
                        if (res.code === 0) {
                            _this.$router.go(-1);
                        }
                    })
                } else {
                    _this.$Message.error("请将必填项填写正确!");
                }
            })
        }

        /*E 提交保存*/

        //取消
        goBack(){
            this.$router.go(-1);
        }

        //社团类型标签
        private typeName:string='';
        handleTags(item: any) {
                this.params.type = item.id;
                this.typeName=item.name;
        }
        //经纬度
        getLongLat(e: any) {
            this.params.longitude = e.lnglat.lng;
            this.params.latitude = e.lnglat.lat;
        }
        /*S 资源数据 图片、音频、视频*/
        // 回显图片
        private defaultImage: Array<imgType> = [
            /*{
              id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561018189648/ad20190513.jpg",
                name: "ad20190513"
            }*/
        ];
        private defaultIcon: Array<imgType> = [
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
        // 回显音频
        private defaultVoice: Array<voiceType> = [
            /*{
                id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561027609568/xxxx.mp3",
                imgUrl: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561099755721/微信图片_20190422150111.jpg",
                name: "ad20190513"
            }*/
        ];
        //图片地址
        private getImagesList(list: Array<{ id: number }>) {
            this.params.associaImage = list.map((data: any) => (data.url || '')).join(',')
        }
        private getImagesIcon(list: Array<{ id: number }>) {
            this.params.associaIcon = list.map((data: any) => (data.url || '')).join(',')
        }
        //音频
        private getVoiceList(list: Array<any>) {
            let allPromise: Array<Promise<any>> = []
            list.forEach((item: any) => {
                if (!item.duration || !/^(\d+|(\d+\.\d+))$/.test(item.duration + '')) { // 没得的主动获取音频时长
                    let currPromise: Promise<any> = this.getAudioTime(item.url);
                    currPromise.then((res:{duration:number}) => {
                        item.duration = res.duration
                    });
                    allPromise.push(currPromise)
                }
            })
            Promise.all(allPromise).finally(() => {
                this.audio = list
            })
        }

        // 获取本地音频时长
        private getAudioTime (url: string) {
            return new Promise((resolve, reject) => {
                let audio = document.createElement("audio");
                audio.src = url;
                audio.addEventListener("loadeddata", function () {
                    resolve({
                        duration: parseInt(String(this.duration))
                    });
                });
                audio.addEventListener("error", function () {
                    reject()
                })
            })
        }
        //视频
        private getVideoList(list: Array<{ id: number }>) {
            this.params.associaVideo = list.map((data: any) => (data.url || '')).join(',')
            this.params.videoCover = list.map((data: any) => (data.imgUrl || '')).join(',')
        }
        /*E 资源数据 图片、音频、视频*/
        /*S 详情*/
        getDesc(id:any){
            let _this=this;
            associationView({id:id}).then((res:any)=>{
                if(res.code===0){
                    _this.params=res.data.association;
                    _this.params.personNum=res.data.association.personNum===0 ? '' : res.data.association.personNum;
                    //地区编码
                    _this.regionPath=res.data.sysRegion.scort;
                    (_this.params).region=res.data.sysRegion.region;
                    //移除不需要的字段
                    delete (_this.params as any).createTime;
                    delete (_this.params as any).updateTime;
                    //图片回显
                    let imgs=_this.params.associaImage.split(",");
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
                    //图标回显
                    let icons=_this.params.associaIcon.split(",");
                    if(icons.length>1){
                        icons.forEach((item:any,index :number)=>{
                            _this.defaultIcon.push({
                                id:index,
                                url:item
                            })
                        })
                    }else{
                        _this.defaultIcon=icons[0] ? [{
                            id:0,
                            url:icons[0]
                        }]:[]
                    }
                    //视频回显
                    let videos=_this.params.associaVideo.split(",");
                    let videoCovers=_this.params.videoCover.split(",");
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
                    //语音回显
                    let audios=_this.params.associaAudio ? JSON.parse(_this.params.associaAudio):[];
                    this.audio = audios.map((item:any, index: any) => {
                        this.defaultVoice.push({
                            id: 'id_' + index,
                            url:item.url,
                            name:item.name,
                            duration:item.time
                        });

                        return {
                            name:item.name,
                            url:item.url,
                            duration:item.time
                        }
                    })
                }
            })
        }
        /*E 详情*/
        private isEdit:boolean=true;
        mounted() {
            let _this = this;
            if (_this.$route.query.id) {
                _this.params.id = _this.$route.query.id;
                _this.getDesc(_this.$route.query.id);
            }
            _this.getTypeList();
        }
    }
</script>

<style lang="scss">
    //地区插件样式
    .distpicker-address-wrapper select {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        padding: 0 5px;
    }
</style>
<style lang="scss" scoped>
    .container {
        padding: 0 15px 15px;
        .control {
            width: 300px!important;
        }
        .note {
            color: $lightGray;
            font-size: 13px;
        }
        .w150 {
            width: 150px;
        }
        .w100 {
            width: 100px;
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
            width: 60%;
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
    }
</style>
