<template>
  <div class="msg-detail">
    <template v-if="data">
      <h1 class="tit">{{data.title}}</h1>
      <p class="time">发布时间：{{data.createTime}}</p>
      <div class="content" v-html="data.content"></div>
      <Button type="primary" class="back" @click="back">返回</Button>
      <router-link :to="{path:'/cloud-msg-edit',query:{id: $route.query.id}}">
        <Button type="primary" class="back" style="margin-left: 15px;">修改</Button>
      </router-link>
      <div class="page-turn">
        <router-link
          v-if="data.pre"
          class="p-item fl"
          :class="{unread: data.pre.readStatus === 0}"
          :to="{path: '/cloud-msg-detail',query:{id:data.pre.id}}"
        >
          <i class="iconfont c-icon-jiantou-zuo"></i>
          上一条：{{data.pre.title}}
        </router-link>
        <router-link
          v-if="data.next"
          class="p-item fr"
          :class="{unread: data.next.readStatus === 0}"
          :to="{path: '/cloud-msg-detail',query:{id:data.next.id}}"
        >
          下一条：{{data.next.title}}
          <i class="iconfont c-icon-jiantou-you"></i>
        </router-link>
      </div>
    </template>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import { getMsgDetail } from "@service/common";
import MsgTip from "@views/home/msg-tip.vue";

@Component({
  components: {
    MsgTip
  }
})
export default class SysMsgDetail extends Vue {
  private data: any = null;

  created() {
    this.getMsgDetail();
  }

  @Watch("$route", { immediate: true, deep: true })
  routeChange(n: any, o: any) {
    if (n && o) this.getMsgDetail();
  }

  // 获取数
  private getMsgDetail() {
    getMsgDetail({ id: this.$route.query.id as string }).then((res: any) => {
      if (res.code === 0) {
        this.data = res.data;
      }
    });
  }

  // back
  private back() {
    window.history.back();
  }
}
</script>

<style lang='scss' scoped>
.msg-detail {
  text-align: center;
  overflow: hidden;
}

.tit {
  width: 980px;
  margin: 25px auto 0;
  color: #263b4d;
  font-size: 28px;
  line-height: 40px;
  font-weight: normal;
}

.time {
  padding-bottom: 11px;
  margin: 0 77px;
  color: #5b6873;
  font-size: 14px;
  line-height: 50px;
  border-bottom: 1px solid #d5dae3;
}

.content {
  min-height: 480px;
  margin: 0 auto;
  padding: 20px;
  text-align: justify;
}

.back {
  width: 130px;
  margin: 30px 0;
}

.page-turn {
  margin: 0 77px;
  border-top: 1px solid #d5dae3;
  overflow: hidden;
  .p-item {
    width: 380px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: $darkGray;
    font-size: 14px;
    line-height: 54px;
    transition: 0.3s;
    span {
      float: left;
      width: calc(100% - 24px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    i {
      font-size: 13px;
      font-weight: bold;
      margin-right: 10px;
    }
    &:last-child {
      i {
        margin-left: 10px;
        margin-right: 0;
      }
    }

    &:hover {
      color: $theme;
    }
    &.unread:hover {
      color: $theme;
    }
  }
}
</style>
