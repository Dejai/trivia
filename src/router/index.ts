import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/components/pages/HomePage.vue'
import GamePage from '@/components/pages/GamePage.vue'
import { useMenuStore } from '@/stores/menu'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      beforeEnter: async (to, from ) => {
        const menuStore = useMenuStore()
        menuStore.setMenuValue("subtitle1", "")
        menuStore.setMenuValue("subtitle2", "")
      }
    },
    {
      path: '/game/:gameID/transfer',
      name: 'transfer',
      component: () => import('../components/pages/Transfer.vue')
    },
    {
      path: '/game/new',
      name: 'newgame',
      component: () => import('../components/pages/NewGamePage.vue')
    },
    {
      path: '/game/:gameID/:tab?',
      name: 'game',
      component: GamePage,
      props: true
    },
    {
      path: '/join/:gameID/session/:sessionID',
      name: 'join',
      component: () => import('../components/pages/SessionJoinPage.vue')
    },
    {
      path: '/board/:gameID/session/:sessionID',
      name: 'board',
      component: () => import('../components/pages/BoardPage.vue'),
      props: true
    },
    {
      path: '/play/:gameID/session/:sessionID/team/:teamID',
      name: 'team',
      component: () => import('../components/pages/TeamPage.vue'),
      props: true
    },
    { 
      path: '/:pathMatch(.*)*',
      name: 'NotFound', 
      component: () => import('../components/pages/404.vue') 
    }
  ],
  strict: true
})

export default router
