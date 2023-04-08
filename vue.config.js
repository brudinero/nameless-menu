const { defineConfig } = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '',
  productionSourceMap: false,
  filenameHashing: false,
  css: { extract: true },
  

  configureWebpack: {
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 8080,
      allowedHosts: 'auto',
    },
  }
})


