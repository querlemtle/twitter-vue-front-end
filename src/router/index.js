import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: Main
  },
  {
    path: '/follows',
    name: 'user-follows',
    component: () => import('../views/UserFollows.vue')
  },
  {
    path: '/admin',
    name: 'admin-login',
    component: () => import('../views/AdminLogin.vue')
  },
  {
    path: '/user/:id',
    name: 'user',
    component: () => import('../views/User.vue')
  },
  {
    path: '/setting',
    name: 'account-setting',
    component: () => import('../views/AccountSetting.vue')
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound,
  },
]

const router = new VueRouter({
  routes
})

export default router
