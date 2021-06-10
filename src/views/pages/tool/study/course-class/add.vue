<template>
  <Form class="form" ref="params" :model="params" :rules="ruleValidate" :label-width="120">
    <FormItem label="分类名称" prop="name">
      <Input placeholder="请填写分类名称" v-model="params.name" :maxlength="20" class="w300" />
    </FormItem>
    <FormItem label="分类代码" prop="code">
      <Input placeholder="请填写分类代码" v-model="params.code" :maxlength="20" class="w300" />
    </FormItem>
    <FormItem label="排序" prop="sort">
      <InputNumber :min="1" :max="999" v-model="params.sort" class="w300"></InputNumber>
    </FormItem>
    <FormItem label="分类图片" prop="image">
        <UploadImg :defaultImage="defaultImage" @getImagesList="arr => params.image = arr[0]" :limit="1" :wToh="{}" :compress="1"></UploadImg>
    </FormItem>
    <FormItem class="formItem" label="">
      <Button @click="handleSave()" type="primary">保存</Button>
      <Button @click="handleSave(true)" type="primary" class="ml10">保存并继续添加</Button>
      <Button type="primary" class="ml10" @click="back">返回</Button>
    </FormItem>
  </Form>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import UploadImg from "@components/upload/upload-image-6.vue";
import { AppModule } from "@store/modules/app";
import { getSchoolCourseType, saveSchoolCourseType } from "@service/tool"

@Component({
  components: {
    UploadImg
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
    code: "",
    sort: 999,
    image: '',
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
        message: "只能输入1-20个字符",
        trigger: "blur",
        pattern: /^.{1,20}$/
      }
    ],
    code: [
      {
        required: true,
        message: "请将信息填写完整",
        trigger: "blur"
      },
      {
        message: "只能输入2-20个字符",
        trigger: "blur",
        pattern: /^.{2,20}$/
      }
    ],
    sort: [
      {
        message: "最大输入999",
        trigger: "blur",
        pattern: /^\d{0,3}$/
      }
    ]
  };

  created() {
    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
      this.getSchoolCourseType(this.$route.query.id);
    }
  }

  private reset() {
    this.params = {
      name: "",
      code: "",
      sort: "",
      image: '',
    }
    this.defaultImage = []
  }
  private getSchoolCourseType(id: any) {
    getSchoolCourseType({ id }).then((res: any) => {
      if (res.code === 0) {
        this.params = Object.assign(this.params, res.data);
        this.defaultImage = [res.data.image]
      }
    });
  }
  // 点击保存
  private handleSave(reset?: boolean) {
    (this.$refs.params as any).validate((valid: any) => {
      if (!valid) {
        this.$Message.info("请将信息填写完整！");
        return;
      }
      saveSchoolCourseType(this.params).then((res: any) => {
        if (res.code === 0) {
          this.$Message.success("保存成功！");
          if (reset) {
            this.reset()
          } else {
            if (this.$route.query.id) {
              this.back();
            } else {
              this.$router.push({ path: "/course-class-list" });
            }
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
