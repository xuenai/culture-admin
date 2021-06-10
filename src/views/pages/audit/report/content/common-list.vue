<!--
 * @Author: 任智勇
 * @since: 2019-05-29 09:46:46
 * @LastAuthor: 任智勇
 * @lastTime: 2019-06-15 17:18:17
 -->
<template>
  <div class="list-panel">
    <Row class="item">
      <i-col span="2" class="item-name">
        <span class="red">*</span> 栏目
      </i-col>
      <i-col span="22" class="item-content">{{defaultData.channelName}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">
        <span class="red">*</span> 标题
      </i-col>
      <i-col span="22" class="item-content">{{defaultData.title}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">作者</i-col>
      <i-col span="22" class="item-content">{{defaultData.author}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">来源\来源地址</i-col>
      <i-col span="22" class="item-content">{{defaultData.source}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">摘要</i-col>
      <i-col span="22" class="item-content">{{defaultData.summary}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">创建者</i-col>
      <i-col span="22" class="item-content">{{defaultData.createCompanyName}}</i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">
        <span class="red">*</span> 内容
      </i-col>
      <i-col span="22" class="item-content">{{defaultData.content}}</i-col>
    </Row>
    <Row class="item" v-if="defaultData.tagName && defaultData.tagName.length > 0">
      <i-col span="2" class="item-name">标签</i-col>
      <i-col span="22" class="item-content">
        <Tag class="tag" v-for="(tag,tagIndex) in defaultData.tagName" :key="tagIndex">{{tag}}</Tag>
      </i-col>
    </Row>
    <Row class="item">
      <i-col span="2" class="item-name">发布时间</i-col>
      <i-col span="22" class="item-content">{{defaultData.publishTime}}</i-col>
    </Row>
    <Row class="item" v-if="defaultData.imageUrls && defaultData.imageUrls.length > 0">
      <i-col span="2" class="item-name">图集</i-col>
      <i-col span="22" class="item-content img-list">
        <p class="img" v-for="(img,imgIndex) in defaultData.imageUrls" :key="imgIndex">
          <img :src="img" alt>
        </p>
      </i-col>
    </Row>
    <Row class="item" v-if="defaultData.videoUrl && defaultData.videoUrl.length > 0">
      <i-col span="2" class="item-name">视频</i-col>
      <i-col span="22" class="item-content img-list">
        <p class="img">
          <img
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559024885326&di=f85102d8a2dfab58b7b6dc37cce07b26&imgtype=0&src=http%3A%2F%2Fpic15.nipic.com%2F20110628%2F1369025_192645024000_2.jpg"
            alt
          >
        </p>
      </i-col>
    </Row>
    <Row class="item" v-if="defaultData.annex && defaultData.annex.length>0">
      <i-col span="2" class="item-name">附件</i-col>
      <i-col span="22" class="item-content img-list">
        <a href="#">梦姑娘重庆4日游图集.zip</a>
      </i-col>
    </Row>
    <Row class="item" v-if="defaultData.showNum && defaultData.likeNum && defaultData.collectionNum">
      <i-col span="2" class="item-name">统计数据</i-col>
      <i-col span="22" class="item-content simulate">
        <p v-if="defaultData.showNum">
          浏览量
          <Button class="count" disabled>{{defaultData.showNum}}</Button>
        </p>
        <p v-if="defaultData.likeNum">
          点赞量
          <Button class="count" disabled>{{defaultData.likeNum}}</Button>
        </p>
        <p v-if="defaultData.collectionNum">
          收藏量
          <Button class="count" disabled>{{defaultData.collectionNum}}</Button>
        </p>
      </i-col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class commonList extends Vue {
  @Prop() private data!: object;
  @Watch("data", { immediate: true, deep: true })
  refreshData() {
    Object.assign(this.defaultData, this.data);
    console.log(this.defaultData);
  }
  // 本页需要展示的数据集
  private defaultData: any = {
    channelName: "",
    title: "",
    author: "",
    source: "",
    summary: "",
    createCompanyName: "",
    content: "",
    tagName: "",
    publishTime: "",
    imageUrls: "",
    videoUrl: "",
    annex: [],
    showNum:'',
    likeNum:'',
    collectionNum:''
  };
  created() {
    Object.assign(this.defaultData, this.data);
  }
}
</script>

<style scoped lang="scss">
.list-panel {
  margin-top: 10px;
  .item {
    padding: 10px 0;
    line-height: 25px;
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
        height: 100%;
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
