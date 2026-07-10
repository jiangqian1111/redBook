/**
 * 笔记详情页 — Mock.js 动态生成正文、评论
 */
import Mock from 'mockjs'

const { Random } = Mock

export default [
  // 笔记正文
  {
    url: '/api/post/notecontent',
    method: 'get',
    response: ({ query }) => ({
      code: 200,
      data: {
        id: query?.id || '1',
        title: Random.ctitle(10, 25),
        content: Random.cparagraph(3, 8),
        publishTime: Random.date('yyyy-MM-dd'),
        location: Random.city(true),
        likes: Random.natural(500, 50000),
        isLiked: Random.boolean(),
        favs: Random.natural(100, 10000),
        isFaved: false,
        comments: Random.natural(5, 50),
        images: Array.from({ length: Random.natural(1, 6) }, () =>
          `https://picsum.photos/seed/${Random.guid()}/800/1067`,
        ),
        author: {
          id: Random.guid(),
          name: Random.cname(),
          avatar: `https://picsum.photos/seed/${Random.guid()}/100/100`,
          isFollowed: Random.boolean(),
        },
      },
    }),
  },

  // 评论列表
  {
    url: '/api/post/comment',
    method: 'get',
    response: () => {
      const count = Random.natural(3, 10)
      const list = Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        user: {
          name: Random.cname(),
          avatar: `https://picsum.photos/seed/${Random.guid()}/100/100`,
        },
        content: Random.csentence(5, 30),
        likes: Random.natural(0, 500),
        time: Random.now('yyyy-MM-dd') === new Date().toISOString().slice(0, 10)
          ? '刚刚'
          : `${Random.natural(1, 7)}天前`,
      }))
      return { code: 200, data: { list } }
    },
  },

  // 点赞切换
  { url: '/api/post/like', method: 'post', response: { code: 200, msg: 'ok' } },

  // 收藏切换
  { url: '/api/post/fav', method: 'post', response: { code: 200, msg: 'ok' } },
]
