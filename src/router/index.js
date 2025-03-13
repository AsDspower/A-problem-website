import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/MainView',
      name: 'mainview',
      component: () => import('../views/Components/MainView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/userview',
      name: 'userview',
      component: () => import('../views/Components/UserView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component:  () => import('../views/Components/LoginView.vue')
    },
    {
      path: '/problem',
      name: 'problem',
      component:  () => import('../views/Components/ProblemView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/Register',
      name: 'Register',
      component:  () => import('../views/Components/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      redirect : '/MainView',
      meta: { requiresAuth: true }
    },
    {
      path: '/problem/:id',
      name: 'QuestionPage',
      component: () => import('../views/Components/QuestionPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/problem/:id/:solution',
      name: 'QuestionSolution',
      component: () => import('../views/Components/QuestionSolution.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/history',
      name: 'History',
      component: () => import('../views/Components/HistoryView.vue'),
      meta: { requiresAuth: true }

    },
  ],
});













export default router;

