<!--
 * @Author: 任智勇
 * @since: 2019-06-04 13:39:27
 * @LastAuthor: 任智勇
 * @lastTime: 2019-08-02 09:55:51
 -->
<template>
  <div class="activity-management-pub">
    <div class="topic">
      <Form
        class="form"
        ref="formInline"
        inline
        :label-width="70"
        :model="params"
        :rules="ruleValidate"
      >
        <FormItem label="关键字" prop="name">
          <Input
            type="text"
            v-model="params.name"
            placeholder="订单号/活动名称"
            style="width: 200px"
            @on-enter="search"
          />
        </FormItem>
        <FormItem label="申请人" prop="phoneOrName">
          <Input
            type="text"
            v-model="params.phoneOrName"
            placeholder="姓名/手机"
            style="width: 200px"
            @on-enter="search"
          />
        </FormItem>
        <FormItem label="申请日期">
          <DatePicker
            @on-change="submitDate"
            format="yyyy/MM/dd"
            type="daterange"
            placement="bottom-end"
            placeholder="选择申请日期范围"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <div style="display: inline-block;">
          <Button type="primary" style="margin-right: 10px;" @click="search">搜索</Button>
          <Button type="primary" style="margin-right: 10px;" @click="delReport(-1)">批量删除</Button>
          <Button type="primary" @click="openAudit(1)">批量审核</Button>
        </div>
      </Form>
    </div>

    <!-- 表格头 -->
    <ul class="orderHeader mt15">
      <li>
        <div class="first">
            <Checkbox class="fl" style="margin-left: 21px" :value="allCheck" @on-change="toggleAll"></Checkbox>
            <p class="big">商品信息</p>
        </div>
        <p class="middle">申请人</p>
        <p class="middle">联系电话</p>
        <p class="middle">诚信分值</p>
        <p class="middle">订单状态</p>
        <p class="middle">操作</p>
      </li>
    </ul>
    <!-- 表格行 -->
    <baseTable :configure="tableConfig" @getList="search2">
      <ul class="tab" v-if="dataList.length">
        <li class="rowList clearfix" v-for="(item, i) in dataList" :key="item.id">
          <div class="colBox">
            <div class="detail-text-info">
              <Checkbox
                class="fl"
                :disabled="item.disabled"
                :value="item.hasChecked"
                @on-change="checked => item.hasChecked = checked"
              ></Checkbox>
              <span class="detail-text-label">订单编号：</span>
              <span class="detail-text-text">
                <router-link
                  :to="{path: '/audit-ac-volunt-detail', query: {id: item.id, activityId: item.activityId}}"
                >{{item.orderCode}}</router-link>
              </span>
            </div>
            <div class="detail-text-info">
              <span class="detail-text-label">申请时间：</span>
              <span class="detail-text-text">{{item.createTime}}</span>
            </div>
          </div>
          <div class="info">
            <div class="big">
              <div class="fl mr20 ml20 img-box" :class="{
                  'faith-audit': (item.faithAuditStatus && item.faithAuditValue),
                  'faith-use': (item.faithUseStatus && item.faithUseValue)}">
                <img :src="item.image.split(',')[0]" />
              </div>
              <div class="line">
                <router-link
                  :to="{path: '/ac-detail', query: {id: item.activityId}}"
                >{{item.orderName}}</router-link>
                <p>招募时间：{{item.signStartTime.slice(0,-3)}} 至 {{item.signEndTime.slice(0,-3)}}</p>
                <p>招募人数：{{item.stock}}</p>
              </div>
            </div>
            <router-link
              tag="div"
              :to="{path:`volunteers-management-desc/${item.userId}/false`,query:{id_type:'vipId'}}"
              class="middle"
              style="color: #0082c6;cursor: pointer;"
            >{{item.userName}}</router-link>
            <div class="middle">{{item.userPhone}}</div>
            <div class="middle">{{item.creditScore || '--'}}</div><!--诚信分值-->
            <div class="middle">{{statusTxt[item.orderStatus]}}</div>
            <div class="middle action">
              <a v-if="item.orderStatus === 4" @click="openAudit(0, item.id, item)">审核</a>
              <a v-if="item.orderStatus !== 4" @click="delReport(i, item)">删除</a>
            </div>
          </div>
          <p class="apply-remark remark" v-if="item.remark">申请备注：{{item.remark}}</p>
          <p class="audit-remark remark" v-if="item.auditRemark">审核备注：{{item.auditRemark}}</p>
        </li>
      </ul>
      <p v-else class="nodata">暂无数据</p>
    </baseTable>

    <!-- <Modal v-model="showAudit" draggable scrollable title="审核" @on-ok="auditAction">
      <template v-if="auditType===0">
        <Form
          ref="audit"
          :model="auditForm"
          :label-width="80"
          :rules="auditForm.status == 6 ? ruleAudit0 : ruleAudit1"
        >
          <FormItem label="审核结果" prop="status">
            <RadioGroup v-model="auditForm.status">
              <Radio label="6">通过</Radio>
              <Radio label="79">不通过</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem v-if="auditForm.status==6" :key="0" label="审核备注" prop="remark">
            <Input
              v-model="auditForm.remark"
              type="textarea"
              :autosize="{minRows: 4,maxRows: 5}"
              placeholder="请写下审核备注，不通过时审核备注必须填写。"
            />
          </FormItem>
          <FormItem v-if="auditForm.status==79" :key="1" label="审核备注" prop="remark">
            <Input
              v-model="auditForm.remark"
              type="textarea"
              :autosize="{minRows: 4,maxRows: 5}"
              placeholder="请写下审核备注，不通过时审核备注必须填写。"
            />
          </FormItem>
        </Form>
      </template>
      <template v-else>
        <Form
          ref="audit"
          :model="auditForm"
          :label-width="80"
          :rules="auditForm.status == 6 ? ruleAudit0 : ruleAudit1"
        >
          <p style="text-indent: 20px;">您正在进行批量审核操作，请谨慎操作！</p>
          <FormItem label="审核结果" prop="status">
            <RadioGroup v-model="auditForm.status">
              <Radio label="6">通过</Radio>
              <Radio label="79">不通过</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </template>
    </Modal>-->
    <Modal v-model="showAudit" title="审核" :width="500" footer-hide>
      <Form
        ref="audit"
        :model="auditForm"
        :label-width="80"
        :rules="auditForm.status == 6 ? ruleAudit0 : ruleAudit1"
        v-if="auditType===0"
      >
        <p class="tip" v-if="currItem">已招募{{currItem.stock - currItem.surplusStock}}人，还可招募{{currItem.surplusStock}}人</p>
        <FormItem label="审核结果" prop="status">
          <RadioGroup v-model="auditForm.status">
            <Radio :disabled="currItem.surplusStock === 0" label="6">通过</Radio>
            <Radio label="79">不通过</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="auditForm.status==6" :key="0" label="审核备注" prop="remark">
          <Input
            v-model="auditForm.remark"
            type="textarea"
            :maxlength="200"
            :autosize="{minRows: 4,maxRows: 5}"
            placeholder="请写下审核备注，不通过时审核备注必须填写。"
          />
          <span>200字以内</span>
        </FormItem>
        <FormItem v-if="auditForm.status==79" :key="1" label="审核备注" prop="remark">
          <Input
            v-model="auditForm.remark"
            type="textarea"
            :maxlength="200"
            :autosize="{minRows: 4,maxRows: 5}"
            placeholder="请写下审核备注，不通过时审核备注必须填写。"
          />
          <span>200字以内</span>
        </FormItem>
        <!-- 快捷回复 -->
        <fastReply @reply="getReply" class="mt10" ></fastReply>
        <FormItem :label-width="90">
          <Button class="btn" @click="changeModalStatus">取消</Button>
          <Button class="btn" type="primary" @click="auditAction" style="margin-left:20px;">确认</Button>
        </FormItem>
      </Form>
      <Form
        v-else
        ref="audit"
        :model="auditForm"
        :label-width="80"
        :rules="auditForm.status == 6 ? ruleAudit0 : ruleAudit1"
      >
        <p style="text-indent: 20px;">您正在进行批量审核操作，请谨慎操作！</p>
        <FormItem label="审核结果" prop="status">
          <RadioGroup v-model="auditForm.status">
            <Radio label="6">通过</Radio>
            <Radio label="79">不通过</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label-width="90">
          <Button class="btn" @click="changeModalStatus">取消</Button>
          <Button class="btn" type="primary" @click="auditAction" style="margin-left:20px;">确认</Button>
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="addTagSpinShow"></Spin>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import BaseTable from "@components/baseTable/baseTable.vue";
import fastReply from "@views/pages/common/fast-reply.vue";
import { getActiveOrderList } from "@service/activity";
import { orderAudit } from "@service/audit";
import { orderDelete } from "@service/tool";
import { AppModule } from "@store/modules/app";
import { getCreditUser } from  "@service/common";

interface paramType {
  resourceType: string;
  indateStartTime?: string;
  orderStartTime?: string;
  phoneOrName?: string;
  orderEndTime?: string;
  indateEndTime?: string;
  name?: string;
  orderStatus?: number;
  valid: number;
  currPage?: number;
  pageSize?: number;
}

@Component({
  components: {
    BaseTable,
    fastReply
  }
})
export default class Pane extends Vue {
  //设置快捷回复
  getReply(item:any){
      (this.auditForm as any).remark=item;
  }
  // 数据状态 全部 待审核 不通过
  @Prop() status?: number;
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  // 查询条件
  private params = <paramType>{
    orderStatus: this.status,
    resourceType: "CONTENT_TYPE_ACTIVITY",
    valid: 2
  };
  changeModalStatus() {
    this.showAudit = false;
  }
  // 表单验证
  private ruleValidate = <any>{
    phoneOrName: [
      {
        message: "请正确填写姓名或手机号",
        pattern: /(^1[3456789]\d{9}$)|(^([\u4e00-\u9fa5·]{1,20}|[a-zA-Z\.\s]{1,20})$)/,
        trigger: "blur"
      }
    ]
  };
  // 表格配置
  private tableConfig: object = {
    page: {
      currPage: 1,
      pageSize: 10,
      total: 0
    },
    pagePosition: "right"
  };
  // 状态
  private statusTxt: object = {
    1: "正常",
    2: "禁用",
    3: "草稿",
    4: "待审核",
    5: "审核中",
    6: "审核通过",
    7: "回退",
    79: "审核不通过",
    8: "已撤回",
    9: "终止",
    11: "待消费",
    12: "已完成",
    13: "已失效",
    14: "已取消"
  };
  // 列表数据
  private dataList: Array<any> = [];
  // loading
  private loading: boolean = false;
  // 是否显示showAudit
  private showAudit: boolean = false;
  // 审核弹窗请求接口时的蒙层
  addTagSpinShow = false;
  // 审核类型 0单独审核 1批量审核
  private auditType: number = 0;
  // 审核接口参数
  private auditForm: object = {
      status: '6'
  };
  // 审核验证 通过
  private ruleAudit0: object = {
    status: [{ required: true, message: "请选择审核结果", trigger: "blur" }]
  };
  // 审核验证 不通过
  private ruleAudit1: object = {
    status: [{ require: true, message: "请选择审核结果", trigger: "blur" }],
    remark: [{ required: true, message: "请填写审核备注", trigger: "blur" }]
  };
  // 数据id用于单个审核
  private simpleId: string | number = "";

  mounted() {
    this.search();
  }

  // 当前点击的数据
  private currItem: any = '';
  // 打开审核窗口 0单独审核 1批量审核
  private openAudit(type: number, id?: string, item?:any) {
    this.currItem = item;
    if (type === 1) {
      if (!this.checkedBox.length) {
        this.$Message.info("请选择需要批量审核的内容");
        return;
      } else if (this.checkedBox.some((item: any) => item.orderStatus !== 4)) {
        this.$Message.error("所选项只能包含待审核数据！");
        return;
      }
    }
    if (id) this.simpleId = id;
    this.auditType = type;
    this.showAudit = true;
  }
  // 审核函数
  private auditAction() {
    (this.$refs.audit as any).validate((valid: boolean) => {
      if (valid) {
        this.addTagSpinShow = true;
        let { auditType, simpleId, checkedBox } = this;
        orderAudit(
          Object.assign(this.auditForm, {
            id:
              auditType === 0
                ? simpleId
                : checkedBox.map((item: any) => item.id).toString()
          })
        ).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("操作成功!");
            this.showAudit = false;
            // this.search2();
            AppModule.pageRefresh(true);
            // setTimeout(() => {
            //   this.auditForm = {};
            // }, 250)
          }
        }).finally(() => {
          this.addTagSpinShow = false;
        });
      } else {
        this.$Message.error("请正确填写相关信息!");
      }
    });
  }

  // 复选框ID
  get checkedBox() {
    return this.dataList.filter((item: any) => item.hasChecked);
  }

  get allCheck() {
    return (
      this.dataList.length &&
      this.dataList.every((item: any) => item.hasChecked)
    );
  }

  // 全选点击
  private toggleAll(checked: boolean) {
    this.dataList.forEach((item: any) => (item.hasChecked = checked));
  }

  // 提交日期选择
  private submitDate(date: Array<string>) {
    this.params.orderStartTime = date[0] || "";
    this.params.orderEndTime = date[1] || "";
    this.search();
  }

  // 搜索
  private search() {
    (this.tableConfig as any).page.currPage = 1;
    this.search2();
  }
  private search2(page: any = (this.tableConfig as any).page) {
    this.loading = true;
    this.params.currPage = page.currPage;
    this.params.pageSize = page.pageSize;
    getActiveOrderList(this.params)
      .then((res: any) => {
        let page = res.page;
        let datas = res.datas;
        if (page) {
          (this.tableConfig as any).page = page;
        }
        if (datas) {
          let tels: string = '';
          this.dataList = datas.map((data: any) => {
            data.hasChecked = false;
            data.creditScore = '';
            if (data.userPhone) tels += data.userPhone + ',';
            return data;
          });

          if (tels) {
              getCreditUser({platformCode: this.$store.state.app.userInfo.siteCode, platformChannel: 'cultural', phone: tels.slice(0,-1)}).then((res:any) => {
                  if (res.code === 0) {
                      this.dataList.forEach((data:any) => {
                          if (data.userPhone) {
                              let curr:any = res.datas.find((item:any) => item.phone === data.userPhone);
                              if (curr) {
                                  data.creditScore = curr.creditScore + '（' + curr.levelName + ')'
                              }
                          }
                      })
                  }
              })
          }
        }
      })
      .catch(() => {
        this.dataList = [];
      })
      .finally(() => {
        this.loading = false;
      });
    this.$emit("onChange");
  }

  // 删除
  private delReport(index: number, item?: any) {
    if (index === -1) {
      if (!this.checkedBox.length) {
        this.$Message.error("请选择需要删除的内容！");
        return;
      } else if (this.checkedBox.some((item: any) => item.orderStatus === 4)) {
        this.$Message.error("所选项不能包含待审核数据！");
        return;
      }
    }

    let config: any = {
      title: `删除内容`,
      content: `确认删除“${item.name || "选中"}”内容？删除内容后将无法恢复`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        let ids = "";
        if (index === -1) {
          ids = this.checkedBox.map((item: any) => item.id).toString();
        } else {
          ids = item.id;
        }
        this.delList(ids, index);
      }
    };
    this.$Modal.confirm(config);
  }

  // 删除
  private delList(ids: string, index: number) {
    orderDelete({ ids }).then((data: any) => {
      if (data.code === 0) {
        this.$Message.success("删除成功");
        if (index !== -1) {
          this.dataList.splice(index, 1);
        } else {
          this.search();
        }
      }
    });
  }
}
</script>

<style lang='scss' scoped>
.tip {
    background: rgba(255, 255, 204, 1);
    text-align: center;
    line-height: 24px;
}

.nodata {
  text-align: center;
  line-height: 100px;
}

.remark {
  float: left;
  line-height: 20px;
  width: 100%;
  text-indent: 22px;
}
.apply-remark {
  background: #f4f9fe;
}
.audit-remark {
  background: #f6f0a2;
}

.activity-management-pub {
  .topic {
    width: 100%;
    padding-top: 15px;
    margin-bottom: 20px;
    background: $grayLight;
  }

  .orderHeader {
    padding: 16px 0;
    background-color: #e9eaec;
    li {
      overflow: hidden;
      display: flex;
      .big {
        text-align: left;
      }
      .first {
          width: 37%;
      }
      .middle {
        flex: 1;
        text-align: center;
        a.help {
          background: #ed3f14;
          font-size: 10px;
          color: #fff;
          border-radius: 50%;
          position: relative;
          top: 0;
          left: 8px;
          display: inline-block !important;
          width: 15px;
          height: 15px;
          line-height: 17px !important;
          padding-top: 1px;
        }
      }
    }
  }

  .tab {
    position: relative;
    overflow: hidden;
    .line {
      padding-left: 15px;
      float: left;
      text-align: left !important;
      max-width: 400px;
      line-height: 15px;
      overflow: hidden;
      /*text-overflow: ellipsis;*/
      /*white-space: nowrap;*/
      p {
        margin-top: 4px;
      }
    }
    .rowList {
      div {
        float: left;
        text-align: center;
      }
      margin-top: 15px;
      border: 1px solid #e9eaec;
      line-height: 50px;
      border-bottom: 1px solid #e9eaec;
      > div.info {
        background-color: #fff;
        width: 100%;
        padding: 16px 0;
        position: relative;
        display: flex;
        .big {
          width: 37%;
          text-align: left;
            .img-box {
                position: relative;
                width: 90px;
                height: 60px;
                overflow: hidden;
                &.faith-use:after {
                    content: '诚信优享';
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    padding: 0 5px;
                    color: #fff;
                    background: rgba(255, 102, 0, 1);
                    line-height: 20px;
                    text-align: center;
                    border-radius: 4px;
                }
                &.faith-audit:after {
                    content: '诚信免审';
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    padding: 0 5px;
                    color: #fff;
                    background: rgba(20, 204, 86, 1);
                    line-height: 20px;
                    text-align: center;
                    border-radius: 4px;
                }
                img {
                    width: 100%;
                }
            }
        }
        .middle {
          flex: 1;
          text-align: center;
          &.action {
            display: flex;
            flex-direction: column;
            justify-content: center;
            line-height: 20px;
          }
          a {
            display: block;
            line-height: 20px;
            margin: 0;
            padding: 0;
          }
        }
      }
    }
    .colBox {
      background-color: #f4f9fe;
      width: 100%;
      padding-left: 20px;
      .detail-text-info {
        padding-right: 40px !important;
        .detail-text-label {
          white-space: nowrap;
        }
        .detail-text-text {
          color: #7b8292;
        }
      }
    }
    .detail-text-info .detail-text-label,
    .detail-text-info .detail-text-text {
      display: table-cell;
      font-size: 12px;
      font-weight: 400;
    }
  }

  .info-list {
    padding: 20px 0;
    .img-box {
      position: relative;
      width: 100px;
      height: 84px;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    .hot {
      span {
        color: $danger;
      }
    }
    .time,
    .add {
      margin-top: 7px;
      span {
        color: $font03;
      }
    }
    .introduce-content {
      width: 350px;
      position: relative;
      margin-left: 10px;
    }
  }
  .opation-group {
    a {
      margin-right: 8px;
    }
  }
  .btn-group {
    text-align: center;
    .ivu-btn {
      margin-right: 10px;
    }
  }
  .remove-desc {
    font-size: 16px;
    .cloud-icon {
      color: red;
    }
  }
}
</style>
