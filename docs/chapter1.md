# 第一章：项目起步与环境搭建

## 本章学习目标

- 了解 redBook 项目的功能定位和技术选型
- 掌握 Node.js 和包管理工具的安装与配置
- 理解 Vue 3 + Vite 项目的目录结构
- 学会克隆项目、安装依赖、本地运行和打包构建

---

## 1.1 项目简介

redBook 是一个**移动端 H5 单页面应用（SPA）**，模仿了小红书的几个核心功能模块：

| 模块 | 功能 |
|------|------|
| 🏠 首页 | 多频道分类 Tab + 瀑布流笔记列表 + 触底加载更多 |
| 📝 笔记详情 | 图片轮播 + 正文 + 评论区 + 点赞/收藏/关注 |
| 🛍️ 商城 | 商品分类 + 子分类筛选 + 双列商品卡片 |
| 🔔 通知 | 消息列表 + 未读红点 + 免打扰状态 |
| 👤 我的 | 个人主页 + 笔记瀑布流 + 标签切换 |

**技术栈一览：**

```
Vue 3（Composition API + script setup）  ← 前端框架
Vite 7                                    ← 构建工具（秒级热更新）
Pinia 3                                   ← 状态管理
Vue Router 5                              ← 路由管理
Tailwind CSS 3                            ← 原子化样式框架
Axios                                     ← HTTP 请求
Mock.js                                   ← 动态 Mock 数据
```

---

## 1.2 环境准备

### Node.js

本项目要求 **Node.js ≥ 20.19**（或 ≥ 22.12）。查看你的版本：

```bash
node -v   # 应输出 v20.x.x 或 v22.x.x
npm -v    # 应输出 9.x.x 或更高
```

如果版本过低，去 [Node.js 官网](https://nodejs.org/) 下载 LTS 版本安装。

### 包管理工具

本项目使用 **npm**。安装依赖：

```bash
npm install
```

> 💡 `npm install` 会根据 `package.json` 和 `package-lock.json` 精确安装所有依赖，包括 Vue、Vite、Pinia、Tailwind CSS 等。

---

## 1.3 目录结构解析

```
redBook/
├── mock/                    # Mock 数据（Vite 服务端中间件，开发时拦截 /api/* 请求）
│   ├── index.js             #   路由聚合入口
│   ├── channels.js          #   频道列表（固定结构）
│   ├── posts.js             #   笔记列表（Mock.js 动态生成）
│   ├── noteDetail.js        #   笔记详情 + 评论
│   ├── userProfile.js       #   用户信息 + 笔记
│   ├── notices.js           #   消息通知
│   └── shopping.js          #   商城数据
│
├── src/                     # 源代码目录（你 99% 的时间都在这里写代码）
│   ├── api/                 #   API 接口层：每个文件对应一组后端接口
│   │   ├── channelList.js   #     频道列表接口
│   │   ├── post.js          #     笔记接口（列表/详情/点赞/收藏）
│   │   ├── user.js          #     用户接口（关注/取关）
│   │   ├── my.js            #     我的页面接口
│   │   ├── notice.js        #     通知接口
│   │   └── ...
│   │
│   ├── assets/              #   静态资源（图片/字体/全局样式）
│   │   ├── css/             #     全局 CSS 文件
│   │   ├── font/            #     IconFont 图标字体
│   │   └── image/           #     图片（Logo 等）
│   │
│   ├── composables/         #   组合式函数（可复用的逻辑块）
│   │   └── useToggleAction.js  #  点赞/收藏通用逻辑
│   │
│   ├── directives/          #   自定义指令
│   │   └── lazy.js          #     v-lazy 图片懒加载
│   │
│   ├── mock/                #   客户端 Mock 路由（生产环境用）
│   │   ├── index.js         #     拦截器注册
│   │   └── routes.js        #     路由定义
│   │
│   ├── router/              #   路由配置
│   │   └── index.js         #     路由表定义
│   │
│   ├── stores/              #   Pinia 状态管理
│   │   ├── useUserStore.js  #     用户信息 + 笔记列表
│   │   ├── useNoticeStore.js #    消息通知
│   │   └── cart.js          #     购物车
│   │
│   ├── utils/               #   工具函数
│   │   └── request.js       #     Axios 封装（Token + 错误处理 + Mock）
│   │
│   ├── views/               #   页面组件（按功能模块分文件夹）
│   │   ├── index/           #     首页
│   │   ├── shopping/        #     商城
│   │   ├── notice/          #     通知
│   │   ├── my/              #     我的
│   │   ├── detail/          #     笔记详情
│   │   ├── navBottom.vue    #     全局底部导航栏
│   │   └── NotFound.vue     #     404 页面
│   │
│   ├── App.vue              #   根组件
│   └── main.js              #   应用入口（注册插件、挂载 App）
│
├── .github/workflows/       # GitHub Actions 自动部署
├── index.html               # HTML 入口文件
├── vite.config.js           # Vite 配置（含 Mock 中间件 + 路径别名）
├── tailwind.config.js       # Tailwind 配置（品牌色、间距等）
├── package.json             # 依赖声明 + 脚本
└── README.md                # 项目说明文档
```

### 重点目录说明

**`src/views/`** — 页面组件。每个子文件夹是一个完整页面，内部包含该页面专用的子组件：

```
src/views/
├── index/          # 首页
│   ├── index.vue   #   页面入口
│   ├── header.vue  #   顶部搜索栏
│   ├── main.vue    #   频道导航 + 内容区
│   └── FeedList.vue #  瀑布流列表
├── detail/         # 笔记详情
│   ├── index.vue   #   页面入口
│   └── components/ #   该页面专用组件
│       ├── DetailHeader.vue  # 顶部作者信息
│       ├── ImgSlider.vue     # 图片轮播
│       ├── NoteContent.vue   # 正文区
│       ├── CommentList.vue   # 评论列表
│       └── TabBar.vue        # 底部操作栏
└── ...
```

**`src/api/`** — 每个文件对应一组后端接口，所有函数返回 Promise：

```javascript
// src/api/post.js
import request from '../utils/request'

export const getPostList = (category, page) => {
  return request({
    url: '/posts',
    method: 'get',
    params: { type: category, page },
  })
}
```

**`src/stores/`** — Pinia 状态管理，按功能模块拆分：

- `useUserStore.js` — 用户信息 + 笔记列表（Setup Store 风格）
- `useNoticeStore.js` — 消息通知（Option Store 风格）
- `cart.js` — 购物车

---

## 1.4 运行与打包

### 克隆并安装

```bash
git clone https://github.com/jiangqian1111/redBook.git
cd redBook
npm install
```

### 本地开发

```bash
npm run dev
```

浏览器自动打开 `http://localhost:8088`。修改代码后页面**秒级热更新**，无需手动刷新。

> 💡 开发时不需要后端服务！项目内置了 Mock 中间件，所有 `/api/*` 请求由 Vite 服务器自动拦截并返回 Mock.js 动态生成的随机数据。

### 生产构建

```bash
npm run build     # 构建到 dist/ 目录
npm run preview   # 预览构建结果（本地启动一个静态服务器）
```

构建产物在 `dist/` 目录，可直接部署到 Nginx、Vercel、Netlify、GitHub Pages 等平台。

### 可用脚本一览

| 命令 | 作用 |
|------|------|
| `npm run dev` | 启动开发服务器（localhost:8088） |
| `npm run build` | 生产环境构建（输出 dist/） |
| `npm run preview` | 本地预览构建产物 |

---

## 本章小结

- redBook 是一个基于 Vue 3 + Vite 的仿小红书 H5 项目，涵盖首页/详情/商城/通知/我的五大模块
- 项目采用 Pinia 管理状态、Tailwind CSS 编写样式、Axios 发起请求、Mock.js + 自定义 Vite 插件提供 Mock 数据
- 目录结构遵循 Vue 3 标准分层：`api/`（接口）、`views/`（页面）、`stores/`（状态）、`composables/`（复用逻辑）、`utils/`（工具）
- `npm run dev` 启动开发，`npm run build` 构建生产包，无需任何后端服务即可全功能开发
