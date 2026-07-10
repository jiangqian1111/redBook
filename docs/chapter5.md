# 第五章：业务逻辑实现与项目总结

## 本章学习目标

- 理解瀑布流无限滚动的实现原理
- 掌握 Axios 封装与拦截器的用法
- 了解自定义指令（图片懒加载）的编写
- 学会阅读和调试一个完整的 Vue 3 项目
- 明确项目的优化方向和后续学习路径

---

## 5.1 瀑布流 / 无限滚动加载

### 整体流程

```
用户打开首页
    ↓
挂载时加载第 1 页数据 (loadData(true))
    ↓
渲染瀑布流卡片
    ↓
底部有一个"哨兵元素" (sentinelRef)
    ↓
IntersectionObserver 监测哨兵进入视口
    ↓
加载下一页 → 追加到现有数组 (loadData(false))
    ↓
直到 hasMore = false → 显示"已经到底啦"
```

### 核心代码拆解

```javascript
// src/views/index/FeedList.vue
const postList = ref([])       // 当前所有笔记
const page = ref(1)            // 当前页码
const loading = ref(false)     // 加载中标记（防止重复请求）
const isFinished = ref(false)  // 是否全部加载完
const sentinelRef = ref(null)  // 哨兵元素引用

/**
 * @param {boolean} isRefresh — true=刷新（切换频道）, false=追加（触底）
 */
const loadData = async (isRefresh = false) => {
  // 防抖：正在加载或已全部加载则跳过
  if (loading.value || (isFinished.value && !isRefresh)) return

  if (isRefresh) {
    page.value = 1            // 回到第一页
    postList.value = []       // 清空旧数据
    isFinished.value = false  // 重置"到底"标记
  }

  loading.value = true
  try {
    const category = route.params.category || 'recommend'
    const res = await getPostList(category, page.value)
    const newData = res.data || res

    if (newData.length === 0) {
      isFinished.value = true  // 返回空数组 → 没数据了
    } else {
      postList.value = [...postList.value, ...newData]  // 追加到末尾
      page.value++             // 页码 +1，下次加载下一页
    }
  } catch (error) {
    console.error('获取列表失败:', error)
  } finally {
    loading.value = false
  }
}
```

### IntersectionObserver：无感触底

```javascript
const initLoadMoreObserver = () => {
  loadMoreObserver = new IntersectionObserver(
    (entries) => {
      // 哨兵元素进入视口 + 不在加载中 + 还有更多数据
      if (entries[0].isIntersecting && !loading.value && !isFinished.value) {
        loadData(false)
      }
    },
    { threshold: 0.5 },  // 哨兵可见 50% 时触发
  )

  if (sentinelRef.value) loadMoreObserver.observe(sentinelRef.value)
}
```

模板中的哨兵元素：

```vue
<div ref="sentinelRef" class="py-4 text-center text-xs text-gray-400">
  <p v-if="loading && postList.length > 0">正在努力加载中...</p>
  <p v-else-if="isFinished">—— 已经到底啦 ——</p>
  <p v-else-if="postList.length === 0 && !loading">暂无笔记数据</p>
</div>
```

### 骨架屏

首次加载时用灰色占位块代替真实卡片，提升体验：

```vue
<div v-if="loading && postList.length === 0" class="columns-2 gap-2">
  <div v-for="i in 6" :key="i" class="mb-2 h-64 animate-pulse rounded-lg bg-gray-200">
  </div>
</div>
```

`animate-pulse` 是 Tailwind 内置的呼吸动画类。

---

## 5.2 数据请求封装：Axios 拦截器

### 为什么封装 Axios

直接使用 `axios.get()` 有两个问题：
1. 每次请求都要写完整的 URL
2. Token、错误处理等逻辑散落在各处

封装后统一的请求入口：

```javascript
// src/utils/request.js
import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,  // 10 秒超时
})
```

### 请求拦截器：自动带 Token

```javascript
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)
```

每次请求发出前，自动从 localStorage 取 Token 注入到 Header 中。不需要在每个 API 函数里手动写。

### 响应拦截器：统一处理错误 + 数据脱壳

```javascript
service.interceptors.response.use(
  (response) => {
    return response.data  // 🔑 脱壳：只返回 data，外部不用写 .data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')     // 自动跳登录
    }
    return Promise.reject({
      code: error.response?.status || 500,
      message: error.response?.data?.message || '网络错误',
    })
  },
)
```

### API 层的简洁调用

```javascript
// src/api/post.js — 封装后每个 API 函数只需要 5 行
import request from '../utils/request'

export const getPostList = (category, page) => {
  return request({
    url: '/posts',
    method: 'get',
    params: { type: category, page },
  })
}

export const toggleLikeApi = (data) => {
  return request({
    url: '/post/like',
    method: 'post',
    data,
  })
}
```

### 组件中的使用

```javascript
// 一行调用，自动处理 Token、错误、脱壳
const res = await getPostList('recommend', 1)
// res = { code: 200, data: [...] }
```

---

## 5.3 Mock 系统双保险

本项目采用了**两层 Mock 设计**：

### 开发环境：Vite 中间件

`vite.config.js` 中注册自定义中间件，在 Dev Server 层拦截 `/api/*`：

```
浏览器 → /api/posts → Vite 中间件 → 返回 JSON → Network 面板可见
```

### 生产环境：Axios 拦截器

```javascript
// src/utils/request.js — 构建部署后自动启用
if (import.meta.env.PROD) {
  setupClientMock(service)  // 拦截 axios 请求，直接返回 Mock 数据
}
```

这样无论是本地开发还是部署到 GitHub Pages，页面都有数据。

---

## 5.4 自定义指令：图片懒加载

```javascript
// src/directives/lazy.js
export default {
  mounted(el, binding) {
    const realSrc = binding.value
    el.src = 'data:image/svg+xml,...'  // 灰色占位图

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.src = realSrc               // 进入视口才加载真图
          el.onerror = () => (el.src = 'data:image/svg+xml,...') // 失败兜底
          observer.unobserve(el)         // 停止观察
        }
      },
      { rootMargin: '0px 0px 200px 0px' },  // 提前 200px 预加载
    )

    observer.observe(el)
  },
}
```

使用：

```html
<img v-lazy="item.cover" alt="笔记封面" />
```

效果：页面上有 100 张图片，但只加载视口附近的那几张，节省流量、加快首屏渲染。

---

## 5.5 项目复习与优化建议

### 回顾你学到了什么

| 技能 | 体现在 |
|------|--------|
| Vue 3 Composition API | 全部组件使用 `<script setup>` + `ref`/`reactive` |
| Vue Router | Hash 模式、嵌套路由、动态路由、路由传参 |
| Pinia 状态管理 | Setup Store 和 Option Store 两种写法 |
| 组件通信 | props/emit 父子通信 + Pinia 跨层级共享 |
| Axios 封装 | 请求/响应拦截器、Token 注入、错误统一处理 |
| 自定义指令 | `v-lazy` 图片懒加载 |
| Mock 系统 | Vite 中间件（服务端）+ Axios 拦截器（客户端）双保险 |
| Tailwind CSS | 原子化样式 + 品牌色配置 + 响应式布局 |
| GitHub Pages 部署 | Actions 自动构建部署 |
| 移动端适配 | Viewport + 安全区域 + Flex 布局 + 瀑布流 |

### 下一步优化方向

1. **TypeScript**：给 props、store、API 返回值加类型，减少运行时 bug
2. **性能优化**：大列表用虚拟滚动（如 `vue-virtual-scroller`），减少 DOM 节点
3. **单元测试**：用 Vitest + Vue Test Utils 给核心逻辑写测试
4. **PWA**：添加 Service Worker，实现离线访问
5. **真实后端接入**：把 Mock 数据换成真实 API，完成一个完整的全栈项目

### 常见移动端坑点速查

| 问题 | 解决方案 |
|------|----------|
| iOS 橡皮筋效果 | `overflow-y: auto; -webkit-overflow-scrolling: touch` |
| 点击 300ms 延迟 | 添加 `viewport-fit=cover` meta 标签 |
| 软键盘弹出遮挡输入框 | `Element.scrollIntoView()` |
| 图片加载慢 | 懒加载 + 压缩 + WebP 格式 |
| 页面白屏时间长 | 路由懒加载 + 骨架屏 + 资源预加载 |

---

## 本章小结

- 瀑布流的核心是三件事：分页加载 + 哨兵监听 + 数据追加
- Axios 拦截器让你在一个地方处理 Token、错误、数据脱壳，其他地方只关心业务
- 自定义指令的本质是把 DOM 操作逻辑从组件中抽离，保持组件的干净
- Mock 双保险（开发用中间件 + 生产用拦截器）让项目在任何环境都能跑
- 这个项目覆盖了 Vue 3 全家桶 90% 的常用技能，是继续深入学习的扎实基础
