<!--
 * @Author: 任智勇
 * @since: 2019-06-01 14:23:11
 * @LastAuthor: 陈艳玲
 * @lastTime: 2019-11-25 17:39:34
 -->
<template>
  <div>
    <Form
      class="from-box"
      ref="fromData"
      :model="fromData"
      :rules="ruleValidate"
      :label-width="100"
    >
      <FormItem label="广告位名称" prop="name" class="item">
        <Input class="input" type="text" :maxlength="20" v-model="fromData.name" placeholder="请输入广告位名称"/>
        <span style="margin-left: 20px;">20字以内</span>
      </FormItem>
      <FormItem label="广告位编码" prop="code" class="item">
        <Input
          :disabled="!!fromData.id"
          class="input"
          type="text"
          placeholder="请输入广告位编码"
          @on-blur="adCheckCode"
          v-model="fromData.code"
        />
      </FormItem>
      <FormItem label="广告位方式" prop="method" class="item">
        <RadioGroup v-model="fromData.method" @on-change="methodChange">
          <Radio label="ALERT">
            <span>弹框</span>
          </Radio>
          <Radio label="BUOY">
            <span>浮标</span>
          </Radio>
          <Radio label="IMAGE">
            <span>图片</span>
          </Radio>
          <Radio label="VIDEO">
            <span>视频</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <p class="pwh">
        <FormItem label="广告位大小" prop="width" class="pitem" inline>
          <InputNumber class="adinput" placeholder="宽"  :min="1" :max="9999" v-model="fromData.width"></InputNumber>
        </FormItem>
        <FormItem prop="high" class="pitem" inline>
          <InputNumber class="adinput heightinput" placeholder="高" :min="1" :max="9999"  v-model="fromData.high"></InputNumber>
          <span class="size">(px)</span>
        </FormItem>
      </p>
      <FormItem class="item select" label="发布渠道" prop="publishChannel">
        <Select v-model="fromData.publishChannel" :disabled="!!(fromData.id)">
          <Option value selected>全部</Option>
          <Option value="PC">PC网站</Option>
          <Option value="MICRO_SITE">微网站</Option>
          <Option value="APP">APP</Option>
          <Option value="SMALL_PROGRAM">小程序</Option>
        </Select>
      </FormItem>
      <FormItem class="item" label="广告示意图" prop="type">
        <upload
          key="Uploader1"
          :limit="1"
          @getImagesList="getLogo"
          @getMediaList="getLogo"
          :defaultImage="fromData.adPositionImage"
        ></upload>
      </FormItem>
      <FormItem label="广告位描述" class="item">
        <Input class="input" type="text" :maxlength="50" placeholder="请输入广告位描述，50字以内" v-model="fromData.description"/>
      </FormItem>
      <FormItem label="类型" prop="siteId" class="item">
        <RadioGroup v-model="fromData.type" @on-change="typeChange">
          <Radio label="POSITION_PUBLIC">
            <span>共有广告</span>
          </Radio>
          <Radio label="POSITION_PRIVATE">
            <span>私有广告</span>
          </Radio>
        </RadioGroup>
        <Input
          class="input"
          v-if="fromData.type === 'POSITION_PRIVATE'"
          v-show="false"
          type="text"
          placeholder="绑定广告的站点"
          v-model="fromData.siteId"
        />
        <p>
          <span v-if="fromData.type === 'POSITION_PRIVATE' && fromData.siteId">
            已选择：{{fromData.siteName}}
            <span class="update" @click="updateSite">更改</span>
          </span>
          <span
            v-else-if="fromData.type === 'POSITION_PRIVATE'"
            class="update"
            @click="updateSite"
          >未选择</span>
        </p>
      </FormItem>
      <FormItem label="状态" class="item">
        <div v-if="fromData.status === 1">
          <span class="switchLabel">正常</span>
          <span class="switchBox" @click="changeStatus(1)">
            <i-switch :value="fromData.status === 1"/>
            <span class="cover"></span>
          </span>
        </div>
        <div v-else>
          <span class="switchLabel">禁用</span>
          <span class="switchBox" @click="changeStatus(2)">
            <i-switch :value="fromData.status === 1"/>
            <span class="cover"></span>
          </span>
        </div>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">保存</Button>
        <Button type="primary" @click="goBack" style="margin-left: 15px;">返回</Button>
      </FormItem>
    </Form>
    <Dialog :configer="dialogConfig" @onOk="okClick" @onClose="dialogConfig.show = false">
      <div class="condition">
        <div class="fromItem">
          <label>站点名称</label>
          <Input type="text" v-model="condition.keyword" placeholder="站点名称"/>
        </div>
        <div class="fromItem">
          <Button type="primary" class="submit" @click="siteSerch">搜索</Button>
        </div>
      </div>
      <baseTable class="table" :configure="tableConfig" @getList="getList">
        <Table border :columns="data.header" :loading="loading" :data="data.list" ref="table">
          <template slot-scope="{ row }" slot="radio">
            <Radio v-model="radioGroup[row._index]" @on-change="checkRadio(row)"></Radio>
          </template>
          <template slot-scope="{ row }" slot="keyword">
            <div class="siteInfoDiv">
              <div class="imgDiv">
                <img :src="row.siteLogo">
              </div>
              <div class="info">
                <h3>{{row.name}}</h3>
                <p>{{row.info}}</p>
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="siteType">
            <i>{{getSiteTypeName(row.siteType)}}</i>
          </template>
          <template slot-scope="{ row }" slot="status">
            <span v-if="row.status === 1">正常</span>
            <span v-else>禁用</span>
          </template>
        </Table>
      </baseTable>
    </Dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import Dialog from "@components/Dialog/Dialog.vue";
import baseTable from "@components/baseTable/baseTable.vue";
import upload from "@components/upload/upload-image.vue";
import {
  adPositionSave,
  adCheckCode,
  positionUpdateDetials,
  getSiteAuditList
} from "@service/cloud-manage";

@Component({ components: { Dialog, baseTable, upload } })
export default class ComponentName extends Vue {
  // 表单参数配置
  private fromData: any = {
    id: "",
    name: "",
    code: "",
    method:"",
    width: "",
    high: "",
    publishChannel: "",
    description: "",
    type: "POSITION_PUBLIC",
    site: "",
    siteId: "",
    siteName: "",
    status: 1,
    adPositionImage:
      ""
  };
  private ruleValidate: any = {
    name: [{ required: true, message: "该项不能为空", trigger: "blur" },{ type: "string", max: 50, message: "最多输入50个字符", trigger: "blur" },],
    publishChannel: [{ required: true, message: "该项不能为空", trigger: "blur" }],
    code: [{ required: true, message: "该项不能为空", trigger: "blur" },{ type: "string", max: 20, message: "最多输入20个字符", trigger: "blur" },],
    method: [{ required: true, message: "该项不能为空", trigger: "blur" }],
    width: [{ required: true, message: "该项不能为空" }],
    high: [{ required: true, message: "该项不能为空" }],
    siteId: [{required: true,validator: this.checkedCreateCompany}],
  };
  private typeChange(e:any){
    if(e == 'POSITION_PUBLIC'){
      this.fromData.siteId = ""
      this.fromData.siteName = ""
    } else {
      (this.$refs.fromData as any).validateField("siteId");
    }
  }
  private methodChange(e:any){
    this.fromData.method=e;
  }
  private checkedCreateCompany(rule: any, value: any, callback: any) {
    
    if(this.fromData.type == 'POSITION_PUBLIC'){
      callback()
    } else {
      if (!value) {
        callback(new Error('请选择绑定的站点'))
      } else {
        callback()
      }
    }
  }
  mounted() {
    this.positionUpdateDetials();
  }
  // 获取编辑数据详情
  private positionUpdateDetials() {
    this.fromData.id = this.$route.query.id || "";
    if (this.fromData.id) {
      positionUpdateDetials({ id: this.fromData.id }).then((res: any) => {
        if (res.code === 0) {
          Object.assign(this.fromData, res.data);
        }
      });
    }
  }
  // 提交
  private handleSubmit() {
    (this.$refs.fromData as any).validate((valid: any) => {
      if (valid) {
        let saveData = this.fromData;
        delete saveData['updateTime']
        delete saveData['createTime']
        adPositionSave(saveData).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("操作成功!");
            this.$router.go(-1);
          }
        });
      } else {
        this.$Message.error("请将信息填写完整!");
      }
    });
  }
  // 返回
  private goBack(){
    this.$router.go(-1)
  }
  // 检查广告编码
  private adCheckCode() {
    // 添加时才校验，编辑时不能修改，因此不校验
    if(!this.fromData.id){
      adCheckCode({ code: this.fromData.code }).then((res: any) => {
        if (res.code !== 0) {
          this.fromData.code = "";
        }
      });
    }
  }
  // 广告示意图修改
  private getLogo(p: any) {
    this.fromData.adPositionImage = p[0]||'';
  }
  //   修改站点
  private updateSite() {
    this.dialogConfig.show = true;
    this.getList();
  }
  //   修改启用禁用状态
  private changeStatus(status: number) {
    if (status === 1) {
      this.fromData.status = 2;
    } else {
      this.fromData.status = 1;
    }
  }

  //   弹窗配置
  private dialogConfig: any = {
    title: "选择站点",
    show: false
  };
  //   查询条件
  private condition: any = {
    name: "",
    type: ""
  };
  //   表格配置
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 6
    },
    pagePosition: "right"
  };
  private loading = true;
  private data: any = {
    header: [
      {
        key: "radio",
        slot: "radio",
        width: 60,
        align: "center"
      },
      {
        title: "站点信息",
        key: "name",
        width: 200,
        slot: "keyword"
      },
      {
        title: "站长手机号",
        key: "sitePhone",
        align: "center"
      },
      {
        title: "类型",
        key: "siteType",
        align: "center",
        slot: "siteType"
      },
      {
        title: "开站时间",
        key: "createTime",
        align: "center"
      }
    ],
    list: []
  };
  // 单选按钮的选中状态对象集
  private radioGroup: any = [];
  // 弹窗表格选中的数据项
  private selectionSite: any;
  //   搜索查询
  private siteSerch() {
    this.getList();
  }
  // 获取列表数据的方法
  private getList(page: any = this.tableConfig.page) {
    Object.assign(this.condition, page);
    getSiteAuditList(this.condition).then((res: any) => {
      if (res.code === 0) {
        this.data.list = res.datas.map((item:any,index:any)=>{
          item._index = index;
          // 回显弹窗
          if(item.id == this.fromData.siteId){
            this.selectionSite = item;
            this.checkRadio(this.selectionSite)
          }
          return item
        });
        this.loading = false;
        this.tableConfig.page = res.page;
      }
    });
  }
  // 站点弹窗点击确定按钮事件
  private okClick() {
    this.dialogConfig.show = false;
    this.fromData.siteId = this.selectionSite.id;
    this.fromData.siteName = this.selectionSite.name;
  }
  //   列表选择项数据变化
  private checkRadio(data: any) {
    // 在有单选项切换时 将其他数据置为 false，只将当前点击的数据置为 true
    for (let key in this.radioGroup) {
      this.radioGroup[key] = false;
    }
    if(data._index || data._index == 0){
      this.radioGroup[data._index] = true;
    }
    this.selectionSite = data;
  }
  // 匹配站点类型
  private getSiteTypeName(code: string) {
    if (code === "scenic") {
      return "景区";
    } else {
      return "政府";
    }
  }
}
</script>

<style lang='scss' scoped>
.from-box {
  padding: 20px;
  .input {
    width: 400px;
  }
  .adinput {
    width: 130px;
    &.heightinput {
      margin: 0 10px;
    }
  }
  .item {
    &.select {
      width: 500px;
    }
    .update {
      color: $theme;
      cursor: pointer;
      &:hover {
        color: $theme-hover;
      }
    }
    .switchLabel {
      margin-right: 5px;
    }
    .switchBox {
      position: relative;
      display: inline-block;
      .cover {
        cursor: pointer;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
  .pwh {
    overflow: auto;
    .pitem {
      float: left;
      &:last-child > div {
        margin-left: 10px !important;
      }
    }
  }
}
.condition {
  min-width: 800px;
  display: flex;
  .fromItem {
    display: flex;
    align-items: center;
    margin-right: 10px;
    label {
      display: inline-block;
      width: 80px;
      text-align: right;
      margin-right: 5px;
    }
  }
}
.table {
  margin-top: 10px;
  .siteInfoDiv {
    display: flex;
    margin: 5px 0;
    .imgDiv {
      width: 50px;
      height: 50px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      display: flex;
      flex: 1;
      margin-left: 5px;
      justify-content: center;
      flex-direction: column;
      p {
        height: 16px;
        line-height: 16px;
      }
    }
  }
}
</style>
