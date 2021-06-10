<template>
  <div class="content">
    <div class="header-tips">
      <i class="cloud-icon theme-blue icon">&#xe79f;</i> 传播中华文化，建立社会主义核心价值观从点滴做起。
      <span class="tips theme-blue" @click="checkTips=true">点击查看小贴士展示方式</span>
    </div>
    <div class="search-box mt15">
      <Form class="form" inline :label-width="80">
        <div class="clearfix">
          <FormItem label="内容">
            <Input
              v-model="params.keyword"
              type="text"
              :maxlength="20"
              placeholder="请输入关键字"
              style="width: 200px"
            />
          </FormItem>
          <FormItem label="状态">
            <Select style="width: 200px" v-model="params.status">
              <Option v-for="item in state" :key="item.code" :value="item.code">{{item.name}}</Option>
            </Select>
            <Button class="ml20" type="info" @click="search">搜索</Button>
            <Button
              class="ml20"
              type="info"
              @click="addTip=true"
              v-if="operates.includes('save')"
            >添加</Button>
          </FormItem>
        </div>
      </Form>
    </div>
    <baseTable :configure="tableConfig" @getList="getList" class="mt15">
      <Table
        :columns="this.columns12"
        :data="data.list"
        :configure="tableConfig"
        :loading="loading"
      >
        <template slot-scope="{ row }" slot="status">
          <span v-if="row.status == 1">启用</span>
          <span v-else>禁用</span>
        </template>
        <template slot-scope="{ row }" slot="action">
          <div class="btn-group">
            <span
              class="theme-blue"
              v-if="operates.includes('delete')"
              @click="removeFun(row.id)"
            >删除</span>
            <span
              class="theme-blue"
              v-if="row.status === 1"
              @click="changeStatus(row,'禁用') && operates.includes('status')"
            >禁用</span>
            <span
              class="theme-blue"
              v-else
              @click="changeStatus(row,'启用') && operates.includes('status')"
            >启用</span>
            <span class="theme-blue" v-if="operates.includes('edit')" @click="updateTipFun(row)">修改</span>
          </div>
        </template>
      </Table>
    </baseTable>
    <Modal title="添加小贴士" v-model="addTip" footer-hide>
      <Form :label-width="50" :rules="ruleValidate" ref="data" :model="data">
        <FormItem label="内容" prop="content">
          <Input v-model="data.content" class="tags-ipt" :maxlength="30" placeholder="请输入您要添加的小贴士" />
          <!-- <Input
                    type="textarea"
                    :maxlength="30"
                    style="height:90px"
                    :autosize="{minRows: 5,maxRows: 5}"
                    placeholder="请输入您要添加的小贴士"
                    v-model="data.content"
                    class="tags-ipt"
          />-->
          <p>最多30个文字</p>
        </FormItem>
        <FormItem>
          <div class="btns-group">
            <Button type="primary" :loading="addTipButtonLoading" @click="addTipFun">确认添加</Button>
            <Button class="ml20" @click="addTip=false">取消</Button>
          </div>
        </FormItem>
      </Form>
    </Modal>
    <Modal title="修改小贴士" v-model="updateTip" footer-hide>
      <Form :label-width="50" :model="data">
        <FormItem label="内容">
          <Input
            v-model="data.upsContent"
            class="tags-ipt"
            :maxlength="30"
            placeholder="请输入您要添加的小贴士"
          />
          <p>最多30个文字</p>
        </FormItem>
        <FormItem>
          <div class="btns-group">
            <Button type="primary" @click="updateTipsFun">确认修改</Button>
            <Button class="ml20" @click="updateTip=false">取消</Button>
          </div>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="checkTips" class="tips-show" title="小贴士展示方式" footer-hide>
      <div class="clearfix">
        <div class="load-box tc fl">
          <img src="@assets/image/load.gif" alt />
          <p class="mt20">中华文明五千年，礼仪展示一瞬间</p>
        </div>
        <p class="mt20 fl tips-tags">小贴士将出现在每次页面加载时</p>
      </div>
      <p class="mt20" style="margin-left: 80px;">示意图</p>
      <div class="tips-foot" @click="checkTips=false">知道了</div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import BaseTable from "@components/baseTable/baseTable.vue";
import { DATA_STATE } from "@constant/index";
import { AppModule } from "@store/modules/app";
import {
  getCtcTipsList,
  updateStatusTips,
  saveTips,
  delTips
} from "@service/tool";
@Component({
  components: {
    BaseTable
  }
})
export default class TipsList extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  private addTip = false; // 添加小贴士-弹框
  addTipButtonLoading = false; // 弹窗按钮
  private checkTips = false; // 小贴士展示示意-弹框
  private loading = true; // 数据是否加载中
  private state = DATA_STATE; // 状态

  /* 接口请求params */
  private params: any = {
    currPage: 1,
    pageSize: 5,
    keyword: "", //	模糊查询 内容
    status: "" // 模糊查询 状态
  };
  private data: any = {
    id: "", // ID
    upsContent: "", // 小贴士内容
    content: "", // 新增小贴士内容
    list: []
  };

  mounted() {
    this.getList();
  }

  // 保存
  private saveRow(rows: any) {
    this.data.list[rows._index] = rows;
    this.data.list[rows._index].edit = false;
  }
  /* 表格头 */
  private columns12: any = [
    {
      title: "小贴士",
      key: "content"
    },
    {
      title: "状态",
      key: "status",
      align: "center",
      slot: "status"
    },
    {
      title: "操作",
      slot: "action",
      align: "center"
    }
  ];
  //   搜索
  private search() {
    this.tableConfig.page.currPage = 1;
    this.getList();
  }
  /* S 获取列表数据 */
  // 分页
  private tableConfig: any = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 6
    },
    pagePosition: "right"
  };
  private getList(page: any = this.tableConfig.page) {
    Object.assign(this.params, page);
    getCtcTipsList(this.params).then((data: any) => {
      let datas: any = [];
      if (data.code === 0) {
        this.loading = false;
        this.data.list = data.datas;
        this.tableConfig.page = data.page;
      }
    });
  }
  /* E 获取列表数据 */

  /* S 数据启用/禁用状态值切换 */
  private changeStatus(row: any, title: string) {
    let _this = this;
    let config: any = {
      title: "提示",
      content: "确认是否" + title + "？",
      okText: "确认" + title,
      cancelText: "取消",
      onOk: () => {
        _this.alliance(row);
      }
    };
    this.$Modal.confirm(config);
  }
  private alliance(row: any) {
    let status = 1;
    if (row.status === 1) {
      status = 2;
    }
    let data = {
      id: row.id,
      status: status
    };
    updateStatusTips(data).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success("操作成功");
        this.getList();
      }
    });
  }
  /* E 数据启用/禁用状态值切换 */

  /* S 表单验证 */
  private ruleValidate = {
    content: [{ required: true, message: "请输入你要添加的小贴士内容" }]
    // upsContent: [{ required: true, message: "请输入你要修改的小贴士内容"}]
  };
  /* E 表单验证 */

  /* S 添加 */
  private addTipFun() {
    (this.$refs.data as any).validate((valid: any) => {
      if (valid) {
        this.addTipButtonLoading = true;
        saveTips({
          content: this.data.content // 小贴士内容
        })
          .then(data => {
            if (data.code === 0) {
              this.$Message.success("操作成功");
              this.resetModalData();
              this.addTip = false;
              this.getList();
            }
          })
          .finally(() => {
            this.addTipButtonLoading = false;
          });
      }
    });
  }
  /* E 添加 */

  /* S 修改 */
  private updateTip = false; // 修改小贴士-弹框
  private updateTipFun(item: any) {
    this.data.upsContent = item.content;
    this.data.id = item.id;
    this.updateTip = true;
  }
  private updateTipsFun() {
    saveTips({
      id: this.data.id, //ID
      content: this.data.upsContent // 小贴士内容
    }).then(data => {
      if (data.code === 0) {
        this.$Message.success("修改成功");
        this.resetModalData();
        this.updateTip = false;
        this.getList();
      }
    });
  }
  /* E 修改 */

  /* S 删除 */
  removeFun(id: any) {
    this.$Modal.confirm({
      title: "提示",
      content: "确认删除？",
      onOk: () => {
        delTips({
          ids: id
        }).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("已删除");
            this.getList();
          }
        });
      }
    });
  }
  /* E 删除 */

  // 重新设置添加编辑弹窗的form表单值
  private resetModalData() {
    (this.$refs.data as Vue).resetFields();
  }
}
</script>

<style lang='scss' scoped>
.content {
  padding: 15px;
  .header-tips {
    width: 100%;
    line-height: 60px;
    background: #e9f5fd;
    padding-left: 15px;
    .icon {
      font-size: 20px;
      vertical-align: middle;
      margin-right: 10px;
    }
    .tips {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .search-box {
    background: $grayLight;
    padding: 20px 0 0 0;
  }
  .btn-group {
    span {
      margin-right: 5px;
      cursor: pointer;
    }
  }
}
.tips-show {
  .load-box {
    width: 250px;
    padding: 30px 0;
    background: #f2f4f7;
    margin: 0 auto;
  }
  .tips-tags {
    position: relative;
    margin-top: 60px;
    margin-left: 20px;
    background: url(./../../../assets/image/icon-left.png) no-repeat 0 4px;
    padding-left: 50px;
  }
  .tips-foot {
    cursor: pointer;
    text-align: right;
  }
}
.btns-group {
  width: 100%;
  text-align: right;
}
.tags-ipt {
}
</style>
