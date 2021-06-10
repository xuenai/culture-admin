<!--
 * @Author: 任智勇
 * @since: 2019-06-17 17:00:43
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-14 16:36:35
 -->
<template>
  <div class="wrap">
    <Tree
      :data="channelList"
      :show-checkbox="false"
      class="left-panel"
      v-if="channelList.length"
      @on-select-change="setChannel"
    ></Tree>
    <div class="right-panel">
      <div class="tips-panel clearfix">
        <span class="fl title">栏目名称</span>
      </div>
      <Form ref="params" :label-width="150" class="table" :model="params" :rules="ruleValidate">
        <FormItem label="字段名称" class="mt20" prop="fieldName">
          <Input type="text" class="control" placeholder="请输入字段显示的名字" v-model="params.fieldName"/>
        </FormItem>
        <FormItem label="字段代码" class="mt20" prop="fieldCode">
          <Input type="text" class="control" v-show="false" placeholder="请输入字段代码" v-model="params.fieldCode"/>
          <input type="text" class="control ivu-input ivu-input-default" placeholder="请输入字段代码" v-model="params.fieldCode"/>
        </FormItem>
        <FormItem label="表单提交类型" class="mt20" prop="fieldType">
          <Select v-model="params.fieldType" class="control" @on-change="setType">
            <Option v-for="item in formList" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="选项可选值" class="mt20" v-if="params.fieldType === '复选框' || params.fieldType === '单选框' || params.fieldType === '下拉列表（单选）' || params.fieldType === '下拉列表（多选）'">
          <Input
            v-model="params.candidateValue"
            type="textarea"
            placeholder="请输入选项可选值"
            class="control"
            style="width: 400px;"
          />
          <p class="remindd">输入值请用英文","分隔</p>
        </FormItem>
        <FormItem label="默认显示值" class="mt20" v-if="params.fieldType !== '图片' && params.fieldType !== '视频' && params.fieldType !== '音频' && params.fieldType !== '附件'">
          <Input v-model="params.defaultValue" type="text" :maxlength="50" placeholder="请输入默认显示值" class="control"/>
        </FormItem>
        <FormItem label="是否启用表单验证" class="mt20">
          <Select class="control" @on-change="setValidate">
            <Option value="启用">启用</Option>
            <Option value="禁用">禁用</Option>
          </Select>
        </FormItem>
        <FormItem label="是否为必填项" class="mt20" v-if="params.validate === true">
          <Select class="control" @on-change="setMust">
            <Option value="必填">必填</Option>
            <Option value="非必填">非必填</Option>
          </Select>
        </FormItem>
        <FormItem label="高级验证" class="mt20" v-if="params.validate === true">
          <Select class="control" @on-change="setId">
            <Option v-for="(item, index) in bestList" :value="index" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="验证失败提示信息" class="mt20" v-if="params.validate === true">
          <Input v-model="params.failPrompt" type="text" placeholder="请输入验证失败提示信息" class="control"/>
        </FormItem>
        <FormItem label class="mt20">
          <Button type="primary" @click="submitForm">保存</Button>
          <Button class="ml20" @click="$router.go(-1)">取消</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component,Watch, Vue } from "vue-property-decorator";
import { dictType, getFielChannelList, saveExtendField } from "@service/cloud-manage";
@Component
export default class ContentFields extends Vue {
  private channelList: any = [];
  private channelId: any = "";
  private params = <any>{
    channelId: "", // 栏目id
    failPrompt: "", // 验证失败提示
    validateRuleId: "", // 验证规则ID
    validateRule: "", // 验证规则
    must: "", // 是否必填
    validate: "", // 是否验证
    defaultValue: "", // 候选值
    candidateValue: "", // 候选值
    fieldType: "", // 字段类型
    fieldCode: "", // 字段代码
    fieldName: "", // 字段名称
    id: ""
  };
  private formList: Array<String> = [
    "文本框（单行）",
    "文本框（多行）",
    "内容编辑器",
    "复选框",
    "单选框",
    "下拉列表（单选）",
    "下拉列表（多选）",
    "日期选择器",
    "日期选择器（精确到分）",
    "图片",
    "视频",
    "音频",
    "附件"
  ];
  private bestList: any = [];
  private ruleValidate: any = {
    fieldName: [
      { required: true, message: "请将信息填写完整", trigger: "blur" },
      { type: 'string', max: 20, message: '最多只能输入20个字符' }
    ],
    fieldCode: [
      { required: true, message: "请将信息填写完整", trigger: "blur" },
      { type: 'string', max: 20, message: '最多只能输入20个字符' }
    ],
    fieldType: [
      {
        required: true,
        message: "请将信息填写完整",
        trigger: "blur",
        validator: this.checkedType
      }
    ]
  };
  mounted() {
    this.dictType();
    this.getChannelList();
    this.params.channelId = parseInt(this.$route.query.channelId as string);
  }
  @Watch('params.fieldCode',{ immediate: true, deep: true })
  freshFieldCode(newCode:any){
     Object.assign(this.params,{fieldCode:this.params.fieldCode.replace(/[^\a-\z\A-\Z0-9]/g,'')})
  }
 
  // 类型验证
  private setType() {
    (this.$refs.params as any).validate((valid: any) => {});
  }
  private setValidate(e:any) {
    if (e === '禁用') {
      this.params.validate = false
    } else {
      this.params.validate = true
    }
  }
   private setMust(e:any) {
       if (e === '非必填') {
      this.params.must = false
    } else {
      this.params.must = true
    }
  }
  private checkedType(rule: any, value: any, callback: any) {
    if (!value) {
      return callback(new Error("请将信息填写完整"));
      callback();
    }
    callback();
  }

  // 提交
  private submitForm() {
    (this.$refs.params as any).validate((valid: any) => {
      if (!valid) {
        this.$Message.error("请将信息填写完整！");
        return;
      }
      this.saveExtendField()
    });
  }
  // 提交
  private saveExtendField () {
    saveExtendField(this.params)
    .then((data) => {
      if (data.code === 0) {
        this.$Message.success("保存成功！");
        this.$router.go(-1);
      }
    })
  }

  // 高级验证ID
  private setId(e: any) {
    console.log(e,7)
    this.params.validateRule = this.bestList[e].value;
    this.params.validateRuleId = this.bestList[e].id;
  }
  // 高级验证
  private dictType() {
    dictType({
      type: "VALIDATE_RULE"
    }).then(data => {
      this.bestList = data.datas as [];
    });
  }
  // 内容栏目列表
  private getChannelList() {
    let _this = this;
    let channelId = parseInt(this.$route.query.channelId as string);
    getFielChannelList().then(data => {
      let _data = data.datas as [];
      _data.filter((item: any, index: any) => {
        item.children = item.subset;
        item.expand = true;
        if (item.id === channelId) {
          item.selected = true;
        } else {
          item.selected = false;
        }
        item.title = item.name + `（${item.num}）`;
        _this.filterObj(item);
        if (index === _data.length - 1) {
          _this.channelList = _data;
        }
      });
    });
  }
  private filterObj(item: any) {
    let _this = this;
    let channelId = parseInt(this.$route.query.channelId as string);
    if (item.hasOwnProperty("subset")) {
      item.subset.filter(function(child: any) {
        child.children = child.subset;
        child.title = child.name + `（${child.num}）`;
        item.expand = true;
        if (child.id === channelId) {
          child.selected = true;
        } else {
          child.selected = false;
        }
        if (child.hasOwnProperty("subset")) {
          return _this.filterObj(child);
        }
      });
    }
  }
  // 栏目筛选
  private setChannel(e: any) {
    if (e.length) {
      this.params.channelId = e[0].id;
    } else {
      this.params.channelId = this.channelList[0].id;
      this.channelList[0].selected = true;
      console.log(this.channelList[0].selected)
    }
  }
}
</script>

<style lang='scss' scoped>
.remindd {
  margin-top: 10px;
  font-size: 12px;
  line-height: 1;
  color: #999;
}
.control {
  width: 300px;
}
.tips-panel {
  margin-top: 10px;
  background-color: $grayLight;
  padding: 20px;
  .title {
    position: relative;
    padding-left: 10px;
    color: $font01;
    font-weight: 600;
    font-size: 16px;
    &:after {
      position: absolute;
      left: 0;
      top: 4px;
      content: "";
      width: 3px;
      height: 16px;
      border-radius: 1.5px;
      background-color: $theme;
    }
  }
  .tag-content {
    margin-left: 30px;
    color: $font02;
  }
}
.ml20 {
  margin-left: 20px;
}
.mt15 {
  margin-top: 15px;
}
.wrap {
  display: flex;
  .left-panel {
    padding: 0 10px;
    min-width: 180px;
    background: #f8fafe;
    min-height: 100vh;
    max-width: 400px;
  }
  .right-panel {
    flex: 1;
    padding: 20px;
    overflow: hidden;
    .tab-warp {
      padding: 20px;
      background-color: $bg01;
    }
  }
}
</style>
