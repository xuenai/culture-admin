<!--
 * @Author: 任智勇
 * @since: 2019-05-31 10:04:22
 * @LastAuthor: 陈艳玲
 * @lastTime: 2019-11-25 11:45:01
 -->
<template>
    <div class="pd20 container">
        <h3 class="title">基本信息</h3>
        <Form ref="params" :label-width="150" :model="params" :rules="ruleValidate">
            <FormItem label="创建者" class="mt20" prop="createCompany">
                <Select
                        class="creator w300"
                        :disabled="!isSite"
                        v-model="params.createCompany"
                        @on-change="setCom"
                >
                    <Option v-for="item in orgList" :key="item.id" :value="item.id">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="话题名称" class="mt20" prop="name">
                <Input class="w300" placeholder="请输入话题名称" :maxlength="30" v-model="params.name"/>
            </FormItem>
            <FormItem label="话题类型" class="mt20" prop="type">
                 <span class="choice-tag" :class="params.topicType==item.id?'active':''"
                              v-for="(item,index) in topicTypeList" :key="index"
                              @click="getTypeTags(item.id)">{{item.labelName}}</span>
            </FormItem>
            <FormItem label="话题主图" class="mt20" prop="image">
                <uploadImg :limit="1" @getImagesList="getImage" :defaultImage="params.image"></uploadImg>
            </FormItem>
            <FormItem label="活动日期" class="mt20" prop="startDate">
                <DatePicker
                        class="w300"
                        type="daterange"
                        placement="bottom-end"
                        placeholder="请选择活动日期"
                        :value="[params.startDate, params.endDate]"
                        @on-change="setDate"
                ></DatePicker>
            </FormItem>
            <FormItem label="活动时间" class="mt20">
                <TimePicker
                        class="w300"
                        type="timerange"
                        format="HH:mm:ss"
                        confirm
                        placeholder="开始时间"
                        :value="[params.startTime, params.endTime]"
                        @on-change="setTime"
                ></TimePicker>
            </FormItem>
            <FormItem label="话题介绍" class="mt20" prop="introduce">
                <div>
                    <uedit v-model="params.introduce" id="uedit1" @getContentTxt="getContentTxt"></uedit>
                </div>
            </FormItem>
            <FormItem label="话题规则" class="mt20" prop="rule">
                <div>
                    <uedit v-model="params.rule" id="uedit2"></uedit>
                </div>
            </FormItem>
            <FormItem label="话题排序" class="mt20" v-if="$store.state.app.userInfo.dataType == 'SITE'">
                <InputNumber
                        class="w300"
                        placeholder="话题排序"
                        :min="1"
                        :max="999"
                        v-model="params.sort"
                        style="width: 250px"
                ></InputNumber>
            </FormItem>
            <FormItem class="mt20">
                <Button type="primary" @click="checkedParams(1)">保存</Button>
                <Button type="primary" class="ml20" @click="checkedParams(2)" v-if="showDraft">存草稿</Button>
                <!-- <Button type="primary" @click="checkedParams(1)" v-if="checkedStatus">保存</Button> -->
                <Button class="ml20" @click="goHistory">返回</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue} from "vue-property-decorator";
    import uedit from "../../../../components/ueditor/ueditor.vue";
    import uploadImg from "@components/upload/upload-image.vue";
    import {saveTopicList, currentOrg, getTopicDesc} from "@service/topic";
    import {auditTopicUpdateData} from "@service/audit";
    import {getTagsSelect} from "@service/common";
    @Component({
        components: {
            uedit,
            uploadImg
        }
    })
    export default class add extends Vue {
        private isSite = process.env.VUE_APP_STATUS === "SITE";
        private first: Boolean = false;
        private orgList: any = [];
        private checkedStatus: Boolean = false; // 审核修改保存
        private params: any = {
            status: 1,
            rule: "",
            introduce: "",
            endTime: "",
            startTime: "",
            endDate: "",
            startDate: "",
            image: "",
            name: "",
            createCompany: this.$store.state.app.userInfo.orgId || -1,
            id: "",
            auditManageId: "",
            sort: 999,
            topicType:""
        };
        // 是否显示保存草稿
        get showDraft() {
            return !Boolean(this.params.id) || [3,7,8].includes(this.params.status)
        }
        private getContentTxt(txt: any) {
            console.log(txt)
        }

        // 验证
        private ruleValidate: any = {
            createCompany: [
                {
                    required: true,
                    message: "请将信息填写完整",
                    trigger: "blur",
                    validator: this.checkedCreateCompany
                }
            ],
            name: [{required: true, message: "请将信息填写完整", trigger: "blur"}],
            image: [
                {
                    required: true,
                    message: "请将信息填写完整",
                    trigger: "blur",
                    validator: this.checkedImage
                }
            ],
            rule: [
                {
                    required: true,
                    message: "请将信息填写完整",
                    trigger: "blur",
                    validator: this.checkedRule
                }
            ],
            introduce: [
                {
                    required: true,
                    message: "请将信息填写完整",
                    trigger: "blur",
                    validator: this.checkedIntro
                }
            ],
            startDate: [
                {
                    required: true,
                    message: "请将信息填写完整",
                    trigger: "blur",
                    validator: this.checkedDate
                }
            ]
        };

        // 返回
        private goHistory() {
            this.$router.go(-1);
        }

        private checkedDate(rule: any, value: any, callback: any) {
            if (!this.params.startDate || !this.params.endDate) {
                return callback(new Error("请将信息填写完整"));
            }
            callback();
        }

        private checkedCreateCompany(rule: any, value: any, callback: any) {
            if (!this.params.createCompany) {
                return callback(new Error("请将信息填写完整"));
            }
            callback();
        }

        private checkedImage(rule: any, value: any, callback: any) {
            if (!this.params.image) {
                return callback(new Error("请将信息填写完整"));
            }
            callback();
        }

        private checkedIntro(rule: any, value: any, callback: any) {
            if (!this.params.introduce) {
                return callback(new Error("请将信息填写完整"));
            }
            callback();
        }

        private checkedRule(rule: any, value: any, callback: any) {
            if (!this.params.rule) {
                return callback(new Error("请将信息填写完整"));
            }
            callback();
        }

        // 上传图片
        private getImage(e: any) {
            this.params.image = e.join(",");
            (this.$refs.params as any).validateField("image");
        }
        //话题类型标签
        private getTypeTags(value:any){
            this.params.topicType=value
        }
        private topicTypeList:Array<object>=[];
        private getTopicTypeList(){
            getTagsSelect({
                    resourceType: "CONTENT_TYPE_TOPIC"
                }).then((res:any)=>{
                    if(res.code===0){
                        this.topicTypeList=res.datas;
                    }
            })
        }
        // 提交
        private checkedParams(type: Number) {
            // 名称
            (this.$refs.params as any).validate((valid: any) => {
                if (!valid) {
                    this.$Message.error("请将信息填写完整！");
                    return;
                }
                if (!this.checkedStatus) {
                    this.summitTopic(type);
                } else {
                    this.summitTopicAudit(type);
                }
            });
        }

        mounted() {
            console.log(this.$store.state.app.userInfo)
            // this.params.createCompany = this.$store.state.app.userInfo.orgId || -1;
            this.currentOrg();
            if (this.$route.query.id) {
                this.getDesc();
            }
            if (this.$route.query.topicId) {
                this.checkedStatus = true;
                this.params.auditManageId = this.$route.query.topicId;
            }
            this.getTopicTypeList();
        }

        //   详情
        private getDesc() {
            getTopicDesc({
                id: this.$route.query.id
            }).then(data => {
                delete data.data.auditRecordsVo;
                if (this.$route.query.topicId) {
                    data.data.auditManageId = this.$route.query.topicId;
                }
                this.params = data.data;
            });
        }

        //   组织架构
        private currentOrg() {
            currentOrg().then((data: any) => {
                this.orgList = data.datas;
            });
        }

        //   日期
        private setDate(e: any) {
            this.params.startDate = e[0].trim();
            this.params.endDate = e[1].trim();
            (this.$refs.params as any).validateField("startDate");
        }

        private setTime(e: any) {
            this.params.startTime = e[0];
            this.params.endTime = e[1];
        }

        //   提交内容
        private summitTopic(type: Number) {
            if (type === 2) {
                this.params.status = 3;
            }
            this.params.startDate =
                this.params.startDate + " " + this.params.startTime;
            this.params.endDate =
                this.params.endDate + " " + this.params.endTime;
            saveTopicList(this.params).then(data => {
                if (data.code === 0) {
                    this.$Message.success("保存成功!");
                    if (this.$route.query.id) {
                        this.$router.go(-1);
                    } else {
                        this.$router.push({path: '/topic-list'})
                    }
                }
            });
        }

        // 保存审核编辑
        private summitTopicAudit(type: Number) {
            if (type === 2) {
                this.params.status = 3;
            }
            this.params.startDate =
                this.params.startDate + " " + this.params.startTime || "00:00:00";
            this.params.endDate =
                this.params.endDate + " " + this.params.endTime || "00:00:00";
            auditTopicUpdateData(this.params).then(data => {
                if (data.code === 0) {
                    this.$Message.success("保存成功!");
                    this.$router.go(-1);
                }
            });
        }

        private setCom() {
            (this.$refs.params as any).validateField("createCompany");
        }
    }
</script>

<style scoped lang="scss">
    .container {
        .title {
            border-bottom: 1px solid $borderLight;
            padding: 15px 0 15px 10px;
        }
    }

    .btn {
        width: 150px;
    }

    .w300 {
        width: 300px;
    }

    .w200 {
        width: 200px;
    }

    .uedit {
        position: relative;
        z-index: 1;
        width: 800px;
    }
</style>
