<div align="center">

# 📕 RedBook

### 仿小红书移动端 Web App · Vue 3 全家桶实战项目

<p>
  <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Pinia-3.0-FFD859?style=flat-square&logo=vue.js&logoColor=black" />
  <img src="https://img.shields.io/badge/Vue_Router-5.0-4FC08D?style=flat-square&logo=vue.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Element_Plus-2.13-409EFF?style=flat-square&logo=element&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-1.13-5A29E4?style=flat-square&logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/Mock.js-1.1-00C853?style=flat-square&logo=json&logoColor=white" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" />
</p>

<p>
  <b>🏠 首页</b> · <b>🛍️ 商城</b> · <b>🔔 通知</b> · <b>👤 我的</b> · <b>📝 笔记详情</b>
</p>

<p>
  🖥️ <a href="https://jiangqian1111.github.io/redBook/"><b>在线演示（GitHub Pages）</b></a>
</p>

</div>

---

## 📸 页面预览

> 以下为项目实际运行截图。所有数据由 Mock.js 动态生成，每次启动结果不同。

|                     首页瀑布流                      |                       笔记详情                        |
| :-------------------------------------------------: | :---------------------------------------------------: |
| <img src="docs/screenshots/home.png" width="280" /> | <img src="docs/screenshots/detail.png" width="280" /> |

|                          商城                           |                        通知                        |                       我的                        |
| :-----------------------------------------------------: | :------------------------------------------------: | :-----------------------------------------------: |
| <img src="docs/screenshots/shopping.png" width="180" /> | <img src="docs/screenshots/msg.png" width="180" /> | <img src="docs/screenshots/my.png" width="180" /> |

---

## ✨ 功能特性

| 模块            | 功能点                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------ |
| 🏠 **首页**     | 11 个频道分类 Tab · 横向滚动导航 · 瀑布流笔记卡片 · IntersectionObserver 触底加载 · 骨架屏加载态 |
| 📝 **笔记详情** | 图片横向滑动轮播 + 圆点指示器 · 富文本正文 · 评论列表 · 点赞/收藏/关注（乐观更新 + 失败回滚）    |
| 🛍️ **商城**     | 8 个商品分类 · 子分类筛选 · 双列商品卡片 · 价格/销量/标签展示                                    |
| 🔔 **通知**     | 消息列表 · 未读红点角标 · 免打扰图标 · 点赞/关注/评论/系统四类消息                               |
| 👤 **我的**     | 个人主页头部 + 背景图 · 快捷工具入口 · 笔记/收藏/赞过 Tab 切换 · 瀑布流笔记列表                  |
| 🧩 **通用**     | 底部导航栏（路由激活高亮） · 404 页面 · 图片懒加载指令 · 响应式移动端布局                        |

---

## 🛠️ 技术栈

### 核心框架

| 技术                                    | 版本 | 用途                                               |
| --------------------------------------- | ---- | -------------------------------------------------- |
| [Vue 3](https://vuejs.org/)             | 3.5  | 渐进式前端框架，Composition API + `<script setup>` |
| [Vite](https://vite.dev/)               | 7.3  | 下一代前端构建工具，秒级 HMR                       |
| [Pinia](https://pinia.vuejs.org/)       | 3.0  | Vue 官方状态管理库                                 |
| [Vue Router](https://router.vuejs.org/) | 5.0  | 官方路由管理器                                     |

### UI & 样式

| 技术                                      | 用途                                    |
| ----------------------------------------- | --------------------------------------- |
| [Tailwind CSS](https://tailwindcss.com/)  | 原子化 CSS 框架，Utility-First 开发体验 |
| [Element Plus](https://element-plus.org/) | Vue 3 组件库（Message 提示等）          |
| [IconFont](https://www.iconfont.cn/)      | 阿里图标库，自定义图标字体              |

### 工程化 & 工具

| 技术                                                                                      | 用途                                        |
| ----------------------------------------------------------------------------------------- | ------------------------------------------- |
| [Axios](https://axios-http.com/)                                                          | HTTP 客户端，封装 Token 注入 + 统一错误处理 |
| [Mock.js](https://github.com/nuysoft/Mock)                                                | 动态生成随机 Mock 数据                      |
| [Prettier](https://prettier.io/)                                                          | 代码格式化                                  |
| [PostCSS](https://postcss.org/) + [Autoprefixer](https://github.com/postcss/autoprefixer) | CSS 后处理                                  |

### 架构亮点

| 亮点                   | 说明                                                                           |
| ---------------------- | ------------------------------------------------------------------------------ |
| **服务端 Mock 中间件** | 自定义 Vite 插件，在 Dev Server 层拦截 `/api/*` 请求，Network 面板可见         |
| **Mock.js 动态数据**   | 每次启动生成全新随机数据，中文人名/标题/正文均由 Mock.js 生成                  |
| **Composition API**    | 全部使用 `<script setup>` 语法，逻辑清晰                                       |
| **Composables 抽离**   | `useToggleAction` 封装点赞/收藏的乐观更新 + 防抖锁 + 失败回滚                  |
| **自定义指令**         | `v-lazy` 图片懒加载，基于 IntersectionObserver + 预加载                        |
| **CSS 瀑布流**         | 纯 CSS `columns-2` 实现，无需第三方瀑布流库                                    |
| **Pinia 模块化**       | 按功能拆分 Store（user / notice / cart），Option Store 和 Setup Store 混用演示 |

---

## 🚀 快速开始

### 环境要求

- **Node.js** ≥ 20.19（或 ≥ 22.12）
- **npm** ≥ 9

### 三步启动

```bash
# 1. 克隆项目
git clone https://github.com/jiangqian1111/redBook.git
cd redBook

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

浏览器自动打开 `http://localhost:8088`，所有页面即可正常浏览。

> 💡 **不需要启动任何后端服务！** Vite Dev Server 内置 Mock 中间件 + Mock.js 动态生成数据，一条命令全部搞定。

---

## 📂 项目结构

```
redBook/
├── mock/                    # 🏠 Mock 数据（Vite 服务端中间件拦截）
│   ├── index.js             #    路由聚合入口
│   ├── channels.js          #    频道列表（固定结构）
│   ├── posts.js             #    笔记列表（Mock.js 动态生成）
│   ├── noteDetail.js        #    笔记详情 + 评论（动态生成）
│   ├── userProfile.js       #    用户信息 + 笔记（动态生成）
│   ├── notices.js           #    消息通知（动态生成）
│   └── shopping.js          #    商城数据（动态生成）
│
├── src/
│   ├── api/                 # API 接口层 — 每个文件对应一组后端接口
│   │   ├── channelList.js   #   频道列表
│   │   ├── post.js          #   笔记（列表/详情/点赞/收藏）
│   │   ├── user.js          #   用户（关注/取关）
│   │   ├── my.js            #   我的页面（用户信息/笔记/快捷工具）
│   │   ├── notice.js        #   通知（未读数/列表/已读/免打扰）
│   │   ├── categoryList.js  #   商城分类
│   │   ├── subCategoryList.js # 商城子分类
│   │   └── productCard.js   #   商品卡片
│   │
│   ├── assets/              # 静态资源
│   │   ├── css/             #   全局样式
│   │   ├── font/            #   IconFont 图标字体
│   │   └── image/           #   图片资源
│   │
│   ├── composables/         # 组合式函数（复用逻辑）
│   │   └── useToggleAction.js # 点赞/收藏通用逻辑（乐观更新+防抖+回滚）
│   │
│   ├── directives/          # 自定义指令
│   │   └── lazy.js          #   v-lazy 图片懒加载
│   │
│   ├── router/              # 路由配置
│   │   └── index.js         #   含 404 兜底路由
│   │
│   ├── stores/              # Pinia 状态管理
│   │   ├── useUserStore.js  #   用户信息 + 笔记列表（Setup Store 风格）
│   │   ├── useNoticeStore.js #  消息通知（Option Store 风格）
│   │   └── cart.js          #   购物车
│   │
│   ├── utils/
│   │   └── request.js       #   Axios 封装（Token 注入 + 统一错误处理）
│   │
│   ├── views/               # 页面组件
│   │   ├── index/           #   首页（频道导航 + FeedList 瀑布流）
│   │   ├── shopping/        #   商城（分类栏 + 子分类 + 商品列表）
│   │   ├── notice/          #   通知（消息列表）
│   │   ├── my/              #   我的（个人主页 + 笔记瀑布流）
│   │   ├── detail/          #   笔记详情（轮播 + 正文 + 评论 + 操作栏）
│   │   ├── navBottom.vue    #   全局底部导航栏
│   │   └── NotFound.vue     #   404 页面
│   │
│   ├── App.vue              # 根组件
│   └── main.js              # 应用入口
│
├── public/                  # 公共静态资源
├── index.html               # HTML 入口
├── vite.config.js           # Vite 配置（含自定义 Mock 中间件插件）
├── tailwind.config.js       # Tailwind CSS 配置（品牌色/间距）
├── postcss.config.js        # PostCSS 配置
├── prettier.config.js       # Prettier 代码格式化配置
├── jsconfig.json            # 路径别名（@ → src/）
├── .env                     # 环境变量（默认值）
├── .env.development         # 开发环境变量
├── .env.example             # 环境变量模板
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🧠 Mock 系统架构

本项目采用 **两层 Mock 设计**，比常见的前端项目更接近真实开发体验：

### 第一层：服务端拦截（Vite 插件）

```
浏览器发起 GET /api/posts?type=recommend
        │
        ▼
  Vite Dev Server
        │
        ▼
  mockServerPlugin 中间件（vite.config.js 内置）
        │
        ├── 命中 Mock 路由 → 返回 JSON 响应（200 OK）
        │                     Network 面板可见完整的 Req/Res
        │
        └── 未命中 → next() 放行给真实后端代理
```

### 第二层：动态数据生成（Mock.js）

```js
// mock/posts.js — 不是写死的数组，是动态模板
response: ({ query }) => {
  const list = Array.from({ length: 10 }, () => ({
    title: Random.ctitle(8, 20), // 随机中文标题
    author: Random.cname(), // 随机中文名
    likes: Random.natural(500, 60000), // 随机点赞数
    cover: `https://picsum.photos/seed/${Random.guid()}/400/500`,
  }))
  return { code: 200, data: list }
}
```

**每次 `npm run dev` 重启，所有数据全新生成。**

### 如何新增 Mock 接口

```js
// 1. 在 mock/ 下新建文件，比如 mock/newFeature.js
export default [
  { url: '/api/new-endpoint', method: 'get', response: { code: 200, data: [...] } },
]

// 2. 在 mock/index.js 中 import 并展开
import newFeature from './newFeature.js'
export default [...channels, ...posts, ..., ...newFeature]
```

### 切换到真实后端

```bash
# 修改 .env
VITE_API_BASE_URL=https://your-real-api.com/api

# 或关闭 Mock
VITE_MOCK_ENABLED=false npm run dev
```

---

## 📦 可用脚本

```bash
npm run dev       # 启动开发服务器（localhost:8088，自动打开浏览器）
npm run build     # 生产环境构建（输出到 dist/）
npm run preview   # 预览构建产物
```

---

## 🚀 部署到 GitHub Pages

项目已配置 GitHub Actions 自动部署，推送到 `main` 分支即可自动构建并部署。

### 首次设置

1. 在 GitHub 仓库 → **Settings** → **Pages** → Source 选择 **GitHub Actions**
2. 修改 `vite.config.js` 中的 `base` 为你的仓库名（默认 `/redBook/`）
3. 推送代码，GitHub Actions 会自动构建部署

### 手动部署

```bash
npm run build
# 将 dist/ 目录部署到任意静态服务器（Nginx / Vercel / Netlify 等）
```

> 🖥️ 在线演示地址：`https://jiangqian1111.github.io/redBook/`

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的功能分支：`git checkout -b feat/amazing-feature`
3. 提交你的改动：`git commit -m 'feat: add amazing feature'`
4. 推送到远程分支：`git push origin feat/amazing-feature`
5. 发起 Pull Request

### Commit 规范

本项目推荐使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复 Bug
- `refactor:` 代码重构
- `style:` 样式调整
- `docs:` 文档更新
- `chore:` 工程化配置

---

## 📄 License

本项目基于 [MIT License](LICENSE) 开源，仅供学习交流使用。

---

## ⭐ Star 历史

如果这个项目对你有帮助，请给一个 ⭐ Star 支持一下！

<p align="center">
  <sub>Made with ❤️ by Kayce Jiang</sub>
</p>
