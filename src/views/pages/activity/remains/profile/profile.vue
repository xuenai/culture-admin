<template>
  <div class="container">
    <Row class="row count-wrap">
      <Col span="4" class="summary item">
        <p class="item-count">{{data.itemNum}}</p>
        <p class="item-name">非遗项目总数</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{data.peopleNum}}</p>
        <p class="item-name">代表性传承人</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{data.experienceBaseNum}}</p>
        <p class="item-name">项目体验基地</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{data.teachingBaseNum}}</p>
        <p class="item-name">传习保护示范基地</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{data.protectBaseNum}}</p>
        <p class="item-name">生产性保护示范基地</p>
      </Col>
    </Row>
    <Row class="row chart-container">
      <Col span="14" class="col-item">
        <div class="chart-wrap">
          <div class="tips-title">非遗项目及代表性传承人统计情况</div>
          <ul class="method ml20">
            <li
              :class="{active:type1==item.type}"
              v-for="item in methods"
              :key="item.type"
              @click="checkMethod(item,'type1')"
            >{{item.name}}</li>
          </ul>
          <div class="chart">
            <PieChart class="chart-div" :configure="pieChartConfig1"></PieChart>
          </div>
        </div>
      </Col>
      <Col span="10" class="col-item">
        <div class="chart-wrap ml10 pd20">
          <ul class="tab-panel">
            <li
              :class="{active:levelActive===index}"
              v-for="(item,index) in level"
              :key="item.id"
              @click="setActive('level',item,index)"
            >{{item.name}}</li>
          </ul>
          <p class="tab-count">总计{{levelData.total}}项</p>
          <Row class="list-panel">
            <Col class="item" span="8" v-for="item in levelData.list" :key="item.type">
              <p class="num">{{item.num}}</p>
              <p>{{item.type}}</p>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
    <Row class="row chart-container">
      <Col span="14" class="col-item">
        <div class="chart-wrap">
          <div class="tips-title">非遗项目及代表性传承人批次统计</div>
          <ul class="method ml20">
            <li
              :class="{active:type2==item.type}"
              v-for="item in methods"
              :key="item.type"
              @click="checkMethod(item,'type2')"
            >{{item.name}}</li>
          </ul>
          <div class="chart">
            <PieChart class="chart-div" :configure="pieChartConfig2"></PieChart>
          </div>
        </div>
      </Col>
      <Col span="10" class="col-item">
        <div class="chart-wrap ml10 pd20">
          <ul class="tab-panel">
            <li
              :class="{active:batchActive===index}"
              v-for="(item,index) in batch"
              :key="item.id"
              @click="setActive('batch',item,index)"
            >{{item.name}}</li>
          </ul>
          <p class="tab-count">总计{{batchData.total}}项</p>
          <Row class="list-panel">
            <Col class="item" span="8" v-for="item in batchData.list" :key="item.type">
              <p class="num">{{item.num}}</p>
              <p>{{item.type}}</p>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PieChart from "@components/pieChart/pieChart.vue";
import {getHeritageOverview,getHeritageItemByLevel,getHeritageItemByBatch,getHeritageItemByType} from "@service/activity.ts";
import {dictType} from "@service/common.ts";

@Component({
  components: {
    PieChart
  }
})
export default class profile extends Vue {
  /*S tab 切换*/
  private level: Array<any> = [];
  private batch: Array<any> = [];
  private dictTypes: Array<any> = [
    {type:'HERITAGE_LEVEL',name:'level'},
    {type:'HERITAGE_BATCH',name:'batch'}
    ];
  private levelActive: any = 0;
  private batchActive: any = 0;
  /**
   * @param typeName 类型（level,batch）初始化不传，默认初始化
   */
  getDictType(typeName:any=''){
    if(typeName){
      dictType({type:typeName==='level'?'HERITAGE_LEVEL':'HERITAGE_BATCH'}).then((res:any)=>{
          this[typeName]=res.datas;
          if(typeName==='level'){
            //默认非遗项目统计情况 右侧列表
            this.getTypeList(this.type1,res.datas[0].id);
          }else{
            //默认非遗项目批次列表
            this.getLevelList(this.type2,res.datas[0].id)
          }
      })
    }else{
      this.dictTypes.forEach((item:any)=>{
          dictType({type:item.type}).then((res:any)=>{
              this[item.name]=res.datas;
              if(item.name==='level'){
                //默认非遗项目统计情况 右侧列表
                this.getTypeList(this.type1,res.datas[0].id);
              }else{
                this.getLevelList(this.type2,res.datas[0].id)
              }
          })
      })
    }
  }
  setActive(type:any,item:any,index:Number){
    if(type==='level'){
      this.levelActive=index;
      this.getTypeList(this.type1,item.id);
    }else{
      this.batchActive=index;
      this.getLevelList(this.type2,item.id);
    }
  }
  /*E tab 切换*/
  /*S 单选切换 */
  private methods: any = [
    {
      name:"非遗项目",
      type:'CONTENT_TYPE_HERITAGE_ITEM'
    }, 
    {
      name:"代表性传承人",
      type:'CONTENT_TYPE_HERITAGE_PEOPLE'
    }
    ];
  private type1: any = "CONTENT_TYPE_HERITAGE_ITEM";
  private type2: any = "CONTENT_TYPE_HERITAGE_ITEM";
  private checkMethod(item: any, name: any) {
    this[name] = item.type;
    if(name==='type1'){
      this.getTypeList(item.type);//统计情况(第一个饼图)
       this.getDictType('level');//级别列表
    }else{
      this.getHeritageItemByBatch(item.type);//批次统计(第二个饼图)
       this.getDictType('batch');//批次列表
    }
  }
  /*E 单选切换 */

  /*S 批次统计饼图*/
  //饼图配置
  private pieChartConfig2: any = {
    data: [
      // { value: 10, name: "第一批" }
    ],
    type: "pie",
    tooltip: {
      show: false
    },
    seriesName: "项目类型",
    color: ["#2fa6ef", "#20daa3", "#9e84e7", "#9de192"] //颜色数组
  };
  getHeritageItemByBatch(type:any){
    getHeritageItemByBatch({
      type:type
    }).then((res:any)=>{
        this.pieChartConfig2.data=res.data.list.map((item:any)=>({
          value:item.num,
          name:item.type
          }))
    })
  }
  /*E 批次统计饼图*/

  /*S 中间统计情况(饼图和右侧列表) */
  //饼图配置
   private pieChartConfig1: any = {
    data: [
      // { value: 10, name: "" }
    ],
    type: "pie",
    tooltip: {
      show: false
    },
    seriesName: "项目类型",
    color: ["#2fa6ef", "#20daa3", "#9e84e7", "#9de192", "#9de192"] //颜色数组
  };
  private levelData:any={};
  /**
   * @param resourType 资源类型
   * @param level 级别id(级别是字典接口查询的id 例：世界级 国家级 )
   */
  getTypeList(resourType:any,level:any=''){
    getHeritageItemByType({
      type:resourType,
      level:level
      }).then((res:any)=>{
        if(level){ //传级别获取列表数据
          this.levelData=res.data;
        }else{
          //获取饼图数据
          this.pieChartConfig1.data=res.data.list.map((item:any)=>({
            value:item.num,
            name:item.type
          }))
        }
    })
  }
  /*E 中间统计情况 */
  private batchData:any={};
  /*S 批次统计列表 */
   /**
   * @param resourType 资源类型
   * @param batch 级别id(查询字典接口的批次id 例：第一批 第二批 )
   */
  getLevelList(resourType:any,batch:any){
    getHeritageItemByLevel({
      type:resourType,
      batch:batch
    }).then((res:any)=>{
      this.batchData=res.data;
    })
  }
  /*E 批次统计列表 */
  /*S顶部数量 */
    private data: any={};
    private getOverview() {
      getHeritageOverview({}).then((res:any)=>{
        this.data=res.data
      })
    }
  /*E顶部数量 */
  created() {
    //共计项目
    this.getOverview();
    //类型,批次 字典列表
    this.getDictType();
    //默认非遗项目统计情况 左侧饼图
    this.getTypeList(this.type1);
    //批次统计
    this.getHeritageItemByBatch(this.type1);
  
  }
  mounted() {}
}
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  background-color: $grayDark;
  padding: 0 !important;
  .tips-title {
    position: relative;
    padding: 15px 15px 15px 30px;
    font-weight: 600;
    font-size: 16px;
    color: $font01;
    &:after {
      position: absolute;
      left: 20px;
      top: 18px;
      content: "";
      width: 3px;
      height: 16px;
      background-color: $theme;
      border-radius: 1.5px;
    }
    .tip {
      font-size: 12px;
      color: $lightGray;
    }
  }
  .count-wrap {
    background-color: $bg01;
    padding: 25px 15px;
  }
  .row {
    .item {
      text-align: center;
    }
    .item-count {
      font-size: 26px;
      color: $theme;
    }
    .item-name {
      font-size: 16px;
      color: $font01;
      margin-top: 10px;
    }
    .summary {
      position: relative;
      .item-count {
        color: $danger !important;
      }
      &:after {
        content: "";
        position: absolute;
        top: 10px;
        right: 1px;
        height: 70px;
        width: 1px;
        background-color: $borderLight;
      }
    }
    & + .row {
      margin-top: 15px;
    }
  }
  .chart-container {
    position: relative;
    height: calc(75% - 180px);
    .col-item {
      height: 100%;
    }
  }
  .chart-wrap {
    height: 100%;
    padding-top: 5px;
    background-color: $bg01;
    .chart {
      height: calc(100% - 100px);
      margin-right: 20px;
    }
    .chart-div {
      height: 100%;
    }
    .method {
      position: relative;
      z-index: 999;
      float: left;
      display: flex;
      font-weight: normal;
      border: 1px solid $borderLight;
      border-left: none;
      li {
        border-left: 1px solid $borderLight;
        width: 100px;
        font-size: 14px;
        text-align: center;
        height: 26px;
        line-height: 26px;
        cursor: pointer;
        &:hover,
        &.active {
          background-color: $success;
          color: #fff;
        }
      }
    }
    .tab-count {
      margin: 20px 0;
      text-align: center;
      font-weight: 600;
      font-size: 16px;
    }
    .tab-panel {
      display: flex;
      margin-top: 50px;
      li {
        flex: 1;
        padding: 10px 0;
        text-align: center;
        font-size: 15px;
        cursor: pointer;
        &.active {
          padding: 8px 0;
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
    .list-panel {
      .item {
        padding: 20px 0;
        margin-top: -1px;
        border: 1px solid $borderLight;
        &+.item{
          margin-left:-1px;
        }
        .num {
          margin-bottom: 5px;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
