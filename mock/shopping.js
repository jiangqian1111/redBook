/**
 * 商城页面 — 分类固定 + Mock.js 动态生成商品卡片
 */
import Mock from 'mockjs'

const { Random } = Mock

// 子分类：不同品类有不同子项（这些是结构数据，保持固定）
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
  beauty: [
    { id: 1, name: '口红', icon: 'icon-lipstick' },
    { id: 2, name: '护肤', icon: 'icon-skincare' },
    { id: 3, name: '香水', icon: 'icon-perfume' },
  ],
  home: [
    { id: 1, name: '收纳', icon: 'icon-storage' },
    { id: 2, name: '装饰', icon: 'icon-decor' },
    { id: 3, name: '家具', icon: 'icon-furniture' },
  ],
  clothing: [
    { id: 1, name: '女装', icon: 'icon-women' },
    { id: 2, name: '男装', icon: 'icon-men' },
    { id: 3, name: '配饰', icon: 'icon-accessory' },
  ],
}

// 动态生成商品列表
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
  // 顶部导航分类（固定结构）
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

  // 子分类
  {
    url: '/api/shopping/subCategory',
    method: 'get',
    response: ({ query }) => {
      const category = query?.category || 'recommend'
      return {
        code: 200,
        data: subCategoryMap[category] || subCategoryMap.recommend,
      }
    },
  },

  // 商品列表（动态生成）
  {
    url: '/api/shopping/productCard',
    method: 'get',
    response: ({ query }) => {
      const count = Random.natural(4, 10)
      return {
        code: 200,
        data: generateProducts(count),
      }
    },
  },
]
