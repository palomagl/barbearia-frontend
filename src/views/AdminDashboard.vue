<template>
    <div class="admin-container">
        <header>
            <div class="logo-area">
                <h2>Painel do Barbeiro 💈</h2>
                <span class="badge">ADMIN</span>
            </div>
            <button @click="logout" class="btn-logout">Sair do Sistema</button>
        </header>

        <div class="grid-stats">
            <div class="stat-card">
                <h3>Próximos Agendamentos</h3>
                <p class="numero">{{ agenda.length }}</p>
            </div>
        </div>

        <div class="agenda-section">
            <h3>Agenda Geral de Hoje</h3>
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Cliente</th>
                        <th>Serviço</th>
                        <th>Data/Hora</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in agenda" :key="item.id">
                        <td>
                            <span
                                :class="['status-tag', item.status === 'concluido' ? 'status-ok' : 'status-pendente']">
                                {{ item.status || 'pendente' }}
                            </span>
                        </td>
                        <td>
                            <span class="cliente-nome">{{ item.cliente_nome }}</span>
                        </td>
                        <td>
                            <span class="servico-desc">{{ item.descricao }}</span>
                        </td>
                        <td>{{ new Date(item.data_hora).toLocaleString('pt-BR') }}</td>
                        <td>
                            <button @click="concluirServico(item.id)" class="btn-check">Finalizar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const apiURL = 'https://barbearia-backend-f6kd.onrender.com';

const agenda = ref([]);
const router = useRouter();

const buscarTodaAgenda = async () => {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${apiURL}/agendamentos/admin/todos`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        agenda.value = res.data;
    } catch (err) {
        console.error(err);
        alert("Erro de permissão! Voltando para o login...");
        logout();
    }
};

const concluirServico = async (id) => {
  try {
    const token = localStorage.getItem('token');
    
    await axios.patch(`${apiURL}/agendamentos/concluir/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Serviço finalizado! 😎");
    buscarTodaAgenda(); // Isso recarrega a lista
    
  } catch (err) {
    console.error("Erro detalhado:", err.response?.data || err.message);
    alert("Não foi possível finalizar: " + (err.response?.data?.error || "Erro de conexão"));
  }
};

const logout = () => {
    localStorage.removeItem('token');
    router.push('/');
};

onMounted(buscarTodaAgenda);
</script>

<style scoped>
/* Importando uma fonte mais moderna */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

.admin-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: 'Poppins', sans-serif;
    background-color: #f4f7f6;
    min-height: 100vh;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #1a1a1a;
    padding: 20px 30px;
    border-radius: 15px;
    color: white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;
}

.logo-area h2 {
    margin: 0;
    font-weight: 600;
    letter-spacing: 1px;
}

.badge {
    background: #f1c40f;
    color: #000;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
    margin-left: 10px;
}

.btn-logout {
    background: transparent;
    border: 1px solid #ff4757;
    color: #ff4757;
    padding: 8px 18px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;
}

.btn-logout:hover {
    background: #ff4757;
    color: white;
}

/* Cards de Estatísticas */
.grid-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: white;
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    border-bottom: 4px solid #f1c40f;
}

.stat-card h3 {
    color: #7f8c8d;
    font-size: 14px;
    margin-bottom: 10px;
    text-transform: uppercase;
}

.numero {
    font-size: 36px;
    font-weight: 600;
    color: #2c3e50;
}

/* Tabela Moderna */
.agenda-section {
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.admin-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
    /* Dá espaço entre as linhas */
}

.admin-table th {
    color: #95a5a6;
    font-weight: 400;
    text-align: left;
    padding: 10px 20px;
}

.admin-table tbody tr {
    background-color: #ffffff;
    transition: transform 0.2s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}

.admin-table tbody tr:hover {
    transform: scale(1.01);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.admin-table td {
    padding: 20px;
    background: white;
}

.admin-table td:first-child {
    border-radius: 10px 0 0 10px;
}

.admin-table td:last-child {
    border-radius: 0 10px 10px 0;
}

.cliente-nome {
    font-weight: 600;
    color: #2c3e50;
    display: block;
}

.servico-desc {
    color: #7f8c8d;
    font-size: 14px;
}

.status-tag {
    background: #e1f5fe;
    color: #039be5;
    padding: 5px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
}

.btn-check {
    background: #27ae60;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
}
.status-pendente { 
  background: #fff4e6 !important; 
  color: #d97706 !important; 
}

.status-ok { 
  background: #dcfce7 !important; 
  color: #166534 !important; 
  text-transform: uppercase;
  font-size: 10px;
}
</style>