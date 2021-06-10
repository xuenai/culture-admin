<template>
  <div class="people">
    <!-- 左侧组织机构 -->
    <div class="sidebar" ref="Sidebar">
      <h3 class="tit">{{userInfo.name}}智慧文化旅游云组织机构</h3>
      <div class="items">
        <p class="item" v-for="org in orgList" :key="org.id" :class="{active: requestParams.queryOrgId === org.id}" :style="getPaddingLeft(org.orgLevel - 2)" @click="orgClickHandle(org.id)">
          <span class="item-name">|-&nbsp;{{org.name}}<span>（{{org.staffCount}}）</span>  </span>
        </p>
      </div>
    </div>
    <div class="article" :style="paddingLeft">
      <!-- 上面搜索区域 -->
      <div class="top">
        <Form ref="searchForm" :model="requestParams" inline class="searchForm">
          <FormItem>
            <Input v-model="requestParams.name" :maxlength="20" placeholder="账号姓名" class="tags-ipt">
              <span slot="prepend">姓名</span>
            </Input>
          </FormItem>
          <FormItem label="状态" :label-width="40">
            <Select v-model="requestParams.status" placeholder="请选择" class="tags-ipt">
              <Option value>全部</Option>
              <Option value="1">启用</Option>
              <Option value="2">禁用</Option>
            </Select>
          </FormItem>
          <FormItem label="角色" :label-width="40">
            <Select v-model="requestParams.roleId" placeholder="请选择" class="tags-ipt">
              <Option value>不限</Option>
              <Option v-for="role in roles" :key="role.id" :value="role.id">{{role.name}}</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="0">
            <Button type="primary" @click="searchHandle">搜索</Button>
          </FormItem>
        </Form>
        <Form inline>
          <FormItem>
            <Button type="primary" @click="goAddPage" v-if="operates.includes('save')">添加</Button>
          </FormItem>
          <FormItem>
            <Button @click="batchUpdateStatusHandle(2)" v-if="operates.includes('status')">停用</Button>
          </FormItem>
          <FormItem>
            <Button @click="batchUpdateStatusHandle(1)" v-if="operates.includes('status')">启用</Button>
          </FormItem>
        </Form>
      </div>
      <!-- 列表区域 -->
      <BaseTable class="people-tab" :configure="configure" @getList="getList">
        <Table
          ref="selection"
          :columns="columns"
          :data="datas"
          :loading="loading"
          @on-selection-change="onTableSelectHandle"
        >
          <template slot-scope="{row}" slot="sex">{{row.sex == '1' ? '男': '女'}}</template>
          <template slot-scope="{row}" slot="createTime">{{row.createTime.slice(0, 16)}}</template>
          <template slot-scope="{ row }" slot="status">
            <div class="table-status">
              {{row.status === 1 ? '正常' : '停用'}}
              <span class="switch-box">
                <i-switch class="tab-switch" :value="row.status === 1"></i-switch>
                <i class="mask" @click="statusChangeHandle(row)"></i>
              </span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="operate">
            <div class="table-operate">
              <span class="tab-btn" @click="goDetailPage(row.id)">查看</span>
            </div>
            <div class="table-operate">
              <span class="tab-btn" v-if="operates.includes('edit')" @click="goEditPage(row.id)">编辑</span>|
              <span
                class="tab-btn"
                v-if="operates.includes('delete')"
                @click="deleteBtnHandle(row.id)"
              >删除</span>
            </div>
          </template>
        </Table>
      </BaseTable>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { ModalConfig } from "iview/types";
import {
  getUserList,
  updateUserStatus,
  getOriginList,
  getRoleList,
  delUserByIds,
  getChildOriginListById
} from "@service/app";
import { BaseTable } from "@components/index";
import { AppModule } from "@store/modules/app";

@Component({ components: { BaseTable } })
export default class PeopleManage extends Vue {
  // 用户信息
  get userInfo () {
    return AppModule.userInfo
  }
  // 获取页面的权限
  get operates() {
    return AppModule.operates;
  }
  private configure = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0,
      totalPage: 1
    },
    pagePosition: "right"
  };
  private loading = false;
  private requestParams = {
    pageSize: 10,
    currPage: 1,
    name: "",
    status: "",
    roleId: "",
    queryOrgId: ""
  };
  private paddingLeft = "";
  // 角色列表
  private roles = [];
  // 表头
  private columns = [
    {
      type: "selection",
      width: 60,
      align: "center"
    },
    {
      title: "姓名",
      key: "name",
      align: "center"
    },
    {
      title: "性别",
      slot: "sex",
      width: 65,
      align: "center"
    },
    {
      title: "手机号",
      key: "phone",
      align: "center"
    },
    {
      title: "邮箱",
      key: "email",
      align: "center"
    },
    {
      title: "角色",
      key: "roleName",
      align: "center"
    },
    {
      title: "添加时间",
      slot: "createTime",
      align: "center"
    },
    {
      title: "状态",
      slot: "status",
      width: 110,
      align: "center"
    },
    {
      title: "操作",
      slot: "operate",
      align: "center"
    }
  ];
  // 组织机构列表
  private orgList = [];
  // 表单数组
  private datas = [];
  // 表单选中数组
  private selectedDatas = [];
  // 获取到左侧的距离
  private getPaddingLeft(idx: number) {
    let left = idx * 16;
    return `padding-left:${left}px`;
  }
  // 点击组织机构
  private orgClickHandle (id: string | number) {
    if (this.requestParams.queryOrgId === id) {
      this.requestParams.queryOrgId = '';
    } else {
      this.requestParams.queryOrgId = id as string;
    }
    this.searchHandle()
  }
  // 前往添加页面
  private goAddPage() {
    this.$router.push({ path: "/people-add" });
  }
  // 前往详情页
  private goDetailPage(id: string) {
    this.$router.push({ path: "/people-detail", query: { id } });
  }
  // 前往编辑页面
  private goEditPage(id: string) {
    this.$router.push({ path: "/people-edit", query: { id } });
  }
  // 点击状态按钮按钮触发
  private statusChangeHandle(row: any) {
    if (this.operates.findIndex((e: any) => e === "delete") > -1) {
      let title = row.status === 1 ? "停用" : "启用";
      let { id, status } = row as any;
      if (status === 1) {
        status = 2;
      } else if (status === 2) {
        status = 1;
      }
      this.statusChangeNoticeHandle(id, status, title);
    }
  }
  /**
   * 批量改变状态
   * @params status 要改变成为的状态值
   */
  private batchUpdateStatusHandle(status: number) {
    if (this.selectedDatas.length === 0) {
      this.$Message.error("未选择有效员工");
      return false;
    }
    let title = status === 2 ? "停用" : "启用";
    let ids: Array<string> = [];
    this.selectedDatas.map((item: any) => {
      ids.push(item.id);
    });
    this.statusChangeNoticeHandle(ids.join(","), status, title);
  }
  /**
   * 弹窗提示是否更改状态
   * @params ids {string | number} 需要更改状态的字符串数组
   * @params status {number} 需要更改为的状态码
   * @params title {string} 弹窗提示的title
   */
  private statusChangeNoticeHandle(
    ids: string | number,
    status: number,
    title: string
  ) {
    let _this = this;
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否${title}?`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        _this.statusChangeRequest({ ids, status, title });
      }
    };
    this.$Modal.confirm(config);
  }
  // 更改是否禁用请求
  private statusChangeRequest(option: any) {
    let { ids, status, title } = option;
    let params = {
      status,
      ids
    };
    updateUserStatus(params).then(res => {
      if (res.code === 0) {
        this.$Message.success(`${title}成功`);
        // 修改当前数组中的值
        this.getList();
      }
    });
  }
  // 获取列表
  getList(page?: any) {
    this.loading = true;
    if (page) {
      this.requestParams.currPage = page.currPage;
      this.requestParams.pageSize = page.pageSize;
    }
    getUserList(this.requestParams)
      .then(res => {
        this.loading = false;
        let { datas } = res;
        if (datas) {
          this.datas = datas;
        }
      })
      .catch(err => {
        this.loading = false;
      });
  }
  // 表单选择时
  private onTableSelectHandle(selection: []) {
    this.selectedDatas = selection;
  }
  // 删除按钮点击 进行弹框按钮提示
  private deleteBtnHandle(id: string | number) {
    let _this = this;
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否删除?`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        _this.deletePeople(id);
      }
    };
    this.$Modal.confirm(config);
  }
  // 删除操作请求
  private deletePeople(ids: string | number) {
    delUserByIds({ ids }).then(res => {
      if (res.code === 0) {
        this.$Message.success(`删除成功`);
        this.resetRequestCurrPage();
        this.getList();
      }
    });
  }
  // 重置请求参数中的page
  private resetRequestCurrPage() {
    this.requestParams.currPage = 1;
    this.configure.page.currPage = 1;
  }
  // 搜索
  private searchHandle() {
    this.resetRequestCurrPage();
    this.getList();
  }
  // 获取组织机构
  private getOriginList () {
    getChildOriginListById({id: this.userInfo.orgId}).then(res => {
      if (res.code === 0) {
        this.orgList = res.datas as []
      }
    })
  }
  mounted() {
    this.getList();
    this.getOriginList()
    // 不使用分页查询角色列表
    getRoleList({ enablePage: false }).then(res => {
      let { datas } = res;
      if (datas) {
        this.roles = datas;
      }
    });
  }
}
</script>
<style lang='scss' scoped>
.people {
  position: relative;
  height: 100%;
  .sidebar {
    position: fixed;
    left: 275px;
    top: 127px;
    height: calc(100vh - 142px);
    padding: 16px 16px 0;
    width: 200px;
    background: $bg;
    overflow-y: auto;
    overflow-x:hidden;
    .tit {
      padding-bottom:10px;
      color: $theme;
      line-height: 1.6;
    }
    .items {
      padding-left: 8px;
      padding-bottom:30px;
      overflow: auto;
    }
    .item {
      padding:4px 0;
      line-height: 2;
      cursor: pointer;
      white-space: nowrap;
      transition: all .2s linear;
      &:hover{
        .item-name{
          background:#eee;
        }
      }
      &.active{
        .item-name{
          background:#e1e1e1;
        }
      }
    }
    .item-name{
      display:inline-block;
      padding:0 8px;
      border-radius:4px;
    }
  }
  .article {
    position: relative;
    margin-left: 200px;
    padding: 15px;
    z-index: 1;
  }
  .top {
    padding: 24px 32px 0;
    background: $bg;
  }
  .people-tab {
    margin-top: 8px;
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
      cursor:pointer;
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
}
</style>
