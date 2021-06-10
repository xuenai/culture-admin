<template>
  <div class="list-panel">
    <Row class="item">
      <i-col span="2" class="item-name tit">基本信息</i-col>
    </Row>
    <!-- <Row class="item">
            <i-col span="2" class="item-name">活动类型</i-col>
            <i-col span="22" class="item-content">{{ACTIVITY_TYPE[iData.type]}}</i-col>
        </Row>
        <Row class="item">
            <i-col span="2" class="item-name">活动方式</i-col>
            <i-col span="22" class="item-content">{{ACTIVITY_METHOD[iData.method]}}</i-col>
        </Row> -->
    <Row class="item">
      <i-col span="2" class="item-name">创建者</i-col>
      <i-col span="22" class="item-content">{{iData.createName}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">活动名称</i-col>
      <i-col span="22" class="item-content">{{iData.name}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">活动副标题</i-col>
      <i-col span="22" class="item-content">{{iData.subhead}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">活动特色</i-col>
      <i-col span="22" class="item-content">{{iData.remark}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">活动分类</i-col>
      <i-col span="22" class="item-content">{{iData.activityClassifyName}}</i-col>
    </Row>
    <Row class="item" v-if="iData.tagNames">
      <i-col span="2" class="item-name">活动标签</i-col>
      <i-col span="22" class="item-content">
        <span class="choice-tag active" v-for="(tag,i) in iData.tagNames.split(',')"
          :key="i">{{tag}}</span>
      </i-col>
    </Row>
    <Row class="item" v-if="iData.useStartTime && iData.useEndTime">
      <i-col span="2" class="item-name">活动时间</i-col>
      <i-col span="22" class="item-content">{{iData.useStartTime.slice(0,-3)}} -
        {{iData.useEndTime.slice(0,-3)}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">联系电话</i-col>
      <i-col span="22" class="item-content">{{iData.phone}}</i-col>
    </Row>

    <p class="to-open toggle" @click="openAllIn = true" v-show="openAllIn === false">点击展开全部活动信息↓</p>
    <div class="maybehide" :class="{hidden: !openAllIn}">
      <Row class="item">
        <i-col span="2" class="item-name">活动级别</i-col>
        <i-col span="22" class="item-content">
          {{iData.activityLevel?(activityLevel.filter(d=>d.value==iData.activityLevel)[0].labelName):''}}
        </i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">可参加人数</i-col>
        <i-col span="22" class="item-content">{{iData.stock}}人</i-col>
      </Row>
      <Row class="item" v-if="iData.activityName">
        <i-col span="2" class="item-name">活动场所</i-col>
        <i-col span="22" class="item-content">{{iData.activityName}}</i-col>
      </Row>
      <Row class="item" v-if="iData.regionName">
        <i-col span="2" class="item-name">活动地址</i-col>
        <i-col span="22" class="item-content">
          {{iData.regionName.split(',').join('') +' '+ iData.address}}</i-col>
      </Row>
      <Row class="item" v-if="iData.longitude">
        <i-col span="2" class="item-name"><span style="opacity:0">.</span></i-col>
        <i-col span="22" class="item-content">
          <descMap id="map" :longitude="iData.longitude" :latitude="iData.latitude"></descMap>
        </i-col>
      </Row>
      <Row class="item" v-if="iData.voluntTeamName">
        <i-col span="2" class="item-name">关联志愿团</i-col>
        <i-col span="22" class="item-content">{{iData.voluntTeamName}}</i-col>
      </Row>
      <Row class="item" v-if="iData.associationName">
        <i-col span="2" class="item-name">关联文化社团</i-col>
        <i-col span="22" class="item-content">{{iData.associationName}}</i-col>
      </Row>
      <Row class="item" v-if="iData.alreadyActivityNames">
        <i-col span="2" class="item-name">往期活动</i-col>
        <i-col span="22" class="item-content">{{iData.alreadyActivityNames}}</i-col>
      </Row>

      <!-- 活动单位 -->
      <Row class="item tit">
        <i-col span="2" class="item-name tit">活动单位</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">主办单位</i-col>
        <i-col span="22" class="item-content">{{iData.sponsor}}</i-col>
      </Row>
      <Row class="item" v-if="iData.coOrganizer">
        <i-col span="2" class="item-name">协办单位</i-col>
        <i-col span="22" class="item-content">{{iData.coOrganizer}}</i-col>
      </Row>
      <Row class="item" v-if="iData.undertakeUnit">
        <i-col span="2" class="item-name">承办单位</i-col>
        <i-col span="22" class="item-content">{{iData.undertakeUnit}}</i-col>
      </Row>
      <Row class="item" v-if="iData.teachUnit">
        <i-col span="2" class="item-name">指导单位</i-col>
        <i-col span="22" class="item-content">{{iData.teachUnit}}</i-col>
      </Row>

      <!-- 活动介绍 -->
      <Row class="item tit">
        <i-col span="2" class="item-name tit">活动介绍</i-col>
      </Row>
      <Row class="item" v-if="iData.images && iData.images.length > 0">
        <i-col span="2" class="item-name">活动主图</i-col>
        <i-col span="22" class="item-content img-list">
          <p class="img" v-for="(img,imgIndex) in iData.images.split(',')" :key="imgIndex">
            <img @click="viewImgWin(iData.images.split(','), imgIndex)" :src="img" alt>
          </p>
        </i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">活动介绍</i-col>
        <i-col span="22" class="item-content" v-html="iData.introduce"></i-col>
      </Row>
      <Row class="item" v-if="iData.hint">
        <i-col span="2" class="item-name">温馨提示</i-col>
        <i-col span="22" class="item-content" v-html="iData.hint"></i-col>
      </Row>
    </div>
    <p class="to-hidden toggle" @click="openAllIn = false" v-show="openAllIn === true">点击收起活动信息↑</p>

    <PreviewPics v-model="imgView" :imgs="imgUrl" :currIndex="currIndex"></PreviewPics>
    <DetailRes v-if="iData.resultId" :rId="iData.resultId"></DetailRes>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { PreviewPics } from "@components/index";
import { ACTIVITY_METHOD, ACTIVITY_TYPE } from "@constant/index";
import descMap from "@components/map/desc-map.vue";
import DetailRes from "@views/pages/activity/results-management/detail-res.vue";
@Component({
  components: { PreviewPics, descMap, DetailRes }
})
export default class ContentDetail extends Vue {
  @Prop() private data!: any;
  @Prop({default: true}) private openAll!: boolean;
  private openAllIn: boolean = true
  //活动级别
  private activityLevel: Array<any> = [
    { labelName: "国家", value: "ACTIVITY_LEVEL_COUNTRY" },
    { labelName: "省", value: "ACTIVITY_LEVEL_PROVINCE" },
    { labelName: "市", value: "ACTIVITY_LEVEL_CITY" },
    { labelName: "县", value: "ACTIVITY_LEVEL_COUNTY" },
    { labelName: "其它", value: "ACTIVITY_LEVEL_OTHER" }
  ];

  private ACTIVITY_METHOD = ACTIVITY_METHOD;
  private ACTIVITY_TYPE = ACTIVITY_TYPE;
  // 本页需要展示的数据集
  private iData: { [propName: string]: any } = {
    labelNames: []
  };
  // 图片可显示
  private imgView: boolean = false;
  // 图
  private imgUrl: Array<string> = [];
  private currIndex = 0;
  created() {
    this.openAllIn = this.openAll
  }

  @Watch("data", { immediate: true, deep: true })
  refreshData(data: any) {
    this.renderContent();
  }

  // 回显数据
  private renderContent() {
    Object.assign(this.iData, this.data);
  }

  // 预览图片
  private viewImgWin(src: Array<string>, idx: number) {
    this.imgUrl = src;
    this.imgView = true;
    this.currIndex = idx;
  }
}
</script>

<style scoped lang="scss">
.hidden {
  display: none;
}
.toggle {
  padding-left: 102px;
  margin-bottom: 20px;
  color: $theme;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color: $theme-hover;
  }
}
.img-box {
  width: 100px;
  height: 60px;
  padding: 0 10px;
  margin: 10px auto;
  overflow: hidden;
  img {
    width: 100%;
  }
}
.list-panel {
  margin-top: 10px;
  .item {
    padding: 10px 0;
    line-height: 25px;
    &.tit {
      border-top: 1px solid $borderLight;
    }
  }
  .red {
    vertical-align: middle;
  }
  .item-name {
    width: 150px;
    text-align: right;
    margin-right: 13px;
    font-weight: 600;
    color: $font01;
    &.tit {
      font-size: 1.2em;
    }
  }
  .item-content {
    width: 80%;
    color: $font05;
    .img {
      display: inline-block;
      width: 240px;
      height: 160px;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      img {
        width: 100%;
      }
      & + .img {
        margin-left: 5px;
      }
    }
    &.simulate {
      p {
        display: inline-block;
        & + p {
          margin-left: 20px;
        }
      }
      .count {
        margin-left: 3px;
        width: 200px;
        text-align: left;
      }
    }
  }
}
</style>