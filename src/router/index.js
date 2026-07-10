import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/index/index.vue'),
    children: [
      // 👇 重点在这里！
      // :category 是一个动态参数，代表“任何字符串”
      // 比如 /index/food，这里的 category 就是 "food"
      // 比如 /index/travel，这里的 category 就是 "travel"
      {
        path: ':category',
        name: 'categoryList',
        // 我们创建一个通用的列表组件，所有频道都用它
        component: () => import('../views/index/FeedList.vue'),
      },
    ],
  },
  {
    path: '/shopping',
    name: 'Shopping',
    // 父组件：包含搜索框 + 滚动导航栏
    component: () => import('@/views/shopping/index.vue'),
    // 默认重定向到“推荐”分类
    redirect: '/shopping/recommend',
    children: [
      {
        // 动态路由参数 :category，对应 mock 数据里的 value
        path: ':category',
        name: 'ShoppingCategory',
        // 子组件：这里放具体的商品网格列表 (ProductList)
        // 注意：如果你还没创建这个组件，先用之前的 FeedList 或者新建一个空的占位
        component: () => import('@/views/shopping/ProductList.vue'),
      },
    ],
  },
  {
    path: '/notice',
    name: 'notice',
    component: () => import('../views/notice/index.vue'),
  },
  {
    path: '/my',
    name: 'my',
    component: () => import('../views/my/index.vue'),
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('../views/detail/index.vue'),
    meta: { hideNav: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
