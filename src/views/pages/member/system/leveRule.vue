<!--
 * @Author: 任智勇
 * @since: 2019-05-28 20:38:10
 * @LastAuthor: SXQ
 * @lastTime: 2019-07-02 11:50:36
 -->
<template>
  <div class="pd20">
    <!-- 进度条 -->
    <ul class="header-goods">
      <ul class="header-goods">
        <li class="active">
            <em class="demo2"></em>
            <span class="demo1" :class="!data.next ? 'hasNo' : '' "></span>
            <span>1.会员体系规则</span>
        </li>
        <li :class="data.next ? 'active' : '' ">
            <em class="demo2"></em>
            <span class="demo1 noBorder"></span>
            <span>2.积分获取规则</span>
        </li>
      </ul>
    </ul>
    <div class="detial">
      <div class="div01" v-show="!data.next">
        <h1>
          <span></span>基本信息
        </h1>
        <div class="table">
          <h3 class="title">会员等级（用户类型）</h3>
          <Table border :columns="data.header" :data="data.list">
            <template slot-scope="{ row }" slot="name">
              <div>
                <span v-if="!row.edit">{{row.name}}</span>
                <Input v-else v-model="row.name" :maxlength="20" placeholder="请输入名称" style="width: 80px"/>
              </div>
            </template>
            <template slot-scope="{ row }" slot="level">
              <span v-if="!row.edit">{{row.level}}级</span>
              <span v-else><Input :maxlength="20" v-model="row.level" style="width: 50px"/>级</span>
            </template>
            <template slot-scope="{ row }" slot="icon">
              <div class="img">
                <img v-if="!row.edit" class="icon" :src="row.img" >
                <UploadImg v-else :limit="1" @getImagesList="getImagesList" :defaultImage="row.img"></UploadImg>
              </div>
            </template>
            <template slot-scope="{ row }" slot="num">
              <div>
                <span v-if="!row.edit">{{row.minPoint}} ~ {{row.maxPoint}}</span>
                <span v-else>
                    <Input :maxlength="20" v-model="row.minPoint" style="width: 50px;margin-right:5px;"/> ~ 
                    <Input :maxlength="20" v-model="row.maxPoint" style="width: 50px"/>
                </span>
              </div>
            </template>
            <template slot-scope="{ row }" slot="control">
              <i class="cloud-icon" v-if="!row.edit" title="编辑" @click="editRow(row)">编辑</i>
              <i class="cloud-icon" v-else title="保存" @click="saveRow(row)">保存</i>
              <i class="cloud-icon" title="删除" @click="deleteRow(row.id)">删除</i>
            </template>
          </Table>
          <p class="newTableRow" @click="newTableRow">+ 新增</p>
        </div>
      </div>
      <div class="div02" v-show="!data.next">
        <h1>
          <span></span>会员规则
        </h1>
        <!-- <editor :content="rules" bind="rules"></editor> -->
        <!-- <editor v-model="params.introduce" id="uedit1" ></editor> -->
      </div>
      <div class="div03" v-show="data.next">
        <h1>
          <span></span>注册送积分
        </h1>
        <div>
          <div>
            <label>启用</label>
            <i-switch v-model="data.switch1" @on-change="change"/>
          </div>
          <div v-if="data.switch1">
            <label>送积分</label>
            注册送
            <Input
            :maxlength="20"
            v-model="registerData.point"
            style="width: 100px;margin-right:5px;"
            />积分
          </div>
        </div>
      </div>
      <div class="div04" v-show="data.next">
        <h1>
          <span></span>登录送积分
        </h1>
        <div>
          <label>启用</label>
          <i-switch v-model="data.switch2" @on-change="change02"/>
        </div>
        <div v-if="data.switch2">
          <label>活动时间</label>
          <DatePicker
            @on-change="getDataFun"
            format="yyyy-MM-dd"
            type="daterange"
            placeholder="请选择活动起始日期"
            style="width: 250px"
          ></DatePicker>
          <RadioGroup size="large" v-model="loginData.timeStatus">
            <Radio label="0">
              <span>长期</span>
            </Radio>
            <!-- <Radio label="1">
              <span>周期</span>
            </Radio> -->
          </RadioGroup>
        </div>
        <div v-if="data.switch2">
          <label>赠送规则</label>
          <RadioGroup v-model="loginData.type" size="large">
            <Radio label="0">
              <span>注册</span>
            </Radio>
            <Radio label="1">
              <span>每日</span>
            </Radio>
            <Radio label="2">
              <span>登录送一次</span>
            </Radio>
          </RadioGroup>
        </div>
        <div v-if="data.switch2">
          <label>送积分</label>
          登录送
          <Input
            v-model="loginData.point"
            :maxlength="20"
            style="width: 100px;margin-right:5px;"
          />积分
        </div>
      </div>
    </div>
    <Button type="primary" class="nextBtn" v-if="!data.next" @click="data.next = !data.next">下一步</Button>
    <Button class="prveBtn" v-if="data.next" @click="data.next = !data.next">上一步</Button>
    <Button type="primary" class="nextBtn" v-if="data.next" @click="checkSubmit">保存</Button>
  </div>
</template>
<script lang='ts'>
import { Component , Vue } from "vue-property-decorator";
import editor from "@components/ueditor/ueditor.vue";
import {getUserPointList , saveUserPoints , delUserPoints , saveUserPointsActivity} from '@service/member';
import UploadImg from "@components/upload/upload-image4.vue";

@Component({ 
  components: { 
    editor,
    UploadImg
  }
})
export default class VipRule extends Vue {
  private rules: any = "";//会员规则-富文本
  private data: any = {
    header: [
      {
        title: "等级",
        key: "level",
        slot: "level",
        align: "center"
      },
      {
        title: "名称",
        key: "name",
        slot: "name",
        align: "center"
      },
      {
        title: "图标",
        key: "icon",
        slot: "icon",
        align: "center"
      },
      {
        title: "积分",
        key: "num",
        slot: "num",
        align: "center"
      },
      {
        title: "操作",
        slot: "control",
        align: "center"
      }
    ],
    list: [],
    next: false, // 显示第一页
    switch1: true, // 注册送积分开关
    switch2: true, // 登录送积分开关
    active: false,//导航选中开关
  };

  //获取活动起始时间
  private getDataFun(value:string){
    this.loginData.startTime = value[0];
    this.loginData.endTime = value[1];
  }

  mounted() {
    this.getAdDescList();//获取会员等级列表
  }

  /* S 获取列表数据 */
  private getAdDescList() {
    getUserPointList().then((data:any) => {
      if(data.code === 0){
        this.data.list = data.datas.map((item:any)=>{
          item.edit = false;
          return item;
        });
      }
    });
  }
  /* E 获取列表数据 */
 
  /* S 上传图片 */
  private img: any = '';
  private getImagesList(e:any) {
    this.img = e[0];
  }
  /* E 上传图片 */
  /* S 编辑 */
  private editRow(rows: any) {
    this.data.list[rows._index].edit = true;
  }
  /* E 编辑 */

  // 保存
  private saveRow(rows: any) {
    let jsonDto: any = [
      {
        maxPoint: rows.maxPoint, //最大积分
        minPoint: rows.minPoint, //最小积分
        img: this.img,//图标
        name: rows.name,//等级名称
        level: rows.level,//等级
      }
    ];
    if(!jsonDto[0].maxPoint || !jsonDto[0].minPoint || !jsonDto[0].img || !jsonDto[0].name || !jsonDto[0].level){
      this.$Message.error("请完善信息！");
      return;
    }
    this.data.list[rows._index] = rows;
    this.data.list[rows._index].edit = false;

    saveUserPoints({ 
      jsonDto: JSON.stringify(jsonDto)
      }).then(data => {
        if(data.code === 0){
          this.$Message.success("修改成功！");
        }
    })
  }

  /* S 删除 */
  private deleteRow(id: Number) {
    this.$Modal.confirm({
      title: '提示',
      content: '确认删除？',
      onOk: () => {
        delUserPoints({
          id: id
        }).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("已删除!");
            this.getAdDescList();
          }
        })
      },
      onCancel: () => {
          // this.$Message.info('Clicked cancel');
      }
    });
  }
  /* E 删除 */

  /* S 新增会员等级 */
  private newTableRow(){
    this.data.list.push({
      name: "",//等级名称
      level: "",//等级
      minPoint:'',//最小积分
      maxPoint: '',//最大积分
      img: '',//等级图标
      edit: true
    })
  }
  /* E 新增会员等级 */

  /* S 注册送积分 */
  private registerData: any = {
    name:'注册送积分',//名称
    type: "0",//积分类型
    point: '',//积分数量
    status: '1',//状态
  }
  private change(status: boolean) {
    if(status){
      this.dat01.status = 1;
    }else{
      this.dat01.status = 2;
    }
  }
  /* E 注册送积分 */

  /* S 登录送积分 */
  private loginData: any = {
    name: '登录送积分',//名称
    type: "0",//积分类型
    point: '',//积分数量
    status: '1',//状态
    endTime: '',//活动结束时间
    startTime: '',//活动开始时间
    timeStatus: '',//是否限时
  }
  private change02(status: boolean) {
    if(status){
      console.log(status)
    }
  }
  /* E 登录送积分 */

  //提交
  private checkSubmit(){
    let jsonDto = [this.registerData,this.loginData];
    console.log(jsonDto)
    saveUserPointsActivity({
      jsonDto: JSON.stringify(jsonDto)
    }).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("操作成功!");
      }
    })
  }
}
</script>

<style lang='scss' scoped>

// 进度条
.header-goods{
  overflow: hidden;
  background: $bg01;
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
        overflow: hidden;
        font-size: 0;
        position: absolute;
        right: 1px;
        border-top: 23px solid #f2f2f6;
        border-right: 23px solid #f2f2f6;
        border-bottom: 22px solid #f2f2f6;
        border-left: 25px solid $bg01;
        z-index: 1;
    }
    .demo2{
        width: 0;
        height: 0;
        overflow: hidden;
        font-size: 0;
        position: absolute;
        right: 5px;
        border-top: 23px solid transparent;
        border-right: 23px solid transparent;
        border-bottom: 22px solid transparent;
        border-left: 23px solid #f2f2f6;
        z-index: 2;
    }
    span:last-child{
        position: relative;
        left: 40%;
    }
    &:nth-child(2){
        margin-left: -50px;
    }
    .noBorder{
        border-bottom: 24px solid $bg01!important;
        border-left: 25px solid $bg01;
    }
    .noRightM{
        right: 2px!important;
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
            border-left: 27px solid $bg01;
        }
        .demo2{
            border-top: 23px solid transparent;
            border-right: 23px solid transparent;
            border-bottom: 22px solid transparent;
            border-left: 23px solid #6ed35e;
        }
    }
    .hasNo{
        border-top: 23px solid #f2f2f6!important;
        border-right: 23px solid #f2f2f6!important;
        border-bottom: 22px solid #f2f2f6!important;
        border-left: 23px solid $bg01;
    }
    .hasWirte, .noBorder{
        border-top: 23px solid $bg01!important;
        border-right: 23px solid $bg01!important;
        right: 0!important;
    }
  } 
}
.detial {
  h1 {
    height: 56px;
    border-bottom: 1px solid $borderLight;
    line-height: 56px;
    font-size: 16px;
    span {
      display: inline-block;
      width: 5px;
      height: 18px;
      border-radius: 2px;
      background-color: $theme;
      margin-right: 10px;
      position: relative;
      top: 3px;
    }
  }
  label {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    width: 50px;
    text-align: right;
    margin: 10px;
    color: $font01;
  }
  .table {
    width: 800px;
    color: $font01;
    .title {
      height: 56px;
      line-height: 56px;
      font-size: 14px;
      color: $font04;
    }
    .cloud-icon {
      cursor: pointer;
      color: $theme;
      margin-right: 10px;
    }
    .icon {
      display: inline-block;
      width: 40px;
      height: 40px;
    }
    .newTableRow{
        color: $theme;
        text-align: center;
        height: 50px;
        line-height: 50px;
        font-weight: bold;
        border: 1px solid $borderLight;
        border-top: none;
        cursor: pointer;
    }
  }
}
.nextBtn {
  margin-top: 20px;
  width: 130px;
}
.prveBtn {
  margin-top: 20px;
  width: 130px;
  background-color: $btn-cancel;
  margin-right: 10px;
  color: #fff;
  border: none;
  &:hover {
    background-color: $btn-cancel-hover;
    border: none;
  }
}
</style>
