import Vue from "vue"
import Router from "vue-router"

import Layout from "@/layout/index"

import Login from '@/views/login/index'
import ssoLogin from '@/views/login/ssoLogin'
import Callback from '@/views/callback/index'

import StatisticsYears from '@/views/statistics-years/index'
import SqlServer from '@/views/sql-server/index'
import TableDetail from '@/views/table-detail/index'
import ReportDatabase from '@/views/report-database/index'
import ReportTemplate from '@/views/report-template/index'
import ReportDesign from '@/views/report-design/index'
import ReportPreview from '@/views/report-preview/index'
import BookReader from '@/views/book-reader/index'
import TableManage from "@/views/table-manage/index"

import MessageChat from '@/views/message-chat/index'
import SingleChat from '@/views/single-chat/index'
import JvmLoad from '@/views/jvm-load/index'

//获取原型对象上的push函数
const original_replace = Router.prototype.replace
const original_push = Router.prototype.push
//修改原型对象中的replace方法
Router.prototype.replace = function replace (location) {
  return original_replace.call(this, location).catch(err => err)
}
//修改原型对象中的push方法
Router.prototype.push = function replace (location) {
  return original_push.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
  mode: "history",
  base: "/",
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login
    },
    {
      path: '/login',
      name: 'login',
      component: ssoLogin
    },
    {
      path: '/callback',
      name: 'Callback',
      component: Callback
    },
    {
      path: "/home",
      component: Layout,
      redirect: "/home/statistics-years",
      children: [
        {
          path: "statistics-years",
          name: "StatisticsYears",
          component: StatisticsYears
        },
        {
          path: "sql-server",
          name: "SqlServer",
          component: SqlServer
        },
        {
          path: "table-detail",
          name: "TableDetail",
          component: TableDetail
        },
        {
          path: 'message-chat',
          name: 'MessageChat',
          component: MessageChat
        },
        {
          path: 'single-chat',
          name: 'SingleChat',
          component: SingleChat
        },
        {
          path: 'jvm-load',
          name: 'JvmLoad',
          component: JvmLoad
        }
      ]
    },
    {
      path: "/report",
      component: Layout,
      redirect: "/report/report-database",
      children: [
        {
          path: "report-database",
          name: "ReportDatabase",
          component: ReportDatabase
        },
        {
          path: "report-template",
          name: "ReportTemplate",
          component: ReportTemplate
        },
        {
          path: "table-manage",
          name: "TableManage",
          component: TableManage
        }
      ]
    },
    {
      path: '/book',
      component: Layout,
      redirect: '/book/book-reader',
      children: [{
        path: 'book-reader',
        name: 'BookReader',
        component: BookReader
      }]
    },
    {
      path: "report-preview",
      name: "ReportPreview",
      component: ReportPreview
    }
  ]
})
