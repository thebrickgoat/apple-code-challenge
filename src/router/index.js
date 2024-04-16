import { createRouter, createWebHistory } from 'vue-router'
import ChallengeOneView from '../views/ChallengeOneView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ChallengeOneView
    },
    {
      path: '/challenge-one',
      name: 'challenge-one',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ChallengeOneView.vue')
    },
    {
      path: '/challenge-two',
      name: 'challenge-two',
      component: () => import('../views/ChallengeTwoView.vue')
    },
    {
      path: '/challenge-three',
      name: 'challenge-three',
      component: () => import('../views/ChallengeThreeView.vue')
    }
  ]
})

export default router
