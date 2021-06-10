<template>
    <div class="container">
        <Form ref="formInline" :label-width="120" :model="params" :rules="ruleValidate">
            <FormItem label="厕所名称：" prop="name">
                <Input type="text" class="control" placeholder="厕所名称" v-model="params.name"/>
            </FormItem>
            <FormItem label="厕所编号：">
                <Input type="text" class="control" :maxlength="100" placeholder="厕所编号：" v-model="params.toiletCode"/>
            </FormItem>
            <FormItem label="厕所等级：" class="mt20" prop="level">
                <span class="choice-tag" :class="params.level===item?'active':''" v-for="(item,index) in level"
                      @click="handleTags(item)" :key="index">{{item}}</span>
                <Input type="text" v-model="params.level" v-show="false" />
            </FormItem>
            <FormItem label="所在地区：" class="mt20" prop="region">
                <distPicker :default="regionPath" @onChange="getRegion"></distPicker>
            </FormItem>
            <FormItem label="详细地址：" class="mt20" prop="address">
                <Input class="control" placeholder="详细地址" :maxlength="50" v-model="params.address"/>
            </FormItem>
            <FormItem label="所属场所：" class="mt20">
                <Input class="control" placeholder="所属场所" readonly v-model="params.placeName"/>
                <a href="javascript:;" class="theme-blue ml10" :defaultChoose="defaultChoose" @click="showPlaceDialog">查看关联场所</a>
            </FormItem>
            <FormItem class="formItem" label="创建者">
                <Select class="control" v-model="params.createCompany" :disabled="$store.state.app.userInfo.dataType !== 'SITE'">
                    <Option v-for="(item,i) in createrList" :value="item.id" :key="item.id">
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="厕所类型：" class="mt20">
                <Select class="control" v-model="params.type">
                    <Option value="生态">生态</Option>
                    <Option value="水冲式">水冲式</Option>
                    <Option value="旱式">旱式</Option>
                </Select>
            </FormItem>
            <FormItem label="规模大小：" class="mt20">
                <Input class="control" :maxlength="50" placeholder="请输入规模大小" v-model="params.scale"/> ㎡
            </FormItem>
            <FormItem label="收费标准：" class="mt20">
                <Input class="control" :maxlength="50" placeholder="请输入收费标准" v-model="params.charges"/>
            </FormItem>
            <FormItem label="男坑位数：" class="mt20">
                <number :precision="0" :min="1" :max="99" class="control" placeholder="请输入男坑位数" v-model="params.manNum"/>
            </FormItem>
            <FormItem label="女坑位数：" class="mt20">
                <number :precision="0" :min="1" :max="99" class="control" placeholder="请输入女坑位数" v-model="params.womanNum"/>
            </FormItem>
            <FormItem label="残疾人专用：" class="mt20">
                <number :precision="0" :min="1" :max="99" class="control" placeholder="请输入" v-model="params.disableNum"/>
            </FormItem>
            <FormItem label="母婴室：" class="mt20">
                <number :precision="0" :min="1" :max="99" class="control" placeholder="请输入" v-model="params.infantNum"/>
            </FormItem>
            <FormItem label="剩余坑位数据接口：" class="mt20">
                <Input class="control" :maxlength="200" placeholder="请输入连接地址" v-model="params.surliusInterface"/>
            </FormItem>
            <FormItem label="联系电话：" class="mt20">
                <phone v-model="params.phone" class="control"></phone>
            </FormItem>
            <FormItem label="厕所图片：" class="mt20">
                <!--<uploadImg :limit="9" @getImagesList="getImageList" :defaultImage="params.images"></uploadImg>-->
                <uploadImg :defaultImage="defaultImage" @getImagesList="getImagesList" :limit="9"></uploadImg>
            </FormItem>
            <FormItem label="厕所位置：" class="mt20" prop="longitude">
                <div>
                    <mapMarker id="map" :region="params.region" @getAddress="getLongLat"
                               :address="(params.id && (params.longitude && params.latitude))? [params.longitude, params.latitude]:''"></mapMarker>
                    <Input type="text" v-show="false" v-model="params.longitude"/>
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
    import {createrList} from '@service/content';
    import {getToiletView, saveToilet} from '@service/place';
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
            name: '',//	名称
            level: '无星级',//	等级
            region: '',//	地区编码
            address: '',//	地址
            placeName:'',//关联场所名称
            placeId: '',//场所
            type: '',//	厕所类型
            scale: '',//	规模大小
            charges: '',//	收费标准
            resourceType: '',//	资源类型
            manNum: '',//	男坑位
            womanNum: '',//	女坑位
            disableNum: '',//	残疾人坑位
            infantNum: '',//	母婴室
            surliusInterface: '',//	剩余坑位数据接口
            phone: '',//	电话
            images: '',//	图片地址
            longitude: '',//	经度
            latitude: '',//	纬度
            toiletCode: '',//	测试编号
            status: 4, //4待审核  3 草稿
            saveType:'list'//list 列表编辑，audit 审核编辑
            // siteId:'',//	站点
            // orgId:'',//	组织机构
        };
        //关联场所
        private defaultChoose:Array<object>=[{
            id:'',
            resourceType:'CONTENT_TYPE_TOILET'
        }];
        private regionPath: string = '';
        private ruleValidate: any = {
            name: [
                {required: true, message: '厕所名称不能为空', trigger: 'blur'},
                {type: 'string', max: 100, message: '最多输入100个字符'}
            ],
            level:[{required: true, message: '请选择厕所等级', trigger: 'blur'}],
            region: [
                {required: true, message: '请选择所在地区', trigger: 'blur'}
            ],
            address: [
                {required: true, message: '详细地址不能为空', trigger: 'blur'},
                {type: 'string', max: 100, message: '最多输入100个字符'}
            ],
            longitude:[{required: true, message: '请选择经纬度'}]
        };
        //星级
        private level: any = ['无星级', '一星级', '二星级', '三星级', '四星级', '五星级'];

        handleTags(value: any) {
            this.params.level = value;
        }
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
        //获取经纬度
        getLongLat(e: any) {
            this.params.longitude = e.lnglat.lng;
            this.params.latitude = e.lnglat.lat;
        }

        //图片地址
        private defaultImage: Array<imgType> = [
            /*{
              id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561018189648/ad20190513.jpg",
                name: "ad20190513"
            }*/
        ];
        private getImagesList(list: Array<{ id: number }>) {
            this.params.images = list.map((data: any) => (data.url || '')).join(',')
        }

        //地区编码
        getRegion(data: any) {
            this.params.region = data.region;
        }

        /*S 保存*/
        save(status:any) {
            let _this = this;
            (_this.params as any).status = status;//状态 4待审核  3 草稿
            // //验证并保存
            (_this.$refs.formInline as any).validate((valid: any) => {
                if(valid) {
                    saveToilet(this.params).then((res: any) => {
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
        goBack() {
            this.$router.go(-1);
        }

        /*S 详情信息*/
        private isEdit: boolean = true;

        getToiletDesc() {
            let _this=this;
            getToiletView({
                id: _this.$route.query.id
            }).then((res: any) => {
                _this.params = res.data.ctcToilet;
                _this.isEdit = (res.data.ctcToilet.status == 3);
                _this.regionPath = res.data.sysRegion.scort;
                (this.params as any).region = res.data.sysRegion.region;
                delete _this.params.updateTime;
                delete _this.params.createTime;
                (_this.params as any).saveType=_this.$route.query.type;
                //图片回显
                let imgs=_this.params.images.split(",");
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

        /*S关联场馆*/
        private place = false;

        private showPlaceDialog() {
            this.place = true
        }

        private onOkClick(list: any) {
            this.params.placeName = list[0].name;
            this.params.placeId = list[0].id;
            this.params.resourceType = list[0].resourceType;
        }

        /*E关联场馆*/

        mounted() {
            if (this.$route.query.id) {
                this.getToiletDesc();
                (this.defaultChoose as any)[0].id=this.$route.query.id;
            }
            this.getCreaterList();
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        padding: 10px 15px;
        .control {
            width: 300px !important;
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
