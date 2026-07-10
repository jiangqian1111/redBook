# 第三章：路由管理与页面导航

## 本章学习目标

- 理解 Vue Router 在 SPA 中的作用
- 掌握路由表配置（静态路由、动态路由、嵌套路由、重定向）
- 学会编程式导航和声明式导航两种跳转方式
- 了解路由传参（query vs params）的实际场景
- 认识路由守卫的基础用法

---

## 3.1 Vue Router 基础

### 什么是 SPA

传统的多页面应用（MPA）：点击链接 → 浏览器请求新 HTML → 白屏等待 → 渲染。

**单页面应用（SPA）**：页面不刷新，用 JS 动态替换内容区域。Vue Router 就是 Vue 生态中管理 SPA 页面切换的官方库。

### 本项目使用的路由模式

```javascript
// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),  // Hash 模式
  routes,
})
```

**Hash 模式**：URL 中带 `#`，如 `https://xxx.github.io/redBook/#/index`。最大好处是不需要服务器配置，部署到 GitHub Pages 等静态托管直接能用。

> 💡 为什么不用 History 模式（不带 `#`）？History 模式需要服务器把所有路径都指向 `index.html`，否则刷新会 404。GitHub Pages 不支持这种配置，所以 Hash 模式更适合。

---

## 3.2 路由配置实战

### 完整的路由表

```javascript
// src/router/index.js
const routes = [
  // 根路径重定向到首页
  { path: '/', redirect: '/index' },

  // 首页 — 嵌套路由
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/index/index.vue'),
    children: [
      {
        path: ':category',         // 动态路由参数
        name: 'categoryList',
        component: () => import('../views/index/FeedList.vue'),
      },
    ],
  },

  // 商城 — 也是嵌套路由
  {
    path: '/shopping',
    name: 'Shopping',
    component: () => import('@/views/shopping/index.vue'),
    redirect: '/shopping/recommend',  // 默认跳推荐
    children: [
      {
        path: ':category',
        name: 'ShoppingCategory',
        component: () => import('@/views/shopping/ProductList.vue'),
      },
    ],
  },

  // 通知、我的 — 一级路由
  { path: '/notice', name: 'notice', component: () => import('../views/notice/index.vue') },
  { path: '/my', name: 'my', component: () => import('../views/my/index.vue') },

  // 笔记详情
  {
    path: '/detail',
    name: 'detail',
    component: () => import('../views/detail/index.vue'),
    meta: { hideNav: true },     // 隐藏底部导航
  },

  // 404 兜底路由（必须放最后）
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFound.vue') },
]
```

### 几个关键知识点

#### 1. 路由懒加载

```javascript
component: () => import('../views/index/index.vue')
```

Vite 会把每个 `import()` 打包成独立的 JS 文件。只有用户访问该页面时才下载，减小首屏加载体积。

#### 2. 嵌套路由 + `<router-view>`

```
/index               ← 父页面：Header + 频道导航
  /index/recommend   ← 子页面：笔记列表
  /index/fashion     ← 同一个子组件，只是参数不同
```

父组件中用 `<router-view>` 标记子组件的渲染位置：

```vue
<!-- src/views/index/index.vue -->
<template>
  <div class="layout">
    <Header />
    <Main />                    <!-- 频道导航在这里 -->
    <!-- 子路由内容在这里渲染 -->
  </div>
</template>
```

```vue
<!-- src/views/index/main.vue -->
<template>
  <div class="main-container">
    <div class="channel-container">...频道导航...</div>
    <router-view :key="$route.fullPath" />
    <!-- 🠝 子路由 FeedList.vue 渲染在这里，key 保证切换频道时组件刷新 -->
  </div>
</template>
```

#### 3. `redirect` 重定向

```javascript
{ path: '/', redirect: '/index' }                    // 根路径 → 首页
{ path: '/shopping', redirect: '/shopping/recommend' } // 商城默认 → 推荐
```

#### 4. `meta` 元信息

```javascript
{ path: '/detail', meta: { hideNav: true } }
```

在底部导航组件中判断：

```vue
<!-- navBottom.vue -->
<div v-if="!$route.path.includes('/detail')">
```

---

## 3.3 动态路由与传参

### 动态路由（params）

首页和商城都用了 `:category` 动态参数：

```
/index/recommend  →  category = "recommend"
/index/food       →  category = "food"
/index/travel     →  category = "travel"
```

在 `FeedList.vue` 中获取参数并发起请求：

```javascript
import { useRoute } from 'vue-router'

const route = useRoute()

// 响应式获取 category 参数
const category = route.params.category

// 监听参数变化，切换频道时重新加载
watch(
  () => route.params.category,
  () => loadData(true),  // isRefresh = true，清空旧数据
)
```

### 编程式导航（JS 跳转）

```javascript
import { useRouter } from 'vue-router'
const router = useRouter()

// 跳转到详情页，通过 query 传 id
const goDetail = (id) => {
  router.push({ path: '/detail', query: { id } })
}

// 替换当前历史记录（不产生回退）
router.replace(`/index/${firstChannelPath}`)
```

### 两种传参方式对比

| | `params`（动态路由） | `query`（查询参数） |
|---|---|---|
| URL 体现 | `/detail/123` | `/detail?id=123` |
| 定义方式 | 路由表 `path: '/detail/:id'` | 无需定义 |
| 获取方式 | `route.params.id` | `route.query.id` |
| 适用场景 | 资源 ID、分类名等路径的一部分 | 搜索关键词、过滤条件等额外信息 |
| 本项目用法 | 频道分类 `:category` | 笔记 ID `?id=123` |

---

## 3.4 导航守卫入门

### 全局前置守卫

在 `src/router/index.js` 中，可以在每次路由跳转前执行逻辑：

```javascript
router.beforeEach((to, from, next) => {
  // to：要去哪     from：从哪来     next：放行
  next() // 必须调用 next() 才能完成导航
})
```

典型场景：

```javascript
// 登录拦截示例（本项目暂未使用，但这是标准写法）
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/my' && !token) {
    // 去"我的"页面但没有登录 → 提示或重定向
    next('/login')
  } else {
    next()
  }
})
```

### 页面标题切换

```javascript
router.afterEach((to) => {
  document.title = to.meta.title || '仿小红书'
})
```

---

## 本章小结

- Hash 模式（`#`）适合静态托管部署，无需服务器配置
- `component: () => import(...)` 实现路由懒加载，减小首屏体积
- 嵌套路由通过父组件中的 `<router-view>` 渲染子组件
- 动态路由 `:category` 获取方式为 `route.params.category`
- 编程式导航用 `router.push()`，传参用 `query` 或 `params`
- `meta` 可以存储路由级元信息（如是否显示底部导航）
