<template>
    <div class="activity page-activity-add">
        <div class="add-content-detail-title">
            <!-- 进度条 -->
            <ul class="header-goods">
                <li class="active"><em class="demo2"></em><span class="demo1 hasNo"></span><span>1 创建活动</span></li>
                <li><em class="demo2 noRightM"></em><span>2 编辑活动内容</span></li>
            </ul>
            <p class="title-tool">
                <i class="cloud-icon">&#xe697;</i> 基本信息
            </p>
            <div class="add-content-detail-content">
                <Form ref="formData" :model="formData" :label-width="100" :rules="ruleValidate">
                    <FormItem label="活动类型" required>
                        <span class="detail-text-text">{{getStatusTxt[$route.query.classify]}}</span>
                    </FormItem>
                    <FormItem label="活动方式" required>
                        <span class="detail-text-text">{{getStatusTxt[$route.query.method]}}</span>
                    </FormItem>
                    <FormItem label="创建者" required>
                        <!-- 回显修改时不允许再次编辑 -->
                        <Select v-model="formData.createCompany" @on-change="createCompanyChange" :disabled="!isSite" filterable style="width: 250px">
                            <Option
                                    v-for="(option) in siteList"
                                    :value="option.id"
                                    :key="option.id"
                            >{{option.name}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="活动名称" prop="name">
                        <Input
                                placeholder="请输入活动名称"
                                style="width: 250px"
                                v-model="formData.name"
                                :maxlength="50"
                        />
                        <span class="prompt ml20">50字以内</span>
                    </FormItem>
                    <FormItem label="活动价格" prop="money">
                        <InputNumber
                                placeholder="请输入活动价格"
                                style="width: 250px"
                                v-model="formData.money"
                                :formatter="val => {
                                    if (val > 99999) val = 99999;
                                    if (val < 0) val = 0;
                                    let int = String(val).split('.')[0];
                                    let float = String(val).split('.')[1];
                                    if (float && float.length > 2) val = int + '.' + float.slice(0, 2);
                                    return `￥${val}`
                                }"
                                :parser="val => val.replace('￥', '')"
                                @on-change="priceChange"
                        ></InputNumber>
                        <span class="prompt ml20">价格最小可输入0.01元</span>
                    </FormItem>
                    <FormItem label="活动分类" prop="activityClassify">
                        <Select style="width: 250px" v-model="formData.activityClassify" @on-change="$refs.formData.validateField('activityClassify')">
                            <Option :value="item.id" v-for="item in activityClassify"
                                    :key="item.id">{{item.labelName}}
                            </Option>
                        </Select>
                        <span class="ml20 linkTxt" @click="AddTagShow = true">添加分类</span>
                    </FormItem>
                    <div class="tag-box">
                        <FormItem label="活动标签" prop="tag">
                            <tags
                                resourceType="CONTENT_TYPE_ACTIVITY"
                                labelType="ACTIVITY_LABEL"
                                :defaultIds="formData.tag"
                                @onChange="ids => {
                                    formData.tag = ids;
                                    if ($refs.formData) $refs.formData.validateField('tag')
                                }"
                            ></tags>
                        </FormItem>
                    </div>
                    <div>
                        <FormItem
                            label="预约时间"
                            prop="signStartTime"
                            v-if="
                                ['ACTIVITY_MODE_INTEGRAL_PAY'].includes(
                                formData.method
                                )
                            "
                            >
                            <DatePicker
                                :disabled="keyContrll"
                                :value="[formData.signStartTime, formData.signEndTime]"
                                @on-change="setSignTime"
                                type="datetimerange"
                                format="yyyy-MM-dd HH:mm"
                                placeholder="请选择活动预约的起始日期、时间"
                                style="width: 300px"
                            ></DatePicker>
                        </FormItem>
                    </div>
                    <FormItem label="活动时间" required prop="useStartTime">
                        <DatePicker
                                :disabled="keyContrll"
                                :value="[formData.useStartTime, formData.useEndTime]"
                                @on-change="setActivityTime"
                                type="datetimerange"
                                format="yyyy-MM-dd HH:mm"
                                placeholder="请选择活动起始日期、时间" style="width: 300px">
                        </DatePicker>
                    </FormItem>
                    <FormItem>
                        <Upload :limit="1" v-model="defaultImage" ></Upload>
                        <FormItem label="活动主图" class="activity-img" prop="images"></FormItem>
                    </FormItem>
                    <FormItem label="活动地址" prop="address">
                        <VDistpicker
                                :default="formData.regionPath"
                                @onChange="pickerChange"
                        ></VDistpicker>
                        <Input
                                placeholder="请输入街道门牌号..."
                                v-model="formData.address"
                                style="width: 250px"
                                class="ml20"
                                :maxlength="50"
                        />
                    </FormItem>
                    <FormItem prop="longitude">
                        <Map v-if="hasMounted"
                            :id="'map' + stamp"
                            :lab="true"
                            :address="[formData.longitude,formData.latitude]"
                            :region="formData.region"
                            @getAddress="getAddress"
                        ></Map>
                    </FormItem>
                    <!-- 回显修改时不允许再次编辑 -->
                    <div>
                        <FormItem label="所属场所" prop="activityName">
                            <Input placeholder="请选择所属场所" readonly style="width: 250px"
                                   :disabled="keyContrll"
                                   :title="formData.activityName"
                                   clearable
                                   @on-clear="formData.resourceParams = ''"
                                   v-model="formData.activityName"
                                   @on-focus="!keyContrll && (place = true)"/>
                        </FormItem>
                    </div>
                    <FormItem label="所属志愿团队" prop="voluntTeamName">
                        <Input placeholder="请选择活动所属志愿团队，可多选" readonly style="width: 250px"
                               :disabled="keyContrll"
                               clearable
                               :title="formData.voluntTeamName"
                               @on-clear="formData.voluntTeamStr = ''"
                               v-model="formData.voluntTeamName"
                               @on-focus="!keyContrll && (voluntShow0 = true)"/>
                    </FormItem>
                    <FormItem label="所属社团" prop="associationName">
                        <Input placeholder="请选择活动所属社团，可多选" readonly style="width: 250px"
                               clearable
                               :title="formData.associationName"
                               @on-clear="formData.associationStr = ''"
                               v-model="formData.associationName"
                               @on-focus="voluntShow1 = true"/>
                    </FormItem>

                    <!--添加图片-->
                    <!-- <div class="mt20">
                        <p class="title-tool"><i class="cloud-icon">&#xe697;</i> 添加图片</p>
                        <div class="add-content-detail-content">
                            <FormItem>
                                <Upload :limit="1" v-model="defaultImage" ></Upload>
                                <FormItem label="活动主图" class="activity-img" prop="images"></FormItem>
                            </FormItem>
                        </div>
                    </div> -->

                    <FormItem>
                        <Button type="primary" @click="activitySaveStatus1">保存</Button>
                        <Button type="primary" style="margin-left: 8px"
                                v-if="showDraft"
                                @click="activitySaveStatus2">存草稿</Button>
                        <Button style="margin-left: 8px" @click="goBack">返回</Button>
                    </FormItem>
                </Form>
            </div>
        </div>
        <uninPlace :show="place" :orgId="formData.createCompany"
                   :defaultChoose="getPlaceIds"
                   @onOkClick="onOkClick"
                   @onClose="place = false"></uninPlace>
        <Voluntteam :show="voluntShow0" :selectIds="voluntIds" @onClose="voluntShow0 = false" @onOkClick="getVolunt" :type="0"></Voluntteam>
        <Voluntteam :show="voluntShow1" :selectIds="associatioIds" @onClose="voluntShow1 = false" @onOkClick="getAssociation" :type="1"></Voluntteam>
        <AddTag v-model="AddTagShow" @getTag="item => activityClassify.push(item)"></AddTag>
    </div>
</template>

<script lang='ts'>
    import {Component,Watch, Vue} from "vue-property-decorator";
    import uninPlace from "@components/uninPlace/uninPlace.vue";
    import Voluntteam from "@components/pop/volunt-team.vue";
    // import AddTag from "@components/add-activityclass/index.vue";
    import Upload from "@components/upload/upload-image-link.vue";
    import tags from "@components/tags/tags.vue";
    import VDistpicker from "@components/distPicker/distPicker.vue";
    import Map from "@components/map/marker.vue";
    import AddTag from "./addTag.vue";

    import {activitySave, getActivityDetial} from "@service/activity";
    import {getTagsSelect} from "@service/common";
    import {createrList} from "@service/content";
    import {getParentsRegion, getStatusTxt} from "@util/comm";

    @Component({
        components: {
            Upload,
            uninPlace,
            tags,
            VDistpicker,
            Map,
            Voluntteam,
            AddTag
        }
    })
    export default class FreeBooking extends Vue {
        private hasMounted: boolean = false;
        private isSite = (this.$store.state.app.userInfo.dataType === 'SITE');
        //添加活动分类弹窗显示布尔值
        private AddTagShow: boolean = false;
        private voluntShow0:boolean = false
        private voluntShow1:boolean = false
        private stamp: number = new Date().getTime();
        private getStatusTxt = getStatusTxt;
        // 志愿团回显
        get voluntIds() {
            return this.formData.voluntTeamStr.split(',')
        }
        // 社团回显
        get associatioIds() {
            return this.formData.associationStr.split(',')
        }
        // 是否显示保存草稿
        get showDraft() {
            return !Boolean(this.formData.id) || [3].includes(this.formData.status)
        }
        private priceChange (val: number) {
            if (val > 99999) this.formData.money = 99999;
            if (String(val).split('.')[1] && String(val).split('.')[1].length > 2) {
                this.formData.money = Number(String(val).split('.')[0] + '.' + String(val).split('.')[1].slice(0, 2))
            }
        }
        // 报名时间
        private setSignTime(time: Array<string>) {
            this.formData.signStartTime = time[0] ? time[0] + ':00' : ''
            this.formData.signEndTime = time[1] ? time[1] + ':00' : ''
            ;(this.$refs.formData as any).validateField('signStartTime')
        }

        // 活动时间
        private setActivityTime (time: Array<string>) {
            this.formData.useStartTime = time[0] ? (time[0] + ":00") : '';
            this.formData.useEndTime = time[1] ? (time[1] + ":00") : '';
            (this.$refs.formData as any).validateField("useStartTime");
        }
        // 获取志愿团list
        private getVolunt(list: Array<{name: string, id: any}>) {
            let names = this.formData.voluntTeamName ? this.formData.voluntTeamName.split(',') : [];
            let ids = this.formData.voluntTeamStr ? this.formData.voluntTeamStr.split(',') : [];
            list.forEach((item:{name: string, id: any}) => {
                if (!ids.includes(String(item.id))) {
                    names.push(item.name);
                    ids.push(item.id);
                }
            })
            this.formData.voluntTeamName = names.toString();
            this.formData.voluntTeamStr = ids.toString();
        }
        // 获取社团list
        private getAssociation(list: Array<{name: string, id: any}>) {
            let names = this.formData.associationName ? this.formData.associationName.split(',') : [];
            let ids = this.formData.associationStr ? this.formData.associationStr.split(',') : [];
            list.forEach((item:{name: string, id: any}) => {
                if (!ids.includes(String(item.id))) {
                    names.push(item.name);
                    ids.push(item.id);
                }
            })
            this.formData.associationName = names.toString();
            this.formData.associationStr = ids.toString();
        }
        /* S 关联场所弹窗 */
        private place = false;
        private onOkClick(list: Array<any>) {
            let txt = this.formData.activityName ? this.formData.activityName.split(',') : [],
                resource = this.formData.resourceParams ? JSON.parse(this.formData.resourceParams) : [];
            list.forEach((item: any) => {
                // 过滤已有项
                if (!resource.some((d:any) => (d.resourceId === item.id && d.resourceType === item.resourceType))) {
                    txt.push(item.name);
                    resource.push({
                        resourceType: item.resourceType,
                        resourceId: item.id
                    });
                }
            });
            this.formData.activityName = txt.toString();
            this.formData.resourceParams = JSON.stringify(resource);
        }
        /* E 关联场所弹窗 */

        // 获取活动地点经纬度
        private getAddress(e: any) {
            this.formData.longitude = e.lnglat.lng;
            this.formData.latitude = e.lnglat.lat;
            if (this.$refs.formData) (this.$refs.formData as any).validateField("longitude");
        }

        // 创建者下拉匹配框数据
        private siteList: any = [];
        private getcreaterList(){
            createrList().then((res:any)=>{
                if(res.code===0){
                    this.siteList = res.datas;
                }
            })
        }
        //表单
        private formData: any = {
            id: "",
            status: 1, // 状态，存草稿时 为3
            type: "", //活动类型
            method: "", // 活动方式
            createCompany: this.$store.state.app.userInfo.orgId||-1, // 创建者
            name: "", // 活动名称
            activityClassify: "", // 活动分类
            activityName: "", // 所属场所校验字段
            resourceParams: '', // 资源类型数据-活动场所
            tag: "", // 标签
            region: "", // 地区编码
            regionPath: "", // 地区编码路径
            address: "", // 活动地址
            longitude: "", // 活动经度
            latitude: "", // 活动维度
            images: "", // 活动主图
            voluntTeamStr: "",
            associationStr: "",
            voluntTeamName: "",
            associationName: "",
            useEndTime: "",
            useStartTime: "",
            signStartTime: '',
            signEndTime: '',
            jumpName: "",
            jumpUrl: "",
            jumpType: "",
            money: 1,
            limitNum: 1,
            jumpBody: "",
            lineFlag: 0,
        };
        // 表单验证
        private ruleValidate = <any>{
            name: [
                {required: true, message: "请将信息填写完整", trigger: "blur"},
                {type:'string',max:50,message:'最多输入50个字符'}],
            activityClassify: [{required: true, message: "请将信息填写完整", trigger: 'change|blur',validator: this.checkActivityClassify}],
            tag: [{required: true, message: "请将信息填写完整"}],
            money: [{required: true, message: "请将信息填写完整"}],
            address: [
                {required: true, message: "请将信息填写完整", trigger: "blur"},
                {validator: this.checkRegion, message: "请选择地区", trigger: "blur"}
            ],
            images: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            longitude: [
                {validator: this.checkLngLat, message: "请选择位置坐标", trigger: "change"}],
            useStartTime: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            useEndTime: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            signStartTime: [
            { required: true, message: '请将信息填写完整', trigger: 'change' }
            ],
            signEndTime: [
            { required: true, message: '请将信息填写完整', trigger: 'change' }
            ],
        };

        // 检查地区选择
        private checkActivityClassify (rule: any, value: any, callback: Function) {
            if (!this.formData.activityClassify) {
                return callback(new Error("请将信息填写完整"));
            }
            callback();
        }
        // 检查地区选择
        private checkRegion (rule: any, value: any, callback: Function) {
            if (!this.formData.region) {
                return callback(new Error("请将信息填写完整"));
            }
            callback();
        }
        // 检查地区选择
        private checkLngLat (rule: any, value: any, callback: Function) {
            if (!this.formData.longitude) {
                return callback(new Error("请选择位置坐标"));
            }
            callback();
        }

        // 创建者变化时
        private createCompanyChange(){
            Object.assign(this.formData,{activityName:"",resourceParams:''})
        }
        // 回显修改的时候，部分字段不嫩修改 0可以修改， 1不能修改
        private modKeyControll: number = 0
        // 控制字段是否能编辑
        get keyContrll () { // keyContrll:true表示不能修改
          return Boolean(this.formData.id) && Boolean(this.modKeyControll)
        }

        mounted() {
            if (
                ['ACTIVITY_MODE_INTEGRAL_PAY'].includes(
                this.$route.query.method as string
                )
            ) {
                this.ruleValidate.signStartTime.push({
                validator: this.validSignTime,
                message:
                    '可预约的开始时间必须早于或等于活动开始的时间，可预约的结束时间必须早于或等于活动结束的时间',
                trigger: 'change'
                })
                this.ruleValidate.useStartTime.push({
                validator: this.validSignTime,
                message:
                    '可预约的开始时间必须早于或等于活动开始的时间，可预约的结束时间必须早于或等于活动结束的时间',
                trigger: 'change'
                })
            }
            this.formData.type = this.$route.query.classify || '';
            this.formData.method = this.$route.query.method || '';
            this.formData.id = this.$route.query.id || '';
            this.formData.auditFlag = this.$route.query.auditFlag || ''; // 保存审核内容时 传1
            this.getActivityClassify()
            this.getcreaterList()
            // 编辑时数据回显
            if (this.formData.id) {
                this.getActivityDetial()
            }
            this.hasMounted = true
        }
        // 验证预约时间是否符合活动时间
        private validSignTime(rule: any, value: any, callback: Function) {
            if (this.formData.signStartTime && this.formData.useStartTime) {
                if (
                    this.formData.signStartTime > this.formData.useStartTime ||
                    this.formData.signEndTime > this.formData.useEndTime
                ) {
                    return callback(new Error())
                }
            }
            callback()
        }

        // pop资源弹窗回显的
        get getPlaceIds() {
            let res = []
            if (this.formData.resourceParams && this.formData.resourceParams.length) {
                res = JSON.parse(this.formData.resourceParams).map((item:any) => ({
                    resourceType: item.resourceType,
                    id: item.resourceId
                }))
            }
            return res
        }

        // 回显图片
        private defaultImage:Array<any> = []
        // 获取详情
        private getActivityDetial() {
            getActivityDetial({id: this.formData.id}).then((res: any) => {
                if (res.code === 0) {
                    Object.assign(this.formData, res.data)
                    this.modKeyControll = res.data.orderCount
                    if (this.formData.activityClassifyName.length === 0) {
                        this.formData.activityClassify = ''
                    }
                    if (this.formData.images) {
                        this.defaultImage = this.formData.images.split(',').map((img: any, i: number) => ({
                            id: 'id-' + i,
                            url: img,
                            jumpUrl: this.formData.jumpUrl,
                            jumpName: this.formData.jumpName,
                            jumpType: this.formData.jumpType,
                            product: this.formData.jumpBody?JSON.parse(this.formData.jumpBody):'',
                        }))
                    }
                }
            })
        }

        // 直接保存
        private activitySaveStatus1() {
            this.formData.status = 1
            this.activitySave()
        }

        // 存草稿
        private activitySaveStatus2() {
            this.formData.status = 3
            this.activitySave()
        }

        // 返回
        private goBack() {
            this.$router.go(-1);
        }

        // 保存
        private activitySave() {
            (this.$refs.formData as any).validate((valid: any) => {
                if (valid) {
                    let saveData = this.formData;
                    activitySave(saveData).then((res: any) => {
                        if (res.code === 0) {
                            this.$Message.success("保存成功!");
                            if(this.formData.id){
                                this.$router.go(-1);
                            } else {
                                this.$router.push({path:'/ac-list'})
                            }
                        }
                    })
                } else {
                    this.$Message.error("请将信息填写完整!");
                }
            });
        }

        // 活动分类
        private activityClassify: Array<any> = []
        private getActivityClassify() {
            getTagsSelect({
                resourceType: 'CONTENT_TYPE_ACTIVITY',
                labelType: 'ACTIVITY_CLASSIFY'
            }).then((res: any) => {
                if (res.code === 0) {
                    this.activityClassify = res.datas.filter((data:any) => data.labelName !== '志愿服务')
                }
            })
        }

        // 地区region改变
        private pickerChange(e: any) {
            this.formData.region = e.region;
        }
        // 选择图片
        @Watch('defaultImage', { immediate: true, deep: true })
        getImagesList(list: Array<{ url: string,jumpType:string|undefined,jumpName:string|undefined,jumpUrl:string|undefined,product:string|undefined, }>) {
            if (list && list.length) {
                this.formData.images = list[0].url;
                if (list[0].jumpType === '请选择') {
                    this.formData.jumpName = undefined;
                    this.formData.jumpUrl = undefined;
                    this.formData.jumpType = undefined;
                    this.formData.jumpBody = undefined;
                } else {
                    this.formData.jumpName = list[0].jumpName;
                    this.formData.jumpUrl = list[0].jumpUrl;
                    this.formData.jumpType = list[0].jumpType;
                    this.formData.jumpBody = JSON.stringify(list[0].product);
                }
            } else {
                this.formData.images = '';
                this.formData.jumpName = undefined;
                this.formData.jumpUrl = undefined;
                this.formData.jumpType = undefined;
                this.formData.jumpBody = undefined;
            }
            if (this.$refs.formData) (this.$refs.formData as any).validateField("images");
        }
    }
</script>

<style lang="scss">
    /*志愿页编辑页样式*/
    .page-activity-add {
        .activity-img {
            margin: 0!important;
            .ivu-form-item-label {
                position: absolute;
                left: -100px;
                top: 0;
            }
        }
        .tag-box {
            .ivu-form-item {
                margin-bottom: 0!important;
            }
            .ivu-form-item-content {
                line-height: 0;
            }
        }
        .valid-time-set {
            .ivu-select-dropdown {
                right: 0!important;
                left: auto!important;
            }
        }
    }
</style>
<style lang='scss' scoped>
    // 进度条
    .header-goods{
        max-width: 1100px;
        overflow: hidden;
        background: $bg01;
        padding: 20px 0 0 0;
        font-size:0;
        li{
            position: relative;
            width: 50%;
            float: left;
            font-size: 16px;
            color: #595961;
            height: 45px;
            line-height: 45px;
            background: #f2f2f6;
            .demo1{
                width: 0;
                height: 0;
                /*overflow: hidden;*/
                font-size: 0;
                position: absolute;
                right: -24px;
                border-top: 23px solid #f2f2f6;
                border-right: 23px solid #f2f2f6;
                border-bottom: 22px solid #f2f2f6;
                border-left: 40px solid $bg01;
                z-index: 1;
                &:after {
                    content: "";
                    position: absolute;
                    left: -47px;
                    top: -24px;
                    width: 7px;
                    height: 46px;
                    background: #fff;
                }
            }
            .demo2{
                width: 0;
                height: 0;
                /*overflow: hidden;*/
                font-size: 0;
                position: absolute;
                right: -17px;
                border-top: 23px solid transparent;
                border-right: 23px solid transparent;
                border-bottom: 22px solid transparent;
                border-left: 40px solid #f2f2f6;
                z-index: 2;
            }
            span:last-child{
                position: relative;
                left: 40%;
            }
            &:nth-child(2){
                /*margin-left: -46px;*/
                background-color: #6ed35e;
                color: #fff;
                .demo2 {
                    right: -23px;
                    border-color: #fff;
                    border-left-color: #6ed35e;
                }
            }
            .noBorder{
                border-bottom: 24px solid $bg01!important;
                border-left: 25px solid $bg01;
            }
            .noRightM{
                /*right: 2px!important;*/
            }
            &.active{
                height: 51px;
                line-height: 51px;
                background: #6ed35e;
                color: $bg01;
                border: 3px solid $bg01;
                border-right: none;
                border-left: none;
                margin-top: -3px;
                position: relative;
                .demo1{
                    border-top: 23px solid #6ed35e;
                    border-right: 23px solid #6ed35e;
                    border-bottom: 22px solid #6ed35e;
                    border-left: 40px solid $bg01;
                }
                .demo2{
                    border-top: 23px solid transparent;
                    border-right: 23px solid transparent;
                    border-bottom: 22px solid transparent;
                    border-left: 40px solid #6ed35e;
                }
            }
            .hasNo{
                border-top: 23px solid #6ed35e!important;
                border-right: 23px solid #6ed35e!important;
                border-bottom: 22px solid #6ed35e!important;
                border-left: 40px solid $bg01;
            }
            .hasWirte, .noBorder{
                border-top: 23px solid #6ed35e!important;
                border-right: 23px solid #6ed35e!important;
                right: 0!important;
            }
        }
    }

    //基本信息
    .title-tool {
        position: relative;
        width: 100%;
        line-height: 16px;
        font-size: 14px;
        font-weight: bold;
        padding-left: 10px;
        margin-bottom: 20px;
        margin-top: 20px;
        i {
            position: absolute;
            top: 0;
            left: -8px;
            font-size: 20px;
            color: $theme;
        }
    }

    .tip {
        color: #FF6600;
    }

    .switch {
        position: relative;
        .label {
            position: absolute;
            left: -84px;
            top: 0;
            color: #19BE6B;
            font-weight: bold;
            img {
                width: 22px;
                margin-right: 2px;
                position: relative;
                top: 6px;
            }
        }
        .num-box {
            .input {
                margin: 0 5px;
            }
        }
    }
    
    .add-content-detail-title {
        padding: 0 20px;
        .add-content-detail-content {
            padding: 10px 0;
            border-top: 1px solid #dedede;
            .linkTxt {
                color: $theme;
                cursor: pointer;
            }
            .ivu-form-item {
                margin: 20px 0 15px 0;
            }
            .ivu-select-multiple .ivu-tag {
                padding: 0 14px !important;
            }
            .prompt {
                font-size: $f12;
                color: #ccc;
            }
            .tags {
                width: 87px;
                height: 32px;
                color: $theme;
                background: $grayDark;
                border: 1px solid $theme;
                display: block;
                float: left;
                margin-right: 15px;
                text-align: center;
                border-radius: 5px;
            }
            .ivu-btn-dashed {
                width: 87px;
                height: 32px;
                color: $bg01;
                background: $theme;
                border: 1px solid $theme;
            }
            .uedit {
                position: relative;
                z-index: 1;
            }
            .check-sit {
                cursor: pointer;
            }
        }
    }

    .topic {
        width: 100%;
    }

    .title {
        width: 100%;
        height: 30px;
        background: #f2f4f7;
        margin: 15px 0;
        text-align: center;
        line-height: 30px;
        border-radius: 0 0 30px 30px;
    }

    .sit-list {
        width: 725px;
        margin: 5px auto;
        text-align: center;
        line-height: 24px;
        .sit-l {
            width: 24px;
            height: 24px;
            background: #ccc;
        }
        .sit-r {
            margin-left: 40px;
            .sit-item {
                display: block;
                width: 25px;
                height: 24px;
                margin-right: 5px;
                background: #ccc;
                background: url(./../../../../assets/image/sitBg.png);
                &.curr {
                    background: url(./../../../../assets/image/sitNoBg.png) !important;
                }
            }
        }
    }

    .info-list {
        .img {
            margin: 10px 0;
        }
    }
</style>
