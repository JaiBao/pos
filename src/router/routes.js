
import MainLayout from 'layouts/MainLayout.vue'

import OrderLayout from 'layouts/OrderLayout.vue'
const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '/',
        component: () => import('src/pages/main/LoginPage.vue'),
        meta: {
          title: '登入',
          login: false,
          admin: false
        }
      },
      {
        path: '/index',
        name: 'index',
        component: () => import('src/pages/main/IndexPage.vue'),
        meta: {
          title: '華餅系統',
          login: false,
          admin: false
        }
      },

      {
        path: '/register',
        component: () => import('src/pages/main/RegisterPage.vue'),
        meta: {
          title: '註冊',
          login: false,
          admin: false
        }
      }
    ]
  },

  {
    path: '/Order',
    component: OrderLayout,
    children: [
      {
        path: '',
        component: () => import('pages/order/OrderPage.vue'),
        meta: {
          title: '點餐',
          login: false,
          admin: false
        }
      },
      {
        path: '/Setting',
        component: () => import('pages/order/SettingPage.vue'),
        meta: {
          title: '設定',
          login: false,
          admin: false
        }
      },
      // {
      //   path: '/Document',
      //   beforeEnter () {
      //     window.location.href = 'http://ods.dtstw.com/backend/sale/orders'
      //   },
      //   // component: () => import('pages/order/DocumentPage.vue'),
      //   meta: {
      //     title: '訂單',
      //     login: false,
      //     admin: false
      //   }
      // },
      {
        path: '/Print',
        component: () => import('pages/order/PrintPage.vue'),
        meta: {
          title: '訂單列印',
          login: false,
          admin: false
        }
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
