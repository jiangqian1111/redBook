import { fileURLToPath, URL, pathToFileURL } from 'node:url'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// ============================================================
// 🏠 自定义 Mock 中间件插件
//
// 原理：在 Vite 开发服务器上注册一个中间件，拦截 /api/* 请求，
//       从 mock/ 目录动态加载路由表，匹配后返回本地 JSON 数据。
//
// 效果：
//   - 请求经过完整 HTTP 网络栈（浏览器 → Vite Server → Mock → 响应）
//   - 开发者工具 Network 面板可以看到真实的请求/响应
//   - 无需 Apifox、无需额外进程，npm run dev 一键启动
//
// 关闭 Mock：设置环境变量 VITE_MOCK_ENABLED=false
// 切换真实后端：修改 .env 中的 VITE_API_BASE_URL
// ============================================================
function mockServerPlugin() {
  const enabled =
    process.env.VITE_MOCK_ENABLED !== 'false' && process.env.NODE_ENV !== 'production'

  return {
    name: 'vite-mock-server',

    async configureServer(server) {
      if (!enabled) return

      // 加载 mock 路由表
      const mockIndex = path.resolve(__dirname, 'mock/index.js')
      let routes = []

      if (!existsSync(mockIndex)) {
        console.warn('  ⚠️  mock/index.js 不存在，Mock 未启动')
        return
      }

      try {
        // 方式 1：使用 Vite 的 ssrLoadModule（推荐，支持 HMR）
        const mod = await server.ssrLoadModule('/mock/index.js')
        routes = mod.default || []
      } catch {
        // 方式 2：降级为直接 import
        try {
          const mod = await import(pathToFileURL(mockIndex).href)
          routes = mod.default || []
        } catch (e2) {
          console.warn('  ⚠️  Mock 模块加载失败，页面将无数据:', e2.message)
          return
        }
      }

      console.log(`  🏠 Mock Server: ${routes.length} 条路由已加载`)

      // 注册中间件：拦截匹配的 API 请求
      server.middlewares.use(async (req, res, next) => {
        // 只处理 /api/ 开头的请求
        if (!req.url?.startsWith('/api/')) {
          return next()
        }

        // 解析请求路径（去掉 query string）
        const urlPath = req.url.split('?')[0]
        const method = (req.method || 'GET').toUpperCase()

        // 查找匹配的路由
        const route = routes.find((r) => {
          const routeMethod = (r.method || 'GET').toUpperCase()
          return routeMethod === method && r.url === urlPath
        })

        // 没匹配到，放行
        if (!route) {
          return next()
        }

        // 解析 query 参数
        const query = {}
        const queryIndex = req.url.indexOf('?')
        if (queryIndex !== -1) {
          req.url
            .slice(queryIndex + 1)
            .split('&')
            .forEach((pair) => {
              const [key, val] = pair.split('=')
              if (key) query[decodeURIComponent(key)] = decodeURIComponent(val || '')
            })
        }

        // 解析 POST body
        let body = {}
        if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
          body = await new Promise((resolve) => {
            let raw = ''
            req.on('data', (chunk) => (raw += chunk))
            req.on('end', () => {
              try { resolve(JSON.parse(raw)) } catch { resolve({}) }
            })
          })
        }

        // 调用 response 函数/对象
        let data
        try {
          data =
            typeof route.response === 'function'
              ? route.response({ query, body, params: query })
              : route.response
        } catch (err) {
          console.error(`  ❌ Mock [${method} ${urlPath}] 执行出错:`, err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ code: 500, msg: 'Mock Error' }))
          return
        }

        // 返回 JSON
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.end(JSON.stringify(data))
      })
    },
  }
}

// ============================================================
// Vite 配置
// ============================================================
export default defineConfig({
  server: {
    open: true,
    port: 8088,
  },
  plugins: [
    vue(),
    vueDevTools(),
    mockServerPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
