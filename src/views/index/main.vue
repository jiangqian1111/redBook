<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router' // 引入路由钩子
import { getChannelList } from '@/api/channelList'

const router = useRouter()
const route = useRoute()

// 1. 初始为空，完全等待接口返回
const channelList = ref([])

// 2. 获取频道数据
const getChannels = async () => {
  try {
    const res = await getChannelList()
    channelList.value = res.data

    console.log('频道获取成功:', channelList.value)

    // 🌟 核心逻辑：自动跳转到第一个频道 🌟
    // 如果当前路径仅仅是 '/index' (没有后面的 /xxx)，且数据获取成功
    if (route.path === '/index' && channelList.value.length > 0) {
      const firstChannelPath = channelList.value[0].path

      // 替换当前 URL，比如跳到 /index/qwer
      router.replace(`/index/${firstChannelPath}`)
    }
  } catch (error) {
    console.error('频道获取失败', error)
  }
}

onMounted(() => {
  getChannels()
})
</script>

<template>
  <div class="main-container">
    <!-- 顶部导航 -->
    <div class="channel-container sticky top-0 z-10 bg-white">
      <ul class="scrollbar-hide m-0 flex list-none overflow-x-auto whitespace-nowrap p-0">
        <li
          v-for="(item, index) in channelList"
          :key="item.id"
          class="flex-shrink-0 cursor-pointer px-4 py-2"
        >
          <!-- 
             动态生成路由链接 
             比如 Mock 返回 path 是 'abc'，这里就生成 '/index/abc'
             active-class: VueRouter 自带功能，激活时自动加样式
          -->
          <router-link
            :to="`/index/${item.path}`"
            class="text-gray-500 no-underline transition-all"
            active-class="font-bold text-red-500 text-lg"
          >
            {{ item.name }}
          </router-link>
        </li>
      </ul>
    </div>

    <!-- 内容区域 -->
    <div class="mt-2">
      <!-- 加上 key，保证切换频道时组件会刷新 -->
      <router-view :key="$route.fullPath" />
    </div>
  </div>
</template>

<style scoped>
/* 隐藏滚动条 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
