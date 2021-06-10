<template>
  <Form class="form" ref="params" :model="params" :rules="ruleValidate" :label-width="120">
    <FormItem label="名称" prop="name">
      <Input placeholder="2-30字" v-model="params.name" :maxlength="30" class="w300" />
    </FormItem>
    <FormItem label="区域" prop="region">
      <VDistpicker :default="regionPath"
        @onChange="e => { params.region = e.region; params.regionPath = e.regionPath }">
      </VDistpicker>
    </FormItem>
    <FormItem label="类型" prop="type">
      <Select v-model="params.type" :disabled="Boolean(params.id)" class="w300">
        <Option :value="2">景区</Option>
        <Option :value="1">全域</Option>
      </Select>
    </FormItem>
    <FormItem v-if="params.type === 2" label="关联景区" prop="scenicId">
      <template v-if="params.id">
        <span class="scenic" v-for="(item) in scenicList" :key="item.id">{{ item.name }}</span>
      </template>
      <template v-else>
        <span class="scenic" v-for="(item,i) in scenicList" :key="item.id">{{ item.name }}<span
          @click="scenicList.splice(i,1)"></span></span>
        <Button type="primary" @click="showPlace = true">添加</Button>
      </template>
    </FormItem>
    <FormItem label="封面图" prop="images">
      <UploadImg :defaultImage="defaultImage1" @getImagesList="arr => params.images = arr[0]"
        :limit="1" :wToh="{}" :compress="1"></UploadImg>
    </FormItem>
    <FormItem label="手绘地图" prop="handPaintedMap">
      <UploadImg :defaultImage="defaultImage2"
        @getImagesList="arr => params.handPaintedMap = arr[0]" :limit="1" :wToh="{}" :compress="1">
      </UploadImg>
    </FormItem>
    <FormItem label="详细描点地图" prop="detailMap">
      <UploadImg :defaultImage="defaultImage3" @getImagesList="arr => params.detailMap = arr[0]"
        :limit="1" :wToh="{}" :compress="1"></UploadImg>
    </FormItem>
    <FormItem label="导览地图瓦片包" prop="tilesMap">
      <Upload 
        :before-upload="e => e.type === 'application/x-zip-compressed'"
        :on-success="res => params.tilesMap = res.fileUrl ? (res.fileUrl+'tiles/') : -1"
        :on-remove="() => params.tilesMap = ''"
        action="http://file.geeker.com.cn/upload"
        accept="application/x-zip-compressed"
        :default-file-list="defaultFileList"
        name="Filedata"
        :data="{path: 'test', compress: 'UNZIP'}">
        <!-- cultural-tourism-cloud -->
        <Button icon="ios-cloud-upload-outline">点击上传</Button> <span v-if="params.tilesMap === -1" style="color:red">上传解析失败！</span>
      </Upload>
      <p class="remind" style="color: #999;font-size: 12px;">注：支持.zip压缩格式 <span style="color:red">压缩包内的文件夹名字必须是tiles</span></p>
    </FormItem>
    <FormItem label="地图类型" prop="mapType">
      <Select v-model="params.mapType" class="w300">
        <Option :value="1">高德</Option>
      </Select>
    </FormItem>
    <FormItem label="矩形角点" prop="posiBottomLeft">
      <Input placeholder="左下角经纬度（例：116.327911,39.939229）" v-model="params.posiBottomLeft"
        :maxlength="30" class="w300 mr20" />
      <Input placeholder="右上角经纬度（例：116.327911,39.939229）" v-model="params.posiTopRight"
        :maxlength="30" class="w300 mr20" />
      <Input :disabled="true" placeholder="中心点经纬度（例：116.327911,39.939229）" :value="centerPosi"
        :maxlength="30" class="w300" />
      <p class="remind" style="color: #999;font-size: 12px;">注：若上传手绘图，则它必填</p>
    </FormItem>
    <FormItem label="缩放等级" prop="zoom">
      <InputNumber placeholder="默认缩放等级" :max="18" :min="3" :step="1" v-model="params.zoom" class="w90 mr20"></InputNumber>
      <InputNumber placeholder="最大缩放等级" :max="18" :min="3" :step="1" v-model="params.zoomsMax"  class="w90 mr20" ></InputNumber>
      <InputNumber placeholder="最小缩放等级" :max="18" :min="3" :step="1" v-model="params.zoomsMin"  class="w90 mr20" ></InputNumber>
    </FormItem>
    <FormItem label="导览描述" prop="description">
      <Input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model="params.description"
        :maxlength="200" class="w300" />
    </FormItem>
    <FormItem class="formItem" label="">
      <Button @click="handleSave()" type="primary">提交</Button>
      <Button type="primary" class="ml10" @click="back">返回</Button>
    </FormItem>
    <ScenicPop v-model="showPlace" :checkWay="0" :regionPath="regionPath" @select="list => scenicList = list"></ScenicPop>
  </Form>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import UploadImg from "@components/upload/upload-image-6.vue";
import ScenicPop from "@components/pop/scenic-list.vue";
import VDistpicker from "@components/distPicker/distPicker.vue";
import { AppModule } from "@store/modules/app";
import { saveTourGuide, getTourGuide } from "@service/tool";

@Component({
  components: {
    UploadImg,
    ScenicPop,
    VDistpicker
  }
})
export default class BrandAdd extends Vue {
  get userInfo() {
    return AppModule.userInfo;
  }
  private defaultImage1: string[] = [];
  private defaultImage2: string[] = [];
  private defaultImage3: string[] = [];
  private scenicList: any[] = [];
  private defaultFileList: any[] = [];
  // 选择场所
  private showPlace: boolean = false;
  // 用于修改region后存regionPath，不能直接存在param的regionPath上
  private regionPath: string = "";
  // 提交参数
  private params = <any>{
    name: "",
    regionPath: "",
    region: "",
    type: 2,
    mapType: 1,
    description: "",
    tilesMap: "",
    detailMap: "",
    handPaintedMap: "",
    images: "",
    zoomsMax: 18,
    zoomsMin: 3,
    zoom: 9,
    latitudeBottomLeft: "",
    longitudeBottomLeft: "",
    latitudeTopRight: "",
    longitudeTopRight: "",
    latitude: "",
    longitude: "",
    scenicId: "",
    posiBottomLeft: "",
    posiTopRight: "",
  };
  // 验证规则
  private ruleValidate = <any>{
    name: [
      { required: true, message: "请将信息填写完整", trigger: "blur" },
      { message: "只能输入2-30个字符", trigger: "blur", pattern: /^.{2,30}$/ }
    ],
    region: [{ required: true, message: "请将信息填写完整", trigger: "blur" }],
    type: [{ required: true, message: "请将信息填写完整", trigger: "blur", pattern: /\d+/ }],
    scenicId: [
      { required: true, message: "请将信息填写完整", trigger: "change", pattern: /\d+/ }
    ],
    images: [
      { required: true, message: "请将信息填写完整", trigger: "change" }
    ],
    detailMap: [
      { validator: this.validateDetailMap('detailMap'), message: "手绘上传，则它必传" }
    ],
    mapType: [
      { required: true, message: "请将信息填写完整", trigger: "change", pattern: /\d+/ }
    ],
    posiBottomLeft: [
      { trigger: "blur", validator: this.validatePosi }
    ],
    zoom: [{ required: true, trigger: "blur", validator: this.validateZoom }]
  };
  // 中心点
  get centerPosi(): string {
    let res = "";
    let { posiBottomLeft, posiTopRight } = this.params;
    if (posiBottomLeft && posiTopRight) {
      if (
        this.validatePois(posiBottomLeft) &&
        this.validatePois(posiTopRight)
      ) {
        let bl = posiBottomLeft.split(",").map((p: string) => Number(p.trim()));
        let tr = posiTopRight.split(",").map((p: string) => Number(p.trim()));
        res =
          String(((bl[0] + tr[0]) / 2).toFixed(6)) +
          "," +
          String(((bl[1] + tr[1]) / 2).toFixed(6));
      }
    }
    return res;
  }

  // 验证点116.327911, 39.939229 是否合法
  private validatePois(posi: string): boolean {
    let pass = false;
    let regLong = /^-?(\d{1}|([1-9]\d{1,2}))(\.\d{1,6})?$/;
    let regLat = /^-?(\d{1}|([1-9]\d{1}))(\.\d{1,6})?$/;

    if (posi.indexOf(",") === -1) {
      pass = false;
    } else {
      let ps = posi.split(",");
      pass = regLong.test(ps[0].trim()) && regLat.test(ps[1].trim());
    }
    return pass;
  }

  private validateZoom(rule: any, value: any, callback: Function) {
    if (
      this.params.zoom < 3 || 
      this.params.zoomsMin < 3 || 
      this.params.zoomsMax < 3 || 
      this.params.zoom > 18 || 
      this.params.zoomsMin > 18 || 
      this.params.zoomsMax > 18 
    ) {
      return callback(new Error("缩放等级必须在3-18之间"));
    }
    if (!this.params.zoom || !this.params.zoomsMin || !this.params.zoomsMax) {
      return callback(new Error("请将信息填写完整"));
    }
    return callback();
  }

  private validatePosi(rule: any, value: any, callback: Function) {
    if (this.params.posiBottomLeft) {
      if (this.validatePois(this.params.posiBottomLeft) === false) {
        return callback(new Error("左下角坐标不合法"));
      } 
    }
    if (this.params.posiTopRight) {
      if (this.validatePois(this.params.posiTopRight) === false) {
        return callback(new Error("右上角坐标不合法"));
      }
    }
    if (this.params.handPaintedMap || this.params.detailMap) {
      if (!this.params.posiBottomLeft) {
        return callback(new Error("请将左下角坐标填写完整"));
      }
      if (!this.params.posiTopRight) {
        return callback(new Error("请将右上角坐标填写完整"));
      }
    }
    return callback();
  }

  private validateDetailMap(key: string): Function {
    return (rule: any, value: any, callback: Function) => {
      if (this.params.handPaintedMap) {
        if (this.params[key]) {
          return callback();
        } else {
          return callback(new Error("手绘上传，则它必传"));
        }
      } else {
        return callback();
      }
    }
  }

  created() {
    if (this.$route.query.id) {
      this.params.id = this.$route.query.id;
      this.getTourGuide(this.$route.query.id);
    }
  }

  @Watch("params.images", { deep: true })
  wImages(n: any) {
    this.$nextTick(() => {
      (this.$refs.params as any).validateField("images");
    })
  }
  @Watch("params.detailMap", { deep: true })
  wDetailMap(n: any) {
    this.$nextTick(() => {
      (this.$refs.params as any).validateField("detailMap");
    })
  }
  @Watch("scenicList", { deep: true })
  wScenicList(n: any) {
    this.$nextTick(() => {
      this.params.scenicId = n.map((d:any)=>d.id).toString();
      (this.$refs.params as any).validateField('scenicId')
    })
  }

  // 获取详情
  private getTourGuide(id: any) {
    getTourGuide({ id }).then((res: any) => {
      if (res.code === 0) {
        this.regionPath = res.data.regionPath || ''
        this.params = Object.assign({}, this.params, res.data);
        if (res.data.type === 2) {
          if (res.data.scenicId) {
            this.scenicList = [{id : res.data.scenicId, name: res.data.scenicName}]
          }
        }
        if (res.data.images) this.defaultImage1 = [res.data.images];
        if (res.data.handPaintedMap) this.defaultImage2 = [res.data.handPaintedMap];
        if (res.data.detailMap) this.defaultImage3 = [res.data.detailMap];
        if (res.data.tilesMap) this.defaultFileList = [{name: '瓦片包', url: res.data.tilesMap}];
        if (res.data.longitudeBottomLeft && res.data.latitudeBottomLeft) {
          this.params.posiBottomLeft = res.data.longitudeBottomLeft + ',' + res.data.latitudeBottomLeft
        }
        if (res.data.longitudeTopRight && res.data.latitudeTopRight) {
          this.params.posiTopRight = res.data.longitudeTopRight + ',' + res.data.latitudeTopRight
        }
      }
    })
  }

  // 点击保存
  private handleSave() {
    if (this.params.tilesMap === -1) {
      this.$Message.info('瓦片包上传解析失败！')
      return
    };
    (this.$refs.params as any).validate((valid: any) => {
      if (valid) {
        let params = {...this.params}
        if (params.type === 1) params.scenicId = '';
        let { posiBottomLeft, posiTopRight } = params
        if (posiBottomLeft) {
          let centerPosi = this.centerPosi
          params.longitudeBottomLeft = posiBottomLeft.split(',')[0].trim()
          params.latitudeBottomLeft = posiBottomLeft.split(',')[1].trim()
          params.longitudeTopRight = posiTopRight.split(',')[0].trim()
          params.latitudeTopRight = posiTopRight.split(',')[1].trim()
          params.longitude = centerPosi.split(',')[0].trim()
          params.latitude = centerPosi.split(',')[1].trim()
          delete params.posiBottomLeft
          delete params.posiTopRight
        }

        saveTourGuide(params).then((res: any) => {
          if (res.code === 0) {
            this.$Message.success("保存成功！");
            if (this.$route.query.id) {
              this.back()
            } else {
              this.$router.push({ path: "/tourguide-list" });
            }
          }
        })
      } else {
        this.$Message.info("请将信息填写完整！")
      }
    })
  }

  // 返回
  private back() {
    window.history.back()
  }
}
</script>

<style lang='scss' scoped>
.mr20 {
  margin-right: 20px;
}
.w300 {
  width: 300px;
}
.w90 {
  width:87px;
}
.form {
  padding: 40px 0;
}
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
</style>
