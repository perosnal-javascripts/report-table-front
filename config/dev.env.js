'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_BASE_API: '"/"',
  VUE_APP_API_SOCKET_URL: '"ws://localhost:1112/msgServer"'
})
