import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

// createWebHashHistory :hash模式
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), //与vue2的history模式类似
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, //登录页
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/AlticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 登录访问拦截 => 默认放行
router.beforeEach((to) => {
  // 如果没有token，且访问非登录页面，则需要拦截登录
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'
})

export default router
