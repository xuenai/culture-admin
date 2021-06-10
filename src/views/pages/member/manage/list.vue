<!--
 * @Description: 会员管理 - 列表
 * @Author: sunxq
 * @Date: 2019-07-15 20:28:25
 * @lastTime: 2019-08-15 10:50:45
 -->

<template>
  <div class="list">
    <Form class="form" ref="formInline" inline :label-width="80">
      <FormItem label="手机号：">
        <Input
          type="text"
          :maxlength="20"
          v-model="params.phone"
          placeholder="输入手机号"
          @on-enter="search"
        />
      </FormItem>
      <FormItem label="昵称：">
        <Input
          type="text"
          :maxlength="20"
          v-model="params.nickName"
          placeholder="输入昵称"
          @on-enter="search"
        />
      </FormItem>
      <FormItem label="性别：" prop="sex" class="select clearfix">
        <Select
          v-model="params.sex"
          class="fl"
          style="width:100px"
          @on-change="search"
        >
          <Option value selected>全部</Option>
          <Option value="1">男</Option>
          <Option value="2">女</Option>
          <Option value="0">保密</Option>
        </Select>
      </FormItem>
      <FormItem label="会员身份：" prop="identity" class="select clearfix">
        <Select
          v-model="params.identity"
          class="fl"
          style="width:100px"
          @on-change="search"
        >
          <Option value="-1">全部</Option>
          <Option value="heritage">非遗传承人</Option>
          <Option value="volunteer">志愿者</Option>
        </Select>
        <Button class="fl ml20" type="primary" @click="search">查询</Button>
      </FormItem>
    </Form>
    <baseTable :configure="tableConfig" @getList="getList">
      <Table
        border
        :columns="data.header"
        :loading="loading"
        :data="data.list"
        ref="table"
      >
        <template slot-scope="{ row }" slot="phone">
          {{ row.phone ? getSubPhone(row.phone) : '-' }}
        </template>
        <template slot-scope="{ row }" slot="control">
          <i class="cloud-icon" title="查看" @click="showDetial(row)">查看</i>
        </template>
        <template slot-scope="{ row }" slot="identity">
          {{ row.volunteerStatus ? '志愿者' : '' }}
          {{ row.heritageStatus ? '非遗传承人' : '' }}
          {{ !row.heritageStatus && !row.volunteerStatus ? '--' : '' }}
        </template>
        <template slot-scope="{ row }" slot="headUrl">
          <div
            class="info-list title daq-no-header"
            :class="{ volunteer: row.volunteerStatus === 1 }"
          >
            <img :src="row.headUrl" v-if="row.headUrl" />
            <span class="cloud-icon" v-else>&#xe6ee;</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="regionMemo">{{
          row.regionMemo || '-'
        }}</template>
        <template slot-scope="{ row }" slot="level">{{
          row.level || '-'
        }}</template>
      </Table>
    </baseTable>
    <!-- 这个标签不能删除 如果删除了 监听不到AppModule的变化 -->
    <span style="visibility: hidden;">{{ siteInfo.creditStatus }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import baseTable from '@components/baseTable/baseTable.vue'
import { getUserList } from '@service/member'
import { getCreditUser } from '@service/common'
import { AppModule } from '@store/modules/app'

@Component({ components: { baseTable } })
export default class VipMemberList extends Vue {
  get siteInfo() {
    if (AppModule.siteInfo && AppModule.siteInfo.creditStatus === 2) {
      this.data.header = [
        {
          title: '序号',
          type: 'index',
          width: '60',
          align: 'center'
        },
        {
          title: '头像',
          key: 'headUrl',
          slot: 'headUrl',
          align: 'center',
          width: 120
        },
        {
          title: '手机号',
          key: 'phone',
          slot: 'phone',
          align: 'center'
        },
        {
          title: '昵称',
          key: 'nickName',
          align: 'center'
        },
        {
          title: '性别',
          key: 'sex',
          align: 'center'
        },
        {
          title: '所在地区',
          key: 'regionMemo',
          slot: 'regionMemo',
          align: 'center'
        },
        {
          title: '会员等级',
          key: 'level',
          slot: 'level',
          align: 'center'
        },
        {
          title: '身份',
          slot: 'identity',
          align: 'center'
        },
        {
          title: '注册时间',
          key: 'registTime',
          align: 'center'
        },
        {
          title: '操作',
          key: 'control',
          slot: 'control',
          align: 'center'
        }
      ]
    }
    return AppModule.siteInfo
  }
  private loading = true //数据是否加载中
  private data: any = {
    header: [
      {
        title: '序号',
        type: 'index',
        width: '60',
        align: 'center'
      },
      {
        title: '头像',
        key: 'headUrl',
        slot: 'headUrl',
        align: 'center',
        width: 120
      },
      {
        title: '手机号',
        key: 'phone',
        slot: 'phone',
        align: 'center'
      },
      {
        title: '昵称',
        key: 'nickName',
        align: 'center'
      },
      {
        title: '性别',
        key: 'sex',
        align: 'center'
      },
      {
        title: '所在地区',
        key: 'regionMemo',
        slot: 'regionMemo',
        align: 'center'
      },
      {
        title: '会员等级',
        key: 'level',
        slot: 'level',
        align: 'center'
      },
      // {
      //   title: "积分",
      //   key: "currPoints"
      // },

      {
        title: '身份',
        slot: 'identity',
        align: 'center'
      },
      {
        title: '注册时间',
        key: 'registTime',
        align: 'center'
      },
      {
        title: '诚信分值',
        key: 'creditScore',
        align: 'center'
      },
      {
        title: '失约数',
        key: 'losePromiseCount',
        align: 'center'
      },
      {
        title: '失约率',
        key: 'probability',
        align: 'center'
      },
      {
        title: '最近失约时间',
        key: 'losePromiseTime',
        align: 'center'
      },
      {
        title: '操作',
        key: 'control',
        slot: 'control',
        align: 'center'
      }
    ],
    list: []
  }

  //   查询
  private search() {
    this.tableConfig.page.currPage = 1
    this.getList()
  }

  mounted() {
    this.getList()
  }

  // 截取电话号码
  private getSubPhone(phone: string) {
    let len = phone.length
    let str = phone.substr(0, 3) + '****' + phone.substr(len - 4, len)
    return str
  }

  /* S 获取列表信息 */
  private params: any = {
    phone: '', // 手机
    nickName: '', // 昵称
    sex: '', //性别
    identity: '-1' //身份
  }
  private tableConfig: any = {
    page: {
      currPage: 1
    },
    pagePosition: 'right'
  }

  private getList(page: any = this.tableConfig.page) {
    let _this = this
    this.loading = true
    Object.assign(this.params, page)
    let params = { ...this.params }
    if (params.identity === '-1') delete params.identity
    getUserList(params)
      .then((data: any) => {
        if (data.code === 0) {
          this.tableConfig.page = data.page ? data.page : {}
          this.data.list = data.datas.map((item: any) => {
            item.creditScore = '-'
            item.losePromiseCount = '-'
            item.losePromiseTime = '-'
            item.probability = '-'
            return item
          }) as Array<any>

          //筛选出电话号码 查询对应诚信列表数据
          let phone = data.datas
            .map((item: any) => {
              return item.phone
            })
            .filter((item: any) => item)

          //查询诚信列表数据
          if (phone.length) {
            _this.getCreditUser(phone.toString())
          }
        }
      })
      .finally(() => (this.loading = false))
  }

  //获取用户诚信信息
  private userInfo: any = this.$store.state.app.userInfo

  private getCreditUser(phone: any) {
    let params = {
      platformChannel: 'cultural', //平台渠道
      platformCode: this.userInfo.siteCode, //站点编码
      phone: phone
    }
    getCreditUser(params).then((res: any) => {
      if (res.code === 0) {
        this.data.list.forEach((data: any) => {
          res.datas.forEach((item: any) => {
            if (item.phone == data.phone) {
              data.creditScore = item.creditScore
              data.losePromiseCount = item.losePromiseCount
              data.losePromiseTime = item.losePromiseTime
              data.probability =
                item.losePromiseCount > 0
                  ? Math.floor(
                      (item.losePromiseCount /
                        (item.losePromiseCount + item.keepPromiseCount)) *
                        100
                    ) + '%'
                  : item.losePromiseCount
            }
          })
        })
      }
    })
  }

  /* E 获取列表信息 */

  // 查看会员详细信息
  private showDetial(data: any) {
    this.$router.push({ path: '/member-detial', query: { id: data.id } })
  }
}
</script>

<style lang="scss" scoped>
.list {
  padding: 15px;
  .info-list {
    // margin: 15px 0;
    width: 40px;
    height: 40px;
    /*overflow: hidden;*/
    border-radius: 50%;
    margin: 0 auto;
    position: relative;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      border: none;
    }
    &.volunteer:after {
      content: '';
      position: absolute;
      right: -10px;
      width: 25px;
      height: 25px;
      background: url('../../../../assets/image/volunteer-log.png') no-repeat
        center/contain;
    }
    &.daq-no-header {
      position: relative;
      z-index: 2;
      background: rgba(54, 205, 100, 0.1);
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: $theme;
    }
  }
  .form {
    background-color: $grayLight;
    padding: 15px 15px 0;
    margin-bottom: 15px;
  }
  .select {
    // width: 150px;
  }
  .cloud-icon {
    cursor: pointer;
    color: $theme;
  }
}
</style>
