<template>
  <Modal v-model="in_show" width="1000" footer-hide draggable @on-cancel="onClose">
    <h3 class="title" slot="header">与 未知用户 的聊天记录 {{`全部${total}条记录`}}</h3>
    <div class="layim-chat-main" ref="listbox">
      <p v-if="noPrev" class="no-history">没有更多历史</p>
      <ul>
        <template v-for="data in recordList">
          <li :key="data.id + '-q'" :ref="data.position && 'position'">
            <div class="layim-chat-user"><img src="@assets/image/daq-no-data.png">
              <cite>未知用户<i>{{ data.createTime }}</i></cite>
            </div>
            <div class="layim-chat-text">{{ data.question || '&nbsp;' }}</div>
          </li>

          <li class="layim-chat-mine" :key="data.id + '-a'" :ref="data.preveLastItem">
            <div class="layim-chat-user"><img src="@assets/image/site-default.png">
              <cite><i>{{ data.createTime }}</i>机器人</cite>
            </div>
            <div class="layim-chat-text">{{ data.answer || '&nbsp;' }}</div>
          </li>
        </template>
      </ul>
      <p v-if="noNext" class="no-history">已是最新内容</p>
    </div>
  </Modal>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { getRecordList } from "@service/tool";
// import defaultUserPhoto from "@assets/image/daq-no-data.png";
// import defaultRobotPhoto from "@assets/image/site-default.png";

@Component({ components: { } })
export default class ChatRecord extends Vue {
  @Prop({ default: false }) private show!: boolean; // 显示/影藏
  private in_show:boolean = this.show;
  @Watch("show")
  refreshShow(show: boolean) {
    this.in_show = show
    if (show) {
      // this.pageList = [];
      // this.recordList = [];
      // this.noPrev = false;
      // this.noNext = false;
      // this.totalPage = 0;
      // this.condition.currPage = undefined;
      // this.getList();
      if (this.pageList.length) {
        this.toPosition()
      } else {
        this.getList()
      }
    }
  }
  @Prop({ default: () => {} }) private propParams!: {
    currPage: number;
    id: number;
  }; // 传递的请求参数

  created() {
    this.onLineFn = this.limit(this.onLineFn, 150)
    if (this.propParams) Object.assign(this.condition, this.propParams);
  }

  private totalPage: number = 0;
  private total: number = 0;
  // 列表数据
  private recordList: Array<any> = [];
  // page记录
  private pageList: Array<number> = [];
  // 查询条件
  private condition: any = {
    currPage: undefined,
    id: "",
  };
  private loading: boolean = false
  // 获取列表数据的方法
  private getList() {
    this.loading = true;
    getRecordList(this.condition)
      .then((res: any) => {
        if (res.code === 0) {
          let { currPage } = this.condition
          let firstPage = this.pageList[0]
          let lastPage = this.pageList[this.pageList.length - 1]
          let resList = res.data.recordList;
          if (this.pageList.length) {
            if (currPage < firstPage) { // 查看更久以前
              resList[resList.length - 1].preveLastItem = 'prevelastitem' + currPage;
              this.recordList.unshift(...resList)
              this.pageList.unshift(currPage)
              // 延迟到宏任务执行，此时dom渲染完成
              setTimeout(() => {
                let top: number = (this.$refs.listbox as any).scrollTop;
                let prevelastitem: any = (this.$refs[`prevelastitem${currPage}`] as any)[0];
                let addTop: number = prevelastitem.offsetTop + prevelastitem.clientHeight + 10; // 10为margin-bottom
                (this.$refs.listbox as any).scrollTop = top + addTop
              }, 0)
            } else if (currPage > lastPage) { // 查看更近
              this.recordList.push(...resList)
              this.pageList.push(currPage)
            }
          } else {
            resList.forEach((ele:any, i:number) => {
              if (i === res.data.positionNum - 1) {
                ele.position = true
              }
            });
            this.recordList = resList
            this.pageList = [res.data.currPage]
            this.totalPage = res.data.totalPage
            this.total = res.data.total * 2
            this.toPosition()
          }
          if (this.pageList[0] === 1) {
            // 上 莫得更多
            this.noPrev = true
          }
          if (this.pageList[this.pageList.length - 1] === this.totalPage) {
            // 下 莫得更多
            this.noNext = true
          }
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  // 定位到问题点
  private toPosition () {
    // 延迟到宏任务执行，此时dom渲染完成
    setTimeout(() => {
      let top: number = (this.$refs.position as any[])[0].offsetTop;
      (this.$refs.listbox as any).scrollTop = top
    }, 0)
  }

  mounted() {
    (this.$refs.listbox as Element).addEventListener('scroll', this.onLineFn)
  }
  beforeDestroy() {
    (this.$refs.listbox as Element).removeEventListener("scroll", this.onLineFn);
  }

  // 节流函数: 1.第一次调用立即执行，后续调用间隔时长大于time才调用成功 2.全是频繁调用时最后一次频繁调用会执行
  // 大于1次的多次调用，最终至少会调用两次（第一次立即调用 + 最后一次调用）
  private limit(fn: Function, time: number): any {
    let t: number | undefined;
    return (e:Event) => {
      clearTimeout(t);
      let execute: boolean = false; // fn是否被执行；如此处理目的解决这个问题：每次都是“频繁”调用，需要保证最后一次频繁调用成功
      if (!t) {
        fn();
        execute = true
      };
      t = setTimeout(() => {
        t = undefined;
        if (!execute) fn();
      }, time)
    }
  }
  
  private noPrev: boolean = false;
  private noNext: boolean = false;
  // 临界点加载数据
  private onLineFn() {
    let listbox = (this.$refs.listbox as any)
    let top = listbox.scrollTop
    let clientHeight = listbox.clientHeight
    let scrollHeight = listbox.scrollHeight
    if (top === 0) {
      // 加载上一页
      // 上一页加载后定位scroll：加载回的最后一条数据的offsetTop + 其clientHeight + 当前容器的scrollTop
      if (this.pageList[0] > 1) {
        this.condition.currPage = this.pageList[0] - 1
        this.getList()
      }
    } else if (top + clientHeight === scrollHeight) {
      // 加载下一页
      // 下一页加载后定位scroll：直接放入不需要处理
      if (this.pageList[this.pageList.length - 1] < this.totalPage) {
        this.condition.currPage = this.pageList[this.pageList.length - 1] + 1
        this.getList()
      }
    }
  }

  // 弹窗关闭时
  private onClose() {
    this.$emit("onClose", false);
  }
}
</script>

<style lang='scss' scoped>
.title {
  font-size: 16px;
  color: #333;
  font-weight: normal;
  line-height: 20px;
}
.layim-chat-main {
  overflow-x: hidden;
  overflow-y: auto;
  height: 600px;
  position: relative;
  &.hide-li {
    li {
      opacity: 0;
    }
  }
  img {
    display: inline-block;
    border: none;
    vertical-align: middle;
  }
  .layim-chat-mine {
    text-align: right;
    padding-left: 0;
    padding-right: 60px;

    .layim-chat-user {
      left: auto;
      right: 3px;
      cite {
        left: auto;
        right: 60px;
        text-align: right;
        i {
          padding-left: 0;
          padding-right: 15px;
        }
      }
    }

    .layim-chat-text {
      margin-left: 0;
      text-align: left;
      background-color: #23a1ee;
      color: #fff;
      &:after {
        left: auto;
        right: -10px;
        border-top-color: #23a1ee;
      }
    }
  }
  ul li {
    position: relative;
    font-size: 0;
    margin-bottom: 10px;
    padding-left: 60px;
    min-height: 68px;
    .layim-chat-user {
      position: absolute;
      left: 3px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 100%;
        box-shadow: 0 0 5px #ccc;
      }
      cite {
        position: absolute;
        left: 60px;
        top: -2px;
        width: 500px;
        line-height: 24px;
        font-size: 12px;
        white-space: nowrap;
        color: #999;
        text-align: left;
        font-style: normal;
        i {
          padding-left: 15px;
          font-style: normal;
        }
      }
    }
    .layim-chat-text {
      position: relative;
      line-height: 22px;
      margin-top: 25px;
      padding: 8px 15px;
      background-color: #e2e2e2;
      border-radius: 3px;
      color: #333;
      word-break: break-all;
      img {
        max-width: 100%;
        vertical-align: middle;
      }
      &:after {
        content: "";
        position: absolute;
        left: -10px;
        top: 13px;
        width: 0;
        height: 0;
        border-style: dashed;
        border-color: transparent;
        overflow: hidden;
        border-width: 10px;
        border-top-style: solid;
        border-top-color: #e2e2e2;
      }
    }
  }
  .layim-chat-user,
  .layim-chat-text {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    vertical-align: top;
    font-size: 14px;
  }
}
.no-history {
  text-align: center;
  color: #999;
}
</style>
