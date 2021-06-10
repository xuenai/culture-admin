<template>
  <div class="content">
    <!--tab切换-->
    <Tabs active-key="key2" class="mt20 tab-wrap" :animated="false">
        <!--单次上传-->
        <Tab-pane label="单次上传" key="key1">
         <Upload></Upload>
        </Tab-pane>
        <!--批量上传-->
        <Tab-pane label="批量上传" key="key2">
            <BatchUpload></BatchUpload>
        </Tab-pane>
    </Tabs>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import Upload from './upload.vue'
import BatchUpload from './batch-upload.vue'

@Component({
    components: {
        Upload,
        BatchUpload
    }
})
export default class UploadBatch extends Vue {}
</script>

<style lang='scss' scoped>
.content{
    padding: 0 15px;
}
</style>
