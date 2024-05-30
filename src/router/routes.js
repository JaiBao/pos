import MainLayout from 'layouts/MainLayout.vue'
// import KdsLayout from 'layouts/KdsLayout.vue'
import OrderLayout from 'layouts/OrderLayout.vue'
// import KdsLayout22 from 'layouts/KdsLayout22.vue'
import ControlLayout from 'layouts/ControlLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '/',
        component: () => import('src/pages/main/LoginPage.vue'),
        meta: {
          title: '登入 | BINGPOS',
          login: false,
          admin: false,
          permission: 'index'
        }
      },
      {
        path: '/index',
        component: () => import('src/pages/main/IndexPage.vue'),
        meta: {
          title: 'INDEX | BINGPOS',
          login: true,
          admin: false,
          permission: 'index'
        }
      },
      {
        path: '/register',
        component: () => import('src/pages/main/RegisterPage.vue'),
        meta: {
          title: '註冊 | BINGPOS',
          login: false,
          admin: false,
          permission: 'users'
        }
      },
      {
        path: '/test',
        component: () => import('pages/main/NeworderTest.vue'),
        meta: {
          title: 'test | BINGPOS',
          login: true,
          admin: false
        }
      },
      {
        path: '/sound',
        component: () => import('pages/order/SoundTestFull.vue'),
        meta: {
          title: '製餐控制 | BINGPOS',
          login: true,
          admin: false,
          permission: 'control'
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
          title: '點餐 | BINGPOS',
          login: true,
          admin: false,
          permission: 'order'
        }
      },
      {
        path: '/member/create',
        component: () => import('pages/order/MemberCreatePage.vue'),
        meta: {
          title: '會員 | BINGPOS',
          login: true,
          admin: false,
          permission: 'member'
        }
      },
      {
        path: '/member',
        component: () => import('pages/order/MemberPage.vue'),
        meta: {
          title: '會員 | BINGPOS',
          login: true,
          admin: false,
          permission: 'member'
        }
      },
      {
        path: '/member/:id',
        component: () => import('pages/order/MemberOnePage.vue'),
        meta: {
          title: '會員 | BINGPOS',
          login: true,
          admin: false,
          permission: 'member'
        }
      },
      {
        path: '/ordered',
        component: () => import('pages/order/OrderedPage.vue'),
        meta: {
          title: '訂單 | BINGPOS',
          login: true,
          admin: false,
          permission: 'order'
        }
      },
      {
        path: '/payment',
        component: () => import('pages/order/PaymentPage.vue'),
        meta: {
          title: '付款處理 | BINGPOS',
          login: true,
          admin: false,
          permission: 'payment'
        }
      },
      {
        path: '/invoice',
        component: () => import('pages/order/InvoicePage.vue'),
        meta: {
          title: '發票 | BINGPOS',
          login: true,
          admin: false,
          permission: 'payment'
        }
      },
      {
        path: '/ordered/:id',
        component: () => import('src/pages/order/OrderedOnePage.vue'),
        meta: {
          title: '訂單 | BINGPOS',
          login: true,
          admin: false,
          permission: 'order'
        }
      },
      {
        path: '/Print',
        component: () => import('pages/order/PrintPage.vue'),
        meta: {
          title: '訂單列印',
          login: true,
          admin: false
        }
      },
      {
        path: '/material',
        component: () => import('src/pages/order/MaterialPage.vue'),
        meta: {
          title: '備料表 | BINGPOS',
          login: true,
          admin: false
        }
      },
      {
        path: '/search',
        component: () => import('src/pages/order/SearchPage.vue'),
        meta: {
          title: '搜尋 | BINGPOS ',
          login: true,
          admin: false,
          permission: 'order'
        }
      },
      {
        path: '/opaytest',
        component: () => import('src/pages/main/OpayTest.vue'),
        meta: {
          title: '搜尋 | BINGPOS',
          login: true,
          admin: false
        }
      }
    ]
  },
  // {
  //   path: '/kds',
  //   component: KdsLayout,
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('src/pages/kds/IndexPage.vue'),
  //       meta: {
  //         title: 'BINGKDS | INDEX',
  //         login: false,
  //         admin: false
  //       }
  //     },
  //     {
  //       path: '/kds/a',
  //       component: () => import('src/pages/kds/IndexPageaaa.vue'),
  //       meta: {
  //         title: 'BINGKDS | INDEX',
  //         login: false,
  //         admin: false
  //       }
  //     },
  //     {
  //       path: '/kds/b',
  //       component: () => import('src/pages/kds/IndexPagebbb.vue'),
  //       meta: {
  //         title: 'BINGKDS | INDEX',
  //         login: false,
  //         admin: false
  //       }
  //     },
  //     {
  //       path: '/kds/c',
  //       component: () => import('src/pages/kds/IndexPageccc.vue'),
  //       meta: {
  //         title: 'BINGKDS | INDEX',
  //         login: false,
  //         admin: false
  //       }
  //     },
  //     {
  //       path: '/kds/d',
  //       component: () => import('src/pages/kds/IndexPageddd.vue'),
  //       meta: {
  //         title: 'BINGKDS | INDEX',
  //         login: false,
  //         admin: false
  //       }
  //     },
  //     {
  //       path: '/kds/e',
  //       component: () => import('src/pages/kds/IndexPageeee.vue'),
  //       meta: {
  //         title: 'BINGKDS | INDEX',
  //         login: false,
  //         admin: false
  //       }
  //     }, {
  //       path: '/kds/f',
  //       component: () => import('src/pages/kds/IndexPagefff.vue'),
  //       meta: {
  //         title: 'BINGKDS | INDEX',
  //         login: false,
  //         admin: false
  //       }
  //     }, {
  //       path: '/kds/g',
  //       component: () => import('src/pages/kds/IndexPageggg.vue'),
  //       meta: {
  //         title: 'BINGKDS | INDEX',
  //         login: false,
  //         admin: false
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/kds2',
  //   component: KdsLayout22,
  //   children: [
  //     {
  //       path: '/kds2/test',
  //       component: () => import('src/pages/kds/IndexPageTest.vue'),
  //       meta: {
  //         title: 'BINGKDS | INDEX',
  //         login: false,
  //         admin: false
  //       }
  //     }
  //   ]
  // },
  {
    path: '/control',
    component: ControlLayout,
    children: [
      {
        path: '/control/net',
        component: () => import('src/pages/control/SetOrderPage.vue'),
        meta: {
          title: '官網數量控制 | BINGPOS',
          login: true,
          admin: false,
          permission: 'control'
        }
      },
      {
        path: '/control/table',
        component: () => import('src/pages/control/BullShit2.vue'),
        meta: {
          title: '控單表 | BINGPOS',
          login: true,
          admin: false,
          permission: 'control'
        }
      },
      {
        path: '/control/bom',
        component: () => import('src/pages/control/bomTable.vue'),
        meta: {
          title: 'BOM表 | BINGPOS',
          login: false,
          admin: false,
          permission: 'control'
        }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
