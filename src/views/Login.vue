<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="logo-area">
        <h1>💈 BarberShop</h1>
        <p>Bem-vindo de volta!</p>
      </div>

      <div class="form">
        <div class="input-group">
          <label>E-mail</label>
          <input v-model="credenciais.email" type="email" placeholder="exemplo@email.com" />
        </div>

        <div class="input-group">
          <label>Senha</label>
          <div class="password-field">
            <input 
              v-model="credenciais.senha" 
              :type="exibirSenha ? 'text' : 'password'" 
              placeholder="Sua senha" 
            />
            <button type="button" @click.stop.prevent="exibirSenha = !exibirSenha" class="eye-icon">
              <svg v-if="!exibirSenha" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            </button>
          </div>
        </div>

        <button @click="fazerLogin" class="btn-login">Acessar Sistema</button>
      </div>
      
      <div class="footer-links">
        <router-link to="/register">Não tem uma conta? <span>Cadastre-se</span></router-link>
      </div>

      <p v-if="mensagem" class="error-msg">{{ mensagem }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const apiURL = 'https://barbearia-backend-f6kd.onrender.com';
const router = useRouter();

const mensagem = ref('');
const exibirSenha = ref(false);

// Objeto único para o formulário
const credenciais = ref({
  email: '',
  senha: ''
});

const fazerLogin = async () => {
  mensagem.value = '';
  try {
    const resposta = await axios.post(`${apiURL}/auth/login`, {
      email: credenciais.value.email,
      senha: credenciais.value.senha
    });
    
    localStorage.setItem('token', resposta.data.token);
    const cargo = resposta.data.usuario.cargo;

    if (cargo === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  } catch (err) {
    mensagem.value = err.response?.data?.error || "E-mail ou senha incorretos.";
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');

.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 400px;
}

.logo-area { text-align: center; margin-bottom: 30px; }
.logo-area h1 { color: #1e293b; font-size: 28px; margin-bottom: 5px; }
.logo-area p { color: #64748b; font-size: 14px; }

.form { display: flex; flex-direction: column; gap: 20px; }

.input-group { display: flex; flex-direction: column; gap: 8px; }
.input-group label { font-size: 14px; font-weight: 600; color: #475569; text-align: left; }

.password-field {
  position: relative;
  display: flex;
  align-items: center;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  transition: 0.2s;
  box-sizing: border-box;
}

.password-field input {
  padding-right: 45px;
}

input:focus { border-color: #10b981; outline: none; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }

.eye-icon {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #94a3b8;
  z-index: 10;
}

.eye-icon:hover { color: #10b981; }

.btn-login {
  background: #10b981;
  color: white;
  padding: 14px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
}

.btn-login:hover { background: #059669; transform: translateY(-2px); }

.footer-links { margin-top: 25px; text-align: center; font-size: 14px; }
.footer-links a { color: #64748b; text-decoration: none; }
.footer-links span { color: #10b981; font-weight: 600; }

.error-msg { color: #ef4444; background: #fef2f2; padding: 10px; border-radius: 8px; margin-top: 20px; font-size: 14px; text-align: center; border: 1px solid #fee2e2; }
</style>