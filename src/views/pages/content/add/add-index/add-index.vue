<template>
  <div class="add-box">
    <div class="content">
      <ul class="list">
        <router-link
          tag="li"
          class="item item01"
          :class="'item0' + (i + 1)"
          v-for="(item, i) in tabList"
          :key="item.name"
          :to="item.path"
        >
          <div class="left">
            <p class="name">{{item.name}}</p>
            <i class="line"></i>
            <p class="english">{{item.english}}</p>
          </div>
          <i class="icon cloud-icon" v-html="item.icon"></i>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AddIndex extends Vue {
  private tabList = [
    {
      name: "资讯",
      path: "/con-add-content",
      english: "发布图文、音频、视频相结合 的内容",
      icon: '&#xe710;'
    },
    {
      name: "图库",
      path: "/con-add-image",
      english: "发布以图片为主的内容，图片 以轮播的形式展示",
      icon: '&#xe6fc;'
    },
    {
      name: "视频",
      path: "/con-add-video",
      english: "发布以视频为主的内容",
      icon: '&#xe6fa;'
    },
    {
      name: "音频",
      path: "/con-add-audio",
      english: "发布以音频为主的内容",
      icon: '&#xe6fb;'
    }
  ];
}
</script>

<style lang='scss' scoped>
.add-box {
  background: $grayDark;
  .content {
    background: #fff;
    /*width: calc(100vw - 40px);*/
    height: calc(100vh - 182px);
  }
  .list {
    padding: 10px 10px;
    font-size:0;
    overflow: hidden;
    .english {
      font-size: 14px;
      line-height: 20px;
      text-transform: uppercase;
    }
    .left {
      flex: 1;
    }
    .line {
      display: block;
      width: 18px;
      height: 2px;
      margin: 9px 0 10px;
    }
    .name {
      font-size: 22px;
      line-height: 34px;
    }
    .icon {
      display: block;
      width: 82px;
      height: 82px;
      margin-left:40px;
      color: #fff;
      font-size: 82px;
      line-height: 82px;
      text-align: center;
    }
    .item {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      float: left;
      flex: 1;
      padding: 0 40px;
      min-height: 160px;
      max-width: 380px;
      min-width:  380px;
      margin: 10px 10px;
      font-size: 36px;
      border-radius: 5px;
      overflow: hidden;
        cursor: pointer;
        transition: .3s;
        &:hover {
            box-shadow: 0 5px 10px 4px #ddd;
        }
      &01 {
        color: #d1f4f2;
        background: url(../../../../../assets/image/add-index-bg.png) no-repeat
            left bottom,
          linear-gradient(to bottom right, #16c8c0 0%, #48dfb4 100%);
        background-size: 100% auto;
        .line {
          background: #d1f4f2;
        }
      }
      &02 {
        color: #ffeddb;
        background: url(../../../../../assets/image/add-index-bg.png) no-repeat
            left bottom,
          linear-gradient(to bottom right, #ffa04b 0%, #facc5c 100%);
        background-size: 100% auto;
        .line {
          background: #ffeddb;
        }
      }
      &03 {
        color: #fee2e1;
        background: url(../../../../../assets/image/add-index-bg.png) no-repeat
            left bottom,
          linear-gradient(to bottom right, #fb6967 0%, #f89192 100%);
        background-size: 100% auto;
        .line {
          background: #fee2e1;
        }
      }
      &04 {
        color: #dcebfc;
        background: url(../../../../../assets/image/add-index-bg.png) no-repeat
            left bottom,
          linear-gradient(to bottom right, #5197ef 0%, #52c2e9 100%);
        background-size: 100% auto;
        .line {
          background: #dcebfc;
        }
      }
    }
  }
}
</style>
