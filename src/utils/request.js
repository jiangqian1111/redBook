//引入
import axios from 'axios'
import router from '@/router'
import { setupClientMock } from '@/mock'

//创建service实例
const service = axios.create({
  // 开发环境请求 /api/*，由 vite.config.js 中的 Mock 中间件拦截
  // 生产环境请求真实后端，通过 .env 中的 VITE_API_BASE_URL 配置
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

// 🏠 生产环境 Mock：构建部署后（GitHub Pages 等静态托管），
// Vite 中间件不可用，启用 axios 拦截器在浏览器端返回数据
if (import.meta.env.PROD) {
  setupClientMock(service)
}

// request请求拦截器--Token 注入
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
//创建response响应拦截器--错误处理
service.interceptors.response.use(
  (response) => {
    return response.data //数据脱壳
  },
  (error) => {
    // 基础错误处理
    if (error.response?.status === 401) {
      localStorage.removeItem('token') // 清除本地 token
      router.push('/login') // 跳转到登录页
    }
    // 统一错误格式
    return Promise.reject({
      code: error.response?.status || 500,
      message: error.response?.data?.message || '网络错误',
      data: error.response?.data,
    })
  },
)
//暴露出去
export default service
