
<template>
  <div class="from-box">
    <tags resourceType="SITE_TAG_TYPE" 
          :style="{display: 'block'}" 
          :defaultIds="params.tags"
          :limit="3"
          @onChange="ids => params.tags = ids"></tags>
    <Button type="primary" @click="saveTag" class="btn">确定</Button>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import tags from "@components/tags/tags.vue";
import {saveCloudSite} from '@service/common.ts'

@Component({
  components: { tags },
})
export default class Store extends Vue {
  @Prop() params!: {tags: string | undefined, id: number}
  
  private saveTag() {
    if (this.params.tags) {
      saveCloudSite(this.params).then((res:any) => {
        if (res.code === 0) {
          this.$Message.success('保存成功！');
        }
      })
    } else {
      this.$Message.info('未选择任何标签！');
    }
  }
}
</script>

<style lang='scss' scoped>
.from-box {
  padding: 15px;
  background-color: $bg01;
  .btn {
    margin-top: 20px;
  }
}
</style>
