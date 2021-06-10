import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

import {testRequest} from '@service/test'

// 设置数据类型
export interface TestState {
  count: number;
  list: Array<object>
}

@Module({ dynamic: true, store, name: 'test' })
class Test extends VuexModule implements TestState{
  public count = 0
  public list = []
  @Action({ commit: 'ADD_NUM' })
  public add_num() {}

  @Action({commit: 'MINUS_NUM'})
  public minus () {}

  @Action
  public async getTestLists(params: any) {
    testRequest({page: 1, limitPage: 10}).then(res => {
      this.context.commit('GET_TEST_LIST', res)
    })
  }

  @Mutation
  public ADD_NUM () {
    this.count = this.count + 1
  }
  @Mutation
  public MINUS_NUM () {
    this.count = this.count - 1
  }

  @Mutation
  public GET_TEST_LIST (payload:any) {
    this.list = this.list.concat(payload.datas)
  }

}

export const TestModule = getModule(Test)