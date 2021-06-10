<template>
  <div class="manage">
    <div class="operate">
      <Form ref="searchForm" :model="searchForm" inline class="searchForm">
        <FormItem>
          <Input v-model="searchForm.name">
            <span slot="prepend">机构名称</span>
          </Input>
        </FormItem>
        <FormItem class="select-box" label="类型">
          <Select v-model="searchForm.type" placeholder="请选择" class="select">
            <Option value="beijing">类型123</Option>
            <Option value="beijing">类型13</Option>
            <Option value="beijing">类型1</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary">搜索</Button>
        </FormItem>
      </Form>
      <div class="bottom">
        <Button type="primary" @click="popUp">添加</Button>
        <Button class="btn">导出</Button>
      </div>
    </div>
    <div class="list">
      <div class="item title">
        <div class="name">机构名称</div>
        <div class="status">状态</div>
        <div class="operates">操作</div>
      </div>
      <div class="item">
        <div class="name em">江阳区</div>
        <div class="status">
          禁用
          <i-switch class="switch" @on-change="change"></i-switch>
        </div>
        <div class="operates">
          <span>编辑</span>
          <i>|</i>
          <span>删除</span>
        </div>
      </div>
      <div class="item">
        <div class="name" :style="getPaddingLeft(0)">|-江阳区</div>
        <div class="status">
          禁用
          <i-switch class="switch" @on-change="change"></i-switch>
        </div>
        <div class="operates">
          <span>编辑</span>
          <i>|</i>
          <span>删除</span>
        </div>
      </div>
      <div class="item">
        <div class="name" :style="getPaddingLeft(1)">|-江阳区</div>
        <div class="status">
          禁用
          <i-switch class="switch" @on-change="change"></i-switch>
        </div>
        <div class="operates">
          <span>编辑</span>
          <i>|</i>
          <span>删除</span>
        </div>
      </div>
      <div class="item">
        <div class="name em">江阳区</div>
        <div class="status">
          禁用
          <i-switch class="switch" @on-change="change"></i-switch>
        </div>
        <div class="operates">
          <span>编辑</span>
          <i>|</i>
          <span>删除</span>
        </div>
      </div>
      <div class="item">
        <div class="name" :style="getPaddingLeft(0)">|-江阳区</div>
        <div class="status">
          禁用
          <i-switch class="switch" @on-change="change"></i-switch>
        </div>
        <div class="operates">
          <span>编辑</span>
          <i>|</i>
          <span>删除</span>
        </div>
      </div>
      <div class="item">
        <div class="name" :style="getPaddingLeft(1)">|-江阳区</div>
        <div class="status">
          禁用
          <i-switch class="switch" @on-change="change"></i-switch>
        </div>
        <div class="operates">
          <span>编辑</span>
          <i>|</i>
          <span>删除</span>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <Modal v-model="modal" width="400" class="pop" @on-cancel="handleCancel">
      <p slot="header">添加</p>
      <Form ref="formPop" :model="formPop" :rules="ruleValidate" :label-width="120">
        <FormItem class="pop-item" label="组织机构名称：" prop="input">
          <Input v-model="formPop.input" placeholder="请输入"/>
        </FormItem>
        <FormItem class="pop-item" label="上级组织机构：">
          <Select v-model="formPop.select">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem class="pop-item" label="上级审批：">
          <Select v-model="formPop.select1">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" class="pop-footer">
        <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
        <Button @click="handleCancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class OrganizationManage extends Vue {
  private modal = false;
  private searchForm = {
    name: "",
    type: ""
  };
  private formPop = {
    input: "",
    select: "",
    select1: ""
  };
  // 弹窗验证
  private ruleValidate = {
    input: [
      { required: true, message: "请输入组织机构名称", trigger: "blur" }
    ]
  };
  // switch 变化
  private change(status: boolean) {}
  // 列表距离左边的距离
  private getPaddingLeft(idx: number) {
    let left = (idx + 1) * 8;
    return `padding-left:${left}px`;
  }
  // 添加弹窗
  private popUp() {
    this.modal = true;
  }
  handleSubmit(name: string) {
    (this.$refs.formPop as Vue).validate((valid: boolean) => {
      console.log(valid);
      if (valid) {
      } else {
      }
    });
  }
  handleCancel(name: string) {
    (this.$refs.formPop as Vue).resetFields();
    this.modal = false;
    this.formPop = {
      input: "",
      select: "",
      select1: ""
    };
  }
}
</script>

<style lang='scss' scoped>
.manage {
  padding: 8px;
  .operate {
    padding-top: 36px;
    background: $bg;
  }
  .searchForm {
    padding-left: 24px;
  }
  .select-box {
    display: inline-flex;
    align-items: center;
    .select {
      min-width: 200px;
    }
  }
  .button {
    margin-left: 24px;
  }
  .bottom {
    padding: 0 24px 16px;
    .btn {
      margin-left: 12px;
    }
  }
}
.list {
  padding: 0 12px;
  .item {
    display: flex;
    padding: 16px 0;
    line-height: 20px;
    align-items: center;
    border-bottom: 1px solid $borderLight;
    &.title {
      color: $font01 !important;
      font-weight: bold;
    }
  }
  .name {
    width: 60%;
    &.em {
      font-weight: bold;
    }
  }
  .status {
    width: 20%;
    text-align: center;
    .switch {
      margin-left: 8px;
    }
  }
  .operates {
    width: 20%;
    text-align: center;
    i {
      color: $theme;
    }
    span {
      margin: 0 4px;
      color: $theme;
      text-decoration: underline;
      text-decoration-color: $theme;
      &:hover {
        color: $theme-hover;
        text-decoration-color: $theme-hover;
      }
      &:active {
        color: $theme-active;
        text-decoration-color: $theme-active;
      }
    }
  }
}
.pop {
  .pop-footer {
    display: flex;
    justify-content: center;
    text-align: center;
  }
  .pop-item {
    margin-bottom: 24px;
  }
}
</style>
