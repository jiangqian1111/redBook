/**
 * 「我的」页面 — Mock.js 动态生成用户信息 + 笔记列表
 */
import Mock from 'mockjs'

const { Random } = Mock

export default [
  // 用户个人资料
  {
    url: '/api/user/profile',
    method: 'get',
    response: {
      code: 200,
      data: {
        id: Random.guid(),
        name: Random.cname(),
        avatar: `https://picsum.photos/seed/${Random.guid()}/200/200`,
        bgUrl: `https://picsum.photos/seed/${Random.guid()}/800/400`,
        followers: Random.natural(100, 10000),
        following: Random.natural(50, 1000),
        notes_count: Random.natural(10, 200),
        description: Random.csentence(5, 15),
      },
    },
  },

  // 用户笔记列表（支持分页 + Tab 切换）
  {
    url: '/api/user/notes',
    method: 'get',
    response: ({ query }) => {
      const page = parseInt(query?.page) || 1
      const pageSize = parseInt(query?.pageSize) || 10
      const total = 30

      const list = Array.from({ length: Math.min(pageSize, total - (page - 1) * pageSize) }, (_, i) => ({
        id: (page - 1) * pageSize + i + 1,
        cover: `https://picsum.photos/seed/${Random.guid()}/400/${Random.natural(400, 600)}`,
        title: Random.ctitle(5, 15),
        likes: Random.natural(50, 5000),
        isPrivate: Random.boolean(0.1, 0.9, true), // 10% 概率为私密
        isVideo: Random.boolean(),
        author: {
          avatar: `https://picsum.photos/seed/${Random.guid()}/100/100`,
          name: Random.cname(),
        },
      }))

      return {
        code: 200,
        data: {
          list,
          hasMore: page * pageSize < total,
        },
      }
    },
  },

  // 快捷工具（固定配置，不需要动态）
  {
    url: '/api/user/quick-tools',
    method: 'get',
    response: {
      code: 200,
      data: [
        { id: 1, icon: 'icon-dengpao', title: '创作灵感', subTitle: '去发现', badge: 0, path: '/inspiration' },
        { id: 2, icon: 'icon-zhong', title: '浏览记录', subTitle: '近期浏览', badge: Random.natural(1, 9), path: '/history' },
        { id: 3, icon: 'icon--qunliaoshezhi', title: '群聊', subTitle: '发现同好', badge: 0, path: '/groups' },
      ],
    },
  },

  // 关注/取关
  { url: '/api/user/follow', method: 'post', response: { code: 200, msg: 'ok' } },
]
