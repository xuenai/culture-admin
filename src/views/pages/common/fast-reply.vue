<template>
  <!--快捷回复-->
  <div class="reply-panel" v-if="list.length">
    <div class="reply-title">快捷回复</div>
    <div class="reply-list mt10">
        <span class="item" v-for="item in list" :key="item" @click="setReply(item)">{{item}}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { replyAllList} from "@service/common";

/**
 * 快捷回复
 */
@Component
export default class fastReply extends Vue {
  mounted() {
   this.getList();
  }
  private list:any=[];
  getList(){
    replyAllList().then((res:any)=>{
      if(res.code===0){
        this.list=res.datas;
      }
    })
  }
  setReply(item:any){
    this.$emit('reply',item);
  }
}
</script>

<style scoped lang="scss">
    .reply-panel{
        padding-left:30px;
        .reply-title{
            font-weight:600;
        }
        .reply-list{
            .item{
              display:inline-block;
              height:25px;
              line-height:25px;
              padding:0 8px;
              border:1px solid #ccc;
              border-radius:4px;
              cursor:pointer;
              &+.item{
                margin-left:10px;
              }
            }
        }
    }
</style>
