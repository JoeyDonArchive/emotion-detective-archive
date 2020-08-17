import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () =>
        import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
    },
    {
      path: '/video/:id',
      name: 'video',
      component: () =>
        import(/* webpackChunkName: "video" */ '@/views/Video.vue'),
    },
    {
      path: '*',
      redirect: '/dashboard',
    },
  ],
})

// router guard
router.beforeEach(async (to, from, next) => {
  // proceed
  next()
})

export default router
