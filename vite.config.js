import { fileURLToPath, URL } from 'node:url'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// ============================================================
// 🏠 自定义 Mock 中间件插件
//
// 原理：在 Vite 开发服务器上注册一个中间件，拦截 /api/* 请求，
//       从 mock/ 目录逐文件加载路由（一个文件加载失败不影响其他）。
//
// Mock.js 是可选依赖：安装后自动启用动态随机数据；未安装时静态 Mock 照常工作。
//
// 关闭 Mock：设置环境变量 VITE_MOCK_ENABLED=false
// ============================================================
function mockServerPlugin() {
  const enabled =
    process.env.VITE_MOCK_ENABLED !== 'false' && process.env.NODE_ENV !== 'production'

  return {
    name: 'vite-mock-server',

    async configureServer(server) {
      if (!enabled) return

      const mockDir = path.resolve(__dirname, 'mock')
      if (!existsSync(mockDir)) {
        console.warn('  ⚠️  mock/ 目录不存在，Mock 未启动')
        return
      }

      // 逐文件独立加载：一个文件挂了不影响其他文件
      let routes = []
      const files = readdirSync(mockDir)
        .filter((f) => f.endsWith('.js') && !f.startsWith('_') && f !== 'index.js')
        .sort()

      for (const file of files) {
        const modulePath = `/mock/${file}`
        try {
          const mod = await server.ssrLoadModule(modulePath)
          if (mod.default && Array.isArray(mod.default)) {
            routes.push(...mod.default)
          }
        } catch (e) {
          // 独立报错，不中断其他文件的加载
          console.warn(`  ⚠️  mock/${file} 加载失败: ${e.message}`)
        }
      }

      if (routes.length === 0) {
        console.warn('  ⚠️  Mock 未加载到任何路由，请检查 mock/ 目录')
      } else {
        console.log(`  🏠 Mock Server: ${routes.length} 条路由已加载`)
      }

      // 注册中间件：拦截匹配的 API 请求
      server.middlewares.use(async (req, res, next) => {
        // 只处理 /api/ 开头的请求
        if (!req.url?.startsWith('/api/')) {
          return next()
        }

        const urlPath = req.url.split('?')[0]
        const method = (req.method || 'GET').toUpperCase()

        // 查找匹配的路由
        const route = routes.find((r) => {
          const routeMethod = (r.method || 'GET').toUpperCase()
          return routeMethod === method && r.url === urlPath
        })

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

        // 执行 response
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
  // GitHub Pages 部署基准路径（仓库名是什么就填什么）
  base: process.env.NODE_ENV === 'production' ? '/redBook/' : '/',
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
