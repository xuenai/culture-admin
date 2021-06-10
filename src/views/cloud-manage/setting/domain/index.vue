<template>
  <div class="pd20">
       <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="云管理端" prop="name">
            <Input class="ipt" type="url" :maxlength="50" v-model="formValidate.cloud" placeholder="请输入云端域名">
                <Select v-model="select.cloud" slot="prepend" style="width: 80px">
                    <Option value="http">http://</Option>
                    <Option value="https">https://</Option>
                </Select>
            </Input>
        </FormItem>
        <FormItem label="站点端" prop="name">
            <Input class="ipt" type="url" :maxlength="50" v-model="formValidate.site" placeholder="请输入站点端域名">
                <Select v-model="select.site" slot="prepend" style="width: 80px">
                    <Option value="http">http://</Option>
                    <Option value="https">https://</Option>
                </Select>
            </Input>
        </FormItem>
        <FormItem label="文旅企业端" prop="name">
            <Input class="ipt" type="url" :maxlength="50" v-model="formValidate.company" placeholder="请输入企业端域名">
                <Select v-model="select.company" slot="prepend" style="width: 80px">
                    <Option value="http">http://</Option>
                    <Option value="https">https://</Option>
                </Select>
            </Input>
        </FormItem>
        <FormItem label="用户端" prop="name">
            <Input class="ipt" type="url" :maxlength="50" v-model="formValidate.user" placeholder="请输入用户端域名">
                <Select v-model="select.user" slot="prepend" style="width: 80px">
                    <Option value="http">http://</Option>
                    <Option value="https">https://</Option>
                </Select>
            </Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit">保存</Button>
            <Button @click="handleReset" style="margin-left: 10px">重置</Button>
        </FormItem>
    </Form>
  </div>
</template>

<script lang='ts'>
import { Component,Watch, Vue } from 'vue-property-decorator'
import {getDomainList,saveDomainList} from '@service/cloud-manage'

@Component({components:{}})
export default class Domain extends Vue {
    mounted(){
        this.getDomainList()
    }
    // http 、 https 类型切换
    private select:any = {
        cloud: 'http',
        site: 'http',
        company: 'http',
        user: 'http',
    }
    // 输入框数据
    private formValidate:any = {
        cloud: '',
        site: '',
        company: '',
        user: '',
    }
    private ruleValidate = {
        name: [
            // { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
    }
    
    @Watch('select', { immediate: true, deep: true })
    refreshData(){
        this.updateSaveData()
    }
    @Watch('formValidate', { immediate: true, deep: true })
    refreshVData(){
        this.updateSaveData()
    }
    private saveData:any = {
        cloud:'',
        site:'',
        company:'',
        user:'',
    }
    private updateSaveData(){
        for(let key in this.saveData){
            if(this.formValidate[key]){
                this.saveData[key] = this.select[key] + '://' + this.formValidate[key];
            } else {
                this.saveData[key] = '';
            }
        }
    }
    // 保存
    private handleSubmit () {
        (this.$refs.formValidate as any).validate((valid:any) => {
            if (valid) {
                saveDomainList(this.saveData).then((res:any)=>{
                    if(res.code===0){
                        this.$Message.success('操作成功!');
                    }
                })
                // console.log(this.saveData)
            }
        })
    }
    // 重置
    private handleReset () {
        this.select = {
            cloud: 'http',
            site: 'http',
            company: 'http',
            user: 'http',
        }
        this.formValidate = {
            cloud: '',
            site: '',
            company: '',
            user: '',
        }
    }
    // 获取配置数据信息
    private getDomainList(){
        getDomainList().then((res:any)=>{
            if(res.code===0 && res.datas.length){
                res.datas.forEach((item:any) => {
                    let arr = item.url.split('://');
                    if(item.resourceType == "SYS_CONFIG_CLOUD"){
                        this.select.cloud = arr[0]||'http';
                        this.formValidate.cloud = arr[1]||'';
                    } else if(item.resourceType == "SYS_CONFIG_SITE"){
                        this.select.site = arr[0]||'http';
                        this.formValidate.site = arr[1]||'';
                    }else if(item.resourceType == "SYS_CONFIG_COMPANY"){
                        this.select.company = arr[0]||'http';
                        this.formValidate.company = arr[1]||'';
                    }else if(item.resourceType == "SYS_CONFIG_C_END"){
                        this.select.user = arr[0]||'http';
                        this.formValidate.user = arr[1]||'';
                    }
                });
            }
        })
    }
}
</script>

<style lang='scss' scoped>
.ipt{
    width: 350px;
}
</style>
