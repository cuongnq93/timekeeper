import { createRouter, createWebHistory } from 'vue-router'
import TimerPage from '@/views/TimerPage.vue'
import SessionSummaryPage from '@/views/SessionSummaryPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'timer',
      component: TimerPage
    },
    {
      path: '/session-summary',
      name: 'session-summary',
      component: SessionSummaryPage,
      meta: {
        requiresSessionData: true
      }
    }
  ]
})

// Navigation guard to prevent direct access to summary without session data
router.beforeEach((to, _from, next) => {
  if (to.meta.requiresSessionData && !localStorage.getItem('sessionData')) {
    next({ name: 'timer' })
  } else {
    next()
  }
})

export default router
