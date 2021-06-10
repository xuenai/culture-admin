<template>
  <Form class="form" ref="params" :model="params" :rules="ruleValidate" :label-width="120">
    <FormItem label="姓名" prop="name">
      <Input placeholder="2-10字" v-model="params.name" :maxlength="10" class="w300" />
    </FormItem>
    <FormItem label="性别" prop="sex">
      <RadioGroup v-model="params.sex">
        <Radio label="1">男</Radio>
        <Radio label="2">女</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="职务" prop="position">
      <Input placeholder="2-10字" v-model="params.position" :maxlength="10" class="w300" />
    </FormItem>
    <FormItem label="手机号" prop="phone">
      <Input type="tel" v-model="params.phone" class="w300" />
    </FormItem>
    <FormItem label="民族" prop="nation">
      <Input v-model="params.nation" :maxlength="50" class="w300" />
    </FormItem>
    <FormItem label="邮箱" prop="email">
      <Input type="email" placeholder="2-30字" v-model="params.email" class="w300" />
    </FormItem>
    <FormItem label="籍贯" prop="hometown">
      <Input placeholder="2-30字" v-model="params.hometown" :maxlength="50" class="w300" />
    </FormItem>
    <FormItem label="排序" prop="sort">
      <InputNumber :min="1" :max="999" v-model="params.sort" class="w300"></InputNumber>
    </FormItem>
    <FormItem label="照片" prop="image">
        <UploadImg :defaultImage="defaultImage" @getImagesList="arr => params.image = arr[0]" :limit="1" :wToh="{}" :compress="1"></UploadImg>
    </FormItem>
    <FormItem label="概述" prop="overview">
      <Input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model="params.overview" :maxlength="150" class="w300" />
    </FormItem>
    <FormItem label="简介" prop="introduction">
      <Ueditor id="uedit1" v-model="params.introduction"></Ueditor>
    </FormItem>
    <FormItem class="formItem" label="">
      <Button @click="handleSave()" type="primary">提交</Button>
      <Button type="primary" class="ml10" @click="back">返回</Button>
    </FormItem>
  </Form>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import UploadImg from "@components/upload/upload-image-6.vue";
import Ueditor from "@components/ueditor/ueditor.vue";
import { AppModule } from "@store/modules/app";
import { getSchoolLecturer, saveSchoolLecturer } from "@service/tool"

@Component({
  components: {
    UploadImg,
    Ueditor
  }
})
export default class BrandAdd extends Vue {
  get userInfo() {
    return AppModule.userInfo;
  }
  private defaultImage: string[] = [];
  // 提交参数
  private params = <any>{
    name: "",
    sex: "",
    position: "",
    phone: '',
    nation: '',
    email: '',
    hometown: '',
    image: '',
    overview: '',
    introduction: '',
    sort: '',
  };
  // 验证规则
  private ruleValidate = <any>{
    name: [
      {
        required: true,
        message: "请将信息填写完整",
        trigger: "blur"
      },
      {
        message: "只能输入2-10个字符",
        trigger: "blur",
        pattern: /^.{2,10}$/
      }
    ],
    position: [
      {
        required: true,
        message: "请将信息填写完整",
        trigger: "blur"
      },
      {
        message: "只能输入2-10个字符",
        trigger: "blur",
        pattern: /^.{2,10}$/
      }
    ],
    overview: [
      {
        required: true,
        message: "请将信息填写完整",
        trigger: "blur"
      },
      {
        message: "最多输入150个字符",
        trigger: "blur",
        pattern: /^.{1,150}$/
      }
    ],
    introduction: [
      {
        required: true,
        message: "请将信息填写完整",
        trigger: "change"
      }
    ],
    phone: [
      {
        required: true,
        message: "请将信息填写完整",
        trigger: "change"
      },
      {
        validator: this.validatePhone,
        trigger: "blur"
      }
    ],
    email: [
      { type: 'email', message: '邮箱格式不合法', trigger: 'blur' }
    ]
  };

  private validatePhone(rule: any, value: any, callback: Function) {
    if (this.params.phone) {
      if ( (/^1[3456789]\d{9}$/.test(this.params.phone)) ) {
        return callback()
      } else {
        return callback(new Error("手机号格式不合法"))
      }
    } else {
        return callback(new Error("请将信息填写完整"))
    }
  }

  created() {
    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
      this.getSchoolLecturer(this.$route.query.id);
    }
  }

  @Watch('params.introduction', {deep: true})
  wIntroduction(n:any) {
    (this.$refs.params as any).validateField('introduction')
  }

  private reset() {
    this.params = {
      name: "",
      sex: "",
      position: "",
      phone: '',
      nation: '',
      email: '',
      hometown: '',
      image: '',
      overview: '',
      introduction: '',
      sort: '',
    }
    this.defaultImage = []
  }
  
  private getSchoolLecturer(id: any) {
    getSchoolLecturer({ id }).then((res: any) => {
      if (res.code === 0) {
        this.params = res.data;
        if (res.data.image) this.defaultImage = [res.data.image]
      }
    })
  }
  // 点击保存
  private handleSave() {
    (this.$refs.params as any).validate((valid: any) => {
      if (!valid) {
        this.$Message.info("检查填写是否正确完整！");
        return;
      }
      saveSchoolLecturer(this.params).then((res: any) => {
        if (res.code === 0) {
          this.$Message.success("保存成功！");
          if (this.$route.query.id) {
            this.back();
          } else {
            this.$router.push({ path: "/lecturer-list" });
          }
        }
      });
    });
  }

  // 返回
  private back() {
    window.history.back();
  }
}
</script>

<style lang='scss' scoped>
.w300 {
  width: 300px;
}
.form {
  padding: 40px 0;
}
</style>
