<template>
  <div class="add-content-box page-slogan-add">
    <Form class="content list" ref="params" :model="params" :rules="ruleValidate"
      :label-width="120">
      <div>
        <FormItem class="formItem" label="创建者" prop="siteId">
          <Select class="width300" v-model="params.siteId" disabled>
            <Option v-for="item in createrList" :value="item.id" :key="item.id">
              {{ item.name }}
            </Option>
          </Select>
        </FormItem>
      </div>
      <FormItem class="formItem" label="品牌名称" prop="name">
        <Input placeholder="请填写文旅品牌名称" class="width300" v-model="params.name" :maxlength="35" />
      </FormItem>
      <FormItem class="formItem" label="品牌口号" prop="slogan">
        <Input placeholder="请填写文旅品牌口号" class="width300" v-model="params.slogan" :maxlength="35" />
      </FormItem>
      <FormItem class="formItem" label="关联景区" prop="scenicStr">
        <span class="scenic" v-for="(item,i) in checkedScenicList"
          :key="item.id">{{ item.name }}<span @click="checkedScenicList.splice(i,1)"></span></span>
        <Button type="primary" @click="showScenicList = true">添加</Button>
      </FormItem>
      <FormItem>
        <UploadImg2 @getImagesList="list => params.brandIcon = list[0] ? list[0].url : '' "
          :defaultImage="defaultBrandIcon" :limit="1">
        </UploadImg2>
        <FormItem label="品牌图标" class="activity-img" prop="brandIcon"></FormItem>
      </FormItem>
      <FormItem>
        <UploadImg2 @getImagesList="list => params.brandLogo = list[0] ? list[0].url : '' "
          :defaultImage="defaultBrandLogo" :limit="1">
        </UploadImg2>
        <FormItem label="品牌logo" class="activity-img" prop="brandLogo"></FormItem>
      </FormItem>
      <FormItem>
        <UploadImg2 @getImagesList="list => params.brandImage = list[0] ? list[0].url : '' "
          :defaultImage="defaultBrandImage" :limit="1">
        </UploadImg2>
        <FormItem label="品牌主图" class="activity-img" prop="brandImage"></FormItem>
      </FormItem>
      <FormItem label="品牌介绍" prop="suggest">
        <div class="uedit">
          <Ueditor v-model="params.suggest" id="uedit1"></Ueditor>
        </div>
      </FormItem>

      <FormItem class="formItem" label="">
        <Button @click="handleSave(1)" type="primary">保存</Button>
        <Button @click="handleSave(3)" v-if="showDraft" type="primary" class="ml10">存草稿</Button>
        <Button type="primary" class="ml10 return" @click="back">返回</Button>
      </FormItem>
    </Form>
    <UninPlace :show="showScenicList" placeType="CONTENT_TYPE_SCENERY" :hideTypeSelect="true"
      :orgId="orgId" nameTxt="景区名称" :useRegion="true" header="header1"
      @onClose="showScenicList = false" :defaultChoose="checkedScenicList"
      @onOkClick="getScenicList" title="关联景区"></UninPlace>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import UninPlace from "@components/uninPlace/uninPlace.vue";
import Ueditor from "@components/ueditor/ueditor.vue";
import UploadImg2 from "@components/upload/upload-image2.vue";
import { AppModule } from "@store/modules/app";
import { getSiteChild } from "@service/common";
import { brandSave, brandView } from "@service/activity";

import { Palette } from '@util/palette'

@Component({
  components: {
    Ueditor,
    UploadImg2,
    UninPlace
  }
})
export default class BrandAdd extends Vue {
  get userInfo() {
    return AppModule.userInfo;
  }
  private showScenicList: boolean = false; // 是否显示关联景区窗口
  private checkedScenicList: Array<any> = []; // 选择的景区list
  private defaultBrandIcon: Array<any> = []; // 选择的景区list
  private defaultBrandLogo: Array<any> = []; // 选择的景区list
  private defaultBrandImage: Array<any> = []; // 选择的景区list
  private orgId: any = this.$store.state.app.userInfo.orgId || -1;
  // 创建者列表
  private createrList: object[] = [];
  // 提交参数
  private params = <any>{
    siteId: this.$store.state.app.userInfo.siteId, // 创建者
    brandIcon: "",
    brandLogo: "",
    slogan: "",
    scenicStr: "",
    suggest: "",
    name: "",
    brandImage: "",
    mainColor: '', // 主图颜色
  };
  // 验证规则
  private ruleValidate = <any>{
    siteId: [
      {
        required: true,
        message: "请将信息填写完整",
        pattern: /\d+/,
        trigger: "change"
      }
    ],
    name: [
      {
        required: true,
        message: "请将信息填写完整",
        trigger: "blur"
      },
      {
        message: "只能输入2-35个字符",
        trigger: "blur",
        pattern: /^.{2,35}$/
      }
    ],
    slogan: [
      {
        required: true,
        message: "请将信息填写完整",
        trigger: "blur"
      },
      {
        message: "只能输入2-35个字符",
        trigger: "blur",
        pattern: /^.{2,35}$/
      }
    ],
    scenicStr: [
      {
        required: true,
        message: "请将信息填写完整"
      }
    ],
    brandImage: [
      {
        required: true,
        message: "请将信息填写完整"
      }
    ],
    suggest: [
      {
        required: true,
        message: "请将信息填写完整"
      }
    ]
  };

  // 是否显示保存草稿
  get showDraft() {
    return !Boolean(this.params.id) || [3].includes(this.params.dataStatus);
  }
  @Watch("params.suggest", { immediate: true, deep: true })
  suggest(v: any) {
    this.$refs.params && (this.$refs.params as any).validateField("suggest");
  }

  @Watch("params.brandImage", { immediate: true, deep: true })
  brandImage(v: any) {
    this.$refs.params && (this.$refs.params as any).validateField("brandImage");
    if (v) {
      // 获取图片主色
      Palette.from(v).getPalette().then((colors:any) => {
        // console.log(colors)
        // 图片主色
        let primaryColor = colors[0].value.join(',');
        // console.log(primaryColor)
        this.params.mainColor = primaryColor;
      })
    }
  }
  @Watch("checkedScenicList", { immediate: true, deep: true })
  scenicStr(v: any) {
    this.params.scenicStr = this.checkedScenicList
      .map((d: any) => d.id)
      .toString();
    this.$refs.params && (this.$refs.params as any).validateField("scenicStr");
  }

  created() {
    this.getSiteChild();

    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
      this.getBrandView(this.$route.query.id);
    }
  }

  private getBrandView(id: any) {
    brandView({ id }).then((res: any) => {
      if (res.code === 0) {
        if (res.data.brandIcon)
          this.defaultBrandIcon = [{ id: 0, url: res.data.brandIcon }];
        if (res.data.brandLogo)
          this.defaultBrandLogo = [{ id: 0, url: res.data.brandLogo }];
        if (res.data.brandImage)
          this.defaultBrandImage = [{ id: 0, url: res.data.brandImage }];
        this.checkedScenicList = res.data.scenics.filter((item:any) => item).map((d: any) => {
          d.resourceType = "CONTENT_TYPE_SCENERY";
          return d;
        });
        this.params = res.data;
        setTimeout(() => (this.$refs.params as any).validate(), 0)
      }
    });
  }

  private getScenicList(list: Array<any>) {
    let { checkedScenicList } = this;
    // 过滤掉已有数据
    this.checkedScenicList = checkedScenicList.concat(
      list.filter(
        (item: any) =>
          !checkedScenicList.some(
            (d: any) => d.id === item.id && d.resourceType === item.resourceType
          )
      )
    );
  }

  // 点击保存
  private handleSave(status?: number) {
    (this.$refs.params as any).validate((valid: any) => {
      if (!valid) {
        this.$Message.error("请将信息填写完整！");
        return;
      }
      this.params.dataStatus = status;

      brandSave({
        ...this.params,
        siteId:
          this.params.siteId === -1
            ? this.$store.state.app.userInfo.siteId
            : this.params.siteId
      }).then((res: any) => {
        if (res.code === 0) {
          this.$Message.success("保存成功！");
          if (this.$route.query.id) {
            this.back();
          } else {
            this.$router.push({ path: "/brand-list" });
          }
        }
      });
    });
  }

  // 返回
  private back(t?: number) {
    setTimeout(() => {
      window.history.back();
    }, t || 0);
  }

  // 获取创建者
  private getSiteChild() {
    getSiteChild().then((res: any) => {
      if (res.code === 0) {
        this.createrList = res.datas;
      }
    });
  }
}
</script>

<style lang="scss">
/*志愿页编辑页样式*/
.page-slogan-add {
  .activity-img {
    margin: 0 !important;
    .ivu-form-item-label {
      position: absolute;
      left: -120px;
      top: 0;
    }
  }
  .tag-box {
    .ivu-form-item {
      margin-bottom: 0 !important;
    }
    .ivu-form-item-content {
      line-height: 0;
    }
  }
  .valid-time-set {
    .ivu-select-dropdown {
      right: 0 !important;
      left: auto !important;
    }
  }
}
</style>
<style lang='scss' scoped>
.scenic {
  display: inline-block;
  margin-right: 15px;
  position: relative;
  &:nth-last-of-type(1) {
    margin-right: 25px;
  }
  span {
    display: block;
    width: 0;
    &::after {
      content: "×";
      position: absolute;
      right: -15px;
      top: 0;
      width: 15px;
      height: 15px;
      text-align: center;
      line-height: 13px;
      font-size: 15px;
      color: #fff;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      border: 1px solid #fff;
      cursor: pointer;
    }
  }
}
$grayBtn: #c8c8c8;
.width300 {
  width: 300px;
}

.width150 {
  width: 150px;
}

.width700 {
  width: 610px;
}

.ml10 {
  margin-left: 10px;
}

.place-check {
  margin-top: -20px;
  .item {
    margin: 0 !important;
    line-height: 20px;
    &:first-child:before {
      content: "已关联";
      position: absolute;
      left: -50px;
    }
  }
}

.add-content-box {
  background: $grayDark;

  .img-check {
    position: relative;
    &:before {
      left: 74px;
      top: 10px;
      position: absolute;
      content: "*";
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: #ed4014;
    }
  }

  .add-more {
    margin-right: 20px;
    color: $theme;
    cursor: pointer;
    &:hover {
      color: $theme-hover;
    }
  }
  .content {
    background: #fff;
    /*width: calc(100vw - 40px);*/
    min-height: calc(100vh - 182px);
  }
  .list {
    padding: 0 15px 0;
    overflow: hidden;
    &:first-child {
      padding-top: 25px;
    }
    &:last-child {
      padding-bottom: 25px;
    }
    .item {
      display: flex;
      align-items: center;
      margin-top: 20px;
    }
    .left {
      width: 130px;
      margin-right: 10px;
      text-align: right;
      font-size: 14px;
      color: #333;
      span {
        color: #ed4014;
      }
    }
    .return {
      background: $grayBtn;
      border-color: $grayBtn;
      &:hover {
        background: $grayBtn;
      }
    }
    label {
      padding-left: 20px;
      font-size: 12px;
      color: #666;
      &:first-child {
        padding: 0;
      }
    }
  }
  .max-more {
    margin-top: 12px;
    font-size: 12px;
    color: #888;
    line-height: 14px;
  }
}
.new-btn {
  margin-left: 12px;
  color: $theme;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: $theme-hover;
  }
  &:active {
    color: $theme-active;
  }
}
</style>
