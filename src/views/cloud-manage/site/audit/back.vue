<!--
 * @Author: 任智勇
 * @since: 2019-05-30 11:48:33
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-22 10:52:09
 -->
<template>
  <div class="audit-box">
    <div class="condition">
      <Form class="form" ref="formInline" inline :label-width="60">
        <FormItem class="formItem" label="名称">
          <Input type="text" v-model.trim="condition.keyword" :maxlength="20" placeholder="站点名称"/>
        </FormItem>
        <FormItem class="formItem" label="账号">
          <Input type="text" v-model.trim="condition.phone" :maxlength="20" placeholder="站长手机号"/>
        </FormItem>
        <FormItem class="formItem" label="申请时间" prop="time">
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
        <FormItem class="formItem select" label="站点类型" prop="siteType">
          <Select v-model="condition.siteType">
            <Option value selected>全部</Option>
            <Option value="GOVERNMENT">政府</Option>
            <Option value="SCENIC">景区</Option>
          </Select>
        </FormItem>
        <FormItem class="formItem" label="所属地区" prop="region">
          <distPicker :default="regionPath" @onChange="getRegion"></distPicker>
          <!--<v-distpicker @province="distPicker" @city="distPicker" @area="distPicker"></v-distpicker>-->
        </FormItem>
        <FormItem class="formItem">
          <Button type="primary" @click="handleSubmit">搜索</Button>
        </FormItem>
      </Form>
      <baseTable class="table" :configure="tableConfig" @getList="getList">
        <Table border :columns="data.header" :loading="loading" :data="data.list" ref="table">
          <template slot-scope="{ row }" slot="keyword">
            <i class="auditIcon" @click="siteInfo(row)">{{row.name}}</i>
          </template>
          <template slot-scope="{ row }" slot="siteType">
            <i>{{getSiteTypeName(row.siteType)}}</i>
          </template>
        </Table>
      </baseTable>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
// import VDistpicker from "v-distpicker";
import distPicker from "@components/distPicker/VD-distPicker.vue";
import { getSiteAuditList } from "@service/cloud-manage";

@Component({ components: { baseTable, distPicker } })
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
        title: "类型",
        key: "siteType",
        align: "center",
        slot: "siteType"
      },
      {
        title: "所属行政区域",
        key: "regionName",
        align: "center"
      },
      {
        title: "申请时间",
        key: "createTime",
        align: "center"
      },
      {
        title: "驳回时间",
        key: "updateTime",
        align: "center"
      },
      {
        title: "驳回人",
        key: "rejectName",
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
    status:7,
    region: ""
  };
  mounted() {
    this.bus.$on("onChangeBackList", () => {
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
    // this.bus.$emit("onChangeAuditList");
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
            h("p", "企业名称：" + row.companyName),
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
    padding: 20px;
    background-color: $grayLight;
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

