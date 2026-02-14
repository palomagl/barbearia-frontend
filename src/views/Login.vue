<template>
  <div class="dashboard-container">
      <header class="main-header">
          <div class="logo-section">
              <h1>💈 BarberShop</h1>
              <span class="badge">Área do Cliente</span>
          </div>
          <button @click="logout" class="btn-logout">Sair</button>
      </header>

      <main class="dashboard-grid">
          <section class="booking-card">
              <h3>Agendar Horário</h3>
              <p class="subtitle">Escolha o serviço e o melhor momento para você.</p>
              
              <div class="form-group">
                  <label>1. Selecione o Serviço</label>
                  <select v-model="novoAgendamento.descricao">
                      <option value="" disabled>Selecione um serviço...</option>
                      <option value="Corte Degradê - R$ 45,00">Corte Degradê - R$ 45,00</option>
                      <option value="Barba Terapia - R$ 35,00">Barba Terapia - R$ 35,00</option>
                      <option value="Combo (Corte + Barba) - R$ 70,00">Combo (Corte + Barba) - R$ 70,00</option>
                  </select>
              </div>

              <div class="form-group">
                  <label>2. Escolha o Dia</label>
                  <input type="date" v-model="dataSelecionada" :min="diaMinimo" @change="gerarHorarios" />
              </div>

              <div v-if="dataSelecionada" class="form-group">
                  <label>3. Escolha o Horário (30 em 30 min)</label>
                  <div class="horarios-grid">
                      <button 
                          v-for="hora in listaHorarios" 
                          :key="hora"
                          :class="['btn-hora', { 'selecionado': novoAgendamento.hora === hora }]"
                          @click="novoAgendamento.hora = hora"
                      >
                          {{ hora }}
                      </button>
                  </div>
              </div>

              <button @click="criarAgendamento" class="btn-agendar" :disabled="!podeAgendar">
                  Confirmar Agendamento
              </button>
          </section>

          <section class="list-section">
              <h3>Meus Horários</h3>
              <div v-if="loading" class="loader">Carregando...</div>
              <div v-else-if="agendamentos.length === 0" class="empty-state">
                  <p>Você ainda não tem agendamentos ativos.</p>
              </div>
              <div v-else class="appointments-grid">
                  <div v-for="item in agendamentos" :key="item.id" class="appointment-card">
                      <div class="card-info">
                          <span class="service-name">{{ item.descricao }}</span>
                          <span class="service-date">📅 {{ formatarData(item.data_hora) }}</span>
                      </div>
                      <span :class="['status-badge', item.status || 'pendente']">
                          {{ item.status || 'pendente' }}
                      </span>
                  </div>
              </div>
          </section>
      </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const apiURL = 'https://barbearia-backend-f6kd.onrender.com';
const router = useRouter();
const agendamentos = ref([]);
const loading = ref(true);

const dataSelecionada = ref('');
const novoAgendamento = ref({
  descricao: '',
  hora: ''
});

const listaHorarios = ref([
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', 
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
]);

const podeAgendar = computed(() => {
  return novoAgendamento.value.descricao && dataSelecionada.value && novoAgendamento.value.hora;
});

const diaMinimo = new Date().toISOString().split('T')[0];

const criarAgendamento = async () => {
  try {
      const token = localStorage.getItem('token');
      // Combina Data + Hora para o banco de dados
      const dataHoraFinal = `${dataSelecionada.value}T${novoAgendamento.value.hora}:00`;

      await axios.post(`${apiURL}/agendamentos/novo`, {
          descricao: novoAgendamento.value.descricao,
          data_hora: dataHoraFinal
      }, {
          headers: { Authorization: `Bearer ${token}` }
      });

      alert("Agendamento realizado! ✂️");
      dataSelecionada.value = '';
      novoAgendamento.value = { descricao: '', hora: '' };
      buscarAgendamentos();
  } catch (err) {
      alert(err.response?.data?.error || "Erro ao agendar");
  }
};

const buscarAgendamentos = async () => {
  try {
      const token = localStorage.getItem('token');
      const resposta = await axios.get(`${apiURL}/agendamentos/listar`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      agendamentos.value = resposta.data;
  } catch (err) {
      if (err.response?.status === 401) logout();
  } finally {
      loading.value = false;
  }
};

const formatarData = (data) => new Date(data).toLocaleString('pt-BR');
const logout = () => { localStorage.removeItem('token'); router.push('/'); };

onMounted(buscarAgendamentos);
</script>

<style scoped>
/* Mantenha seus estilos e adicione estes: */
.horarios-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 10px;
}

.btn-hora {
  padding: 10px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s;
}

.btn-hora:hover { border-color: #10b981; color: #10b981; }
.btn-hora.selecionado {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.btn-agendar:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
}
</style>