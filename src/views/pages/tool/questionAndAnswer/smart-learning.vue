<template>
  <div class="content">
    <Form ref="formInline" :model="params" :rules="ruleValidate" :label-width="70" inline class="form">
      <FormItem label="问题" prop="keyword">
        <Input type="text" placeholder="请输入关键词" v-model="params.keyword" class="w250" @on-change="()=>search()" />
      </FormItem>
      <FormItem label="数据状态" prop="status">
        <Select class="w250" v-model="params.status" @on-change="()=>search()">
          <Option value>全部</Option>
          <Option value="1">正常</Option>
          <Option value="2">忽略</Option>
        </Select>
        <Button type="primary" style="margin-left: 20px;" @click="()=>search()">搜索</Button>
      </FormItem>
    </Form>

    <!-- 表格头 -->
    <div class="table-head row">
      <p class="ele">未知问题</p>
      <p class="ele">提问时间</p>
      <p class="ele">状态</p>
      <p class="ele">操作</p>
    </div>
    <!-- 表格行 -->
    <baseTable :configure="tableConfig" @getList="search">
      <ul class="list-box" v-if="dataList.length">
        <li class="item row" v-for="item in dataList" :key="item.id">
          <p class="ele">{{item.question}}</p>
          <p class="ele">{{item.createTime}}</p>
          <div class="ele">
            <template v-if="item.status === 1">
              <span class="switchLabel">正常</span>
              <span class="switchBox" @click="changeStatus(item,2)">
                <i-switch :value="true" />
                <span class="cover"></span>
              </span>
            </template>
            <template v-else-if="item.status === 2">
              <span class="switchLabel">忽略</span>
              <span class="switchBox" @click="changeStatus(item,1)">
                <i-switch :value="false" />
                <span class="cover"></span>
              </span>
            </template>
          </div>
          <p class="ele">
            <span class="control" @click="() => {addShow = true; activeItem = item}">添加为新问题</span>
            <span class="control" @click="item.chatView = true">查看上下文</span>
            <ChatRecord :show="item.chatView" @onClose="item.chatView = false" :propParams="{id: item.id}"></ChatRecord>
          </p>
        </li>
      </ul>
      <p v-else class="nodata">暂无数据</p>
    </baseTable>
    <Modal
      v-model="addShow"
      title="选择添加位置"
      @on-ok="addToQuestion">
      <Form>
        <p v-if="activeItem">问题：{{activeItem.question}}</p>
        <FormItem label="添加位置">
            <RadioGroup v-model="addToType">
                <Radio label="knowledge">问答库</Radio>
                <Radio label="greeting">寒暄库</Radio>
            </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import BaseTable from "@components/baseTable/baseTable.vue";
import ChatRecord from "@components/pop/chat-record.vue";
import { AppModule } from "@store/modules/app";
import { getUnknowList, updateUnknowStatus } from "@service/tool";

@Component({ 
  components: {
    BaseTable,
    ChatRecord
  }
})
export default class ComponentName extends Vue {
  private params: any = {
    pageSize: 10,
    currPage: 1,
    keyword: "",
    status: "",
  }
  private ruleValidate: any = {}
  created() {
    this.search()
  }
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10
    },
    pagePosition: "right"
  };
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  private loading: boolean = false;
  // 添加为新问题
  private addToQuestion () {
    this.$router.push({path: `/ques-add/${this.addToType}`, query: {unknowid: this.activeItem.id, question: this.activeItem.question}})
  }
  private activeItem: any = null;
  private addToType: string = 'knowledge';
  private addShow: boolean = false;
  // 数据状态值切换
  private changeStatus(row: any, status: number) {
    let title = '确认是否修改数据状态？',
        id = row.id;
    this.$Modal.confirm({
      title: "风险操作提示",
      content: title,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        updateUnknowStatus({
          id,
          status
        }).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("更新状态成功!");
            this.search(this.tableConfig.page);
          }
        })
      }
    })
  }
  private dataList: Array<any> = []
  private search(page?: any) {
    this.loading = true
    if (page) {
      Object.assign(this.params, page)
    } else {
      this.params.currPage = 1
    }
    getUnknowList(this.params).then((res:any) => {
      if (res.code === 0) {
        res.datas.forEach((element:any) => {
          element.chatView = false
        });
        this.dataList = res.datas
        this.tableConfig.page = res.page
      }
    }).finally(() => this.loading = false);
  }
}
</script>

<style lang='scss' scoped>
.table-head {
  padding: 16px 0;
  background-color: #e9eaec;
}
.row {
  display: flex;
  padding: 10px 0;
  line-height: 22px;
  margin: 10px 0;
  border: 1px solid #e9eaec;
  flex-wrap: wrap;
  .ele {
    width: calc((100% - 800px) / 3);
    &:first-child {
      width: 800px;
      padding-left: 33px;
      &~.ele {
        text-align: center;
      }
    }
  }
}
.nodata {
  text-align: center;
  line-height: 100px;
}
.w250 {
  width: 250px;
}
.content {
  padding: 20px 15px;
  .switchBox {
    position: relative;
    height: 22px;
    display: inline-block;
    .cover {
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
  .form {
    background: $grayLight;
    padding: 15px 0 0;
    margin-bottom: 15px;
  }
  .switchLabel {
    margin-right: 5px;
  }
  .control {
    color: $theme;
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>
