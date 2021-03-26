'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://127.0.0.1:9110"',
  OSS_PATH: '"https://sh-guli-online.oss-cn-shanghai.aliyuncs.com"'
  // OSS_PATH: '"https://cr-0821-guli-file.oss-cn-shanghai.aliyuncs.com"'
})
