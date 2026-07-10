<script setup>
import { ref, onMounted } from 'vue'
import MallHeader from './MallHeader.vue'
import CategoryBar from './CategoryBar.vue'
import SubCategory from './SubCategory.vue'
import ProductList from './ProductList.vue'

// 引入你的 API 方法
import { getCategoryList } from '@/api/categoryList'
import { getSubCategoryList } from '@/api/subCategoryList'
import { getProductCard } from '@/api/productCard'

// --- 定义数据 (State) ---
const categoryList = ref([]) // 顶部导航栏数据
const subCategories = ref([]) // 中间子分类数据
const productList = ref([]) // 底部商品列表数据
const currentActive = ref('recommend')
// --- 定义动作 (Action) ---

// 1. 加载所有数据的方法
// type 默认是 'recommend'，点击切换时会变
const loadAllData = async (type = 'recommend') => {
  try {
    console.log('正在加载分类:', type)

    // 并发请求：同时去拿“子分类”和“商品列表”
    // 注意：这里把 type 传给了 params，Apifox 就会根据期望返回不同数据
    const [resSub, resProd] = await Promise.all([
      getSubCategoryList({ category: type }),
      getProductCard({ category: type }),
    ])

    // 把拿到的数据存起来，Vue 会自动更新界面
    subCategories.value = resSub.data
    productList.value = resProd.data
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 2. 初始化：获取导航栏 + 默认推荐数据
onMounted(async () => {
  // 先拿导航栏列表
  const resCat = await getCategoryList()
  categoryList.value = resCat.data

  // 再拿页面内容
  loadAllData('recommend')
})

// 3. 处理切换事件 (子组件通知父组件)
const handleTabChange = (type) => {
  // ✅ 关键补充：更新当前选中的 active 状态
  // 这样传给 CategoryBar 的 :active 才会变，红线才会移动
  currentActive.value = type
  // 接收到 CategoryBar 传来的 'digital' 或 'culture'
  // 重新去后台拉取数据
  loadAllData(type)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <header class="sticky top-0 z-50 bg-white shadow-sm">
      <MallHeader />

      <!-- ⭐ 父子通信关键点 1： -->
      <!-- :list="categoryList" -> 父传子，把导航数据给它 -->
      <!-- @change-tab="handleTabChange" -> 子传父，监听它的点击事件 -->
      <CategoryBar :list="categoryList" :active="currentActive" @change-tab="handleTabChange" />
    </header>

    <main>
      <!-- ⭐ 父子通信关键点 2： -->
      <!-- 父组件拿着 subCategories 数据，传给子组件显示 -->
      <SubCategory :list="subCategories" />

      <!-- ⭐ 父子通信关键点 3： -->
      <!-- 这里的 ProductList 已经是纯展示组件了，直接把数据喂给它 -->
      <ProductList :list="productList" />
    </main>

  </div>
</template>
