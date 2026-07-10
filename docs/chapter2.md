# 第二章：移动端适配与样式布局

## 本章学习目标

- 理解移动端 H5 的 Viewport 适配原理
- 掌握 Tailwind CSS 原子化样式的使用方式
- 学会移动端常见布局（底部导航、顶部搜索栏、瀑布流）的实现
- 了解 IconFont 图标字体的引入与使用

---

## 2.1 移动端适配方案

### Viewport 设置

移动端适配的第一步在 `index.html` 中：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

| 属性 | 含义 |
|------|------|
| `width=device-width` | 页面宽度 = 设备屏幕宽度 |
| `initial-scale=1.0` | 初始缩放比例为 1（不缩放） |
| `viewport-fit=cover` | 适配 iPhone X 等刘海屏，让内容延伸到安全区域 |

### 本项目适配策略

本项目没有使用传统的 `rem` 或 `amfe-flexible` 方案，而是采用 **Tailwind CSS 的响应式工具类** + **CSS 视口单位（vh/vw）**：

```html
<!-- 全屏容器 -->
<div class="min-h-screen w-full">

<!-- 固定高度导航栏 -->
<header class="h-[72px] w-full">

<!-- 安全区域适配（iPhone 底部横条） -->
<div class="pb-[env(safe-area-inset-bottom)]">
```

> 💡 为什么不用 rem？Tailwind 的原子化工具类（`w-full`、`h-screen`、`px-4` 等）已经足够覆盖移动端适配需求，省去了 px → rem 的换算步骤。

---

## 2.2 样式管理：Tailwind CSS

### 什么是 Tailwind CSS

Tailwind 是一个**原子化 CSS 框架**。传统写法是给元素起 `class="card"` 然后在 CSS 里写一堆属性，Tailwind 则是**直接在 HTML 里组合工具类**：

```html
<!-- 传统写法 -->
<div class="card">
  <h2 class="card-title">标题</h2>
</div>

<!-- Tailwind 写法 -->
<div class="overflow-hidden rounded-lg bg-white shadow-sm">
  <h2 class="text-sm font-medium text-gray-800">标题</h2>
</div>
```

好处：不需要在 `.css` 文件和 `.vue` 文件之间来回跳，所见即所得。

### 项目中 Tailwind 的配置

在 `tailwind.config.js` 中扩展了品牌色和间距：

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand': '#ff2442',     // 小红书品牌红
      },
      spacing: {
        'nav-h': '60px',        // 导航栏高度
      },
      maxWidth: {
        'container': '1080px',  // 内容最大宽度
      },
    },
  },
  plugins: [],
}
```

在组件中使用自定义品牌色：

```html
<button class="bg-brand text-white rounded-full px-3 py-1">
  关注
</button>
<i class="text-brand">❤</i>
```

### 常用 Tailwind 工具类速查

| 类别 | 常用类 | 效果 |
|------|--------|------|
| 布局 | `flex` `grid` `block` | 显示模式 |
| 定位 | `fixed` `absolute` `relative` `sticky` | 定位方式 |
| 宽高 | `w-full` `h-[72px]` `min-h-screen` | 宽度/高度 |
| 间距 | `p-2` `px-4` `mt-2` `gap-2` | 内外边距 |
| 文字 | `text-sm` `font-bold` `text-gray-500` | 字号/粗细/颜色 |
| 背景 | `bg-white` `bg-gray-50` `bg-brand` | 背景色 |
| 边框 | `border` `rounded-lg` `rounded-full` | 边框/圆角 |
| 阴影 | `shadow-sm` `shadow-md` | 阴影 |
| 过渡 | `transition-all` `duration-300` | 过渡动画 |

---

## 2.3 基础布局实战

### 底部 TabBar 导航

移动端 App 的标志性元素：固定在底部的四个 Tab。

```vue
<!-- src/views/navBottom.vue -->
<script setup>
import { ref } from 'vue'

const footerList = ref([
  { id: 1, icon: 'icon-shouye', path: '/index' },
  { id: 2, icon: 'icon-shouye1', path: '/shopping' },
  { id: 3, icon: 'icon-lingdang', path: '/notice' },
  { id: 4, icon: 'icon-wodedefuben', path: '/my' },
])
</script>

<template>
  <div
    v-if="!$route.path.includes('/detail')"
    class="fixed bottom-0 left-0 z-50 h-[60px] w-full border-t border-gray-100 bg-white"
  >
    <ul class="m-0 flex h-full w-full list-none items-center p-0">
      <li v-for="item in footerList" :key="item.id" class="h-full flex-1">
        <router-link :to="item.path" v-slot="{ isActive }">
          <div class="flex h-full w-full items-center justify-center active:scale-90">
            <i
              class="iconfont text-[24px]"
              :class="[item.icon, isActive ? 'text-brand' : 'text-gray-400']"
            ></i>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
```

解读：
- `fixed bottom-0` — 固定定位在底部
- `z-50` — 层级最高，不被其他元素遮挡
- `h-[60px]` — 固定高度 60px
- `flex-1` — 每个 Tab 等分宽度
- `router-link v-slot="{ isActive }"` — 根据当前路由自动高亮，红色 = 当前页，灰色 = 非当前页
- `v-if="!$route.path.includes('/detail')"` — 在笔记详情页隐藏，因为它有自己的底部操作栏

### 顶部 Header（固定搜索栏）

```vue
<!-- src/views/index/header.vue -->
<template>
  <header class="fixed left-0 top-0 z-50 h-[72px] w-full border-b bg-white shadow-sm">
    <div class="mx-auto flex h-full w-full items-center px-2">
      <!-- Logo -->
      <div class="flex-shrink-0">
        <img src="@/assets/image/logo.png" class="h-[20px] w-[80px] object-contain" />
      </div>

      <!-- 搜索框 — flex-1 自动撑满 -->
      <div class="relative flex-1 px-2">
        <input
          type="text" placeholder="搜索更多内容"
          class="h-[32px] w-full rounded-full bg-[#f7f7f7] pl-3 pr-8 text-[12px] outline-none"
        />
        <i class="iconfont icon-sousuo absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>

      <!-- 右侧图标 -->
      <div class="flex-shrink-0">
        <i class="iconfont icon-mulu text-[20px]"></i>
      </div>
    </div>
  </header>

  <!-- 占位符：防止下面内容被固定头部挡住 -->
  <div class="h-[72px]"></div>
</template>
```

两个关键点：
1. **`fixed top-0` + 占位符 `<div class="h-[72px]">`**：固定定位会脱离文档流，下面的内容会被挡住。用一个同样高度的空 div 把内容"挤"下去。
2. **`flex-1`**：搜索框自动填充 Logo 和右侧图标之间的剩余空间，适配不同屏幕宽度。

### 瀑布流布局（纯 CSS）

首页和"我的"页面的瀑布流，没有使用任何 JS 瀑布流库，而是用 **CSS `columns` 属性**：

```css
/* FeedList.vue 中的样式 */
.columns-2 {
  column-count: 2;        /* 分成两列 */
}

/* 防止卡片被列截断 */
break-inside-avoid {
  break-inside: avoid;
}
```

```vue
<template>
  <div class="columns-2 gap-2 space-y-2">
    <div
      v-for="item in postList" :key="item.id"
      class="mb-2 break-inside-avoid overflow-hidden rounded-lg bg-white shadow-sm"
    >
      <!-- 卡片内容 -->
    </div>
  </div>
</template>
```

原理：浏览器自动将卡片均匀分配到两列中，每列的卡片高度自然错落，形成瀑布效果。`break-inside: avoid` 保证单张卡片不会被拆分到两列。

### IconFont 图标字体

项目使用阿里图标库（iconfont.cn）的图标字体：

```javascript
// main.js
import '@/assets/font/iconfont.css'
```

```html
<!-- 使用图标：class 格式为 iconfont icon-图标名 -->
<i class="iconfont icon-sousuo"></i>
<i class="iconfont icon-aixin1"></i>
<i class="iconfont icon-zhuanfa"></i>
```

好处：和文字一样可以用 `font-size`/`color` 控制大小和颜色，放大缩小不失真。

---

## 本章小结

- 移动端适配的核心是 Viewport meta 标签 + Tailwind 响应式工具类
- Tailwind 让你在 HTML 中直接写样式类名，省去传统 CSS 文件的来回切换
- 固定定位（`fixed`）要配合同高度的占位符，防止内容被遮挡
- 瀑布流可以用 CSS `columns-2` + `break-inside-avoid` 实现，不需要第三方库
- IconFont 图标字体的用法是 `class="iconfont icon-图标名"`
