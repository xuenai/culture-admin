<template>
  <div class="pd20">
    <!-- 步骤 -->
    <div class="step">
      <div class="details-left ivu-col ivu-col-span-5">
        <p>
          订单编号：
          <span>{{ desc.orderCode }}</span>
        </p>
        <p class="status">{{ getStatus() }}</p>
        <Button @click="resetCode" v-if="desc.orderStatus === 11" type="info"
          >重新发码</Button
        >
      </div>
      <div class="right">
        <Steps
          v-if="desc.orderStatus === 14"
          :current="getCurrStep(desc.orderStatus)"
        >
          <Step
            title="下单"
            icon="iconfont c-icon-xiadan"
            :content="desc.createTime"
          ></Step>
          <Step
            title="取消成功"
            icon="iconfont c-icon-tuichu1"
            :content="desc.updateTime || ''"
          ></Step>
        </Steps>
        <Steps v-else-if="desc.orderStatus === 13">
          <Step
            title="下单"
            icon="iconfont c-icon-xiadan"
            :content="desc.createTime"
          ></Step>
          <Step title="已失效" icon="iconfont c-icon-xiaofei"></Step>
        </Steps>
        <Steps v-else :current="getCurrStep(desc.orderStatus)">
          <Step
            title="下单"
            icon="iconfont c-icon-xiadan"
            :content="desc.createTime"
          ></Step>
          <Step title="待消费" icon="iconfont c-icon-xiaofei"></Step>
          <Step
            title="完成"
            icon="iconfont c-icon-wancheng"
            :content="desc.orderStatus == 12 ? desc.updateTime || '' : ''"
          ></Step>
        </Steps>
      </div>
    </div>
    <div class="borderRow ivu-row">
      <div class="pt20 ivu-col ivu-col-span-8">
        <div class="detail-text-info">
          <span class="detail-text-label">预订人姓名</span>
          <span class="detail-text-text">{{ desc.userName }}</span>
        </div>
      </div>
      <div class="pt20 ivu-col ivu-col-span-8">
        <div class="detail-text-info">
          <span class="detail-text-label">联系电话</span>
          <span class="detail-text-text">{{ desc.userPhone }}</span>
        </div>
      </div>
      <div class="pt20 ivu-col ivu-col-span-8">
        <div class="detail-text-info">
          <span class="detail-text-label">身份证号</span>
          <span class="detail-text-text">{{ desc.idCard }}</span>
        </div>
      </div>
      <div class="pt20 ivu-col ivu-col-span-8">
        <div class="detail-text-info">
          <span class="detail-text-label">下单时间</span>
          <span class="detail-text-text">{{ desc.createTime }}</span>
        </div>
      </div>
      <div class="pt20 ivu-col ivu-col-span-8">
        <div class="detail-text-info">
          <span class="detail-text-label">预订渠道</span>
          <span class="detail-text-text">{{ desc.channel }}</span>
        </div>
      </div>
      <div class="pt20 ivu-col ivu-col-span-8" v-if="desc.expectedTime">
        <div class="detail-text-info">
          <span class="detail-text-label">预计到馆</span>
          <span class="detail-text-text">{{ desc.expectedTime }}</span>
        </div>
      </div>
      <div class="pt20 ivu-col ivu-col-span-8" v-if="desc.remark">
        <div class="detail-text-info">
          <span class="detail-text-label">预约备注</span>
          <span class="detail-text-text remark" :title="desc.remark">{{
            desc.remark
          }}</span>
        </div>
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="content-main">
      <div class="content-detail-title">
        <p class="title-tool"><i class="cloud-icon">&#xe697;</i> 订单信息</p>
        <div class="content-detail-content product-detail-box">
          <div class="title-entity ivu-row mt20">
            <div class="ivu-col ivu-col-span-6" style="padding-left:20px;">
              订单信息
            </div>
            <div class="ivu-col ivu-col-span-2 tc">预约类型</div>
            <div class="ivu-col ivu-col-span-3 tc">预约时间</div>
            <div class="ivu-col ivu-col-span-4 tc">单位名称</div>
            <div class="ivu-col ivu-col-span-3 tc">到场人数</div>
            <div class="ivu-col ivu-col-span-2 tc">支付金额</div>
            <div class="ivu-col ivu-col-span-2 tc">退单数量</div>
            <div class="ivu-col ivu-col-span-2 tc">已核销数</div>
          </div>
          <div class="product-detail entity ivu-row">
            <div class="ivu-col ivu-col-span-6 product-detail-flex">
              <div class="ml15 product-detail-img daq-no-photo">
                <img :src="desc.cover" class="ml15" v-if="desc.cover" />
                <span class="credit-icon" v-if="desc.faithAuditStatus == 1"
                  >诚信免审</span
                >
              </div>
              <div class="right-info">
                <p class="p-title">{{ venueInfo.venueName }}</p>
                <p class="mt20">最大接待数：{{ venueInfo.maxNum }}</p>
              </div>
            </div>
            <div class="ivu-col ivu-col-span-2 tc">
              {{
                venueInfo.reservationType == 'PERSON' ? '个人预约' : '团队预约'
              }}
            </div>
            <div
              class="ivu-col ivu-col-span-3 tc"
              v-if="venueInfo.useStartTime && venueInfo.useEndTime"
            >
              <p
                class="mt20 time"
                v-if="
                  venueInfo.useStartTime.split(' ')[0] ==
                    venueInfo.useEndTime.split(' ')[0]
                "
              >
                {{ venueInfo.useStartTime.split(' ')[0] }}<br />{{
                  venueInfo.useStartTime.split(' ')[1].substr(0, 5)
                }}-{{ venueInfo.useEndTime.split(' ')[1].substr(0, 5) }}
              </p>
              <p class="mt20 time" v-else>
                {{
                  venueInfo.useStartTime.substr(
                    0,
                    venueInfo.useStartTime.length - 3
                  )
                }}
                - <br />{{
                  venueInfo.useEndTime.substr(
                    0,
                    venueInfo.useEndTime.length - 3
                  )
                }}
              </p>
            </div>
            <div
              class="ivu-col ivu-col-span-4 tc company-name"
              :title="venueInfo.companyName"
            >
              {{ venueInfo.companyName || '-' }}
            </div>
            <div class="ivu-col ivu-col-span-3 tc">
              <div
                v-if="
                  !venueInfo.oldManNum &&
                    !venueInfo.teenagerNum &&
                    !venueInfo.childNum &&
                    !venueInfo.adultNum
                "
              >
                {{ venueInfo.useNum }}
              </div>
              <div v-else>
                <p>{{ venueInfo.useNum }}</p>
                <p v-if="venueInfo.oldManNum">
                  老人：{{ venueInfo.oldManNum }}
                </p>
                <p v-if="venueInfo.teenagerNum">
                  儿童：{{ venueInfo.teenagerNum }}
                </p>
                <p v-if="venueInfo.childNum">
                  青少年：{{ venueInfo.childNum }}
                </p>
                <p v-if="venueInfo.adultNum">成人：{{ venueInfo.adultNum }}</p>
                <p></p>
              </div>
            </div>
            <div class="ivu-col ivu-col-span-2 tc">
              {{
                venueInfo.money == 0 && venueInfo.integral == 0
                  ? '免费'
                  : venueInfo.money > 0
                  ? venueInfo.money
                  : venueInfo.integral + '积分'
              }}
            </div>
            <div class="ivu-col ivu-col-span-2 tc">
              {{ desc.backNum }}
            </div>
            <div class="ivu-col ivu-col-span-2 tc">
              {{ desc.consumeNum }}
            </div>
          </div>
        </div>
      </div>
      <div class="content-detail-title">
        场馆信息
        <div class="content-detail-content">
          <div class="ivu-row">
            <div class="ivu-col ivu-col-span-8">
              <div class="detail-text-info">
                <span class="detail-text-label">联系地址</span>
                <span class="detail-text-text">{{
                  venueInfo.address || '暂无'
                }}</span>
              </div>
            </div>
            <div class="ivu-col ivu-col-span-8">
              <div class="detail-text-info">
                <span class="detail-text-label">服务电话</span>
                <span class="detail-text-text">{{
                  venueInfo.phone || '暂无'
                }}</span>
              </div>
            </div>
            <div class="ivu-col ivu-col-span-8">
              <div class="detail-text-info">
                <span class="detail-text-label">取消设置</span>
                <span
                  class="detail-text-text"
                  v-if="venueInfo.cancelStatus == 0"
                  >不可取消</span
                >
                <span
                  class="detail-text-text"
                  v-else-if="venueInfo.cancelStatus == 1"
                  >随时取消</span
                >
                <span
                  class="detail-text-text"
                  v-else-if="venueInfo.cancelStatus == 2"
                  >开始使用24小时前可取消</span
                >
                <span
                  class="detail-text-text"
                  v-else-if="venueInfo.cancelStatus == 3"
                  >开始使用前{{ venueInfo.cancelTime }}小时前可取消</span
                >
              </div>
            </div>
            <div class="ivu-col ivu-col-span-24">
              <div class="detail-text-info">
                <span class="detail-text-label">核销设置</span>
                <span class="detail-text-text">
                  预约开始时间前 {{ venueInfo.validStartValue }}
                  {{
                    venueInfo.validTimeStartType == 'VALID_TIME_TYPE_HOURS'
                      ? '小时'
                      : '分钟'
                  }}
                  预约结束时间后 {{ venueInfo.validEndValue }}
                  {{
                    venueInfo.validTimeEndType == 'VALID_TIME_TYPE_HOURS'
                      ? '小时'
                      : '分钟'
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--核销记录-->
      <div
        class="content-detail-title hx-box"
        v-if="desc.orderStatus !== 14 && desc.orderStatus !== 13"
      >
        核销信息
        <div class="content-detail-content">
          <div
            class="detail-text-info"
            v-if="desc.recordList && desc.recordList.length"
          >
            <div v-for="(item, index) in desc.recordList" :key="index">
              电子消费码：
              <span>{{ item.code }}</span>
              于 {{ item.createTime }} 由 【站点管理端】管理人员（{{
                item.operateUser || item.phone
              }}）核销了{{ item.num }}张。
            </div>
          </div>
          <span class="detail-text-info" v-else>没有核销记录</span>
        </div>
      </div>
      <!--取消记录-->
      <div
        class="content-detail-title hx-box"
        v-if="desc.orderStatus === 14 && desc.orderStatus !== 13"
      >
        取消记录
        <div class="content-detail-content">
          <div
            class="detail-text-info"
            v-if="desc.recordList && desc.recordList.length"
          >
            <Row
              class="list"
              v-for="(item, index) in desc.recordList"
              :key="index"
            >
              <Col span="8">
                取消时间：
                <span>{{ item.createTime }}</span>
              </Col>
              <Col span="8">
                取消数量
                {{ item.num }}
              </Col>
              <Col span="8">
                退还金额
                {{ item.money || '免费' }}
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <Button type="primary" class="ml20" @click="goBack">返回</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { venueOrderInfo, restartCode } from '@service/place'
import { AppModule } from '@store/modules/app'

@Component({
  components: {}
})
export default class VenueOrderDetail extends Vue {
  get creditStatus() {
    return AppModule.siteInfo.creditStatus
  }
  /*S 活动室预约订单详情信息*/
  private desc: object = {}
  private venueInfo: any = {}
  getDesc() {
    venueOrderInfo({
      id: this.$route.query.id
    }).then((res: any) => {
      let covers = res.data.venueInfo.image.split(',')
      res.data.cover = covers[0]
      this.desc = res.data
      this.venueInfo = res.data.venueInfo
    })
  }

  /*E 详情信息*/
  /*S 获取状态*/
  getStatus() {
    let statusTxt: string = '',
      status = (this.desc as any).orderStatus
    switch (status) {
      case 0: {
        statusTxt = '待支付'
      }
      case 4: {
        statusTxt = '待审核'
      }
      case 6: {
        statusTxt = '已审核'
      }
      case 11:
        {
          statusTxt = '待消费'
        }
        break
      case 12:
        {
          statusTxt = '已完成'
        }
        break
      case 13:
        {
          statusTxt = '已失效'
        }
        break
      case 14:
        {
          statusTxt = '已取消'
        }
        break
    }
    return statusTxt
  }
  /*E 获取状态*/

  //返回
  goBack() {
    this.$router.go(-1)
  }

  //重置消费码
  resetCode() {
    restartCode({
      id: this.$route.query.id
    }).then((res: any) => {
      if (res.code === 0) {
        this.$Message.success('消费码重置成功')
      }
    })
  }
  // 获取当前应该显示的步骤
  private getCurrStep(status: any) {
    let steps = <any>{
      1: [],
      2: [11, 13, 14],
      3: [2, 12]
    }
    for (let attr in steps) {
      if (steps[attr].includes(status)) return parseInt(attr) - 1
    }
  }
  mounted() {
    //预约详情
    this.getDesc()
  }
  beforeRouteUpdate(to: any, from: any, next: Function) {
    this.getDesc()
    next()
  }
}
</script>

<style lang="scss" scoped>
.step {
  display: flex;
  .details-left {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    height: 125px;
    text-align: center;
    border-right: 1px solid #e9eaec;
    p {
      font-size: 14px;
      color: #595961;
    }
    .status {
      font-size: $f16;
      color: $theme;
      font-weight: bold;
    }
  }
  .right {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 50px;
  }
}
.ivu-row {
  position: relative;
  margin-left: 0;
  margin-right: 0;
  height: auto;
  zoom: 1;
  display: block;
  &:after {
    clear: both;
    visibility: hidden;
    font-size: 0;
    height: 0;
  }
}

.ivu-row:after,
.ivu-row:before {
  content: '';
  display: table;
}

.details-left {
  margin: 0 auto;
  height: 125px;
  text-align: center;
  border-right: 1px solid #e9eaec;
  p {
    font-size: 14px;
    color: #595961;
    margin-bottom: 15px;
  }
  .status {
    font-size: $f16;
    color: $theme;
    font-weight: bold;
  }
}

.item {
  text-align: center;
  width: 25%;
  float: left;
  position: relative;
  z-index: 9;
  i {
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 20px;
    color: $bg01;
    line-height: 40px;
    text-align: center;
    background: $btn-cancel;
  }
  .iconCurr {
    background: $theme;
  }
  .icon2 {
    // background: #ccc;
  }
  .icon3 {
    // background: #ccc;
  }
  .icon4 {
    // background: #ccc;
  }
  .show {
    display: block;
  }
  .line-80 {
    width: 80%;
  }
  .status-tit {
    margin: 5px 0;
  }
  .line {
    width: 70%;
    height: 1px;
    background: #dbdbdb;
    position: absolute;
    left: 65%;
    top: 15px;
    z-index: 1;
    &.active {
      background: $theme;
    }
  }
}

.borderRow {
  margin: 20px;
  border-top: 1px dashed #e9eaec;
  .detail-text-info {
    .detail-text-label {
      width: 7em;
      text-align: right;
      color: $font01;
      padding-right: 10px;
    }
  }
}

.pt20 {
  padding-top: 20px;
}

.detail-text-info {
  width: 100%;
  padding-right: 15px;
  display: table;
}

.detail-text-label {
  white-space: nowrap;
}

.detail-text-info {
  .detail-text-label {
    width: 7em;
    padding-right: 10px;
    text-align: right;
    color: $font01;
  }
  .detail-text-label,
  .detail-text-text {
    display: table-cell;
    font-size: 12px;
    font-weight: 400;
  }
  .detail-text-text {
    color: $font02;
    &.remark {
      display: inline-block;
      @include ellipsis(50%);
      vertical-align: top;
    }
  }
}

// 商品信息
.content-main {
  .content-detail-title {
    position: relative;
    padding: 0 15px;
    line-height: 40px;
    font-size: 14px;
    color: $font01;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .title-tool {
    position: relative;
    width: 100%;
    line-height: 16px;
    padding-left: 10px;
    margin-bottom: 20px;
    i {
      position: absolute;
      top: 0;
      left: -8px;
      font-size: 20px;
      color: $theme;
    }
  }
  .product-detail-box {
    .ivu-col-span-2 {
      border-right: 1px solid $borderLight;
    }
    .ivu-col-span-4 {
      border-right: 1px solid $borderLight;
    }
    .ivu-col-span-3 {
      border-right: 1px solid $borderLight;
    }
    .ivu-col-span-6 {
      border-right: 1px solid $borderLight;
    }
  }
  .content-detail-content {
    padding: 10px 0;
    border-top: 1px solid #dedede;
    .product-detail {
      border-left: 1px solid #e9eaec;
      border-right: 1px solid #e9eaec;
      border-bottom: 1px solid #e9eaec;
      font-weight: 400;
      .product-detail-flex {
        display: inline-flex;
        align-items: center;
      }
      .product-detail-img {
        position: relative;
        width: 62px;
        min-width: 62px;
        height: 62px;
        border-radius: 5px;
        margin: 0 10px 0 20px;
        img {
          width: 100%;
          height: 100%;
        }
        .credit-icon {
          position: absolute;
          width: 100%;
          height: 20px;
          line-height: 20px;
          bottom: 0;
          right: 0;
          font-size: 12px;
          font-style: italic;
          text-align: center;
          color: #fff;
          background-color: #2cdb6a;
        }
      }

      .right-info {
        width: 80%;
      }
      p {
        line-height: 20px;
      }
      .p-title {
        font-size: $f14;
        color: $font01;
      }
      .ivu-col {
        min-height: 103px;
      }
      .ivu-col-span-3,
      .ivu-col-span-2 {
        line-height: 103px;
      }
    }
    .title-entity {
      font-size: $f12;
      color: $font01;
      background: #f2f4f7;
      line-height: 54px;
      border: 1px solid $borderLight;
    }
    .company-name {
      @include ellipsis(16.66%);
      line-height: 103px;
    }
    .time {
      word-break: break-all;
    }
  }
}

.hx-box {
  .detail-text-info {
    font-size: $f12;
    color: #263b4d;
    font-weight: normal;
    line-height: 25px;
    span {
      color: $theme;
    }
  }
}
</style>
