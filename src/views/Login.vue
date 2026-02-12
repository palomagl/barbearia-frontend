<template>
    <div class="login-container">
      <h1>Agendamento Real</h1>
      <div class="form">
        <input v-model="email" type="email" placeholder="Seu email" />
        <input v-model="senha" type="password" placeholder="Sua senha" />
        <button @click="fazerLogin">Entrar</button>
      </div>
      
      <div style="margin-top: 15px;">
        <router-link to="/register">Não tem conta? Cadastre-se</router-link>
      </div>

      <p v-if="mensagem" style="color: red; margin-top: 10px;">{{ mensagem }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router'; // Importar o roteador
  
  const apiURL = import.meta.env.VITE_API_URL;

  const email = ref('');
  const senha = ref('');
  const mensagem = ref('');
  const router = useRouter();
  
  const fazerLogin = async () => {
  try {
    const resposta = await axios.post(`${apiURL}/auth/login`, {
      email: email.value,
      senha: senha.value
    });
    
    // Guardamos o token e o cargo
    localStorage.setItem('token', resposta.data.token);
    const cargo = resposta.data.usuario.cargo; // O seu backend já envia isso!

    // Redirecionamento inteligente
    if (cargo === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }

  } catch (err) {
    // Melhorando a mensagem de erro
    console.error("Erro completo:", err); 
    mensagem.value = "Erro: " + (err.response?.data?.error || "Não foi possível conectar ao servidor.");
  }
};
  </script>
  
  <style scoped>
  .login-container { font-family: sans-serif; max-width: 300px; margin: 50px auto; text-align: center; }
  .form { display: flex; flex-direction: column; gap: 10px; }
  input, button { padding: 10px; border-radius: 5px; border: 1px solid #ccc; }
  button { background: #42b883; color: white; cursor: pointer; border: none; }
  </style>