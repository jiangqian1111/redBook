/**
 * 首页频道导航 — 固定结构数据（分类 Tab 名称是产品定义，不需要随机生成）
 */
export default [
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
]
