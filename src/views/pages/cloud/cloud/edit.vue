<!--
 * @Author: 任智勇
 * @since: 2019-06-04 16:09:11
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-26 11:52:26
 -->
<template>
  <div class="edit-box">
    <Form class="from-box" ref="data" :model="data" :rules="ruleValidate" :label-width="80">
      <FormItem label="名称" placeholder="请输入名称" class="item" prop="name">
        <Input type="text" style="width: 200px" v-model="data.name" :maxlength="20"/>
      </FormItem>
      <FormItem class="formItem" label="类型" prop="roleId">
        <Select
        @on-change="switchType"
        style="width: 200px"
        v-model="data.roleId"
        >
          <Option
            v-for="(item,i) in roleList"
            :key="i+1"
            :value="item.id"
          >{{item.name}}
          </Option>
        </Select>
        <br>
        <p class="typeTips" v-show='typeTips'>{{typeTips}}</p>
      </FormItem>
      <FormItem label="账号" class="item" prop="phone">
        <Input type="text" style="width: 200px" placeholder="请输入账号"  v-model="data.phone" :maxlength="11"/>
      </FormItem>
      <FormItem>确认开通后，将通过短信发送登录信息至手机号上。请确保手机号码正确。默认密码为：{{pwd}}</FormItem>
      <FormItem>
        <Button v-if="this.$route.query.id" type="primary" @click="handleSubmit">确认</Button>
        <Button v-else type="primary" @click="handleSubmit">确认并开通</Button>
        <Button class="ml20" @click="goback">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import {getUserList , userList , saveUser , getUserInfo, getUpCloudPwd} from '@service/upcloud';

@Component({ 
  components: {
  } 
})
export default class VipEdit extends Vue {
  private data: any = {
    id: "",//ID
    name: "",//名称
    phone: "",//手机号
    roleId: "",//角色ID
  };
  pwd: string = '';
  //表单验证
  private ruleValidate: any = {
    name: [{ required: true, message: "该项不能为空" }],
    roleId: [{ required: true, message: "该项不能为空" }],
    phone: [{ required: true, message: "账号格式不正确", validator: this.validatePhone, trigger: 'blur'}],
  };
  // 手机号验证
  private validatePhone(rule: any, value: any, callback: any) {
    if (!value) {
      return callback(new Error("请输入账号"));
    } else if ( !(/^1\d{10}$/.test(value) || /^[a-zA-Z]+$/.test(value)) ) {
      callback("账号格式不正确");
    } else {
      callback();
    }
  }

  mounted() {
    let id = this.$route.query.id;
    if(id){
      this.data.id = id;
      this.getUserInfo();//获取用户详情
    }
    this.getUserList();//获取角色列表
    getUpCloudPwd().then(res => {
      if (res.code === 0) {
        this.pwd = res.data
      }
    })
  }
  // 提交
  private handleSubmit() {
    (this.$refs.data as any).validate((valid: any) => {
      if (valid) {
        console.log(this.data);
        saveUser(this.data).then((data: any) => {
          let datas: any = [];
          if (data.code === 0){
            this.$Message.success("操作成功");
            this.goback();
          }
        });
      } 
    });
  }

  /* S 获取详情信息 */
  private getUserInfo() {
    getUserInfo({
        id: this.data.id
    }).then((data:any) => {
        if(data.code === 0){
          console.log(data)
            this.data.name = data.data.name;
            this.data.phone = data.data.phone;
            this.data.roleId = data.data.roleId;
        }
    });
  }
  /* E 获取详情信息*/ 

  /* S 获取角色列表 */
  private roleList: any = []; //角色列表
  private getUserList() {
    userList({
      dataType: "COMPANY",//上云添加只能添加企业端的角色，所以角色固定
    }).then((data: any) => {
      let datas: any = [];
      if (data.code === 0){
        this.roleList = data.datas
      }
    });
  }
  /* E 获取角色列表 */

  /* S 成员数据变化 */
  private typeTips: string = "";
  private switchType(value: any) {
    for(let i = 0;i < this.roleList.length; i++){
      if(this.roleList[i].id == value){
        this.typeTips = this.roleList[i].remark;
      }
    }
  }
  /* E 成员数据变化 */

  // 返回
  private goback () {
    this.$router.go(-1)
  }
}
</script>

<style lang='scss' scoped>
.edit-box {
  height: 100%;
  padding-top: 15px;
  // background-color: $grayDark;
  .from-box {
    background-color: $bg01;
    padding-bottom: 20px;
  }
  .item {
    margin: 20px 0;
  }
  .typeTips {
    font-size: 10px;
    display: inline-block;
    white-space: nowrap;
  }
}
</style>
