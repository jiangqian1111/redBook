# 第四章：Vue 3 核心概念与组件通信

## 本章学习目标

- 理解 Composition API 中 `ref`、`reactive` 的响应式原理
- 掌握 Vue 3 常用生命周期钩子的实际用法
- 学会父子组件通过 `props` 和 `emit` 通信
- 了解 Pinia 状态管理的基本使用
- 结合项目组件代码，理解组件化开发的思维方式

---

## 4.1 Composition API 基础

### Options API vs Composition API

Vue 3 提供了两种写组件的方式：

**Options API（Vue 2 风格）**：按选项分类（`data`、`methods`、`computed`）

```javascript
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() { this.count++ }
  },
  mounted() {
    console.log('组件挂载完成')
  }
}
```

**Composition API（Vue 3 推荐）**：按逻辑关注点组织代码

```javascript
<script setup>
import { ref, onMounted } from 'vue'

const count = ref(0)             // 响应式数据
const increment = () => count.value++

onMounted(() => {
  console.log('组件挂载完成')
})
</script>
```

本项目全部使用 **`<script setup>`** 语法糖，代码更简洁。

### ref：基本类型的响应式

```javascript
import { ref } from 'vue'

const loading = ref(false)        // 布尔
const postList = ref([])          // 数组
const page = ref(1)               // 数字
const userInfo = ref(null)        // 对象

// JS 中访问需要 .value
console.log(loading.value)

// 模板中自动解包，不需要 .value
// <p v-if="loading">加载中...</p>

// 修改会触发视图更新
loading.value = true
postList.value = [...postList.value, newItem]
```

### reactive：对象类型的响应式

```javascript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  user: { name: '小明' }
})

// 不需要 .value
state.count++
state.user.name = '小红'
```

> 💡 本项目主要使用 `ref`，因为 Pinia 的 Setup Store 也基于 `ref`，保持一致。

### 为什么数据变了，视图会自动更新？

Vue 3 使用 **Proxy** 代理对象，当你访问或修改 `ref` 的 `.value` 时，Vue 会追踪"谁在用这个数据"。数据变化时，自动通知对应的组件重新渲染。这就是"响应式系统"。

---

## 4.2 生命周期钩子

Vue 3 的生命周期可以用一句话概括：**创建 → 挂载 → 更新 → 销毁**。

### 最常用的两个

```javascript
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  // DOM 已经渲染完成，可以安全地发请求、操作 DOM
  fetchData()
  initObserver()
})

onUnmounted(() => {
  // 组件即将销毁，清理定时器、事件监听、Observer 等
  if (observer) observer.disconnect()
})
```

### 项目实战：详情页数据加载

```javascript
// src/views/detail/index.vue
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const noteId = route.query.id
const noteContent = ref({})

onMounted(() => {
  if (noteId) {
    fetchDetailNoteContent(noteId)   // 获取笔记正文
    fetchDetailComment(noteId)       // 获取评论列表
  }
})
```

关键点：`onMounted` 时 DOM 已经存在，`ref` 绑定也已就绪，此时请求数据可以安全地更新视图。

### 项目实战：Observer 的创建与销毁

```javascript
// src/views/index/FeedList.vue
import { ref, onMounted, onUnmounted } from 'vue'

let loadMoreObserver = null

const initLoadMoreObserver = () => {
  loadMoreObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadData(false) // 触底加载
      }
    },
    { threshold: 0.5 },
  )
  if (sentinelRef.value) loadMoreObserver.observe(sentinelRef.value)
}

onMounted(() => {
  initLoadMoreObserver()
})

onUnmounted(() => {
  if (loadMoreObserver) loadMoreObserver.disconnect() // 🔑 不清理会内存泄漏
})
```

---

## 4.3 组件化开发与通信

### 父 → 子：props

父组件通过属性传递数据给子组件：

```vue
<!-- 父组件：detail/index.vue -->
<DetailHeader
  :author="noteContent.author"
  @toggle-follow="handleFollowChange"
/>
```

```vue
<!-- 子组件：DetailHeader.vue -->
<script setup>
const props = defineProps({
  author: {
    type: Object,
    default: () => ({ name: '', avatar: '', isFollowed: false }),
  },
})
</script>

<template>
  <span>{{ author?.name || '未知用户' }}</span>
  <img :src="author?.avatar" />
</template>
```

> 💡 `defineProps` 是编译宏，不需要手动 import。

### 子 → 父：emit

子组件通过触发事件通知父组件：

```vue
<!-- 子组件：DetailHeader.vue -->
<script setup>
const emit = defineEmits(['toggle-follow', 'share'])

const handleFollow = () => {
  emit('toggle-follow', !props.author.isFollowed)  // 发射事件 + 参数
}
</script>

<template>
  <button @click="handleFollow">
    {{ author.isFollowed ? '已关注' : '关注' }}
  </button>
</template>
```

父组件用 `@事件名="处理函数"` 接收：

```vue
<!-- 父组件：detail/index.vue -->
<DetailHeader @toggle-follow="handleFollowChange" />
```

```javascript
// 父组件的处理函数
const handleFollowChange = async (newStatus) => {
  // newStatus 就是子组件 emit 传过来的 !isFollowed
  noteContent.value.author.isFollowed = newStatus
  await toggleFollowApi(...)
}
```

### 跨层级通信：Pinia Store

当数据需要在多个页面/组件间共享时（比如用户信息、购物车），用 Pinia：

#### Setup Store 风格（推荐）

```javascript
// src/stores/useUserStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const userInfo = ref(null)
  const noteList = ref([])
  const isLoading = ref(false)

  // Actions
  const fetchUserProfile = async () => {
    const res = await myProfileApi()
    userInfo.value = res.data
  }

  const fetchNotesByTab = async (tabId, page) => {
    // ...
  }

  // 暴露出去
  return { userInfo, noteList, isLoading, fetchUserProfile, fetchNotesByTab }
})
```

#### Option Store 风格

```javascript
// src/stores/useNoticeStore.js
import { defineStore } from 'pinia'

export const useNoticeStore = defineStore('notice', {
  state: () => ({
    unreadStats: { likes: 0, follows: 0, comments: 0 },
    messageList: [],
  }),

  actions: {
    async initNoticeData() {
      await Promise.allSettled([
        this.fetchUnreadStatus(),
        this.fetchMessageList(),
      ])
    },
  },
})
```

#### 在组件中使用

```javascript
import { useUserStore } from '@/stores/useUserStore'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

// storeToRefs 保持响应式（直接解构会丢失响应式）
const { userInfo, noteList, isLoading } = storeToRefs(userStore)

// Actions 可以直接解构（函数不需要响应式）
// const { fetchUserProfile } = userStore
```

---

## 4.4 Composables：把逻辑抽成函数

当多个组件有相似的逻辑（比如点赞和收藏），可以抽成 **composable**：

```javascript
// src/composables/useToggleAction.js
import { ref } from 'vue'

export function useToggleAction(target, config) {
  const isPending = ref(false)

  const toggle = async (newStatus) => {
    if (isPending.value) return    // 🔒 防抖锁

    const previousStatus = target.value[config.statusKey]
    const previousCount = target.value[config.countKey]

    // ✅ 乐观更新：先改 UI，再调接口
    target.value[config.statusKey] = newStatus
    target.value[config.countKey] = newStatus
      ? previousCount + 1
      : Math.max(0, previousCount - 1)

    isPending.value = true
    try {
      await config.apiFn({ note_id: target.value.id, status: newStatus })
    } catch {
      // ❌ 失败回滚
      target.value[config.statusKey] = previousStatus
      target.value[config.countKey] = previousCount
    } finally {
      isPending.value = false
    }
  }

  return { isPending, toggle }
}
```

使用：

```javascript
// 点赞
const { toggle: handleLikeToggle } = useToggleAction(noteContent, {
  statusKey: 'isLiked', countKey: 'likes', apiFn: toggleLikeApi,
})

// 收藏 — 复用同一套逻辑！
const { toggle: handleFavToggle } = useToggleAction(noteContent, {
  statusKey: 'isFaved', countKey: 'favs', apiFn: toggleFavApi,
})
```

这就是 Composition API 的优势：**按逻辑关注点组织代码，一份逻辑到处复用**。

---

## 本章小结

- `<script setup>` + `ref`/`reactive` 是 Vue 3 推荐的组件写法
- `onMounted` 中发请求、操作 DOM；`onUnmounted` 中清理资源
- `props` 向下传数据，`emit` 向上传事件 — 父子组件通信的标准模式
- Pinia Store 管理跨组件共享的状态，Setup Store 和 Option Store 两种写法都可以
- Composable 抽离复用逻辑，是 Composition API 的精髓
