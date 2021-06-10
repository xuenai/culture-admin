/*
 * @Author: Hexg 
 * @Date: 2019-07-03 10:34:03 
 * @Last Modified by: Hexg
 * @Last Modified time: 2019-12-02 09:37:49
 */
const path = require('path')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir)
}

const projectConfig = {
  appname: '智慧文化旅游云',
  keyWords: '', // 关键字
  description: '', // 描述
}
// 搜索目录
const aliases = {
  '@': 'src',
  '@router': 'src/router',
  '@views': 'src/views',
  '@cloud': 'src/views/cloud-manage',
  '@pages': 'src/views/pages',
  '@components': 'src/components',
  '@assets': 'src/assets',
  '@image': 'src/assets/image',
  '@service': 'src/service',
  '@util': 'src/util',
  '@constant': 'src/constant',
  '@store': 'src/store'
}

// 设置搜索
function getResolveAlias() {
  let aliasObj = {}
  for (const alias in aliases) {
    aliasObj[alias] = resolve(aliases[alias])
  }
  return aliasObj
}

module.exports = {
  outputDir: process.env.VUE_APP_OUTDIR,
  css: {
    sourceMap: false,
    modules: false,
    extract: false,
    loaderOptions: { // 向 CSS 相关的 loader 传递选项
      sass: {
        // 注入全局样式
        data: `@import "@/assets/styles/theme.scss";`
      },
      less: {
        javascriptEnabled: true
      }
    }
  },
  // 设置生产环境目录初始路径
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  productionSourceMap: false, // 加速生成环境构建
  configureWebpack: config => {
    // 配置搜索路径
    config.resolve.alias = getResolveAlias();
    if (process.env.NODE_ENV === 'production') {
      // 生产环境对文件进行压缩
      config.optimization.minimize = true
      // 打包静态资源 减少编译速度
      config.plugins.push(new HardSourceWebpackPlugin({
        cacheDirectory: '../.cache/[confighash]',
        configHash: function() {
          return process.env.NODE_ENV + '-' + process.env.VUE_APP_STATUS;
        }
      }))
      // config.plugins.push(new CompressionPlugin())
    }
  },
  chainWebpack: config => {
    // 查看打包后每个文件大小的插件
    // config.plugin('webpack-bundle-analyzer')
    //         .use(BundleAnalyzerPlugin)
    //         .init(Plugin => new Plugin())
    //         .end();
    // 设置10kb以下的图片转化成base64格式
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10240 }))
      .end()
    // 设置生产环境index.html中的部分值问题
    config.module
      .rule('js')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .options({inline: true})
      .end()
    config
      .plugin('html')
      .tap(args => {
        args[0].title = projectConfig.appname // 网站标题
        args[0].keyWords = projectConfig.keyWords || projectConfig.appname // 网站关键字
        args[0].description = projectConfig.description || projectConfig.appname // 网站描述
        return args
      })
      .end()
  },
  devServer: {
    // port: 80,
    disableHostCheck: true,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  lintOnSave: false
}