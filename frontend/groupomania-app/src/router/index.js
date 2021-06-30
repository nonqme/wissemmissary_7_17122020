import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Messages from '../views/Home.vue'
import Register from '../views/Register.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/messages',
    name: 'Messages',
    component: Messages
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
