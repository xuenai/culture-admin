<!--
 * @Author: 任智勇
 * @since: 2019-06-04 14:48:33
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-01 13:40:08
 -->
<template>
  <div class="audit-box">
    <h1 class="headerTip">
      <i class="cloud-icon theme-blue icon">&#xe791;</i>为文化场馆、涉旅企业、餐饮娱乐等文旅企业开通账号。可通过此账号登录文旅企业端开展线上经营活动。
    </h1>
    <Form class="form" ref="pamars" inline :label-width="80">
      <div>
        <FormItem label="账号">
          <Input type="text" style="width:200px;" :maxlength="20" v-model="params.account" placeholder="登录手机号"/>
        </FormItem>
        <FormItem label="名称">
          <Input type="text" style="width:200px;" :maxlength="20" v-model="params.companyName" placeholder="文旅单位"/>
        </FormItem>
        <FormItem label="开通时间">
          <DatePicker
            type="daterange"
            separator=" 至 "
            @on-change="selectDate"
            placeholder="选择开通日期起始"
            placement="bottom-end"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
      </div>
      <FormItem label="角色类型">
        <Select
          style="width: 200px"
          v-model="params.roleId">
          <Option value=''>全部</Option>
          <Option
            v-for="(item,i) in roleList"
            :key="i+1"
            :value="item.id"
          >{{item.name}}
          </Option>
        </Select>
      </FormItem>
      <FormItem label="状态">
        <Select style="width:200px;" v-model="params.status">
          <Option value="0" selected>全部</Option>
          <Option value="2">禁用</Option>
          <Option value="1">正常</Option>
        </Select>
      </FormItem>
      <FormItem label="活跃度">
        <Select style="width:200px;" @on-change="setLoginDay">
          <Option value="100" selected>全部</Option>
          <Option value="-1">未登录</Option>
          <Option value="1">1天内登录过</Option>
          <Option value="3">3天内登录过</Option>
          <Option value="7">7天内登录过</Option>
          <Option value="8">超过7天未登录</Option>
        </Select>
        <Button type="primary" class="ml20" @click="search">搜索</Button>
        <router-link to="/up-cloud-add">
          <Button type="primary" class="addbtn ml20">添加</Button>
        </router-link>
      </FormItem>
    </Form>
    <baseTable class="table" :configure="tableConfig" @getList="getList">
      <Table border :columns="data.header" :loading="loading" :data="data.list" ref="table" class="mt15">
        <template slot-scope="{ row }" slot="name">
          <i>{{row.name}}</i>
        </template>
        <template slot-scope="{ row }" slot="status">
          <span v-if="row.status === 1" class="statusIcon-ok">
            <span class="cloud-icon">&#xe61e;</span>
            正常
          </span>
          <span v-else class="statusIcon-no">
            <span class="cloud-icon">&#xe622;</span>
            禁用
          </span>
        </template>
        <template slot-scope="{ row }" slot="control">
          <div class="action">
            <router-link :to="{path:'/up-cloud-edit',query:{id: row.id}}">
              <span class="theme-blue" title="修改">修改</span>
            </router-link>
            <span class="theme-blue" title="账户" @click="acount(row)">账户</span>
            <span class="theme-blue" v-if="row.status === 1" title="禁用" @click="isEnable(row,'禁用')">禁用</span>
            <span class="theme-blue" v-else title="启用" @click="isEnable(row,'启用')">启用</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="loginDays" v-if="row.loginDays">{{getLoginTxt(row.loginDays)}}</template>
      </Table>
    </baseTable>
    <Modal title="账户" v-model="dialogConfig" footer-hide width='630'>
      <Form class="dialog clearfix"  ref="dialogData" :model="dialogData" :rules="ruleValidate" :label-width="100">
        <div class="left fl">
          <FormItem label="原登录账号:">
            {{dialogData.oldPhone}}
          </FormItem>
          <FormItem label="新登录账号:" prop="newPhone">
            <Input type="text" class="newPhone" v-model="dialogData.newPhone"/>
          </FormItem>
          <p>修改账号后，密码将恢复成默认密码：{{pwd}}</p>
          <div style='text-align: center;'><Button class="mt20" type="primary" @click="updateInfo">修改账号</Button></div>
        </div>
        <div class="right fl ml20">
          <p>重置登录密码</p>
          <p style="margin-bottom: 75px;">重置后登录密码将恢复成默认密码：{{pwd}}</p>
          <div style='text-align: center;'><Button type="primary" @click="resetPwd" class="mt20">确认重置</Button></div>
        </div>
      </Form>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import Dialog from "@components/Dialog/Dialog.vue";
import {getUserList , userList , updateStatus , updateuserInfo, getUpCloudPwd} from '@service/upcloud';
@Component({ 
  components: {
     baseTable, 
     Dialog
  } 
})
export default class CloudList extends Vue {
  private loading = true; //数据是否加载中
  // 日期时间限制
  // private options: any = {
  //   disabledDate(date: any) {
  //     const disabledDay = date.getDate();
  //     // 限制可选的开始日期及结束日期
  //     let b =
  //       date.getTime() < new Date("2018-12-31").getTime() ||
  //       (date && date.valueOf() > Date.now());
  //     return b;
  //   }
  // };
  pwd = '';
  private data: any = {
    header: [
        {
          title: "名称",
          key: "name",
          slot: "name"
        },
        {
          title: "账号",
          key: "account",
          align: "center"
        },

        {
          title: "类型",
          key: "roleName",
          align: "center"
        },
        {
          title: "开通时间",
          key: "openTime",
          align: "center"
        },
        {
          title: "活跃度",
          key: "loginDays",
          slot: 'loginDays',
          align: "center"
        },
        {
          title: "状态",
          key: "status",
          slot: "status",
          align: "center"
        },
        {
          title: "操作",
          key: "control",
          slot: "control",
          align: "center"
        }
      ],
      list: []
  };
  private params: any = {
    account: "", // 账户
    companyName: "", // 企业名称
    roleId: '', //角色ID
    ltLoginDay: '', // 离线天数小于多少天
    gtLoginDay: '', // 离线天数大于多少天
    // date: [new Date(), new Date()],
    endTime:'', // 开通时间结束
    startTime:'', // 开通时间起始
    status:'' // 状态
  };

  // 获取登录天数
  private getLoginTxt(status: number) {
     if(status == -1){
      return "未登录";  
    }
    if(status <= 2){
      return "1天内登录过";  
    }
    if(status <= 3){
      return "3天内登录过";
    }
    if(status <= 7){
      return "7天内登录过";
    }
    else{
      return "超过7天未登录";
    }
  }
  
  mounted() {
    this.getList();//获取用户列表
    this.getUserList();//获取角色列表
    getUpCloudPwd().then(res => {
      if (res.code === 0) {
        this.pwd = res.data
      }
    })
  }
  // 日期选择
  private selectDate(date: any) {
    this.params.startTime = date[0];
    this.params.endTime = date[1];
  }

  /* S 搜索*/
  private setLoginDay(value: any){
    /*
    * 1.由于iview组件的on-change事件无法监听value为空的值，因此模拟一个全部状态（100为自定义）
    * 2.超过7天设置gtLoginDay，小于7天设置ltLoginDay
    */
    if(value === "100"){
      this.params.gtLoginDay = '';
      this.params.ltLoginDay = '';
      return;
    }
    if(value <= 7){
      this.params.gtLoginDay = '';
      this.params.ltLoginDay = value;
      return;
    }
    if(value > 7){
      this.params.ltLoginDay = '';
      this.params.gtLoginDay = value;
      return;
    }
  }
  // 搜索
  private search() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  /* E 搜索*/

  /* S 获取列表数据 */
  //分页
  private tableConfig: any = {
    page: {},
    pagePosition: "right"
  };
  private getList(page: any = this.tableConfig.page) {
    Object.assign(this.params, page)
    getUserList(this.params).then((data: any) => {
      let datas: any = [];
      if (data.code === 0){
        this.loading = false;
        (data.datas as any).map((item: any) =>{
          item.loginDays = (item.loginDays) + 1;
        })
        this.data.list = data.datas;
        this.tableConfig.page = data.page;
      }
    });
  }
  /* E 获取列表数据 */

  /* S 获取角色列表 */
  private roleList: any = []
  private getUserList() {
    userList({
      dataType: "COMPANY", // 上云只能添加企业端的角色，所以角色固定
    }).then((data: any) => {
      let datas: any = [];
      if (data.code === 0){
        this.roleList = data.datas
      }
    });
  }
  /* E 获取角色列表 */

  /* S 手机号颜值 */
   private ruleValidate: any = {
    newPhone: [{ required: true, message: "请正确输入手机号码", validator: this.validatePhone}],
  };
  // 手机号验证
  private validatePhone(rule: any, value: any, callback: any) {
    if (!value) {
      return callback(new Error("请输入手机号码"));
    } else if (!/^1\d{10}$/.test(value)) {
      callback("手机号不正确");
    } else {
      callback();
    }
  }
  /* E 手机号颜值 */

  /* S 账户操作 */
  private dialogConfig: Boolean = false;
  // 弹窗中原始登录账号
  private dialogData = {
    id: '',//ID
    oldPhone: "",//原登录账号
    newPhone: "",//新登录账号
  };
  private acount(row: any) {
    this.dialogData.id = row.id;
    this.dialogData.oldPhone = row.account;
    this.dialogConfig = true;
  }
  private updateInfo(){
     (this.$refs.dialogData as any).validate((valid: any) => {
      if (valid) {
        updateuserInfo({
          id: this.dialogData.id,//ID
          account: this.dialogData.newPhone,//账户
        }).then((res: any) =>{
          if (res.code === 0) {
            this.$Message.success("操作成功");
            this.getList();
            this.dialogConfig = false;
          }
        })
      } else {
        this.$Message.error("请正确输入手机号码");
      }
    });
  }
  // 重置密码
  private resetPwd(){
    updateuserInfo({
      id: this.dialogData.id,//ID
    }).then((res: any) =>{
      if (res.code === 0) {
        this.$Message.success("操作成功，密码已重置");
        this.getList();
         this.dialogConfig = false;
      }
    })
  }
  /* E 账户操作 */

  /* S 数据启用/禁用状态值切换 */
  private isEnable(row: any, txt: string) {
    let _this = this;
    let config: any = {
      title: "操作提示",
      okText: "确认" + txt,
      cancelText: "取消",
      onOk: () => {
        _this.onOk(row);
      },
      render: (h: any, params: any) => {
        // 禁用时
        if (row.status === 1) {
          return h(
            "div",
            {
              attrs: {
                class: "dialogDiv"
              }
            },
            [
              h("p", "你确认要" + txt + "此账号吗？"),
              h(
                "p",
                {
                  attrs: {
                    class: "disable"
                  }
                },
                "禁用后，此企业将不能登录，所发布的所有数据将不在用户端进行展示。"
              )
            ]
          );
        } else {
          return h(
            "div",
            {
              attrs: {
                class: "dialogDiv"
              }
            },
            [h("p", "你确认要" + txt + "此账号吗？")]
          );
        }
      }
    };
    this.$Modal.confirm(config);
  }
  //  确认开启
  private onOk(row: any) {
    let status = 1;
    if (row.status === 1) {
      status = 2;
    }
    let data = {
      ids: row.orgId,
      status: status
    }
    updateStatus(data).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("操作成功！")
        this.getList()
      }
    })
  }
  /* E 数据启用/禁用状态值切换 */
  
  /* S 查看详情 -- 鬼知道以后还要不要 */
  private siteInfo(row: any) {
    let config: any = {
      title: "申请人详情",
      render: (h: any, params: any) => {
        return h(
          "div",
          {
            attrs: {
              class: "dialogDiv"
            }
          },
          [
            h("p", "企业名称：" + row.name),
            h("p", "联系人：" + row.name),
            h("p", "联系人："),
            h("p", "联系电话：" + row.account),
            h("p", "联系邮箱：")
          ]
        );
      }
    };
    this.$Modal.info(config);
  }
  /* E 查看详情 -- 鬼知道以后还要不要 */
}
</script>

<style lang='scss' scoped>
.audit-box {
  padding: 15px;
  min-height: 500px;
  height: 100%;
  .headerTip {
    font-size: 12px;
    padding: 0 15px;
    font-weight: normal;
    line-height: 60px;
    background-color:  #e9f5fd;
    margin: 0 0 15px 0;
    .icon{
      font-size: 20px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  .form {
    padding: 15px 0 0;
    background-color: $grayLight;
  }
  .table {
    .action{
      span{
        cursor: pointer;
        margin-right: 5px
      }
    }
    .statusIcon-ok {
      margin-right: 5px;
      color: $success;
    }
    .statusIcon-no {
      margin-right: 5px;
      color: $danger;
    }
  }
}
// .dialog {
//   // width: 800px;
//   // display: flex;
//   > div {
//     // flex: 1;
//     // padding: 0 20px;
//   }
//   .newPhone {
//     width: 200px;
//   }
//   p {
//     font-size: 14px;
//     color: $font04;
//     height: 32px;
//     line-height: 32px;
//     label {
//       display: inline-block;
//       width: 80px;
//     }
//   }
//   .right p {
//     height: 48px;
//     line-height: 48px;
//   }
// }
.left{
  border-right: 1px solid #ccc;
  padding-right: 20px;
}
.right{
  p{
    margin-top: 10px;
  }
}
.dialogDiv {
  font-size: 14px;
  p {
    height: 24px;
    line-height: 24px;
    &.disable {
      color: $danger;
    }
  }
  h3 {
    font-size: 16px;
    height: 50px;
    line-height: 70px;
    border-top: 1px solid $borderLight;
    margin-top: 20px;
  }
}
.ivu-form-item{
  margin-top: 0;
}
</style>

