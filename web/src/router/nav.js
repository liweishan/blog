export default [
  {
    path: '/home',
    name: 'Home',
    meta: {
      title: '首页',
      requireAuth: false,
      isNav: false,
      isHome: false,
      isBg: false,
      roles: ''
    },
    component: () => import('@/views/app/home')
  },
  {
    path: '/article',
    name: 'Article',
    meta: {
      title: '博客',
      requireAuth: false,
      isNav: true,
      isHome: true,
      isBg: true,
      roles: ''
    },
    component: () => import('@/views/app/article')
  },
  {
    path: '/article/details',
    name: 'ArticleDetails',
    meta: {
      title: '文章详情',
      requireAuth: false,
      isNav: true,
      isHome: false,
      isBg: true,
      parentPath: '/article',
      roles: ''
    },
    component: () => import('@/views/app/article-details')
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      title: '关于',
      requireAuth: false,
      isNav: true,
      isHome: true,
      isBg: true,
      roles: ''
    },
    component: () => import('@/views/app/about')
  }
]

export const asyncNavs = [
  {
    path: '/addCat',
    name: 'SystemManage',
    meta: {
      title: '系统管理',
      isNav: true,
      isHome: true,
      isBg: false,
      roles: 'root'
    }
  }
]
