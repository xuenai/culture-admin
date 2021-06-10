<template>
  <div>
    <Form class="form" ref="params" :model="params" :rules="ruleValidate" :label-width="90">
      <FormItem label="分类名称" prop="name">
        <Input placeholder="请输入分类名称" v-model="params.name" :maxlength="50" class="w300" @on-enter="getList()" />
        <Button @click="getList()" type="primary" class="ml10">搜索</Button>
        <Button v-if="operates.includes('save')" @click="$router.push({path: '/course-class-add'})" type="primary" class="ml10">添加</Button>
      </FormItem>
    </Form>
    
    <BaseTable class="list-box" :configure="tableConfig" @getList="getList">
      <Table :columns="tableData.headList" :data="tableData.bodyList" size="default"
        class="table" :loading="loading" ref="selection">
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
          <router-link v-if="operates.includes('edit')" :to="{path:'/course-class-add', query: {id: row.id}}" class="theme-blue">修改
          </router-link>
          <a href="javascript:;" v-if="operates.includes('delete')" class="theme-blue" @click="deleteIds(row.id)">删除</a>
        </template>
      </Table>
    </BaseTable>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { AppModule } from "@store/modules/app";
import { getSchoolCourseTypeList, deleteSchoolCourseType, updateSchoolCourse } from "@service/tool"
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
  get userInfo() {
    return AppModule.userInfo;
  }
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

  mounted() {
    this.getList()
  }

  private getList(page?: any) {
    (this.$refs.params as any).validate((valid: boolean) => {
      if (valid) {
        if (page) {
          Object.assign(this.params, page)
        } else {
          this.params.currPage = 1
        }
        this.loading = true
        getSchoolCourseTypeList(this.params).then((res:any) => {
          if (res.code === 0) {
            this.tableData.bodyList = res.datas
            this.tableConfig.page = res.page
          }
        }).finally(() => this.loading = false)
      } else {
        this.$Message.info("请正确输入相关查询需求！");
      }
    })
  }
  // 删除
  private deleteIds(ids: any) {
    let config = <any>{
      title: "操作提示",
      okText: "确认删除",
      cancelText: "取消",
      onOk: () => {
        deleteSchoolCourseType({ ids }).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("删除成功！");
            this.getList();
          }
        });
      },
      render: (h: any, params: any) => {
        return h("p", `是否要删除？`);
      }
    }
    this.$Modal.confirm(config)
  }
  private getStatusTxt: any = getStatusTxt;
  // 数据状态值切换
  private changeStatus(row: any, title: string) {
    let config = <any>{
      title: "操作提示",
      content: "确认是否" + title + "？",
      okText: "确认",
      cancelText: "关闭",
      onOk: () => this.updateSchoolCourse(row)
    };
    this.$Modal.confirm(config);
  }
  private updateSchoolCourse(row:any) {
    updateSchoolCourse({
      id: row.id,
      status: [2, 1][row.status - 1]
    }).then((res:any) => {
      if (res.code === 0) {
        this.$Message.success("更改状态成功!");
        this.getList();
        this.loading = false;
      }
    })
  }
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
        title: "类型名称",
        key: "name",
        align: "center"
      },
      {
        title: "排序",
        align: "center",
        key: "sort"
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
  //
  private loading = false;
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
