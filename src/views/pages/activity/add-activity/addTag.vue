<template>
  <Modal v-model="show" title="添加活动分类" footer-hide>
    <Form
        ref="addTag"
        :model="addTagForm"
        :label-width="60"
        :rules="addTagRule"
    >
        <FormItem :label-width="0" prop="labelName">
            <Input placeholder="请输入活动分类名称" :maxlength="10" v-model="addTagForm.labelName" />
        </FormItem>
        <div class="btns clearfix">
            <Button class="btn fr" type="primary" @click="addTagSubmit" style="margin-left:20px;">确认</Button>
            <Button class="btn fr" @click="show = false">取消</Button>
        </div>
    </Form>
  </Modal>
</template>
<script lang='ts'>
import {Component, Watch, Vue, Prop} from "vue-property-decorator";
import {saveTags} from "@service/common"

@Component({
  components: {
  }
})
export default class AddTag extends Vue {
  @Prop({default: false}) private value!:boolean;
  //添加活动分类弹窗显示布尔值
  private show: boolean = false;

  @Watch('show')
  showW(v: boolean) {
    this.$emit('input', v)
  }
  @Watch('value')
  valueW(v: boolean) {
    this.show = v
  }
  // 
  private addTagForm:any = {
      labelName: '',
      labelType: 'ACTIVITY_CLASSIFY',
      resourceType: 'CONTENT_TYPE_ACTIVITY',
  }
  private addTagRule:any = {
      labelName: [
          {
              required: true,
              message: "请将信息填写完整",
              trigger: 'change'
          },
          {max:10,message:'最多输入50个字符'}
      ]
  }
  private addTagSubmit () {
      (this.$refs.addTag as any).validate((pass:boolean) => {
          if (pass) {
              saveTags(this.addTagForm).then((res:any) => {
                  if (res.code === 0) {
                      this.$Message.success("添加成功！");
                      this.$emit('getTag', res.data);
                      this.show = false;
                  } else {
                      this.$Message.error(res.message);
                  }
              })
          } else {
              this.$Message.info("请将信息填写完整!");
          }
      })
  }
}
</script>
<style lang="scss" scoped>

</style>