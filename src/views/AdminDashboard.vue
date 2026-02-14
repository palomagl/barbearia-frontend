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
                <h3>Agendamentos Ativos</h3>
                <p class="numero">{{ agendamentosAtivos.length }}</p>
            </div>
            
            <div class="stat-card faturamento-card">
                <h3>Faturamento Total</h3>
                <p class="numero">R$ {{ totalFaturamento.toFixed(2) }}</p>
            </div>
        </div>

        <div class="agenda-section">
            <h3>Agenda Geral</h3>
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Cliente</th>
                        <th>Serviço</th>
                        <th>Data/Hora</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in agenda" :key="item.id">
                        <td>
                            <span :class="['status-tag', item.status === 'concluido' ? 'status-ok' : 'status-pendente']">
                                {{ item.status || 'pendente' }}
                            </span>
                        </td>
                        <td>
                            <span class="cliente-nome">{{ item.cliente_nome }}</span>
                        </td>
                        <td>
                            <span class="servico-desc">{{ item.descricao }}</span>
                        </td>
                        <td>{{ formatarData(item.data_hora) }}</td>
                        <td>
                            <div class="acoes-wrapper">
                                <template v-if="item.status !== 'concluido'">
                                    <button @click="concluirServico(item.id)" class="btn-check" title="Finalizar Serviço">
                                        Finalizar
                                    </button>
                                    
                                    <button @click="enviarMensagemWhats(item)" class="btn-whats" title="Enviar Lembrete">
                                        📱 WhatsApp
                                    </button>
                                </template>
                                <span v-else class="concluido-label">✅ Pago</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const apiURL = 'https://barbearia-backend-f6kd.onrender.com';
const agenda = ref([]);
const router = useRouter();

// LÓGICA DE FATURAMENTO
const totalFaturamento = computed(() => {
    return agenda.value
        .filter(item => item.status === 'concluido')
        .reduce((acc, item) => {
            const valorExtraido = item.descricao.match(/R\$\s?(\d+,\d+)/);
            const preco = valorExtraido ? parseFloat(valorExtraido[1].replace(',', '.')) : 0;
            return acc + preco;
        }, 0);
});

const agendamentosAtivos = computed(() => {
    return agenda.value.filter(item => item.status !== 'concluido');
});

const buscarTodaAgenda = async () => {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${apiURL}/agendamentos/admin/todos`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        agenda.value = res.data;
    } catch (err) {
        logout();
    }
};

const concluirServico = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await axios.patch(`${apiURL}/agendamentos/concluir/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        Swal.fire({
            icon: 'success',
            title: 'Serviço Finalizado!',
            text: 'O faturamento foi atualizado.',
            confirmButtonColor: '#27ae60'
        });
        
        buscarTodaAgenda(); 
    } catch (err) {
        Swal.fire('Erro', 'Não foi possível finalizar o serviço.', 'error');
    }
};

// NOVA FUNÇÃO: WHATSAPP
const enviarMensagemWhats = (item) => {
    const fone = item.cliente_telefone;
    
    if (!fone) {
        Swal.fire('Sem Telefone', 'Este cliente não cadastrou WhatsApp.', 'warning');
        return;
    }

    // Limpeza do número
    const foneLimpo = fone.replace(/\D/g, '');
    const numeroFinal = foneLimpo.startsWith('55') ? foneLimpo : `55${foneLimpo}`;

    const mensagem = encodeURIComponent(
        `Olá ${item.cliente_nome}! 💈 Passando para confirmar seu horário de ${item.descricao} no dia ${formatarData(item.data_hora)}. Confirmado?`
    );
    
    window.open(`https://api.whatsapp.com/send?phone=${numeroFinal}&text=${mensagem}`, '_blank');
};

const formatarData = (data) => new Date(data).toLocaleString('pt-BR');

const logout = () => {
    localStorage.removeItem('token');
    router.push('/');
};

onMounted(buscarTodaAgenda);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

/* Seus estilos base mantidos */
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

.logo-area h2 { margin: 0; font-weight: 600; }
.badge { background: #f1c40f; color: #000; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-left: 10px; }

.grid-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
.stat-card { background: white; padding: 25px; border-radius: 15px; border-bottom: 4px solid #f1c40f; }
.numero { font-size: 36px; font-weight: 600; color: #2c3e50; }

.agenda-section { background: white; padding: 30px; border-radius: 15px; }
.admin-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; }
.admin-table th { color: #95a5a6; font-weight: 400; text-align: left; padding: 10px 20px; }
.admin-table td { padding: 20px; background: white; }

/* Estilização das Ações */
.acoes-wrapper {
    display: flex;
    gap: 8px;
    align-items: center;
}

.btn-check {
    background: #27ae60;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: 0.2s;
}

.btn-whats {
    background: #25d366;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: 0.2s;
}

.btn-whats:hover { background: #128c7e; transform: translateY(-2px); }
.btn-check:hover { background: #1e8449; transform: translateY(-2px); }

.status-tag { padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.status-pendente { background: #fff4e6; color: #d97706; }
.status-ok { background: #dcfce7; color: #166534; }

.btn-logout { background: transparent; border: 1px solid #ff4757; color: #ff4757; padding: 8px 18px; border-radius: 8px; cursor: pointer; }
.btn-logout:hover { background: #ff4757; color: white; }
.concluido-label { color: #27ae60; font-weight: bold; }
</style>