import Vue from 'vue'
import Router from 'vue-router'
import main from '../components/main.vue'
import login from '../components/login.vue'
import signup from '../components/signup.vue'
import friends from '../components/friends'
import chats from '../components/chats'
import store from '../store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {isAuthenticated: false},
    },
    {
      path: '/signup',
      name: 'signup',
      component: signup,
      meta: {isAuthenticated: false},
    },
    {
      path: '/main',
      name: 'main',
      component: main,
      meta: {isAuthenticated: true},
    },
    {
      path: '/friends',
      name: 'friends',
      component: friends,
      meta: {isAuthenticated: true},
    },
    {
      path: '/chats',
      name: 'chats',
      component: chats,
      meta: {isAuthenticated: true},
    },
    {
      path: '*',
      redirect: '/main'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.isAuthenticated)) {
    if (!store.getters['auth/hasToken']) {
      next('/login');
    } else {
      next();
    }
    return;
  } else {
    if (!store.getters['auth/hasToken']) {
      next();
      return;
    }
    next('/');
    return;
  }
})

export default router;