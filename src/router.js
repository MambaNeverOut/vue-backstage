import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/login.vue'
import home from '@/views/home/home.vue'
import users from '@/views/users/users.vue'
import rights from '@/views/rights/rights.vue'
import role from '@/views/rights/role.vue'
import goodsList from '@/views/goods/goodsList.vue'
import goodsAdd from '@/views/goods/goodsAdd.vue'
import params from '@/views/goods/params.vue'
import goodsCate from '@/views/goods/goodsCate.vue'
import {
  Message
} from 'element-ui';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      redirect: './login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      children: [{
          path: 'users',
          name: 'users',
          component: users
        },
        {
          path: 'rights',
          name: 'right',
          component: rights
        },
        {
          path: 'roles',
          name: 'role',
          component: role
        },
        {
          path: 'goods',
          name: 'good',
          component: goodsList
        },
        {
          path: 'goodsAdd',
          name: 'goodsAdd',
          component: goodsAdd
        },
        {
          path: 'params',
          name: 'params',
          component: params
        },
        {
          path: 'categories',
          name: 'categories',
          component: goodsCate
        },
      ]
    }
  ]
})

// 设置全局路由守卫，如果没有token则返回登陆页面
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem("token");
    if (!token) {
      Message.warning('亲，请先登录')
      router.push({
        name: 'login'
      });
      return
    }
    next()
  }
})

export default router