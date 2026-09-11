<template>
  <div class="shell">
    <header class="topbar">
      <div class="brand">
        <span class="hallmark">💈</span>
        <span class="wordmark">BarberShop</span>
        <span class="engraved-label brand__role">Livro do Barbeiro</span>
      </div>
      <button class="btn btn--ghost btn--sm" @click="logout">Sair</button>
    </header>

    <main class="card ledgerbook">
      <h1 class="card__title">Agenda geral</h1>
      <p class="card__sub">Todos os horários, do mais próximo ao mais distante.</p>

      <div class="daybook-wrap">
        <table class="daybook">
          <thead>
            <tr>
              <th class="engraved-label">Status</th>
              <th class="engraved-label">Cliente</th>
              <th class="engraved-label">Serviço</th>
              <th class="engraved-label">Data / Hora</th>
              <th class="engraved-label">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in agenda" :key="item.id" :class="{ 'is-done': item.status === 'concluido' }">
              <td data-col="Status">
                <span class="stamp" :class="item.status === 'concluido' ? 'stamp--done' : 'stamp--open'">
                  {{ item.status || 'pendente' }}
                </span>
              </td>
              <td data-col="Cliente"><span class="client">{{ item.cliente_nome }}</span></td>
              <td data-col="Serviço">{{ item.descricao }}</td>
              <td data-col="Data / Hora" class="tnum nowrap">{{ formatarData(item.data_hora) }}</td>
              <td data-col="Ações">
                <div v-if="item.status !== 'concluido'" class="row-actions">
                  <button class="btn btn--primary btn--sm" @click="concluirServico(item.id)">Finalizar</button>
                  <button class="btn btn--ghost btn--sm" @click="enviarMensagemWhats(item)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15.5a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5a2 2 0 0 1 2-2h2.2a1 1 0 0 1 1 .84l.7 3.2a1 1 0 0 1-.29.95L8.1 9.9a13 13 0 0 0 6 6l1.9-1.9a1 1 0 0 1 .95-.28l3.2.7a1 1 0 0 1 .85 1z"/></svg>
                    Lembrete
                  </button>
                </div>
                <span v-else class="engraved-label">Pago</span>
              </td>
            </tr>
            <tr v-if="agenda.length === 0">
              <td colspan="5" class="empty-cell">
                <span class="empty-note">Nenhum agendamento na agenda ainda.</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr class="rule rule--double" />

      <div class="cashup">
        <div class="cashup__item">
          <span class="engraved-label">Agendamentos ativos</span>
          <span class="cashup__val tnum">{{ agendamentosAtivos.length }}</span>
        </div>
        <div class="cashup__sep" aria-hidden="true"></div>
        <div class="cashup__item">
          <span class="engraved-label">Faturamento</span>
          <span class="cashup__val cashup__val--money tnum">R$ {{ totalFaturamento.toFixed(2).replace('.', ',') }}</span>
        </div>
      </div>
    </main>
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
.shell {
  max-width: 1080px;
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 2rem);
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.5rem 1.25rem;
  border-bottom: 1px solid var(--steel-line);
  margin-bottom: clamp(1.25rem, 3vw, 2rem);
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}
.brand__role {
  padding-left: 0.7rem;
  border-left: 1px solid var(--steel-line);
  font-size: 10px;
}

.ledgerbook { padding: clamp(1.5rem, 4vw, 2.25rem); }

.daybook-wrap {
  margin-top: 1.5rem;
  overflow-x: auto;
}

.daybook {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.daybook thead th {
  text-align: left;
  padding: 0 0.75rem 0.6rem;
  border-bottom: 1px solid var(--steel-line);
}
.daybook tbody td {
  padding: 0.85rem 0.75rem;
  border-bottom: 1px solid var(--steel-faint);
  vertical-align: middle;
}
.daybook tbody tr:last-child td { border-bottom: 0; }
.daybook tbody tr.is-done { color: var(--ink-soft); }

.client {
  font-family: var(--font-engraved);
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
}
.nowrap { white-space: nowrap; }

.row-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.empty-cell { padding: 2rem 0.75rem; text-align: center; }

/* ---- cash-up: the till tallied at the foot ---- */
.rule--double { margin: 1.5rem 0; }
.cashup {
  display: flex;
  align-items: stretch;
  gap: clamp(1rem, 4vw, 3rem);
}
.cashup__item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.cashup__sep { width: 1px; background: var(--steel-faint); }
.cashup__val {
  font-family: var(--font-engraved);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--ink);
  line-height: 1;
}
.cashup__val--money { color: var(--crimson-deep); }

/* ---- responsive: table folds into engraved slips ---- */
@media (max-width: 860px) {
  .daybook-wrap { overflow-x: visible; }
  .daybook thead { display: none; }
  .daybook,
  .daybook tbody,
  .daybook tr,
  .daybook td { display: block; width: 100%; }
  .daybook tbody tr {
    border: 1px solid var(--steel-line);
    padding: 0.4rem 0.9rem;
    margin-bottom: 0.9rem;
  }
  .daybook tbody td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--steel-faint);
  }
  .daybook tbody tr td:last-child { border-bottom: 0; }
  .daybook tbody td::before {
    content: attr(data-col);
    font-family: var(--font-ui);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--label);
    flex: none;
  }
  .daybook tbody td[data-col="Serviço"] { text-align: right; }
  .row-actions { justify-content: flex-end; }
  .empty-cell::before { display: none; }
  .cashup { flex-direction: column; gap: 1rem; }
  .cashup__sep { width: auto; height: 1px; }
}
</style>
