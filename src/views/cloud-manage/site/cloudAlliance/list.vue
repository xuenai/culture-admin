<template>
  <div class="audit-box">
    <div class="condition">
      <Form class="form" ref="formInline" inline :label-width="60">
        <FormItem class="formItem" label="联盟名称">
          <Input type="text" v-model.trim="condition.keyword" placeholder="联盟名称" />
        </FormItem>
        <FormItem class="formItem" label="创建日期">
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
        <FormItem class="formItem select" label="状态">
          <Select v-model="condition.status">
            <Option value selected>全部</Option>
            <Option value="1">启用</Option>
            <Option value="2">禁用</Option>
          </Select>
        </FormItem>
        <FormItem class="formItem">
          <Button type="primary" class="submit" @click="handleSubmit">搜索</Button>
          <router-link tag="a" to="/cloud-alliance-edit" class="add">
            <Button type="primary">添加</Button>
          </router-link>
        </FormItem>
      </Form>
      <baseTable class="table" :configure="tableConfig" @getList="getList">
        <Table border :columns="data.header" :loading="loading" :data="data.list" ref="table">
          <template slot-scope="{ row }" slot="name">
            <div class="siteInfoDiv">
              <div class="imgDiv" :class="{'daq-no-photo': !row.unionLogo}">
                <img v-if="row.unionLogo" :src="row.unionLogo" />
              </div>
              <div class="info">
                <h3>{{row.name}}</h3>
                <p>{{row.unionRemark}}</p>
              </div>
            </div>
          </template>
          <template slot-scope="{ row }" slot="type">
            <span>{{`${BASE[row.siteVersion]}（${BASE[row.siteLanguage]}）`}}</span>
          </template>

          <template slot-scope="{ row }" slot="status">
            <div v-if="row.status === 1">
              <span class="switchLabel">正常</span>
              <span class="switchBox" @click="changeStatus(row,'禁用')">
                <i-switch :value="row.status === 1" />
                <span class="cover"></span>
              </span>
            </div>
            <div v-else>
              <span class="switchLabel">禁用</span>
              <span class="switchBox" @click="changeStatus(row,'启用')">
                <i-switch :value="row.status === 1" />
                <span class="cover"></span>
              </span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="control">
            <router-link :to="{path:'/cloud-alliance-edit',query:{id: row.id}}">
              <i class="edit" title="修改">修改</i>
            </router-link>
            <i class="delete" title="解散" @click="deleteAlliance(row)">解散</i>
          </template>
        </Table>
      </baseTable>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import {
  getUnionList,
  unionUpdateStatus,
  unionDelete
} from "@service/cloud-manage";

@Component({ components: { baseTable } })
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
        title: "联盟信息",
        key: "name",
        width: 500,
        slot: "name"
      },
      {
        title: "联盟类型",
        slot: "type"
      },
      {
        title: "成员数量",
        key: "siteCount",
        align: "center"
      },
      {
        title: "创建时间",
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
    name: "",
    status: "",
    startTime: "",
    endTime: ""
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

  //   搜索查询
  private handleSubmit() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  // 获取列表数据的方法
  private getList(page: any = this.tableConfig.page) {
    Object.assign(this.condition, page);
    getUnionList(this.condition).then((res: any) => {
      if (res.code === 0) {
        this.data.list = res.datas;
        this.loading = false;
        this.tableConfig.page = res.page;
      }
    });
  }
  //   解散联盟
  private deleteAlliance(row: any) {
    let _this = this;
    let config: any = {
      title: "风险操作提示",
      okText: "取消",
      cancelText: "确认解散",
      onOk: () => {
        _this.$Modal.remove();
      },
      onCancel: () => {
        _this.delete(row);
      },
      render: (h: any, params: any) => {
        return h(
          "p",
          {
            attrs: {
              class: "dialogP-1559282483277"
            }
          },
          "你正在进行【解散】操作，一但解散后，联盟间共享的数据将不再共享！"
        );
      }
    };
    this.$Modal.confirm(config);
  }
  // 删除联盟
  private delete(row: any) {
    unionDelete({ ids: row.id }).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("操作成功!");
        this.getList();
      }
    });
  }
  //   数据状态值切换
  private changeStatus(row: any, title: string) {
    let _this = this;
    let config: any = {
      title: "风险操作提示",
      content: "确认是否" + title + "联盟？",
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        _this.alliance(row);
      }
    };
    this.$Modal.confirm(config);
  }
  //   联盟开启、禁用
  private alliance(row: any) {
    let status = 2;
    if (row.status === 2) {
      status = 1;
    }
    unionUpdateStatus({ ids: row.id, status: status }).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("操作成功!");
        this.getList();
      }
    });
  }
}
</script>

<style lang='scss' scoped>
.audit-box {
  background-color: $bg01;
  min-height: 500px;
  height: 100%;
  .condition {
    padding: 15px;
    // background-color: $grayLight;
    .form{
      background-color: $grayLight;
      padding: 15px 15px 10px;
    }
    .select {
      width: 200px;
    }
  }
  .table {
    margin-top: 15px;
    min-height: 500px;
    .edit {
      cursor: pointer;
      color: $theme;
      margin-right: 5px;
    }
    .delete {
      cursor: pointer;
      color: $danger;
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
    .submit {
      margin-right: 10px;
    }
    .add {
      color: #fff;
    }
  }
}
</style>
<style lang="scss">
.dialogP-1559282483277 {
  font-size: 14px;
  color: $theColor1;
}
</style>

