<!--
 * @Author: 任智勇
 * @since: 2019-05-31 10:51:35
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-26 17:59:42
 -->
<template>
  <div class="edit-box">
    <Form class="from-box" ref="fromData" :model="saveData" :rules="ruleValidate" :label-width="80">
      <FormItem label="联盟名称" prop="name" placeholder="请输入联盟名称" class="item">
        <Input class="input" :maxlength="20" type="text" v-model="saveData.name"/>
      </FormItem>
      <FormItem label="联盟描述" prop="unionRemark">
        <Input
          class="input"
          v-model="saveData.unionRemark"
          type="textarea"
          :maxlength="50"
          :autosize="{minRows: 2,maxRows: 5}"
          placeholder="请输入联盟描述"
        />
        <p>50字以内</p>
      </FormItem>
      <FormItem label="联盟口号" placeholder="请输入联盟口号" class="item">
        <Input class="input" type="text" placeholder="最多输入20个字符" :maxlength="20" v-model="saveData.unionSlogan"/>
      </FormItem>
      <FormItem label="LOGO" class="item">
        <upload
          key="Uploader1"
          :limit="1"
          @getImagesList="getLogo"
          :defaultImage="saveData.unionLogo"
        ></upload>
      </FormItem>
      <FormItem label="联盟成员" class="item" prop="siteIds">
        <Input type="text" v-model="saveData.siteIds" v-show="false"/>
        <member :list="list" @onChange="memberChange"></member>
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
import member from "./addMember.vue";
import upload from "@components/upload/upload-image.vue";
import { unionView, unionSave } from "@service/cloud-manage";

@Component({ components: { member, upload } })
export default class ComponentName extends Vue {
  private saveData: any = {
    id: "",
    name: "",
    unionRemark: "",
    unionSlogan: "",
    unionLogo: "",
    status: 1,
    siteIds: "" // 联盟绑定的站点id字符串，逗号分隔
  };
  private fromData: any = {};
  private ruleValidate: any = {
    name: [{ required: true, message: "该项不能为空", trigger: "blur" },
    { type: "string", max: 20, message: "最多输入20个字符", trigger: "blur" },],
    unionRemark: [
      { required: true, message: "该项不能为空", trigger: "blur" },
      { type: "string", min: 3, message: "至少输入3个字符", trigger: "blur" },
      { type: "string", max: 50, message: "最多输入50个字符", trigger: "blur" },
    ],
    siteIds: [{ required: true, message: "该项不能为空" ,validator:this.checkedCreateCompany ,trigger: "change"}],
  };
  private checkedCreateCompany(rule: any, value: any, callback: any) {
      if (!this.saveData.siteIds) {
          return callback(new Error("该项不能为空"));
      }
      callback();
  }

  // 成员列表数据
  private list: any = [];
  mounted() {
    this.unionView();
  }
  // 获取数据
  private unionView() {
    let id = this.$route.query.id || "";
    if (id) {
      this.fromData.id = id;
      unionView({ id: id }).then((res: any) => {
        if (res.code === 0) {
          this.fromData = res.data;
          this.saveData.id = res.data.id;
          this.saveData.name = res.data.name;
          this.saveData.unionRemark = res.data.unionRemark;
          this.saveData.unionSlogan = res.data.unionSlogan;
          this.saveData.unionLogo = res.data.unionLogo;
          this.saveData.status = res.data.status;
          this.list = res.data.sites;
          res.data.sites.map((item:any)=>{ 
            item.siteLanguage=res.data.siteLanguage;
            item.siteVersion=res.data.siteVersion;
            })
          this.memberChange(res.data.sites);
        }
      });
    }
  }
  // 提交
  private handleSubmit() {
    (this.$refs.fromData as any).validate((valid: any) => {
      if (valid) {
        unionSave(this.saveData).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("操作成功!");
            this.$router.go(-1)
          }
        });
      }
    });
  }
  // 返回
  private goBack(){
    this.$router.go(-1)
  }
  // logo修改
  private getLogo(p: any) {
    this.saveData.unionLogo = p[0];
  }
  // 成员数据变化
  private memberChange(list: any) {
    this.list = list;
    this.saveData.siteIds = "";
    list.forEach((item: any) => {
      this.saveData.siteIds += item.id + ",";
    });
    if (this.saveData.siteIds.length > 0) {
      this.saveData.siteIds = this.saveData.siteIds.substr(
        0,
        this.saveData.siteIds.length - 1
      );
    }
    (this.$refs.fromData as any).validateField('siteIds');
  }
}
</script>

<style lang='scss' scoped>
.edit-box {
  height: 100%;
  background-color: $grayDark;
  .from-box {
    background-color: $bg01;
    padding: 20px;
  }
  .input {
    width: 300px;
  }
}
</style>
