<!--
 * @Author: 任智勇
 * @since: 2019-05-30 11:48:33
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-31 09:47:47
 -->
<template>
  <div class="audit-box">
    <div class="condition">
      <Form class="form" ref="formInline" inline :label-width="80">
        <FormItem class="formItem" label="站点名称">
          <Input type="text" :maxlength="20" v-model="condition.siteName" placeholder="站点名称"/>
        </FormItem>
        <FormItem class="formItem" label="广告位编码">
          <Input type="text" :maxlength="20" v-model="condition.code" placeholder="广告位编码"/>
        </FormItem>
        <FormItem class="formItem" label="广告位名称">
          <Input type="text" :maxlength="20" v-model="condition.keyword" placeholder="广告位名称"/>
        </FormItem>
        <FormItem class="formItem select" label="发布渠道" prop="publishChannel">
          <Select v-model="condition.publishChannel">
            <Option value selected>全部</Option>
            <Option value="PC">PC网站</Option>
            <Option value="MICRO_SITE">微网站</Option>
            <Option value="APP">APP</Option>
            <Option value="SMALL_PROGRAM">小程序</Option>
          </Select>
        </FormItem>
        <FormItem class="formItem">
          <Button type="primary" class="submit" @click="handleSubmit">搜索</Button>
          <Button type="primary">
            <router-link to="/cloud-ads-edit" class="add">添加</router-link>
          </Button>
        </FormItem>
      </Form>
      <baseTable class="table" :configure="tableConfig" @getList="getList">
        <Table border :columns="data.header" :loading="loading" :data="data.list" ref="table">
          <template slot-scope="{ row }" slot="status">
            <div v-if="row.status === 1">
              <span class="switchLabel">正常</span>
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
          <template slot-scope="{ row }" slot="type">
            <span v-if="row.type ==='POSITION_PUBLIC'">共有</span>
            <span v-else>私有</span>
          </template>
          <template slot-scope="{ row }" slot="publishChannel">
            <span>{{getPublishName(row.publishChannel)}}</span>
          </template>
          <template slot-scope="{ row }" slot="control">
            <router-link :to="{path:'/cloud-ads-edit',query:{id: row.id}}">
              <i class="edit" title="修改">修改</i>
            </router-link>
          </template>
        </Table>
      </baseTable>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import baseTable from "@components/baseTable/baseTable.vue";
import { getadPositionList, positionUpdateStatus } from "@service/cloud-manage";

@Component({ components: { baseTable } })
export default class ComponentName extends Vue {
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
        title: "编码",
        key: "code"
      },
      {
        title: "名称",
        key: "name"
      },
      {
        title: "发布渠道",
        key: "publishChannel",
        align: "center",
        slot: "publishChannel"
      },
      {
        title: "类型",
        key: "type",
        align: "center",
        slot: "type"
      },
      {
        title: "站点名称",
        key: "siteName",
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
    keyword: "",
    code: "",
    siteName: "",
    publishChannel: ""
  };
  mounted() {
    this.getList();
  }

  //   搜索查询
  private handleSubmit() {
    this.tableConfig.page.currPage = 1
    this.getList();
  }
  // 获取列表数据的方法
  private getList(page: any = this.tableConfig.page) {
    Object.assign(this.condition, page);
    getadPositionList(this.condition).then((res: any) => {
      if (res.code === 0) {
        this.data.list = res.datas;
        this.loading = false;
        this.tableConfig.page = res.page;
      }
    });
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
        _this.adPosition(row);
      }
    };
    this.$Modal.confirm(config);
  }
  //   广告位开启、禁用
  private adPosition(row: any) {
    let status = 2;
    if (row.status === 2) {
      status = 1;
    }
    let param = {
      ids: row.id,
      status: status
    };
    positionUpdateStatus(param).then((res: any) => {
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
  // 匹配发布渠道
  private getPublishName(code: string) {
    let name = "";
    switch (code) {
      case "PC":
        name = "PC网站";
        break;
      case "MICRO_SITE":
        name = "微网站";
        break;
      case "APP":
        name = "APP";
        break;
      case "SMALL_PROGRAM":
        name = "小程序";
        break;
    }
    return name;
  }
}
</script>

<style lang='scss' scoped>
.audit-box {
  background-color: $bg01;
  min-height: calc(100vh - 142px);
  height: 100%;
  .condition {
    padding: 15px;
    min-height: calc(100vh - 142px);
    box-sizing:border-box;
    .form{
      padding: 15px 15px 10px;
      background-color: $grayLight;
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

