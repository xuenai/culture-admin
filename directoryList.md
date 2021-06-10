```
|-- application
    |-- .gitignore
    |-- babel.config.js
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- tsconfig.json
    |-- tslint.json
    |-- vue.config.js
    |-- public
    |   |-- favicon.ico
    |   |-- index.html
    |-- src
    |   |-- App.vue
    |   |-- main.ts
    |   |-- shims-tsx.d.ts // ts设置
    |   |-- shims-vue.d.ts // ts设置
    |   |-- assets  // 静态文件
    |   |   |-- logo.png
    |   |   |-- images // 图片
    |   |   |-- styles  // 样式
    |   |       |-- iview.less // iview的主题色变量
    |   |       |-- normalize.css // reset样式
    |   |       |-- theme.scss // 项目主题色变量
    |   |-- components // 组件
    |   |   |-- HelloWorld.vue
    |   |-- router  // 路由
    |   |   |-- index.ts
    |   |   |-- test.ts
    |   |-- service // 接口请求部分
    |   |   |-- index.ts
    |   |-- store // vuex部分
    |   |   |-- index.ts
    |   |   |-- store.ts
    |   |   |-- modules
    |   |       |-- test.ts
    |   |-- util // 公共封装
    |   |   |-- config.ts // 项目配置
    |   |   |-- request.ts // axios请求封装
    |   |-- views // 完整的页面文件目录
    |       |-- test
    |           |-- Test.vue
    |-- tests // 单元测试相关
        |-- unit
            |-- example.spec.ts
```