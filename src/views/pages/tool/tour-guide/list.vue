<template>
  <div>
    <Form class="form" ref="params" :model="params" inline :label-width="70">
      <FormItem label="名称" prop="name">
        <Input placeholder="名称" v-model="params.name" :maxlength="30" class="w300" @on-enter="getList()" />
      </FormItem>
      <FormItem label="类型" prop="type">
        <Select v-model="params.type" class="w300" @on-change="getList()">
          <Option :value="-1">全部</Option>
          <Option :value="2">景区</Option>
          <Option :value="1">全域</Option>
        </Select>
        <Button @click="getList()" type="primary" class="ml10">搜索</Button>
        <Button @click="$router.push({path: '/tourguide-add'})" type="primary" class="ml10">添加</Button>
      </FormItem>
    </Form>
    
    <BaseTable class="list-box" :configure="tableConfig" @getList="getList">
      <Table border :columns="tableData.headList" :data="tableData.bodyList" size="default" :loading="loading" @on-selection-change="data => checkedBox = data">

        <template slot-scope="{ row }" slot="name">
          <router-link :to="{path:'/tourguide-add', query: {id: row.id}}" class="action-btn hot"
            :title="row.name">{{row.name}}</router-link>
        </template>
        <template slot-scope="{ row }" slot="type">
          {{ ['全域', '景区'][row.type - 1] }}
        </template>
        
        <template slot-scope="{ row }" slot="sort">
          <InputNumber :precision="0" v-if="sort" :min="1" :max="999" v-model="row.sort" @on-change="() => { tableData.bodyList[row._index].sort = row.sort }">
          </InputNumber>
          <span v-else>{{row.sort}}</span>
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
          <router-link :to="{path:'/tourguide-add', query: {id: row.id}}" class="theme-blue">修改
          </router-link>
          <router-link v-if="row.type === 1" :to="{path:'/tourguide-setting-area', query: {id: row.id}}" class="theme-blue">配置
          </router-link>
          <router-link v-if="row.type === 2" :to="{path:'/tourguide-setting-scenic', query: {id: row.id}}" class="theme-blue">配置
          </router-link>
          <a href="javascript:;" class="theme-blue" @click="deleteIds([row.id])">删除</a>
        </template>
      </Table>
    </BaseTable>

    <FooterButtons :selectionList="checkedBox" :AllList="tableData.bodyList"
      @changeOrder="b => sort = b" @finish="() => getList({})" class="operate"
      :resourceType="resourceType">
      <Button type="primary" :disabled="sort" class="ml10" v-if="operates.includes('batchDelete')"
        @click="deleteIds(checkedBox)">批量删除</Button>
    </FooterButtons>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { AppModule } from "@store/modules/app";
import { getTourGuideList, deleteTourGuide } from "@service/tool"
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
    type: -1
  };
  // 状态对象
  private getStatusTxt: any = getStatusTxt;
  // 课程资源类型
  private resourceType: string = 'CONTENT_TYPE_GUIDED_TOUR'
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
        title: "名称",
        slot: "name",
        align: "left"
      },
      {
        title: "类型",
        align: "center",
        slot: "type"
      },
      {
        title: "区域",
        align: "center",
        key: "regionName"
      },
      {
        title: "排序",
        align: "center",
        slot: "sort"
      },
      {
        title: "编号",
        align: "center",
        key: "code"
      },
      {
        title: "创建时间",
        align: "center",
        key: "createTime"
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

  created() {
    this.getList()
  }

  // 获取列表数据
  private getList(page?: any) {
    if (page) {
      Object.assign(this.params, page)
    } else {
      this.params.currPage = 1
    }
    this.loading = true
    let params = {...this.params}
    if (params.type === -1) delete params.type
    getTourGuideList(params).then((res:any) => {
      if (res.code === 0) {
        this.tableData.bodyList = res.datas
        this.tableConfig.page = res.page
      }
    }).finally(() => this.loading = false)  
  }

  // 删除 等接口
  private deleteIds(checkedBox: any) {
    if (checkedBox.length) {
      let title = `确认是否删除${checkedBox.length}条数据？`
      let ids = checkedBox.map((d:any) => d.id).toString()
      let config = <any>{
        title: "操作提示",
        okText: "确认删除",
        cancelText: "取消",
        content: title,
        onOk: () => {
          deleteTourGuide({ ids }).then((res: any) => {
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
