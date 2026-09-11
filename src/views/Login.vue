<template>
  <div class="auth">
    <div class="card auth__card">
      <header class="masthead">
        <span class="hallmark">💈</span>
        <span class="wordmark">BarberShop</span>
        <span class="engraved-label masthead__role">Salão&nbsp;&middot;&nbsp;Reservas</span>
      </header>

      <hr class="rule rule--double masthead__rule" />

      <h1 class="card__title">Acesse sua conta</h1>
      <p class="card__sub">Que bom te ver de novo.</p>

      <form class="form" @submit.prevent="fazerLogin">
        <label class="field">
          <span class="engraved-label">E-mail</span>
          <input v-model="credenciais.email" type="email" autocomplete="email" placeholder="voce@email.com" />
        </label>

        <label class="field">
          <span class="engraved-label">Senha</span>
          <span class="field__lock">
            <input
              v-model="credenciais.senha"
              :type="exibirSenha ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="Sua senha"
            />
            <button
              type="button"
              class="reveal"
              :aria-label="exibirSenha ? 'Ocultar senha' : 'Mostrar senha'"
              @click.stop.prevent="exibirSenha = !exibirSenha"
            >
              <svg v-if="!exibirSenha" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </span>
        </label>

        <p v-if="mensagem" class="notice" role="alert">{{ mensagem }}</p>

        <button type="submit" class="btn btn--primary form__submit">Entrar</button>
      </form>

      <hr class="rule" />
      <p class="card__foot">
        Ainda não tem conta?
        <router-link to="/register">Criar conta</router-link>
      </p>
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
.auth {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vw, 3rem);
}

.auth__card {
  width: 100%;
  max-width: 420px;
  padding: clamp(1.75rem, 5vw, 2.5rem);
}

.masthead {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.masthead__role {
  margin-left: auto;
  font-size: 10px;
}
.masthead__rule {
  margin: 1.1rem 0 1.5rem;
}

.card__title { font-size: clamp(1.5rem, 5vw, 1.75rem); }

.form { margin-top: 1.5rem; }
.form__submit {
  width: 100%;
  margin-top: 1.5rem;
}

.notice {
  margin-top: 1rem;
  padding: 0.6rem 0.75rem;
  border-left: 1px solid var(--crimson);
  background: var(--paper-deep);
  color: var(--crimson-deep);
  font-size: 0.85rem;
}

.rule { margin: 1.5rem 0 1.1rem; }

.card__foot {
  font-size: 0.9rem;
  color: var(--ink-soft);
}
</style>
