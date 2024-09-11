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
  document.title = (to.meta.title || '') + ` | ${setting.title}`
  nprogress.start()

  const token: string = userStore.accessToken as string
  if (!token) {
    if (whiteRoute.includes(to.path)) {
      next()
    } else {
      next({ path: '/sso', query: { redirect: to.path, ...to.query } })
    }
    return
  }

  const initMenu: boolean = menuStore.initMenu as boolean
  if (initMenu) {
    to.path === '/sso'
      ? next({ path: '/' })
      : to.matched.length === 0
        ? from.name
          ? next({ name: from.name })
          : next('/404')
        : next()
  } else {
    try {
      await menuStore.listPermission()
      next({ ...to, replace: true })
    } catch (error) {
      await userStore.logout()
    }
  }
})

// 全局后置守卫
router.afterEach(() => {
  nprogress.done()
})
