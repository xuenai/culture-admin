<template>
  <div class="right-panel">
    <Form :label-width="80" inline class="form mt20" :model="params" :rules="ruleValidate">
      <FormItem class="item" label="名称">
        <i-input placeholder="传习基地名称/非遗项目名称" class="w300" v-model="params.name"
          @on-enter="() => search()"></i-input>
      </FormItem>
      <FormItem class="item" label="创建者">
        <Select @on-change="() => search()" v-model="params.createUser" filterable
          style="width: 250px">
          <Option value="-1">全部</Option>
          <Option v-for="(option) in siteList" :value="option.id" :key="option.id">{{option.name}}
          </Option>
        </Select>
      </FormItem>
      <FormItem class="item" label="级别">
        <Select @on-change="() => search()" v-model="params.level" style="width:250px;">
          <Option value="-1">全部</Option>
          <Option :value="level.id" v-for="level in levels" :key="level.id">{{ level.name }}
          </Option>
        </Select>
      </FormItem>
      <FormItem class="item" label="状态">
        <Select class="w300" v-model="params.status" @on-change="() => search()">
          <Option value="-1">全部</Option>
          <Option v-for="(name, key) in AUDIT_DATA_STATUS" :value="key" :key="key">{{ name }}
          </Option>
        </Select>
      </FormItem>
      <FormItem class="item" label="提交时间">
        <Date-picker class="w300" type="daterange" placeholder="请选择提交时间"
          @on-change="list => {params.startTime = list[0];params.endTime = list[1]; search();}">
        </Date-picker>
        <Button type="primary" class="ml20" @click="() => search()">搜索</Button>
        <Button type="primary" class="ml20"
          @click="$router.push({path:'/inherit-add'})">添加</Button>
      </FormItem>
    </Form>

    <BaseTable :configure="tableConfig" @getList="search">
      <Table border :columns="tableData.headList" :data="tableData.bodyList" size="default"
        class="table" :loading="loading" ref="selection"
        @on-selection-change="list => checkedBox = list">
        <template slot-scope="{ row }" slot="info">
          <div class="title">
            <router-link :to="{path:'/inherit-detail/' + row.id}" class="action-btn hot line6"
              :title="row.name">
              <span v-if="row.top">[置顶]</span>
              <span v-if="row.recommendHomePage||row.recommendChannelHomePage">[推荐]</span>{{row.name}}</router-link>
            <p><i class="cloud-icon">&#xe606;</i> {{row.regionName}}</p>
          </div>
        </template>

        <template slot-scope="{ row }" slot="heritageItem">
          <div class="title line6" :title="row.heritageItem">{{ row.heritageItem }}</div>
        </template>
        
        <template slot-scope="{ row }" slot="sort">
          <InputNumber :precision="0" v-if="sort" :min="1" :max="999" v-model="row.sort" @on-change="() => { data.list[row._index].sort = row.sort }">
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
          <dropCode v-if="[1,2].includes(row.status)" class="action-btn" :id="'qrcode' + row.id"
            :key="'qrcode' + row.id"
            :value="$store.state.app.userInfo.h5Domain+'/#/inherit-desc/' +row.id">
            <span class="theme-blue action-btn">预览</span>
          </dropCode>
          <a href="javascript:;" v-if="row.status === 3" class="theme-blue"
            @click="submitIds(row.id)">提交</a>
          <a href="javascript:;" v-if="![4,5].includes(row.status)" class="theme-blue" @click="deleteIds(row.id)">删除</a>
          <router-link v-if="![4,5,9].includes(row.status) && row.showProcess === 1" :to="{path:'/inherit-add', query: {id: row.id,saveType: 'list'}}" class="theme-blue">修改
          </router-link>
          <a href="javascript:;" v-if="row.status === 4" class="theme-blue"
            @click="setWithdraw(row)">撤回</a>
        </template>
      </Table>
    </BaseTable>

    <FooterButtons :selectionList="checkedBox" :AllList="tableData.bodyList"
      @changeOrder="b => sort = b" @finish="() => search({})" class="operate"
      resourceType="CONTENT_TYPE_HERITAGE_TEACHING_BASE">
      <Button type="primary" :disabled="sort" class="ml10"
        @click="deleteIds(checkedBox)">批量删除</Button>
      <Button type="primary" :disabled="sort" class="ml10"
        @click="submitIds(checkedBox)">批量提交</Button>
      <Button class="ml10" :disabled="sort" @click="outExcel">导出</Button>
      <Button class="ml10 accept-excel" :disabled="sort" :loading="excelLoading"><input
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          type="file" @change="acceptExcel($event)" />导入</Button>
    </FooterButtons>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BaseTable from "@components/baseTable/baseTable.vue";
import dropCode from "@components/DropCode/DropCode.vue";
import FooterButtons from "@components/footerButtons/operate-button.vue";
import { AppModule } from "@store/modules/app";
import CONFIG from "@/util/config";
import { createrList } from "@service/content";
import { updateStatus, dictType } from "@service/common";
import {
  ctcHeritageTeachingBaseImport,
  getHeritageTeachingBaseList,
  teachWithdraw
} from "@service/activity";
import { deleteCol, submitBatchById } from "@service/place";
import { exportExcel, getStatusTxt, importExcelComplete } from "@util/comm";
import { AUDIT_DATA_STATUS } from "@constant/index";

@Component({
  components: {
    BaseTable,
    dropCode,
    FooterButtons
  }
})
export default class volAuditList extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  // 创建者下拉匹配框数据
  private siteList: Array<object> = [];
  private getcreaterList() {
    createrList().then((res: any) => {
      if (res.code === 0) {
        this.siteList = res.datas;
      }
    });
  }
  beforeRouteLeave (to:any, from:any, next: Function) {
    if ( /(\/inherit-detail\/\d+)|(\/inherit-add)/.test(to.path) ) {
      to.meta.menu = '/inherit-list'
    }
    next()
  }
  private getStatusTxt: any = getStatusTxt;
  private AUDIT_DATA_STATUS: any = AUDIT_DATA_STATUS;
  private levels: any[] = [];
  private getDictType(type: string) {
    return dictType({ type }).then((res: any) => {
      if (res.code === 0) {
        return res.datas;
      } else {
        return [];
      }
    });
  }
  // 是否开启排序功能
  private sort: boolean = false;
  private excelLoading: boolean = false;
  private acceptExcel(e: any) {
    let files = e.target.files;
    this.excelLoading = true;
    let formData = new FormData();
    formData.append("file", files[0]);
    formData.append("token", this.token);
    ctcHeritageTeachingBaseImport(formData)
      .then((blob: any) => {
        importExcelComplete(blob)
          .then(res => {
            this.$Message.success("导入成功");
          })
          .catch(res => {
            this.$Message.error(res.message);
          });
      })
      .catch(() => this.$Message.error("导入失败"))
      .finally(() => {
        e.target.value = null;
        this.excelLoading = false;
      });
  }
  // 参数对象
  private params = <any>{
    currPage: 1,
    pageSize: 10,
    createUser: "-1",
    level: "-1",
    status: "-1",
    name: "",
    startTime: "",
    endTime: ""
  };
  // 验证
  private ruleValidate = <any>{
    /*name: [
                {required: true, message: '名称不能为空', trigger: 'blur'},
                {type:'string',max: 100,message:'最多输入100个字符'}
            ],
            region: [
                {required: true, message: '请选择所在地区', trigger: 'change'}
            ],
            address: [
                {required: true, message: '详细地址不能为空', trigger: 'blur'},
                {type:'string',max:100, message:'最多输入100个字符'}
            ],
            joinStatus: [
                {required: true, message: '请选择是否允许志愿者加入', trigger: 'blur'}
            ]*/
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
        type: "selection",
        width: 60,
        align: "center"
      },
      {
        title: "名称",
        align: "left",
        width: 400,
        slot: "info"
      },
      {
        title: "创建者",
        key: "createCompanyName",
        align: "center"
      },
      {
        title: "责任单位",
        key: "reportCompany",
        align: "center"
      },  
      {
        title: "非遗项目",
        key: "heritageItem",
        slot: "heritageItem",
        width: 300,
        align: "center"
      },
      {
        title: "提交时间",
        key: "createTime",
        align: "center"
      },
      {
        title: "排序",
        align: "center",
        slot: "sort"
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
  };
  //
  private loading = true;
  // 选中数据
  private checkedBox: Array<any> = [];
  // 导出
  private outExcelApi: string =
    CONFIG.defaultUrl + "/res/site/ctcHeritageTeachingBase/exportExcel?";

  created() {
    if (AppModule.userInfo.dataType !== 'SITE') {
      this.tableData.headList = this.tableData.headList.filter((d:any) => d.slot !== 'sort')
    }
    this.getcreaterList();
    this.getDictType("HERITAGE_LEVEL").then(
      (datas: any) => (this.levels = datas)
    );
    this.search();
  }

  // 撤回
  setWithdraw(item: any) {
    let config: any = {
      title: "操作提示",
      content: `确认要撤回${item.name}？`,
      okText: "确认撤回",
      cancelText: "取消",
      onOk: () => {
        teachWithdraw({
          id: item.id
        }).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("操作成功");
            this.search(this.tableConfig.page);
            this.loading = false
          }
        });
      }
    };
    this.$Modal.confirm(config);
  }

  // 删除
  private deleteIds(ids: any | Array<any>) {
    if (!/^\d+$/.test(String(ids))) {
      // 传递的数组
      if (!ids.length) {
        this.$Message.info("请选择要删除的数据！");
        return;
      }
      ids = ids.map((item: any) => item.id).toString();
    }
    let config = <any>{
      title: "操作提示",
      okText: "确认删除",
      cancelText: "取消",
      onOk: () => {
        deleteCol({ ids, type: this.type }).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("删除成功！");
            this.search();
          }
        });
      },
      render: (h: any, params: any) => {
        return h("p", `是否要删除？`);
      }
    }
    this.$Modal.confirm(config)
  }

  private type: string = "CONTENT_TYPE_HERITAGE_TEACHING_BASE";
  // 提交
  private submitIds(ids: any | Array<any>) {
    if (!/^\d+$/.test(String(ids))) {
      // 传递的数组
      if (!ids.length) {
        this.$Message.info("请选择要提交的数据！");
        return;
      }
      ids = ids.map((item: any) => item.id).toString();
    }
    let config: any = {
      title: "操作提示",
      okText: "确认提交",
      cancelText: "取消",
      onOk: () => {
        submitBatchById({ ids, type: this.type }).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("提交成功！");
            this.search();
          }
        });
      },
      render: (h: any, params: any) => {
        return h("p", `是否要提交？`);
      }
    };
    this.$Modal.confirm(config);
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
      resourceType: this.type
    }).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("更改状态成功!");
        this.search();
        this.loading = false;
      }
    });
  }

  private search(page?: any) {
    this.loading = true;
    if (page) {
      Object.assign(this.params, page);
    } else {
      this.params.currPage = 1;
    }
    let params = { ...this.params };
    if (params.createUser === "-1") delete params.createUser;
    if (params.level === "-1") delete params.level;
    if (params.status === "-1") delete params.status;
    getHeritageTeachingBaseList(params)
      .then((data: any) => {
        if (data.code === 0) {
          this.tableConfig.page = data.page;
        }
        this.tableData.bodyList = data.datas;
      })
      .catch(() => {
        this.tableData.bodyList = [];
      })
      .finally(() => {
        this.loading = false;
        this.checkedBox = [];
      });
  }

  //获取token
  get token() {
    return AppModule.token;
  }

  // 导出点击
  private outExcel() {
    if (!this.checkedBox.length) {
      this.$Message.info("请选择需要导出的数据！");
    } else {
      exportExcel(
        this.outExcelApi +
          "token=" +
          this.token +
          "&ids=" +
          this.checkedBox.map((item: any) => item.id)
      );
    }
  }
}
</script>

<style scoped lang="scss">
.hot {
span {
    color: $danger;
}
}
.btn-box {
  text-align: center;
}
.accept-excel {
  position: relative;
  input {
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
    left: 0;
    top: 0;
  }
}

.w200 {
  width: 200px;
}

.w300 {
  width: 300px;
}

.w150 {
  width: 150px;
}

.title {
  margin: 5px 0;
  p {
    margin-top: 3px;
  }
  i {
    color: #4fa6f3;
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

.theme-blue {
  margin-left: 5px;
}

.describe {
  width: 400px;
  height: 150px;
  text-align: center;
  overflow: hidden;
  padding: 20px 15px;
  .item {
    width: 30%;
    display: inline-block;
    line-height: 50px;
    border: 1px solid #e2e2e2;
    border-radius: 3px;
    height: 50px;
    font-size: 14px;
    cursor: pointer;
    &:first-child {
      margin-right: 20px;
    }
    &:hover,
    &.active {
      color: $theme;
      border-color: $theme;
    }
  }
  .mt20 {
    text-align: left;
    margin-left: calc(20% - 10px);
  }
}

.right-panel {
  padding: 0 15px;
  overflow: hidden;
  .form {
    background: $grayLight;
    margin-bottom: 15px;
    padding-top: 15px;
  }
}

.wrap {
  padding-bottom: 20px;
}

.topic-msg {
  display: flex;
  padding: 8px 0;
  .msg-panel {
    flex: 1;
    overflow: hidden;
    text-align: left;
  }
  .topic-name {
    margin-top: 7px;
    text-align: left;
  }
  .topicTag {
    display: inline-block;
  }
  .date {
    margin-top: 7px;
    white-space: normal;
  }
}

.reply {
  margin-bottom: 8px;
  padding: 8px 10px;
  text-align: left;
  font-size: 12px;
  line-height: 18px;
  color: #333;
  background: #f7f7f7;
  span {
    color: $theme;
  }
}

.red {
  padding-right: 5px;
}
</style>
