import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import("@/layouts/MainLayout.vue"),  // 後台主布局
      children: [
        // 後台路由
        {
          path: 'appointments',
          component: () => import("@/views/AppointmentList.vue")
        },
        {
          path: 'appointments/edit/:id',
          name: 'AppointmentEdit',
          component: () => import('@/views/AppointmentEditPage.vue')
        }
      ]
    },

    // 前台頁面，不包含 MainLayout
    {
      path: '/toappointments',
      component: () => import("@/views/AppointmentFrontPage.vue")  // 前台頁面
    },
    {
      path: '/toappointments/reserve',
      component: () => import("@/views/AppointmentReserve.vue")
    },
    {
      path: '/toappointments/hendlereserve',
      component: () => import("@/views/AppointmentHendlePage.vue")
    },
    {
      path: '/toappointments/queryreserve',
      component: () => import("@/views/AppointmentQueryPage.vue")
    },

    // 報到頁：獨立路由，不含 MainLayout
    {
      path: '/checkin',
      name: 'CheckinPage',
      component: () => import('@/components/CheckinPage.vue')
    }
  ]
})

export default router
