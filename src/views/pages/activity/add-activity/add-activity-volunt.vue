<!--
 * @Author: 任智勇
 * @since: 2019-05-23 09:02:49
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-16 15:26:01
 * @title: 发现-活动管理
 -->
<template>
    <div class="activity page-activity-volunt">
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
                    <FormItem label="活动类型">
                        <span class="detail-text-text">{{getStatusTxt[$route.query.classify]}}</span>
                    </FormItem>
                    <FormItem label="活动方式">
                        <span class="detail-text-text">{{getStatusTxt[$route.query.method]}}</span>
                    </FormItem>
                    <FormItem label="创建者" required>
                        <!-- 回显修改时不允许再次编辑 -->
                        <Select v-model="formData.createCompany" @on-change="createCompanyChange" :disabled="!isSite || keyContrll" filterable style="width: 250px">
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
                    <FormItem label="活动分类" prop="activityClassify">
                        <Select style="width: 250px" v-model="formData.activityClassify" disabled>
                            <Option :value="item.id"
                                    v-for="item in activityClassify"
                                    :key="item.id">{{item.labelName}}
                            </Option>
                        </Select>
                        <span class="ml20 linkTxt" @click="AddTagShow = true">添加分类</span>
                    </FormItem>
                    <FormItem label="服务类别" prop="tag" class="clearfix">
                        <p  style="display: inline-block;"
                            class="tags-box"
                            v-for="items in tags"
                            :key="items.id"
                            @click="toggleTag(items.id)"
                        >
                            <span class="choice-tag" :class="{'active': formData.tag.split(',').includes(''+items.id)}">{{items.labelName}}</span>
                        </p>
                    </FormItem>
                    <FormItem label="所属志愿团队" prop="voluntTeamStr">
                        <Input placeholder="请选择活动所属志愿团队，可多选" readonly style="width: 250px"
                               :disabled="keyContrll"
                               clearable
                               :title="formData.voluntTeamName"
                               @on-clear="formData.voluntTeamStr = ''"
                               v-model="formData.voluntTeamName"
                               @on-focus="!keyContrll && (voluntShow0 = true)"/>
                    </FormItem>
                    <FormItem label="所属场所" prop="activityName">
                        <Input placeholder="请选择所属场所" readonly style="width: 250px"
                               clearable
                               :title="formData.activityName"
                               @on-clear="formData.resourceParams = ''"
                               v-model="formData.activityName"
                               @on-focus="place = true"/>
                        <!--<Input placeholder="请选择所属场所" readonly style="width: 250px"
                               :disabled="keyContrll"
                               v-model="formData.activityName"/>
                        <span v-if="keyContrll" class="ml20 linkTxt" style="color: #c3c3c3;cursor: not-allowed">查看关联场所</span>
                        <span v-else class="ml20 linkTxt" @click="place = true">查看关联场所</span>-->
                    </FormItem>
                    <FormItem label="所属社团">
                        <Input placeholder="请选择活动所属社团，可多选" readonly style="width: 250px"
                               clearable
                               :title="formData.associationName"
                               @on-clear="formData.associationStr = ''"
                               v-model="formData.associationName"
                               @on-focus="voluntShow1 = true"/>
                        <!--<Input placeholder="请选择活动所属社团，可多选" readonly style="width: 250px"
                               :disabled="keyContrll"
                               v-model="formData.associationName"/>
                        <span v-if="keyContrll" class="ml20 linkTxt" style="color: #c3c3c3;cursor: not-allowed">查看社团</span>
                        <span v-else class="ml20 linkTxt" @click="voluntShow1 = true">查看社团</span>-->
                    </FormItem>
                    <FormItem label="招募时间" required prop="signStartTime">
                        <DatePicker
                                :disabled="keyContrll"
                                :value="[formData.signStartTime, formData.signEndTime]"
                                type="datetimerange"
                                format="yyyy-MM-dd HH:mm"
                                @on-change="setSignTime"
                                placeholder="请选择招募起始日期、时间" style="width: 300px">
                        </DatePicker>
                    </FormItem>
                    <FormItem label="招募人数" prop="stock">
                        <Input
                            placeholder="请输入招募人数"
                            style="width: 250px"
                            v-model="formData.stock"
                            type="text"
                            :maxlength="8"
                        />
                    </FormItem>
                    <FormItem label="服务时长" prop="serviceTime">
                        <Input
                                :disabled="keyContrll"
                                placeholder="请输入服务时长小时数"
                                style="width: 250px"
                                v-model="formData.serviceTime"
                                type="text"
                                :maxlength="4"
                        />
                        小时
                    </FormItem>
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
                        <Map
                            id="map1"
                            :lab="true"
                            :region="formData.region"
                            :address="[formData.longitude,formData.latitude]"
                            @getAddress="getAddress"
                        ></Map>
                    </FormItem>
                    <!--<FormItem label="备注说明">
                        <Input
                                type="textarea"
                                style="width: 250px;"
                                v-model="formData.remark"
                                :maxlength="200"
                                :autosize="{minRows: 5,maxRows: 10}"
                                placeholder="请输入参与成功需要注意的特殊信息，200字以内"
                        />
                    </FormItem>-->

                    <div class="mt20">
                        <p class="title-tool"><i class="cloud-icon">&#xe697;</i> 活动设置</p>
                        <div class="add-content-detail-content">
                            <FormItem v-if="siteInfo.creditStatus === 1" label="" prop="faithAuditStatus" class="switch">
                                <div class="label"><img src="@assets/image/credit.png" alt="">诚信免审</div>
                                <i-switch v-model="formData.faithAuditStatus" true-color="#19BE6B" size="large">
                                    <span slot="open">开启</span>
                                    <span slot="close">关闭</span>
                                </i-switch>
                                <span class="tip">（只有诚信分值达到设置标准的志愿者参加活动不需要审核，直接申请成功）</span>
                                <transition name="ani1">
                                    <div v-if="formData.faithAuditStatus" class="num-box">
                                        <span>志愿者诚信分值达</span>
                                        <InputNumber v-model="formData.faithAuditValue" class="input" :max="9999" :min="0"></InputNumber>
                                        <span>分以上可享受预约免审核权益</span>
                                        <span class="levels ml20 linkTxt" @click="CreditLevelShow = true">用户诚信等级</span>
                                    </div>
                                </transition>
                            </FormItem>
                            <FormItem label="取消设置" prop="cancelStatus">
                                <RadioGroup v-model="formData.cancelStatus">
                                    <Radio label="0" :disabled="keyContrll">不可取消</Radio>
                                    <Radio label="1" :disabled="keyContrll">随时取消</Radio>
                                    <Radio label="2" :disabled="keyContrll">活动开始24小时前可取消</Radio>
                                    <Radio label="3" :disabled="keyContrll">自定义可取消时间：活动开始<Input :disabled="keyContrll" v-model="formData.cancelTime" type="text" style="width: 60px;" />小时前可取消</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="核销设置" prop="validStartValue">
                                <div class="clearfix valid-time-set">
                                    <Input
                                            :disabled="keyContrll" v-model="formData.validStartValue" style="width: 250px;margin-right: 20px;" class="fl">
                                    <span slot="prepend">预约开始时间前</span>
                                    <Select
                                            :disabled="keyContrll" v-model="formData.validTimeStartType" slot="append" style="width: 70px">
                                        <Option value="VALID_TIME_TYPE_HOURS">小时</Option>
                                        <Option value="VALID_TIME_TYPE_MINUTE">分钟</Option>
                                    </Select>
                                    </Input>
                                    <Input
                                            :disabled="keyContrll" v-model="formData.validEndValue" style="width: 250px;" class="fl">
                                    <span slot="prepend">预约开始时间后</span>
                                    <Select
                                            :disabled="keyContrll" v-model="formData.validTimeEndType" slot="append" style="width: 70px">
                                        <Option value="VALID_TIME_TYPE_HOURS">小时</Option>
                                        <Option value="VALID_TIME_TYPE_MINUTE">分钟</Option>
                                    </Select>
                                    </Input>
                                </div>
                            </FormItem>
                        </div>
                    </div>

                    <div class="mt20">
                        <p class="title-tool"><i class="cloud-icon">&#xe697;</i> 活动单位</p>
                        <div class="add-content-detail-content">
                            <FormItem label="发起单位" prop="sponsor">
                                <Input
                                v-model="formData.sponsor"
                                placeholder="请输入发起志愿活动的单位名称"
                                :maxlength="50"
                                style="width: 250px"/>
                            </FormItem>
                            <FormItem label="活动负责人" prop="liableName">
                                <Input
                                v-model="formData.liableName"
                                placeholder="请输入活动负责人姓名"
                                :maxlength="50"
                                style="width: 250px"/>
                            </FormItem>
                            <FormItem label="联系电话" prop="phone">
                                <Input
                                v-model="formData.phone"
                                placeholder="请输入活动负责人电话"
                                :maxlength="50"
                                style="width: 250px"
                                />
                            </FormItem>
                        </div>
                    </div>
                    <div class="mt20">
                        <p class="title-tool"><i class="cloud-icon">&#xe697;</i> 活动介绍</p>
                        <div class="add-content-detail-content">
                            <FormItem>
                                <UploadImg2 :defaultImage="defaultImage" @getImagesList="getImagesList" :limit="9"></UploadImg2>
                                <FormItem label="活动主图" class="activity-img" prop="images"></FormItem>
                            </FormItem>

                            <FormItem label="活动介绍" prop="introduce">
                                <div class="uedit">
                                    <Ueditor v-model="formData.introduce" id="uedit1"></Ueditor>
                                </div>
                            </FormItem>
                            <FormItem label="温馨提示" prop="hint">
                                <div class="uedit">
                                    <Ueditor v-model="formData.hint" id="uedit2"></Ueditor>
                                </div>
                            </FormItem>
                        </div>
                    </div>

                    <FormItem>
                        <Button type="primary" @click="activitySaveStatus1">保存</Button>
                        <Button type="primary" style="margin-left: 8px"  v-if="showDraft" @click="activitySaveStatus2">存草稿</Button>
                        <Button style="margin-left: 8px" @click="goBack">返回</Button>
                    </FormItem>
                </Form>
            </div>
        </div>
        <uninPlace :show="place" :orgId="formData.createCompany"
                   :defaultChoose="getPlaceIds"
                   @onOkClick="onOkClick"
                   @onClose="place=false"></uninPlace>
        <Voluntteam :show="voluntShow0" :selectIds="voluntIds" @onClose="voluntShow0 = false" @onOkClick="getVolunt" :type="0"></Voluntteam>
        <Voluntteam :show="voluntShow1" :selectIds="associatioIds" @onClose="voluntShow1 = false" @onOkClick="getAssociation" :type="1"></Voluntteam>
        <CreditLevel :show="CreditLevelShow" @close="CreditLevelShow = false"></CreditLevel>
        <AddTag v-model="AddTagShow" @getTag="item => activityClassify.push(item)"></AddTag>
    </div>
</template>

<script lang='ts'>
    import {Component,Watch, Vue} from "vue-property-decorator";
    import Map from "@components/map/marker.vue";
    import Ueditor from "@components/ueditor/ueditor.vue";
    import uninPlace from "@components/uninPlace/uninPlace.vue";
    import VDistpicker from "@components/distPicker/distPicker.vue";
    import UploadImg2 from "@components/upload/upload-image2.vue";
    import Voluntteam from "@components/pop/volunt-team.vue";
    import CreditLevel from "@components/pop/credit-level.vue";
    // import AddTag from "@components/add-activityclass/index.vue";
    import AddTag from "./addTag.vue";

    import {activitySave, getActivityDetial} from "@service/activity";
    import {getTagsSelect} from "@service/common";
    import {createrList} from "@service/content";
    import {getStatusTxt} from "@util/comm";

    interface imgType {
        id: number,
        url: string,
        name?: string
    }

    @Component({
        components: {
            Map,
            Ueditor,
            uninPlace,
            VDistpicker,
            UploadImg2,
            Voluntteam,
            CreditLevel,
            AddTag
        }
    })
    export default class FreeBooking extends Vue {
        private isSite = (this.$store.state.app.userInfo.dataType === 'SITE');
        private siteInfo = this.$store.state.app.siteInfo;
        //等级弹窗显示布尔值
        private CreditLevelShow: boolean = false;
        //添加活动分类弹窗显示布尔值
        private AddTagShow: boolean = false;
        // 表单验证
        private ruleValidate:object = {
            name: [
                {required: true, message: "请将信息填写完整", trigger: "blur"},
                {type:'string',max:50,message:'最多输入50个字符'}
            ],
            activityClassify: [{required: true, message: "请将信息填写完整"}],
            tag: [{required: true, message: "请将信息填写完整"}],
            voluntTeamStr: [{required: true, message: "请将信息填写完整", trigger: "change|blur"}],
            signStartTime: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            signEndTime: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            stock: [
                { required: true, message: '请将信息填写完整' }, 
                { message: '只能输入1-99999999之间的整数', trigger: 'change', pattern:/^\d{1,8}$/}
            ],
            serviceTime: [
                {required: true,pattern: /^(([1-9]\d*\.\d+$)|([1-9]\d*$)|(0\.\d+$))$/, trigger: 'blur', message: "请将信息填写完整，只能填写数字，不能带空格"},
                {required: true,validator: this.vakudateServiceTime, trigger: 'blur'}
            ],
            useStartTime: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            useEndTime: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            address: [
                {required: true, message: "请将信息填写完整", trigger: "blur"},
                {validator: this.checkRegion, message: "请选择地区", trigger: "blur"}
            ],
            cancelStatus: [
                {required: true, message: "请将信息填写完整"},
                {validator: this.checkCancel, message: "请设置多少小时内", trigger: "change"}
            ],
            validStartValue: [
                {validator: this.validNum, message: '', trigger: "blur"}
            ],
            sponsor: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            liableName: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            phone: [{message: "请正确填写手机号", trigger: "blur", pattern: /^1[3456789]\d{9}$/}],
            images: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            introduce: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            longitude: [{required: true, message: "请将信息填写完整"}],
            faithAuditStatus: [{validator: this.validFaithUse, message: '请设置分值', trigger: "change"}]
        };
        // 验证诚信优享分值
        private validFaithUse (rule: any, value: any, callback: Function) {
            if (this.formData.faithAuditStatus && !this.formData.faithAuditValue) {
                return callback(new Error("请设置分值"));
            }
            callback();
        }
        // 检测招募人数
        vakudateStock (rule: any, value: any, callback: Function) {
            if (value - 0 < 1) {
                callback(new Error('招募人数必须大于等于1'));
            } else {
                callback();
            }
        }
        // 检测招募时长数
        vakudateServiceTime (rule: any, value: any, callback: Function) {
            if (value - 0 < 1) {
                callback(new Error('服务时长必须大于0'));
            } else {
                callback();
            }
        }
        // 是否显示保存草稿
        get showDraft() {
            return !Boolean(this.formData.id) || [3].includes(this.formData.status)
        }
        mounted() {
            this.formData.type = this.$route.query.classify || '';
            this.formData.method = this.$route.query.method || '';
            this.formData.id = this.$route.query.id || '';
            this.formData.auditFlag = this.$route.query.auditFlag || ''; // 保存审核内容时 传1
            this.getActivityClassify()
            this.getTagsSelect()
            this.getcreaterList()

            // 编辑时数据回显
            if (this.formData.id) {
                this.getActivityDetial()
            }
        }

        private voluntShow0:boolean = false
        private voluntShow1:boolean = false

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

        // 根据code获取状态描述
        private getStatusTxt = getStatusTxt

        // 创建者下拉匹配框数据
        private siteList: Array<object> = [];
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
            resourceParams: "", // 资源类型数据-活动场所
            tag: "", // 标签
            phone: "", // 联系电话
            region: "", // 地区编码
            regionPath: "", // 地区编码路径
            address: "", // 活动地址
            longitude: "", // 活动经度
            latitude: "", // 活动维度
            stock: 1, // 活动库存 招募人数
            remark: "", // 备注说明
            sponsor: "", // 发起单位
            liableName: "", // 负责人姓名
            images: "", // 活动主图
            introduce: "", // 活动介绍
            hint: "", // 温馨提示
            limitNum: 1, // 温馨提示
            serviceTime: '', // 温馨提示

            signStartTime: "",
            signEndTime: "",
            useStartTime: "",
            useEndTime: "",
            cancelStatus: "",
            cancelTime: "",
            voluntTeamStr: "",
            voluntTeamName: "",
            associationStr: "",
            associationName: "",
            validTimeStartType: "VALID_TIME_TYPE_HOURS",
            validStartValue: "",
            validEndValue: "",
            validTimeEndType: "VALID_TIME_TYPE_HOURS",

            faithAuditStatus: false,
            faithAuditValue: 500
        };
        // 创建者变化时
        private createCompanyChange(){
            Object.assign(this.formData, {activityName:"", resourceParams: ""})
        }

        // 回显修改的时候，部分字段不嫩修改 0可以修改， 1不能修改
        private modKeyControll: number = 0
        // 控制字段是否能编辑
        get keyContrll () { // keyContrll:true表示不能修改
          return Boolean(this.formData.id) && Boolean(this.modKeyControll)
        }

        // 场所资源弹窗回显的
        get getPlaceIds() {
            let res = []
            if (this.formData.resourceParams && this.formData.resourceParams.length) {
                res = JSON.parse(this.formData.resourceParams).map((item:any) => ({
                    resourceType: item.resourceType,
                    id: item.resourceId,
                    name: item.name,
                }))
            }
            return res
        }
        // 志愿团回显
        get voluntIds() {
            return this.formData.voluntTeamStr.split(',')
        }
        // 社团回显
        get associatioIds() {
            return this.formData.associationStr.split(',')
        }
        // 回显图片
        private defaultImage:Array<any> = []

        // 获取详情
        private getActivityDetial() {
            getActivityDetial({id: this.formData.id}).then((res: any) => {
                if (res.code === 0) {
                    res.data.faithAuditStatus = Boolean(res.data.faithAuditStatus)
                    this.modKeyControll = res.data.orderCount;
                    if (typeof res.data.cancelStatus === 'number') res.data.cancelStatus += '';
                    Object.assign(this.formData, res.data);
                    if (this.formData.images) {
                        this.defaultImage = this.formData.images.split(',').map((img: any, i: number) => ({
                            id: 'id-' + i,
                            url: img
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
                    if (saveData.signStartTime.length < 19) saveData.signStartTime += ':00';
                    if (saveData.signEndTime.length < 19) saveData.signEndTime += ':00';
                    if (saveData.useStartTime.length < 19) saveData.useStartTime += ':00';
                    if (saveData.useEndTime.length < 19) saveData.useEndTime += ':00';
                    saveData.faithAuditStatus = Number(saveData.faithAuditStatus)
                    if (this.siteInfo.creditStatus !== 1) { // 未开启诚信体系
                        saveData.faithAuditStatus = undefined
                        saveData.faithAuditValue = undefined
                    }
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

        // 招募时间
        private setSignTime (time: Array<string>) {
          this.formData.signStartTime = time[0]
          this.formData.signEndTime = time[1];
          (this.$refs.formData as any).validateField("signStartTime");
        }

        // 活动时间
        private setActivityTime (time: Array<string>) {
          this.formData.useStartTime = time[0]
          this.formData.useEndTime = time[1];
          (this.$refs.formData as any).validateField("useStartTime");
        }
        // 检查核销时间设置
        private validNum (rule: any, value: any, callback: Function) {
            let start = String(this.formData.validStartValue).trim();
            if (/^[1-9]\d*$/.test(start)) {
                if (parseFloat(start) > 9999) {
                    return callback(new Error("请填写0-9999的整数"));
                }
            } else if (start) {
                return callback(new Error("请填写大于0的整数"));
            }

            let end = String(this.formData.validEndValue).trim();
            if (/^[1-9]\d*$/.test(end)) {
                if (parseFloat(end) > 9999) {
                    return callback(new Error("请填写0-9999的整数"));
                }
            } else if (end) {
                return callback(new Error("请填写大于0的整数"));
            }
//            let reg = /(([^0]\d+\.\d+$)|([1-9]+$)|(0\.\d+$))/ // 数字验证 比如：10.15 120 0.2611

            /*开始时间*/
            /*let r1 = reg.test(this.formData.validStartValue.trim())
             if (r1) { // 通过数字验证
             if (parseFloat(this.formData.validStartValue.trim()) > 9999) {
             return callback(new Error("请填写0-9999的数字"));
             } else if (this.formData.validStartValue.trim().indexOf('.') > -1) {
             if (this.formData.validStartValue.trim().split('.')[1].length > 2) {
             return callback(new Error("最小精确到0.01"));
             }
             }
             } else if (this.formData.validStartValue.trim()){
             return callback(new Error("请填写大于0的数字"));
             }*/
            /*结束时间*/
            /*let r2 = reg.test(this.formData.validEndValue.trim())
             if (r2) { // 通过数字验证
             if (parseFloat(this.formData.validEndValue.trim()) > 9999) {
             return callback(new Error("请填写0-9999的数字"));
             } else if (this.formData.validEndValue.trim().indexOf('.') > -1) {
             if (this.formData.validEndValue.trim().split('.')[1].length > 2) {
             return callback(new Error("最小精确到0.01"));
             }
             }
             } else if (this.formData.validEndValue.trim()){
             return callback(new Error("请填写大于0的数字"));
             }*/

            this.formData.validStartValue = start;
            this.formData.validEndValue = end;
            callback(); // 直接过
        }

        // 活动分类
        private activityClassify = []
        private getActivityClassify() {
            getTagsSelect({
                resourceType: 'CONTENT_TYPE_ACTIVITY',
                labelType: 'ACTIVITY_CLASSIFY'
            }).then((res: any) => {
                if (res.code === 0) {
                    this.activityClassify = res.datas
                    this.formData.activityClassify = res.datas.filter((item:any)=>item.labelName === '志愿服务')[0].id
                }
            })
        }

        // 点击服务类别标签
        private toggleTag(id: string) {
          id = String(id)
          let checked = this.formData.tag.split(',').filter((id:any) => id)
          let has = checked.includes(id)
          if (has) {
              checked.splice(checked.indexOf(id), 1)
          } else {
              if (checked.length >= 3) {
                  this.$Message.info('最多选择三个类别！');
                  return
              };
              checked.push(id)
          }
          this.formData.tag = checked.toString();
          (this.$refs.formData as any).validateField("tag");
        }
        // 服务类别标签
        private tags: Array<object> = []
        // 获取服务类别标签
        private getTagsSelect() {
            getTagsSelect({
                resourceType: 'CONTENT_TYPE_ACTIVITY',
                labelType: 'SERVICE_TYPE'
            }).then((res: any) => {
                if (res.code === 0) {
                    this.tags = res.datas
                }
            })
        }

        // 获取活动地点经纬度
        private getAddress(e: any) {
            this.formData.longitude = e.lnglat.lng;
            this.formData.latitude = e.lnglat.lat;
        }

        // 地区region改变
        private pickerChange(e: any) {
            this.formData.region = e.region;
        }

        // 检查地区选择
        private checkRegion (rule: any, value: any, callback: Function) {
            if (!this.formData.region) {
                return callback(new Error("请将信息填写完整"));
            }
            callback();
        }

        // 检查自定义时间
        private checkCancel (rule: any, value: any, callback: Function) {
            if (this.formData.cancelStatus == 3 && !this.formData.cancelTime) {
                return callback(new Error("请将信息填写完整"));
            }
            if (this.formData.cancelStatus != 3) {
                this.formData.cancelTime = ''
            }
            callback();
        }

        // 选择图片
        private getImagesList(list: Array<{ url: string }>) {
            this.formData.images = list.map((data: any) => data.url).toString()
        }
    }
</script>

<style lang="scss">
    /*志愿页编辑页样式*/
    .page-activity-volunt {
        .activity-img {
            margin: 0!important;
            .ivu-form-item-label {
                position: absolute;
                left: -100px;
                top: 0;
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
    @-webkit-keyframes bounceInRight {
        0%,60%,75%,90%,to {
            -webkit-animation-timing-function: cubic-bezier(.215,.61,.355,1);
            animation-timing-function: cubic-bezier(.215,.61,.355,1)
        }

        0% {
            opacity: 0;
            -webkit-transform: translate3d(3000px,0,0);
            transform: translate3d(3000px,0,0)
        }

        60% {
            opacity: 1;
            -webkit-transform: translate3d(-25px,0,0);
            transform: translate3d(-25px,0,0)
        }

        75% {
            -webkit-transform: translate3d(10px,0,0);
            transform: translate3d(10px,0,0)
        }

        90% {
            -webkit-transform: translate3d(-5px,0,0);
            transform: translate3d(-5px,0,0)
        }

        to {
            -webkit-transform: translateZ(0);
            transform: translateZ(0)
        }
    }
    @keyframes bounceInRight {
        0%,60%,75%,90%,to {
            -webkit-animation-timing-function: cubic-bezier(.215,.61,.355,1);
            animation-timing-function: cubic-bezier(.215,.61,.355,1)
        }

        0% {
            opacity: 0;
            -webkit-transform: translate3d(3000px,0,0);
            transform: translate3d(3000px,0,0)
        }

        60% {
            opacity: 1;
            -webkit-transform: translate3d(-25px,0,0);
            transform: translate3d(-25px,0,0)
        }

        75% {
            -webkit-transform: translate3d(10px,0,0);
            transform: translate3d(10px,0,0)
        }

        90% {
            -webkit-transform: translate3d(-5px,0,0);
            transform: translate3d(-5px,0,0)
        }

        to {
            -webkit-transform: translateZ(0);
            transform: translateZ(0)
        }
    }
    .ani1-enter-active {
        -webkit-animation-duration: .5s;
        animation-duration: .5s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        -webkit-animation-name: bounceInRight;
        animation-name: bounceInRight
    }

    @-webkit-keyframes fadeOutDown {
        0% {
            opacity: 1
        }

        to {
            opacity: 0;
            -webkit-transform: translate3d(0,100%,0);
            transform: translate3d(0,100%,0)
        }
    }
    @keyframes fadeOutDown {
        0% {
            opacity: 1
        }

        to {
            opacity: 0;
            -webkit-transform: translate3d(0,100%,0);
            transform: translate3d(0,100%,0)
        }
    }
    .ani1-leave-active {
        -webkit-animation-duration: .5s;
        animation-duration: .5s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        -webkit-animation-name: fadeOutDown;
        animation-name: fadeOutDown
    }

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
                height: 32px;
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

