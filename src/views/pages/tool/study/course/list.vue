<template>
  <div>
    <Form class="form" ref="params" :model="params" :rules="ruleValidate" :label-width="90">
      <FormItem label="课程名称" prop="name">
        <Input placeholder="请输入课程名称" v-model="params.name" :maxlength="50" class="w300" @on-enter="getList()" />
        <Button @click="getList()" type="primary" class="ml10">搜索</Button>
        <Button v-if="operates.includes('save')" @click="$router.push({path: '/course-add'})" type="primary" class="ml10">添加</Button>
      </FormItem>
    </Form>
    
    <BaseTable class="list-box" :configure="tableConfig" @getList="getList">
      <Table border :columns="tableData.headList" :data="tableData.bodyList" size="default"
        class="table" :loading="loading" ref="selection"
        @on-selection-change="list => checkedBox = list">

        <template slot-scope="{ row }" slot="info">
          <div class="title">
            <router-link :to="{path:'/course-detail/' + row.id}" class="action-btn hot"
              :title="row.name">
              <span v-if="row.top">[置顶]</span>
              <span v-if="row.recommendHomePage||row.recommendChannelHomePage">[推荐]</span>{{row.name}}</router-link>
          </div>
        </template>
        
        <template slot-scope="{ row }" slot="sort">
          <InputNumber :precision="0" v-if="sort" :min="1" :max="999" v-model="row.sort" @on-change="() => { tableData.bodyList[row._index].sort = row.sort }">
          </InputNumber>
          <span v-else>{{row.sort}}</span>
        </template>

        <template slot-scope="{ row }" slot="totalDuration">
          {{ Math.floor((row.totalDuration||0) / 60) }}分
        </template>

        <template slot-scope="{ row }" slot="status">
          <!-- 讲师不能执行状态修改操作 -->
          <template v-if="isLecturer">{{getStatusTxt[row.status]}}</template>
          <div v-else-if="row.status === 1">
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
          <router-link :to="{path:'/course-edit', query: {id: row.id}}" v-if="!isLecturer && operates.includes('edit')" class="theme-blue">修改
          </router-link>
          <router-link :to="{path:'/course-edit', query: {id: row.id, currTab: 1}}" v-if="!isLecturer" class="theme-blue">配置
          </router-link>
          <router-link :to="{path:'/course-history', query: {id: row.id}}" class="theme-blue">学习记录
          </router-link>
          <router-link :to="{path:'/course-comment', query: {id: row.id}}" class="theme-blue">评论
          </router-link>
          <a href="javascript:;" class="theme-blue" v-if="!isLecturer && operates.includes('delete')" @click="deleteIds([row.id])">删除</a>
        </template>
      </Table>
    </BaseTable>

    <FooterButtons :selectionList="checkedBox" :AllList="tableData.bodyList"
      @changeOrder="b => sort = b" @finish="() => getList({})" class="operate"
      :resourceType="resourceType">
      <Button type="primary" :disabled="sort" class="ml10" v-if="operates.includes('batchDelete') && !isLecturer"
        @click="deleteIds(checkedBox)">批量删除</Button>
    </FooterButtons>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { AppModule } from "@store/modules/app";
import { getSchoolCourseList, deleteSchoolCourse } from "@service/tool"
import { updateStatus } from "@service/common";
import { getStatusTxt } from "@util/comm";
import BaseTable from "@components/baseTable/baseTable.vue";
import FooterButtons from "@components/footerButtons/operate-button.vue";

@Component({
  components: {
    BaseTable,
    FooterButtons
  }
})
export default class BrandAdd extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  // 是否开启排序功能
  private sort: boolean = false;
  // 选中数据
  private checkedBox: Array<any> = [];
  // 提交参数
  private params = <any>{
    name: "",
    pageSize: 10,
  };
  // 验证规则
  private ruleValidate = <any>{
    name: [
      {
        message: "只能输入2-50个字符",
        trigger: "blur",
        pattern: /^.{2,50}$/
      }
    ]
  };
  // 状态对象
  private getStatusTxt: any = getStatusTxt;
  // 课程资源类型
  private resourceType: string = 'CONTENT_TYPE_COURSE'
  // 表格分页信息
  private tableConfig = <any>{
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0
    },
    pagePosition: "right"
  };
  // 表格数据
  private tableData = <any>{
    headList: [
      {
        type: "selection",
        width: 50
      },
      {
        title: "课程名称",
        slot: "info",
        align: "center"
      },
      {
        title: "类型",
        align: "center",
        key: "typeName"
      },
      {
        title: "主讲人",
        align: "center",
        key: "lecturerName"
      },
      {
        title: "排序",
        align: "center",
        slot: "sort"
      },
      {
        title: "学习人数",
        align: "center",
        key: "userNum"
      },
      {
        title: "课时",
        align: "center",
        key: "chapterNum"
      },
      {
        title: "总时长",
        align: "center",
        key: "totalDuration",
        slot: "totalDuration",
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
        width: 200
      }
    ],
    bodyList: []
  }
  // 加载loading
  private loading = false;
  // 当前用户是否是讲师
  private isLecturer: boolean = false 

  mounted() {
    this.getList()
  }

  // 获取列表数据
  private getList(page?: any) {
    (this.$refs.params as any).validate((valid: boolean) => {
      if (valid) {
        if (page) {
          Object.assign(this.params, page)
        } else {
          this.params.currPage = 1
        }
        this.loading = true
        getSchoolCourseList(this.params).then((res:any) => {
          if (res.code === 0) {
            this.tableData.bodyList = res.data.list
            this.tableConfig.page = res.data.page
            this.isLecturer = res.data.isLecturer
          }
        }).finally(() => this.loading = false)  
      } else {
        this.$Message.info("请正确输入相关查询需求！");
      }
    })
  }

  // 删除 等接口
  private deleteIds(checkedBox: any) {
    if (checkedBox.length) {
      let title = `确认是否删除${this.checkedBox.length}条数据？`
      let ids = this.checkedBox.map((d:any) => d.id).toString()
      let config = <any>{
        title: "操作提示",
        okText: "确认删除",
        cancelText: "取消",
        content: title,
        onOk: () => {
          deleteSchoolCourse({ ids }).then((res: any) => {
            if (res.code === 0) {
              this.$Message.success("删除成功！");
              this.getList();
            }
          });
        }
      }
      this.$Modal.confirm(config)
    } else {
      this.$Message.info('请选择要删除的数据！')
    }
  }

  // 数据状态值切换
  private changeStatus(row: any, title: string) {
    let config = <any>{
      title: "操作提示",
      content: "确认是否" + title + "？",
      okText: "确认",
      cancelText: "关闭",
      onOk: () => this.updateStatus(row)
    };
    this.$Modal.confirm(config);
  }

  // 数据启用、禁用
  private updateStatus(row: any) {
    updateStatus({
      status: row.status === 2 ? 1 : 2,
      id: row.id,
      resourceType: this.resourceType
    }).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("更改状态成功!");
        this.getList({});
        this.loading = false;
      }
    });
  }
}
</script>

<style lang='scss' scoped>
.w300 {
  width: 300px;
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
