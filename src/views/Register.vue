<template>
    <div class="register-container">
      <div class="register-card">
        <div class="header-auth">
          <h1>💈 BarberShop</h1>
          <p>Crie sua conta para agendar seu horário</p>
        </div>
  
        <div class="form-register">
          <div class="input-group">
            <label>Nome Completo</label>
            <input v-model="usuario.nome" type="text" placeholder="Ex: Paloma Silva" />
          </div>
  
          <div class="input-group">
            <label>E-mail</label>
            <input v-model="usuario.email" type="email" placeholder="seu@email.com" />
          </div>
  
          <div class="input-group">
            <label>Senha</label>
            <input v-model="usuario.senha" type="password" placeholder="********" />
          </div>
  
          <button @click="realizarCadastro" class="btn-register">Criar minha conta</button>
        </div>
  
        <div class="footer-auth">
          <span>Já tem uma conta?</span>
          <router-link to="/">Fazer Login</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const apiURL = import.meta.env.VITE_API_URL;

  const router = useRouter();
  const usuario = ref({
    nome: '',
    email: '',
    senha: ''
  });
  
  const realizarCadastro = async () => {
    if (!usuario.value.nome || !usuario.value.email || !usuario.value.senha) {
      alert("Preencha todos os campos para continuar!");
      return;
    }
  
    try {
      // Note que usamos /register conforme sua rota do backend
      await axios.post(`${apiURL}/auth/register`, usuario.value);
      
      alert("Conta criada com sucesso! ✂️");
      router.push('/'); // Redireciona para o login
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao cadastrar.";
      alert(msg);
    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
  
  .register-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8fafc;
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 20px;
  }
  
  .register-card {
    background: white;
    width: 100%;
    max-width: 400px;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  }
  
  .header-auth {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .header-auth h1 {
    font-size: 24px;
    color: #1e293b;
    margin-bottom: 8px;
  }
  
  .header-auth p {
    color: #64748b;
    font-size: 14px;
  }
  
  .input-group {
    margin-bottom: 20px;
  }
  
  .input-group label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 8px;
  }
  
  input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    font-size: 15px;
    transition: all 0.2s;
    box-sizing: border-box;
  }
  
  input:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
  }
  
  .btn-register {
    width: 100%;
    background-color: #1e293b;
    color: white;
    border: none;
    padding: 14px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.3s;
    margin-top: 10px;
  }
  
  .btn-register:hover {
    background-color: #0f172a;
    transform: translateY(-2px);
  }
  
  .footer-auth {
    margin-top: 25px;
    text-align: center;
    font-size: 14px;
    color: #64748b;
  }
  
  .footer-auth a {
    color: #10b981;
    text-decoration: none;
    font-weight: 700;
    margin-left: 5px;
  }
  </style>