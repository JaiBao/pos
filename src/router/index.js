import { route } from 'quasar/wrappers'
// import { onBeforeUnmount } from 'vue'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory, useRouter } from 'vue-router'
import routes from './routes'
import { UseMealStore } from 'src/stores/meal.js'
import { useUserStore } from 'src/stores/user'
import { useQuasar } from 'quasar'

// let titleInterval

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })
  Router.afterEach((to, from, next) => {
    // 清除现有的定时器
    const user = useUserStore()
    const $q = useQuasar()
    const router = useRouter()

    // if (titleInterval !== undefined) {
    //   clearInterval(titleInterval)
    // }

    // function updateTitle () {
    //   const currentTitle = document.title
    //   document.title = currentTitle.substring(1) + currentTitle.charAt(0)
    // }

    // // 设置新的定时器
    // titleInterval = setInterval(updateTitle, 400)

    // 检查用户登录状态
    if (to.meta.login && !user.isLogin) {
      router.push('/') // 确保使用正确的路由实例
      $q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: 'info',
        message: '你沒有權限'
      })
    }
  })
  Router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    const meal = UseMealStore()
    const user = useUserStore()
    const $q = useQuasar()

    // 设置定时器
    // eslint-disable-next-line

    meal.clear()
    if (!user.permission.includes(to.meta.permission)) {
      $q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: 'info',
        message: '你沒有權限'
      })
      next(false)
      // router.push('/')
    } else {
      next()
    }
  })

  return Router
})
