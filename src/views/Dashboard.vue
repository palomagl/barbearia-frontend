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
                    <input type="date" v-model="dataSelecionada" :min="diaMinimo" />
                </div>
  
                <div v-if="dataSelecionada" class="form-group">
                    <label>3. Escolha o Horário</label>
                    <div class="horarios-grid">
                        <button 
                            v-for="hora in listaHorarios" 
                            :key="hora"
                            type="button"
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
  
  const criarAgendamento = async () => {
    try {
        const token = localStorage.getItem('token');
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
  
  const formatarData = (data) => new Date(data).toLocaleString('pt-BR');
  const logout = () => { localStorage.removeItem('token'); router.push('/'); };
  
  onMounted(buscarAgendamentos);
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
  
  .dashboard-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #f8fafc;
      min-height: 100vh;
  }
  
  .main-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      margin-bottom: 30px;
  }
  
  .logo-section h1 { font-size: 24px; color: #1e293b; margin: 0; }
  .badge { font-size: 11px; background: #e2e8f0; padding: 2px 8px; border-radius: 5px; color: #64748b; font-weight: bold; }
  
  .dashboard-grid {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 30px;
  }
  
  @media (max-width: 900px) {
      .dashboard-grid { grid-template-columns: 1fr; }
  }
  
  .booking-card {
      background: white;
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      height: fit-content;
  }
  
  h3 { margin: 0 0 10px 0; color: #1e293b; }
  .subtitle { color: #94a3b8; font-size: 14px; margin-bottom: 25px; }
  
  .form-group { margin-bottom: 20px; }
  .form-group label { display: block; font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 8px; }
  
  select, input {
      width: 100%;
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      font-size: 15px;
      transition: 0.2s;
  }
  
  /* Grade de horários */
  .horarios-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 10px;
  }
  
  .btn-hora {
    padding: 10px 5px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 10px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    transition: 0.2s;
  }
  
  .btn-hora:hover { border-color: #10b981; color: #10b981; background: #f0fff4; }
  .btn-hora.selecionado {
    background: #10b981;
    color: white;
    border-color: #10b981;
    box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);
  }
  
  .btn-agendar {
      width: 100%;
      background: #10b981;
      color: white;
      border: none;
      padding: 15px;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.3s;
      margin-top: 10px;
  }
  
  .btn-agendar:hover:not(:disabled) { background: #059669; transform: translateY(-2px); }
  .btn-agendar:disabled { background: #cbd5e1; cursor: not-allowed; }
  
  /* Lista de horários */
  .appointments-grid { display: grid; gap: 15px; }
  .appointment-card {
      background: white;
      padding: 20px;
      border-radius: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #f1f5f9;
  }
  
  .card-info { display: flex; flex-direction: column; gap: 5px; }
  .service-name { font-weight: 700; color: #334155; }
  .service-date { font-size: 13px; color: #64748b; }
  .status-badge { padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
  .pendente { background: #fef3c7; color: #92400e; }
  .concluido { background: #dcfce7; color: #166534; }
  .btn-logout { background: none; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; cursor: pointer; color: #64748b; }
  .empty-state { text-align: center; padding: 40px; color: #94a3b8; border: 2px dashed #e2e8f0; border-radius: 20px; }
  </style>