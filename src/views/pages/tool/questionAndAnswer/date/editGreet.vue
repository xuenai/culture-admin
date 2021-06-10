<template>
  <div class="container">
    <h3 class="title">设置问候语</h3>
    <div class="item">
      <p class="key">时间范围</p>
      {{ range ? range.start + ' 至 ' + range.end : '' }}
    </div>
    <div class="item">
      <p class="key">问候语</p>
      <Input class="value" :maxlength="100" v-model="params.greetings" placeholder="请输入问候语" />
    </div>
    <div class="buttons">
      <a class="key" @click="clickSetLink">插入链接</a>
      <a class="key" @click="clickSetContent">插入文章</a>
      <a class="key" @click="clickSetActivity">插入活动</a>
      <a class="key" @click="clickSetProduct">插入商品</a>
      <a class="key" @click="clickSetPlace">插入场所</a>
      <!-- <a class="key">插入预约</a> -->
    </div>
    <template v-if="showByLink">
      <Input class="source" placeholder="请输入链接" v-model="params.url" />
      <Input class="source" placeholder="请输入APP端链接" v-model="params.appUrl" />
    </template>
    <p class="source" v-else-if="params.resourceName">{{ params.resourceName }}
      <i class="cloud-icon" @click="deleteSource">&#xe6da;</i>
    </p>

    <div class="item upload-excel line1">
      <input accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" type="file" @change="acceptExcel($event)" />
      <a class="key">导入模板</a>
      <span :title="fileName">{{ importExcelStatus }} {{ fileName }}</span>
    </div>
    <div class="item">
      <a class="key" @click="exportExcel()">下载模板</a>
    </div>
    <Button type="primary" style="width: 100%;" @click="saveDailyGreetings">保存</Button>

    <ContentPop v-model="showContentPop" @onOkClick="selectContent" :checkWay="0"></ContentPop>
    <uninPlace :show="place" :orgId="$store.state.app.userInfo.orgId" title="添加场所" :isRadio="true"
      @onOkClick="selectPlace" @onClose="place=false"></uninPlace>
    <uninProduct :show="product" @onOkClick="selectProduct" @onClose="product=false" :isRadio="true">
    </uninProduct>
    <uninActivity :show="activity" title="添加活动" @onOkClick="selectActivity" :isRadio="true"
      @onClose="activity=false"></uninActivity>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import ContentPop from "@components/pop/content-pop.vue";
import uninPlace from "@components/uninPlace/uninPlace.vue";
import uninProduct from "@components/uninProduct/uninProduct.vue";
import uninActivity from "@components/uninActivity/uninActivity.vue";
import { saveDailyGreetings, robotImportExc } from "@service/tool";
import { AppModule } from "@store/modules/app";
import { importExcelComplete, exportExcel } from "@util/comm";
import CONFIG from "@/util/config";

@Component({
  components: {
    ContentPop,
    uninPlace,
    uninProduct,
    uninActivity
  }
})
export default class ComponentName extends Vue {
  @Prop() private range!: any;
  @Watch("range", { deep: true, immediate: true })
  wRange(v: any) {
    if (v && v.start === v.end && v.tip) {
      this.fillSource(v.tip)
    } else {
      this.resetSource()
    }
  }

  private params: any = {
    resourceName: "",
    resourceType: "",
    resourceId: "",
    greetings: "",
    appUrl: "",
    url: "",
    startDate: "",
    endDate: "",
    dayOfWeeks: 'MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY'
  }
  private saveDailyGreetings() {
    let { params } = this;
    if (params.startDate) {
      saveDailyGreetings(params).then((res:any) => {
        if (res.code === 0) {
          this.$Message.success("保存成功")
          // 对外通知
          this.$emit('saveFinish', true);
        }
      })
    } else {
      this.$Message.info('请选择时间范围')
    }
  }
  // 重置
  private resetSource() {
    this.params = {
      resourceName: "",
      resourceType: "",
      resourceId: "",
      greetings: "",
      appUrl: "",
      url: "",
      startDate: this.range ? this.range.start : '',
      endDate: this.range ? this.range.end : '',
      dayOfWeeks: 'MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY'
    }
  }
  private deleteSource() {
    this.params.resourceId = ''
    this.params.resourceType = ''
    this.params.resourceName = ''
    this.params.url = ''
  }
  // 填值
  private fillSource(source: any) {
    this.params.resourceName = source.resourceName
    this.params.resourceType = source.resourceType
    this.params.resourceId = source.resourceId
    this.params.greetings = source.greetings
    this.params.appUrl = source.appUrl
    this.params.url = source.url
    // 这里startDate和endDate相同不要误会，因为是一天
    this.params.startDate = source.specificDate
    this.params.endDate = source.specificDate
    // 1. url存在和resourceName存在定为是商品选择的
    // 2. source.resourceId
    if ((source.url && source.resourceName) || source.resourceId) { // 不是插入链接的其他四种情况
      this.showByLink = false
    } else if (source.url || source.appUrl) { // 是插入链接 链接还存在的情况
      this.showByLink = true
    } else { // 不是插入链接 也不是其他四种情况 页面上那里什么都不显示
      this.showByLink = false
    }
  }
  //获取token
  get token() {
    return AppModule.token;
  }
  private fileName: string = "";
  private importExcelStatus: string = '';
  private acceptExcel(e: any) {
    let files = e.target.files;
    this.fileName = files[0].name;
    this.importExcelStatus = '正在导入';
    let formData = new FormData();
    formData.append("file", files[0]);
    formData.append("token", this.token);
    robotImportExc(formData).then((blob: any) => {
      importExcelComplete(blob)
        .then(res => {
          this.$Message.success("导入成功");
          this.importExcelStatus = '导入成功';
        })
        .catch(res => {
          this.importExcelStatus = '存在导入失败';
        })
    }).catch(() => this.importExcelStatus = '导入失败')
      .finally(() => {
      e.target.value = null
      // 对外通知
      this.$emit('saveFinish', true);
    });
  }
  private selectContent(list: any[]) {
    this.params.resourceId = list[0].id
    this.params.resourceType = "CONTENT"
    this.params.resourceName = list[0].title
    this.showByLink = false
    // 重置插入链接的输入
    this.params.url = ''
    this.params.appUrl = ''
  }
  private selectActivity(list: any) {
    this.params.resourceId = list.id
    this.params.resourceType = "CONTENT_TYPE_ACTIVITY"
    this.params.resourceName = list.name
    this.showByLink = false
    // 重置插入链接的输入
    this.params.url = ''
    this.params.appUrl = ''
  }
  private selectProduct(list: any) {
    this.params.resourceId = ''
    this.params.resourceType = ""
    this.params.resourceName = list.productName
    this.params.url = list.url
    this.showByLink = false
    // 重置插入链接的输入
    this.params.appUrl = ''
    this.urlIsProduct = true
  }
  private selectPlace(list: any[]) {
    this.params.resourceId = list[0].id
    this.params.resourceType = list[0].resourceType
    this.params.resourceName = list[0].name
    this.showByLink = false
    // 重置插入链接的输入
    this.params.url = ''
    this.params.appUrl = ''
  }

  private place = false;
  private product = false;
  private activity = false;
  private showByLink = false;
  private showContentPop: boolean = false;

  private urlIsProduct: boolean = false // url字段，插入链接在用，插入商品也是它，就需要加个变量判断当前保存的是哪个
  private clickSetLink() {
    this.showByLink = true
    // 重置其他同级选项
    this.params.resourceId = ''
    this.params.resourceType = ''
    this.params.resourceName = ''
    if (this.urlIsProduct === true) {
      this.params.url = ''
    } else {
      this.urlIsProduct = false
    }
  }
  private clickSetContent() {
    this.showContentPop = true
  }
  private clickSetActivity() {
    this.activity = true
  }
  private clickSetProduct() {
    this.product = true
  }
  private clickSetPlace() {
    this.place = true
  }

  private exportExcel() {
    exportExcel(CONFIG.defaultUrl + '/res/robot/downloadTemplate?token=' + this.token);
  }
}
</script>

<style lang='scss' scoped>
.container {
  display: block;
  width: 370px;
  max-height: 504px;
  padding: 0 15px 15px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  cursor: default;
  .title {
    line-height: 35px;
    font-size: 12px;
  }
  .item {
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0;
    line-height: 32px;
    font-size: 12px;
    .key {
      width: 60px;
      padding-right: 10px;
      text-align: right;
      font-size: 12px;
    }
    .value {
      flex: 1;
      min-width: 250px;
    }
  }
  .buttons {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }
  .source {
    margin: 10px 0 0;
    font-size: 12px;
    .cloud-icon {
      cursor: pointer;
      &:hover {
        color: #ccc;
      }
    }
  }
  .upload-excel {
    width: 100%;
    display: inline-block;
    position: relative;
    input {
      width: 50px;
      height: 14px;
      top: 8px;
      position: absolute;
      z-index: 9;
      opacity: 0;
    }
  }
}
</style>
