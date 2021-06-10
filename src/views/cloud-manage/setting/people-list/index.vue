<template>
  <div class="management-index">
    <TreeList class="left-panel"></TreeList>
    <div class="right-panel">
      <Content class="content"></Content>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import TreeList from "./left-tree.vue";
import Content from "./list.vue";

@Component({ components: { TreeList, Content } })
export default class ComponManagementIndex extends Vue {}
</script>

<style lang='scss' scoped>
.management-index {
  position:relative;
  .left-panel{
    position:fixed;
    left:285px;
    top: 127px;
    height: calc(100vh - 142px);
    width:170px;
    padding:15px 20px;
    overflow: auto;
    background:#fff;
  }
  .right-panel {
    background: $grayDark;
    padding-left:15px;
    margin-left:175px;
    .content {
      background: $bg01;
      min-height: calc(100vh - 142px);
    }
  }
}
</style>
