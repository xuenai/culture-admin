<!--
 * @Author: Hexg
 * @Date: 2019-07-05 01:41:26
 * @LastEditors: Hexg
 * @LastEditTime: 2019-07-10 19:58:53
 -->
# ts-vue-app

使用vue-cli 3.0、typescript、axios开发，UI框架使用iView

# git相关分支
develop 开发分支

product-cloud  云端正式环境部署代码分支

product-site  站点端正式环境部署代码分支

product-company  企业端正式环境部署代码分支

test-cloud  云端测试环境部署代码分支

test-site  站点端测试环境部署代码分支

test-company  企业端端测试环境部署代码分支

v1.1.0  版本1.1.0存储分支

## git分支管理相关命令

```
// 分支列表
git branch

// 新建分支a
git branch a

// 以b分支代码为基础新建分支a
git branch a b

// 把b分支合并到当前所在的分支
git merge b

// 分支新建、合并后 需要重新提交, 比如新建的a分支 或者 在a分支上合并了其他分支
git push origin a

// 添加标签v1.1.0
git tag -a v1.1.0 -m '添加标签'

// 将标签提交到远程
git push origin --tags

```

## npm命令
```
本地服务器启动项目
npm run dev:site 站点端
npm run dev:cloud  云端
npm run dev:company 企业端

生产打包
npm run build:site 打包生产目录 dist_site
npm run build:cloud 打包生产目录 dist_cloud
npm run build:company 打包生产目录 dist_company

启动测试
npm run test

代码检查
npm run lint

单元测试
npm run test:unit
```

## 关于测试环境正式环境打包
由于富文本编辑器中的内容（商品、场所、活动需要独特的样式和点击事件，所以这三类是用iframe内嵌到富文本编辑器中的中），为了统一C端和PC后台都能正常展示，这三个样式采用rem（pc端默认html的fontSize为50px,C端的时候和C端页面计算方式一致，在新增或者修改时需要注意设计图的尺寸问题,如果是pc端的设计图，尺寸一般按照设计图相关尺寸的2倍来计算rem（比如设计图高度为100px,计算成rem为 100*2/100 = 2rem），长度最大7.5rem（场所、活动、商品我设置的maxWidth为10rem）,如果是移动端设计图，尺寸就按照设计图的尺寸来计算rem。由于pc端是访问的c端的页面，iframe存在跨域问题，无法实现点击跳转，跳转智能在c端实现；
```
// 首先需要更改 src/util/config.ts中的对应值
```
*尤其要注意更改ueditor相关的配置*
```
1. public/UEditor/ueditor.config.js中： serverUrl的值
```
*public/UEditor/template、public/UEditor/template_test下面的文件夹改变过后需要给c端一份，template文件夹的东西用于正式服务器，template_test用于测试服务器*

## 更改本地域名访问

打开C:\Windows\System32\drivers\etc host文件，在最后加上
```
127.0.0.1   SITE123.c.daqctc.net
127.0.0.1   cp-ctc.test.daqsoft.com
```

## 读取图片中的色值

抄了一套方法 放在 util/pallete下面，使用的时候：

```ts
import { Palette } from '@util/palette';

interface PaletteItem {
	// 颜色整体占比
	percent: string
	// 颜色值数组 [r,g,b]
	value: Array<number>
}

let imgSrc = 'xxxx';
// 获取图片主色
// colors是一个数组
Palette.from(v).getPalette().then((colors:Array<PaletteItem>) => {
	// 图片主色
	let primaryColor = colors[0].value.join(',');
	console.log(primaryColor)
})

```

## 关于webpack环境变量

需要区分是哪个端的环境时直接在js中使用 **process.env.VUE_APP_STATUS**能够获取当前环境的值： CLOUD SITE COMPANY

```
let a = process.env.VUE_APP_STATUS
```

## 关于iView的Icon组件
除了使用iView自带的字体图标 还可以使用我们自己的图标 但是需要使用fontclass， **引入项目的字体图标需要在global.scss中的@import更改**
```
<Icon custom="iconfont c-icon-neirong-di" size="24"></Icon>
```

## 关于vuex
具体能够获取的值查看 store/modules/app.ts
**在项目中某些地方需要用到vuex里面的一些东西, 目前有用户信息，当前用户的目录、当前选中的目录、当前站点列表、当前显示的站点在列表中的下标、当前路由的操作权限**
**关于当前页面的权限值问题需要查看src/constant/index.ts中的OPERATES_CODES**

```
import { Component, Vue } from "vue-property-decorator";
import { AppModule } from "@store/modules/app";
@Component
export default class home extends Vue {
	// 获取vuex中的用户信息
  get userInfo() {
    return AppModule.userInfo;
  }
	// 获取当前站点
	get currSite () {
		if (AppModule.siteList) {
			return AppModule.siteList[AppModule.currSiteIndex]
		} else {
			return {}
		}
	}
	// 站点目录
  get siteList() {
    return AppModule.siteList;
  }
	// 获取当前站点的下标
  get currSiteIndex() {
    return AppModule.currSiteIndex;
  }
	// 获取当前用户目录
	get navList() {
    return AppModule.nav;
  }
	// 目录选中的下标
  get navSelected() {
    return AppModule.navSelected;
  }
	// 获取页面的权限
	get operates () {
		return AppModule.operates
	}
}
```


## 关于ajax

**ts不允许直接在Vue原型链上挂东西 所以ajax请求比之之前的一些项目要麻烦些，需要单独引入**  
在调用axios封装时必须要指明对应参数类型

```
import request from '@util/request'; 

request 需要的参数
url: <string> 必须参数 请求链接，不带基础公共的部分
method:<string>  请求方式, 默认get
params: <object> get请求参数，会带到请求url上的
data: <object> post请求参数
 
```

```
// service/test.ts中

// 引入封装好的axios请求
import request from '@util/request';
// 定义自己需要的
// params?:object 代表params可以不传 如果传的话必须是object
export const testRequest = (params?: object) => request({ url: 'article/list', params })


// views/test.vue中使用

import {testRequest} from '@service/test'
...
created () {
  testRequest({page: 1,limitPage: 10})
    .then(res => {
      console.log(res);
    });
}

```

## 项目中用到的依赖包及对应的链接

[vue-cli](https://cli.vuejs.org/config/)

[typescript](https://www.tslang.cn/docs/handbook/basic-types.html)

[vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)

[vue-class](https://github.com/ktsn/vuex-class)

[vuex-module-decorators](https://championswimmer.in/vuex-module-decorators/)

[normalize.css](http://necolas.github.io/normalize.css/)

## iview UI框架

需要使用到[iView](https://www.iviewui.com/docs/guide/start)组件的地方直接用就行，不需要在页面再引用

iview UI主题在 **src/assets/styles/iview.less**里面配置

## 项目目录结构查看 
```
diretoryList.md
```

## vsCode中可以自定义代码片段
左下角设置 > 用户代码片段 > 然后选择对应的语言类型 > 在新开的文件中输入东西

如 选择 vue语言的. 会新建一个vue.json文件
在文件中输入如下代码 然后保存，在.vue文件中 按asdfg会进行代码提示 然后按回车会自动生成代码串

```
{
	"vue-ts-app-module": {
		"prefix": "asdfg",
		"body": [
			"<template>",
			"  <div></div>",
			"</template>\n",
			"<script lang='ts'>",
			"import { Component, Vue } from 'vue-property-decorator'\n",
			"@Component",
			"export default class ${0:ComponentName} extends Vue {}\n</script>\n",
			"<style lang='scss' scoped></style>\n"
		],
		"description": "vue-typescript quckly code"
	}
}

```
