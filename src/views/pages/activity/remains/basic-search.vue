<template>
  <div class="container pd15">
    <div class="title">
      <h2>大旗生态数据库</h2>
      <p class="mt10 tips">你可以直接使用大旗生态数据库中资源进行使用</p>
    </div>
    <Form class="form" ref="params" :label-width="150" :model="params" :rules="ruleValidate"
      @submit.native.prevent>
      <FormItem :label="`${currType.txt}名称`" prop="name">
        <Input class="control" v-model="params.name" :placeholder="`请输入${currType.txt}名称`" @on-enter="handlerSearch()" />
      </FormItem>
      <FormItem label="行政区域">
        <distPicker :disabledByLevel="true" @onChange="data => params.region = data.region"></distPicker>
      </FormItem>
      <FormItem label="">
        <span class="btn-primary" @click="handlerSearch()">提交</span>
      </FormItem>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import distPicker from "@components/distPicker/distPicker.vue";

@Component({
  components: {
    distPicker
  }
})
export default class list extends Vue {
  private params: any = {
    name: "",
    region: "",
  }
  private ruleValidate: any = {
    name: [
      { type: "string", max: 100, message: "最多输入100个字符", trigger: "blur" }
    ]
  }
  private types: any = {
    CONTENT_TYPE_HERITAGE_EXPERIENCE_BASE: {
      txt: '体验基地',
      path: ''
    }
  }
  private currType: any = {}
  created() {
    this.currType = this.types[this.$route.params.resourceType]
  }
  //搜索
  handlerSearch() {
    (this.$refs.params as any).validate((valid: any) => {
        if (valid) {
            this.$router.push({
                path: this.currType.path,
                query: {
                    name: this.params.name,
                    region: this.params.region
                }
            })
        } else {
            this.$Message.info('填写有误，请重新填写！')
        }
    })
  }
}
</script>

<style scoped lang="scss">
.title {
  margin: 30px 0 30px 30px;
  .tips {
    color: $font06;
  }
}

.control {
  width: 300px !important;
}

.form {
    margin: 30px;
    .btn-primary {
        cursor: pointer;
    }
}
</style>
