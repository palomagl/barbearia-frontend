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
          <input v-model="email" type="email" placeholder="exemplo@email.com" />
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

// Use apenas este objeto para o v-model
const credenciais = ref({
  email: '',
  senha: ''
});

const fazerLogin = async () => {
  try {
    // Usando credenciais.value.email e senha
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

input {
padding: 12px;
border: 1px solid #e2e8f0;
border-radius: 12px;
font-size: 15px;
transition: 0.2s;
}

input:focus { border-color: #10b981; outline: none; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }

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