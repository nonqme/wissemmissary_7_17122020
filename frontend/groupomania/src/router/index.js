import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Post from '../views/Post.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/posts',
    name: 'Post',
    component: Post
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
