/**
 * 首页瀑布流笔记列表 — Mock.js 动态生成
 */
import Mock from 'mockjs'

const { Random } = Mock

export default [
  {
    url: '/api/posts',
    method: 'get',
    response: ({ query }) => {
      const page = parseInt(query?.page) || 1
      const pageSize = 10
      const total = 50 // 模拟总共 50 条

      const list = Array.from({ length: pageSize }, (_, i) => ({
        id: (page - 1) * pageSize + i + 1,
        cover: `https://picsum.photos/seed/${Random.guid()}/400/500`,
        title: Random.ctitle(8, 20),
        avatar: `https://picsum.photos/seed/${Random.guid()}/100/100`,
        author: Random.cname(),
        likes: Random.natural(500, 60000),
      }))

      return {
        code: 200,
        data: list,
      }
    },
  },
]
