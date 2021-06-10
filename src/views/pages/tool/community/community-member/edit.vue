<template>
<!-- 工具 - 社团成员 - 添加社团成员 -->
    <div class="container pd15">
        <Head></Head>
        <Form class="mt20" ref="params" :label-width="100" :model="params" :rules="ruleValidate">
            <FormItem label="姓名：" prop="name">
                <Input type="text" class="control" v-model="params.name" placeholder="姓名"/>
            </FormItem>
            <FormItem label="照片：">
                <!--<uploadImg :limit="9" @getImagesList="getImageList" :defaultImage="params.images"></uploadImg>-->
                <uploadImg :defaultImage="defaultImage" @getImagesList="getImagesList" :limit="1"></uploadImg>
            </FormItem>
            <FormItem label="性别：">
                <RadioGroup v-model="sex" @on-change="getSex">
                    <Radio label="男" ></Radio>
                    <Radio label="女"></Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="生日：">
                <DatePicker type="date" format="yyyy-MM-dd" confirm placement="bottom-start" placeholder="请输入年月日"
                            @on-change="getTime"
                            :value="params.birthday"></DatePicker>
            </FormItem>
            <FormItem label="年龄：">
                <number class="control" :min="1" :max="99" :precision="0" placeholder="请输入年龄" v-model="params.age" />
            </FormItem>
            <FormItem label="职务：">
                <Input type="text" class="control" :maxlength="30" v-model="params.duty" placeholder="请填写职务名称"/>
            </FormItem>
            <FormItem label="入团时间：">
                <DatePicker type="date" format="yyyy-MM-dd" confirm placement="bottom-start" placeholder="请输入年月日"
                            @on-change="(time)=>{params.joinTeamDate = time}"
                            :value="params.joinTeamDate"></DatePicker>
            </FormItem>
            <FormItem label="联系电话：" class="mt20" >
                <phone class="control" v-model="params.phone" ></phone>
            </FormItem>
            <FormItem label="所在地区：" class="mt20">
                <distPicker :default="regionPath" @onChange="getRegion"></distPicker>
            </FormItem>
            <FormItem label="详细地址：" class="mt20">
                <Input type="text" class="control" :maxlength="100" v-model="params.address" placeholder="填写街道门牌号"/>
            </FormItem>
            <FormItem label="成员简介：" class="mt20">
                <div class="uedit">
                    <Input type="text" class="control" :maxlength="100" v-model="params.summary" placeholder="成员简介"/>
                </div>
            </FormItem>
            <FormItem label="成员介绍：" class="mt20">
                <div class="uedit">
                    <ueditor v-model="params.introduce" id="member_uedit"></ueditor>
                </div>
            </FormItem>
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
    import Head from "./head.vue";
    import uploadImg from "@components/upload/upload-image2.vue";
    import ueditor from "@components/ueditor/ueditor.vue";
    import distPicker from "@components/distPicker/distPicker.vue";
    import {saveAssociationPerson,associationPersonView} from "@service/tool";
    import {getImgDetail,getVoiceDetail,getVideoDetail} from "@service/common";
    interface imgType {
        id: number,
        url: string,
        name?: string
    }
    @Component({
        components: {
            Head,
            mapMarker,
            uploadImg,
            ueditor,
            distPicker//地区插件
        }
    })
    export default class edit extends Vue {
        /*S 提交保存*/
        //保存参数
        private params: any = {
            name: '',//社团名称
            image: '',//社团照片
            sex:'',//性别
            birthday: '',//生日
            age: '',//年龄
            duty: '',//职务
            associationId: '',//社团id
            joinTeamDate: '',//加入时间
            phone: '',//电话
            region: '',//行政编码
            address: '',//详细地址
            introduce: '',//介绍
            summary: '',//简介
            status:'', //1正常  3 草稿
            // saveType:'list'//list 列表编辑，audit 审核编辑
        };
        private sex:any='男';
        private getSex(value:any){
            this.params.sex= (value==='女' ? 0 : 1);
        }
        //地区编码
        private regionPath:string='';
        //验证
        private ruleValidate: any = {
            name: [
                {required: true, message: '姓名不能为空', trigger: 'blur'},
                {type:'string',max:100,message:'最多输入100个字符'}
            ]
        };
        // 获取生日
        private getTime(time:any) {
            if (time) {
                (this.params as any).birthday = time;
                let year=time.split("-")[0];
                let nowYear = new Date().getFullYear();
                (this.params as any).age = nowYear-year;
            } else {
                (this.params as any).birthday = '';
                (this.params as any).age = '';
            }
        }
        //获取地区region
        getRegion(data:any){
            (this.params as any).region=data.region;
        }
        //保存
        handleSubmit(status:number) {
            let _this = this;
            _this.params.status=status;//状态 4待审核  3 草稿
            _this.params.sex=_this.sex=='女'? 0:1;
            //验证并保存
            (_this.$refs.params as any).validate((valid: any) => {
                if (valid) {
                    saveAssociationPerson(_this.params).then((res: any) => {
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
        //图片地址
        private getImagesList(list: Array<{ id: number }>) {
            this.params.image = list.map((data: any) => (data.url || '')).join(',')
        }
        // 获取媒体资源详情
        private getMediaDetailFn(type: string) {
            let reqs: { [propName: string]: any } = {
                image: getImgDetail,
                video: getVideoDetail,
                audio: getVoiceDetail,
            };
            let currReq = reqs[type] as { (param: { id: number }): any };
            return (id: number) => {
                return new Promise((resolve, reject) => {
                    currReq({id}).then((res: any) => {
                        if (res.data && res.data.res) {
                            resolve(res.data.res)
                        } else {
                            resolve()
                        }
                    }).catch((e: any) => {
                        resolve()
                    })
                })
            }
        }
        /*E 资源数据 图片、音频、视频*/
        /*S 详情*/
        getDesc(id:any){
            let _this=this;
            associationPersonView({id:id}).then((res:any)=>{
                if(res.code===0){
                    _this.params=res.data.ctcAssociationPerson;
                    _this.params.sex=res.data.ctcAssociationPerson.sex==0?'女':'男';
                    _this.sex=res.data.ctcAssociationPerson.sex;
                    //地区编码
                    _this.regionPath=res.data.sysRegion.scort;
                    (_this.params).region=res.data.sysRegion.region;
                    //移除不需要的字段
                    delete (_this.params as any).createTime;
                    delete (_this.params as any).updateTime;
                    //图片回显
                    let imgs=_this.params.image.split(",");
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
                }
            })
        }
        /*E 详情*/
        mounted() {
            let _this = this;
            _this.params.associationId=_this.$route.query.communityId;
            if (_this.$route.query.id) {
                _this.params.id = _this.$route.query.id;
                _this.getDesc(_this.$route.query.id);
            }

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
