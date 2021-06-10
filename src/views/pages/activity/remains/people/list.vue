<template>
  <div class="pd20">
    <Head resourceType @getCode="getCode" v-model="cityName"></Head>
    <Form class="mt20" :label-width="80" inline>
      <FormItem class="item" label="名称">
        <Input
          placeholder="传承人名称"
          v-model="params.name"
          @on-enter="getList"
        />
      </FormItem>
      <FormItem class="item" label="性别">
        <Select class="w150" v-model="params.sex" @on-change="getList">
          <Option value selected>全部</Option>
          <Option value="1">男</Option>
          <Option value="0">女</Option>
        </Select>
      </FormItem>
      <FormItem class="item" label="状态">
        <Select class="w150" v-model="params.status" @on-change="getList">
          <Option value selected>全部</Option>
          <Option value="1">正常</Option>
          <Option value="2">禁用</Option>
          <Option value="3">草稿</Option>
          <Option value="4">待审核</Option>
          <Option value="7">回退</Option>
          <Option value="8">撤回</Option>
          <Option value="9">终止</Option>
        </Select>
      </FormItem>
      <div class="submit">
        <Button type="primary" class @click="getList">搜索</Button>
        <router-link
          :to="{
            path: '/inheritor-add',
            query: { pid: $route.query.pid, type: 'list' }
          }"
          class="btn-primary ml10"
          v-if="!resourceCode"
          >添加</router-link
        >
        <router-link
          :to="{
            path: '/inheritor-search-list',
            query: { resourceCode: resourceCode, pid: this.$route.query.pid, region: this.$route.query.region, cityName: this.cityName }
          }"
          class="btn-primary ml10"
          v-if="resourceCode"
          >添加</router-link
        >
      </div>
    </Form>
    <baseTable :configure="tableConfig" @getList="getList">
      <Table
        border
        :columns="tableData.headList"
        :data="tableData.bodyList"
        class="table"
        :loading="loading"
        @on-selection-change="setChecked"
      >
        <template slot-scope="{ row, index }" slot="name">
          <div class="hotel-msg">
            <div class="msg-panel">
              <p class="hotel-name">
                <router-link
                  :to="{
                    path: '/inheritor-detail',
                    query: { pid: params.id, id: row.id, type: 'list' }
                  }"
                  class="theme-blue hotel-tag"
                  >{{ row.name }}</router-link
                >
              </p>
            </div>
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="gender">
          <span v-if="row.gender">{{ row.gender }}</span>
          <span v-if="!row.gender">-</span>
        </template>
        <template slot-scope="{ row, index }" slot="nationality">
          <span v-if="row.nationality">{{ row.nationality }}</span>
          <span v-else>-</span>
        </template>
        <template slot-scope="{ row, index }" slot="age">
          <span v-if="row.age">{{ row.age }}</span>
          <span v-else>-</span>
        </template>
        <template slot-scope="{ row, index }" slot="sort">
          <span v-if="!order">{{ row.sort }}</span>
          <Input v-else @on-change="changeSort(row)" v-model="row.sort" />
        </template>
        <template slot-scope="{ row, index }" slot="backlogName">
          <span v-if="row.status === 4 || row.status === 5">{{
            row.backlogName
          }}</span>
          <span v-else-if="row.status === 3">无</span>
          <span v-else>结束</span>
        </template>
        <template slot-scope="{ row, index }" slot="status">
          <div v-if="row.status == 1">
            <span class="switchLabel">正常</span>
            <span class="switchBox" @click="changeStatus(row, '禁用')">
              <i-switch :value="row.status === 1" />
              <span class="cover"></span>
            </span>
          </div>
          <div v-else-if="row.status == 2">
            <span class="switchLabel">禁用</span>
            <span class="switchBox" @click="changeStatus(row, '启用')">
              <i-switch :value="row.status === 1" />
              <span class="cover"></span>
            </span>
          </div>
          <div v-else-if="row.status == 3">草稿</div>
          <div v-else-if="row.status == 4">待审核</div>
          <div v-else-if="row.status == 5">审核中</div>
          <div v-else-if="row.status == 6">审核通过</div>
          <div v-else-if="row.status == 7">回退</div>
          <div v-else-if="row.status == 8">撤回</div>
          <div v-else-if="row.status == 9">终止</div>
          <div v-else-if="row.status == 10">等待回调</div>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <dropCode
            v-if="row.status === 1"
            :id="'qrcode' + row.id"
            :key="'qrcode' + row.id"
            :value="
              $store.state.app.userInfo.h5Domain + '/#/successor-desc/' + row.id
            "
          >
            <span class="theme-blue action-btn">预览</span>
          </dropCode>
          <a
            class="theme-blue action-btn"
            v-if="operates.includes('submit')&&row.status === 3"
            @click="submitCol(row, index)"
            >提交</a
          >
          <router-link
            :to="{
              path: '/inheritor-edit',
              query: { id: row.id, pid: params.id, type: 'list' }
            }"
            v-if="operates.includes('edit')&&
              row.status != 9 &&
                row.status != 4 &&
                row.status !== 5 &&
                row.showProcess === 1
            "
            class="theme-blue action-btn"
            >修改</router-link
          >

          <a
            class="theme-blue action-btn"
            v-if="operates.includes('recall')&&row.status === 4"
            @click="setWithdraw(row)"
            >撤回</a
          >
          <a
            class="theme-blue action-btn"
            v-if="operates.includes('delete')&&row.status !== 4 && row.status !== 5"
            @click="deleteRow(row, index)"
            >删除</a
          >
        </template>
      </Table>
    </baseTable>
    <div class="operate text-center">
      <Button
        type="primary"
        v-if="
          !order && operates.includes('cancelTop') && tableData.bodyList.length
        "
        @click="orderTrue"
        >排序</Button
      >
      <Button
        type="primary"
        v-if="order && operates.includes('cancelTop')"
        @click="orderClick"
        >保存排序</Button
      >
      <Button
        type="primary"
        class="ml10"
        v-if="operates.includes('batchDelete')"
        @click="deleteRow(checkedIds, -1)"
        >批量删除</Button
      >
      <Button
        type="primary"
        class="ml10"
        v-if="operates.includes('batchSave')"
        @click="submitCol(checkedIds, -1)"
        >批量提交</Button
      >
      <Button
        type="default"
        class="ml10 import-panel"
        v-if="operates.includes('import')"
      >
        <input
          class="upload-excel"
          type="file"
          @change="acceptExcel($event)"
        />导入
      </Button>
      <Button
        type="default"
        class="ml10 outExcel"
        v-if="operates.includes('export')"
      >
        <a @click="outExcel($event)">导出</a>
      </Button>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import dropCode from "@components/DropCode/DropCode.vue";
import { deleteCol, submitBatch } from "@service/place";
import {
  ctcHeritagePeopleList,
  ctcHeritagePeopleWithdraw,
  getByHeritageItemId,
  ctcHeritagePeopleImport
} from "@service/activity";
import { updateStatus, setSort } from "@service/common";
import { AppModule } from "@store/modules/app";
import CONFIG from "@/util/config";
import { importExcelComplete } from "@util/comm";
import Head from "./head.vue";
@Component({
  components: {
    baseTable,
    dropCode,
    Head
  }
})
export default class guestRoomTable extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  //获取token
  get token() {
    return AppModule.token;
  }
  //获取资源编码
  private resourceCode: any = "";
  getCode(resourceCode: any) {
    this.resourceCode = resourceCode;
  }
  /*S 导出*/
  private outExcelApi: string =
    CONFIG.defaultUrl + "/res/site/ctcHeritagePeople/exportExcel?";
  outExcel(e: any) {
    let _target = e.target as HTMLInputElement,
      _this = this;
    let checkedLen = _this.checkedIds ? _this.checkedIds.split(",").length : 0;
    if (checkedLen < 1) {
      this.$Message.error("请选择需要导出的数据！");
    } else {
      _target.setAttribute(
        "href",
        this.outExcelApi + "token=" + this.token + "&ids=" + _this.checkedIds
      );
    }
  }
  cityName = '';
  /*E 导出*/
  /* S 导入 */
  private spinShow: boolean = false;
  private acceptExcel(e: any) {
    let _this = this;
    let files = e.target.files;
    let formData = new FormData();
    formData.append("file", files[0]);
    formData.append("token", this.token);
    this.spinShow = true;
    ctcHeritagePeopleImport(formData).then((blob: any) => {
      _this.spinShow = false;
      importExcelComplete(blob)
        .then(res => {
          this.$Message.success("导入成功");
        })
        .finally(() => {
          _this.tableConfig.page.currPage = 1;
          _this.getList();
        });
    });
  }
  /* E 导入 */
  //登录端判断
  private isSite: boolean = this.$store.state.app.userInfo.dataType === "SITE";
  private loading: boolean = true;
  private tableData: any = {
    headList: [],
    bodyList: []
  };
  // 请求参数
  private params: any = {
    id: "", // 非遗项目id
    name: "", // 名称
    sex: "", // 性别
    status: "" //状态
  };
  //表格分页信息
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 6
    },
    pagePosition: "right"
  };
  //表格数据
  getList(data: any = this.tableConfig.page) {
    let _this = this;

    //站点端
    _this.tableData.headList = [
      {
        type: "selection",
        width: 60,
        align: "center"
      },
      {
        title: "传承人信息",
        key: "name",
        slot: "name",
        align: "left",
        width: 350
      },
      {
        title: "性别",
        key: "gender",
        slot: "gender",
        align: "center"
      },
      {
        title: "民族",
        key: "nationality",
        slot: "nationality",
        align: "center"
      },
      {
        title: "年龄",
        key: "age",
        slot: "age",
        align: "center"
      },
      {
        title: "排序",
        key: "sort",
        slot: "sort",
        align: "center"
      },
      {
        title: "状态",
        key: "status",
        slot: "status",
        align: "center"
      },
      {
        title: "操作",
        key: "action",
        width: 250,
        align: "center",
        slot: "action"
      }
    ];

    _this.params = Object.assign(this.params, data); //搜索条件
    ctcHeritagePeopleList(this.params).then((res: any) => {
      _this.tableData.bodyList = res.datas as [];
      _this.checkedIds = "";
      _this.loading = false;
      _this.tableConfig.page = res.page ? res.page : {};
    });
  }
  //  更新状态值
  private changeStatus(row: any, title: string) {
    let _this = this;
    let config: any = {
      title: "操作提示",
      content: "确认是否" + title + "？",
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        _this.adPosition(row);
      }
    };
    this.$Modal.confirm(config);
  }

  //   广告位开启、禁用
  private adPosition(row: any) {
    let _this = this;
    let status = 2;
    if (row.status == 2) {
      status = 1;
    }
    let param = {
      id: row.id,
      status: status,
      resourceType: "CONTENT_TYPE_HERITAGE_PEOPLE"
    };
    updateStatus(param).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("更新成功!");
        _this.getList();
      }
    });
  }

  //删除行
  deleteRow(item: any, index: any) {
    let _this: any = this,
      checkedLen = _this.checkedIds ? _this.checkedIds.split(",").length : 0;
    if (index === -1 && !checkedLen) {
      _this.$Message.error("请选择你要删除的传承人");
      return;
    }
    let config: any = {
      title: "操作提示",
      content: `确认要删除“${item.name ||
        "选中的" + checkedLen + "条"}”数据吗？删除后用户端将不再展示！`,
      okText: "确认删除",
      cancelText: "取消",
      onOk: () => {
        deleteCol({
          ids: index == -1 ? _this.checkedIds : item.id,
          type: "CONTENT_TYPE_HERITAGE_PEOPLE" //资源类型
        }).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("删除成功");
            _this.getList();
          }
        });
      }
    };
    this.$Modal.confirm(config);
  }
  // 撤回
  setWithdraw(item: any) {
    let _this = this;
    let config: any = {
      title: "操作提示",
      content: `确认要撤回？`,
      okText: "确认撤回",
      cancelText: "取消",
      onOk: () => {
        ctcHeritagePeopleWithdraw({
          resourceId: item.id
        }).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("操作成功");
            _this.getList();
          }
        });
      }
    };
    this.$Modal.confirm(config);
  }
  /*S 底部操作按钮*/
  // 复选框ID
  private checkedIds: string = "";
  private footerList: Array<Object> = [];
  // 复选框
  private setChecked(e: any) {
    let checkedIds: any = [];
    this.footerList = e;
    e.map((item: any) => {
      checkedIds.push(item.id as Number);
    });
    this.checkedIds = checkedIds.join(",");
  }
  //提交||批量提交
  submitCol(item: any, index: any) {
    let _this = this,
      checkedLen = _this.checkedIds ? _this.checkedIds.split(",").length : 0;
    if (index === -1 && !checkedLen) {
      _this.$Message.error("请选择你要提交的传承人");
      return;
    }
    let config: any = {
      title: "操作提示",
      content: `确认要提交“${item.name ||
        "选中的" + checkedLen + "条"}”数据吗？`,
      okText: "确认提交",
      cancelText: "取消",
      onOk: () => {
        submitBatch({
          ids: index == -1 ? _this.checkedIds : item.id,
          type: "CONTENT_TYPE_HERITAGE_PEOPLE" //资源类型
        }).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("提交成功");
            _this.getList();
          }
        });
      }
    };
    this.$Modal.confirm(config);
  }
  /*E 底部操作按钮*/
  /* S 排序 */
  private order: boolean = false; // 是否开启排序功能
  private sortParams: any = {}; // 修改排序后的数据
  private orderTrue() {
    this.order = true;
  }
  // 修改排序
  private changeSort(row: any) {
    this.sortParams[row.id] = row.sort;
  }
  // 点击保存排序
  private orderClick() {
    this.order = false;
    this.setSort();
  }
  // 设置排序
  private setSort() {
    setSort({
      params: JSON.stringify(this.sortParams),
      resourceType: "CONTENT_TYPE_HERITAGE_PEOPLE"
    }).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("操作成功");
      }
    });
    // 发送请求后将当前 对象清空
    this.sortParams = {};
  }
  /* E 排序 */
  mounted() {
    let _this = this;
    _this.params.id = this.$route.query.pid;
    _this.getList();
  }
}
</script>

<style scoped lang="scss">
.operate {
  margin-top: 12px;
}
.w150 {
  width: 150px;
}
.table {
  margin-top: 15px;
  .action-btn {
    cursor: pointer;
    white-space: nowrap;
    & + .action-btn {
      margin-left: 5px;
    }
  }
  .hotel-msg {
    padding: 8px 0;
    .img {
      width: 100px;
      height: 60px;
    }
    .hotel-name {
      margin-top: 7px;
      text-align: left;
    }
    .hotel-tag {
      display: inline-block;
    }
    .address {
      margin-top: 7px;
      white-space: normal;
      color: $font06;
    }
  }
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
.import-panel {
  position: relative;
  .upload-excel {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    opacity: 0;
  }
}
.outExcel {
  a {
    color: #515a6e;
  }
}
.submit {
  display: inline-block;
  margin: 0 0 15px 10px;
}
</style>
