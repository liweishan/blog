/**
 * 2022/3/20
 * 全局静态数据
 */

// 用工厂模式返回防止数据污染
export function getNavs() {
  return [
    {
      path: '/app/home',
      title: '首页',
      meta: {
        title: '首页',
        requireAuth: false,
        isNav: false,
        isHome: false,
        isBg: false,
        roles: ''
      }
    },
    {
      path: '/app/article',
      title: '博客',
      meta: {
        title: '博客',
        requireAuth: false,
        isNav: true,
        isHome: true,
        isBg: true,
        roles: ''
      }
    },
    {
      path: '/app/about',
      title: '关于',
      meta: {
        title: '关于',
        requireAuth: false,
        isNav: true,
        isHome: true,
        isBg: true,
        roles: ''
      }
    }
  ]
}
