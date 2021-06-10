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
        <Steps v-else :current="getCurrStep(desc.orderStatus)">
          <Step
            title="下单"
            icon="iconfont c-icon-xiadan"
            :content="desc.createTime"
          ></Step>
          <Step title="消费" icon="iconfont c-icon-xiaofei"></Step>
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
      <div class="pt20 ivu-col ivu-col-span-8">
        <div class="detail-text-info">
          <span class="detail-text-label">预约备注</span>
          <span class="detail-text-text">{{ desc.remark }}</span>
        </div>
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="content-main">
      <div class="content-detail-title">
        <p class="title-tool"><i class="cloud-icon">&#xe697;</i> 商品信息</p>
        <div class="content-detail-content product-detail-box">
          <div class="title-entity ivu-row mt20">
            <div class="ivu-col ivu-col-span-10" style="padding-left:20px;">
              商品信息
            </div>
            <div class="ivu-col ivu-col-span-4 tc">有效期</div>
            <div class="ivu-col ivu-col-span-2 tc">使用人数</div>
            <div class="ivu-col ivu-col-span-2 tc">支付金额</div>
            <div class="ivu-col ivu-col-span-2 tc">支付积分</div>
            <div class="ivu-col ivu-col-span-2 tc">退单数量</div>
            <div class="ivu-col ivu-col-span-2 tc">已核销数</div>
          </div>
          <div class="product-detail entity ivu-row">
            <div class="ivu-col ivu-col-span-10 product-detail-flex">
              <div class="ml15 product-detail-img daq-no-photo">
                <img :src="desc.cover" class="ml15" v-if="desc.cover" />
                <span class="credit-icon" v-if="desc.faithAuditStatus == 1"
                  >诚信免审</span
                >
              </div>
              <div class="right-info">
                <p class="mt20 p-title">{{ desc.orderName }}</p>
                <p>活动地点：{{ desc.address }}</p>
              </div>
            </div>
            <div class="ivu-col ivu-col-span-4 tc">
              <p class="mt20">{{ desc.orderIndateStart }}</p>
              <p>至</p>
              <p>{{ desc.orderIndateEnd }}</p>
            </div>
            <div class="ivu-col ivu-col-span-2 tc">{{ desc.useNum }}</div>
            <div class="ivu-col ivu-col-span-2 tc">{{ desc.payMoney }}</div>
            <div class="ivu-col ivu-col-span-2 tc">{{ desc.payIntegral }}</div>
            <div class="ivu-col ivu-col-span-2 tc">{{ desc.backNum }}</div>
            <div class="ivu-col ivu-col-span-2 tc">{{ desc.consumeNum }}</div>
          </div>
        </div>
      </div>
      <div class="content-detail-title">
        活动室信息
        <div class="content-detail-content">
          <div class="ivu-row">
            <div class="ivu-col ivu-col-span-8">
              <div class="detail-text-info">
                <span class="detail-text-label">活动室类型</span>
                <span class="detail-text-text">{{
                  activityRoomDesc.labelName || '暂无'
                }}</span>
              </div>
            </div>
            <div class="ivu-col ivu-col-span-8">
              <div class="detail-text-info">
                <span class="detail-text-label">联系地址</span>
                <span class="detail-text-text">{{
                  activityRoomDesc.address || '暂无'
                }}</span>
              </div>
            </div>
            <div class="ivu-col ivu-col-span-8">
              <div class="detail-text-info">
                <span class="detail-text-label">面积</span>
                <span class="detail-text-text"
                  >{{ activityRoomDesc.area || '暂无'
                  }}<em v-if="activityRoomDesc.area">㎡</em></span
                >
              </div>
            </div>
            <div class="ivu-col ivu-col-span-8">
              <div class="detail-text-info">
                <span class="detail-text-label">容纳人数</span>
                <span class="detail-text-text">{{
                  activityRoomDesc.galleryful || '暂无'
                }}</span>
              </div>
            </div>
            <div class="ivu-col ivu-col-span-8">
              <div class="detail-text-info">
                <span class="detail-text-label">服务电话</span>
                <span class="detail-text-text">{{
                  activityRoomDesc.phone || '暂无'
                }}</span>
              </div>
            </div>
            <div class="ivu-col ivu-col-span-8">
              <div class="detail-text-info">
                <span class="detail-text-label">设备</span>
                <span class="detail-text-text">{{
                  activityRoomDesc.equipment || '暂无'
                }}</span>
              </div>
            </div>
            <div class="ivu-col ivu-col-span-8">
              <div class="detail-text-info">
                <span class="detail-text-label">取消设置</span>
                <span
                  class="detail-text-text"
                  v-if="activityRoomDesc.cancelStatus == 0"
                  >不可取消</span
                >
                <span
                  class="detail-text-text"
                  v-else-if="activityRoomDesc.cancelStatus == 1"
                  >随时取消</span
                >
                <span
                  class="detail-text-text"
                  v-else-if="activityRoomDesc.cancelStatus == 2"
                  >开始使用24小时前可取消</span
                >
                <span
                  class="detail-text-text"
                  v-else-if="activityRoomDesc.cancelStatus == 3"
                  >开始使用前{{ activityRoomDesc.cancelTime }}小时前可取消</span
                >
              </div>
            </div>
            <div
              class="ivu-col ivu-col-span-10"
              v-if="
                activityRoomDesc.faithAuditStatus == 1 && creditStatus === 1
              "
            >
              <div class="detail-text-info">
                <span class="detail-text-label">诚信免审</span>
                <span class="detail-text-text"
                  >用户分值达{{
                    activityRoomDesc.faithAuditValue
                  }}分以上可享受预约免审核权益</span
                >
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
import { Component, Vue } from 'vue-property-decorator'
import { orderDesc, restartCode, orderActivityRoomInfo } from '@service/place'
import { AppModule } from '@store/modules/app'

@Component({
  components: {}
})
export default class RoomOrderDetail extends Vue {
  get creditStatus() {
    return AppModule.siteInfo.creditStatus
  }
  /*S 活动室预约订单详情信息*/
  private desc: object = {}

  getDesc() {
    orderDesc({
      id: this.$route.query.id
    }).then((res: any) => {
      let covers = res.data.image.split(',')
      res.data.cover = covers[0]
      this.desc = res.data
    })
  }

  /*E 详情信息*/

  /*S 活动室详情信息*/
  private activityRoomDesc: object = {}

  getActivityDesc() {
    orderActivityRoomInfo({
      id: this.$route.query.activityId
    }).then((res: any) => {
      this.activityRoomDesc = res.data
    })
  }
  /*E 活动室详情信息*/

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
      1: [1, 3],
      2: [4],
      3: [2, 12]
    }
    for (let attr in steps) {
      if (steps[attr].includes(status)) return parseInt(attr) - 1
    }
  }
  mounted() {
    //预约详情
    this.getDesc()
    //活动详情
    this.getActivityDesc()
  }
  beforeRouteUpdate(to: any, from: any, next: Function) {
    //预约详情
    this.getDesc()
    //活动详情
    this.getActivityDesc()
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
    .ivu-col-span-10 {
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
