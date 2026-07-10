/**
 * Mock 路由聚合入口 — 被 vite.config.js 中的自定义 Mock 插件动态加载
 *
 * 每当你新增一个 mock/xxx.js 文件，在这里加一行 import 即可。
 */
import channels from './channels.js'
import posts from './posts.js'
import noteDetail from './noteDetail.js'
import userProfile from './userProfile.js'
import notices from './notices.js'
import shopping from './shopping.js'

export default [
  ...channels,
  ...posts,
  ...noteDetail,
  ...userProfile,
  ...notices,
  ...shopping,
]
