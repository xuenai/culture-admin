<template>
  <div class="level">
    <!-- 还未开通商城时展示 -->
    <div class="fun fun1" v-if="!$store.state.app.userInfo.shopCode">
      <div class="icon cloud-icon">&#xe7d9;</div>
      <div class="text">
        <h3>还未开通商城</h3>
        <p>开通商城与文化旅游云同步共享会员等级及积分。</p>
      </div>
      <div class="btn">
        <Button class="btn-min" type="primary" @click="openElectricity">立即开通</Button>
      </div>
    </div>
    <!-- 商城同步 -->
    <div class="fun" v-else>
      <div class="icon cloud-icon">&#xe7d9;</div>
      <div class="text">
        <h3>商城同步</h3>
        <p>与商城保持会员等级及会员规则同步</p>
      </div>
      <div class="btn">
        <div class="status">
          <span class="switch-box">
            <i-switch class="tab-switch" :value="data.syncStatus === 1"></i-switch>
            <i class="mask" @click="statusChangeHandle"></i>
          </span>
          <span class="status-txt">{{data.syncStatus === 1 ? '开启' : '关闭'}}</span>
        </div>
      </div>
    </div>
    <!-- 会员等级相关配置 -->
    <div class="form">
      <Form :label-width="90" ref="form" :rules="validate" :model="data">
        <FormItem label="体系名称：" prop="configName">
          <Input v-model="data.configName" :maxlength="15" class="ipt-max" placeholder="最多可以输入15个汉字"/>
        </FormItem>
        <FormItem label="会员等级：" prop="configs">
          <div class="table-box">
            <Table :columns="columns" :data="data.configs" :loading="loading" border>
              <template slot-scope="{row}" slot="name">
                <span v-if="!row.isEdit">{{row.name}}</span>
                <Input v-else type="text" v-model="row.name" />
              </template>
              <template slot-scope="{row}" slot="img">
                <div class="config-img">
                  <img :src="row.img" alt="" v-if="row.img" class="icon-img">
                  <span class="img-eidt" v-if="row.isEdit">
                    <span class="cloud-icon">&#xe6b9;</span>
                    <input
                      type="file"
                      class="img-upload"
                      accept="image/*"
                      ref="fileInput"
                      @change="acceptImage($event, row)"
                    />
                  </span>
                </div>
              </template>
              <template slot-scope="{row}" slot="point">
                <span v-if="!row.isEdit">{{row.minPoint}} ~ {{row.maxPoint}}</span>
                <div v-else>
                  <Input type="text" v-model="row.minPoint" class="point-ipt"/>~<Input type="text" v-model="row.maxPoint" class="point-ipt"/>
                </div>
              </template>
              <template slot-scope="{row}" slot="operate">
                <span class="table-btn" @click="saveRow(row)" v-if="row.isEdit">保存</span>
                <span class="table-btn" @click="edit(row)" v-if="!row.isEdit">编辑</span>
                <span class="table-btn" @click="deleteRow(row)">删除</span>
              </template>
            </Table>
            <div class="add-btn-box" v-if="data.configs.length < 10">
              <span @click="changeModalStatus">新增</span>
            </div>
          </div>
        </FormItem>
        <FormItem label="会员规则：" prop="configRule">
          <Ueditor id="uedit1" v-model="data.configRule"></Ueditor>
        </FormItem>
        <FormItem>
          <Button type="primary" class="btn-min" @click="save">提交</Button>
        </FormItem>
      </Form>
    </div>
    <!-- 添加会员等级弹窗 -->
    <Modal v-model="addTagModal" title="添加会员等级" :width="400" footer-hide>
      <Form :model="modalData" :rules="modalDataValidate" ref="modalForm">
        <FormItem label="等级名称：" :label-width="90" prop="name">
          <Input v-model="modalData.name" :maxlength="30" placeholder="请输入等级名称"/>
        </FormItem>
        <FormItem label="等级图标：" :label-width="90" prop="img">
          <div class="config-img">
            <img :src="modalData.img" alt="" v-if="modalData.img" class="icon-img">
            <span class="img-eidt">
              <span class="cloud-icon">&#xe6b9;</span>
              <input
                type="file"
                class="img-upload"
                accept="image/*"
                ref="fileModalInput"
                @change="acceptModalImage($event)"
              />
            </span>
          </div>
        </FormItem>
        <FormItem label="最小积分：" :label-width="90" prop="minPoint">
          <Input v-model="modalData.minPoint" type="number"  :maxlength="30" placeholder="请输入最小积分"/>
        </FormItem>
        <FormItem label="最大积分：" :label-width="90" prop="maxPoint">
          <Input v-model="modalData.maxPoint" type="number"  :maxlength="30" placeholder="请输入最大积分"/>
        </FormItem>
        <FormItem :label-width="90">
          <Button class="btn" @click="changeModalStatus">取消</Button>
          <Button class="btn" type="primary" @click="onAddTagModalConfirm" style="margin-left:20px;">确认</Button>
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="addTagSpinShow"></Spin>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import CONFIG from '@util/config';
import { ModalConfig } from "iview/types";
import {Ueditor} from "@components/index";


import {getUserPointSetting, updateUserPointSetting, changeConsumUserPointsStatus, getOpenUrl} from '@service/member';
import { uploadImage } from "@service/content";

interface configInfoJsonType {
  maxPoint: number;
  minPoint: number;
  img: string;
  name: string;
  level: string;
}
@Component({
  components: {
    Ueditor
  }
})
export default class Level extends Vue {
  // 添加会员等级弹窗是否展示
  addTagModal = false;
  addTagSpinShow = false;
  firstLoad = true
  modalData = {
    maxPoint: '',
    minPoint: '',
    img: '',
    name: '',
    level: 0
  }
  // 保存表单数据
  data = {
    configName: '',
    configs: [],
    configRule: '',
    syncStatus: 0,
  }
  // 验证
  validate = {
    configName: [
      { required: true, message: "请输入体系名称", trigger: "change" },
      { min: 1, message: "体系名称最少1个汉字", trigger: "change" },
    ],
    configs: [{required: true,type: 'array', min: 1, message: "请添加会员等级", trigger: "change"}],
    configRule: [{required: true, message: "请添加会员规则", trigger: "change"}],
  }
  modalDataValidate = {
    name: [
      {required: true, message: "请输入等级名称", trigger: "change"}
    ],
    img: [
      {required: true, message: "请上传等级图片", trigger: "change"}
    ],
    maxPoint: [{required: true, validator: this.maxPointValidate, trigger: 'blur', type: 'integer'}],
    minPoint: [{required: true, validator: this.minPointValidate, trigger: 'blur', type: 'integer'}]
  }
  getMaxOrMinPoint(type: 'max' | 'min') {
    let {configs} = this.data;
    if (configs.length) {
      let config = configs[configs.length - 1];
      return config[`${type}Point`];
    } else {
      return 0
    }
  }
  minPointValidate (rule: any, value: any, callback: any) {
    let max = this.getMaxOrMinPoint('max');
    if (Number(value) <= Number(max)) {
      return callback(new Error(`最小积分需要大于${max}`));
    }
    let {maxPoint} = this.modalData;
    if (maxPoint && Number(maxPoint) <= Number(value)) {
      return callback(new Error(`最小积分需要小于${maxPoint}`));
    } else {
      callback();
    }
    // if (value >= this.modalData.maxPoint) {
    //   return callback(new Error("最小积分需要小于最大积分"));
    // }
    // if (value >= 0) {
    //   callback();
    // } else {
    //   return callback(new Error("请输入最小积分大于等于0"));
    // }
  }
  maxPointValidate (rule: any, value: any, callback: any) {
    let {minPoint} = this.modalData;
    if (!value) {
      return callback(new Error(`请输入最大积分`));
    } else if (minPoint && Number(value) <= Number(minPoint)) {
      return callback(new Error(`最大积分需要大于${minPoint}`));
    } else {
      callback ();
    }
  }
  loading = false;
  columns = [
    {
      title: "等级",
      key: "level",
      align: "center",
      width: 80,
    },
    {
      title: "名称",
      slot: "name",
      align: "center",
      width:200,
    },
    {
      title: "图标",
      slot: "img",
      align: "center",
      width:100,
    },
    {
      title: "积分",
      slot: "point",
      align: "center",
      width:200,
    },
    {
      title: "操作",
      slot: "operate",
      align: "center",
      width:150,
    }
  ];
  @Watch("data.configRule", { immediate: true, deep: true })
  configRuleChange() {
    if (!this.firstLoad) {
      if (this.$refs.form) {
        (this.$refs.form as Vue).validateField('configRule')
      }
    }
  }
  changeModalStatus () {
    this.addTagModal = !this.addTagModal;
    if (this.addTagModal) {
      this.modalData.level = this.data.configs.length + 1;
    } else {
      setTimeout(() => {
        (this.$refs.modalForm as Vue).resetFields();
        this.modalData = {
          maxPoint: '',
          minPoint: '',
          img: '',
          name: '',
          level: 0
        }
      }, 300)
    }
  }
  /**
   * 添加会员等级
   */
  onAddTagModalConfirm () {
    (this.$refs.modalForm as Vue).validate((valid: boolean) => {
      if (valid) {
        this.addTagSpinShow = true;
        let configs = JSON.parse(JSON.stringify(this.data.configs));
        configs.push(this.modalData);
        let jsonDto = JSON.stringify({configInfos: configs, configName: this.data.configName, configRule: this.data.configRule, syncStatus: this.data.syncStatus});
        this.saveRequest(jsonDto, () => {
          this.$Message.success('新增会员等级成功');
          this.changeModalStatus();
          this.getSettingData();
        })
      } else {
        this.$Message.error("请将信息填写完整！");
      }
    });
  }
  // 商城同步功能开启关闭
  statusChangeHandle () {
    let title = this.data.syncStatus === 1 ? "关闭" : "开启";
    let status = this.data.syncStatus;
    let config: ModalConfig = {
      title: "操作提示",
      content: `是否${title}商城同步?`,
      okText: "确认",
      cancelText: "关闭",
      onOk: () => {
        status = status === 1 ? 0 : 1;
        changeConsumUserPointsStatus({status}).then(res => {
          if (res.code === 0) {
            this.$Message.success(`${title}商城同步成功`);
            this.data.syncStatus = status;
          }
        })
      }
    };
    this.$Modal.confirm(config);
  }
  // 打开商户中心申请商城页面
  openElectricity () {
    let phone = this.$store.state.app.userInfo.phone;
    getOpenUrl().then(res => {
      console.log(res)
      let {appSn} = res.data;
      window.open(CONFIG.elecLoginUrl + `business/open-electricity?appSn=${appSn}&authentication=企业认证&safeguardsStatus=免保障金&phone=${phone}&type=more`, "_blank");
    })
  }
  // 获取会员等级详情
  getSettingData () {
    getUserPointSetting().then(res => {
      this.data = res.data;
      this.$nextTick(() => {
        this.firstLoad = false
      })
    })
  }
  // 编辑某一行会员等级
  edit (row: any) {
    let {_index, _rowKey, ...rest} = row;
    rest.isEdit = true;
    this.$set(this.data.configs, _index, rest);
  }
  // 删除某一行会员等级
  deleteRow (row: any) {
    let {_index } = row;
    let configs = JSON.parse(JSON.stringify(this.data.configs));
    configs.splice(_index, 1);
    if (configs.length === 0) {
      this.$Message.error('会员等级不能为空');
      return false;
    }
    let jsonDto = JSON.stringify({configInfos: configs});
    this.saveRequest(jsonDto ,() => {
      this.$Message.success('删除成功');
      this.data.configs.splice(_index, 1);
    })
  }
  // 保存会员等级
  saveRow (row: any) {
    let configs =JSON.parse(JSON.stringify(this.data.configs));
    let {_index, _rowKey, ...rest} = row;
    configs[_index] = rest;
    let jsonDto = JSON.stringify({configInfos: configs});
    this.saveRequest(jsonDto, () => {
      this.$Message.success('保存成功');
      rest.isEdit = false;
      this.$set(this.data.configs, _index, rest);
    })
  }
  // 整体保存 会员体系名字 会员规则 会员等级
  save () {
    (this.$refs.form as Vue).validate((valid: boolean) => {
      if (valid) {
        let jsonDto = {
          configInfos: this.data.configs,
          configRule: this.data.configRule,
          configName: this.data.configName
        };
        this.saveRequest(JSON.stringify(jsonDto), () => {
          this.$Message.success('保存成功');
            this.getSettingData();
        })
      } else {
        this.$Message.error("请将信息填写完整！");
      }
    });
  }
  // 执行保存的请求
  saveRequest (jsonDto: string,callback: () => void) {
    updateUserPointSetting({
      jsonDto: jsonDto
    }).then(res => {
      if (res.code === 0) {
        callback();
      }
    }).finally(() => {
      this.addTagSpinShow = false;
    })
  }
  // 重新上传积分图标
  private acceptImage(e: any, row:any) {
    let files = e.target.files;
    let _this = this;
    let len = files.length;
    let _input = this.$refs.fileInput as HTMLElement;
    for (let i = 0; i < len; i++) {
      let formData = new FormData();
      formData.append("Filedata", files[i]);
      formData.append("path", "cultural-tourism-cloud");
      uploadImage(formData).then((res: any) => {
        let {_index, _rowKey, ...rest} = row;
        rest.img = res.safeUrl;
        this.$set(this.data.configs, _index, rest);
        _input.setAttribute("type", "file");
      })
    }
    _input.setAttribute("type", "text");
  }
  acceptModalImage (e: any) {
    let files = e.target.files;
    let _this = this;
    let len = files.length;
    let _input = this.$refs.fileModalInput as HTMLElement;
    for (let i = 0; i < len; i++) {
      let formData = new FormData();
      formData.append("Filedata", files[i]);
      formData.append("path", "cultural-tourism-cloud");
      uploadImage(formData).then((res: any) => {
        this.modalData.img = res.safeUrl
        _input.setAttribute("type", "file");
      })
    }
    _input.setAttribute("type", "text");
  }
  created () {
    this.getSettingData()
  }
}
</script>

<style lang='scss' scoped>
.level {
  padding:0 15px 15px;
}
.fun{
  display:flex;
  padding:16px 24px;
  margin-bottom:24px;
  align-items: center;
  background:#e6f7ff;
  border-radius:4px;
  &.fun1{
    background:#f9e4ca;
  }
  .icon{
    display:flex;
    align-items:center;
    justify-content: center;
    height:58px;
    width:58px;
    min-width:58px;
    border-radius:50%;
    border: 2px solid #fff;
    margin-right:24px;
    color:#fff;
    background:$theme;
    font-size:36px;
  }
  .text{
    flex:1;
    margin-right:24px;
    h3{
      font-size:16px;
      font-weight:700;
      padding-bottom:8px;
    }
    p{
      font-size:12px;
    }
  }
}
.status{
  display: flex;
  align-items: center;

  .switch-box{
    position:relative;
    margin-right:8px;
  }
  .mask{
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    cursor: pointer;
  }
}
.ipt-max{
  max-width:290px;
}
.btn-min{
  min-width:80px;
}
.add-btn-box{
  // padding-top:24px;
  text-align:center;
  span {
    cursor: pointer;
    font-size:14px;
    color:$theme;
    &:hover{
      color:$theme-hover;
    }
    &:active{
      color:$theme-active;
    }
  }
}
.table-btn{
  margin:0 4px;
  cursor: pointer;
  font-size:14px;
  color:$theme;
  &:hover{
    color:$theme-hover;
  }
  &:active{
    color:$theme-active;
  }
}
.table-box{
  max-width:732px;
}
.icon-img{
  display:inline-block;
  vertical-align:center;
  width:32px;
  height:32px;
}
.point-ipt{
  width:60px;
}
.img-eidt{
  position:relative;
  cursor: pointer;
  display:inline-block;
  vertical-align:top;
  margin-left:4px;
  line-height:32px;
  .cloud-icon{
    cursor: pointer;
  }
  .img-upload{
    position: absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    opacity: 0;
    cursor: pointer;
  }
}
.config-img{
  height:32px;
  line-height:32px;
}
</style>
