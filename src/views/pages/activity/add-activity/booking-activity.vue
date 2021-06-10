<!--
 * @Author: 任智勇
 * @since: 2019-05-23 09:02:49
 * @LastAuthor: 任智勇
 * @lastTime: 2019-07-15 10:05:38
 -->
<template>
  <div class="activity">
    <!-- 进度条 -->
    <ul class="header-goods">
      <li class="active">
        <em class="demo2"></em><span class="demo1 hasNo"></span
        ><span>1 创建活动</span>
      </li>
      <li>
        <em class="demo2 noRightM"></em>
        <!--<span class="demo1 noBorder"></span>--><span>2 编辑活动内容</span>
      </li>
    </ul>
    <!-- 选择活动类型 -->
    <div class="add-content-detail-title mt20">
      <p class="title-tool"><i class="cloud-icon">&#xe697;</i> 选择活动类型</p>
      <div class="add-content-detail-content">
        <div class="typeBox w1100 clearfix">
          <div
            class="items clearfix ml15"
            @click="chooseType(item)"
            :class="{ active: classify === item.activityType }"
            v-for="(item) in list"
            :key="item.activityType"
          >
            <span v-if="classify === item.activityType"
              ><i class="cloud-icon">&#xe628;</i></span
            >
            <div class="left-icon fl ml20" :style="{backgroundImage: `url(${item.images.split(',')[0]})`}"></div>
            <div class="right fl">
              <p class="titles">{{ item.name }}</p>
              <p>{{ item.remark }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择活动方式 -->
    <div class="add-content-detail-title mt20">
      <p class="title-tool"><i class="cloud-icon">&#xe697;</i> 选择活动方式</p>
      <div class="add-content-detail-content">
        <div class="ActivityType w1100">
          <div
            class="items"
            v-for="item in childList"
            :key="item.activityType"
            @click="chooseActivityType(item.activityType)"
            :class="{ active: method === item.activityType }"
          >
            <span v-if="method === item.activityType"
              ><i class="cloud-icon">&#xe628;</i></span
            ><img :src="item.images" />
            <div>
              <p class="saleTitles">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <router-link
        :to="{ path: nextPage, query: { classify: classify, method: method } }"
      >
        <button type="button" class="mr20 mt30 ivu-btn ivu-btn-success">
          <span>下一步</span>
        </button>
      </router-link>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Watch, Vue } from "vue-property-decorator";
import { getStatusTxt, getActivityEditPath } from "@util/comm";
import { roleActivityTypeList } from "@service/activity";

@Component
export default class BookingActivity extends Vue {
  private classify: any = "";
  private method: string = "";
  mounted() {
    this.getList();
  }
  /*S 活动分类列表 */
  list: any = [];
  childList: any = [];
  getList() {
    roleActivityTypeList({}).then((res: any) => {
      if (res.code === 0) {
        this.list = res.datas;
        this.classify=res.datas[0].activityType;
        this.childList=res.datas[0].childs;
        this.method=this.childList[0].activityType;
      }
    });
  }
  /*E 活动分类列表*/
  // 选择活动类型
  chooseType(item: any) {
    this.classify = item.activityType;
    this.childList = item.childs;
    this.method=item.childs[0].activityType;
  }
  // 选择活动方式
  chooseActivityType(productSaleType: string) {
    this.method = productSaleType;
  }
  beforeRouteLeave(to: any, from: any, next: Function) {
    to.meta.title = getStatusTxt[this.method];
    next();
  }
  get nextPage() {
    return getActivityEditPath({ method: this.method });
  }
}
</script>

<style lang='scss' scoped>
.w1100 {
  /*width: 1100px;*/
  max-width: 1100px;
}
.ml15 {
  margin-left: 15px;
}

// 进度条
.header-goods {
  /*width: 1120px;*/
  max-width: 1120px;
  overflow: hidden;
  background: $bg01;
  padding: 20px 0 0 20px;
  font-size: 0;
  li {
    position: relative;
    width: 50%;
    float: left;
    font-size: 16px;
    color: #595961;
    height: 45px;
    line-height: 45px;
    background: #f2f2f6;
    .demo1 {
      width: 0;
      height: 0;
      /*overflow: hidden;*/
      font-size: 0;
      position: absolute;
      right: -24px;
      border-top: 23px solid #f2f2f6;
      border-right: 23px solid #f2f2f6;
      border-bottom: 22px solid #f2f2f6;
      border-left: 40px solid $bg01;
      z-index: 1;
      &:after {
        content: "";
        position: absolute;
        left: -47px;
        top: -24px;
        width: 7px;
        height: 46px;
        background: #fff;
      }
    }
    .demo2 {
      width: 0;
      height: 0;
      /*overflow: hidden;*/
      font-size: 0;
      position: absolute;
      right: -17px;
      border-top: 23px solid transparent;
      border-right: 23px solid transparent;
      border-bottom: 22px solid transparent;
      border-left: 40px solid #f2f2f6;
      z-index: 2;
    }
    span:last-child {
      position: relative;
      left: 40%;
    }
    &:nth-child(2) {
      /*margin-left: -46px;*/
      .demo2 {
        right: -23px;
        border-color: #fff;
        border-left-color: #f2f2f6;
      }
    }
    .noBorder {
      border-bottom: 24px solid $bg01 !important;
      border-left: 25px solid $bg01;
    }
    &.active {
      background: #6ed35e;
      color: $bg01;
      border-right: none;
      border-left: none;
      position: relative;
      .demo1 {
        border-top: 23px solid #6ed35e;
        border-right: 23px solid #6ed35e;
        border-bottom: 22px solid #6ed35e;
        border-left: 40px solid $bg01;
      }
      .demo2 {
        border-top: 23px solid transparent;
        border-right: 23px solid transparent;
        border-bottom: 22px solid transparent;
        border-left: 40px solid #6ed35e;
      }
    }
    .hasNo {
      border-top: 23px solid #f2f2f6 !important;
      border-right: 23px solid #f2f2f6 !important;
      border-bottom: 22px solid #f2f2f6 !important;
      border-left: 40px solid $bg01;
    }
    .hasWirte,
    .noBorder {
      border-top: 23px solid $bg01 !important;
      border-right: 23px solid $bg01 !important;
      right: 0 !important;
    }
    .hasNo {
      border-top: 23px solid #f2f2f6 !important;
      border-right: 23px solid #f2f2f6 !important;
      border-bottom: 22px solid #f2f2f6 !important;
      border-left: 40px solid $bg01;
    }
    .hasWirte,
    .noBorder {
      border-top: 23px solid $bg01 !important;
      border-right: 23px solid $bg01 !important;
      right: 0 !important;
    }
  }
}
// 活动类型
.add-content-detail-title {
  padding: 0 20px;
  .title-tool {
    position: relative;
    width: 100%;
    line-height: 16px;
    font-size: 14px;
    font-weight: bold;
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
  .add-content-detail-content {
    padding: 10px 0;
    border-top: 1px solid #dedede;
    // 类型样式
    .typeBox {
      // overflow: hidden;
      // padding: 10px 0;
      margin-left: -15px;
      .items {
        float: left;
        width: calc((100% - 45px) / 4);
        height: 110px;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        margin-top: 10px;
        padding: 20px 0;
        border: 1px solid $borderLight;
        border-radius: 5px;
        span {
          display: inline-block;
          width: 29px;
          height: 29px;
          background: url(./../../../../assets/image/checkBg.png);
          position: absolute;
          bottom: 0;
          right: 0;
          i {
            position: relative;
            left: 5px;
            top: 5px;
            font-size: $f12;
            color: $bg01;
            text-align: center;
            line-height: 31px;
            font-weight: normal;
            display: block;
          }
        }
        &:hover {
          box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1),
            -5px 0 10px rgba(0, 0, 0, 0.1);
        }
        &.active {
          background: #e9f5fd;
          border: 1px solid $theme;
        }
        img {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          margin: 16px 0 0 15px;
          position: absolute;
        }
        // .icon-01 {
        //   background: url(./../../../../assets/image/activity_icon1.png)
        //     no-repeat center;
        // }
        // .icon-02 {
        //   background: url(./../../../../assets/image/activity_icon2.png)
        //     no-repeat center;
        // }
        // .icon-03 {
        //   background: url(./../../../../assets/image/activity_icon3.png)
        //     no-repeat center;
        // }
        // .icon-04 {
        //   background: url(./../../../../assets/image/activity_icon4.png)
        //     no-repeat center;
        // }
        .left-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          text-align: center;
          color: $bg01;
          font-size: 30px;
          background-repeat: no-repeat;
          background-position: center;
        }
        .right {
          margin-left: 20px;
          p {
            padding: 0;
            margin: 0;
            font-size: $f12;
            color: $lightGray;
            line-height: 16px;
            font-weight: normal;
            &.titles {
              font-size: 14px;
              color: #595961;
              margin: 16px 0 8px 0;
            }
            &.product {
              margin-top: 25px;
            }
          }
        }
      }
    }
  }
}
//活动方式
.ActivityType {
  overflow: hidden;
  padding-bottom: 10px;
  margin-left: -15px;
  .items {
    float: left;
    width: calc((100% - 45px) / 4);
    background: $bg01;
    border: 1px solid $borderLight;
    border-radius: 5px;
    padding: 9px 9px 0 9px;
    cursor: pointer;
    position: relative;
    font-size: 0;
    margin: 10px 0 0 15px;
    span {
      display: inline-block;
      width: 28px;
      height: 28px;
      background: url(./../../../../assets/image/checkBg.png);
      position: absolute;
      bottom: 0;
      right: 0;
      i {
        position: relative;
        left: 5px;
        top: 5px;
        font-size: $f12;
        color: $bg01;
        text-align: center;
        line-height: 31px;
        font-weight: normal;
        display: block;
      }
    }
    &:hover {
      box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1),
        -5px 0 10px rgba(0, 0, 0, 0.1);
    }
    &.active {
      background: #e9f5fd;
      border: 1px solid $theme;
    }
    img {
      width: 100%;
      height: 137px;
      float: left;
    }
    div {
      p {
        padding: 0;
        margin: 0;
        font-size: $f12;
        color: #595961;
        line-height: 52px;
        font-weight: bold;
        text-align: center;
      }
    }
  }
}
.ivu-btn-success {
  width: 130px;
  height: 40px;
  border: 1px solid $theme;
  background: $theme;
}
</style>

