/**
 * 消息通知页 — Mock.js 动态生成消息列表
 */
import Mock from 'mockjs'

const { Random } = Mock

export default [
  // 未读统计
  {
    url: '/api/notice/unread',
    method: 'get',
    response: () => ({
      code: 200,
      data: {
        likes: Random.natural(0, 20),
        follows: Random.natural(0, 10),
        comments: Random.natural(0, 15),
      },
    }),
  },

  // 消息列表
  {
    url: '/api/notice/list',
    method: 'get',
    response: () => {
      const types = ['like', 'follow', 'comment', 'system']
      const count = Random.natural(5, 12)
      const list = Array.from({ length: count }, (_, i) => {
        const type = types[Random.natural(0, 3)]
        return {
          id: i + 1,
          type,
          avatar: type !== 'system' ? `https://picsum.photos/seed/${Random.guid()}/100/100` : '',
          title: type === 'system' ? '系统通知' : Random.cname(),
          lastMessage:
            type === 'like'
              ? '赞了你的笔记'
              : type === 'follow'
                ? '关注了你'
                : type === 'comment'
                  ? `评论了你的笔记：${Random.csentence(5, 15)}`
                  : Random.csentence(8, 15),
          time: Random.now('yyyy-MM-dd') === new Date().toISOString().slice(0, 10)
            ? `${Random.natural(1, 59)}分钟前`
            : `${Random.natural(1, 7)}天前`,
          isMuted: Random.boolean(0.1, 0.9, true),
          unreadCount: Random.natural(0, 9),
        }
      })
      return { code: 200, data: list }
    },
  },

  // 标记已读
  { url: '/api/notice/read', method: 'post', response: { code: 200, msg: 'ok' } },

  // 免打扰设置
  { url: '/api/notice/mute', method: 'post', response: { code: 200, msg: 'ok' } },
]
