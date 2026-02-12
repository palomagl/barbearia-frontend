<template>
    <div class="login-container">
      <h1>Agendamento Real</h1>
      <div class="form">
        <input v-model="email" type="email" placeholder="Seu email" />
        <input v-model="senha" type="password" placeholder="Sua senha" />
        <button @click="fazerLogin">Entrar</button>
      </div>
      <p v-if="mensagem">{{ mensagem }}</p>
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
    mensagem.value = "Erro ao logar: " + (err.response?.data?.error || "Servidor offline");
  }
};
  </script>
  
  <style scoped>
  .login-container { font-family: sans-serif; max-width: 300px; margin: 50px auto; text-align: center; }
  .form { display: flex; flex-direction: column; gap: 10px; }
  input, button { padding: 10px; border-radius: 5px; border: 1px solid #ccc; }
  button { background: #42b883; color: white; cursor: pointer; border: none; }
  </style>