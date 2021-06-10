<!--
 * @Author: 任智勇
 * @since: 2019-05-30 11:48:33
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-26 09:46:25
 -->
<template>
  <div class="audit-box">
    <div class="condition">
      <Form class="form" ref="formInline" inline :label-width="80">
        <FormItem class="formItem" label="名称">
          <Input type="text" v-model.trim="condition.keyword" :maxlength="20" placeholder="站点名称"/>
        </FormItem>
        <FormItem class="formItem" label="站长手机号">
          <Input type="text" v-model.trim="condition.phone" :maxlength="20" placeholder="站长手机号"/>
        </FormItem>
        <FormItem class="formItem" label="开站时间">
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
        <FormItem class="formItem select" label="站点类别">
          <Select v-model="condition.siteType">
            <Option value="0" selected>全部</Option>
            <Option value="GOVERNMENT">政府</Option>
            <Option value="scenic">景区</Option>
          </Select>
        </FormItem>
        <FormItem class="formItem select" label="状态">
          <Select v-model="condition.status">
            <Option value selected>全部</Option>
            <Option value="1">启用</Option>
            <Option value="2">禁用</Option>
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
          <template slot-scope="{ row }" slot="name">
            <div class="siteInfoDiv">
              <div class="imgDiv" v-if="row.siteLogo">
                <img :src="row.siteLogo">
              </div>
              <div class="info">
                <h3>{{row.name}}</h3>
                <p>{{row.siteIntroduce}}</p>
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="siteType">
            <i>{{`${BASE[row.siteVersion]}（${BASE[row.siteLanguage]}）`}}</i>
          </template>
          <template slot-scope="{ row }" slot="orgType">
            <i>{{getSiteTypeName(row.siteType)}}</i>
          </template>
          <template slot-scope="{ row }" slot="status">
            <div v-if="row.status === 1">
              <span class="switchLabel">启用</span>
              <span class="switchBox" @click="changeStatus(row,'禁用')">
                <i-switch :value="row.status === 1"/>
                <span class="cover"></span>
              </span>
            </div>
            <div v-else>
              <span class="switchLabel">禁用</span>
              <span class="switchBox" @click="changeStatus(row,'启用')">
                <i-switch :value="row.status === 1"/>
                <span class="cover"></span>
              </span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="control">
            <i class="auditIcon" title="回访">回访</i>
            <i class="auditIcon" title="配置" @click="setOptions(row)">配置</i>
            <router-link :to="{path: '/role-edit', query: {id: row.siteUserRoleId, dataType: 'SITE'}}" tag="i" class="auditIcon" title="角色管理">角色管理</router-link>
            <dropCode
              :id="'qrcode' + row.id + '_' + Math.random().toString()"
              :value="row.h5Domain"
            >
              <i class="auditIcon" title="预览">预览</i>
            </dropCode>
          </template>
        </Table>
      </baseTable>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import dropCode from "@components/DropCode/DropCode.vue";
// import VDistpicker from "v-distpicker";
import distPicker from "@components/distPicker/VD-distPicker.vue";
import { getSiteAuditList, siteUpdateStatus } from "@service/cloud-manage";

@Component({ components: { baseTable, distPicker, dropCode } })
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
        width: 300,
        slot: "name"
      },
      {
        title: "站长手机号",
        key: "sitePhone",
        width:120,
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
        title: "开站时间",
        key: "createTime",
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
    status: "",
    region: ""
  };
  mounted() {
    this.getList();
  }
  // 日期选择
  private selectDate(date: Array<string>) {
    if (date.length > 1) {
      this.condition.startTime = date[0] || "";
      this.condition.endTime = date[1] || "";
    }
  }
  // // 地区编码变化
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
  }
  //   数据状态值切换
  private changeStatus(row: any, txt: string) {
    let _this = this;
    let config: any = {
      title: "操作提示",
      okText: "取消",
      cancelText: "确认" + txt,
      onOk: () => {
        _this.$Modal.remove();
      },
      onCancel: () => {
        if (row.status === 1) {
          _this.closeSite(row);
        } else {
          _this.openSite(row);
        }
      },
      render: (h: any, params: any) => {
        let tip = "是否确定开启站点？";
        let classStr = "dialogP-1559269212750";
        if (row.status === 1) {
          tip =
            "你正在进行【关站】操作，一但关站用户端将不能正常访问。你确认要关站吗？";
          classStr += " red";
        }
        return h(
          "p",
          {
            attrs: {
              class: classStr
            }
          },
          tip
        );
      }
    };
    this.$Modal.confirm(config);
  }
  // 匹配站点类型
  private getSiteTypeName(code: string) {
    if (code === "scenic") {
      return "景区";
    } else {
      return "政府";
    }
  }
  //   禁用站点
  private closeSite(row: any) {
    let param = { ids: row.id, status: 2 };
    siteUpdateStatus(param).then((res: any) => {
      this.$Message.success(`禁用成功`);
      this.getList();
    });
  }
  //   启用站点
  private openSite(row: any) {
    let param = { ids: row.id, status: 1 };
    siteUpdateStatus(param).then((res: any) => {
      this.$Message.success(`启用成功`);
      this.getList();
    });
  }
  // 配置
  private setOptions(row: any) {
    this.$router.push({ path: "/cloud-site-edit", query: { id: row.id } });
  }
}
</script>

<style lang='scss' scoped>
.audit-box {
  min-height: 500px;
  height: 100%;
  .condition {
    padding: 15px;
    .form{
      padding: 15px 0 5px;
      background-color: $grayLight;
    }
    .select {
      width: 200px;
    }
  }
  .table {
    margin-top: 15px;
    min-height: 500px;
    .auditIcon {
      cursor: pointer;
      color: $theme;
      margin-right: 5px;
    }
    .siteInfoDiv {
      display: flex;
      margin: 5px 0;
      .imgDiv {
        width: 50px;
        height: 50px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        display: flex;
        flex: 1;
        margin-left: 5px;
        justify-content: center;
        flex-direction: column;
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
.dialogP-1559269212750 {
  font-size: 14px;
  &.red {
    color: $theColor1;
  }
}
</style>

