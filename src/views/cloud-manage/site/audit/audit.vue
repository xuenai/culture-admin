<!--
 * @Author: 任智勇
 * @since: 2019-05-30 11:48:33
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-26 09:33:41
 -->
<template>
  <div class="audit-box">
    <div class="condition">
      <Form class="form" ref="formInline" inline :label-width="80">
        <FormItem class="formItem" label="名称">
          <Input type="text" :maxlength="20" v-model.trim="condition.keyword" placeholder="站点名称"/>
        </FormItem>
        <FormItem class="formItem" label="站长手机号">
          <Input type="text" v-model.trim="condition.phone" :maxlength="20" placeholder="站长手机号"/>
        </FormItem>
        <FormItem class="formItem" label="申请时间">
          <DatePicker
            type="daterange"
            separator=" 至 "
            :options="options"
            @on-change="selectDate"
            placeholder="选择日期筛选"
            placement="bottom-end"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <FormItem class="formItem select" label="站点类型">
          <Select v-model="condition.siteType">
            <Option value selected>全部</Option>
            <Option value="GOVERNMENT">政府</Option>
            <Option value="SCENIC">景区</Option>
          </Select>
        </FormItem>
        <div>
          <FormItem class="formItem" label="所属地区">
            <distPicker :default="regionPath" @onChange="getRegion"></distPicker>
            <!--<v-distpicker @province="distPicker" @city="distPicker" @area="distPicker"></v-distpicker>-->
          </FormItem>
          <FormItem class="formItem">
            <Button type="primary" @click="handleSubmit">搜索</Button>
          </FormItem>
        </div>
      </Form>
      <baseTable class="table" :configure="tableConfig" @getList="getList">
        <Table border :columns="data.header" :loading="loading" :data="data.list" ref="table">
          <template slot-scope="{ row }" slot="keyword">
            <i class="auditIcon" @click="siteInfo(row)">{{row.name}}</i>
          </template>
          <template slot-scope="{ row }" slot="siteType">
            <i>{{`${BASE[row.siteVersion]}（${BASE[row.siteLanguage]}）`}}</i>
          </template>
          <template slot-scope="{ row }" slot="orgType">
            <i>{{getSiteTypeName(row.siteType)}}</i>
          </template>
          <template slot-scope="{ row }" slot="control">
            <i class="auditIcon" title="审核" @click="audit(row)">审核</i>
          </template>
        </Table>
      </baseTable>
    </div>
    <Modal footer-hide v-model="dialogConfig">
      <div class="dialogDiv-1559199991791">
        <p>站点名称：{{auditRow.name||''}}</p>
        <p>所属类别：{{getSiteTypeName(auditRow.siteType||'')}}</p>
        <p>所属站点类型：{{`${BASE[auditRow.siteVersion]}（${BASE[auditRow.siteLanguage]}）`}}</p>
        <p>所属行政区域：{{auditRow.regionName||''}}</p>
        <p>申请人主体手机号：{{auditRow.sitePhone||''}}</p>

        <h3>申请人信息</h3>
        <p>企业名称：{{auditRow.companyName||''}}</p>
        <p>联系人：{{auditRow.contact||''}}</p>
        <p>联系电话：{{auditRow.contactPhone||''}}</p>
        <p>联系邮箱：{{auditRow.email||''}}</p>
        <div class="btnBox">
          <Button type="primary" @click="onOk">通过</Button>
          <Button type="primary" @click="onCancel">驳回</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import Dialog from "@components/Dialog/Dialog.vue";
// import VDistpicker from "v-distpicker";
import distPicker from "@components/distPicker/VD-distPicker.vue";
import { getSiteAuditList, siteAudit } from "@service/cloud-manage";

@Component({ components: { baseTable, distPicker ,Dialog} })
export default class ComponentName extends Vue {
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
  private BASE: object = {
    AREA: "全域版",
    PLAIN: "普通版",
    CN: "中文",
    EN: "英文",
  }
  //   表格配置
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 6
    },
    pagePosition: "right"
  };
  private loading = true;
  private data: any = {
    header: [
      {
        title: "站点信息",
        key: "name",
        width: 400,
        slot: "keyword"
      },
      {
        title: "站长手机号",
        key: "sitePhone",
        align: "center"
      },

      {
        title: "站点类型",
        key: "siteType",
        align: "center",
        slot: "siteType"
      },
      {
        title: "类别",
        align: "center",
        slot: "orgType"
      },
      {
        title: "所属地区",
        key: "regionName",
        align: "center"
      },

      {
        title: "申请时间",
        key: "createTime",
        align: "center"
      },
      {
        title: "操作",
        key: "control",
        slot: "control",
        align: "center"
      }
    ],
    list: []
  };
  private condition: any = {
    phone: "",
    keyword: "",
    siteType: "",
    startTime: "",
    endTime: "",
    status:4,
    region: ""
  };
  mounted() {
    this.bus.$on("onChangeAuditList", () => {
      this.getList();
    });
    this.getList();
  }
  // 日期选择
  private selectDate(date: Array<string>) {
    if (date.length > 1) {
      this.condition.startTime = date[0] || "";
      this.condition.endTime = date[1] || "";
    }
  }
  // 地区编码变化
  // private distPicker(e: any) {
  //   if (e.code) {
  //     this.condition.region = e.code;
  //   }
  // }
    //地区编码
    private regionPath:string='';
    //获取地区region
    getRegion(data:any){
        (this.condition as any).region=data.region;
    }
  //   搜索查询
  private handleSubmit() {
    this.tableConfig.page.currPage = 1
    this.getList();
  }
  // 获取列表数据的方法
  private getList(page: any = this.tableConfig.page) {
    Object.assign(this.condition, page);
    getSiteAuditList(this.condition).then((res: any) => {
      if (res.code === 0) {
        this.data.list = res.datas;
        this.loading = false;
        this.tableConfig.page = res.page;
      }
    });
    this.$emit('onChange')
    // this.bus.$emit("onChangeBackList");
  }

  // 审核
  private dialogConfig = false;
  private auditRow:any = {
    name:'',
    siteType:'',
    regionName:'',
    sitePhone:'',
    companyName:'',
    contact:'',
    contactPhone:'',
    email:'',
  };
  private audit(row: any) {
    this.auditRow = row;
    this.dialogConfig = true;
  }
  //   审核通过
  private onOk() {
    let param = { ids: this.auditRow.id, status: 6 };
    this.dialogConfig = false;
    siteAudit(param).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("操作成功!");
        this.getList();
      }
    });
  }
  //   驳回
  private onCancel() {
    let param = { ids: this.auditRow.id, status: 7 };
    this.dialogConfig = false;
    siteAudit(param).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("操作成功!");
        this.getList();
      }
    });
  }
  // 匹配站点类型
  private getSiteTypeName(code: string) {
    if (code === "scenic") {
      return "景区";
    } else {
      return "政府";
    }
  }
  // 查看申请人详情
  private siteInfo(row: any) {
    let config: any = {
      title: "申请人详情",
      render: (h: any, params: any) => {
        return h(
          "div",
          {
            attrs: {
              class: "dialogDiv-1559199991791"
            }
          },
          [
            h("p", "企业名称：" + row.name),
            h("p", "联系人：" + row.contact),
            h("p", "联系电话：" + row.contactPhone),
            h("p", "联系邮箱：" + row.email)
          ]
        );
      }
    };
    this.$Modal.info(config);
  }
}
</script>

<style lang='scss' scoped>
.audit-box {
  background-color: $bg01;
  min-height: 500px;
  .condition {
    .form{
      padding: 15px 0 5px;
      background-color: $grayLight;
    }
    .select {
      width: 200px;
    }
  }
  .table {
    margin-top: 20px;
    .auditIcon {
      cursor: pointer;
      color: $theme;
    }
  }
  .formItem {
    margin-bottom: 10px;
  }
}
.btnBox{
  margin: 10px;
  display: flex;
  justify-content: center;
  >button{
    margin-left: 10px;
  }
}
</style>
<style lang="scss">
.distpicker-address-wrapper select {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  padding: 0 5px;
}
.dialogDiv-1559199991791 {
  font-size: 14px;
  p {
    min-height: 24px;
    line-height: 24px;
  }
  h3 {
    font-size: 16px;
    height: 50px;
    line-height: 70px;
    border-top: 1px solid $borderLight;
    margin-top: 20px;
  }
}
</style>

