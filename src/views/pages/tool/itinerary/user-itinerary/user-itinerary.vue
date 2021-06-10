<template>
  <div class="itinerary-page">
    <div class="top-con">
      <Form inline>
        <FormItem>
          <Input placeholder="名称" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="searchHandle" class="mr-10">搜索</Button>
        </FormItem>
      </Form>
    </div>
    <!-- 表格区域 -->
    <div class="tables">
      <BaseTable :configure="configure" @getList="getList">
        <Table :columns="columns" border :loading="tableLoading" :data="datas">
          <template slot-scope="{ row }" slot="name">
            <router-link :to="{path: '/user-itinerary-detail', query: {id: row.id}}">{{row.name}}</router-link>
            <template v-if="row.personalTags.length">
              <span
                class="label"
                v-for="label in row.personalTags.split(',')"
                :key="label"
              >{{label}}</span>
            </template>
          </template>
          <template slot="time" slot-scope="{row}">
            {{row.processStart}}至{{row.processEnd}}
          </template>
          <template slot-scope="{ row }" slot="systemRecommend">
            <div class="table-status">
              {{row.systemRecommend === 1 ? '是' : '否'}}
              <span class="switch-box">
                <i-switch class="tab-switch" :value="row.systemRecommend === 1"></i-switch>
                <i class="mask" @click="statusChangeHandle(row)"></i>
              </span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="processDay">{{row.processDay}}天</template>
          <template slot-scope="{ row }" slot="operate">
            <div class="table-operate">
              <span class="tab-btn" @click="editHandle(row)">修改</span>|
              <span class="tab-btn" @click="deleteNoticeHandle(row.id)">删除</span>
            </div>
          </template>
        </Table>
      </BaseTable>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { BaseTable } from "@components/index";
import { ModalConfig } from "iview/types"
import { getJourneyList, setJouneryOperate } from "@service/tool.ts";

@Component({
  components: { BaseTable }
})
export default class UserItinerary extends Vue {
  params = {
    currPage: 1,
    pageSize: 10,
    name: "",
    querySource: 0
  };
  // baseTable组件需要的参数
  private configure:any = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0,
      totalPage: 1
    },
    pagePosition: "center"
  };
  tableLoading = false;
  // 表格头部
  private columns = [
    {
      title: "行程名称",
      slot: "name"
    },
    {
      title: "游客",
      key: "createName",
      align: "center"
    },
    {
      title: "行程天数",
      slot: "processDay",
      align: "center"
    },
    {
      title: "创建时间",
      key: "createTime",
      align: "center"
    },
    {
      title: "行程时间",
      slot: "time",
      align: "center"
    },
    {
      title: "系统推荐",
      slot: "systemRecommend",
      align: "center"
    },
  ];
  datas: Array<any> = [];
  searchHandle() {}
  onAddTagBtnHandle() {}
  // 点击状态按钮按钮触发
  private statusChangeHandle(row: any) {
    let _this = this;
    let title = row.systemRecommend === 1 ? "取消系统推荐" : "推荐";
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否${title}?`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        let { id, systemRecommend } = row as any;
        let status = 3;
        if (systemRecommend === 1) {
          status = 4;
        }
        setJouneryOperate({ type: 'STATUS', params: JSON.stringify({[row.id]: status}) }).then(res => {
          if (res.code === 0) {
            this.$Message.success(`${title}成功！`);
            this.getList();
          }
        });
      }
    };
    this.$Modal.confirm(config);
  }
  /** 获取列表 */
  getList(page?: any) {
    this.tableLoading = true;
    if (page) {
      this.params.currPage = page.currPage;
      this.params.pageSize = page.pageSize;
    }
    getJourneyList(this.params)
      .then(res => {
        if (res.code === 0) {
          this.datas = res.datas as Array<any>;
          this.configure.page = res.page;
          this.isSort = false;
          this.saveSortParams = {};
        }
      })
      .finally(() => {
        this.tableLoading = false;
      });
  }
  created () {
    this.getList();
  }
}
</script>

<style lang='scss' scoped>
.itinerary-page {
  padding: 15px;
  .mr-10 {
    margin-right: 10px;
  }
  .top-con {
    padding: 15px 15px 0;
    background: $grayLight;

    .ivu-form-item {
      margin-bottom: 15px;
    }
  }
  .table-status {
    display: inline-flex;
    align-items: center;
    .tab-switch {
      margin-left: 4px;
    }
    .switch-box {
      position: relative;
    }
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
  .label {
    display: inline-block;
    font-size: 12px;
    color: #ff9966;
    border: 1px solid #ff9966;
    height: 15px;
    line-height: 15px;
    padding: 0 3px;
    margin: 2px;
  }
}
</style>
