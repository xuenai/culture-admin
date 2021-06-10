<template>
  <div class="content">
    <Form ref="formInline" :model="params" :rules="ruleValidate" :label-width="70" inline class="form">
      <FormItem label="关键词" prop="keyword">
        <Input type="text" placeholder="请输入关键词" :maxlength="100" v-model="params.keyword" class="w250" @on-change="search" />
      </FormItem>
      <FormItem label="数据状态" prop="status">
        <Select class="w250" v-model="params.status" @on-change="search">
          <Option value>全部</Option>
          <Option value="0">已失效</Option>
          <Option value="1">正常</Option>
          <Option value="2">禁用</Option>
          <Option value="3">待激活</Option>
        </Select>
        <Button type="primary" style="margin-left: 20px;" @click="search">搜索</Button>
        <Button type="primary" style="margin-left: 20px;" @click="$router.push({path: `/ques-add/${depotType}`})">添加</Button>
        <Button type="primary" style="margin-left: 20px;" @click="deleteQuesAnswer()">批量删除</Button>
        <!-- 暂时注释 还没使用 -->
        <!-- <Button type="primary" style="margin-left: 20px;" @click="$router.push({path: '/ques-add-class'})">添加分类</Button> -->
      </FormItem>
    </Form>

    <!-- 表格头 -->
    <div class="table-head row">
      <p class="ele"><Checkbox class="fl" style="margin-left: 21px" :value="allCheck" @on-change="toggleAll"></Checkbox> 问题</p>
      <p class="ele">所属分类</p>
      <p class="ele">更新时间</p>
      <p class="ele">相似问法</p>
      <p class="ele">状态</p>
      <p class="ele">操作</p>
    </div>
    <!-- 表格行 -->
    <baseTable :configure="tableConfig" @getList="search">
      <ul class="list-box" v-if="dataList.length">
        <li class="item row" v-for="item in dataList" :key="item.id">
          <p class="ele" style="padding-left: 43px">
            <Checkbox class="fl" :value="item.hasChecked" style="margin-left: -22px;"
                @on-change="checked => item.hasChecked = checked"></Checkbox> {{item.question}}
          </p>
          <p class="ele">{{item.qaType || '--'}}</p>
          <p class="ele">{{item.updateTime}}</p>
          <p class="ele">{{item.similarQuestionNum}}</p>
          <div class="ele">
            <template v-if="item.status === 1">
              <span class="switchLabel">正常</span>
              <span class="switchBox" @click="changeStatus(item,2)">
                <i-switch :value="true" />
                <span class="cover"></span>
              </span>
            </template>
            <template v-else-if="item.status === 2">
              <span class="switchLabel">禁用</span>
              <span class="switchBox" @click="changeStatus(item,1)">
                <i-switch :value="false" />
                <span class="cover"></span>
              </span>
            </template>
            <template v-else>{{['已失效','正常','禁用','待激活'][item.status]}}</template>
          </div>
          <p class="ele">
            <router-link class="control" :to="{ path:`/ques-add/${depotType}`, query:{id: item.id} }"
            v-if="operates.includes('edit')">修改</router-link>
            <span class="control" v-if="operates.includes('delete')"
            @click="deleteQuesAnswer(item)">删除</span>
          </p>
          <div class="answer">
            <div class="data" v-html="item.answer" :class="{'maxh': !item.open}"></div>
            <span class="cloud-icon" @click="item.open = !item.open">{{item.open ? '&#xe6b0;' : '&#xe6af;'}}</span>
          </div>
        </li>
      </ul>
      <p v-else class="nodata">暂无数据</p>
    </baseTable>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import BaseTable from "@components/baseTable/baseTable.vue";
import { AppModule } from "@store/modules/app";
import { getQuesAnswerList, deleteQuesAnswer, updateQuesAnswerStatus } from "@service/tool";

@Component({ 
  components: {
    BaseTable
  }
})
export default class ComponentName extends Vue {
  private params: any = {
    pageSize: 10,
    currPage: 1,
    keyword: "",
    status: "",
    depotType: "",
  }
  private ruleValidate: any = {}
  get allCheck() {
    return this.dataList.length && this.dataList.every((item: any) => item.hasChecked);
  }
  private depotType: string | undefined;
  created() {
    this.depotType = this.$route.path.split('/')[2];
    this.params.depotType = this.depotType
    this.search()
  }
  beforeRouteLeave (to:any, from:any, next: Function) {
    next();
    if (/\/ques-base/.test(to.path)) {
      this.depotType = to.path.split('/')[2];
      this.params = {
        pageSize: 10,
        currPage: 1,
        keyword: "",
        status: "",
        depotType: "",
      }
      this.params.depotType = this.depotType
      this.dataList = []
      this.search()
    }
  }
  // 全选点击
  private toggleAll(checked: boolean) {
    this.dataList.forEach((item: any) => (item.hasChecked = checked));
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
  get checkedBox() {
    return this.dataList.filter((d:any) => d.hasChecked)
  }
  // 删除
  private deleteQuesAnswer(row?: any) {
    let title = '',
        ids = '';
    if (row) {
      title = `确认是否删除“${row.question as string}”？` 
      ids = row.id
    } else {
      if (this.checkedBox.length) {
        title = `确认是否删除${this.checkedBox.length}条数据？`
        ids = this.checkedBox.map((d:any) => d.id).toString()
      } else {
        this.$Message.info('请选择要删除的数据！')
        return 
      }
    }
    this.$Modal.confirm({
      title: "风险操作提示",
      content: title,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        deleteQuesAnswer({ids}).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("删除成功!");
            this.search();
          }
        });
      }
    })
  }

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
        updateQuesAnswerStatus({
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
    getQuesAnswerList(this.params).then((res:any) => {
      if (res.code === 0) {
        res.datas.forEach((element:any) => {
          element.open = false
          element.hasChecked = false
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
  padding: 16px 0;
  margin: 10px 0;
  border: 1px solid #e9eaec;
  flex-wrap: wrap;
  .ele {
    // flex: 1;
    width: calc((100% - 300px) / 5);
    &:first-child {
      width: 300px;
      // flex: auto;
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
.list-box {
  .item {
    padding-bottom: 0;
    .answer {
      position: relative;
      margin-top: 10px;
      background: #f8fafe;
      padding: 10px 0 23px 58px;
      width: 100%;
      &::before {
        content: "回答：";
        position: absolute;
        left: 21px;
        top: 11px;
      }
      .data {
        overflow: hidden;
        &.maxh {
          max-height: 100px;
        }
      }
      .cloud-icon {
        position: absolute;
        left: 50%;
        bottom: 5px;
        cursor: pointer;
      }
    }
  }
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
