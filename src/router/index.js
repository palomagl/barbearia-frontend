import { createRouter, createWebHistory } from 'vue-router';

// Cada tela carrega só quando a rota é acessada (code-splitting), em vez de
// tudo ir no mesmo pacote inicial — quem só vai logar não baixa o código do
// admin, por exemplo.
const routes = [
  { path: '/', component: () => import('../views/Login.vue') },
  {
    path: '/dashboard',
    component: () => import('../views/Dashboard.vue'),
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
    component: () => import('../views/AdminDashboard.vue'),
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