<template>
  <div>
    <Form class="form" ref="params" inline :model="params" :label-width="90">
      <FormItem label="关键字" prop="name">
        <Input placeholder="请输入关键字" v-model="params.name" :maxlength="30" class="w300" @on-enter="getList()" />
        <Button @click="getList()" type="primary" class="ml10">搜索</Button>
        <Button @click="outExcel()" class="ml10">导出</Button>
      </FormItem>
    </Form>
    
    <BaseTable class="list-box" :configure="tableConfig" @getList="getList">
      <Table :columns="tableData.headList" :data="tableData.bodyList" border size="default" :loading="loading">
        <template slot-scope="{ row }" slot="duration">{{ Math.floor((row.duration || 0) / 60) }}分钟</template>
      </Table>
    </BaseTable>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { getSchoolRecordList } from "@service/tool"
import BaseTable from "@components/baseTable/baseTable.vue";
import { exportExcel } from "@util/comm";
import CONFIG from "@/util/config";
import { AppModule } from "@store/modules/app";

@Component({
  components: {
    BaseTable
  }
})
export default class BrandAdd extends Vue {
  // 提交参数
  private params = <any>{
    name: "",
    pageSize: 10,
  };
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
        title: "课程名称",
        key: "courseName",
        width: 500,
        align: "left"
      },
      {
        title: "主讲人",
        key: "lecturerName",
        align: "center"
      },
      {
        title: "学习用户",
        key: "userName",
        align: "center"
      },
      {
        title: "学习章节",
        key: "chapterName",
        align: "center"
      },
      {
        title: "学习时长",
        align: "center",
        slot: "duration"
      },
      {
        title: "开始学习时间",
        align: "center",
        key: "createTime"
      }
    ],
    bodyList: []
  }
  //
  private loading = false;
  //获取token
  get token() {
    return AppModule.token;
  }

  created() {
    this.params.courseId = this.$route.query.id
    this.getList()
  }

  // 获取列表
  private getList(page?: any) {
    if (page) {
      Object.assign(this.params, page)
    } else {
      this.params.currPage = 1
    }
    this.loading = true
    getSchoolRecordList(this.params).then((res:any) => {
      if (res.code === 0) {
        this.tableData.bodyList = res.datas
        this.tableConfig.page = res.page
      }
    }).finally(() => this.loading = false)
  }

  // 导出点击
  private outExcel() {
    exportExcel(`${CONFIG.defaultUrl}/res/schoolRecord/export?token=${this.token}&name=${this.params.name}&courseId=${this.params.courseId}`)
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
