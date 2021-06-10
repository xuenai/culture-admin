<!--
 * @Author: 任智勇
 * @since: 2019-05-29 15:18:35
 * @LastAuthor: 任智勇
 * @lastTime: 2019-06-04 11:59:56
 -->
<template>
  <div class="space">
    <h1 v-if="data.title">
      <span></span>{{data.title}}
    </h1>
    <div class="infos" v-if="data.list.length > 0">
      <div class="left">
        <h3>{{data.list[0].name}}</h3>
        <p>{{data.list[0].value}}</p>
      </div>
      <ul class="detial" v-if="data.list.length > 1">
        <li v-for="(item,index) in data.list" :key="index" v-show="index !== 0" >
          <h3>{{item.name}}</h3>
          <p>{{item.value}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component,Prop, Vue } from "vue-property-decorator";

/**
 * 参数说明：
 * data:{
 *  title:'栏目的标题' 标题 没有则不传
 *  list: [
 *      {
 *          name: '第一行展示内容'
 *          value: '第二行展示内容'
 *      }
 *  ]
 * }
 * 
 */
@Component({ components: {} })
export default class ComponentName extends Vue {
    @Prop() private data: any;
  mounted() {}
}
</script>

<style lang='scss' scoped>
.space {
  padding:20px;
  background-color: $bg01;
  h1 {
    height: 40px;
    line-height: 30px;
    font-size: 16px;
    color: $font01;
    span {
      display: inline-block;
      width: 3px;
      height: 16px;
      border-radius: 1px;
      background-color: $theme;
      margin-right: 10px;
      position: relative;
      top: 3px;
    }
  }
  .infos {
    display: flex;
    text-align: center;
    h3,p{
        font-size: 14px;
    }
    .left {
      width: 130px;
      border-right: 1px solid $borderLight;
      color: $font01;
    }
    ul {
      display: flex;
      li {
        width: 120px;
      }
    }
  }
}
</style>
