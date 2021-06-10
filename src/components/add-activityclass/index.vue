<template>
    <Modal
            :width="600"
            title="添加活动分类"
            :value="show_in"
            :footer-hide="true"
            @on-cancel="cancel">
        <Form
                :label-width="80"
                ref="params"
                :rules="ruleValidate"
                :model="params" >
            <FormItem label="分类名称" prop="labelName">
                <Input v-model="params.labelName" :maxlength="10" placeholder="请输入分类名称"/>
            </FormItem>
            <FormItem label="默认图标" prop="activityImgFirst">
                <UploadImg :limit="1" :defaultImage="params.activityImgFirst" @getImagesList="list => setImage(list, 'activityImgFirst')" type="small" :imgBoxStyle="{width: '50px', height: '48px'}"></UploadImg>
                <span class="tip">上传的图片尺寸：宽：46-50px，高：48px；格式：png / jpg</span>
            </FormItem>
            <FormItem label="选中图标" prop="activityImgSecond">
                <UploadImg :limit="1" :defaultImage="params.activityImgSecond" @getImagesList="list => setImage(list, 'activityImgSecond')" type="small" :imgBoxStyle="{width: '50px', height: '48px'}"></UploadImg>
                <span class="tip">上传的图片尺寸：宽：46-50px，高：48px；格式：png / jpg</span>
            </FormItem>
            <FormItem label="地图图标" prop="icon">
                <UploadImg :limit="1" :defaultImage="params.icon" @getImagesList="list => setImage(list, 'icon')" type="small" :imgBoxStyle="{width: '46px', height: '65px'}"></UploadImg>
                <span class="tip">上传的图片尺寸：宽：46px，高：65px；格式：png / jpg</span>
            </FormItem>

            <FormItem :label-width="80">
                <Button class="btn" type="primary" @click="submitFn">确认</Button>
                <Button class="btn" @click="cancel" style="margin-left:20px;">取消</Button>
            </FormItem>
        </Form>
        <Spin size="large" fix v-if="loading"></Spin>
    </Modal>
</template>

<script lang='ts'>
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    import {saveTags} from "@service/common"
    import {getTagDetail} from "@service/tool"
    import UploadImg from "@components/upload/upload-image.vue";

    @Component({components: {UploadImg}})
    export default class CreditLevel extends Vue {
        @Prop({default: false}) private show!:boolean;
        @Prop() private id!:any; // 如果回显修改
        private show_in: boolean = this.show;
        private loading: boolean = false;
        // 表单验证
        private ruleValidate = <any>{
            labelName: [
                {required: true, message: "请将信息填写完整", trigger: "blur|change"}],
            activityImgFirst: [
                {required: true, message: "请将信息填写完整"},
                {validator: this.checkFormat((w: number, h:number) => (h !== 48 || w > 50 || w < 46))}],
            activityImgSecond: [
                {required: true, message: "请将信息填写完整"},
                {validator: this.checkFormat((w: number, h:number) => (h !== 48 || w > 50 || w < 46))}],
            icon: [
                {required: true, message: "请将信息填写完整"},
                {validator: this.checkFormat((w: number, h:number) => (h !== 65 || w !== 46))}]
        };
        private checkFormat (cb: Function) {
            return async (rule: any, value: string, callback: Function) => {
                if (!/(.png|.jpg|.jpeg)$/.test(value)) {
                    return callback(new Error('请设置正确图片格式'))
                }
                let notPass: boolean = await new Promise((resolve, reject) => {
                    let oImg: HTMLImageElement = new Image()
                    oImg.src = value;
                    oImg.onload = function () {
                        resolve(cb((this as HTMLImageElement).naturalWidth, (this as HTMLImageElement).naturalHeight))
                    }
                });

                if (notPass) {
                    callback(new Error('请选择正确尺寸的图片'))
                } else {
                    callback()
                }
            }
        }
        //
        private params = <any>{
            resourceType: 'CONTENT_TYPE_ACTIVITY',
            labelType: 'ACTIVITY_CLASSIFY',
            labelName: '',
            activityImgSecond: '',
            activityImgFirst: '',
            icon: '',
        }

        created() {
            if (this.id) {
                this.getTagDetail()
            }
        }

        @Watch('show')
        wShow(n: boolean) {
            this.show_in = n;
            if (n) {
                (this.$refs.params as any).resetFields();
                this.params = <any>{
                    resourceType: 'CONTENT_TYPE_ACTIVITY',
                    labelType: 'ACTIVITY_CLASSIFY',
                    labelName: '',
                    activityImgSecond: '',
                    activityImgFirst: '',
                    icon: ''
                }
                if (this.id) {
                    this.getTagDetail()
                }
            }
        }
        private getTagDetail () {
            getTagDetail({id: this.id}).then((res:any) => {
                if (res.code === 0) {
                    this.params = res.data
                }
            })
        }
        private submitFn () {
            (this.$refs.params as any).validate((valid: any) => {
                if (valid) {
                    this.loading = true;
                    saveTags(this.params).then((res:any) => {
                        if (res.code === 0) {
                            this.$Message.success("操作成功！");
                            this.$emit('getClass', res.data)
                            this.cancel()
                        }
                    }).finally(() => this.loading = false)
                }
            })
        }
        private cancel () {
            this.$emit('close')
        }
        private setImage (list: Array<any>, key: string) {
            this.params[key] = list[0];
            (this.$refs.params as any).validateField(key);
        }
    }
</script>

<style lang='scss' scoped>
.tip {
    color: #c2ccd1;
}
</style>
