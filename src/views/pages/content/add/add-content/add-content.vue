<template>
  <div class="add-content-box">
    <Form
      class="content list"
      ref="params"
      :model="params"
      :rules="ruleValidate"
      :label-width="120"
    >
      <FormItem class="formItem" label="选择栏目" prop="channelId">
        <Select class="width300" v-model="params.channelId">
          <Option
            v-for="item in columnList"
            :value="item.id"
            :key="item.id"
            :label="item.name"
          >
            <span
              :style="
                item.channelLevel
                  ? 'padding-left:' + item.channelLevel * 10 + 'px'
                  : ''
              "
            >
              <i v-if="item.channelLevel">├</i>
              {{ item.name }}
            </span>
          </Option>
        </Select>
        <span
          class="new-btn"
          @click="gotoAddColumn"
          v-if="isSite && addColumnOperate"
          >新增栏目</span
        >
        <span class="new-btn" @click="refreshColum">刷新</span>
      </FormItem>
      <FormItem class="formItem" prop="title" label="标题">
        <!-- <template slot="label">
          <Tooltip trigger="hover" placement="top-start" :max-width="200" content="注：2-100字，30字图被最佳，不得出现特殊字符，如“%”“￥”“#”等"><Icon class="tiptip" custom="iconfont c-icon--quetion-pane" size="12" /></Tooltip>标题
        </template> -->
        <Input
          placeholder="请填写标题"
          class="width300"
          v-model="params.title"
          :maxlength="100"
        />
      </FormItem>
      <FormItem class="formItem" prop="author">
        <template slot="label">
          <Tooltip
            trigger="hover"
            placement="top-start"
            :max-width="200"
            content="第三方转载内容，避免侵权，需要填写原作者名字，2-20字"
            ><Icon
              class="tiptip"
              custom="iconfont c-icon--quetion-pane"
              size="12"/></Tooltip
          >作者
        </template>
        <Input
          placeholder="请填写作者"
          class="width300"
          v-model="params.author"
          :maxlength="20"
        />
        <div class="record-list" v-if="authorList.length">
          <p>历史记录 <span class="btn-clear" @click="$Modal.confirm({title: '系统提示', content: '是否确认清空历史记录？', onOk: () => contentClearRecord('content_author_record').then(()=>authorList = []) })">清空</span></p>
          <Button class="record-item" size="small" :key="i" v-for="(item, i) in authorList" @click.stop="()=>{params.author=item}">{{ item }}</Button>
        </div>
      </FormItem>
      <FormItem class="formItem">
        <template slot="label">
          <Tooltip
            trigger="hover"
            placement="top-start"
            :max-width="200"
            content="第三方转载内容，避免侵权，需要填写内容原始出处，来源地址请填写https/http开头的域名地址"
            ><Icon
              class="tiptip"
              custom="iconfont c-icon--quetion-pane"
              size="12"/></Tooltip
          >来源/来源地址
        </template>
        <Input
          placeholder="请填写来源"
          class="width300"
          v-model="params.source"
          :maxlength="20"
        />
        <Input
          placeholder="请填写来源地址"
          class="width300 ml10"
          v-model="params.sourceUrl"
          :maxlength="200"
        />
        <div class="record-list" v-if="sourceList.length">
          <p>历史记录 <span class="btn-clear" @click="$Modal.confirm({title: '系统提示', content: '是否确认清空历史记录？', onOk: () => contentClearRecord('content_source_record').then(()=>sourceList = []) })">清空</span></p>
          <Button class="record-item" size="small" :key="i" v-for="(item, i) in sourceList" @click.stop="()=>{params.source=item}">{{ item }}</Button>
        </div>
      </FormItem>
      <FormItem class="formItem" prop="createCompany">
        <template slot="label">
          <Tooltip
            trigger="hover"
            placement="top-start"
            :max-width="200"
            content="创建者代表资讯由谁创建并对外发布的，默认为当前平台名称，也可以选择已添加的文旅单位/企业"
            ><Icon
              class="tiptip"
              custom="iconfont c-icon--quetion-pane"
              size="12"/></Tooltip
          >创建者
        </template>
        <Select
          class="width300"
          v-model="params.createCompany"
          :disabled="!($store.state.app.userInfo.dataType === 'SITE')"
        >
          <Option v-for="(item, i) in createrList" :value="item.id" :key="i">{{
            item.name
          }}</Option>
        </Select>
        <a href="javascript:;" style="margin-left: 10px;" @click="openPlacePop"
          >关联资源</a
        >
        <!-- -1为站点，只有站点条件下，才选择品牌 -->
        <a
          href="javascript:;"
          v-if="params.createCompany === -1"
          style="margin-left: 10px;"
          @click="openBrandPop"
          >关联品牌</a
        >
      </FormItem>
      <FormItem class="place-check">
        <p
          class="item"
          v-for="(item, i) in getResourceList"
          :key="item.id || item.linksResourceIds"
        >
          <span>{{ item.name }}</span>
          <a
            href="javascript:;"
            style="margin-left: 10px;"
            @click="
              () => {
                getResourceList.splice(i, 1)
                placeChange(getResourceList)
              }
            "
            >删除</a
          >
        </p>
      </FormItem>
      <FormItem class="brand-check">
        <p class="item" v-for="(item, i) in brandList" :key="item.id">
          <span>{{ item.name }}</span>
          <a
            href="javascript:;"
            style="margin-left: 10px;"
            @click="
              () => {
                brandList.splice(i, 1)
                brandChange(brandList)
              }
            "
            >删除</a
          >
        </p>
      </FormItem>
      <FormItem class="formItem" label="摘要" prop="summary">
        <Input
          type="textarea"
          class="width700 add-content-area"
          :autosize="{ minRows: 2, maxRows: 5 }"
          v-model="params.summary"
          :maxlength="200"
          style="font-size:12px;"
          placeholder="请填写内容摘要"
        />
      </FormItem>
      <FormItem class="formItem" label="内容" prop="content">
        <Input style="display: none;" v-model="params.content" />
        <!--改input仅仅用来辅助实现验证提示-->
        <div>
          <Ueditor
            v-if="editorFlag"
            id="uedit1"
            v-model="params.content"
          ></Ueditor>
        </div>
      </FormItem>

      <!-- 扩展字段S -->
      <template v-for="item in extendFieldList">
        <FormItem
          v-if="item.fieldType === '文本框（单行）'"
          class="formItem"
          :prop="item.fieldCode"
          :label="item.fieldName"
          :key="item.id"
        >
          <Input
            v-model="params[item.fieldCode]"
            :placeholder="item.defaultValue"
            class="width300"
          />
        </FormItem>

        <FormItem
          v-if="item.fieldType === '文本框（多行）'"
          class="formItem"
          :prop="item.fieldCode"
          :label="item.fieldName"
          :key="item.id"
        >
          <Input
            type="textarea"
            class="width700"
            :autosize="{ minRows: 2, maxRows: 5 }"
            v-model="params[item.fieldCode]"
            :placeholder="item.defaultValue"
          />
        </FormItem>

        <FormItem
          v-if="item.fieldType === '内容编辑器'"
          class="formItem"
          :prop="item.fieldCode"
          :label="item.fieldName"
          :key="item.id"
        >
          <Ueditor
            v-model="params[item.fieldCode]"
            :id="'uedit' + item.id"
          ></Ueditor>
        </FormItem>

        <FormItem
          v-if="item.fieldType === '复选框'"
          class="formItem"
          :prop="item.fieldCode"
          :label="item.fieldName"
          :key="item.id"
        >
          <CheckboxGroup
            :value="
              params[item.fieldCode] ? params[item.fieldCode].split(',') : []
            "
            @on-change="
              arr => {
                params[item.fieldCode] = arr.join(',')
              }
            "
          >
            <Checkbox
              v-for="ckVal in item.candidateValue.split(',')"
              :label="ckVal"
              :key="ckVal"
            >
            </Checkbox>
          </CheckboxGroup>
        </FormItem>

        <FormItem
          v-if="item.fieldType === '单选框'"
          class="formItem"
          :prop="item.fieldCode"
          :label="item.fieldName"
          :key="item.id"
        >
          <RadioGroup v-model="params[item.fieldCode]">
            <Radio
              v-for="ckVal in item.candidateValue.split(',')"
              :label="ckVal"
              :key="ckVal"
            >
            </Radio>
          </RadioGroup>
        </FormItem>

        <FormItem
          v-if="item.fieldType === '下拉列表（单选）'"
          class="formItem"
          :prop="item.fieldCode"
          :label="item.fieldName"
          :key="item.id"
        >
          <Select class="width300" v-model="params[item.fieldCode]">
            <Option
              v-for="ckVal in item.candidateValue.split(',')"
              :value="ckVal"
              :key="ckVal"
            >
              {{ ckVal }}
            </Option>
          </Select>
        </FormItem>

        <FormItem
          v-if="item.fieldType === '下拉列表（多选）'"
          class="formItem"
          :prop="item.fieldCode"
          :label="item.fieldName"
          :key="item.id"
        >
          <Select
            class="width300"
            multiple
            :value="
              params[item.fieldCode] ? params[item.fieldCode].split(',') : []
            "
            @on-change="
              arr => {
                params[item.fieldCode] = arr.join(',')
              }
            "
          >
            <Option
              v-for="ckVal in item.candidateValue.split(',')"
              :value="ckVal"
              :key="ckVal"
            >
              {{ ckVal }}
            </Option>
          </Select>
        </FormItem>

        <FormItem
          v-if="item.fieldType === '日期选择器'"
          class="formItem"
          :prop="item.fieldCode"
          :label="item.fieldName"
          :key="item.id"
        >
          <DatePicker
            type="date"
            placeholder="请选择日期"
            class="width300"
            @on-change="
              time => {
                params[item.fieldCode] = time
              }
            "
            :value="params[item.fieldCode]"
          >
          </DatePicker>
        </FormItem>

        <FormItem
          v-if="item.fieldType === '日期选择器（精确到分）'"
          class="formItem"
          :prop="item.fieldCode"
          :label="item.fieldName"
          :key="item.id"
        >
          <DatePicker
            type="datetime"
            placeholder="请选择日期"
            class="width300"
            @on-change="
              time => {
                params[item.fieldCode] = time
              }
            "
            :value="params[item.fieldCode]"
          >
          </DatePicker>
        </FormItem>

        <FormItem
          v-if="item.fieldType === '图片'"
          class="formItem"
          :label="item.fieldName"
          :key="item.id"
        >
          <UploadImg2
            @getImagesList="
              list => {
                params[item.fieldCode] = list.map(d => d.id).join(',')
              }
            "
          >
          </UploadImg2>
        </FormItem>
        <FormItem
          v-if="item.fieldType === '视频'"
          class="formItem"
          :label="item.fieldName"
          :key="item.id"
        >
          <UploadVideo2
            @getVideoList="
              list => {
                params[item.fieldCode] = list.map(d => d.id).join(',')
              }
            "
          >
          </UploadVideo2>
        </FormItem>
        <FormItem
          v-if="item.fieldType === '音频'"
          class="formItem"
          :label="item.fieldName"
          :key="item.id"
        >
          <UploadVoice
            @getVoiceList="
              list => {
                params[item.fieldCode] = list.map(d => d.id).join(',')
              }
            "
          >
          </UploadVoice>
        </FormItem>
        <FormItem
          v-if="item.fieldType === '附件'"
          class="formItem add-annex-del_txt"
          :label="item.fieldName"
          :key="item.id"
        >
          <Upload
            action="http://file.geeker.com.cn/uploadOSS"
            :on-success="
              (a, b, files) => {
                params[item.fieldCode] = files
                  .map(file => file.response.safeUrl)
                  .join(',')
              }
            "
            :on-remove="
              (a, files) => {
                params[item.fieldCode] = files
                  .map(file => file.response.safeUrl)
                  .join(',')
              }
            "
            show-upload-list
            :data="{ path: 'cultural-tourism-cloud' }"
            name="Filedata"
          >
            <Button icon="ios-cloud-upload-outline">添加附件</Button>
          </Upload>
        </FormItem>
      </template>
      <!-- 扩展字段E -->

      <FormItem class="formItem">
        <a class="add-more" @click="clickMore">
          更多功能
          <i class="cloud-icon add-more-icon" :class="{ active: showMore }"
            >&#xe702;</i
          >
        </a>
      </FormItem>
      <!-- 编辑更多信息S -->
      <div v-show="showMore">
        <FormItem class="formItem" label="标签">
          <Tags
              :resourceType="`CONTENT` || this.resourceType"
              labelType=""
              limit="5"
              :defaultIds="params.tag"
              @onChange="getTagIds"
            ></Tags>
          <!-- <CheckboxGroup style="float: left;" v-if="tagList.length" v-model="groupCheck">
            <Checkbox v-for="item in tagList" :key="item.id" :label="item.id">{{item.labelName}}
            </Checkbox>
          </CheckboxGroup> -->
          <!--8个做一行-->
          <!--<CheckboxGroup style="width: 100%"
                                   v-if="tagList.length"
                                   v-model="groupCheck">
                        <Row v-for="n in Math.ceil(tagList.length / 8)" :key="n">
                            <i-col span="3" v-for="item in tagList.slice((n-1)*8, n*8)" :key="item.id">
                                <Checkbox class="line1" :label="item.id" :title="item.labelName">{{item.labelName}}</Checkbox>
                            </i-col>
                        </Row>
          </CheckboxGroup>-->
          <!-- <div class="fl">
            <Input class="width300" :maxlength="20" v-model="addTagName"
              placeholder="请填写标签名称（最大字符长度20）" />
            <Button type="primary" class="ml10" @click="addTagHd">添加标签</Button>
          </div> -->
        </FormItem>
        <FormItem class="formItem" label="发布时间" prop="publishTime">
          <DatePicker
            @on-change="publishTimeChange"
            ref="publishTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            v-model="params.publishTime"
            placement="bottom"
            placeholder="请选择发布时间"
            class="width300"
          ></DatePicker>
        </FormItem>
        <FormItem class="formItem" label="图集">
          <UploadImg2
            :defaultImage="defaultImage"
            @getImagesList="getImagesList"
            :limit="30"
          >
          </UploadImg2>
        </FormItem>
        <FormItem class="formItem" label="视频">
          <UploadVideo2
            :defaultVideo="defaultVideo"
            @getVideoList="getVideoList"
            :limit="1"
          >
          </UploadVideo2>
        </FormItem>
        <FormItem class="formItem" label="音频">
          <UploadVoice
            :defaultVoice="defaultVoice"
            @getVoiceList="getVoiceList"
            :limit="1"
          >
          </UploadVoice>
        </FormItem>
        <FormItem class="formItem add-annex-del_txt" label="附件">
          <Upload
            action="http://file.geeker.com.cn/uploadOSS"
            :on-success="uploadSuccessHd"
            :on-remove="fileRemove"
            show-upload-list
            :data="{ path: 'cultural-tourism-cloud' }"
            name="Filedata"
            :default-file-list="fileList"
          >
            <Button icon="ios-cloud-upload-outline">添加附件</Button>
          </Upload>
        </FormItem>
        <FormItem class="formItem" label="模拟数据">
          <label>浏览量</label>
          <Input
            v-model="params.showNum"
            :maxlength="8"
            @on-keyup="params.showNum = params.showNum.replace(/[^\d]/g, '')"
            placeholder="请填写模拟浏览量"
            class="width150 mr10"
          />
          <label>点赞量</label>
          <Input
            v-model="params.likeNum"
            :maxlength="8"
            @on-keyup="params.likeNum = params.likeNum.replace(/[^\d]/g, '')"
            placeholder="请填写模拟点赞量"
            class="width150 mr10"
          />
          <label>收藏量</label>
          <Input
            v-model="params.collectionNum"
            :maxlength="8"
            @on-keyup="
              params.collectionNum = params.collectionNum.replace(/[^\d]/g, '')
            "
            placeholder="请填写模拟收藏量"
            class="width150 mr10"
          />
        </FormItem>
      </div>
      <!-- 编辑更多信息E -->
      <FormItem class="formItem" label>
        <Button @click="handleSave(4)" type="primary">保存</Button>
        <Button
          @click="handleSave(3)"
          v-if="showDraft"
          type="primary"
          class="ml10"
          >存草稿</Button
        >
        <Button class="ml10" @click="back">返回</Button>
      </FormItem>
    </Form>
    <UninPlace
      :show="showPlace"
      :defaultChoose="getPlaceIds"
      :orgId="params.createCompany"
      @onOkClick="placeChange"
      @onClose="showPlace = false"
    ></UninPlace>

    <Brand
      :show="showBrand"
      :selectIds="getBrandIds"
      :propParams="{ siteName: siteInfo.name }"
      @onOkClick="brandChange"
      @onClose="showBrand = false"
    ></Brand>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Ueditor from '@components/ueditor/ueditor.vue'
import UploadImg2 from '@components/upload/upload-image2.vue'
import UploadVideo2 from '@components/upload/upload-video2.vue'
import UploadVoice from '@components/upload/upload-voice.vue'
//    import UninPlace from "@components/uninPlace/uninPlace.vue";
import UninPlace from "@components/uninPlace/uninPlace2.vue";
import Brand from "@components/pop/brand.vue";
import Tags from "@components/tags/tags.vue";
import {
  getContentColumnList,
  getContentExtendColumn,
  saveAddContent,
  getLabelList,
  saveAddTag,
  createrList,
  getContent,
  getVoiceDetail,
  getVideoDetail,
  getImgDetail,
  saveAuditUpdateData,
  contentGetRecord,
  contentClearRecord
} from "@service/content";
import { filterChar } from "@util/comm";
import { getTagDetail } from "@service/tool";
import { AppModule } from "@store/modules/app";

interface fileList {
  [index: number]: { response: { state: number; url: string } }
  length: number
}

interface placeType {
  address: string
  id: number
  images: string
  name: string
  resourceType: string
  resourceTypeName: string
  status: string
  linksResourceType: string
  linksResourceIds: string
}

interface imgType {
  id: number
  url: string
  name?: string
}

interface videoType {
  id: number
  imgUrl: string
  url: string
  name?: string
}

interface voiceType {
  id: number
  url: string
  imgUrl: string
  name?: string

  [propName: string]: any
}

@Component({
  components: {
    Ueditor,
    UninPlace,
    UploadImg2,
    UploadVideo2,
    UploadVoice,
    Brand,
    Tags
  }
})
export default class AddContent extends Vue {
  isSite = process.env.VUE_APP_STATUS === 'SITE'
  private siteInfo: any = AppModule.siteInfo
  // 提交参数
  private params = <any>{
    channelId: '',
    title: '',
    author: '',
    source: '',
    sourceUrl: '',
    createCompany: this.$store.state.app.userInfo.orgId || -1, // 创建者
    resourceLinks: '',
    summary: '',
    content: '',
    contentType: 'CONTENT',
    tag: '',
    images: '',
    annex: '',
    video: '',
    showNum: '',
    likeNum: '',
    collectionNum: '',
    audio: '',
    publishTime: ''
  }
  // 已有附件列表
  private fileList: Array<any> = [
    /*{
                name: "泸州智慧旅游二期建设项目_项目实施表V1.1.xlsx",
                percentage: 100,
                showProgress: false,
                status: "finished",
                response: {
                    url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1560836239231/项目提测模板.docx"
                }
            }*/
  ]
  // 验证规则
  private ruleValidate = <any>{
    channelId: [
      {
        required: true,
        message: '请将信息填写完整'
      }
    ],
    title: [
      {
        required: true,
        message: '请将信息填写完整',
        trigger: 'blur'
      },
      {
        message: '只能输入2-100个字符',
        trigger: 'blur',
        pattern: /^.{2,100}$/
      }
    ],
    author: [
      {
        message: '只能输入2-100个字符',
        trigger: 'blur',
        // pattern: /^[\u4e00-\u9fa5A-Za-z,，、 ]{2,100}$/
        pattern: /^.{2,100}$/
      }
    ],
    content: [
      {
        required: true,
        trigger: 'change',
        message: '请将信息填写完整'
      }
    ]
  }
  // 查看更多
  private showMore = false
  // 添加标签
  private addTagName: string = ''
  // 选择场所
  private showPlace: boolean = false
  // 栏目下拉
  private columnList: Array<object> = []
  // tag标签列表
  private tagList: object[] = [
    /*{
              id: 1,
                labelName: 'label1',
            }*/
  ]
  // 扩展字段
  private extendFieldList: object[] = []
  // 创建者列表
  private createrList: object[] = []
  // 内容id
  private id?: number
  // 资源类型
  private resourceType: string = 'CONTENT'
  // 回显图片
  private defaultImage: Array<imgType> = [
    /*{
              id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561018189648/ad20190513.jpg",
                name: "ad20190513"
            }*/
  ]
  // 回显视频
  private defaultVideo: Array<videoType> = [
    /*{
                id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561098509967/cc79b43170d504d20c9cf1f84e360a90.mp4",
                imgUrl: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561099755721/微信图片_20190422150111.jpg",
                name: "ad20190513"
            }*/
  ]
  // 回显音频
  private defaultVoice: Array<voiceType> = [
    /*{
                id:51 ,
                url: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561027609568/xxxx.mp3",
                imgUrl: "http://file.geeker.com.cn/uploadfile/cultural-tourism-cloud/1561099755721/微信图片_20190422150111.jpg",
                name: "ad20190513"
            }*/
  ]
  // tags group
  private groupCheck: number[] = []
  // 内容id
  private contentId?: number
  // 回显页面内容
  private content: any
  // 扩展字段回显值
  private extendInfo: any
  // 尴尬的哨兵变量，记录第一次render扩展字段
  private extendFirstFlag: boolean = true
  // editor渲染的时候它会读取容器宽来设置到自身上，渲染的时候容器还没成型，读取的宽多了，就延迟到容器ok了再渲染
  private editorFlag: boolean = false

  // pop资源弹窗回显的
  get getPlaceIds() {
    let res = []
    if (this.params.resourceLinks) {
      res = JSON.parse(this.params.resourceLinks).map((data: any) => {
        data.id = data.linksResourceIds
        data.resourceType = data.linksResourceType
        return data
      })
    }
    return res
  }
  // pop资源弹窗回显的
  get getBrandIds() {
    return this.brandList.map((d: any) => d.id)
  }
  // 是否显示保存草稿
  get showDraft() {
    return !Boolean(this.params.id) || [3, 7, 8].includes(this.params.status)
  }
  // 添加栏目的权限是否有
  get addColumnOperate(): boolean {
    let b = false
    let content_column = AppModule.nav.find(
      (d: any) => d.menuCode === 'content_site'
    ) // 内容菜单
    if (content_column && content_column.child) {
      let column_list = content_column.child.find(
        (d: any) => d.menuCode === 'content_channel_site'
      ) // 栏目管理菜单
      b =
        column_list &&
        column_list.operates.some((e: any) => e.operateCode === 'save')
    }
    return b
  }

  created() {
    this.getRecord();
    this.getContentColumnList();
    this.getLabelList();
    this.getCreaterList();
    this.$route.query.id && (this.contentId = Number(this.$route.query.id));
    this.getContent();
  }

  mounted() {
    setInterval(() => {
      this.editorFlag = true
    }, 30)
  }
  // 跳转新页面添加栏目
  gotoAddColumn() {
    let { href } = window.location
    href = href.split('#/')[0]
    window.open(`${href}#/con-column-add`, '_blank')
  }
  // 刷新栏目下拉框选项
  refreshColum() {
    this.getContentColumnList(() => {
      this.columnList = []
      this.$Message.success('刷新栏目成功！')
    })
  }
  // 监听添加标签，做特殊字符过滤
  @Watch('addTagName', { immediate: true })
  filterTagName(val: string, oldValue: any) {
    this.addTagName = filterChar(val)
  }

  // 监听栏目选择
  @Watch('params.channelId', { immediate: true, deep: true })
  columSele(newId: any, oldId: any) {
    if (newId && newId !== oldId) {
      getContentExtendColumn({
        channelId: newId
      }).then(result => {
        // 卸载字段
        let newParams = { ...this.params }
        let newRuleValidate = { ...this.ruleValidate }
        this.extendFieldList.forEach((item: any) => {
          if (item.fieldCode in newParams) {
            delete newParams[item.fieldCode]
            delete newRuleValidate[item.fieldCode]
          }
        })
        // 添加字段
        let dataList: Array<object> = []
        if (result && result.datas && result.datas.length) {
          dataList = result.datas
          dataList.forEach((item: any) => {
            newParams[item.fieldCode] = '' // item.defaultValue
            let rule = []
            if (item.must) {
              rule.push({
                required: true,
                message: '请将信息填写完整',
                trigger: 'blur'
              })
            }
            if (item.validate) {
              if (
                ['文本框（单行）', '文本框（多行）', '内容编辑器'].includes(
                  item.fieldType
                )
              ) {
                rule.push({
                  message: item.failPrompt,
                  trigger: 'blur',
                  pattern: eval(item.validateRule)
                })
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
            newRuleValidate[item.fieldCode] = rule
          })
        }
        // 设置字段
        this.params = newParams

        // 这里清空ruleValidate的字段，再赋值新字段，不直接赋值newRuleValidate对象，为了解决初始默认验证提示
        for (let attr in this.ruleValidate) {
          delete this.ruleValidate[attr]
        }
        Object.assign(this.ruleValidate, newRuleValidate)
        //                    this.ruleValidate = newRuleValidate

        this.extendFieldList = dataList
        if (this.extendInfo && this.extendFirstFlag) {
          // 回显扩展字段值,这里尴尬的判断主要考虑到content内容接口和扩展字段接口返回的时间先后问题
          Object.assign(this.params, this.extendInfo)
          this.extendInfo = null
        }
        this.extendFirstFlag = false
      })
    }
  }

  // 监测check选择变化
  @Watch('groupCheck')
  groupCheckC(val: any) {
    if (val) {
      if (val.length > 5) {
        this.groupCheck = val.slice(0, -1)
        this.$Message.info('最多只能选择5个标签！')
      }
      this.params.tag = val.join(',')
    }
  }
 //标签
  getTagIds(value: any) {
    this.params.tag = value;
  }
  // 监测创建者选择变化
  @Watch('params.createCompany')
  createCompanyChange(val: any) {
    if (!/-1/.test(val)) {
      this.brandList = []
    }
  }

  // 获取内容详情
  private getContent() {
    if (this.contentId) {
      getContent({ id: this.contentId }).then((res: any) => {
        if (res.code === 0) {
          this.content = res.data
          this.renderContent()
        }
      })
    }
  }

  // 回显页面内容处理
  private renderContent() {
    let {
      channelId,
      title,
      author,
      source,
      sourceUrl,
      createCompany,
      resourceLinks,
      summary,
      content,
      tag,
      publishTime,
      images,
      video,
      audio,
      annex,
      collectionNum,
      likeNum,
      showNum,
      contentType,
      id,
      resourceNames,
      resourceLinksInfo,
      extendInfo // 扩展字符key: value对象
    } = this.content
    if (publishTime) {
      // 时间回显字符串不得行，使用时间对象
      publishTime = new Date(publishTime)
    }
    let newParam = <any>{
      channelId,
      title,
      author,
      source,
      sourceUrl,
      createCompany,
      resourceLinks,
      summary,
      content,
      tag,
      publishTime,
      images: images,
      video: video,
      audio: audio,
      annex: annex ? annex.toString() : '',
      collectionNum,
      likeNum,
      id,
      contentType,
      showNum
    }
    for (let attr in newParam) {
      if (newParam[attr] === undefined) delete newParam[attr]
    }
    Object.assign(this.params, newParam)
    if (resourceLinksInfo) {
      // 关联资源回显
      let resourceLink = <any>[]
      resourceLinksInfo.forEach((d: any) => {
        if (d.resourceType === 'CONTENT_TYPE_BRAND') {
          this.brandList.push({
            id: d.resourceId,
            name: d.resourceName
          })
        } else {
          resourceLink.push({
            linksResourceType: d.resourceType,
            linksResourceIds: d.resourceId,
            name: d.resourceName
          })
        }
      })
      this.placeChange(resourceLink)
    }
    if (tag) {
      // 回显tag
      this.groupCheck = tag.split(',').map((id: any) => Number(id))
    }
    if (images) {
      // 回显图集
      // 接口改了，这段不适用了
      /*let req = this.getMediaDetailFn('image')
                let promiseList = String(images).split(',').map((id:any) => req(Number(id)))
                Promise.all(promiseList).then((list: Array<any>) => {
                    this.defaultImage = list
                }).catch(e => console.log(e));*/
      this.defaultImage = JSON.parse(images).map((item: any, i: number) => {
        item.id = 'id_' + i
        return item
      })
    }
    if (video) {
      // 回显video
      // 接口改了，这段不适用了
      /*let req = this.getMediaDetailFn('video')
                let promiseList = String(video).split(',').map((id: any) => req(Number(id)))
                Promise.all(promiseList).then((list: Array<any>) => {
                    this.defaultVideo = list
                }).catch(e => console.log(e));*/
      this.defaultVideo = [JSON.parse(video)].map((item: any, i: number) => {
        item.id = 'id_' + i
        return item
      })
    }
    if (audio) {
      // 回显audio
      // 接口改了，这段不适用了
      /*let req = this.getMediaDetailFn('audio')
                let promiseList = String(audio).split(',').map((id:any) => req(Number(id)))
                Promise.all(promiseList).then((list: Array<any>) => {
                    this.defaultVoice = list
                }).catch(e => console.log(e));*/
      this.defaultVoice = [JSON.parse(audio)].map((item: any, i: number) => {
        item.id = 'id_' + i
        return item
      })
    }
    if (annex && annex.length) {
      // 回显附件
      this.fileList = annex.map((url: string) => ({
        name: url.split('/')[url.split('/').length - 1],
        response: {
          url: url
        }
      }))
    }
    if (extendInfo) {
      // 回显扩展字段值
      this.extendInfo = extendInfo
      Object.assign(this.params, extendInfo)
    }
  }

  // 获取媒体资源详情
  private getMediaDetailFn(type: string) {
    let reqs: { [propName: string]: any } = {
      image: getImgDetail,
      video: getVideoDetail,
      audio: getVoiceDetail
    }
    let currReq = reqs[type] as { (param: { id: number }): any }
    return (id: number) => {
      return new Promise((resolve, reject) => {
        currReq({ id })
          .then((res: any) => {
            if (res.data && res.data.res) {
              resolve(res.data.res)
            } else {
              resolve()
            }
          })
          .catch((e: any) => {
            resolve()
          })
      })
    }
  }

  // 获取创建者
  private getCreaterList() {
    createrList().then((res: any) => {
      if (res.code === 0) {
        this.createrList = res.datas
      }
    })
  }

  // 返回
  private back(t?: number) {
    setTimeout(() => {
      window.history.back()
    }, t || 0)
  }

  // 场所选择
  private getResourceList: Array<placeType> = []
  private placeChange(list: Array<placeType>) {
    if (list) {
      this.getResourceList = this.getResourceList.concat(
        list.filter(
          (d: any) => !this.getResourceList.some((ele: any) => ele.id === d.id)
        )
      )
      let resourceLinks = this.getResourceList.map((item: placeType) => {
        /*item字段取法解释：回显修改的时候，内容详情接口返回的场所字段是linksResourceType这种，场所列表接口返回的是resourceType这种，不一致*/
        return {
          linksResourceType: item.linksResourceType || item.resourceType,
          linksResourceIds: item.linksResourceIds || item.id
        }
      })
      this.params.resourceLinks = JSON.stringify(resourceLinks)
    }
  }

  // 品牌选择
  private brandList: Array<any> = []
  private brandChange(list: Array<any>) {
    if (list) {
      this.brandList = this.brandList.concat(
        list.filter(
          (d: any) => !this.brandList.some((ele: any) => ele.id === d.id)
        )
      )
    }
  }

  // 移除附件
  private fileRemove(p1: any, fileList: any) {
    this.params.annex = fileList.map((res: any) => res.response.url).join(',')
  }

  // 附件上传成功
  private uploadSuccessHd(
    response: { state: number; url: string },
    file: object,
    fileList: any
  ) {
    this.params.annex = fileList
      .map((res: any) => res.response.safeUrl)
      .join(',')
  }

  // 选择视屏
  private async getVideoList(list: Array<{ id: number }>) {
    //            this.params.video = list.map((data: any) => (data.id || '')).join(',')
    /*后台需要标签的名字，先把标签名字查出来S*/
    let allPromise: Array<Promise<any>> = []
    list.forEach((data: any) => {
      data.tagNames = []
      if (data.tags) {
        allPromise.concat(
          data.tags.split(',').map(
            (id: any) =>
              new Promise((resolve, reject) => {
                getTagDetail({ id })
                  .then((res: any) => {
                    if (res.code === 0) {
                      data.tagNames.push(res.data.labelName)
                    }
                  })
                  .finally(resolve)
              })
          )
        )
      }
    })
    await Promise.all(allPromise)
    /*后台需要标签的名字，先把标签名字查出来E*/

    this.params.video = JSON.stringify(
      list.map((data: any) => ({
        imgUrl: data.imgUrl,
        name: data.name,
        url: data.url,
        resourceId: data.placeId,
        resourceType: data.placeType,
        description: data.description,
        tagNames: data.tagNames,
        tagIds: data.tags,
        duration: data.duration
      }))[0]
    ) //[0] 一条数据时候后台不要数组
  }

  // 选择图片
  private async getImagesList(list: Array<{ id: number }>) {
    //            this.params.images = list.map((data: any) => (data.id || '')).join(',')
    /*后台需要标签的名字，先把标签名字查出来S*/
    let allPromise: Array<Promise<any>> = []
    list.forEach((data: any) => {
      data.tagNames = []
      if (data.tags) {
        allPromise.concat(
          data.tags.split(',').map(
            (id: any) =>
              new Promise((resolve, reject) => {
                getTagDetail({ id })
                  .then((res: any) => {
                    if (res.code === 0) {
                      data.tagNames.push(res.data.labelName)
                    }
                  })
                  .finally(resolve)
              })
          )
        )
      }
    })
    await Promise.all(allPromise)
    /*后台需要标签的名字，先把标签名字查出来E*/

    this.params.images = JSON.stringify(
      list.map((data: any) => ({
        name: data.name,
        url: data.url,
        resourceId: data.placeId,
        resourceType: data.placeType,
        description: data.description,
        tagNames: data.tagNames,
        tagIds: data.tags
      }))
    )
  }

  // 选择声音
  private async getVoiceList(list: Array<{ id: number }>) {
    /*后台需要标签的名字，先把标签名字查出来S*/
    let allPromise: Array<Promise<any>> = []
    list.forEach((data: any) => {
      data.tagNames = []
      if (data.tags) {
        allPromise.concat(
          data.tags.split(',').map(
            (id: any) =>
              new Promise((resolve, reject) => {
                getTagDetail({ id })
                  .then((res: any) => {
                    if (res.code === 0) {
                      data.tagNames.push(res.data.labelName)
                    }
                  })
                  .finally(resolve)
              })
          )
        )
      }
    })
    await Promise.all(allPromise)
    /*后台需要标签的名字，先把标签名字查出来E*/

    this.params.audio = JSON.stringify(
      list.map((data: any) => ({
        imgUrl: data.imgUrl,
        name: data.name,
        url: data.url,
        resourceId: data.placeId,
        resourceType: data.placeType,
        description: data.description,
        tagNames: data.tagNames,
        tagIds: data.tags,
        duration: data.duration
      }))[0]
    ) //[0] 一条数据时候后台不要数组
  }

  // 发布时间改变
  private publishTimeChange(time: string) {
    this.params.publishTime = time
  }

  // 获取标签列表
  private getLabelList() {
    getLabelList({
      resourceType: 'CONTENT' || this.resourceType
    }).then((result: any) => {
      if (result.datas) {
        this.tagList = result.datas
      }
    })
  }

  // 点击保存
  private handleSave(status?: number) {
    ;(this.$refs.params as any).validate((valid: any) => {
      if (!valid) {
        this.$Message.error('请将信息填写完整！')
        return
      }
      this.submitForm(status)
    })
  }

  // 保存栏目
  private submitForm(status?: number) {
    let audit = this.$route.query.auditId
    let reqFn = saveAddContent
    if (status) this.params.status = status
    if (typeof this.params.publishTime === 'object') {
      this.params.publishTime = (this.$refs.publishTime as any).formatDate(
        this.params.publishTime
      )
    }
    if (audit) {
      this.params.auditManageId = audit
      reqFn = saveAuditUpdateData
    }

    this.params.resourceLinks = JSON.parse(
      this.params.resourceLinks || '[]'
    ).concat(
      this.brandList.map((d: any) => ({
        linksResourceType: 'CONTENT_TYPE_BRAND',
        linksResourceIds: d.id
      }))
    )
    this.params.resourceLinks = JSON.stringify(this.params.resourceLinks)
    reqFn(this.params).then(data => {
      if (data.code === 0) {
        this.$Message.success('保存成功！')
        if (this.$route.query.id) {
          this.back()
        } else {
          this.$router.push({ path: '/con-list' })
        }
      }
    })
  }

  // 查看更多
  private clickMore() {
    this.showMore = !this.showMore
  }

  // 添加标签
  private addTagHd() {
    if (!this.addTagName) return
    saveAddTag({
      resourceType: this.resourceType,
      labelName: this.addTagName
    }).then((res: any) => {
      if (res.code === 0) {
        this.tagList.push({
          labelName: res.data.labelName,
          id: res.data.id
        })
        this.addTagName = ''
      }
    })
  }

  // 打开场所弹窗
  private openPlacePop() {
    if (this.params.createCompany) {
      this.showPlace = true
    } else {
      this.$Message.info('请先选择创建者！')
    }
  }

  private showBrand: boolean = false
  // 打开弹窗
  private openBrandPop() {
    this.showBrand = true
    // if (this.params.createCompany) {
    //   this.showBrand = true;
    // } else {
    //   this.$Message.info("请先选择创建者！");
    // }
  }

  // 获取栏目列表
  private getContentColumnList(callback?: () => void) {
    getContentColumnList({}).then(data => {
      let datas = data.datas as Array<any>
      if (datas && datas.length) {
        callback && callback()
        this.filterArr(datas)
        if (!this.params.channelId) this.params.channelId = datas[0].id
      }
    })
  }

  private filterArr(arr: Array<any>) {
    let _this = this
    arr.filter((item: any) => {
      _this.columnList.push(item)
      item.channelLevel = 0
      return _this.filterObj(item)
    })
  }

  private filterObj(item: any) {
    let _this = this
    if (item.hasOwnProperty('subset')) {
      item.subset.filter(function(child: any) {
        child.channelLevel = item.channelLevel + 1
        _this.columnList.push(child)
        if (child.hasOwnProperty('subset')) {
          return _this.filterObj(child)
        }
      })
    }
  }
  //获取内容作者或者来源列表
  private sourceList: any = []
  private authorList: any = []
  private getRecord() {
    let type = [
      { type: 'content_author_record:', name: 'authorList' },
      { type: 'content_source_record:', name: 'sourceList' }
    ]
    type.forEach((item: any) => {
      contentGetRecord({
        type: item.type,
        size: 10
      }).then((res: any) => {
        if (res.code === 0) {
          this[item.name] = res.datas
        }
      })
    })
  }
  // 清楚记录
  private contentClearRecord(type: string): Promise<any> {
    return new Promise((resolve: Function, reject: Function) => {
      contentClearRecord({type}).then((res:any) => {
        if (res.code === 0) {
          this.$Message.success('操作成功！')
          resolve()
        } else {
          reject()
        }
      }).catch(()=>reject())
    })
  }
}
</script>
<style lang="scss">
.add-content-area {
  textarea {
    font-size: 12px;
  }
}
</style>
<style lang="scss" scoped>
.mr10 {
  margin-right: 10px; 
}
.record-list{
  .record-item{
    display:inline-block;
    // color:$theme;
    font-size:12px;
    cursor:pointer;
    &+.record-item{
      margin-left:10px;
    }
  }
  .btn-clear {
    color:$theme;
    cursor: pointer;
  }
  p {
    line-height: 18px;
    margin-top: 6px;
  }
}
.tiptip {
  margin-right: 4px;
  color: #777;
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

.line1 {
  @include ellipsis();
  max-width: 12em;
}

.rotate {
  transform: rotateZ(180deg);
}

.place-check {
  margin-top: -20px;
  .item {
    margin: 0 !important;
    line-height: 20px;
    &:first-child:before {
      content: '已关联资源';
      position: absolute;
      left: -72px;
    }
  }
}

.brand-check {
  margin-top: -20px;
  .item {
    margin: 0 !important;
    line-height: 20px;
    &:first-child:before {
      content: '已关联品牌';
      position: absolute;
      left: -72px;
    }
  }
}

.add-content-box {
  background: $grayDark;
  .add-more {
    color: $theme;
    cursor: pointer;
    &:hover {
      color: $theme-hover;
    }
  }
  .add-more-icon {
    display: inline-block;
    font-size: 10px;
    margin-left: 10px;
    transform-origin: center;
    transition: all 0.4s linear;
    &.active {
      transform: rotate(180deg);
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
    .right01 {
      width: 800px;
    }
    label {
      margin-right: 10px;
      font-size: 12px;
      color: #666;
    }
    .right {
      flex: 1;
      overflow: hidden;
    }
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
