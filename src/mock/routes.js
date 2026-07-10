/**
 * 客户端 Mock 路由表 — 生产环境（GitHub Pages）下由 axios 拦截器使用
 *
 * 路由 URL 格式：/api/xxx，与 Vite 中间件保持一致
 * response 支持静态对象和 (params, data) => object 回调函数
 */
import Mock from 'mockjs'

const { Random } = Mock

// ---- 商城子分类 ----
const subCategoryMap = {
  recommend: [
    { id: 1, name: '热卖', icon: 'icon-hot' },
    { id: 2, name: '新品', icon: 'icon-new' },
    { id: 3, name: '精选', icon: 'icon-star' },
    { id: 4, name: '特惠', icon: 'icon-discount' },
    { id: 5, name: '品牌', icon: 'icon-brand' },
  ],
  digital: [
    { id: 1, name: '手机', icon: 'icon-phone' },
    { id: 2, name: '电脑', icon: 'icon-pc' },
    { id: 3, name: '耳机', icon: 'icon-earphone' },
    { id: 4, name: '相机', icon: 'icon-camera' },
  ],
}

function generateProducts(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: Random.ctitle(8, 20),
    price: Random.float(9.9, 2999, 1, 2),
    cover: `https://picsum.photos/seed/${Random.guid()}/400/500`,
    tag: Random.boolean(0.3, 0.7, true) ? Random.pick(['热卖爆款', '限时优惠', '好评如潮', '新品首发', '限时包邮']) : '',
    sales: `已售 ${Random.float(0.1, 20, 1, 1)}w`,
    authorAvatar: `https://picsum.photos/seed/${Random.guid()}/100/100`,
    authorName: Random.pick(['官方旗舰店', '品牌直营', '全球购', '优选好店', '专卖店']),
  }))
}

export default [
  // ==================== 频道列表 ====================
  {
    url: '/api/channels',
    method: 'get',
    response: {
      code: 200,
      data: [
        { id: 1, name: '推荐', path: 'recommend' },
        { id: 2, name: '穿搭', path: 'fashion' },
        { id: 3, name: '美食', path: 'food' },
        { id: 4, name: '彩妆', path: 'makeup' },
        { id: 5, name: '影视', path: 'movie' },
        { id: 6, name: '职场', path: 'career' },
        { id: 7, name: '情感', path: 'emotion' },
        { id: 8, name: '家居', path: 'home' },
        { id: 9, name: '游戏', path: 'game' },
        { id: 10, name: '旅行', path: 'travel' },
        { id: 11, name: '健身', path: 'fitness' },
      ],
    },
  },

  // ==================== 笔记列表 ====================
  {
    url: '/api/posts',
    method: 'get',
    response: ({ params }) => {
      const page = parseInt(params?.page) || 1
      const pageSize = 10
      const list = Array.from({ length: pageSize }, (_, i) => ({
        id: (page - 1) * pageSize + i + 1,
        cover: `https://picsum.photos/seed/${Random.guid()}/400/500`,
        title: Random.ctitle(8, 20),
        avatar: `https://picsum.photos/seed/${Random.guid()}/100/100`,
        author: Random.cname(),
        likes: Random.natural(500, 60000),
      }))
      return { code: 200, data: list }
    },
  },

  // ==================== 笔记正文 ====================
  {
    url: '/api/post/notecontent',
    method: 'get',
    response: ({ params }) => ({
      code: 200,
      data: {
        id: params?.id || '1',
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

  // ==================== 评论列表 ====================
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
        time: `${Random.natural(1, 7)}天前`,
      }))
      return { code: 200, data: { list } }
    },
  },

  // ==================== 点赞 / 收藏 / 关注 ====================
  { url: '/api/post/like', method: 'post', response: { code: 200, msg: 'ok' } },
  { url: '/api/post/fav', method: 'post', response: { code: 200, msg: 'ok' } },
  { url: '/api/user/follow', method: 'post', response: { code: 200, msg: 'ok' } },

  // ==================== 用户资料 ====================
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

  // ==================== 用户笔记列表 ====================
  {
    url: '/api/user/notes',
    method: 'get',
    response: ({ params }) => {
      const page = parseInt(params?.page) || 1
      const pageSize = parseInt(params?.pageSize) || 10
      const total = 30
      const list = Array.from(
        { length: Math.min(pageSize, total - (page - 1) * pageSize) },
        (_, i) => ({
          id: (page - 1) * pageSize + i + 1,
          cover: `https://picsum.photos/seed/${Random.guid()}/400/${Random.natural(400, 600)}`,
          title: Random.ctitle(5, 15),
          likes: Random.natural(50, 5000),
          isPrivate: Random.boolean(0.1, 0.9, true),
          isVideo: Random.boolean(),
          author: {
            avatar: `https://picsum.photos/seed/${Random.guid()}/100/100`,
            name: Random.cname(),
          },
        }),
      )
      return { code: 200, data: { list, hasMore: page * pageSize < total } }
    },
  },

  // ==================== 快捷工具 ====================
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

  // ==================== 通知 ====================
  {
    url: '/api/notice/unread',
    method: 'get',
    response: () => ({
      code: 200,
      data: { likes: Random.natural(0, 20), follows: Random.natural(0, 10), comments: Random.natural(0, 15) },
    }),
  },
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
          time: `${Random.natural(1, 59)}分钟前`,
          isMuted: Random.boolean(0.1, 0.9, true),
          unreadCount: Random.natural(0, 9),
        }
      })
      return { code: 200, data: list }
    },
  },
  { url: '/api/notice/read', method: 'post', response: { code: 200, msg: 'ok' } },
  { url: '/api/notice/mute', method: 'post', response: { code: 200, msg: 'ok' } },

  // ==================== 商城 ====================
  {
    url: '/api/shopping/categoryList',
    method: 'get',
    response: {
      code: 200,
      data: [
        { id: 1, name: '推荐', value: 'recommend' },
        { id: 2, name: '数码', value: 'digital' },
        { id: 3, name: '美妆', value: 'beauty' },
        { id: 4, name: '家居', value: 'home' },
        { id: 5, name: '服饰', value: 'clothing' },
        { id: 6, name: '食品', value: 'food' },
        { id: 7, name: '运动', value: 'sports' },
        { id: 8, name: '母婴', value: 'baby' },
      ],
    },
  },
  {
    url: '/api/shopping/subCategory',
    method: 'get',
    response: ({ params }) => {
      const category = params?.category || 'recommend'
      return { code: 200, data: subCategoryMap[category] || subCategoryMap.recommend }
    },
  },
  {
    url: '/api/shopping/productCard',
    method: 'get',
    response: () => ({
      code: 200,
      data: generateProducts(Random.natural(4, 10)),
    }),
  },
]
