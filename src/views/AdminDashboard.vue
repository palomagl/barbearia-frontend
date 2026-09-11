<template>
  <div class="shell">
    <header class="topbar">
      <div class="brand">
        <span class="hallmark"><BrandMark /></span>
        <span class="wordmark">BarberShop</span>
        <span class="engraved-label brand__role">Livro do Barbeiro</span>
      </div>
      <button class="btn btn--ghost btn--sm" @click="logout">Sair</button>
    </header>

    <!-- ============ KPIs ============ -->
    <section class="stats-grid">
      <div class="stat-card">
        <span class="stat-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>
        </span>
        <span class="engraved-label">Ativos</span>
        <span class="stat-card__val tnum">{{ agendamentosAtivos.length }}</span>
      </div>

      <div class="stat-card">
        <span class="stat-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>
        </span>
        <span class="engraved-label">Concluídos</span>
        <span class="stat-card__val tnum">{{ concluidos.length }}</span>
      </div>

      <div class="stat-card">
        <span class="stat-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </span>
        <span class="engraved-label">Clientes</span>
        <span class="stat-card__val tnum">{{ clientesUnicos }}</span>
      </div>

      <div class="stat-card">
        <span class="stat-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5.5H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6"/></svg>
        </span>
        <span class="engraved-label">Faturamento</span>
        <span class="stat-card__val stat-card__val--money tnum">R$ {{ totalFaturamento.toFixed(2).replace('.', ',') }}</span>
      </div>

      <div class="stat-card">
        <span class="stat-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>
        </span>
        <span class="engraved-label">Ticket médio</span>
        <span class="stat-card__val tnum">R$ {{ ticketMedio.toFixed(2).replace('.', ',') }}</span>
      </div>
    </section>

    <!-- ============ Ranking de serviços ============ -->
    <section v-if="servicosRanking.length" class="card chart-card">
      <h2 class="card__title chart-card__title">Serviços mais agendados</h2>
      <p class="card__sub">Com base em todos os agendamentos já feitos.</p>

      <ul class="bars">
        <li v-for="s in servicosRanking" :key="s.nome" class="bars__row">
          <span class="bars__label">{{ s.nome }}</span>
          <span class="bars__track">
            <span class="bars__fill" :style="{ width: s.pct + '%' }"></span>
          </span>
          <span class="bars__val tnum">{{ s.qtd }}</span>
        </li>
      </ul>
    </section>

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
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { apiURL } from '../config/api';
import BrandMark from '../components/BrandMark.vue';

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

const concluidos = computed(() => agenda.value.filter(item => item.status === 'concluido'));

const clientesUnicos = computed(() => new Set(agenda.value.map(item => item.usuario_id)).size);

const ticketMedio = computed(() => {
    if (!concluidos.value.length) return 0;
    return totalFaturamento.value / concluidos.value.length;
});

// Extrai só o nome do serviço, sem o preço (ex: "Corte Degradê - R$ 45,00" -> "Corte Degradê")
const nomeServico = (descricao) => descricao.split(/\s*-\s*R\$/)[0].trim();

const servicosRanking = computed(() => {
    const contagem = {};
    agenda.value.forEach(item => {
        const nome = nomeServico(item.descricao || 'Outro');
        contagem[nome] = (contagem[nome] || 0) + 1;
    });

    const linhas = Object.entries(contagem).map(([nome, qtd]) => ({ nome, qtd }));
    const maior = Math.max(1, ...linhas.map(l => l.qtd));

    return linhas
        .map(l => ({ ...l, pct: Math.round((l.qtd / maior) * 100) }))
        .sort((a, b) => b.qtd - a.qtd)
        .slice(0, 5);
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
            confirmButtonColor: '#c9a227'
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
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 2rem);
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.5rem 1.25rem;
  border-bottom: 1px solid var(--bronze-line);
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
  border-left: 1px solid var(--bronze-line);
  font-size: 10px;
}

/* ---- KPI cards ---- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: clamp(0.75rem, 2vw, 1rem);
  margin-bottom: clamp(1.25rem, 3vw, 1.75rem);
}
.stat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.1rem 1.15rem;
  background: var(--paper);
  border: 1px solid var(--bronze-line);
  border-radius: var(--radius);
}
.stat-card__icon {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  margin-bottom: 0.15rem;
  border-radius: 999px;
  background: rgba(201, 162, 39, 0.1);
  color: var(--gold);
}
.stat-card__icon svg { width: 16px; height: 16px; }
.stat-card__val {
  font-family: var(--font-engraved);
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--ink);
  line-height: 1;
}
.stat-card__val--money { color: var(--gold-soft); }

/* ---- ranking de serviços ---- */
.chart-card {
  padding: clamp(1.5rem, 4vw, 2.25rem);
  margin-bottom: clamp(1.25rem, 3vw, 1.75rem);
}
.chart-card__title { font-size: 1.3rem; }

.bars {
  list-style: none;
  margin: 1.5rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.9rem;
}
.bars__row {
  display: grid;
  grid-template-columns: minmax(0, 13rem) 1fr auto;
  align-items: center;
  gap: 0.85rem;
}
.bars__label {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--ink-soft);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bars__track {
  height: 10px;
  background: var(--bronze-faint);
  border-radius: 999px;
  overflow: hidden;
}
.bars__fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--gold-deep), var(--gold-soft));
  border-radius: 999px;
  transition: width 0.4s var(--ease);
}
.bars__val {
  min-width: 1.5rem;
  text-align: right;
  font-weight: 600;
  color: var(--ink);
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
  border-bottom: 1px solid var(--bronze-line);
}
.daybook tbody td {
  padding: 0.85rem 0.75rem;
  border-bottom: 1px solid var(--bronze-faint);
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

/* ---- responsive: table folds into engraved slips ---- */
@media (max-width: 860px) {
  .daybook-wrap { overflow-x: visible; }
  .daybook thead { display: none; }
  .daybook,
  .daybook tbody,
  .daybook tr,
  .daybook td { display: block; width: 100%; }
  .daybook tbody tr {
    border: 1px solid var(--bronze-line);
    padding: 0.4rem 0.9rem;
    margin-bottom: 0.9rem;
  }
  .daybook tbody td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--bronze-faint);
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
  .bars__row { grid-template-columns: minmax(0, 6rem) 1fr auto; }
}
</style>
