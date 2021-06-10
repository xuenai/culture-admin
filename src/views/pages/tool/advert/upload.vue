<template>
  <div class="content pd20">
    <p class="title-tool">
      <i class="cloud-icon">&#xe697;</i> 基本信息
    </p>
    <Form :model="params" ref="params" :label-width="150" :rules="ruleValidate">
      <FormItem label="广告名称：" prop="name">
        <Input style="width: 250px" v-model="params.name" :maxlength="50" />
        <span class="ml20">50字以内</span>
      </FormItem>
      <FormItem label="发布渠道：" prop="publishChannel">
        <Select style="width: 250px" v-model="params.publishChannel" @on-change="getAdvList">
          <Option v-for="item in columnList" :value="item.value" :key="item.value">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <FormItem label="所属广告位：" prop="adPositionId">
        <Select
          style="width: 250px"
          v-model="params.adPositionId"
          @on-change="getAdvId"
          :label-in-value="true"
        >
          <Option v-for="item in advertList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        <div class="clearfix ad-boxs" v-for="items in advertList" :value="items.id" :key="items.id">
          <span
            class="fl ad-text"
            v-show="items.id === params.adPositionId"
          >此广告位编码：{{items.code}}，图片尺寸为：宽 {{items.width}}（px） * 高 {{items.high}}（px）</span>
          <span
            class="fl ml20 theme-blue cur"
            @click="checkAdvImg(items)"
            v-show="items.id === params.adPositionId && items.adPositionImage"
          >位置示意图</span>
        </div>
      </FormItem>
      <FormItem label="有效期" prop="startTime">
        <DatePicker
          :value="[params.startTime, params.endTime]"
          @on-change="getDataFun"
          format="yyyy-MM-dd"
          type="daterange"
          placement="bottom-end"
          placeholder="请选择活动起始日期"
          style="width: 250px"
        ></DatePicker>
      </FormItem>
      <FormItem label="排序">
        <Input placeholder="999" style="width: 250px" v-model="params.sort" :maxlength="10" />
      </FormItem>
      <p class="title-tool mt20">
        <i class="cloud-icon">&#xe697;</i> 添加图片
      </p>
      <FormItem label="广告图" required v-if="params.adPositionId">
        <Upload :limit="9" @imglist="getImagesList" :advWidth="advWidth" :advHeight="advHeight"></Upload>
      </FormItem>
      <FormItem v-else>
        <p>请先选择广告图发布渠道和所属广告位</p>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit" v-if="operates.includes('save')">保存并发布广告</Button>
        <Button class="ml20" @click="goHistory">返回</Button>
      </FormItem>
    </Form>
    <!-- 广告位示意图 -->
    <Modal title="广告位示意图" v-model="adPositionImg" footer-hide>
      <div class="ad-box">
        <p v-if="adPositionData.description">{{adPositionData.description}}</p>
        <div class="tc">
          <img style="max-width: 100%;" class="mt20" :src="adPositionData.adPositionImage" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import Upload from "@components/upload/upload-image-adv.vue";
import { AppModule } from "@store/modules/app";
import { getAdPoList, saveAdLsit } from "@service/tool";
@Component({
  components: {
    Upload
  }
})
export default class AdvertUpload extends Vue {
  // 权限列表
  get operates() {
    return AppModule.operates;
  }
  private params: any = {
    id: "", // 资源id
    sort: "", // 排序
    img: [], // 图集
    adPositionName: "", // 广告位名称
    adPositionId: "", // 广告位ID
    time: "", // 有效期
    startTime: "", // 开始时间
    endTime: "", // 结束时间
    publishChannel: "", // 发布渠道
    name: "" // 广告名称
  };
  advHeight: number = 0;
  advWidth:number = 0;
  // 发布渠道
  private columnList = [
    {
      name: "PC",
      value: "PC"
    },
    {
      name: "APP",
      value: "APP"
    },
    {
      name: "微网站",
      value: "MICRO_SITE"
    },
    {
      name: "小程序",
      value: "SMALL_PROGRAM"
    }
  ];
  // 所属广告位
  private advertList: Array<Object> = [];
  private goHistory() {
    this.$router.go(-1);
  }
  mounted() {}

  /* S 上传图片 */
  private getImagesList(e: any) {
    this.params.img = e;
  }
  /* E 上传图片 */

  /* S 查看广告示意图 */
  private adPositionImg: Boolean = false; //广告位示意图
  private adPositionData: any = {
    adPositionImage: "", //广告图图片
    description: "", //广告图摘要
    high: "", //广告图摘要
    width: "" //广告图摘要
  };
  private checkAdvImg(row: any) {
    this.adPositionData = row;
    this.adPositionImg = true;
  }
  /* E 查看广告示意图 */

  /* S 获取日期 */
  private getDataFun(date: Array<string>) {
    if (date.length > 1) {
      this.params.startTime = date[0];
      this.params.endTime = date[1];
      this.params.time = "true";
    }
  }
  /* E 获取日期 */

  /* S 获取广告位列表 */
  private getAdvList() {
    this.params.adPositionName = ""; //初始化所属广告位
    this.params.adPositionId = ""; //初始化所属广告位
    getAdPoList({
      publishChannel: this.params.publishChannel
    }).then((data: any) => {
      if (data.code === 0) {
        this.advertList = data.datas as [];
      }
    });
  }
  // 获取广告位名称
  private getAdvId(value: any) {
    if (value) {
      this.params.adPositionId = value.value;
      this.params.adPositionName = value.label;
      let item = this.advertList.find((item: any) => item.id === value.value) as any;
      this.advWidth = item.width;
      this.advHeight = item.high;
    }
  }
  /* E 获取广告位列表 */

  private ruleValidate: any = {
    name: [{ required: true, message: "该项不能为空" }],
    publishChannel: [{ required: true, message: "该项不能为空" }],
    adPositionId: [{ required: true, message: "该项不能为空" }],
    time: [{ required: true, message: "该项不能为空" }],
    startTime: [{ required: true, message: "该项不能为空" }]
  };

  /* S 新增广告 */
  private handleSubmit() {
    let jsonDto: any = {
      sort: this.params.sort, // 排序
      img: this.params.img, // 图集
      adPositionName: this.params.adPositionName, // 广告位名称
      adPositionId: this.params.adPositionId, // 广告位ID
      startTime: this.params.startTime, // 开始时间
      endTime: this.params.endTime, // 结束时间
      publishChannel: this.params.publishChannel, // 发布渠道
      name: this.params.name // 广告名称
    };
    (this.$refs.params as any).validate((valid: any) => {
      if (!valid) {
        this.$Message.error("请完善信息");
        return;
      }
      if (this.params.img.length < 1) {
        this.$Message.error("请选择广告图");
        return;
      } else {
        this.params.img.map((img: any) => {
          img.id = "";
          return img;
        });
      }
      saveAdLsit({
        jsonDto: JSON.stringify(jsonDto)
      }).then(res => {
        if (res.code === 0) {
          this.$Message.success("操作成功");
          this.goback();
        }
      });
    });
  }
  /* E 新增广告 */

  /* S 返回列表页面 */
  private goback() {
    this.$router.go(-1);
  }
  /* E 返回列表页面 */

  // 清空表单
  private cleaForm() {
    (this.$refs.params as any).resetFields();
  }
}
</script>

<style lang='scss' scoped>
.content {
  padding: 15px;
  .title-tool {
    position: relative;
    width: 100%;
    line-height: 16px;
    font-size: 14px;
    font-weight: bold;
    padding: 0 0 15px 10px;
    margin-bottom: 20px;
    border-bottom: 1px solid #dedede;
    i {
      position: absolute;
      top: 0;
      left: -8px;
      font-size: 20px;
      color: $theme;
    }
  }
  .ivu-form-item {
    margin-bottom: 20px;
    .upload-img-box {
      width: 100%;
      padding: 10px;
      position: relative;
      p {
      }
    }
  }
  .ad-boxs {
    span {
      margin-top: 10px;
      font-size: 12px;
      line-height: 20px;
    }
    .ad-text {
      padding: 0 10px;
      background: #f7f2de;
      border: 1px dashed #fdd580;
    }
    .cur {
      cursor: pointer;
    }
  }
}
.ad-box {
  width: 100%;
  img {
    margin: 0 auto;
  }
}
</style>
