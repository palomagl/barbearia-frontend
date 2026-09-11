<template>
  <div class="auth">
    <div class="card auth__card">
      <header class="masthead">
        <span class="hallmark">💈</span>
        <span class="wordmark">BarberShop</span>
        <span class="engraved-label masthead__role">Salão&nbsp;&middot;&nbsp;Reservas</span>
      </header>

      <hr class="rule rule--double masthead__rule" />

      <h1 class="card__title">Criar sua conta</h1>
      <p class="card__sub">Leva menos de um minuto.</p>

      <form class="form" @submit.prevent="realizarCadastro">
        <label class="field">
          <span class="engraved-label">Nome completo</span>
          <input v-model="usuario.nome" type="text" autocomplete="name" placeholder="Ex: Paloma Silva" />
        </label>

        <label class="field">
          <span class="engraved-label">E-mail</span>
          <input v-model="usuario.email" type="email" autocomplete="email" placeholder="seu@email.com" />
        </label>

        <label class="field">
          <span class="engraved-label">WhatsApp (com DDD)</span>
          <input v-model="telefone" type="tel" autocomplete="tel" placeholder="11 99999 9999" />
        </label>

        <label class="field">
          <span class="engraved-label">Senha</span>
          <span class="field__lock">
            <input
              v-model="usuario.senha"
              :type="exibirSenha ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="No mínimo 8 caracteres"
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

        <button type="submit" class="btn btn--primary form__submit">Criar conta</button>
      </form>

      <hr class="rule" />
      <p class="card__foot">
        Já tem uma conta?
        <router-link to="/">Fazer login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'; // <--- IMPORTANTE: Adicionei esta linha

const apiURL = 'https://barbearia-backend-f6kd.onrender.com';
const router = useRouter();

// VARIÁVEIS QUE ESTAVAM FALTANDO:
const exibirSenha = ref(false);
const telefone = ref('');

const usuario = ref({
  nome: '',
  email: '',
  senha: ''
});

const realizarCadastro = async () => {
  // Agora validamos usando .value
  if (!usuario.value.nome || !usuario.value.email || !usuario.value.senha || !telefone.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, preencha todos os dados, incluindo o WhatsApp!',
      confirmButtonColor: '#f1c40f'
    });
    return;
  }

  try {
    await axios.post(`${apiURL}/auth/register`, {
      ...usuario.value,
      telefone: telefone.value
    });

    await Swal.fire({
      title: 'Bem-vindo(a)! 🎉',
      text: 'Sua conta foi criada com sucesso. Agora é só agendar seu corte!',
      icon: 'success',
      confirmButtonColor: '#10b981'
    });

    router.push('/');
  } catch (err) {
    const msg = err.response?.data?.error || "Erro ao cadastrar.";
    Swal.fire('Erro', msg, 'error');
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
.masthead__rule { margin: 1.1rem 0 1.5rem; }

.card__title { font-size: clamp(1.5rem, 5vw, 1.75rem); }

.form { margin-top: 1.5rem; }
.form__submit {
  width: 100%;
  margin-top: 1.5rem;
}

.rule { margin: 1.5rem 0 1.1rem; }

.card__foot {
  font-size: 0.9rem;
  color: var(--ink-soft);
}
</style>
