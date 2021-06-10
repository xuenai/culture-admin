<!--
 * @Author: 任智勇
 * @since: 2019-05-30 09:28:25
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-06 14:32:28
 -->
<template>
  <div class="container">
    <Row class="row count-wrap">
      <Col span="4" class="summary item">
        <p class="item-count">{{topicData.countTopic.total}}</p>
        <p class="item-name">共计话题</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{topicData.countTopic.pendingAuditTopicTotal}}</p>
        <p class="item-name">待审核话题</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{topicData.countTopic.notStartTotal}}</p>
        <p class="item-name">未开始话题</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{topicData.countTopic.startTotal}}</p>
        <p class="item-name">进行中话题</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{topicData.countTopic.endTotal}}</p>
        <p class="item-name">已结束话题</p>
      </Col>
    </Row>
    <Row class="row count-wrap" v-if="isSite">
      <Col span="4" class="summary item">
        <p class="item-count">{{topicData.storyTotal}}</p>
        <p class="item-name">共计故事</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{topicData.storyTagTotal}}</p>
        <p class="item-name">共计标签</p>
      </Col>
    </Row>
    <Row class="row count-wrap" v-if="isSite">
      <Col span="4" class="summary item">
        <p class="item-count">{{topicData.countComment.total}}</p>
        <p class="item-name">点评总数</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{topicData.countComment.contentTotal}}</p>
        <p class="item-name">内容点评</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{topicData.countComment.placeTotal}}</p>
        <p class="item-name">场所点评</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{topicData.countComment.activityTotal}}</p>
        <p class="item-name">活动点评</p>
      </Col>
    </Row>
    <Row class="row count-wrap">
      <Col span="4" class="summary item">
        <p class="item-count">{{topicData.countComplaints.total}}</p>
        <p class="item-name">投诉总数</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{topicData.countComplaints.personnelTotal}}</p>
        <p class="item-name">人员</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{topicData.countComplaints.serviceTotal}}</p>
        <p class="item-name">服务</p>
      </Col>
      <Col span="4" class="item">
        <p class="item-count">{{topicData.countComplaints.environmentTotal}}</p>
        <p class="item-name">环境</p>
      </Col>
    </Row>
    <div class="table-wrap mt15" v-if="isSite">
      <div class="tips-title">最近10天标签热度排行榜 TOP10</div>
      <div class="table">
        <Table :columns="labelColumns" :data="topicData.countLatelyStoryTagHeat">
          <template slot="sort" slot-scope="{ row }">{{row._index + 1 }}</template>
        </Table>
      </div>
    </div>
    <div class="table-wrap mt15">
      <div class="tips-title">最近10天话题热度排行榜 TOP5</div>
      <div class="table">
        <Table :columns="topicColumns" :data="topicData.countLatelyTopicHeat">
          <template slot="sort" slot-scope="{ row }">{{row._index + 1}}</template>
          <template slot="status" slot-scope="{ row }">
            <span v-if="row.topicStatus == 0">未开始</span>
            <span v-else-if="row.topicStatus == 1">进行中</span>
            <span v-else>已结束</span>
          </template>
          <template slot-scope="{row}" slot="topicMsg">
            <div class="clearfix topic-msg">
              <div class="fl img">
                <img class="cloud-img" :src="row.image" alt />
              </div>
              <div class="fl msg-panel">
                <p class="topic-name"># {{row.name}} #</p>
                <p class="date">活动时间:{{row.startDate}} 至 {{row.endDate}}</p>
              </div>
            </div>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getTopicSurveyCount } from "@service/topic";

@Component({
  components: {}
})
export default class profile extends Vue {
  private isSite = this.$store.state.app.userInfo.dataType === "SITE";
  private topicData: any = {
    countTopic: {},
    countLatelyTopicHeat: [],
    countLatelyStoryTagHeat: []
  };
  private labelColumns: any = [
    {
      title: "排名",
      key: "sort",
      width: 80,
      slot: "sort",
      align: "center"
    },
    {
      title: "标签名称",
      key: "name",
      align: "center"
    },
    {
      title: "创建时间",
      key: "createDate",
      align: "center"
    },
    {
      title: "故事数",
      key: "storyNum",
      align: "center"
    }
  ];
  private topicColumns: any = [
    {
      title: "排名",
      key: "sort",
      width: 80,
      slot: "sort",
      align: "center"
    },
    {
      title: "话题信息",
      key: "topicMsg",
      slot: "topicMsg"
    },
    {
      title: "话题状态",
      key: "status",
      slot: "status",
      align: "center",
      width: 150
    },
    {
      title: "参与人数",
      key: "storyNum",
      align: "center",
      width: 150
    }
  ];

  mounted() {
    this.getTopicSurveyCount();
  }

  private getTopicSurveyCount() {
    getTopicSurveyCount().then((res: any) => {
      if (res.code === 0) {
        this.topicData = res.data;
      }
    });
  }
}
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  background-color: $bg;
  .count-wrap {
    background-color: $bg01;
    padding: 25px 15px;
  }
  .row {
    background-color: $bg01;
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
  .table-wrap {
    padding-top: 5px;
    background-color: $bg01;
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
        border-radius: 1.5px;
        background-color: $theme;
      }
    }
    .table {
      padding: 10px 15px 20px;
    }
  }
  .topic-msg {
    padding: 8px 0;
    .img {
      width: 100px;
      height: 60px;
    }
    .msg-panel {
      margin-left: 8px;
    }
    .topic-name {
      margin-top: 7px;
    }
    .date {
      margin-top: 7px;
    }
  }
}
</style>
