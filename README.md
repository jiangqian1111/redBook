<h1 align="center">📕 RedBook Demo</h1>
<p align="center">一个基于 Vue 3 + Vite 的仿小红书移动端 Web 应用</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5-brightgreen?logo=vue.js" alt="Vue">
  <img src="https://img.shields.io/badge/Vite-7.3-purple?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Pinia-3.0-yellow?logo=pinia" alt="Pinia">
  <img src="https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

---

## ✨ 功能特性

- 🏠 **首页** — 多频道分类切换 + 瀑布流笔记列表 + 触底加载更多
- 🛍️ **商城** — 商品分类导航 + 子分类筛选 + 双列商品卡片
- 🔔 **通知** — 消息列表展示 + 未读红点 + 免打扰状态
- 👤 **我的** — 用户主页 + 笔记瀑布流 + 标签切换（笔记/收藏/赞过）
- 📝 **笔记详情** — 图片轮播 + 正文展示 + 评论列表 + 点赞/收藏/关注

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API) |
| 构建工具 | Vite 7 |
| 状态管理 | Pinia 3 |
| 路由 | Vue Router 5 |
| UI 框架 | Element Plus + Tailwind CSS |
| HTTP 请求 | Axios（封装 Token 注入 + 错误处理） |
| Mock 数据 | 内置 Mock 中间件（Vite 开发服务器层拦截，Network 可见） |

## 🚀 快速开始

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd redBook

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

浏览器自动打开 `http://localhost:8088`，即可看到完整页面。

> 💡 **无需启动任何后端服务** — Vite 开发服务器内置 Mock 中间件，请求经过完整 HTTP 栈，Network 面板可见。`npm install && npm run dev` 一键预览所有页面。

## 📂 项目结构

```
mock/                  # Mock 数据（Vite 服务端中间件拦截，Network 可见）
├── index.js           # 路由聚合入口
├── channels.js        # 首页频道列表
├── posts.js           # 笔记列表（支持分页）
├── noteDetail.js      # 笔记详情 + 评论 + 点赞/收藏
├── userProfile.js     # 用户信息 + 笔记列表 + 快捷工具
├── notices.js         # 消息通知
└── shopping.js        # 商城分类 + 子分类 + 商品卡片
src/
├── api/                # API 接口层
│   ├── channelList.js  # 频道列表
│   ├── post.js         # 笔记相关（列表/详情/点赞/收藏）
│   └── ...
├── assets/             # 静态资源（图片/字体/样式）
├── composables/        # 组合式函数
│   └── useToggleAction.js  # 通用点赞/收藏逻辑（乐观更新+失败回滚）
├── directives/         # 自定义指令
│   └── lazy.js         # 图片懒加载 (IntersectionObserver)
├── router/             # 路由配置
├── stores/             # Pinia 状态管理
│   ├── useUserStore.js # 用户信息和笔记
│   └── useNoticeStore.js # 消息通知
├── utils/
│   └── request.js      # Axios 封装（Token 注入 + 错误处理）
├── views/              # 页面组件
│   ├── index/          # 首页
│   ├── shopping/       # 商城
│   ├── notice/         # 通知
│   ├── my/             # 我的
│   ├── detail/         # 笔记详情
│   └── NotFound.vue    # 404 页面
├── App.vue
└── main.js
```

## 📦 构建部署

```bash
# 生产构建
npm run build

# 预览构建结果
npm run preview
```

构建产物在 `dist/` 目录，可直接部署到 Nginx、Vercel、Netlify 等平台。

## 🔧 Mock 数据说明

项目使用 **Vite 服务端中间件** 拦截 `/api/*` 请求（`vite.config.js` 中的 `mockServerPlugin`），Mock 数据位于项目根目录的 `mock/` 文件夹。

- ✅ 请求经过完整 HTTP 网络栈，开发者工具 **Network 面板可见**
- ✅ 无需额外依赖或进程，`npm run dev` 一键启动
- ✅ 关闭 Mock：`VITE_MOCK_ENABLED=false npm run dev`

**添加新接口 Mock：**
1. 在 `mock/` 下新建 `.js` 文件
2. 导出一个路由数组：`export default [{ url: '/api/xxx', method: 'get', response: {...} }]`
3. 在 `mock/index.js` 中 import 并展开

**切换真实后端：**
修改 `.env` 中的 `VITE_API_BASE_URL` 指向真实地址，Mock 中间件会自动放行未匹配的请求。

## 📄 License

[MIT](LICENSE)
