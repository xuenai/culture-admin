<template>
  <div>
    <Form class="from-box" ref="formData" :model="saveData" :rules="ruleValidate" :label-width="80">
      <FormItem label="标题" prop="title" placeholder="请输入标题" class="item">
        <Input class="input" type="text" :maxlength="20" v-model="saveData.title" style="width: 250px;"/>
      </FormItem>
      <FormItem label="发送对象" prop="sendtype" class="item">
        <Checkbox
          :indeterminate="checkBox.indeterminate"
          :value="checkBox.checkAll"
          @click.prevent.native="handleCheckAll"
        >全部</Checkbox>
        <CheckboxGroup
          style="display:inline-block;"
          v-model="checkBox.checkAllGroup"
          @on-change="checkAllGroupChange"
        >
          <Checkbox label="site">站点端</Checkbox>
          <Checkbox label="company">企业端</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="内容" prop="content" class="item">
        <ueditor id="editor" v-model="saveData.content"></ueditor>
      </FormItem>

      <FormItem>
        <Button type="primary" @click="handleSubmit">保存</Button>
        <Button type="primary" style="margin-left:10px;" @click="goBack">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import ueditor from "@components/ueditor/ueditor.vue";
import { saveNotifyList } from "@service/cloud-manage";
import {getMsgDetail} from '@service/common'

@Component({ components: { ueditor } })
export default class MessageManageEdit extends Vue {
  mounted() {
    let id:any = this.$route.query.id||'';
    if(id){
        this.saveData.id = id;
        let _this = this;
        getMsgDetail({id:id}).then((res:any)=>{
            if(res.code===0){
                _this.saveData.title = res.data.title;
                _this.saveData.content = res.data.content;
                _this.saveData.type = res.data.notifyType;
                if(_this.saveData.type != 'site_company'){
                    _this.checkBox.checkAllGroup = [_this.saveData.type]
                    _this.checkAllGroupChange(_this.checkBox.checkAllGroup)
                }
            }
        })
    }
  }
  private saveData: any = {
    id: "",
    title: "",
    type: "site_company",
    content: ""
  };
  private ruleValidate: any = {
    title: [
      { required: true, message: "该项不能为空", trigger: "blur" },
      { type: "string", max: 20, message: "最多输入20个字符", trigger: "blur" }
    ],
    sendtype: [
      {
        required: true,
        type: "array",
        min: 1,
        message: "至少选择一项",
        trigger: "change",
        validator: this.checkedType
      }
    ],
    content: [
      {
        required: true,
        message: "该项不能为空",
        trigger: "blur",
        validator: this.checkedRule
      }
    ]
  };
  private handleSubmit() {
    (this.$refs.formData as any).validate((valid: any) => {
      if (!valid) {
        this.$Message.error("请将信息填写完整！");
        return;
      }
      saveNotifyList(this.saveData).then((res: any) => {
        if (res.code === 0) {
          this.$Message.success("保存成功");
          this.$router.go(-1);
        }
      });
    });
  }
  private goBack() {
    this.$router.go(-1);
  }
  private checkedRule(rule: any, value: any, callback: any) {
    if (!this.saveData.content) {
      return callback(new Error("请将信息填写完整"));
    }
    callback();
  }
  private checkedType(rule: any, value: any, callback: any) {
    if (!this.saveData.type) {
      return callback(new Error("请将信息填写完整"));
    }
    callback();
  }

  /* S 复选框 */
  private checkBox = {
    indeterminate: false,
    checkAll: true,
    checkAllGroup: ["site", "company"]
  };
  private handleCheckAll() {
    if (this.checkBox.indeterminate) {
      this.checkBox.checkAll = false;
    } else {
      this.checkBox.checkAll = !this.checkBox.checkAll;
    }
    this.checkBox.indeterminate = false;

    if (this.checkBox.checkAll) {
      this.checkBox.checkAllGroup = ["site", "company"];
    } else {
      this.checkBox.checkAllGroup = [];
    }
    this.checkAllGroupChange(this.checkBox.checkAllGroup);
  }
  private checkAllGroupChange(data: any) {
    if (data.length === 2) {
      this.checkBox.indeterminate = false;
      this.checkBox.checkAll = true;
      this.saveData.type = "site_company";
    } else if (data.length > 0) {
      this.checkBox.indeterminate = true;
      this.checkBox.checkAll = false;
      this.saveData.type = data[0];
    } else {
      this.checkBox.indeterminate = false;
      this.checkBox.checkAll = false;
      this.saveData.type = "";
    }
    // console.log(this.saveData.type);
    (this.$refs.formData as any).validate('sendtype')
  }
  /* E 复选框 */
}
</script>

<style lang='scss' scoped>
.from-box {
  padding: 20px;
}
</style>
