<template>
  <div class="wrap pc-content-list-no-overflowhidden">
    <Form :label-width="80" inline class="serarch-box">
      <FormItem class="item" label="标题：">
        <i-input placeholder="请输入标题" v-model="condition.title"></i-input>
      </FormItem>
      <FormItem class="item" label="创建者：">
        <i-input placeholder="请输入创建者" v-model="condition.createCompany"></i-input>
      </FormItem>
      <FormItem class="item" label="类型：">
        <Select style="width:150px" v-model="condition.contentType" @on-change="onSelectValueChange">
          <Option value>全部</Option>
          <Option value="CONTENT">内容</Option>
          <Option value="IMAGE">图片</Option>
          <Option value="VIDEO">视频</Option>
          <Option value="AUDIO">音频</Option>
        </Select>
      </FormItem>
      <FormItem class="item" label="状态：">
        <Select style="width:150px" v-model="condition.status" @on-change="onSelectValueChange">
          <Option value>全部</Option>
          <Option value="1">正常</Option>
          <Option value="2">禁用</Option>
          <Option value="3">草稿</Option>
          <Option value="4">待审核</Option>
          <Option value="5" v-if="$store.state.app.userInfo.dataType != 'SITE'">审核中</Option>
          <Option value="7">回退</Option>
          <Option value="8">撤回</Option>
          <Option value="9">终止</Option>
        </Select>
      </FormItem>
      <FormItem class="item" label="提交时间：">
        <DatePicker
          type="daterange"
          separator=" 至 "
          :options="options"
          @on-change="selectDate"
          placeholder="选择日期筛选"
          placement="bottom-end"
          style="width: 200px"
        ></DatePicker>
        <Button type="primary" class="ml20" @click="handleSubmit">搜索</Button>
      </FormItem>
    </Form>
    <div>
      <baseTable :configure="tableConfig" @getList="getList">
        <Table
          border
          :columns="tableData.headList"
          :data="tableData.bodyList"
          @on-selection-change="selectionTable"
          size="default"
          class="table"
          :loading="loading"
        >
          <template slot-scope="{ row }" slot="title" class="clearfix">
            <div class="title fl">
              <span class="red" v-if="row.top">[置顶]</span>
              <span class="red" v-if="row.recommendChannelHomePage || row.recommendHomePage">[推荐]</span>
              <router-link
                  tag="a"
                  :to="{path:'/con-detail',query:{id:row.id,contentType:row.contentType,modify:row.showProcess}}"
                  href="javascript:;"
                  class="theme-blue action-btn"
                  :title="row.title"
                >{{row.title}}</router-link>
            </div>
            <i class="cloud-icon titleIcon" v-if="row.images">&#xe6f8;</i>
            <i class="cloud-icon titleIcon" v-if="row.video">&#xe6fa;</i>
            <i class="cloud-icon titleIcon" v-if="row.audio">&#xe6fb;</i>
          </template>
          <template slot-scope="{row}" slot="showNum">
            {{row.showNum || 0}}
          </template>
          <template slot-scope="{ row }" slot="contentType">
            <div>{{getStatusTxt(row.contentType)}}</div>
          </template>
          <template slot-scope="{ row }" slot="sort">
            <span v-if="!order">{{row.sort}}</span>
            <InputNumber :precision="0" v-else :min="1" :max="999" @on-change="changeSort(row)" v-model="row.sort"></InputNumber>
          </template>
          <template slot-scope="{row}" slot="backlogName">
            <span v-if="row.status == 4 || row.status == 5">{{row.backlogName}}</span>
            <span v-else-if="row.status == 3">无</span>
            <span v-else>已结束</span>
          </template>
          <template slot-scope="{ row }" slot="status">
            <div v-if="row.status === 1">
              <span class="switchLabel">正常</span>
              <span class="switchBox" @click="changeStatus(row,'禁用')">
                <i-switch :value="row.status === 1"/>
                <span class="cover"></span>
              </span>
            </div>
            <div v-else-if="row.status === 2">
              <span class="switchLabel">禁用</span>
              <span class="switchBox" @click="changeStatus(row,'启用')">
                <i-switch :value="row.status === 1"/>
                <span class="cover"></span>
              </span>
            </div>
            <div v-else>{{getStatusTxt(row.status)}}</div>
          </template>
          <template slot-scope="{row}" slot="action">
            <div>
              <!-- 待审核 -->
              <div v-if="row.status === 4 || row.status === 5">
                <a
                  href="javascript:;"
                  class="theme-blue action-btn"
                  @click="contentWithdraw(row)"
                  v-if="operates.includes('recall')"
                >撤回</a>
                <a
                  href="javascript:;"
                  class="theme-blue action-btn"
                  @click="getContentAuditProcess(row)"
                  v-if="operates.includes('process') && row.showProcess == 1"
                >流程</a>
              </div>
              <!-- 已撤回 -->
              <div v-else-if="row.status === 8">
                <a
                  href="javascript:;"
                  @click="routeUpdate(row)"
                  class="theme-blue action-btn"
                   v-if="operates.includes('edit') && row.showProcess == 1"
                >修改</a>
                <a
                  href="javascript:;"
                  class="theme-blue action-btn"
                  @click="getContentAuditProcess(row)"
                  v-if="operates.includes('process') && row.showProcess == 1"
                >流程</a>
                <a href="javascript:;" class="theme-blue action-btn" @click="contentDelete(row)" v-if="operates.includes('delete')">删除</a>
              </div>
              <!-- 草稿-->
              <div v-else-if="row.status === 3">
                <a
                  @click="routeUpdate(row)"
                  href="javascript:;"
                  class="theme-blue action-btn"
                   v-if="operates.includes('edit') && row.showProcess == 1"
                >修改</a>
                <a href="javascript:;" v-if="operates.includes('submit')" class="theme-blue action-btn" @click="dataSubmit(row)">提交</a>
                <a href="javascript:;" class="theme-blue action-btn" @click="contentDelete(row)" v-if="operates.includes('delete')">删除</a>
              </div>
              <!-- 终止 -->
              <div v-else-if="row.status === 9">
                <a
                  href="javascript:;"
                  class="theme-blue action-btn"
                  @click="getContentAuditProcess(row)"
                  v-if="operates.includes('process') && row.showProcess == 1"
                >流程</a>
                <a href="javascript:;" class="theme-blue action-btn" @click="contentDelete(row)" v-if="operates.includes('delete')">删除</a>
              </div>
              <!-- 回退 || 正常 || 禁用-->
              <div v-else style="position:relative;">
                <dropCode
                  v-if="row.status===1"
                  :id="'qrcodeSwiper' + row.id"
                  :key="'qrcodeSwiper' + row.id"
                  :value="$store.state.app.userInfo.h5Domain+'/#/'+ getH5DetailRoute(row.contentType) +'/' +row.id"
                >
                  <span class="theme-blue action-btn">预览</span>
                </dropCode>
                <!-- <dropCode
                  v-if="row.status===1 && row.contentType === 'IMAGE'"
                  :id="'qrcodeSwiper' + row.id"
                  :value="$store.state.app.userInfo.h5Domain+'/#/swiper-detail/' +row.id"
                >
                  <span class="theme-blue action-btn">预览</span>
                </dropCode> -->
                <!-- <dropCode
                  v-else-if="row.status===1"
                  :id="'qrcodeContent' + row.id"
                  :value="$store.state.app.userInfo.h5Domain+'/#/news-detail/' +row.id"
                >
                  <span class="theme-blue action-btn">预览</span>
                </dropCode> -->
                <a
                  @click="routeUpdate(row)"
                  href="javascript:;"
                  class="theme-blue action-btn"
                   v-if="operates.includes('edit') && row.showProcess == 1"
                >修改</a>
                <a
                  href="javascript:;"
                  class="theme-blue action-btn"
                  @click="getContentAuditProcess(row)"
                  v-if="operates.includes('process') && row.showProcess == 1"
                >流程</a>
                <a href="javascript:;" class="theme-blue action-btn" @click="contentDelete(row)" v-if="operates.includes('delete')">删除</a>
              </div>
            </div>
          </template>
        </Table>
      </baseTable>
      <footerButtons
        type="CONTENT"
        :selectionList="selectionList"
        :orderRowData = "orderRowData"
        @changeOrder="changeOrder"
        @getList="getList"
      >
        <Button type="primary" v-if="operates.includes('batchDelete')" :disabled="order" @click="patchDelete">批量删除</Button>
        <Button type="primary" v-if="operates.includes('batchSave')" :disabled="order" @click="patchSubmit">批量提交</Button>
        <Button type="primary" v-if="operates.includes('transfer')" :disabled="order" @click="transferSite">转移并发布</Button>
        <Button type="primary" v-if="operates.includes('report') && siteInfo.siteVersion=== 'PLAIN'" :disabled="order" @click="reportSite">上报</Button>
        <Button type="primary" v-if="operates.includes('cloudLeague') && userInfo.joinUnion" :disabled="order" @click="showAilenDialog">云联盟</Button>
        <Button v-if="operates.includes('import')" :disabled="order" style="position:relative;"><input class="upload-excel" type="file" @change="acceptExcel($event)">导入</Button>
          <Button v-if="operates.includes('export')" @click="outExcel" :disabled="order">导出<!--<a :href="outExcelApi" download></a>--></Button>
      </footerButtons>
    </div>
    <Modal v-model="modal" title="审批流程" footer-hide>
      <auditProcess :data="processData"></auditProcess>
    </Modal>
    <Modal v-model="report" title="上报" @on-ok="sureReport">
      <Select v-model="reportSiteID">
        <Option v-for="(item) in reportList" :value="item.id" :key="item.id">{{item.name}}</Option>
      </Select>
    </Modal>
    <Modal v-model="transfer" title="转移至其他栏目" @on-ok="sureTransfer">
      <Tree :data="transferList" :show-checkbox="false" @on-select-change="changeChannel"></Tree>
    </Modal>
    <Modal v-model="transferAilen" title="拉取至栏目" @on-ok="sureTransferAilen">
      <Tree :data="transferListAilen" :show-checkbox="false" @on-select-change="changeChannelAilen"></Tree>
    </Modal>
    <Modal
      class="cloudAilen"
      title="云联盟"
      width="800"
      @on-ok="ailenDialogSure"
      v-model="cloudAilen"
      :mask-closable="false"
    >
      <ul class="ailenBox">
        <li
          v-for="(item,index) in ailenList"
          :key="item.id"
          :class="{active:index === AilenIndex}"
          @click="clickAilen(item.id,index)"
        >{{item.name}}</li>
      </ul>
      <Form :label-width="60" inline>
        <FormItem class="item" label="标题：">
          <i-input style="width:100px" placeholder="请输入标题" v-model="conditionAilen.title"></i-input>
        </FormItem>
        <FormItem class="item" label="创建者：">
          <i-input style="width:100px" placeholder="请输入创建者" v-model="conditionAilen.createCompany"></i-input>
        </FormItem>
        <FormItem class="item" label="类型：">
          <Select style="width:100px" v-model="conditionAilen.contentType">
            <Option value>全部</Option>
            <Option value="CONTENT">内容</Option>
            <Option value="IMAGE">图片</Option>
            <Option value="VIDEO">视频</Option>
            <Option value="AUDIO">音频</Option>
          </Select>
        </FormItem>
        <FormItem class="item" label="平台：">
          <Select style="width:100px" v-model="conditionAilen.siteId">
            <Option value>全部</Option>
            <Option v-for="(item) in ailenSiteList" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <div class="mt10 submit">
          <Button type="primary" @click="getUnionList">搜索</Button>
        </div>
      </Form>
      <baseTable :configure="tableConfigAilen" @getList="getUnionList">
        <div class="tableOver">
          <Table
            border
            :columns="tableDataAilen.headList"
            :data="tableDataAilen.bodyList"
            @on-selection-change="selectionTableAilen"
            size="default"
            class="table"
          >
            <template slot-scope="{ row }" slot="title" class="clearfix">
              <div class="title fl">{{row.title}}</div>
              <i class="cloud-icon" v-if="row.images">&#xe6f8;</i>
              <i class="cloud-icon" v-if="row.video">&#xe6fa;</i>
              <i class="cloud-icon" v-if="row.audio">&#xe6fb;</i>
            </template>
            <template slot-scope="{ row }" slot="contentType">
              <div>{{getStatusTxt(row.contentType)}}</div>
            </template>
          </Table>
        </div>
      </baseTable>
    </Modal>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import dropCode from "@components/DropCode/DropCode.vue";
import auditProcess from "@components/auditProcess/auditProcess.vue";
import footerButtons from "@components/footerButtons/footerButtons.vue";
import { AppModule } from "@store/modules/app";
import {importExcelComplete} from '@util/comm';
import {
  getContentList,
  contentWithdraw,
  getContentAuditProcess,
  contentDelete,
  patchSubmit,
  transferSite,
  reportSite,
  getChannelList,
  getSiteUnionList,
  getUnionSiteList,
  getUnionList,
  getUnionData,
  getReportSiteList,
    postContentExcel
} from "@service/content";
import { updateStatus } from "@service/common";
import CONFIG from '@/util/config'
import { cookies } from '@util/util'
@Component({
  components: {
    baseTable,
    auditProcess,
    footerButtons,
    dropCode
  }
})
export default class Content extends Vue {
  // 获取vuex中的用户信息
  get userInfo() {
    return AppModule.userInfo;
  }
   // 权限列表
  get operates() {
    return AppModule.operates;
  }
  get siteInfo () {
    return AppModule.siteInfo
  }
  private spinShow = false
  // outExcelApi
    private outExcelApi: string = CONFIG.defaultUrl + '/res/site/content/exportExcel?token=' + cookies.get(`${process.env.VUE_APP_STATUS}_TOKEN`)
  // 日期时间限制
  private options: any = {
    disabledDate(date: any) {
      const disabledDay = date.getDate();
      // 限制可选的开始日期及结束日期
      let b =
        date.getTime() < new Date("2018-12-31").getTime() ||
        (date && date.valueOf() > Date.now());
      return b;
    }
  };
  private tableData: any = {
    headList: [
      {
        type: "selection",
        width: 60,
        align: "center",
        fixed:'left',
      },
      {
        title: "标题",
        key: "title",
        width: 300,
        slot: "title",
        fixed:'left',
      },
      {
        title: "栏目",
        key: "channelName",
        align: "center",
        width: 150
      },
      {
        title: "创建者",
        key: "createCompany",
        align: "center",
        width: 150
      },
      {
        title: "类型",
        key: "contentType",
        slot: "contentType",
        align: "center",
        width: 90
      },
      {
        title: "发布时间",
        key: "publishTime",
        // width: 100,
        align: "center",
        width:150,
      },
      {
        title: "浏览量",
        slot: 'showNum',
        align: 'center',
        width: 100
      },
      {
        title: "排序",
        key: "sort",
        width: 100,
        slot: "sort",
        align: "center"
      },
      {
        title: "状态",
        key: "status",
        slot: "status",
        align: "center",
        width: 130,
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        slot: "action",
        width: 168
      }
    ],
    headListCompany: [
      {
        type: "selection",
        width: 60,
        align: "center",
        fixed: 'left',
      },
      {
        title: "标题",
        key: "title",
        width: 300,
        slot: "title",
        fixed: 'left',
      },
      {
        title: "栏目",
        key: "channelName",
        align: "center",
        width: 150
      },
      {
        title: "创建者",
        key: "createCompany",
        align: "center",
        width: 150
      },
      {
        title: "类型",
        key: "contentType",
        slot: "contentType",
        align: "center",
        width: 90
      },
      {
        title: "发布时间",
        key: "publishTime",
        width: 150,
        align: "center"
      },
      {
        title: "待办人",
        key: "backlogName",
        slot: "backlogName",
        align: "center",
        width: 100
      },
      {
        title: "浏览量",
        slot: 'showNum',
        align: 'center',
        width: 100
      },
      {
        title: "状态",
        key: "status",
        slot: "status",
        align: "center",
        width: 130
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        slot: "action",
        width: 168
      }
    ],
    bodyList: []
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
  private condition: any = {
    channelId: "",
    title: "",
    createCompany: "",
    contentType: "",
    status: "",
    startDate: "",
    endDate: ""
  };
  getH5DetailRoute (contentType:string) {
    let path = 'news-detail'
    if (contentType === 'IMAGE') {
      path = 'swiper-detail'
    }
    return path;
  };
  onSelectValueChange () {
    this.handleSubmit();
  }
  mounted() {
    // 企业端改变表格
    if(this.$store.state.app.userInfo.dataType == 'COMPANY'){
      this.tableData.headList = this.tableData.headListCompany
    }
    this.getList();
    // 树结构节点变更时
    this.bus.$on("changeTreeId", (data: Array<any>) => {
      if (data.length > 0) {
        this.condition.channelId = data[0].id;
      } else {
          this.condition.channelId = '';
      }
        this.tableConfig.page.currPage = 1;
        this.getList();
    });
  }
  /* S 导入 */
  private acceptExcel (e:any) {
      let _this = this
      let files = e.target.files;
      let formData = new FormData();
      formData.append("file", files[0]);
      formData.append('token', this.$store.state.app.token)
      this.spinShow = true
      postContentExcel(formData).then((blob:any) => {
        _this.spinShow = false
        // importExcelComplete(blob, function () {
        //   _this.$Message.success('导入成功');
        //   _this.tableConfig.page.currPage = 1;
        //   _this.getList();
        // })
          importExcelComplete(blob).then(res => {
              this.$Message.success('导入成功');
          }).finally(() => {
              _this.tableConfig.page.currPage = 1;
              _this.getList();
          })
      })
  }
  /* E 导入 */

  /* S 导出 */
  private outExcel () {
      if (this.getSelectIds()) {
        let a = document.createElement('a')
        let div = document.createElement('div');
        a.appendChild(div);
        a.style.display = 'none';
        (window.document as any).querySelector('body').appendChild(a);
        a.href = this.outExcelApi + '&ids=' + this.getSelectIds()
        div.click()
      } else {
        this.$Message.info('请先勾选数据！')
      }
  }
    /* E 导出 */

  /* S 排序 */
  private order: boolean = false; // 是否开启排序功能
  private changeOrder(b: boolean) {
    this.order = b;
  }
  // 修改排序行的数据
  private orderRowData:object = {}
  private changeSort(row: any) {
    this.orderRowData = row;
  }
  /* E 排序 */
  //   搜索查询
  private handleSubmit() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  private loading = true;

  // 获取列表数据的方法
  private getList(page: any = this.tableConfig.page) {
    if(Object.keys(page).includes('pageSize') && !page.pageSize) {
      return false
    }
    this.loading = true;
    Object.assign(this.condition, page);
    let currChannelId = this.condition.channelId
    getContentList(this.condition).then((res: any) => {
      if (res.code === 0 && currChannelId === this.condition.channelId) {
        this.tableData.bodyList = res.datas || [];
        this.tableConfig.page = res.page;
      }
    }).finally(() => this.loading = false);
  }
  // 日期选择
  private selectDate(date: Array<string>) {
    if (date.length > 1) {
      this.condition.startDate = date[0] || "";
      this.condition.endDate = date[1] || "";
    }
  }
  // 根据code获取状态描述
  private getStatusTxt(code: any) {
    switch (code) {
      case 1:
        return "正常";
      case 2:
        return "禁用";
      case 3:
        return "草稿";
      case 4:
        return "待审核";
      case 5:
        return "审核中";
      case 6:
        return "审核通过";
      case 7:
        return "回退";
      case 8:
        return "撤回";
      case 9:
        return "终止";
      case "CONTENT":
        return "内容";
      case "IMAGE":
        return "图片";
      case "VIDEO":
        return "视频";
      case "AUDIO":
        return "音频";
    }
  }
  //   数据状态值切换
  private changeStatus(row: any, title: string) {
    let _this = this;
    let config: any = {
      title: "操作提示",
      content: "确认是否" + title + "？",
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        _this.updateStatus(row);
      }
    };
    this.$Modal.confirm(config);
  }
  //   数据启用、禁用
  private updateStatus(row: any) {
    let status = 2;
    if (row.status === 2) {
      status = 1;
    }
    let param = {
      id: row.id,
      status: status,
      resourceType: "CONTENT"
    };
    updateStatus(param).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("更改状态成功!");
        this.getList();
      }
    });
  }
  // 列表操作 - 编辑
  private routeUpdate(row: any) {
    let path = ''
    switch (row.contentType){
      case 'CONTENT':{
        path = '/con-edit-content'
      };break;
      case 'IMAGE':{
        path = '/con-edit-image'
      };break;
      case 'VIDEO':{
        path = '/con-edit-video'
      };break;
      case 'AUDIO':{
        path = '/con-edit-audio'
      };break;
    }
    this.$router.push({path:path,query:{id:row.id}})
  }
  // 列表操作-撤回
  private contentWithdraw(row: any) {
    let _this = this;
    let config: any = {
      title: "操作提示",
      okText: "确认撤回",
      cancelText: "取消",
      onOk: () => {
        contentWithdraw({ id: row.id }).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("撤回成功");
            _this.getList();
          }
        });
      },
      render: (h: any, params: any) => {
        return h("p", "是否要撤回流程？");
      }
    };
    this.$Modal.confirm(config);
  }
  // 列表操作-删除
  private contentDelete(row: any) {
    let _this = this;
    let config: any = {
      title: "操作提示",
      okText: "确认删除",
      cancelText: "取消",
      onOk: () => {
        contentDelete({ ids: row.id }).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("删除成功");
            _this.getList();
            _this.bus.$emit("changeChannel"); // 改变栏目中各对应数据
          }
        });
      },
      render: (h: any, params: any) => {
        return h("p", "是否要删除数据？");
      }
    };
    this.$Modal.confirm(config);
  }
  // 列表操作-提交
  private dataSubmit(row: any) {
    let _this = this;
    patchSubmit({ids:row.id}).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("提交成功");
            _this.getList();
          }
        });
  }
  // 获取审核流程信息
  private modal: boolean = false;
  private processData: any = {};
  private getContentAuditProcess(row: any) {
    this.modal = true;
    getContentAuditProcess({ id: row.id }).then((res: any) => {
      this.processData = res.data;
    });
  }

  // 底部操作栏
  /* S 批量删除 */
  private selectionList: Array<any> = [];
  private getSelectIds() {
    // 获取表格选中的数据的 ids
    let ids = "";
    this.selectionList.forEach((item: any) => {
      ids += item.id + ",";
    });
    ids = ids.substr(0, ids.length - 1);
    return ids;
  }
  //   列表选择项数据变化
  private selectionTable(data: any) {
    this.selectionList = data;
  }
  private patchDelete() {
    let _this = this;
    let config: any = {
      title: "操作提示",
      okText: "确认删除",
      cancelText: "取消",
      onOk: () => {
        contentDelete({ ids: _this.getSelectIds() }).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("删除成功");
            _this.getList();
            _this.bus.$emit("changeChannel"); // 改变栏目中各对应数据
          }
        });
      },
      render: (h: any, params: any) => {
        let str = '是否要删除[' + _this.selectionList[0].title + ']？';
        if(_this.selectionList.length > 1){
          str = "是否要删除选中的" + _this.selectionList.length + "条数据？"
        }
        return h(
          "p",
          str
        );
      }
    };
    if (_this.selectionList.length > 0) {
      this.$Modal.confirm(config);
    } else {
      _this.$Message.error( "请先选择需要删除的数据");
    }
  }
  /* E 批量删除 */

  // 批量提交
  private patchSubmit() {
    let params = {
      ids: this.getSelectIds()
    };
    let _this = this;
    let config: any = {
      title: "操作提示",
      okText: "确认提交",
      cancelText: "取消",
      onOk: () => {
        patchSubmit(params).then((res: any) => {
          if (res.code === 0) {
            _this.$Message.success("提交成功");
            _this.getList();
          }
        });
      },
      render: (h: any, params: any) => {
        let str = '是否要提交[' + _this.selectionList[0].title + ']？';
        if(_this.selectionList.length > 1){
          str = "是否要提交选中的" + _this.selectionList.length + "条数据？"
        }
        return h(
          "p",
          str
        );
      }
    };
    if (_this.selectionList.length > 0) {
      this.$Modal.confirm(config);
    } else {
      _this.$Notice.error({
        title: "请先选择需要提交的数据"
      });
    }
  }
  /* S 上报 */
  private report: boolean = false; // 上报弹窗
  private reportSiteID: any = ""; // 选择的上报站点
  private reportList: Array<any> = []; // 可上报的站点列表
  private reportSite() {
    if (!this.reportList.length) this.getReportSiteList();
    if (this.selectionList.length > 0) {
        this.report = true;
    } else {
        this.$Message.error("请先选择需要上报的数据");
    }
  }
  // 获取上报站点下拉框数据
  private getReportSiteList(){
    getReportSiteList().then((res:any)=>{
      if(res.code===0){
        this.reportList = res.datas
      }
    })
  }
  // 确认上报站点
  private sureReport() {
    let params = {
      ids: this.getSelectIds(),
      siteId: this.reportSiteID
    };
    reportSite(params).then((res: any) => {
      if (res.code === 0) {
        if (res.datas.length === 0) {
          this.$Notice.success({
            title: "提示信息",
            desc: "上报成功，请耐心等待审核！上报内容可在上报管理里查看！"
          });
        } else {
          if(this.selectionList.length === res.datas.length){
            this.$Notice.error({
              title: res.datas.length+"条非正常数据，无法上报",
              desc: res.datas.join(" | ")
            });
          }else {
            let len = this.selectionList.length - res.datas.length;
            this.$Notice.error({
              title: len + "条上报成功！"+res.datas.length+"条非正常数据，无法上报",
              desc: res.datas.join(" | ")
            });
          }
        }
        this.getList();
      }
    });
  }
  /* E 上报 */

  /* S 转移 */
  private transfer: boolean = false; // 转移弹窗
  private transferSiteData: any = {}; // 选择的转移站点
  private changeChannel(data: any) {
    // 改变选择转移的站点
    this.transferSiteData = data[0];
  }
  private transferList: Array<any> = []; // 可转移的站点列表
  private transferSite() {
    // 转移站点确认
    let _this = this;
    let config: any = {
      title: "操作提示",
      okText: "确认转移",
      cancelText: "取消",
      onOk: () => {
        _this.transfer = true;
        getChannelList().then((res: any) => {
          this.transferList = this.anasysData(res.datas || []);
        });
      },
      render: (h: any, params: any) => {
        return h(
          "p",
          "是否要转移选中的" + _this.selectionList.length + "条数据？"
        );
      }
    };
    if (_this.selectionList.length > 0) {
      this.$Modal.confirm(config);
    } else {
      _this.$Message.error("请先选择需要转移的数据");
    }
  }
  // 确认转移站点
  private sureTransfer() {
    let params = {
      ids: this.getSelectIds(),
      channelId: this.transferSiteData.id
    };
    transferSite(params).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("转移成功");
        this.getList();
        this.bus.$emit("changeChannel"); // 改变栏目中各对应数据
      }
    });
  }
  //   递归解析数据为 iview树需要的结构
  private anasysData(data: Array<any>) {
    let _this = this;
    if (data.length > 0) {
      let treeData: any = [];
      data.forEach((top: any) => {
        treeData.push({
          expand: true,
          id: top.id,
          title: top.name + "(" + top.num + ")",
          children: _this.anasysData(top.subset)
        });
      });
      return treeData;
    } else {
      return [];
    }
  }
  /* E 转移 */

  /* S 云联盟 */
  private cloudAilen: boolean = false; // 弹窗参数
  private tableDataAilen: any = {
    headList: [
      {
        type: "selection",
        width: 60,
        align: "center"
      },
      {
        title: "标题",
        key: "title",
        width: 200,
        slot: "title"
      },
      {
        title: "创建者",
        key: "createCompany",
        align: "center"
      },
      {
        title: "类型",
        key: "contentType",
        slot: "contentType",
        align: "center"
      },
      {
        title: "发布时间",
        key: "publishTime",
        width: 150,
        align: "center"
      },
      {
        title: "来源平台",
        key: "siteName",
        align: "center"
      }
    ],
    bodyList: []
  };
  //表格分页信息
  private tableConfigAilen: any = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 6
    },
    pagePosition: "right"
  };
  private conditionAilen: any = {
    siteUnionId: "",
    title: "",
    createCompany: "",
    contentType: "",
    siteId: ""
  };
  //   云联盟弹窗列表选择项数据变化
  private selectionListAilen: Array<any> = [];
  private selectionTableAilen(data: any) {
    this.selectionListAilen = data;
  }
  // 获取列表数据的方法
  private loadingAilen: boolean = false;
  private getUnionList(page: any = this.tableConfigAilen.page) {
    this.loadingAilen = true;
    Object.assign(this.conditionAilen, page);
    getUnionList(this.conditionAilen).then((res: any) => {
      if (res.code === 0) {
        this.tableDataAilen.bodyList = res.datas;
        this.loadingAilen = false;
        this.tableConfigAilen.page = res.page;
      }
    });
  }
  private ailenList = []; // 已加入的联盟列表
  // 打开云联盟弹窗
  private showAilenDialog() {
    this.cloudAilen = true;
    this.getSiteUnionList();
  }
  // 获取已加入的联盟列表
  private getSiteUnionList() {
    getSiteUnionList().then((res: any) => {
      if (res.code === 0) {
        this.ailenList = res.datas;
        // 初始化时，若联盟列表不为空，则查询第一条数据
        if (res.datas.length > 0) {
          this.getUnionSiteList(res.datas[0].id);
          this.conditionAilen.siteUnionId = res.datas[0].id;
        }
        // 获取联盟数据后再查询联盟列表
        this.getUnionList();
      }
    });
  }
  // 联盟列表名称切换
  private AilenIndex:Number = 0;
  private clickAilen(id: Number,index: Number) {
    this.conditionAilen.siteUnionId = id;
    this.AilenIndex = index;
    this.getUnionList()
  }
  // 获取联盟站点列表
  private ailenSiteList = []; // 联盟站点列表
  private getUnionSiteList(id: Number) {
    getUnionSiteList({ unionId: id }).then((res: any) => {
      if (res.code === 0) {
        this.ailenSiteList = res.datas;
      }
    });
  }
  private transferAilen: boolean = false; // 拉取至栏目弹窗
  private transferSiteDataAilen: any = {}; // 选择的拉取至栏目站点
  private changeChannelAilen(data: any) {
    // 改变选择拉取至栏目的站点
    this.transferSiteDataAilen = data[0];
  }
  private transferListAilen: Array<any> = []; // 拉取至栏目的 数据列表
  // 云联盟列表 弹窗确认
  private ailenDialogSure() {
    let _this = this;
    if (_this.selectionListAilen.length > 0) {
      _this.transferAilen = true;
      getChannelList().then((res: any) => {
        this.transferListAilen = this.anasysData(res.datas || []);
      });
    } else {
      _this.$Message.error("请先选择需要拉取的数据");
    }
  }
  // 调用接口 拉取选中数据至对应栏目
  private sureTransferAilen() {
    let _this = this;
    let ids = "";
    this.selectionListAilen.forEach((item: any) => {
      ids += item.id + ",";
    });
    ids = ids.substr(0, ids.length - 1);
    getUnionData({ channelId: this.transferSiteDataAilen.id, ids: ids }).then(
      (res: any) => {
        if (res.code === 0) {
          _this.$Message.success("数据拉取成功");
          this.getList();
          this.bus.$emit("changeChannel"); // 改变栏目中各对应数据
        }
      }
    );
  }
  /** E 云联盟 */
}
</script>
<style scoped lang="scss">
    .upload-excel {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        opacity: 0;
    }

.inp-control {
  width: 70%;
}
.wrap {
  padding:15px;
  .serarch-box{
    background:$grayLight;
    margin-bottom:15px;
  }
  .item {
    margin: 15px 0;
  }
  .submit {
    display: inline-block;
    margin-left: 10px;
  }
}
.table {
  overflow:hidden;
  .titleIcon{
    color: $theme;
    position: relative;
    top: 10px;
    left: 5px;
  }
  .red {
    color: $danger;
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
  .title {
    display: inline-block;
    max-width: 75%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    line-height: 40px;
    vertical-align: middle;
  }
  .cloud-img {
    display: inline-block;
    width: 40px;
    height: 40px;
    vertical-align: middle;
    margin-left: 10px;
  }
  .action-btn {
    cursor: pointer;
    & + .action-btn {
      margin-left: 5px;
    }
  }
  .dropDiv-panel {
    border: 1px solid black;
  }
}
.btn-box {
  margin-top: 12px;
  display: flex;
  justify-content: center;
}
.msg-panel {
  padding: 10px 10px 15px;
  .msg-title {
    font-weight: 600;
  }
}

.cloudAilen {
  .ailenBox {
    overflow: auto;
    margin-bottom: 10px;
    li {
      display: inline-block;
      margin-right: 10px;
      padding: 5px 10px;
      color: $font01;
      border-radius: 3px;
      cursor: pointer;
      border: 1px solid $theme;
      &:hover,
      &.active {
        color: #fff;
        background-color: $theme;
      }
    }
  }
  .submit {
    display: inline;
  }
  .tableOver {
    max-height: 329px;
    overflow-y: auto;
    overflow-x: hidden;
    border-top: 1px solid $borderLight;
    border-bottom: 1px solid $borderLight;
    .table {
      margin-top: 0;
    }
  }
}
</style>
