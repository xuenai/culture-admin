<template>
  <div>
    <Modal title="修改密码" v-model="show" class="pic-preview-modal" :mask-closable="false" @on-visible-change="onVisibaleChange" :width="350">
      <div class="pics-modal-body">
        <Form :model="params" :rules="paramsValidate" ref="modalForm">
          <FormItem label="旧密码：" :label-width="90" prop="oldPwd">
            <Input type="password" v-model="params.oldPwd" placeholder="请输入标签名称" class="ipt"/>
          </FormItem>
          <FormItem label="新密码：" :label-width="90" prop="password">
            <Input type="password" v-model="params.password" placeholder="请输入标签名称" class="ipt"/>
          </FormItem>
          <FormItem label="确认密码：" :label-width="90" prop="repeatePwd">
            <Input type="password" v-model="params.repeatePwd" placeholder="请输入标签名称" class="ipt"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" class="pics-modal-footer">
        <Button type="text" @click="cancelHandle">取消</Button>
        <Button type='primary' @click="submitHandle">确定更改</Button>
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import {updatePassword, UpdatePasswordDataType} from '@service/app';
import { AppModule } from "@store/modules/app";
import {Encrypt} from '@util/aes';

@Component
export default class PasswordEdit extends Vue {
  @Prop() readonly value !: boolean;
  private show = false; // 弹窗是否展示
  private spinShow = false; // 加载动画是否展示
  private params = {
    password: '',
    oldPwd: '',
    repeatePwd: '', // 确认密码
  }
  private paramsValidate = {
    oldPwd: [
      { required: true, message: "请输入旧密码", trigger: "blur" },
      { min: 8, message: "旧密码不少于8个字符", trigger: "blur" },
      { max: 16, message: "旧密码不超过16个字符", trigger: "blur" }
    ],
    password: [
      { required: true, message: "请输入新密码", trigger: "blur" },
      { min: 8, message: "新密码不少于8个字符", trigger: "blur" },
      { max: 16, message: "新密码不超过16个字符", trigger: "blur" }
    ],
    repeatePwd: [
      { required: true, validator: this.validateRepeatePwd, trigger: "blur" }
    ]
  }
  @Watch('value', {immediate: true, deep: true})
  onValueChange (val:boolean){
    this.show = val
  }
  @Watch("show", { immediate: true, deep: true })
  onListChange (val: boolean) {
    this.input()
  }
  @Emit()
  input () {
    return this.show
  }
  // 确认密码验证
  private validateRepeatePwd(rule: any, value: any, callback: any) {
    if (!value) {
      return callback(new Error("确认密码不能为空"));
    } else {
      if (value !== this.params.password) {
        return callback(new Error("确认密码和新密码不一致"));
      } else {
        callback();
      }
    }
  }
  // 弹窗隐藏时 清空form表单的值
  private onVisibaleChange (val: boolean) {
    // 取消时清空弹窗
    if (!val) {
      this.resetFormData()
    }
  }
  /**
   * 点击取消
   */
  private cancelHandle () {
    this.resetFormData()
    this.show = false
  }
  /**
   * 点击确定按钮
   */
  private submitHandle () {
    (this.$refs.modalForm as Vue).validate((valid: boolean) => {
      if (valid) {
        this.formatPrams()
      } else {
        this.$Message.error("请将信息填写完整！");
      }
    });
  }
  /**
   * 处理更改密码请求参数，新旧密码加密
   */
  private formatPrams () {
    let {oldPwd, password} = this.params;
    // 新旧密码加密
    let params:UpdatePasswordDataType = {
      oldPwd: Encrypt(oldPwd),
      password: Encrypt(password),
      userId: AppModule.userInfo.id
    }
    this.updatePassword(params);
  }
  /**
   * 更改密码请求
   */
  private updatePassword (params: UpdatePasswordDataType) {
    updatePassword(params).then(res => {
      if (res.code === 0) {
        this.$Message.success('修改密码成功，请重新登录');
        this.show = false
        // 更改密码成功后 需要重新登录
        AppModule.setAppToken("");
        this.$cookies.remove(`${process.env.VUE_APP_STATUS}_TOKEN`);
        this.$cookies.remove(`sessionId`);
        this.$router.push("/login");
      }
    })
  }
  // 重置表单数据
  private resetFormData () {
    setTimeout(() => {
      (this.$refs.modalForm as Vue).resetFields()
    }, 200)
  }
}
</script>

<style lang='scss' scoped>
.ipt{
  max-width:200px;
  width:200px;
}
</style>
