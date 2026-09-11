<template>
  <div class="shell">
    <header class="topbar">
      <div class="brand">
        <span class="hallmark">💈</span>
        <span class="wordmark">BarberShop</span>
        <span class="engraved-label brand__role">Área do Cliente</span>
      </div>
      <button class="btn btn--ghost btn--sm" @click="logout">Sair</button>
    </header>

    <main class="plate-grid">
      <!-- ============ Booking card ============ -->
      <section class="card booking">
        <h1 class="card__title">Reservar um horário</h1>
        <p class="card__sub">Escolha o serviço, o dia e a hora.</p>

        <!-- struck record of resolved choices -->
        <dl class="record">
          <div class="record__row" :class="{ 'is-set': novoAgendamento.descricao }">
            <dt class="engraved-label">Serviço</dt>
            <dd>{{ nomeServico || '—' }}</dd>
          </div>
          <div class="record__row" :class="{ 'is-set': dataSelecionada }">
            <dt class="engraved-label">Dia</dt>
            <dd class="tnum">{{ dataSelecionada ? formatarDiaLongo(dataSelecionada) : '—' }}</dd>
          </div>
          <div class="record__row" :class="{ 'is-set': novoAgendamento.hora }">
            <dt class="engraved-label">Hora</dt>
            <dd class="tnum">{{ novoAgendamento.hora || '—' }}</dd>
          </div>
        </dl>

        <hr class="rule" />

        <fieldset class="step">
          <legend class="engraved-label">1 &nbsp;·&nbsp; Serviço</legend>
          <div class="options">
            <label
              v-for="s in servicos"
              :key="s.value"
              class="option"
              :class="{ selected: novoAgendamento.descricao === s.value }"
            >
              <input type="radio" name="servico" :value="s.value" v-model="novoAgendamento.descricao" />
              <span class="option__name">{{ s.nome }}</span>
              <span class="option__price tnum">{{ s.preco }}</span>
            </label>
          </div>
        </fieldset>

        <fieldset class="step">
          <legend class="engraved-label">2 &nbsp;·&nbsp; Dia</legend>
          <input class="date-input tnum" type="date" v-model="dataSelecionada" :min="diaMinimo" />
        </fieldset>

        <fieldset v-if="dataSelecionada" class="step">
          <legend class="engraved-label">3 &nbsp;·&nbsp; Hora</legend>
          <div v-if="horariosDisponiveis.length" class="timeplate">
            <button
              v-for="hora in horariosDisponiveis"
              :key="hora"
              type="button"
              class="slot tnum"
              :class="{ struck: novoAgendamento.hora === hora }"
              @click="novoAgendamento.hora = hora"
            >
              {{ hora }}
            </button>
          </div>
          <p v-else class="empty-note">Sem horários livres neste dia. Tente outra data.</p>
        </fieldset>

        <button class="btn btn--primary booking__submit" :disabled="!podeAgendar" @click="criarAgendamento">
          Reservar horário
        </button>
      </section>

      <!-- ============ Appointments (tickets) ============ -->
      <section class="card ledger">
        <h2 class="card__title">Meus horários</h2>

        <p v-if="loading" class="empty-note">Carregando…</p>
        <p v-else-if="agendamentos.length === 0" class="empty-note">
          Você ainda não tem horários marcados.
        </p>

        <ul v-else class="tickets">
          <li
            v-for="item in agendamentos"
            :key="item.id"
            class="ticket"
            :class="statusClass(item)"
          >
            <span class="ticket__perf" aria-hidden="true"></span>
            <div class="ticket__body">
              <span class="ticket__service">{{ item.descricao }}</span>
              <span class="ticket__when tnum">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>
                {{ formatarData(item.data_hora) }}
              </span>
            </div>
            <div class="ticket__side">
              <span class="stamp" :class="stampClass(item)">{{ item.status || 'pendente' }}</span>
              <button
                v-if="podeCancelar(item.data_hora) && (item.status === 'pendente' || !item.status)"
                class="btn btn--ghost btn--sm"
                @click="cancelarAgendamento(item.id)"
              >
                Cancelar
              </button>
            </div>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import Swal from 'sweetalert2';

  const apiURL = 'https://barbearia-backend-f6kd.onrender.com';
  const router = useRouter();
  const agendamentos = ref([]);
  const loading = ref(true);

  const dataSelecionada = ref('');
  const novoAgendamento = ref({
    descricao: '',
    hora: ''
  });

  // Menu fixo de serviços (o value continua igual ao que o backend espera)
  const servicos = [
    { nome: 'Corte Degradê', preco: 'R$ 45,00', value: 'Corte Degradê - R$ 45,00' },
    { nome: 'Barba Terapia', preco: 'R$ 35,00', value: 'Barba Terapia - R$ 35,00' },
    { nome: 'Combo (Corte + Barba)', preco: 'R$ 70,00', value: 'Combo (Corte + Barba) - R$ 70,00' }
  ];

  const listaHorarios = ref([
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
  ]);

  const nomeServico = computed(() => {
    const s = servicos.find(s => s.value === novoAgendamento.value.descricao);
    return s ? `${s.nome} · ${s.preco}` : '';
  });

  // Esconde horários que já passaram quando o dia escolhido é hoje.
  // Só filtra a lista visível — não muda nenhuma chamada de API.
  const horariosDisponiveis = computed(() => {
    if (!dataSelecionada.value) return [];
    const agora = new Date();
    const hojeStr = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`;
    if (dataSelecionada.value !== hojeStr) return listaHorarios.value;
    return listaHorarios.value.filter(h => {
      const [hh, mm] = h.split(':').map(Number);
      const alvo = new Date();
      alvo.setHours(hh, mm, 0, 0);
      return alvo.getTime() > agora.getTime();
    });
  });

  // Se o horário escolhido sumir da lista (troca de dia), limpa a seleção.
  watch(horariosDisponiveis, (lista) => {
    if (novoAgendamento.value.hora && !lista.includes(novoAgendamento.value.hora)) {
      novoAgendamento.value.hora = '';
    }
  });

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

        Swal.fire({
        title: 'Reservado!',
        text: 'Seu horário foi agendado com sucesso. Te esperamos lá! ✂️',
        icon: 'success',
        confirmButtonColor: '#10b981',
        });
        dataSelecionada.value = '';
        novoAgendamento.value = { descricao: '', hora: '' };
        buscarAgendamentos();
    } catch (err) {
        Swal.fire({
            title: 'Ops!',
            text: err.response?.data?.error || "Não conseguimos marcar seu horário.",
            icon: 'error',
            confirmButtonColor: '#ef4444',
        });
    }
  };

  const podeCancelar = (dataHora) => {
    const agora = new Date();
    const horarioAgendado = new Date(dataHora);
    const diffEmHoras = (horarioAgendado - agora) / (1000 * 60 * 60);
    return diffEmHoras >= 2;
};

// Função que chama o backend para deletar
const cancelarAgendamento = async (id) => {
    const confirmacao = await Swal.fire({
        title: 'Quer mesmo cancelar?',
        text: "Essa vaga ficará disponível para outro cliente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff4757',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Sim, cancelar',
        cancelButtonText: 'Não, manter'
    });

    if (confirmacao.isConfirmed) {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${apiURL}/agendamentos/cancelar/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire('Cancelado!', 'Seu horário foi removido.', 'success');
            buscarAgendamentos(); // Atualiza a lista
        } catch (err) {
            Swal.fire('Erro', err.response?.data?.error || 'Erro ao cancelar', 'error');
        }
    }
};

  const formatarData = (data) => new Date(data).toLocaleString('pt-BR');

  const formatarDiaLongo = (dateStr) =>
    new Date(`${dateStr}T12:00:00`).toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long'
    });

  const statusClass = (item) => `is-${item.status || 'pendente'}`;
  const stampClass = (item) => {
    if (item.status === 'concluido') return 'stamp--done';
    if (item.status === 'cancelado') return 'stamp--void';
    return 'stamp--open';
  };

  const logout = () => { localStorage.removeItem('token'); router.push('/'); };

  onMounted(buscarAgendamentos);
</script>

<style scoped>
.shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 2rem);
}

/* ---- masthead ---- */
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

/* ---- layout ---- */
.plate-grid {
  display: grid;
  grid-template-columns: minmax(0, 400px) minmax(0, 560px);
  justify-content: center;
  gap: clamp(1rem, 3vw, 2rem);
  align-items: start;
}
@media (max-width: 980px) {
  .plate-grid { grid-template-columns: minmax(0, 460px); }
}

.booking,
.ledger { padding: clamp(1.5rem, 4vw, 2rem); }

/* ---- struck record ---- */
.record {
  margin-top: 1.25rem;
  display: grid;
  gap: 0;
}
.record__row {
  display: flex;
  align-items: baseline;
  gap: 0.85rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--steel-faint);
}
.record__row:first-child { border-top: 1px solid var(--steel-faint); }
.record__row dt { flex: none; width: 4.5rem; }
.record__row dd {
  font-family: var(--font-engraved);
  font-size: 1.02rem;
  color: var(--steel);
  position: relative;
}
.record__row.is-set dd {
  color: var(--ink);
}
.record__row.is-set dd::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.15em;
  height: 1px;
  background: var(--crimson);
  transform: scaleX(1);
  transform-origin: left;
  animation: strike 0.4s var(--ease);
}
@keyframes strike {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.rule { margin: 1.25rem 0; }

/* ---- steps ---- */
.step { margin-bottom: 1.5rem; }
.step > legend { margin-bottom: 0.6rem; }

.options { display: grid; gap: 0.5rem; }
.option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.85rem;
  background: var(--paper-deep);
  border: 1px solid var(--steel-line);
  border-radius: 2px;
  cursor: pointer;
  transition: border-color 0.16s var(--ease), background-color 0.16s var(--ease);
}
.option:hover { border-color: var(--ink-soft); }
.option input { position: absolute; opacity: 0; pointer-events: none; }
.option__name { flex: 1; font-weight: 500; }
.option__price {
  font-family: var(--font-engraved);
  color: var(--ink-soft);
  font-size: 0.95rem;
}
.option.selected {
  border-color: var(--crimson);
  background: var(--paper);
  box-shadow: inset 0 0 0 1px var(--crimson);
}
.option.selected .option__price { color: var(--crimson-deep); }

.date-input {
  color-scheme: light;
  cursor: pointer;
}

/* ---- time plate ---- */
.timeplate {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: var(--paper);
  border: 1px solid var(--steel-line);
}
@media (min-width: 560px) {
  .timeplate { grid-template-columns: repeat(4, 1fr); }
}
.slot {
  appearance: none;
  border: 0;
  border-right: 1px solid var(--steel-faint);
  border-bottom: 1px solid var(--steel-faint);
  background: var(--paper);
  color: var(--ink);
  padding: 0.85rem 0.25rem;
  min-height: 46px;
  font-size: 0.92rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  position: relative;
  transition: color 0.14s var(--ease), background-color 0.14s var(--ease);
}
.slot:hover { color: var(--crimson-deep); background: var(--paper-deep); }
.slot.struck {
  background: var(--struck);
  box-shadow: var(--shadow-struck);
  color: var(--ink);
}
.slot.struck::after {
  content: "";
  position: absolute;
  left: 0.85rem;
  right: 0.85rem;
  bottom: 0.5rem;
  height: 2px;
  background: var(--crimson);
  transform-origin: left;
  animation: strike 0.35s var(--ease);
}

.booking__submit {
  width: 100%;
  margin-top: 0.5rem;
}

/* ---- tickets ---- */
.tickets {
  list-style: none;
  margin: 1.25rem 0 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}
.ticket {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1rem 1.1rem;
  background: var(--paper-deep);
  border: 1px solid var(--steel-line);
}
.ticket__perf {
  position: absolute;
  left: 0;
  top: -1px;
  bottom: -1px;
  width: 10px;
  background-image: radial-gradient(circle at 0 50%, transparent 0 3px, var(--steel-line) 3px 4px, transparent 4px);
  background-size: 10px 12px;
  background-repeat: repeat-y;
}
.ticket__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding-left: 0.5rem;
}
.ticket__service {
  font-family: var(--font-engraved);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--ink);
}
.ticket__when {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: var(--ink-soft);
}
.ticket__when svg { width: 15px; height: 15px; flex: none; }
.ticket__side {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.ticket.is-concluido { opacity: 0.72; }
.ticket.is-cancelado .ticket__service { text-decoration: line-through; color: var(--steel); }
.stamp--void { color: var(--steel); border-color: var(--steel-faint); text-decoration: line-through; }

/* narrow / single-column: stack the ticket so the service name never wraps mid-price */
@media (max-width: 980px) {
  .ticket { flex-direction: column; align-items: flex-start; gap: 0.7rem; }
  .ticket__side { width: 100%; justify-content: space-between; }
}
</style>
