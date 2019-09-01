import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/login.vue'
import home from '@/views/home/home.vue'
import users from '@/views/users/users.vue'
import rights from '@/views/rights/rights.vue'
import role from '@/views/rights/role.vue'

Vue.use(Router)

export default new Router({
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
        }
      ]
    }
  ]
})