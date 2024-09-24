import router from '@/router'
import setting from '@/setting'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import pinia from '@/store'
import useUserStore from '@/store/modules/user'
import useMenuStore from '@/store/modules/menu'

nprogress.configure({ showSpinner: false })

const whiteRoute: string[] = ['/redirect', '/sso-login', '/sso']
const userStore = useUserStore(pinia)
const menuStore = useMenuStore(pinia)

/**
 * 全局前置守卫
 */
router.beforeEach(async (to, from, next) => {
  // 设置文档标题
  document.title = (to.meta.title || '') + ` | ${setting.title}`
  nprogress.start()

  const token = userStore.accessToken as string

  // 用户未登录
  if (!token) {
    if (whiteRoute.includes(to.path)) {
      next() // 白名单路由直接放行
      return
    } else {
      next({ path: '/sso', query: { redirect: to.path, ...to.query } }) // 重定向到SSO
      return
    }
  }

  // 用户已登录
  const initMenu = menuStore.initMenu as boolean

  if (initMenu) {
    // 菜单已初始化
    if (to.path === '/sso') {
      next({ path: '/' }) // 重定向到主页
      return
    }

    // 处理无效路由
    if (to.matched.length === 0) {
      from.name ? next({ name: from.name }) : next('/404') // 导航到上一个路由或404页面
      return
    }

    // 继续导航
    next()
  } else {
    // 菜单未初始化
    try {
      await menuStore.listPermission() // 获取权限数据
      next({ ...to, replace: true }) // 加载菜单后重定向
    } catch (error) {
      await userStore.logout() // 登出操作
      // 重定向到SSO
      next({ path: '/sso', query: { redirect: to.path } })
    }
  }
})

// 全局后置守卫
router.afterEach(() => {
  nprogress.done()
})
