<template>
  <Row class="wrap">
    <div class="right-panel">
      <Tabs
        active-key="key1"
        class="tab-warp"
        :animated="false"
        @on-click="setState"
      >
        <Tab-pane label="全部" class="tab-pane"></Tab-pane>
        <Tab-pane :label="waitNumber > 0 ? label : '待审核'"></Tab-pane>
        <Tab-pane label="不通过" class="tab-pane"></Tab-pane>
      </Tabs>

      <Form :label-width="80" inline class="form">
        <FormItem class="item" label="关键字">
          <i-input
            placeholder="关键字"
            class="w200"
            v-model="params.name"
            @on-enter="getList()"
          ></i-input>
          <Button type="primary" class="ml20" @click="getList()">搜索</Button>
        </FormItem>
      </Form>

      <div class="header row">
        <p>问题</p>
        <p class="w200">课程名称</p>
        <p class="w150">提问用户</p>
        <p class="w150">回复状态</p>
        <p class="w150">审核状态</p>
        <p class="w150">操作</p>
      </div>
      <baseTable :configure="tableConfig" @getList="getList">
        <div v-for="item in list" :key="item.id" class="row-out">
          <div class="row" :key="item.id + 'div'">
            <p>{{ item.question }}</p>
            <p class="w200">{{ item.courseName }}</p>
            <p class="w150">{{ item.userName }}</p>
            <p class="w150">{{ item.replyTime ? '已回复' : '未回复' }}</p>
            <p class="w150">{{ getStatusTxt[item.status] }}</p>
            <p class="w150 btn" v-if="item.status === 4" @click="() => { currItem = item; modal1 = true }">审核</p>
            <p class="w150" v-else></p>
            <!-- <p class="w150 btn" v-else @click="updateSchoolQuestion(item.id, 3, '删除')">删除</p> -->
          </div>
          <p class="reply" v-if="item.replyTime">回复：{{ item.reply }}</p>
        </div>
      </baseTable>
    </div>

    <Modal
      v-model="modal1"
      title="审核"
      @on-ok="updateSchoolQuestion(currItem.id, auditStatus, '审核' + (auditStatus === 1 ? '通过' : '不通过'))">
      <div style="text-align: center">
        <Button style="margin: 0 20px" :type="auditStatus === 1 ? 'primary' : undefined" @click="auditStatus = 1">通过</Button>
        <Button :type="auditStatus === 79 ? 'primary' : undefined" @click="auditStatus = 79">不通过</Button>
      </div>
    </Modal>
  </Row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getSchoolQuestionList, updateSchoolQuestion } from "@service/tool";
import baseTable from "@components/baseTable/baseTable.vue";
import { AppModule } from "@store/modules/app";
import { getStatusTxt } from "@util/comm";
@Component({
  components: {
    baseTable
  }
})
export default class volAuditList extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  // 状态对象
  private getStatusTxt: any = getStatusTxt;
  private modal1: boolean = false;
  private auditStatus: number = 1;
  // 待审核
  private waitNumber: Number = 0;
  //表格分页信息
  private params: any = {
    name: "",
    haveReply: true
  };
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "right"
  };
  
  created() {
    this.getList();
    this.getWait();
  }
  // 待审核label
  private label(h: any) {
    return h("div", [
      h("span", "待审核"),
      h("Badge", {
        props: {
          count: this.waitNumber
        }
      })
    ]);
  }
  // tab
  private setState(index: Number) {
    switch (index) {
      case 0:
        this.params.status = "";
        break;
      case 1:
        this.params.status = 4;
        break;
      case 2:
        this.params.status = 79;
        break;
    }
    this.getList();
  }
  // 获取待审核
  private getWait () {
    getSchoolQuestionList({status: 4, haveReply: true}).then((res:any) => {
      if (res.code === 0) {
        this.waitNumber = res.page.total
      }
    })
  }

  private list:any[] = []
  // 获取列表
  private getList(page?: any) {
    if (page) {
      Object.assign(this.params, page);
    } else {
      this.params.currPage = 1
    }
    getSchoolQuestionList(this.params).then((res:any) => {
      if (res.code === 0) {
        this.tableConfig.page = res.page;
        this.list = res.datas
      }
    });
  }

  private currItem: any = {}
  private updateSchoolQuestion(id: number, status: number, txt: string) {
    let config: any = {
      title: `操作提示`,
      content: `确认是否执行${txt}操作？`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        updateSchoolQuestion({
          status,
          id
        }).then((res:any) => {
          if (res.code === 0) {
            this.$Message.success('操作成功！')
            this.getList({})
          }
        })
      }
    };
    this.$Modal.confirm(config);
  }
}
</script>

<style scoped lang="scss">
.w200 {
  width: 200px;
}
.w150 {
  width: 150px;
}
.wrap {
  padding-bottom: 20px;
  .right-panel {
    padding: 0 15px;
    overflow: hidden;
    .form {
      background: $grayLight;
      margin-bottom: 15px;
      padding-top: 15px;
    }
  }
}

.row-out {
  border: 1px solid #ddd;
  margin-top: 20px;
  padding-bottom: 20px;
}
.row {
  display: flex;
  font-size: 14px;
  line-height: 24px;
  padding: 10px 34px;
  // box-shadow: 0 0 4px 0px #ddd;
  p:nth-child(1) {
    flex: 1;
    text-align: left;
  }
  p{
    padding: 0 5px;
    text-align: center;
  }
}
.header {
  font-weight: bold;
  background: #eee;
}
.reply {
  padding: 0px 39px;
  line-height: 24px;
  margin-top: 5px;
  background: #eee;
}
.btn {
  color: #23a1ee;
  cursor: pointer;
}
</style>
