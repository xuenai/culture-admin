<template>
  <div>
    <div class="condition">
      <Form class="form" ref="formInline" inline :label-width="80">
        <FormItem class="formItem" label="名称">
          <Input type="text" :maxlength="20" v-model="condition.title" placeholder="名称" />
        </FormItem>
        <FormItem class="formItem" label="发布时间">
          <DatePicker
            type="daterange"
            separator=" 至 "
            :options="options"
            @on-change="selectDate"
            placeholder="选择日期"
            placement="bottom-end"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <FormItem class="formItem">
          <Button type="primary" class="submit" @click="handleSubmit">搜索</Button>
          <Button type="primary">
            <router-link :to="{path:'/cloud-msg-edit'}" class="add">添加</router-link>
          </Button>
        </FormItem>
      </Form>
      <baseTable class="table" :configure="tableConfig" @getList="getList">
        <Table border :columns="data.header" :loading="loading" :data="data.list" ref="table">
          <template slot-scope="{ row }" slot="title">
            <div class="msgInfo">
              <router-link :to="{path:'/cloud-msg-detail',query:{id: row.id}}">
                <h3>{{row.title}}</h3>
              </router-link>
              <!-- <p>{{row.content}}</p> -->
            </div>
          </template>
          <template slot-scope="{ row }" slot="notifyType">
            <span>{{getTxtToCode(row.notifyType)}}</span>
          </template>
          <template slot-scope="{ row }" slot="control">
            <router-link :to="{path:'/cloud-msg-edit',query:{id: row.id}}">
              <i class="edit" title="修改">修改</i>
            </router-link>
            <i class="edit" title="删除" @click="deleteMsg(row.id)">删除</i>
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
  getSiteMessageNotifyList,
  deleteSiteMessageNotify
} from "@service/cloud-manage";
import { ModalConfig } from "iview/types";

@Component({ components: { baseTable } })
export default class MessageManage extends Vue {
  mounted() {
    this.getList();
  }
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
  private handleSubmit() {
    this.tableConfig.page.currPage = 1;
    this.getList();
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
        title: "消息信息",
        key: "title",
        slot: "title"
      },
      {
        title: "发布时间",
        key: "createTime",
        align: "center",
        width: 150
      },
      {
        title: "发送对象",
        key: "notifyType",
        slot: "notifyType",
        align: "center",
        width: 150
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
    title: "",
    startDate: "",
    endDate: ""
  };
  // 日期选择
  private selectDate(date: Array<string>) {
    if (date.length > 1) {
      this.condition.startDate = date[0] || "";
      this.condition.endDate = date[1] || "";
    }
  }
  private getList(page: any = this.tableConfig.page) {
    Object.assign(this.condition, page);
    getSiteMessageNotifyList(this.condition).then((res: any) => {
      if (res.code === 0) {
        this.data.list = res.datas;
        this.loading = false;
        this.tableConfig.page = res.page;
      }
    });
  }
  //   根据code 获取字符文本
  private getTxtToCode(code: any) {
    let obj: any = {
      site: "站点端",
      company: "企业端",
      site_company: "站点端,企业端"
    };
    return obj[code] || "";
  }
  deleteMsg(id: string) {
    let _this = this;
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否删除该条消息？`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        deleteSiteMessageNotify({ ids: id }).then(res => {
          if (res.code === 0) {
            _this.$Message.success("删除成功!");
            _this.getList();
          }
        });
      }
    };
    this.$Modal.confirm(config);
  }
}
</script>

<style lang='scss' scoped>
.condition {
  padding: 15px;
  .form {
    padding: 15px 0 5px;
    background-color: $grayLight;
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
.table {
  margin-top: 20px;
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
  .msgInfo {
    h3 {
      font-weight: normal;
      @include ellipsis();
    }
    p {
      @include ellipsisLn(2);
    }
  }
}
</style>
