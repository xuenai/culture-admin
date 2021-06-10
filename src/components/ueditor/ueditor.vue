<template>
  <div :key="sid" style="margin-right:30px;max-width:1130px;">
    <script :id="sid" type="text/plain"></script>
    <!-- 关联场所弹窗 -->
    <uninPlace
      :show="place"
      :orgId="$store.state.app.userInfo.orgId"
      title="添加场所"
      @onOkClick="onOkClick"
      @onClose="place=false"
    ></uninPlace>
    <uninProduct :show="product" @onOkClick="onOkClickProduct" @onClose="product=false"></uninProduct>
    <uninActivity
      :show="activity"
      title="添加活动"
      @onOkClick="onOkClickActivity"
      @onClose="activity=false"
    ></uninActivity>
    <!-- word文档上传 -->
    <input
      class="wordpaster-input"
      :ref="`${id}_input`"
      type="file"
      accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      @change="acceptInput($event)"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import uninPlace from "@components/uninPlace/uninPlace.vue";
import uninProduct from "@components/uninProduct/uninProduct.vue";
import uninActivity from "@components/uninActivity/uninActivity.vue";
import { getResourceByType } from "@service/tool";
import CONFIG from "@util/config";
import { word2Html } from "@service/tool";

interface IframeParams {
  path: string;
  url: string;
  id: any;
  type: any;
  siteId?: any;
  height?: number;
}

@Component({ components: { uninPlace, uninProduct, uninActivity } })
/**
 * 使用富文本添加 商品、场所、活动时，请勿在本地服务添加，到指定的测试地址、或正式地址去添加，否则会有问题(添加为你自己本地的地址了)
 *
 * 参数说明
 * id: 编辑器id值，同一页面id不可相同
 * readonly: true 设置编辑器只读，不可编辑 默认:false
 * @getContentTxt 可以监听此事件获取到编辑器纯文本内容
 * button: ['addProduct', 'addPlace', 'addActive']  自定义的按钮功能，默认时显示三个按钮，若需要单独显示时，则只传一个值，都不需要时 传空 []
 * ex:     <Ueditor v-model="formData.hint" id="uedit2"></Ueditor>
 */
export default class Ueditor extends Vue {
  private editor: any = {};
  // 设置prop类型
  @Prop() private id!: any;
  @Prop() private value: any;
  @Prop() private readonly!: boolean;
  @Prop() private button!: Array<string>;
  private sid = "";
  created() {
    this.sid = new Date().getTime() + "" + this.id;
    // 添加功能按钮
    if (!this.button && this.$store.state.app.userInfo.dataType != "CLOUD") {
      this.addButton();
    }
  }
  @Watch("value")
  wValue(v: any) {
    !v.length && this.setContent(v);
  }
  mounted() {
    setTimeout(() => {
      this.editor = (window as any).UE.getEditor(this.sid, {
        initialFrameHeight: 500,
        autoHeightEnabled: false
      });
      // @ts-ignore
      window[this.sid] = this.editor;
      // 绑定监听
      this.addListeners();
    }, 200);
  }
  beforeDestroy() {
    Object.keys(this.editor).includes("destory") && this.editor.destroy();
    // @ts-ignore
    window[this.sid] && window[this.sid].destroy();
  }
  // 添加监听事件
  private addListeners() {
    if (this.editor) {
      // 编辑器初始化完成
      this.editor.addListener("ready", () => {
        // 延迟.2秒生成editor，再延迟1s加载内容数据，这要是接口还没返回数据，我就真的没办法了 !!!∑(ﾟДﾟノ)ノ
        if (this.value) {
          this.setContent(this.value);
        } else {
          setTimeout(() => {
            this.setContent(this.value);
          }, 1000);
        }
        if (this.readonly) {
          this.editor.setDisabled();
        }
      });
      let _this = this.editor;
      this.editor.addListener("contentChange", () => {
        let content = this.getContent();
        this.$emit("input", content);
        let txt = _this.getPlainTxt();
        this.$emit("getContentTxt", txt);
      });
    }
  }
  px2Rem(str: string) {
    return str.replace(/(0|([1-9]\d*))(\.\d+)?px/g, function(s) {
      s = s.replace("px", "");
      // @ts-ignore
      let value = parseFloat((parseInt(s) * 2) / 100).toFixed(2);
      return value === 0.0 ? "0" : `${value}rem`;
    });
  }
  // 编辑器回显内容
  private setContent(con: any) {
    this.editor.setContent(con);
  }
  // 获取缩放后的内容
  private getContent() {
    // @ts-ignore
    let replace = window[this.sid].getContent() || "";
    if (replace) {
      replace = this.px2Rem(replace);
    }
    return replace;
  }
  // word文档按钮点击
  addWord() {
    // @ts-ignore
    this.$refs[`${this.id}_input`].click();
  }
  /**
   * 上传文件
   */
  acceptInput(e: any) {
    let file = e.target.files[0];
    let _input = this.$refs[`${this.id}_input`] as HTMLElement;
    _input.setAttribute("type", "text");

    let formData = new FormData();
    formData.append("file", file);
    word2Html(formData).then((res: any) => {
      if (res.code === 0) {
        this.editor.execCommand("inserthtml", res.data);
      }
    });

    _input.setAttribute("type", "file");
  }
  // 添加按钮
  private addButton() {
    let btnArr = this.button
      ? this.button.join(" ")
      : "addProduct addPlace addActive wordpaster";
    let _this = this;
    (window as any).UE.registerUI(
      btnArr,
      function(editor: any, uiName: any) {
        //注册按钮执行时的command命令，使用命令默认就会带有回退操作
        editor.registerCommand(uiName, {
          execCommand: function() {}
        });
        let uiNameStr = uiName;
        //创建一个button
        let btn = new (window as any).UE.ui.Button({
          //按钮的名字
          name: uiName,
          //提示
          title: _this.getTipsName(uiName),
          //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
          cssRules: "",
          //点击时执行的命令
          onclick: function() {
            _this.editor = editor;
            //这里可以不用执行命令,做你自己的操作也可
            switch (uiNameStr) {
              case "addProduct":
                {
                  // 添加商品
                  _this.showProductDialog();
                }
                break;
              case "addPlace":
                {
                  // 添加场所
                  _this.showPlaceDialog();
                }
                break;
              case "addActive":
                {
                  // 添加活动
                  _this.showActivityDialog();
                }
                break;
              case "wordpaster":
                {
                  _this.addWord();
                }
                break;
            }
          }
        });
        //当点到编辑内容上时，按钮要做的状态反射
        editor.addListener("selectionchange", function() {
          let state = editor.queryCommandState(uiName);
          if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
          } else {
            btn.setDisabled(false);
            btn.setChecked(state);
          }
        });

        //因为你是添加button,所以需要返回这个button
        return btn;
      } /*index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮*/
    );
  }

  private getTipsName(key: string) {
    let names: any = {
      wordpaster: "上传Word文档",
      addPlace: "添加场所",
      addProduct: "添加商品",
      addActive: "添加活动"
    };
    return names[key];
  }

  // 获取插入编辑器的公共内容
  private getIframeStr(params: IframeParams) {
    let { path, url, id, type, siteId, height } = params;
    let domain = this.$store.state.app.userInfo.h5Domain || "";
    // 开发环境测试富文本编辑器
    // let domain = `http://site227958.c-ctc.dev.daqsoft.com/dist_app`
    let fileName = CONFIG.ueditorIsTest ? "template_test" : "template";
    let src = `${domain}/${fileName}/${path}.html?data-id=${id}&data-type=${type}&data-siteid=${siteId}&data-url=${url}`; // 正式
    // let src = `${domain}/dist_app/${fileName}/${path}.html?data-id=${id}&data-type=${type}&data-siteid=${siteId}&data-url=${url}`; // 开发环境
    if (!height) {
      height = 2.6;
    }
    return `
      <p style="text-align: center;">
        <iframe src="${src}" data-id="${id}" data-type="${type}" data-siteid="${siteId}" data-url="${url}" style="width:6.65rem;height:${height}rem;" scrolling="no" frameborder="0"></iframe>
      </p>
    `;
  }
  /* S 关联场所弹窗 */
  private place = false;
  private showPlaceDialog() {
    this.place = true;
  }
  private onOkClick(list: Array<any>) {
    // 场所数据写入
    let _this = this;
    // url 为点击时要跳转的活动详情页
    let str = "",
      url = "";
    list.forEach((item: any) => {
      // str += _this.getIframeStr('place',url,item.id,item.resourceType,item.siteId)
      str += _this.getIframeStr({
        path: "place",
        url,
        id: item.id,
        type: item.resourceType,
        siteId: item.siteId,
        height: 3.2
      });
    });
    _this.editor.execCommand("inserthtml", str);
  }
  /* E 关联场所弹窗 */

  /* S 添加商品弹窗 */
  private product = false;
  private showProductDialog() {
    this.product = true;
  }
  private onOkClickProduct(list: Array<any>) {
    // 商品数据写入
    let _this = this;
    // url 为点击时要跳转的活动详情页
    let str = "",
      url = "";
    list.forEach((item: any) => {
      // str += _this.getIframeStr('product',url,item.productSn,'')
      let height = 0;
      height = item.saleType === 2 ? 7 : 0;
      str += _this.getIframeStr({
        path: "product",
        url,
        id: item.productSn,
        type: "",
        height
      });
    });
    _this.editor.execCommand("inserthtml", str);
  }
  /* E 添加商品弹窗 */

  /* S 添加活动弹窗 */
  private activity = false;
  private showActivityDialog() {
    this.activity = true;
  }
  private onOkClickActivity(list: Array<any>) {
    // 活动数据写入
    let _this = this;
    // url 为点击时要跳转的活动详情页
    let str = "",
      url = "";
    list.forEach((item: any) => {
      // str += _this.getIframeStr('activity',url,item.id,'',item.siteId)
      str += _this.getIframeStr({
        path: "activity",
        url,
        id: item.id,
        type: "",
        siteId: item.siteId,
        height: 6.8
      });
    });
    _this.editor.execCommand("inserthtml", str);
  }
  /* E 添加活动弹窗 */
}
</script>

<style lang="scss" scoped>
.wordpaster-input {
  display: block;
  width: 0;
  height: 0;
  visibility: hidden;
}
.condition {
  min-width: 800px;
  display: flex;
  .fromItem {
    display: flex;
    margin-right: 10px;
    label {
      display: inline-block;
      width: 80px;
      text-align: right;
      margin-right: 5px;
    }
  }
}
.table {
  max-height: 600px;
  overflow: auto;
  margin-top: 10px;
}
.imgDiv {
  width: 50px;
  height: 50px;
  margin: 5px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
<style lang='scss'>
.edui-default .edui-toolbar .edui-button.edui-for-addProduct .edui-icon {
  width: 75px !important;
  height: 20px !important;
  margin-left: 8px;
  padding-left: 20px;
  line-height: 20px;
  background: url("../../assets/image/添加商品.png") left center no-repeat !important;
  &::after {
    content: "添加商品";
    font-size: 12px;
    color: $font02;
    position: relative;
  }
}
.edui-default .edui-toolbar .edui-button.edui-for-addPlace .edui-icon {
  width: 75px !important;
  height: 20px !important;
  padding-left: 20px;
  margin-left: 3px;
  line-height: 20px;
  background: url("../../assets/image/添加场所.png") left center no-repeat !important;
  &::after {
    content: "添加场所";
    font-size: 12px;
    color: $font02;
    position: relative;
  }
}
.edui-default .edui-toolbar .edui-button.edui-for-addActive .edui-icon {
  width: 75px !important;
  height: 20px !important;
  padding-left: 20px;
  margin-left: 3px;
  line-height: 20px;
  background: url("../../assets/image/添加活动.png") left center no-repeat !important;
  &::after {
    content: "添加活动";
    font-size: 12px;
    color: $font02;
    position: relative;
  }
}
</style>