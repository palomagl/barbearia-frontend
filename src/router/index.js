import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import AdminDashboard from '../views/AdminDashboard.vue';

const routes = [
  { path: '/', component: Login },
  { 
    path: '/dashboard', 
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('token')) {
        next('/');
      } else {
        next();
      }
    }
  },
  { 
    path: '/admin', 
    component: AdminDashboard,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token');
      // Aqui poderíamos checar o cargo também, 
      // mas por enquanto, vamos garantir que pelo menos esteja logado.
      if (!token) {
        next('/');
      } else {
        next();
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;