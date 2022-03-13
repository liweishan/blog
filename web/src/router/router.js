import Layout from '@/layout/index.vue'
import nav from './nav'

export const constantRoutes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/app',
    name: 'App',
    meta: {
      title: 'App',
      requireAuth: false
    },
    component: Layout,
    children: nav
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      requireAuth: false
    },
    component: () => import('@/views/user/login')
  },
  {
    path: '/register',
    name: 'Register',
    meta: {
      title: '注册',
      requireAuth: false
    },
    component: () => import('@/views/user/register')
  },
  {
    path: '/retrievePassword',
    name: 'RetrievePassword',
    meta: {
      title: '忘记密码',
      requireAuth: false
    },
    component: () => import('@/views/user/retrieve-password')
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: 'ERROR',
      requireAuth: false
    },
    component: () => import('@/views/error/404.vue')
  }
]

export const asyncRoutes = [
  {
    path: '/cat',
    name: 'Cat',
    meta: {
      title: '栏目',
      requireAuth: true,
      parentName: '/systemManage',
      roles: 'root'
    },
    component: () => import('@/views/admin/layout'),
    children: [
      {
        path: '/addCat',
        name: 'AddCat',
        meta: {
          title: '添加栏目',
          requireAuth: true,
          parentName: '/systemManage',
          roles: 'root'
        },
        component: () => import('@/views/admin/cat/add-cat')
      },
      {
        path: '/catList',
        name: 'CatList',
        meta: {
          title: '栏目列表',
          requireAuth: true,
          parentName: '/systemManage',
          roles: 'root'
        },
        component: () => import('@/views/admin/cat/cat-list')
      },
      {
        path: '/catList/editCat',
        name: 'EditCat',
        meta: {
          title: '修改栏目',
          requireAuth: true,
          parentName: '/systemManage',
          hideMenu: true,
          roles: 'root'
        },
        component: () => import('@/views/admin/cat/edit-cat')
      }
    ]
  },
  {
    path: '/art',
    name: 'Art',
    meta: {
      title: '文章',
      requireAuth: true,
      parentName: '/systemManage',
      roles: 'root'
    },
    component: () => import('@/views/admin/layout'),
    children: [
      {
        path: '/addArt',
        name: 'AddArt',
        meta: {
          title: '添加文章',
          requireAuth: true,
          parentName: '/systemManage',
          roles: 'root'
        },
        component: () => import('@/views/admin/art/add-art')
      },
      {
        path: '/artList',
        name: 'ArtList',
        meta: {
          title: '文章列表',
          requireAuth: true,
          parentName: '/systemManage',
          roles: 'root'
        },
        component: () => import('@/views/admin/art/art-list')
      },
      {
        path: '/artList/editArt',
        name: 'EditArt',
        meta: {
          title: '修改栏目',
          requireAuth: true,
          parentName: '/systemManage',
          hideMenu: true,
          roles: 'root'
        },
        component: () => import('@/views/admin/art/edit-art')
      }
    ]
  },
  {
    path: '/revisePassword',
    name: 'RevisePassword',
    meta: {
      title: '修改密码',
      requireAuth: true
    },
    component: () => import('@/views/user/revise-password')
  }
]
