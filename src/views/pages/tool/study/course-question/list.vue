<template>
  <div>
    <Form class="form" ref="params" inline :model="params" :label-width="90">
      <FormItem label="关键字" prop="name">
        <Input placeholder="请输入问题关键字" v-model="params.name" :maxlength="30" class="w300" @on-enter="getList()" />
      </FormItem>
      <FormItem label="回复状态" prop="haveReply">
        <Select class="w300" v-model="params.haveReply" @on-change="getList()">
          <Option value="-1">全部</Option>
          <Option value="true">已回复</Option>
          <Option value="false">未回复</Option>
        </Select>
        <Button @click="getList()" type="primary" class="ml10">搜索</Button>
      </FormItem>
    </Form>
    
    <BaseTable class="list-box" :configure="tableConfig" @getList="getList">
      <Table :columns="tableData.headList" :data="tableData.bodyList" border size="default" :loading="loading">
        <template slot-scope="{ row }" slot="question">
          <div style="padding: 10px 0;">
            <p><span style="font-weight: bold">问题：</span> {{ row.question }}</p>
            <p v-if="row.replyTime"><span style="font-weight: bold">回复：</span> {{ row.reply }}</p>
          </div>
        </template>
        <template slot-scope="{ row }" slot="reply">
          {{ row.replyTime ? '已回复' : '未回复' }}
        </template>

        <template slot-scope="{ row }" slot="status">
          <div v-if="row.status === 1">
            <span class="switchLabel">正常</span>
            <span class="switchBox" @click="changeStatus(row,'禁用')">
              <i-switch :value="true" />
              <span class="cover"></span>
            </span>
          </div>
          <div v-else-if="row.status === 2">
            <span class="switchLabel">禁用</span>
            <span class="switchBox" @click="changeStatus(row,'启用')">
              <i-switch :value="false" />
              <span class="cover"></span>
            </span>
          </div>
          <div v-else>{{getStatusTxt[row.status]}}</div>
        </template>

        <template slot-scope="{ row }" slot="action">
          <a href="javascript:;" v-if="!row.replyTime" class="theme-blue" style="margin-right:5px" @click="() => { replyShow = true; replayParams = {reply: replayParams.reply, question: row.question, userName: row.userName, createTime: row.createTime, id: row.id} }">回复</a>
          <a href="javascript:;" v-if="operates.includes('delete')" class="theme-blue" @click="deleteIds(row.id)">删除</a>
        </template>
      </Table>
    </BaseTable>

    <Modal v-model="replyShow" title="回复问答">
      <Form class="form" ref="replyParams" :model="replayParams" :rules="ruleValidateReply" :label-width="90">
        <FormItem label="问题"><Input v-model="replayParams.question" class="w360" readonly /></FormItem>
        <FormItem label="提问用户"><Input v-model="replayParams.userName" class="w360" readonly /></FormItem>
        <FormItem label="提问时间"><Input v-model="replayParams.createTime" class="w360" readonly /></FormItem>
        <FormItem label="回复" prop="reply"><Input type="textarea" v-model="replayParams.reply" :rows="4" class="w360" :maxlength="200" /></FormItem>
      </Form>
      <div slot="footer">
        <Button @click="replyShow = false">取消</Button>
        <Button type="primary" :loading="replyLoading" @click="replyHandle">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { AppModule } from "@store/modules/app";
import { getSchoolQuestionList, saveSchoolQuestion, getSchoolQuestion, updateSchoolQuestion } from "@service/tool"
import { getStatusTxt } from "@util/comm";
import BaseTable from "@components/baseTable/baseTable.vue";

@Component({
  components: {
    BaseTable,
  }
})
export default class BrandAdd extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  // 回复弹窗是否显示
  private replyShow: boolean = false
  // 当前操作项
  private replayParams: any = {reply: '', question: '', userName: '', createTime: '', id: -1}
  // 提交参数
  private params = <any>{
    name: "",
    pageSize: 10,
    haveReply: '-1'
  };
  // 验证规则
  private ruleValidateReply = <any>{
    reply: [
      {
        message: "只能输入2-200个字符",
        trigger: "blur",
        required: true,
        pattern: /^.{2,200}$/
      }
    ]
  };
  // 状态值
  private getStatusTxt: any = getStatusTxt;
  // 表格分页信息
  private tableConfig = <any>{
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0
    },
    pagePosition: "right"
  };
  //
  private tableData = <any>{
    headList: [
      {
        title: "问答",
        slot: "question",
        width: 800,
        align: "left"
      },
      {
        title: "课程名称",
        key: "courseName",
        width: 300,
        align: "center"
      },
      {
        title: "提问用户",
        key: "userName",
        align: "center"
      },
      {
        title: "回复状态",
        slot: "reply",
        align: "center"
      },
      {
        title: "状态",
        align: "center",
        slot: "status"
      },
      {
        title: "操作",
        align: "center",
        slot: "action",
        width: 100
      }
    ],
    bodyList: []
  }
  //
  private loading = false;

  created() {
    this.getList()
  }

  // 获取列表
  private getList(page?: any) {
    if (page) {
      Object.assign(this.params, page)
    } else {
      this.params.currPage = 1
    }
    let params = {...this.params}
    if (params.haveReply == '-1') delete params.haveReply
    this.loading = true
    getSchoolQuestionList(params).then((res:any) => {
      if (res.code === 0) {
        res.datas.forEach((d:any) => d.reply = d.reply || '')
        this.tableData.bodyList = res.datas
        this.tableConfig.page = res.page
      }
    }).finally(() => this.loading = false)
  }
  // 删除
  private deleteIds(id: any) {
    let config = <any>{
      title: "操作提示",
      okText: "确认删除",
      cancelText: "取消",
      onOk: () => {
        this.updateSchoolQuestion(id, 3)
      },
      render: (h: any, params: any) => {
        return h("p", `是否要删除？`);
      }
    }
    this.$Modal.confirm(config)
  }
  // 数据状态值切换
  private changeStatus(row: any, title: string) {
    let config = <any>{
      title: "操作提示",
      content: "确认是否" + title + "？",
      okText: "确认",
      cancelText: "关闭",
      onOk: () => this.updateSchoolQuestion(row.id, [2, 1][row.status - 1])
    };
    this.$Modal.confirm(config);
  }
  // 更新状态
  private updateSchoolQuestion(id:any, status: number) {
    updateSchoolQuestion({
      id,
      status
    }).then((res:any) => {
      if (res.code === 0) {
        this.$Message.success("操作成功!");
        this.getList();
        this.loading = false;
      }
    })
  }

  private replyLoading: boolean = false
  // 提交回复
  private replyHandle () {
    (this.$refs.replyParams as any).validate((valid: any) => {
      if (valid) {
        this.replyLoading = true
        saveSchoolQuestion({ id: this.replayParams.id, reply: this.replayParams.reply }).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("保存成功！")
            this.replyShow = false;
            this.getList({})
          }
        }).finally(() => { this.replyLoading = false; this.replyShow = false })
      } else {
        this.$Message.info("请将表单信息填写完整！")
      }
    })
  }
}
</script>

<style lang='scss' scoped>
.w300 {
  width: 300px;
}
.w360 {
  width: 360px;
}
.form {
  padding-top: 24px;
}
.list-box {
  padding: 0 24px;
  .switchLabel {
    margin-right: 5px;
  }
  .switchBox {
    position: relative;
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
}
</style>
