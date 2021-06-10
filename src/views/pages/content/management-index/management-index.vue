<!--
 * @Author: 任智勇
 * @since: 2019-06-03 17:57:38
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-12 14:27:04
 -->
<template>
  <div class="management-index">
    <div class="left-panel">
      <TreeList></TreeList>
    </div>
    <div class="right-panel">
      <div class="content">
        <Content></Content>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import TreeList from "./left-tree.vue";
import Content from "./content.vue";

@Component({ components: { TreeList, Content } })
export default class ComponManagementIndex extends Vue {
  mounted(){
   
  }
}
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
