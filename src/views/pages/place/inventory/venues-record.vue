<template>
  <div class="container">
    <div class="title">{{venueName}}</div>
    <Timeline class="mt20" v-if="recordList&&recordList.length">
        <TimelineItem :color="index==0?'green':'blue'" v-for="(item,index) in recordList" :key="item.createTime">
          <div class="item">{{item.createTime}}</div>
          <div class="item mt10">操作员：<b>{{item.phone}}（{{item.createUser}}）</b></div>
          <div class="item mt10 operate">批量修改</div>
          <div class="item mt10">预约状态：<b>{{item.isOpen==1?'开启':'关闭'}}</b></div>
          <div class="item mt10">最大接待人数：<b>{{item.maxNum}}</b></div>
        </TimelineItem>
    </Timeline>
    <div class="mt20 no-data" v-else>
      <div class="daq-no-photo"></div>
      <p class="text-center txt">暂无操作记录</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {getVenueSetUpLog} from '@service/place'

@Component({
  components: {}
})
export default class venuesRecord extends Vue {
  recordList:any=[];
  venueName:string='';
  mounted(){
    getVenueSetUpLog({
      venueId:this.$route.query.venueId
    }).then((res:any)=>{
      this.venueName=res.data.venueName;
      this.recordList=res.data.logList;
    })
  }
}
</script>

<style scoped lang="scss">
.container{
  padding:20px;
  .no-data{
   .daq-no-photo{
     width:500px;
     height:250px;
     margin:auto;
     background-color:#fff;
   } 
  }
  .title{
    font-size:16px;
    font-weight:600;
  }
  .operate{
    color:$theme;
  }
}
</style>
