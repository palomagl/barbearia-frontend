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
                    <label>Serviço</label>
                    <select v-model="novoAgendamento.descricao">
                        <option value="" disabled>Selecione um serviço...</option>
                        <option value="Corte Degradê - R$ 45,00">Corte Degradê - R$ 45,00</option>
                        <option value="Barba Terapia - R$ 35,00">Barba Terapia - R$ 35,00</option>
                        <option value="Combo (Corte + Barba) - R$ 70,00">Combo (Corte + Barba) - R$ 70,00</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Data e Hora</label>
                    <input type="datetime-local" v-model="novoAgendamento.data_hora" :min="dataMinima" />
                </div>

                <button @click="criarAgendamento" class="btn-agendar">Confirmar Agendamento</button>
            </section>

            <section class="list-section">
                <h3>Meus Horários</h3>
                
                <div v-if="loading" class="loader">Carregando seus dados...</div>
                
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const apiURL = 'https://barbearia-backend-f6kd.onrender.com';

const agendamentos = ref([]);
const loading = ref(true);
const router = useRouter();

// 1. Criar o objeto que segura os dados do formulário
const novoAgendamento = ref({
    descricao: '',
    data_hora: ''
});

const buscarAgendamentos = async () => {
    try {
        const token = localStorage.getItem('token');
        const resposta = await axios.get(`${apiURL}/agendamentos/listar`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        agendamentos.value = resposta.data;
    } catch (err) {
        console.error("Erro ao buscar dados", err);
        if (err.response?.status === 401) logout();
    } finally {
        loading.value = false;
    }
};

// 2. Criar a função que envia o novo agendamento para o Back-end
const criarAgendamento = async () => {
// 1. Validação: Verifica se os campos estão preenchidos
if (!novoAgendamento.value.descricao || !novoAgendamento.value.data_hora) {
        alert("Por favor, selecione o serviço e a data!");
        return;
    }

    // 2. Validação: Impede agendamento no passado
    const agora = new Date();
    const dataEscolhida = new Date(novoAgendamento.value.data_hora);
    if (dataEscolhida <= agora) {
        alert("Escolha um horário futuro! 🚀");
        return;
    }

    try {
        const token = localStorage.getItem('token');
        
        // 3. Envio para o Back-end (Note o /novo no final)
        await axios.post(`${apiURL}/agendamentos/novo`, {
            descricao: novoAgendamento.value.descricao,
            data_hora: novoAgendamento.value.data_hora
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert("Agendamento realizado com sucesso! ✂️");

        // 4. Limpa os campos após o sucesso
        novoAgendamento.value.descricao = '';
        novoAgendamento.value.data_hora = '';
        
        // 5. Atualiza a lista na tela
        buscarAgendamentos(); 

    } catch (err) {
        console.error(err);
        alert("Erro ao agendar: " + (err.response?.data?.error || "Servidor offline"));
    }
};

const formatarData = (data) => {
    return new Date(data).toLocaleString('pt-BR');
};

const logout = () => {
    localStorage.removeItem('token');
    router.push('/');
};

// Função para pegar a data atual no formato que o input datetime-local entende (YYYY-MM-DDTHH:mm)
const obterDataAtualFormatada = () => {
  const agora = new Date();
  // Ajusta para o fuso horário local
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
  return agora.toISOString().slice(0, 16);
};

const dataMinima = ref(obterDataAtualFormatada());

onMounted(() => {
  buscarAgendamentos();
  dataMinima.value = obterDataAtualFormatada();
});
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

/* Header */
.main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-bottom: 30px;
}

.logo-section h1 { font-size: 24px; color: #1e293b; margin: 0; }
.badge { font-size: 11px; background: #e2e8f0; padding: 2px 8px; border-radius: 5px; color: #64748b; font-weight: bold; }

/* Grid Principal */
.dashboard-grid {
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: 30px;
}

@media (max-width: 900px) {
    .dashboard-grid { grid-template-columns: 1fr; }
}

/* Cards Generais */
.booking-card {
    background: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    height: fit-content;
}

h3 { margin: 0 0 10px 0; color: #1e293b; }
.subtitle { color: #94a3b8; font-size: 14px; margin-bottom: 25px; }

/* Form Elements */
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

select:focus, input:focus { border-color: #10b981; outline: none; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }

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
}

.btn-agendar:hover { background: #059669; transform: translateY(-2px); }

/* Lista de Horários */
.appointments-grid {
    display: grid;
    gap: 15px;
}

.appointment-card {
    background: white;
    padding: 20px;
    border-radius: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #f1f5f9;
    transition: 0.2s;
}

.appointment-card:hover { border-color: #cbd5e1; }

.card-info { display: flex; flex-direction: column; gap: 5px; }
.service-name { font-weight: 700; color: #334155; }
.service-date { font-size: 13px; color: #64748b; }

/* Badges de Status */
.status-badge {
    padding: 5px 12px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
}

.pendente { background: #fef3c7; color: #92400e; }
.concluido { background: #dcfce7; color: #166534; }

.btn-logout { background: none; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 8px; cursor: pointer; color: #64748b; }
.btn-logout:hover { background: #fef2f2; border-color: #fca5a5; color: #ef4444; }

.empty-state { text-align: center; padding: 40px; color: #94a3b8; border: 2px dashed #e2e8f0; border-radius: 20px; }
</style>