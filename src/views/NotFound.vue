<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.replace('/index')
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
    <div class="text-center">
      <p class="text-8xl font-bold text-brand">404</p>
      <p class="mt-4 text-lg text-gray-500">页面不存在</p>
      <p class="mt-2 text-sm text-gray-400">你访问的页面可能已被移除或不存在</p>
      <button
        class="mt-8 rounded-full bg-brand px-8 py-2.5 text-sm font-medium text-white transition-transform active:scale-95"
        @click="goHome"
      >
        返回首页
      </button>
    </div>
  </div>
</template>
