<template>
  <div class='local'>
    <div class="logo">
      <p class="name">LOGO: </p>
      <div class="img-box">
        <img class='img'  src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1558499259551&di=a95dc3f04c14eb1ea08907342c38db52&imgtype=0&src=http%3A%2F%2Fs9.sinaimg.cn%2Fmw690%2F001LVQHHty6OBs6oN8Q48%26690" alt="">
      </div>
      <span class="tip">只支持jpg，jpeg，png，gif格式，大小不得超过256kb</span>
    </div>
    <div class="items">
      <div class="item">
        <p class="name">名称:</p>
        <p class="txt">泸州新闻社</p>
      </div>
      <div class="item">
        <span class="name">介绍:</span>
        <div class="ipt">
          <i-input type="textarea" rows="3" placeholder="请输入..."></i-input>
        </div>
        <div class="button">
          <i-button type="primary">保存</i-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class LocalSetting extends Vue {}
</script>

<style lang='scss' scoped>
.local{
  padding: 24px 0 0 80px;
}
.logo{
  display: flex;
  align-items: center;
  padding:16px 0 32px;
  .img-box{
    height:100px;
    width: 100px;
    border-radius: 50%;
    overflow: hidden;
  }
  .name{
    min-width:4em;
  }
  .img{
    height:100px;
    width: 100px;
  }
  .tip{
    margin-left:8px;
    color:#999;
    align-self: flex-end;
  }
}
.items{

  .item{
    display:flex;
    margin-bottom:16px;
  }
  .name{
    min-width:4em;
  }
  .ipt{
    flex:1;
    max-width:300px;
    margin-right:16px;
  }
  .button{
    align-self: flex-end;
  }
}
</style>
