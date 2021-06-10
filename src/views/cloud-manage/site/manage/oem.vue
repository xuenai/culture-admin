<!--
 * @Author: 任智勇
 * @since: 2019-05-31 11:15:32
 * @LastAuthor: 任智勇
 * @lastTime: 2019-06-05 16:52:13
 -->
<template>
  <div class="from-box">
    <Form :label-width="80">
      <h3>用户端</h3>
      <FormItem label="技术支持" class="item">
        <Input class="input" type="text" v-model="data.name"/>
      </FormItem>
      <FormItem label="LOGO" class="item">
         <upload key="Uploader1"
            :limit="1"
            @getImagesList="getLogo"
            :defaultImage="data.siteLogo"></upload>
      </FormItem>
      <h3>管理端</h3>
      <FormItem label="技术支持" class="item">
        <Input class="input" type="text" v-model="data.companyName"/>
      </FormItem>
      <FormItem label="LOGO" class="item">
         <upload key="Uploader2"
            :limit="1"
            @getImagesList="getLogo2"
            :defaultImage="data.siteLogo"></upload>
      </FormItem>
      <FormItem>
        <Button type="primary">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import upload from "@components/upload/upload-image.vue"
import up from "@components/upload/upload-singleImg.vue"

@Component({ components: {upload} })
export default class ComponentName extends Vue {
  @Prop() private data: any;
  mounted() {}
  // 获取logo
  private getLogo(p:any){
    console.log(p)
  }
  private getLogo2(p:any){
    console.log(p)
  }
}
</script>

<style lang='scss' scoped>
.from-box {
  padding: 0 20px;
  .item {
    margin: 10px 0;
  }
  .input {
    width: 300px;
  }
  h3 {
    color: $font01;
  }
}
</style>
