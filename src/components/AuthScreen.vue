<template>
  <div class="auth-screen">
    <!-- ============ Brand panel — hidden on narrow screens ============ -->
    <aside class="brand-panel">
      <div class="brand-panel__scrim"></div>
      <div class="brand-panel__content">
        <header class="masthead">
          <span class="hallmark hallmark--lg"><BrandMark /></span>
          <span class="wordmark wordmark--lg">BarberShop</span>
        </header>

        <div class="brand-panel__pitch">
          <p class="brand-panel__kicker engraved-label">Salão &middot; Barbearia premium</p>
          <h1 class="brand-panel__headline">
            A arte do <em>cuidado</em> começa aqui.
          </h1>
          <p class="brand-panel__sub">
            Agende seu horário em poucos cliques e garanta um atendimento
            à altura do seu estilo — sem filas, sem complicação.
          </p>
        </div>

        <ul class="brand-panel__features">
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>
            Agendamento 100% online
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15.5a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5a2 2 0 0 1 2-2h2.2a1 1 0 0 1 1 .84l.7 3.2a1 1 0 0 1-.29.95L8.1 9.9a13 13 0 0 0 6 6l1.9-1.9a1 1 0 0 1 .95-.28l3.2.7a1 1 0 0 1 .85 1z"/></svg>
            Lembrete automático no WhatsApp
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5l2.6 5.7 6.2.6-4.7 4.2 1.4 6.1L12 16l-5.5 3.1 1.4-6.1-4.7-4.2 6.2-.6z"/></svg>
            Atendimento premium, sem correria
          </li>
        </ul>
      </div>
    </aside>

    <!-- ============ Form column ============ -->
    <div class="form-panel">
      <slot />
    </div>
  </div>
</template>

<script setup>
// Layout puro — o formulário em si (Login/Register) entra pelo slot.
import BrandMark from './BrandMark.vue';
</script>

<style scoped>
.auth-screen {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
}

/* ---- brand panel: photo + scrim + pitch ---- */
.brand-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  padding: clamp(2rem, 4vw, 4rem);
  background-image: url('/images/barbershop-hero.webp');
  background-size: cover;
  background-position: center 35%;
}
.brand-panel__scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(12, 11, 9, 0.55) 0%, rgba(12, 11, 9, 0.72) 45%, rgba(12, 11, 9, 0.94) 100%),
    linear-gradient(90deg, rgba(12, 11, 9, 0.35), transparent 55%);
}
.brand-panel__content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(2rem, 6vh, 4rem);
  min-height: 100%;
  color: var(--ink);
}

.masthead { display: flex; align-items: center; gap: 0.85rem; }
.hallmark--lg {
  width: 42px;
  height: 42px;
  background: rgba(12, 11, 9, 0.55);
  backdrop-filter: blur(2px);
}
.hallmark--lg svg {
  width: 20px;
  height: 20px;
}
.wordmark--lg { font-size: 1.55rem; }

.brand-panel__pitch { max-width: 30rem; }
.brand-panel__kicker { color: var(--gold-soft); margin-bottom: 0.9rem; }
.brand-panel__headline {
  font-family: var(--font-engraved);
  font-weight: 700;
  font-size: clamp(2rem, 3.4vw, 2.9rem);
  line-height: 1.12;
  letter-spacing: -0.01em;
  color: var(--ink);
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.35);
}
.brand-panel__headline em {
  font-style: italic;
  color: var(--gold-soft);
}
.brand-panel__sub {
  margin-top: 1rem;
  color: var(--ink-soft);
  font-size: 1.02rem;
  line-height: 1.6;
  max-width: 26rem;
}

.brand-panel__features {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.9rem;
}
.brand-panel__features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--ink);
}
.brand-panel__features svg {
  width: 19px;
  height: 19px;
  flex: none;
  color: var(--gold);
}

/* ---- form column ---- */
.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 4vw, 3rem);
  background: var(--page);
}

/* Below this, the brand panel steps aside and the form takes the full
   screen — this is the layout that was already approved for mobile. */
@media (max-width: 900px) {
  .auth-screen { grid-template-columns: 1fr; }
  .brand-panel { display: none; }
}
</style>
