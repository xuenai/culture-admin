<!--
 * @Author: 任智勇
 * @since: 2019-06-04 10:45:43
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-01 11:27:11
 -->
<template>
  <div class="add-column">
    <Form
      class="content list"
      ref="params"
      :model="params"
      :rules="ruleValidate"
      :label-width="120"
    >
      <FormItem class="formItem" label="父栏目" v-show="columnList.length">
        <Select class="width300" v-model="params.pid">
          <Option v-for="item in columnList" :value="item.id" :key="item.id" :label="item.name">
            <span
              :style="item.channelLevel ? 'padding-left:' + (item.channelLevel * 10) + 'px' : ''"
            >
              <i v-if="item.channelLevel">├</i>
              {{ item.name }}
            </span>
          </Option>
        </Select>
      </FormItem>
      <FormItem class="formItem" label="栏目名称" prop="name">
        <Input
          placeholder="请填写栏目名称"
          ref="name"
          v-model="params.name"
          class="width300"
          @on-change="channelCode"
        />
      </FormItem>
      <FormItem class="formItem" label="栏目代码" prop="channelCode">
        <Input
          placeholder="请填写栏目唯一编码"
          ref="channelCode"
          v-model="params.channelCode"
          v-show="false"
          class="width300"
        />
        <input type="text" class="width300 ivu-input ivu-input-default" placeholder="请填写栏目唯一编码" v-model="params.channelCode"/>
      </FormItem>
      <FormItem class="formItem" label="跳转地址">
        <Input placeholder="请填写栏目跳转地址" v-model="params.url" class="width300"/>
      </FormItem>
      <FormItem class="formItem" label="栏目描述">
        <Input placeholder="一句话描述下栏目" v-model="params.summary" class="width300"/>
      </FormItem>
      <FormItem class="formItem" label="栏目内容">
        <Ueditor v-model="params.content" id="uedit1"></Ueditor>
      </FormItem>
      <div v-show="showMore">
        <FormItem class="formItem" label="栏目图标">
          <UploadImg
            key="Uploader1"
            :limit="1"
            @getImagesList="getLogo"
            :defaultImage="params.logo"
          ></UploadImg>
        </FormItem>
        <FormItem class="formItem" label="栏目背景大图">
          <UploadImg
            key="Uploader2"
            :limit="1"
            @getImagesList="getBac"
            :defaultImage="params.backgroundImg"
          ></UploadImg>
        </FormItem>
      </div>
      <FormItem class="formItem" v-show="!showMore">
        <a class="add-more" @click="clickMore">编辑更多信息</a>
      </FormItem>
      <FormItem class="formItem" label>
        <Button type="primary" @click="checkMsg()">保存</Button>
        <Button type="primary" class="ml10 return" @click="goBack">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang='ts'>
import { Component, Watch ,Vue } from "vue-property-decorator";
import Ueditor from "@components/ueditor/ueditor.vue";
import UploadImg from "@components/upload/upload-image.vue";
import { validate, trim } from "@util/comm";
import {
  getColumnSelect,
  saveColumn,
  generateChannelCode,
  getColumDesc
} from "@service/content";

@Component({
  components: {
    Ueditor,
    UploadImg
  }
})
export default class AddColumn extends Vue {
  private params: any = {
    id: "",
    pid: "", // 父级栏目
    name: "", // 栏目名称
    channelCode: "", // 栏目代码
    url: "", // 栏目跳转地址
    summary: "", // 栏目描述
    content: "", //栏目内容
    logo: "", // 栏目图标
    backgroundImg: "" // 栏目背景图
  };
  @Watch('params.channelCode',{ immediate: true, deep: true })
  freshFieldCode(newCode:any){
     Object.assign(this.params,{channelCode:this.params.channelCode.replace(/[^\a-\z\A-\Z0-9]/g,'')})
  }

  mounted() {
    // 修改详情
    let id = this.$route.query.id||'';
    if (id) {
      this.params.id = id;
      getColumDesc({
        id: this.params.id
      }).then(data => {
        this.params = data.data;
      });
    }
    this.getColumnSelect(id);
  }
  // 图标
  private getLogo(e: any) {
    this.params.logo = e.join(",");
  }
  // 背景图
  private getBac(e: any) {
    this.params.backgroundImg = e.join(",");
  }
  // 保存栏目
  private submitForm() {
    saveColumn(this.params).then(data => {
      if (data.code === 0) {
        this.$Message.success("保存成功！");
        // window.history.go(-1);
        this.$router.replace({path: '/con-column-list'});
      }
    });
  }

  // 编辑更多信息
  private showMore = false;
  private clickMore() {
    this.showMore = !this.showMore;
  }
  // 父级栏目
  private columnList: Array<Object> = [];
  // 栏目code
  private channelCode() {
    if (!this.params.name.length) {
      this.params.channelCode = "";
      return false;
    }
    generateChannelCode({
      name: this.params.name
    }).then(data => {
      if (data.code === 0) {
        this.params.channelCode = data.data;
      } else {
        this.params.channelCode = "";
      }
    });
  }
  private ruleValidate = {
    name: [{ required: true, message: "请将信息填写完整", trigger: "blur" },{ type: 'string', max: 20, message: '最多只能输入20个字符' }],
    channelCode: [{ required: true, message: "请将信息填写完整", trigger: "blur" },{ type: 'string', max: 20, message: '最多只能输入20个字符' }]
  };

  // 栏目列表
  private getColumnSelect(id:any) {
    getColumnSelect({ignoreId:id}).then(data => {
      let datas: any = [];
      this.filterArr(data.datas);
    });
  }
  private filterArr(arr: any) {
    let _this = this;
    arr.filter((item: any) => {
      _this.columnList.push(item);
      item.channelLevel = 0;
      return _this.filterObj(item);
    });
  }
  private filterObj(item: any) {
    let _this = this;
    if (item.hasOwnProperty("subset")) {
      item.subset.filter(function(child: any) {
        child.channelLevel = item.channelLevel + 1;
        _this.columnList.push(child);
        if (child.hasOwnProperty("subset")) {
          return _this.filterObj(child);
        }
      });
    }
  }

  // 正则验证c
  private checkMsg() {
    (this.$refs.params as any).validate((valid: any) => {
      if (!valid) {
        this.$Message.error("请将信息填写完整！");
        return;
      }
      this.submitForm();
    });
  }
  private goBack(){
    this.$router.replace({path: '/con-column-list'});
  }
}
</script>

<style lang='scss' scoped>
$grayBtn: #c8c8c8;
.width300 {
  width: 300px;
}
.width150 {
  width: 150px;
}
.width700 {
  width: 610px;
}
.ml10 {
  margin-left: 10px;
}
.add-column {
  background: $grayDark;
  .content {
    background: #fff;
  }
  .list {
    padding: 0 15px 0;
    overflow: hidden;
    &:first-child {
      padding-top: 25px;
    }
    &:last-child {
      padding-bottom: 25px;
    }
    .formItem {
      margin-top: 20px;
      i {
        font-size: 10px;
        margin-right: 2px;
      }
    }
    .return {
      background: $grayBtn;
      border-color: $grayBtn;
      &:hover {
        background: $grayBtn;
      }
    }
  }
  .add-more {
    margin-right: 20px;
    color: $theme;
    cursor: pointer;
    &:hover {
      color: $theme-hover;
    }
  }
}
</style>
