<template>
    <div class="perform-wrap">
        <!--景点详情-->
        <attractionsDetail :audit="audit"></attractionsDetail>
        <!--审核通过/不通过-->
        <div class="form-wrap pd20">
            <Form :label-width="100">
                <FormItem class="item result-btn" label="审核结果：">
                    <Button class="pass" :class="data.isPass ? '':'active'" @click="setPass(false)">通过</Button>
                    <Button class="un-pass ml20" :class="data.isPass ? 'active':''" @click="setPass(true)">不通过
                    </Button>
                </FormItem>
                <FormItem class="item mt10" label="" v-if="data.isPass">
                    <Radio-group v-model="data.unPass">
                        <Radio label="back">回退</Radio>
                        <Radio label="end">终止</Radio>
                    </Radio-group>
                </FormItem>
                <FormItem class="item mt20" label="审核备注：" v-if="data.isPass" :required="true" :error="error">
                    <Input type="textarea" :maxlength="200" :rows="4" class="remark" v-model="params.auditResult" placeholder="请写下审核备注，不通过时审核备注必须填写。"/>
                    <span>200字以内</span>
                </FormItem>
                <FormItem class="item mt20" label="审核备注：" v-else>
                    <Input type="textarea" :maxlength="200" :rows="4" class="remark" v-model="params.auditResult" placeholder="请写下审核备注，不通过时审核备注必须填写。"/>
                    <span>200字以内</span>
                </FormItem>
                <!-- 快捷回复 -->
                <fastReply @reply="getReply"></fastReply>
                <!-- <FormItem class="item submit mt20" v-if="!data.isPass">
                    <Button type="primary" class="btn" @click="saveAudit">审核</Button>
                    <Button type="info" class="btn ml20" @click="goEdit">修改</Button>
                </FormItem>
                <FormItem class="item submit mt20" v-if="data.isPass">
                    <Button type="primary" class="btn" @click="saveAudit">保存</Button>
                    <Button type="default" class="btn-cancel btn ml20" @click="cancel">取消</Button>
                </FormItem> -->
                <FormItem class="item submit mt20">
                    <Button type="primary" class="btn" @click="saveAudit()" v-if="!data.isPass">审核</Button>
                    <Button type="primary" class="btn" @click="saveAudit()" v-else>保存</Button>
                    <Button v-if="isSITE && userInfo.superSubmitButton && !data.isPass" @click="saveAudit(2)" type="info">审核并提交上级审核</Button>
                    <Button type="info" class="btn ml20" @click="goEdit">修改</Button>
                    <Button type="default" class="btn-cancel btn ml20" @click="cancel">返回</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import auditHead from "@views/pages/common/result-head.vue";
    import scenicDetail from '@views/pages/place/scenic/scenic-index/detail.vue'
    import attractionsDetail from '@views/pages/place/scenic/attractions/detail.vue'
    import fastReply from "@views/pages/common/fast-reply.vue";
    import {saveAuditProcess} from '@service/audit'
    import { AppModule } from "@store/modules/app";

    @Component({
        components: {
            auditHead,
            scenicDetail,
            attractionsDetail,
            fastReply
        }
    })
    export default class auditPerform extends Vue {
        get userInfo() {
            return AppModule.userInfo;
        }
        // 判断是否是站点端
        private isSITE:boolean = process.env.VUE_APP_STATUS === 'SITE';
        private audit: boolean = true;
        private data: any = {
            unPass: 'end',
            isPass: false
        };

        //设置是否选择通过审核
        setPass(isPass: boolean) {
            this.data.isPass = isPass;
        }
        //设置快捷回复
        getReply(item:any){
            (this.params as any).auditResult=item;
        }
        //保存审核
        private params: any = {
            auditStatus: -1,//审核状态
            resourceId: '',//资源ID
            resourceName: '',//资源名称
            resourceType: 'CONTENT_TYPE_SCENIC_SPOTS',//资源类型
            auditResult: '',//审核内容,
            auditType: 1
        };

        //保存审核
        private error:string='';
        saveAudit(auditType = 1) {
            let _this=this;
            if ((_this.data as any).isPass) {
                (_this.params as any).auditStatus = (_this.data as any).unPass == 'end'? 9:7;
            } else {
                (_this.params as any).auditStatus =  6;
            }
            //验证并保存
            if((_this.data as any).isPass && !(_this.params as any).auditResult){
                _this.error="请填写备注信息";
            }else {
                this.params.auditType = auditType;
                saveAuditProcess(_this.params).then((res: any) => {
                    if (res.code === 0) {
                        if ((_this.params as any).auditStatus == 6) {
                            _this.$Message.success('审核成功');
                            _this.$router.go(-1);
                        } else {
                            _this.$Message.success('操作成功');
                            _this.$router.go(-1);
                        }
                    }
                })
            }
        }
        //取消
        cancel(){
            this.$router.go(-1);
        }
        //修改
        goEdit(){
            this.$router.push({path: '/audit-attractions-modify', query: {id:this.$route.query.id,scenicId: this.$route.query.scenicId, type: 'audit'}});
        }
        created(){
            (this.params as any).resourceId = this.$route.query.id;
            (this.params as any).resourceName=this.$route.query.resourceName;
        }
    }
</script>

<style lang="scss" scoped>
    .perform-wrap {
        .form-wrap {
            border-top: 1px solid $borderLight;
        }
    }
</style>
