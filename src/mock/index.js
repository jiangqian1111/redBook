/**
 * 客户端 Mock 拦截器
 *
 * 生产环境（GitHub Pages）下，Vite 开发服务器的 Mock 中间件不可用，
 * 因此通过 axios 请求拦截器在浏览器端直接返回 Mock 数据，不发起网络请求。
 *
 * 开发环境不触发（留给 Vite 中间件处理，保持 Network 面板可见）。
 */
import routes from './routes.js'

/**
 * 为 axios 实例注册 Mock 拦截器
 * @param {import('axios').AxiosInstance} service
 */
export function setupClientMock(service) {
  service.interceptors.request.use(
    (config) => {
      // 拼出完整请求路径（baseURL + url），与 Vite 中间件一致
      const fullPath = (config.baseURL || '') + (config.url || '')

      // 查找匹配的路由
      const route = routes.find((r) => {
        const routeMethod = (r.method || 'GET').toUpperCase()
        const reqMethod = (config.method || 'GET').toUpperCase()
        return routeMethod === reqMethod && r.url === fullPath
      })

      if (!route) return config

      // 用自定义 adapter 返回 Mock 数据，跳过网络请求
      const mockData =
        typeof route.response === 'function'
          ? route.response({ params: config.params, data: config.data })
          : route.response

      config.adapter = () =>
        Promise.resolve({
          data: mockData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        })

      return config
    },
    (error) => Promise.reject(error),
  )
}
