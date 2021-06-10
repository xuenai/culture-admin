<template>
    <div class="container">
        <!--<Alert>填写的资料太多，可只填写必填字段，然后由上云企业在文旅企业端自行完善数据。</Alert>-->
        <Form ref="formInline" :label-width="120" :model="params" :rules="ruleValidate">
            <FormItem label="停车场名称：" prop="name">
                <Input type="text" class="control" v-model="params.name" placeholder="停车场名称"/>
            </FormItem>
            <FormItem label="所在地区：" class="mt20" prop="region">
                <distPicker :default="regionPath" @onChange="getRegion"></distPicker>
            </FormItem>
            <FormItem label="详细地址：" class="mt20" prop="address">
                <Input class="control" placeholder="详细地址" v-model="params.address"/>
            </FormItem>
            <FormItem label="所属场所：" class="mt20" >
                <Input class="control" placeholder="所属场所" v-model="params.placeName" readonly/>
                <a href="javascript:;" class="theme-blue ml10" @click="showPlaceDialog">查看关联场所</a>
            </FormItem>
            <FormItem class="formItem" label="创建者">
                <Select class="control" v-model="params.createCompany" :disabled="$store.state.app.userInfo.dataType !== 'SITE'">
                    <Option v-for="(item,i) in createrList" :value="item.id" :key="item.id">
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="车位总数：" class="mt20">
                <number :precision="0" :min="1" :max="9999" class="control"  placeholder="车位总数" v-model="params.total"/>
            </FormItem>
            <FormItem label="规模大小：" class="mt20">
                <number :precision="0" :min="1" :max="9999" class="control"  placeholder="规模大小" v-model="params.scaleSize"/>㎡
            </FormItem>
            <FormItem label="剩余车位数据接口：" class="mt20" >
                <Input class="control" :maxlength="200" placeholder="请输入连接地址" v-model="params.surplusNumInterface"/>
            </FormItem>
            <FormItem label="收费标准：" class="mt20" >
                <Input class="control" :maxlength="50" placeholder="请输入收费标准" v-model="params.charges"/>
            </FormItem>
            <FormItem label="营业时间：" class="mt20" >
                <TimePicker type="timerange" confirm :editable="false" class="control" v-model="openTime"  placement="bottom-start"
                            placeholder="请选择营业时间"></TimePicker>
                <Input class="control ml10" :maxlength="100" placeholder="备注信息" v-model="params.remarks"/>
            </FormItem>
            <FormItem label="联系电话：" class="mt20">
                <phone v-model="params.phone" class="control"></phone>
            </FormItem>
            <FormItem label="停车场图片：" class="mt20">
                <!--<uploadImg :limit="9" @getImagesList="getImageList" :defaultImage="params.images"></uploadImg>-->
                <uploadImg :defaultImage="defaultImage" @getImagesList="getImagesList" :limit="9"></uploadImg>
            </FormItem>
            <FormItem label="停车场位置：" class="mt20" prop="longitude">
                <div>
                    <mapMarker id="map" :region="params.region" @getAddress="getLongLat" :address="(params.id && (params.longitude && params.latitude))? [params.longitude, params.latitude]:''"></mapMarker>
                    <Input type="text" v-model="params.longitude" v-show="false" />
                </div>
            </FormItem>
            <FormItem label="" class="submit">
                <Button type="primary" @click="save(4)">提交</Button>
                <Button class="ml20" type="primary" @click="save(3)" v-if="isEdit">存草稿</Button>
                <Button class="ml20 btn-cancel" @click="goBack">返回</Button>
            </FormItem>
        </Form>
        <uninPlace :show="place" @onOkClick="onOkClick" :isRadio="true" @onClose="place=false"></uninPlace>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    // import uploadImg from "@components/upload/upload-image.vue";
    import uploadImg from "@components/upload/upload-image2.vue";
    import mapMarker from "@components/map/marker.vue";
    import distPicker from "@components/distPicker/distPicker.vue";
    import uninPlace from "@components/uninPlace/uninPlace.vue";
    import {getParkingView,saveParking} from '@service/place';
    import {createrList} from '@service/content';
    interface imgType {
        id: number,
        url: string,
        name?: string
    }
    @Component({
        components: {
            uploadImg,
            mapMarker,
            distPicker,
            uninPlace
        }
    })
    export default class editTab extends Vue {

        private params: any = {
            createCompany: this.$store.state.app.userInfo.orgId||-1, // 创建者
            name:'',//名称
            region:'',//地址
            address:'',//详细地址
            placeName:'',//关联场所名称
            placeId:'',//场所id
            resourceType:'',//资源类型
            total:'',//车位总数
            scaleSize:'',//规模大小
            surplusNumInterface:'',//剩余车位数据接口
            charges: '',//收费标准
            openTime:'',//开放时间
            remarks:'',//备注
            phone:'',//电话
            images:'',//图片
            longitude:'',//经度
            latitude:'',//纬度
            status:4 ,//4待审核  3 草稿
            // siteId:'',//
            // orgId:'',//
            saveType:'list'//list 列表编辑，audit 审核编辑

        };
        private regionPath:string='';
        private ruleValidate: any = {
            name: [
                {required: true, message: '停车场名称不能为空', trigger: 'blur'},
                {type:'string',max:100,message:'最多输入100个字符'}
            ],
            region: [
                {required: true, message: '请选择所在地区', trigger: 'blur'}
            ],
            address: [
                {required: true, message: '详细地址不能为空', trigger: 'blur'},
                {type:'string',max:100,message:'最多输入100个字符'}
            ],
            longitude:[
                {required: true, message: '请选择经纬度'}
            ]
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

        //开放时间
        private openTime:any=[];
        //获取经纬度
        getLongLat(e :any){
            this.params.longitude = e.lnglat.lng;
            this.params.latitude = e.lnglat.lat;
        }
        // 回显图片
        private defaultImage: Array<imgType> = [
            /*{
              id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561018189648/ad20190513.jpg",
                name: "ad20190513"
            }*/
        ];
        //图片
        private getImagesList(list: Array<{ id: number }>) {
            (this.params as any).images = list.map((data: any) => (data.url || '')).join(',')
        }
        //获取地区region
        getRegion(data:any){
            this.params.region=data.region;
        }
        /*S 保存*/
        save(status:any){
            let _this=this;
            (_this.params as any).status=status;//状态 4待审核  3 草稿
            (_this.params as any).openTime = this.openTime.join(" ~ ");//营业时间
            // //验证并保存
            (_this.$refs.formInline as any).validate((valid: any) => {
                if(valid) {
                    saveParking(_this.params).then((res: any) => {
                        if (res.code === 0) {
                            _this.$Message.success('保存成功');
                            _this.$router.go(-1);
                        }
                    })
                }else{
                    this.$Message.error("请将必填项填写正确!");
                }
            })
        }
        /*E 保存*/
        //返回
        goBack(){
            this.$router.go(-1);
        }
        /*S 详情信息*/
        //是否是修改
        private isEdit:boolean=true;
        getParkingDesc(){
            let _this=this;
            getParkingView({
                id:_this.$route.query.id
            }).then((res:any)=>{
                _this.params=res.data.ctcParkingLot;
                _this.isEdit=(res.data.ctcParkingLot.status==3);
                _this.regionPath=res.data.sysRegion.scort;
                (_this.params as any).region = res.data.sysRegion.region;
                (_this.params as any).saveType=_this.$route.query.type;
                _this.openTime=res.data.ctcParkingLot.openTime.split("~");//营业时间
                delete _this.params.updateTime;
                delete _this.params.createTime;
                //图片回显
                let imgs=(_this.params as any).images.split(",");
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
            })
        }
        /*E 详情信息*/

        /*S关联场所*/
        private place = false;

        private showPlaceDialog() {
            this.place = true
        }

        private onOkClick(list: any) {
            this.params.placeName = list[0].name;
            this.params.placeId = list[0].id;
            this.params.resourceType = list[0].resourceType;
        }

        /*E关联场所*/

        created(){
            let _this=this;
            if(this.$route.query.id){
                _this.getParkingDesc();
            }
            this.getCreaterList();

        }
    }
</script>

<style lang="scss" scoped>
    .container {
        padding: 10px 15px;
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
    }
</style>
