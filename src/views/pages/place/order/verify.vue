<!--
 * @Description: In User Settings Edit
 * @Author: sunxq
 * @Date: 2019-07-15 20:28:25
 * @lastTime: 2019-11-18 11:19:22
 * @LastAuthor: 任智勇
 -->
<template>
  <div>
    <div class="verification-nav">
      <h2>消费码核销</h2>
      <div class="v-search clearfix">
        <input
          placeholder="请输入13位消费码或通过扫码枪扫码"
          type="number"
          min="1"
          :maxlength="13"
          v-model="code"
          class="v-search-box fl"
          @keydown.enter="
            () => {
              if (code.length >= 13) {
                getOrderInfo()
              }
            }
          "
        />
        <span class="v-search-btn fl unActive" v-if="code.length < 13"
          ><i class="cloud-icon icon-search">&#xe6ae;</i>搜索</span
        >
        <span class="v-search-btn fl" v-else @click="getOrderInfo"
          ><i class="cloud-icon icon-search">&#xe6ae;</i>搜索</span
        >
      </div>
    </div>
    <!-- 列表 -->
    <div class="card-list" v-if="data.length">
      <ul class="verification-content">
        <li v-for="(item, ind) in data" :key="ind">
          <div class="content-l">
            <i class="iconappointment cloud-icon">&#xe628;</i>
            <img v-if="item.headUrl" :src="item.headUrl" />
            <img v-else src="@assets/image/site-default.png" alt="" />
            <div class="information">
              <p>{{ item.userName }}</p>
              <p><i class="cloud-icon">&#xe6f6;</i> {{ item.userPhone }}</p>
            </div>
          </div>
          <div class="content-r">
            <div class="name item">
              {{ item.orderName }}
              <span
                class="type"
                v-if="item.resourceType == 'CONTENT_TYPE_VENUE'"
                >场馆预约</span
              >
            </div>
            <div class="info item">
              <span
                >预约类型：{{
                  item.reservationType == 'PERSON' ? '个人预约' : '团队预约'
                }}</span
              >
            </div>
            <div class="info item">
              <span v-if="!item.payIntegral">价格：￥{{ item.payMoney }}</span>
              <span v-if="item.payIntegral">积分：{{ item.payIntegral }}</span>
              <span class="ml10">数量：{{ item.orderNum }}</span>
            </div>
            <div class="info item">
              有效时间：{{ item.orderIndateStart }} — {{ item.orderIndateEnd }}
            </div>
            <!-- resourceType -->
            <!-- 活动是用的 地址    活动室用的是 场馆名称 -->
            <div
              v-if="item.resourceType === 'CONTENT_TYPE_ACTIVITY'"
              class="info item"
            >
              活动地点：{{ item.address }}
            </div>
            <div
              v-if="item.resourceType === 'CONTENT_TYPE_ACTIVITY_SHIU'"
              class="info item"
            >
              所属场馆：{{ item.venueName }}
            </div>
            <div v-if="item.useNum" class="info item">
              到场人数：{{ item.useNum }}
              {{ item.childNum ? `（儿童：${item.childNum}人）` : '' }}
            </div>
          </div>
        </li>
        <!--<li class="bg2">-->
        <!--<div class="content-l">-->
        <!--<img src="@/assets/image/beauty-qj.jpg">-->
        <!--<div class="information">-->
        <!--<p>测试信息</p>-->
        <!--<p><i class="cloud-icon">&#xe6f6;</i> 15198221637</p>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="content-r">-->
        <!--<div class="name">自动预约自动核销</div>-->
        <!--<div class="info">-->
        <!--价格：￥0.01&nbsp;&nbsp;&nbsp;&nbsp;数量：1&nbsp;&nbsp;&nbsp;&nbsp;有效期：<span>长期有效</span>-->
        <!--</div>-->
        <!--<div class="info">供应商：测试站点</div>-->
        <!--<div class="verification-number">-->
        <!--<label for="">核销数量：</label>-->
        <!--<div class="number">-->
        <!--<span>-->
        <!--<p class="dec">-</p>-->
        <!--</span>-->
        <!--<input type="text" />-->
        <!--<span>+</span>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</li>-->
      </ul>
      <div style="margin: 0 auto 20px auto;width:80px;">
        <button
          type="button"
          class="ivu-btn ivu-btn-primary"
          @keyup.enter="validOrder"
          @click="validOrder"
        >
          确定核销
        </button>
      </div>
    </div>
    <!-- 弹出框 -->
    <div class="valid-box" v-if="validNoNum">
      <p class="cloud-icon tc icon">&#xe79f;</p>
      <h1 class="tc">对不起，未查询到此消费码！</h1>
      <p>常见问题：</p>
      <p>1、消费码未到使用时间，可通过订单查询使用时间；</p>
      <p>2、消费码被核销或已失效；</p>
    </div>
    <div class="valid-box tc" v-show="validFailData.show">
      <p class="cloud-icon icon">&#xe79f;</p>
      <h1>核销失败</h1>
      <p>{{ validFailData.text }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { orderInfoByCode, validOrder } from '@service/place'

@Component
export default class auditResultHead extends Vue {
  private data: object = {}
  private code: any = '' // 核销码
  private validNoNum: boolean = false // 未查询到消费码
  // 核销失败
  private validFailData: object = {
    text: '',
    code: '',
    show: false
  }
  @Watch('code')
  setCodeLen() {
    this.code = this.code.substr(0, 13)
  }

  // 通过消费码获取商品信息
  getOrderInfo() {
    let _this = this
    _this.data = {}
    this.validNoNum = false
    ;(this.validFailData as any).show = false
    if (!_this.code) {
      _this.$Message.error('请输入13位消费码')
    } else {
      orderInfoByCode({
        code: _this.code,
        wrapInfo: '1' // 错误包装(固定值为1)
      }).then((res: any) => {
        if (res.code === 0) {
          _this.data = res.datas
          // 未查询到
        } else if (res.data.errorCode === 1) {
          this.validNoNum = true
          // 核销失败
        } else if (res.data.errorCode === 2) {
          ;(this.validFailData as any).show = true
          ;(this.validFailData as any).txet = '该商品已被核销'
        }
      })
    }
  }
  // 确定核销
  validOrder() {
    this.$Modal.confirm({
      title: '系统提示',
      content: '是否确认核销？',
      onOk: () => {
        this.validNoNum = false
        ;(this.validFailData as any).show = false
        validOrder({
          code: this.code,
          wrapInfo: '1' // 错误包装(固定值为1)
        }).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success('核销成功')
            // this.code = '';
          } else if (
            res.data.errorCode === 2 ||
            res.data === 2 ||
            res.data.errorCode === 1
          ) {
            ;(this.validFailData as any).show = true
            ;(this.validFailData as any).text = res.message
          }
        })
      }
    })
  }
}
</script>

<style scoped lang="scss">
.verification-nav {
  background-color: #fff;
  height: 87.5%;
  padding-bottom: 66px;
  text-align: center;
  h2 {
    height: 75px;
    line-height: 75px;
    font-size: 23px;
    color: #333;
    font-weight: 400;
  }
  .v-search {
    width: 489px;
    margin: 0 auto;
    .v-search-box {
      text-indent: 10px;
      width: 400px;
      height: 40px;
      font-size: 12px;
      color: #999;
      border-left: 1px solid $theme;
      border-top: 1px solid $theme;
      border-bottom: 1px solid $theme;
    }
    .v-search-btn {
      // display: inline-block;
      width: 88px;
      height: 40px;
      line-height: 40px;
      background-color: $theme;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      .icon-search {
        font-size: 16px;
        margin-right: 5px;
      }
      &.unActive {
        background-color: #ccc;
        cursor: not-allowed;
      }
    }
  }
}

.card-list {
  // width: 890px;
  // height: 327px;
  // background: #ccc;
  // margin: 0 auto;
  .verification-content {
    margin: 30px 40px 0 40px;
    li {
      max-width: 1152px;
      padding: 25px 0;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      border-radius: 10px;
      background: url(../../../../assets/image/verification-bg1.png) no-repeat !important;
      background-position: left top;
      background-size: 100%;
      &.bg2 {
        height: 94px;
        background: #fff;
        background-size: 100% 100%;
      }
      .content-l {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 270px;
        min-width: 270px;
        height: 100%;
        .iconappointment {
          position: absolute;
          left: -15px;
          top: 42%;
          display: inline-block;
          width: 28px;
          height: 28px;
          font-size: 17px;
          line-height: 30px;
          color: $bg01;
          text-align: center;
          background: $theme;
          border-radius: 50%;
        }
        img {
          margin: 0 6px 0 36px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
        .information {
          text-align: left;
          flex: 1;
          i {
            position: relative;
            top: 1px;
            font-size: 16px;
          }
        }
      }
      .content-r {
        position: relative;
        flex: 1;
        align-items: center;
        justify-content: center;
        margin: 0 25px;
        padding-left: 20px;
        text-align: left;
        .item {
          & + .item {
            margin-top: 5px;
          }
        }
        .name {
          font-size: 14px;
          color: #333;
          .type {
            font-size: 12px;
            color: #999;
          }
        }

        .info {
          font-size: 12px;
          color: #999;
        }
        .reserve-main {
          margin-top: 5px;
          padding: 12px;
          width: 100%;
          background-color: #fbfbe9;
          font-size: 12px;
          label {
            display: block;
            color: #666;
            margin-bottom: 5px;
          }
          span {
            display: inline-block;
            width: 250px;
            color: #333;
          }
        }
        .verification-number {
          display: inline-flex;
          position: absolute;
          text-align: center;
          top: 23%;
          right: 0;
          height: 29px;
          label {
            display: inline-block;
            line-height: 29px;
            font-size: 14px;
            color: #333;
          }
          .number {
            width: 97px;
            height: 29px;
            line-height: 29px;
            border-radius: 4px;
            background-color: #95bffb;
            span {
              position: relative;
              display: inline-block;
              width: 30px;
              line-height: 30px;
              color: #fff;
              font-size: 30px;
              cursor: pointer;
              .dec {
                position: absolute;
                top: -28px;
                left: 10px;
              }
            }
            input {
              display: inline-block;
              width: 35px;
              text-align: center;
              height: 27px;
              line-height: 27px;
              vertical-align: text-bottom;
              background-color: #fff;
            }
          }
        }
      }
      border: 1px solid $bg01;
      &:hover {
        border: 1px solid $success-hover;
      }
      &.active {
        border: 1px solid $success-active;
      }
    }
  }
}
.valid-box {
  width: 400px;
  margin: 0 auto;
  padding: 40px 50px;
  background: #eeefef;
  p {
    line-height: 25px;
  }
  h1 {
    font-size: 16px;
    font-weight: normal;
    margin: 10px 0;
  }
  .icon {
    font-size: 30px;
    color: red;
  }
}
</style>
