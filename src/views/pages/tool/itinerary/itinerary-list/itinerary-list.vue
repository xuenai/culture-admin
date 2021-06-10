<template>
  <div class="itinerary-page">
    <div class="top-con">
      <Form inline :model="params">
        <FormItem>
          <Input placeholder="名称" v-model.trim="params.name" @keyup.enter.native="searchHandle" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="searchHandle" class="mr-10">搜索</Button>
          <router-link to="/add-itinerary">
            <Button type="primary">添加</Button>
          </router-link>
        </FormItem>
      </Form>
    </div>
    <!-- 表格区域 -->
    <div class="tables">
      <BaseTable :configure="configure" @getList="getList">
        <Table
          :columns="columns"
          border
          :loading="tableLoading"
          :data="datas"
          @on-selection-change="tableSelectionChangeHandle"
        >
          <template slot-scope="{ row }" slot="name">
            <span class="red" v-if="row.top">[置顶]</span>
            <span class="red" v-if="row.recommend || row.recommendHome">[推荐]</span>
            <router-link :to="{path: '/itinerary-detail', query: {id: row.id}}">{{row.name}}</router-link>
            <template v-if="row.personalTags.length">
              <span class="label" v-for="label in row.personalTags.split(',')" :key="label">{{label}}</span>
            </template>
          </template>
          <template slot-scope="{row}" slot="label">
            <template v-if="row.fitTags.length">
              <span class="label" v-for="label in row.fitTags.split(',')" :key="label">{{label}}</span>
            </template>
          </template>
          <template slot-scope="{ row }" slot="processDay">{{row.processDay}}天</template>
          <template slot-scope="{ row }" slot="sort">
            <Input v-if="isSort" number type="number" :value="row.sort" @on-change="inputChangeHandle($event, row.id)"/>
            <span v-else>{{row.sort}}</span>
          </template>
          <template slot-scope="{ row }" slot="recommend">{{row.recommend === 0 ? '否' : '是'}}</template>
          <template slot-scope="{ row }" slot="dataStatus">
            <div class="table-status">
              {{row.dataStatus === 1 ? '正常' : '禁用'}}
              <span class="switch-box">
                <i-switch class="tab-switch" :value="row.dataStatus === 1"></i-switch>
                <i class="mask" @click="statusChangeHandle(row)"></i>
              </span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="operate">
            <div class="table-operate">
              <span class="tab-btn" @click="editHandle(row)">修改</span>|
              <span class="tab-btn" @click="changeStatusHandle(0 ,row.id)">删除</span>
            </div>
          </template>
        </Table>
      </BaseTable>
    </div>
    <FooterBtns :selections="selections" :datas="datas" @saved-handle="getList" @save-sort="saveSortHandle" :isSort="isSort" @change-sort-status="changeSortStatusHandle"/>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { BaseTable } from "@components/index";
import { ModalConfig, Input } from "iview/types";

import { getJourneyList, setJouneryOperate } from "@service/tool.ts";

import FooterBtns from "./footer-btns.vue";

@Component({
  components: { BaseTable, FooterBtns }
})
export default class ItineraryList extends Vue {
  // baseTable组件需要的参数
  configure: any = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0,
      totalPage: 1
    },
    pagePosition: "center"
  };
  tableLoading = false;
  selections: Array<any> = [];
  // 表格头部
  columns = [
    {
      type: "selection",
      width: 60,
      align: "center"
    },
    {
      title: "行程名称",
      slot: "name"
    },
    {
      title: "标签",
      slot: "label",
      align: "center"
    },
    {
      title: "行程天数",
      slot: "processDay",
      align: "center"
    },
    {
      title: "排序",
      slot: "sort",
      align: "center"
    },
    {
      title: "推荐",
      slot: "recommend",
      align: "center"
    },
    {
      title: "浏览次数",
      key: "showCount",
      align: "center"
    },
    {
      title: "使用次数",
      key: "usedCount",
      align: "center"
    },
    {
      title: "状态",
      slot: "dataStatus",
      align: "center"
    },
    {
      title: "操作",
      slot: "operate",
      align: "center"
    }
  ];
  datas: Array<any> = [];
  params = {
    currPage: 1,
    pageSize: 10,
    name: "",
    querySource: 1
  };
  // 是否在排序状态
  isSort = false;
  // 用于保存排序的对象
  saveSortParams:any = {}
  editHandle (row: any) {
    this.$router.push({
      path: '/itinerary-edit',
      query: {
        id: row.id
      }
    });
  }
  // 排序输入框改变
  inputChangeHandle(e: Input, id: string) {
    let val = (e.target as HTMLInputElement).value
    if (!val) {
      return false
    }
    this.saveSortParams[id] = val
  }
  changeSortStatusHandle (value: boolean) {
    if (value) {
      this.$Message.warning(`排序必须为大于0的数值`);
    }
    this.isSort = value;
  }
  /** 保存排序 */
  saveSortHandle () {
    let len = Object.keys(this.saveSortParams).length
    if (len) {
      this.showNotice(3, () => {
        this.saveJouneryOperate(JSON.stringify(this.saveSortParams), 3, 'SORT');
      });
    } else {
      this.isSort = false;
    }
  }
  // 点击状态按钮按钮触发
  statusChangeHandle(row: any) {
    let { id, dataStatus } = row as any;
    let status = 0;
    if (dataStatus === 1) {
      status = 2;
    } else if (dataStatus === 2) {
      status = 1;
    }
    this.showNotice(status, () => {
      this.saveJouneryOperate(JSON.stringify({ [id]: status }), status);
    });
  }
  /** 弹出操作提示框 */
  showNotice(status: number, callback: () => void) {
    let _this = this;
    let title = this.getNoticeTitleByStatus(status);
    let content = `是否${title}该条数据?`;
    if (status == 3) {
      content = `是否保存排序？`
    }
    let config: ModalConfig = {
      title: "操作提示",
      content,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        callback();
      }
    };
    this.$Modal.confirm(config);
  }
  /** 通过要更改的状态获取对应的名称 */
  getNoticeTitleByStatus(status: number) {
    let title = "";
    switch (status) {
      // 删除操作
      case 0: {
        title = "删除";
        break;
      }
      // 启用
      case 1: {
        title = "启用";
        break;
      }
      // 禁用
      case 2: {
        title = "禁用";
        break;
      }
      // 排序
      case 3: {
        title = "排序";
        break;
      }
      default:
        break;
    }
    return title;
  }
  /** 改变状态操作 */
  changeStatusHandle(type: number, id: string | number) {
    this.showNotice(type, () => {
      this.saveJouneryOperate(JSON.stringify({ [id]: type }), type);
    });
  }
  /** 表单选中改变 */
  tableSelectionChangeHandle(data: any) {
    this.selections = data as Array<any>;
  }
  /** 对行程进行操作 */
  saveJouneryOperate(params: string, status: number, type?:string) {
    if (!type) {
      type = 'STATUS'
    }
    setJouneryOperate({ type, params }).then(res => {
      if (res.code === 0) {
        let title = this.getNoticeTitleByStatus(status);
        this.$Message.success(`${title}成功！`);
        this.getList();
      }
    });
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
  /** 输入框点击回车搜索 */
  searchHandle() {
    this.params.currPage = 1;
    this.getList();
  }
  created() {
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
  .table-operate {
    display: inline-flex;
    align-items: center;
    color: $theme;
    .tab-btn {
      margin: 0 2px;
      text-decoration: underline;
      text-decoration-color: $theme;
      cursor: pointer;
      &:active {
        color: $theme-active;
        text-decoration-color: $theme-active;
      }
      &:hover {
        color: $theme-hover;
        text-decoration-color: $theme-hover;
      }
    }
  }
  .red {
    color: $danger;
  }
  .label{
    display: inline-block;
    font-size:12px;
    color:#FF9966;
    border:1px solid #FF9966;
    height:15px;
    line-height:15px;
    padding:0 3px;
    margin:2px;
  }
}
</style>
