<template>
  <div class="add-content-box">
    <Form class="content list" ref="params" :model="params" :rules="ruleValidate"
      :label-width="120">
      <FormItem class="formItem" label="选择栏目" prop="channelId">
        <Select class="width300" v-model="params.channelId">
          <Option v-for="item in columnList" :value="item.id" :key="item.id" :label="item.name">
            <span
              :style="item.channelLevel ? 'padding-left:' + (item.channelLevel * 10) + 'px' : ''">
              <i v-if="item.channelLevel">├</i>
              {{ item.name }}
            </span>
          </Option>
        </Select>
        <span class="new-btn" @click="gotoAddColumn"  v-if="isSite && addColumnOperate">新增栏目</span>
        <span class="new-btn" @click="refreshColum">刷新</span>
      </FormItem>
      <FormItem class="formItem" label="标题" prop="title">
        <Input placeholder="请填写标题" class="width300" v-model="params.title" :maxlength="100" />
      </FormItem>
      <FormItem class="formItem" prop="createCompany">
        <template slot="label">
          <Tooltip trigger="hover" placement="top-start" :max-width="200" content="创建者代表资讯由谁创建并对外发布的，默认为当前平台名称，也可以选择已添加的文旅单位/企业"><Icon class="tiptip" custom="iconfont c-icon--quetion-pane" size="12" /></Tooltip>创建者
        </template>
        <Select class="width300" v-model="params.createCompany"
          :disabled="!($store.state.app.userInfo.dataType === 'SITE')">
          <Option v-for="item in createrList" :value="item.id" :key="item.id">
            {{ item.name }}
          </Option>
        </Select>
        <a href="javascript:;" style="margin-left: 10px;" @click="openPlacePop">关联资源</a>
        <!-- -1为站点，只有站点条件下，才选择品牌 -->
        <a href="javascript:;" v-if="params.createCompany === -1" style="margin-left: 10px;"
          @click="openBrandPop">关联品牌</a>
      </FormItem>
      <FormItem class="place-check">
        <p class="item" v-for="(item,i) in getResourceList" :key="item.id || item.linksResourceIds">
          <span>{{item.name}}</span>
          <a href="javascript:;" style="margin-left: 10px;" @click="()=>{
                        getResourceList.splice(i,1);
                        placeChange(getResourceList);
                    }">删除</a>
        </p>
      </FormItem>
      <FormItem class="brand-check">
        <p class="item" v-for="(item,i) in brandList" :key="item.id">
          <span>{{item.name}}</span>
          <a href="javascript:;" style="margin-left: 10px;" @click="()=>{
                                brandList.splice(i,1);
                                brandChange(brandList);
                            }">删除</a>
        </p>
      </FormItem>
      <FormItem class="formItem img-check" label="图集">
        <UploadImg3 @getImagesList="getImagesList" :defaultImage="defaultImage" :limit="30">
        </UploadImg3>
        <div class="ivu-form-item-error-tip" :style="{display: imgMustTip}">请选择或上传图片</div>
      </FormItem>
      <FormItem class="formItem" label="发布时间" prop="publishTime">
        <DatePicker @on-change="publishTimeChange" ref="publishTime" type="datetime"
          format="yyyy-MM-dd HH:mm" v-model="params.publishTime" placement="top"
          placeholder="请选择发布时间" class="width300"></DatePicker>
      </FormItem>
      <!-- <FormItem class="formItem" label="模拟数据">
        <label>浏览量</label>
        <Input v-model="params.showNum" :maxlength="8"
          @on-keyup="params.showNum=params.showNum.replace(/[^\d]/g, '')" placeholder="请填写模拟浏览量"
          class="width150 ml10" />
        <label>点赞量</label>
        <Input v-model="params.likeNum" :maxlength="8"
          @on-keyup="params.likeNum=params.likeNum.replace(/[^\d]/g, '')" placeholder="请填写模拟点赞量"
          class="width150 ml10" />
        <label>收藏量</label>
        <Input v-model="params.collectionNum" :maxlength="8"
          @on-keyup="params.collectionNum=params.collectionNum.replace(/[^\d]/g, '')"
          placeholder="请填写模拟收藏量" class="width150 ml10" />
      </FormItem> -->

      <!-- 扩展字段S -->
      <template v-for="item in extendFieldList">
        <FormItem v-if="item.fieldType === '文本框（单行）'" class="formItem" :prop="item.fieldCode"
          :label="item.fieldName" :key="item.id">
          <Input v-model="params[item.fieldCode]" :placeholder="item.defaultValue"
            class="width300" />
        </FormItem>

        <FormItem v-if="item.fieldType === '文本框（多行）'" class="formItem" :prop="item.fieldCode"
          :label="item.fieldName" :key="item.id">
          <Input type="textarea" class="width700" :autosize="{minRows: 2,maxRows: 5}"
            v-model="params[item.fieldCode]" :placeholder="item.defaultValue" />
        </FormItem>

        <FormItem v-if="item.fieldType === '内容编辑器'" class="formItem" :prop="item.fieldCode"
          :label="item.fieldName" :key="item.id">
          <Ueditor v-model="params[item.fieldCode]" :id="'uedit' + item.id"></Ueditor>
        </FormItem>

        <FormItem v-if="item.fieldType === '复选框'" class="formItem" :prop="item.fieldCode"
          :label="item.fieldName" :key="item.id">
          <CheckboxGroup :value="params[item.fieldCode]?params[item.fieldCode].split(','):[]"
            @on-change="(arr)=>{params[item.fieldCode]=arr.join(',')}">
            <Checkbox v-for="ckVal in item.candidateValue.split(',')" :label="ckVal" :key="ckVal">
            </Checkbox>
          </CheckboxGroup>
        </FormItem>

        <FormItem v-if="item.fieldType === '单选框'" class="formItem" :prop="item.fieldCode"
          :label="item.fieldName" :key="item.id">
          <RadioGroup v-model="params[item.fieldCode]">
            <Radio v-for="ckVal in item.candidateValue.split(',')" :label="ckVal" :key="ckVal">
            </Radio>
          </RadioGroup>
        </FormItem>

        <FormItem v-if="item.fieldType === '下拉列表（单选）'" class="formItem" :prop="item.fieldCode"
          :label="item.fieldName" :key="item.id">
          <Select class="width300" v-model="params[item.fieldCode]">
            <Option v-for="ckVal in item.candidateValue.split(',')" :value="ckVal" :key="ckVal">
              {{ ckVal }}</Option>
          </Select>
        </FormItem>

        <FormItem v-if="item.fieldType === '下拉列表（多选）'" class="formItem" :prop="item.fieldCode"
          :label="item.fieldName" :key="item.id">
          <Select class="width300" multiple
            :value="params[item.fieldCode]?params[item.fieldCode].split(','):[]"
            @on-change="(arr)=>{params[item.fieldCode]=arr.join(',')}">
            <Option v-for="ckVal in item.candidateValue.split(',')" :value="ckVal" :key="ckVal">
              {{ ckVal }}</Option>
          </Select>
        </FormItem>

        <FormItem v-if="item.fieldType === '日期选择器'" class="formItem" :prop="item.fieldCode"
          :label="item.fieldName" :key="item.id">
          <DatePicker type="date" placeholder="请选择日期" class="width300"
            @on-change="(time)=>{params[item.fieldCode] = time}" :value="params[item.fieldCode]">
          </DatePicker>
        </FormItem>

        <FormItem v-if="item.fieldType === '日期选择器（精确到分）'" class="formItem" :prop="item.fieldCode"
          :label="item.fieldName" :key="item.id">
          <DatePicker type="datetime" placeholder="请选择日期" class="width300"
            @on-change="(time)=>{params[item.fieldCode] = time}" :value="params[item.fieldCode]">
          </DatePicker>
        </FormItem>

        <FormItem v-if="item.fieldType === '图片'" class="formItem" label="图集" :key="item.id">
          <UploadImg2
            @getImagesList="(list)=>{params[item.fieldCode] = list.map((d)=>d.id).join(',')}">
          </UploadImg2>
        </FormItem>
        <FormItem v-if="item.fieldType === '视频'" class="formItem" label="视频" :key="item.id">
          <UploadVideo2
            @getVideoList="(list)=>{params[item.fieldCode] = list.map((d)=>d.id).join(',')}">
          </UploadVideo2>
        </FormItem>
        <FormItem v-if="item.fieldType === '音频'" class="formItem" label="音频" :key="item.id">
          <UploadVoice
            @getVoiceList="(list)=>{params[item.fieldCode] = list.map((d)=>d.id).join(',')}">
          </UploadVoice>
        </FormItem>
        <FormItem v-if="item.fieldType === '附件'" class="formItem add-annex-del_txt" label="附件"
          :key="item.id">
          <Upload action="http://file.geeker.com.cn/uploadOSS"
            :on-success="(a,b,files)=>{params[item.fieldCode]=files.map((file)=>file.response.safeUrl).join(',')}"
            :on-remove="(a,files)=>{params[item.fieldCode]=files.map((file)=>file.response.safeUrl).join(',')}"
            show-upload-list :data="{path: 'cultural-tourism-cloud'}" name="Filedata">
            <Button icon="ios-cloud-upload-outline">添加附件</Button>
          </Upload>
        </FormItem>

      </template>
      <!-- 扩展字段E -->

      <FormItem class="formItem" label="">
        <Button @click="handleSave(4)" type="primary">保存</Button>
        <Button @click="handleSave(3)" v-if="showDraft" type="primary" class="ml10">存草稿</Button>
        <Button class="ml10" @click="back">返回</Button>
      </FormItem>
    </Form>
    <UninPlace :show="showPlace" :defaultChoose="getPlaceIds" :orgId="params.createCompany"
      @onOkClick="placeChange" @onClose="showPlace=false"></UninPlace>
    <Brand :show="showBrand" :selectIds="getBrandIds" :propParams="{siteName: siteInfo.name}"
      @onOkClick="brandChange" @onClose="showBrand=false"></Brand>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from "vue-property-decorator";
import UploadImg from "./upload-image.vue";
import UninPlace from "@components/uninPlace/uninPlace2.vue";
import UploadImg3 from "@components/upload/upload-image3.vue";
import Ueditor from "@components/ueditor/ueditor.vue";
import UploadImg2 from "@components/upload/upload-image2.vue";
import UploadVideo2 from "@components/upload/upload-video2.vue";
import UploadVoice from "@components/upload/upload-voice.vue";
import { AppModule } from "@store/modules/app";
import Brand from "@components/pop/brand.vue";
import {
  getContentColumnList,
  getContentExtendColumn,
  saveAddContent,
  getLabelList,
  saveAddTag,
  createrList,
  getContent,
  saveMultiImage,
  getImgDetail,
  saveAuditUpdateData
} from "@service/content";
import { filterChar } from "@util/comm";
import { getTagDetail } from "@service/tool";

interface placeType {
  address: string;
  id: number;
  images: string;
  name: string;
  resourceType: string;
  resourceTypeName: string;
  status: string;
}

interface imgType {
  id: number;
  url: string;
  name?: string;
  tags?: string;
  description?: string;
  placeId?: number;
  placeObj?: placeType;
  isOld?: boolean;
}

@Component({
  components: {
    Ueditor,
    UploadImg2,
    UploadVideo2,
    UploadVoice,
    UploadImg,
    UninPlace,
    UploadImg3,
    Brand
  }
})
export default class AddImage extends Vue {
  isSite = process.env.VUE_APP_STATUS === 'SITE';
  private siteInfo: any = AppModule.siteInfo;
  get userInfo() {
    return AppModule.userInfo;
  }
  // 提交参数
  private params = <any>{
    channelId: "",
    title: "",
    author: "",
    source: "",
    sourceUrl: "",
    createCompany: this.$store.state.app.userInfo.orgId || -1, // 创建者
    resourceLinks: "",
    summary: "",
    content: "",
    contentType: "IMAGE",
    tag: "",
    images: "",
    annex: "",
    video: "",
    showNum: "",
    likeNum: "",
    collectionNum: "",
    audio: "",
    publishTime: ""
  };
  // 验证规则
  private ruleValidate = <any>{
    channelId: [
      {
        required: true,
        message: "请将信息填写完整"
      }
    ],
    images: [
      {
        required: true,
        message: "请选择或上传图片"
      }
    ],
    title: [
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
    author: [
      {
        message: "只能填写中文、字母，字符个数2-15",
        trigger: "blur",
        pattern: /^[\u4e00-\u9fa5A-Za-z,，、 ]{2,15}$/
      }
    ],
    content: [
      {
        required: true,
        trigger: "change",
        message: "请将信息填写完整"
      }
    ]
  };
  // 栏目下拉
  private columnList: Array<object> = [
    /*{
                name: "首页",
                id: 1,
                channelLevel: 0
            },
            {
                name: "首页1",
                id: 2,
                channelLevel: 1
            }*/
  ];
  // 创建者列表
  private createrList: object[] = [];
  // 选择场所
  private showPlace: boolean = false;
  // 图片数据
  private imgList?: Array<any>;
  // 选择的场所名称字符串集合
  private placeNames: string = "";
  // 图片回显数据
  private defaultImage: Array<imgType> = [];
  // 扩展字段
  private extendFieldList: object[] = [];
  // 内容id
  private contentId: number | undefined;
  // 回显页面内容
  private content: any;
  // 扩展字段回显值
  private extendInfo: any;
  // 尴尬的哨兵变量，记录第一次render扩展字段
  private extendFirstFlag: boolean = true;
  // 图片必填提示是否显示
  private imgMustTip: string = "none";

  // pop资源弹窗回显的
  get getPlaceIds() {
    let res = [];
    if (this.params.resourceLinks) {
      res = JSON.parse(this.params.resourceLinks).map((data: any) => {
        data.id = data.linksResourceIds;
        data.resourceType = data.linksResourceType;
        return data;
      });
    }
    return res;
  }
  // pop资源弹窗回显的
  get getBrandIds() {
    return this.brandList.map((d: any) => d.id);
  }
  // 是否显示保存草稿
  get showDraft() {
    return !Boolean(this.params.id) || [3, 7, 8].includes(this.params.status);
  }
  // 添加栏目的权限是否有
  get addColumnOperate(): boolean {
    let b = false
    let content_column = AppModule.nav.find((d:any) => d.menuCode === 'content_site') // 内容菜单
    if (content_column && content_column.child) {
      let column_list = content_column.child.find((d:any) => d.menuCode === 'content_channel_site') // 栏目管理菜单
      b = column_list && column_list.operates.some((e:any) => e.operateCode === 'save')
    }
    return b;
  }

  created() {
    this.getContentColumnList();
    this.getCreaterList();
    this.$route.query.id && (this.contentId = Number(this.$route.query.id));
    this.getContent();
  }

  // 监听栏目选择
  @Watch("params.channelId", { immediate: true, deep: true })
  columSele(newId: any, oldId: any) {
    if (newId && newId !== oldId) {
      getContentExtendColumn({
        channelId: newId
      }).then(result => {
        // 卸载字段
        let newParams = { ...this.params };
        let newRuleValidate = { ...this.ruleValidate };
        this.extendFieldList.forEach((item: any) => {
          if (item.fieldCode in newParams) {
            delete newParams[item.fieldCode];
            delete newRuleValidate[item.fieldCode];
          }
        });
        // 添加字段
        let dataList: Array<object> = [];
        if (result && result.datas && result.datas.length) {
          dataList = result.datas;
          dataList.forEach((item: any) => {
            newParams[item.fieldCode] = ""; //item.defaultValue
            let rule = [];
            if (item.must) {
              rule.push({
                required: true,
                message: "请将信息填写完整",
                trigger: "blur"
              });
            }
            if (item.validate) {
              if (
                ["文本框（单行）", "文本框（多行）", "内容编辑器"].includes(
                  item.fieldType
                )
              ) {
                rule.push({
                  message: item.failPrompt,
                  trigger: "blur",
                  pattern: eval(item.validateRule)
                });
              }
              /*其他选择项没必要验证内容本身是否符合正则，因为是自己提供的可选项，只需要验证是否必填 rule.push({
                                 message: item.failPrompt,
                                 trigger: "change",
                                 type: "array",
                                 validator: (rule, value, callback) => {
                                 let reg = new RegExp(item.validateRule, 'gi')
                                 let res = value.split(',').some((data:any)=>!reg.test(data))
                                 if (res) {callback(new Error('不通过'))}else{callback()}
                                 }
                                 })*/
            }
            newRuleValidate[item.fieldCode] = rule;
          });
        }
        // 设置字段
        this.params = newParams;

        // 这里清空ruleValidate的字段，再赋值新字段，不直接赋值newRuleValidate对象，为了解决初始默认验证提示
        for (let attr in this.ruleValidate) {
          delete this.ruleValidate[attr];
        }
        Object.assign(this.ruleValidate, newRuleValidate);
        //                    this.ruleValidate = newRuleValidate

        this.extendFieldList = dataList;
        if (this.extendInfo && this.extendFirstFlag) {
          // 回显扩展字段值,这里尴尬的判断主要考虑到content内容接口和扩展字段接口返回的时间先后问题
          Object.assign(this.params, this.extendInfo);
          this.extendInfo = null;
        }
        this.extendFirstFlag = false;
      });
    }
  }

  // 监测创建者选择变化
  @Watch("params.createCompany")
  createCompanyChange(val: any) {
    if (!/-1/.test(val)) {
      this.brandList = [];
    }
  }
  // 批量保存图片地址
  private saveMultiImage() {
    return new Promise((resolve, reject) => {
      if (this.imgList && this.imgList.length) {
        let list = this.imgList
          .filter((item: any) => item.isLocalAdd)
          .map((img: imgType) => ({
            url: img.url,
            name: img.name,
            placeId: img.placeId,
            placeType: img.placeObj ? img.placeObj.resourceType : "",
            placeName: img.placeObj ? img.placeObj.name : "",
            description: img.description,
            tags: img.tags,
            id: img.id, // 由原来的新增变成了修改
            //                        id: img.isOld === true ? img.id : '',
            orgId: this.params.createCompany
          })); // 现在需求是：本地添加的资源才保存资源库（isLocalAdd就是本地加的）
        if (list.length) {
          saveMultiImage({ jsonDto: JSON.stringify(list) })
            .then(res => {
              if (res.code === 0 && res.datas) {
                //                                this.params.images = res.datas.map((data:any)=>data.ID).join(',')
                resolve();
              } else {
                reject(res.message);
              }
            })
            .catch(reject);
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    });
  }

  // 打开场所弹窗
  private openPlacePop() {
    if (this.params.createCompany) {
      this.showPlace = true;
    } else {
      this.$Message.info("请先选择创建者！");
    }
  }

  // 选择图片
  private getImagesList(list: Array<any>) {
    this.imgList = list.map((img: any) => {
      if (img.isLocalAdd === true) img.isOld = true; // 如果是本地添加的图片，那么我们直接使用这个图片保存之后的id，没必要再建一条新数据
      return img;
    });

    // image暂时赋值来表示是否选择图片
    if (this.imgList.length) {
      this.imgMustTip = "none";
    } else {
      this.imgMustTip = "block";
    }
  }

  // 发布时间改变
  private publishTimeChange(time: string) {
    this.params.publishTime = time;
  }

  // 点击保存
  private handleSave(status?: number) {
    if (this.imgList && this.imgList.length) {
      this.imgMustTip = "none";
    } else {
      this.imgMustTip = "block";
    }

    (this.$refs.params as any).validate((valid: any) => {
      if (!valid || this.imgMustTip === "block") {
        this.$Message.error("请将信息填写完整！");
        return;
      }
      this.submitForm(status);
    });
  }

  // 保存栏目
  private async submitForm(status?: number) {
    // 接口改了，这段不适用了
    /*this.saveMultiImage().then(()=>{
                let audit = this.$route.query.auditId
                let reqFn = saveAddContent
                if (status) this.params.status = status;
                if (typeof this.params.publishTime === 'object') {
                    this.params.publishTime = (this.$refs.publishTime as any).formatDate(this.params.publishTime)
                }
                if (audit) {
                    this.params.auditManageId = audit
                    reqFn = saveAuditUpdateData
                }
                reqFn(this.params).then(data => {
                    if (data.code === 0) {
                        this.$Message.success("保存成功！");
                        if (this.$route.query.id) {
                            this.back()
                        } else {
                            this.$router.push({path:'/con-list'})
                        }
                    }
                })
            })*/
    this.saveMultiImage(); // 看看要不要保存资源库

    /*后台需要标签的名字，先把标签名字查出来S*/
    let allPromise: Array<Promise<any>> = [];
    (this.imgList as Array<any>).forEach((data: any) => {
      data.tagNames = [];
      if (data.tags) {
        allPromise.concat(
          data.tags.split(",").map(
            (id: any) =>
              new Promise((resolve, reject) => {
                getTagDetail({ id })
                  .then((res: any) => {
                    if (res.code === 0) {
                      data.tagNames.push(res.data.labelName);
                    }
                  })
                  .finally(resolve);
              })
          )
        );
      }
    });
    await Promise.all(allPromise);
    /*后台需要标签的名字，先把标签名字查出来E*/

    this.params.images = JSON.stringify(
      (this.imgList as Array<any>).map((data: any) => ({
        name: data.name,
        url: data.url,
        mediaId: data.id,
        resourceId: data.placeId,
        resourceType: data.placeObj
          ? data.placeObj.resourceType
          : data.placeType
          ? data.placeType
          : "",
        description: data.description,
        tagNames: data.tagNames,
        tagIds: data.tags
      }))
    );
    let audit = this.$route.query.auditId;
    let reqFn = saveAddContent;
    if (status) this.params.status = status;
    if (typeof this.params.publishTime === "object") {
      this.params.publishTime = (this.$refs.publishTime as any).formatDate(
        this.params.publishTime
      );
    }
    if (audit) {
      this.params.auditManageId = audit;
      reqFn = saveAuditUpdateData;
    }
    this.params.resourceLinks = JSON.parse(
      this.params.resourceLinks || "[]"
    ).concat(
      this.brandList.map((d: any) => ({
        linksResourceType: "CONTENT_TYPE_BRAND",
        linksResourceIds: d.id
      }))
    );
    this.params.resourceLinks = JSON.stringify(this.params.resourceLinks);
    reqFn(this.params).then(data => {
      if (data.code === 0) {
        this.$Message.success("保存成功！");
        if (this.$route.query.id) {
          this.back();
        } else {
          this.$router.push({ path: "/con-list" });
        }
      }
    });
  }

  private showBrand: boolean = false;
  // 打开弹窗
  private openBrandPop() {
    this.showBrand = true;
    // if (this.params.createCompany) {
    //   this.showBrand = true;
    // } else {
    //   this.$Message.info("请先选择创建者！");
    // }
  }
  // 场所选择
  private getResourceList: Array<placeType> = [];
  private placeChange(list: Array<placeType>) {
    if (list && list.length) {
      this.getResourceList = list;
      let placeNames = "";
      let resourceLinks = list.map((item: placeType) => {
        if (item.name) placeNames += item.name + ",";
        return {
          linksResourceType: item.resourceType,
          linksResourceIds: item.id
        };
      });
      if (placeNames) this.placeNames = placeNames.slice(0, -1);
      this.params.resourceLinks = JSON.stringify(resourceLinks);
    } else {
      this.placeNames = "";
      this.params.resourceLinks = "";
      this.getResourceList = [];
    }
  }

  // 获取内容
  private getContent() {
    if (this.contentId) {
      getContent({ id: this.contentId }).then((res: any) => {
        if (res.code === 0) {
          this.content = res.data;
          this.renderContent();
        }
      });
    }
  }

  // 回显页面内容处理
  private renderContent() {
    let {
      collectionNum,
      likeNum,
      showNum,
      publishTime,
      title,
      channelId,
      createCompany,
      resourceNames,
      resourceLinks,
      id,
      images,
      extendInfo,
      resourceLinksInfo
    } = this.content;
    if (publishTime) {
      // 时间回显字符串不得行，使用时间对象
      publishTime = new Date(publishTime);
    }
    Object.assign(this.params, {
      collectionNum,
      likeNum,
      showNum,
      publishTime,
      title,
      channelId,
      createCompany,
      resourceLinks,
      id,
      images
    });

    if (resourceLinksInfo) {
      // 关联资源回显
      let resourceLink = <any>[];
      resourceLinksInfo.forEach((d: any) => {
        if (d.resourceType === "CONTENT_TYPE_BRAND") {
          this.brandList.push({
            id: d.resourceId,
            name: d.resourceName
          });
        } else {
          resourceLink.push({
            linksResourceType: d.resourceType,
            linksResourceIds: d.resourceId,
            name: d.resourceName
          });
        }
      });
      this.placeChange(resourceLink);
    }
    if (images) {
      // 接口改了，这段不适用了
      /*let promiseList = images.split(',').map((id:any) => this.getMediaDetail(Number(id)))
                Promise.all(promiseList).then((list: Array<any>) => {
                    this.imgList = this.defaultImage = list.map((data:any) => {
                        data.isOld = true;
                        return data
                    })
                }).catch(e => console.log(e));*/
      this.defaultImage = JSON.parse(images).map((item: any, i: number) => {
        item.id = item.mediaId;
        item.isOld = true;
        item.placeId = item.resourceId;
        item.placeType = item.resourceType;
        item.tags =
          (item.tagIds && item.tagIds.length && item.tagIds.toString()) || "";
        return item;
      });
      this.getImagesList(this.defaultImage);
    }
    if (extendInfo) {
      // 回显扩展字段值
      this.extendInfo = extendInfo;
      Object.assign(this.params, extendInfo);
    }
  }

  // 品牌选择
  private brandList: Array<any> = [];
  private brandChange(list: Array<any>) {
    if (list && list.length) {
      this.brandList = this.brandList.concat(
        list.filter(
          (d: any) => !this.brandList.some((ele: any) => ele.id === d.id)
        )
      );
    }
  }

  // 获取media详情
  private getMediaDetail(id: number) {
    return new Promise((resolve, reject) => {
      getImgDetail({ id })
        .then((res: any) => {
          if (res.data && res.data.res) {
            resolve(res.data.res);
          } else {
            resolve();
          }
        })
        .catch(e => {
          resolve();
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
  private getCreaterList() {
    createrList().then((res: any) => {
      if (res.code === 0) {
        this.createrList = res.datas;
      }
    });
  }
  // 跳转新页面添加栏目
  gotoAddColumn() {
    let { href } = window.location;
    href = href.split("#/")[0];
    window.open(`${href}#/con-column-add`, "_blank");
  }
  // 刷新栏目下拉框选项
  refreshColum() {
    this.getContentColumnList(() => {
      this.columnList = [];
      this.$Message.success("刷新栏目成功！");
    });
  }
  // 获取栏目列表
  private getContentColumnList(callback?: () => void) {
    getContentColumnList({}).then(data => {
      let datas = data.datas as Array<any>;
      if (datas && datas.length) {
        callback && callback();
        this.filterArr(datas);
        if (!this.params.channelId) this.params.channelId = datas[0].id;
      }
    });
  }

  private filterArr(arr: Array<any>) {
    let _this = this;
    arr.filter((item: any) => {
      _this.columnList.push(item);
      item.channelLevel = 0;
      return _this.filterObj(item);
    });
  }

  private filterObj(item: any) {
    let _this = this;
    if (item.hasOwnProperty("subset")) {
      item.subset.filter(function(child: any) {
        child.channelLevel = item.channelLevel + 1;
        _this.columnList.push(child);
        if (child.hasOwnProperty("subset")) {
          return _this.filterObj(child);
        }
      });
    }
  }
}
</script>


<style lang='scss' scoped>
$grayBtn: #c8c8c8;
.tiptip{
  margin-right: 4px;
  color:#777;
}
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
.brand-check {
  margin-top: -20px;
  .item {
    margin: 0 !important;
    line-height: 20px;
    &:first-child:before {
      content: "已关联品牌";
      position: absolute;
      left: -72px;
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
