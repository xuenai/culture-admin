<template>
  <div class="container">
    <div class="list-panel">
      <Row class="item">
        <i-col span="2" class="item-name">创建者</i-col>
        <i-col span="22" class="item-content">{{detail.siteName}}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">品牌名称</i-col>
        <i-col span="22" class="item-content">{{detail.name}}</i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">品牌口号</i-col>
        <i-col span="22" class="item-content">{{detail.slogan}}</i-col>
      </Row>
      <Row class="item" v-if="detail.brandIcon">
        <i-col span="2" class="item-name">品牌图标</i-col>
        <i-col span="22" class="item-content">
          <p class="img" v-for="(img,i) in detail.brandIcon.split(',')" :key="i">
            <img @click="viewImage(detail.brandIcon.split(','), i)" :src="img" alt>
          </p>
        </i-col>
      </Row>
      <Row class="item" v-if="detail.brandLogo">
        <i-col span="2" class="item-name">品牌logo</i-col>
        <i-col span="22" class="item-content">
          <p class="img" v-for="(img,i) in detail.brandLogo.split(',')" :key="i">
            <img @click="viewImage(detail.brandLogo.split(','), i)" :src="img" alt>
          </p>
        </i-col>
      </Row>
      <Row class="item" v-if="detail.brandImage">
        <i-col span="2" class="item-name">品牌主图</i-col>
        <i-col span="22" class="item-content">
          <p class="img" v-for="(img,i) in detail.brandImage.split(',')" :key="i">
            <img @click="viewImage(detail.brandImage.split(','), i)" :src="img" alt>
          </p>
        </i-col>
      </Row>
      <Row class="item">
        <i-col span="2" class="item-name">品牌介绍</i-col>
        <i-col span="22" class="item-content" v-html="detail.suggest"></i-col>
      </Row>
    </div>

    <Row class="item tit" v-if="detail.scenics && detail.scenics.length">
        <i-col span="2" class="item-name tit">关联景区</i-col>
        <i-col span="22" class="item-content scenic-list clearfix">
          <div class="box fl" v-for="item in detail.scenics" :key="item.id">
            <div class="img"><img @click="viewImage(item.image.split(','), 0)" v-if="item.image" :src="item.image.split(',')[0]" alt=""></div>
            <a target="_blank" class="line1" :title="item.name" :href="domain+item.id">{{item.name}}</a>
            <p class="line1" :title="item.cityName">{{item.cityName}}</p>
          </div>
        </i-col>
    </Row>

    <Row class="item">
      <i-col span="2" class="item-name">
        <div class="btn-group">
          <Button @click="goback">返回</Button>
        </div>
      </i-col>
    </Row>
    <!-- 图片查看 -->
    <PreviewPics v-model="visible" :imgs="imgUrl" :currIndex="picIndex"></PreviewPics>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { PreviewPics } from '@components/index';
import { brandView } from "@service/activity";


@Component({
  components: {
    PreviewPics
  }
})
export default class Complaint extends Vue {
  created() {
    this.brandView();
  }

  /* S 获取详情 */
  private detail: Object = {}
  private brandView() {
    brandView({
      id: this.$route.params.id
    }).then((res:any) => {
      if (res.code === 0) {
        this.detail = res.data
      }
    })
  }
  private domain: string = window.location.origin + '/#/scenic-detail?id=';
  /* E 获取详情 */

  /* S 查看大图 */
  private imgUrl:Array<string> = []
  private visible: Boolean = false; // 图片查看
  private picIndex = 0;
  private viewImage(url: Array<string>, index:number) {
    this.imgUrl = url;
    this.visible = true;
    this.picIndex = index;
  }
  /* E 查看大图 */

  // 返回
  private goback () {
    this.$router.go(-1)
  }
}
</script>

<style scoped lang="scss">
.container{
  padding: 10px 15px;
  .scenic-list {
    .box {
      margin: 0 20px 20px 0;
      text-align: center;
      .img {
        width: 240px;
        height: 160px;
        overflow: hidden;
        border-radius: 4px;
        box-shadow: 0 0 20px #eee;
        img {
          height: 100%;
        }
      }
      a {
        margin-top: 10px;
        display: inline-block;
        line-height: 14px;
      }
      p {
        line-height: 8px;
      }
    }
  }
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
            width: 90px;
            text-align: right;
            margin-right: 10px;
            font-weight: 600;
            color: $font01;
            &.tit {
                font-size: 1.2em;
            }
        }

  .tips-panel {
    margin-top: 10px;
    background-color: $grayLight;
    padding: 20px;
    .title {
      position: relative;
      padding-left: 10px;
      color: $font01;
      font-weight: 600;
      font-size: 16px;
      &:after {
        position: absolute;
        left: 0;
        top: 4px;
        content: "";
        width: 3px;
        height: 16px;
        border-radius: 1.5px;
        background-color: $theme;
      }
    }
    .tag-content {
      margin-left: 30px;
      color: $font02;
    }
  }
  .list-panel {
    margin-top: 10px;
    .item {
      padding: 10px 0;
      line-height: 25px;
    }
    .red {
      vertical-align: middle;
    }
    .item-btn {
      button{
        margin: 10px 0 0 30px;
        &:hover{
          cursor: text;
        }
      }
      .satisf-btn{
        box-shadow: none;
        &:hover{
          border: 1px solid #2db7f5;
          color: #2db7f5;
        }
      }
      .satisfied-btn{
        box-shadow: none;
        &:hover{
          border: 1px solid #dcdee2;
          color: #515a6e;
        }
      }
    }
    .item-name {
      width: 90px;
      text-align: right;
      margin-right: 10px;
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
        margin-right: 8px;
      }
    }
  }

  .audit-record {
    .record-panel {
      padding: 20px 20px 0 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #e2e2e2;
      .content {
        color: $font03;
      }
    }
  }
}
//标题
.title-tool {
    position: relative;
    width: 100%;
    line-height: 16px;
    font-size: 14px;
    font-weight: bold;
    padding: 0 0 10px 10px;
    margin: 0 20px 20px 0;
    border-bottom: 1px solid #dee3ed;
    i {
        position: absolute;
        top: 0;
        left: -8px;
        font-size: 20px;
        color: $theme;
    }
}
</style>
