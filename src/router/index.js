import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'
import store from '../store'

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
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/tweet/:id',
    name: 'tweet',
    component: () => import('../views/Tweet.vue')
  },
  {
    path: '/user/:id',
    name: 'user',
    redirect: '/user/:id/tweets',
    component: () => import("../views/User.vue"),
    children: [
      {
        path: 'tweets',
        name: 'user-tweets',
        component: () => import("../components/UserTweets.vue"),
      },
      {
        path: 'replies',
        name: 'user-replies',
        component: () => import("../components/UserReplyTweets.vue"),
      },
      {
        path: 'likes',
        name: 'user-likes',
        component: () => import("../components/UserLikeTweets.vue"),
      },
    ]
  },
  {
    path: '/user/:id/followings',
    name: 'user-followings',
    component: () => import('../views/UserFollowings.vue')
  },
  {
    path: '/user/:id/followers',
    name: 'user-followers',
    component: () => import('../views/UserFollowers.vue')
  },
  {
    path: '/setting',
    name: 'account-setting',
    component: () => import('../views/AccountSetting.vue')
  },
  {
    path: '/admin',
    name: 'admin-login',
    component: () => import('../views/AdminLogin.vue')
  },
  {
    path: '/admin/tweets',
    name: 'admin-tweets',
    component: () => import('../views/AdminTweet.vue')
  },  
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('../views/AdminUsers.vue')
  },
  {
    path: '*',
    name: 'not-found',
    component: NotFound,
  },
]

const router = new VueRouter({
  linkExactActiveClass: 'active',
  routes
})

router.beforeEach(async (to, from, next) => {
  // localStorage 取出 token，可能為 user or admin
  const token = localStorage.getItem('token')

  // 不需要 token 就可檢視之頁面
  const pathsWithoutAuthentications = ['login', 'register', 'admin-login']

  // 管理者可以檢視的頁面
  const pathsAdminOnly = ['admin-login', 'admin-tweets', 'admin-users'] 

  // 無 token 且想進入需要權限的頁面，一律轉登入頁
  if(!token && !pathsWithoutAuthentications.includes(to.name)) {
    next('/login')
    return
  }

  // 有 token 才向後端驗證
  if (token) {
  // 會回傳當前 role & isAuthenticated(bool)
  const { role, isAuthenticated } = await store.dispatch('fetchCurrentUser')
    // 結果 1：如果 token 無效，而且使用者想進入需要權限才能檢視的頁面，轉址到登入頁
    if (!isAuthenticated && !pathsWithoutAuthentications.includes(to.name)) {
      next('/login')
      return
    }
    // 結果 2：如果 token 身分是 user 且想進入登入/註冊頁，轉址回前台推文首頁（Home.vue）
    if (role === "user" && isAuthenticated && pathsWithoutAuthentications.includes(to.name)) {
      next('/home')
      return
    }
    
    // 結果 3：如果 token 身分是 user，而且嘗試進入後台頁面，轉址到推文首頁
    if (role === "user" && isAuthenticated && pathsAdminOnly.includes(to.name)) {
      next('/home')
      return
    }
    // 結果 4：如果 token 身分是 admin，而且管理者嘗試進入後台登入頁，轉址到後台管理首頁
    if (role === "admin" && isAuthenticated && pathsWithoutAuthentications.includes(to.name)) {
      next('/admin/tweets')
      return
    }
    // 結果 5：如果 token 身分是 admin，而且管理者嘗試進入前台頁面，轉址到後台管理首頁
    if (role === "admin" && isAuthenticated && !pathsAdminOnly.includes(to.name)){
      next('/admin/tweets')
      return
    }
  }

  next()
})

export default router
