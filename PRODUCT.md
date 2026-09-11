# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two roles, one barbershop:

- **Cliente** — a person who wants a haircut/beard service and books online. On a phone most of the time, often outside business hours, deciding fast between open slots. Jobs: create an account, pick a service, pick a day and time, see their upcoming appointments, cancel when needed.
- **Barbeiro (admin)** — the single shop owner/operator. Uses the admin panel between clients or at day's end. Jobs: see the full agenda in chronological order, mark a service as done, read total revenue from completed services, send a WhatsApp confirmation to a client.

## Product Purpose

Online appointment booking for a local barbershop. Replaces phone/DM back-and-forth with a self-serve flow for clients and a single operational panel for the barber. Success = a client books a valid future slot without conflict, and the barber runs the day and sees revenue from one screen.

## Positioning

Single-shop tool, not a marketplace. Opinionated business rules baked in: no double-booking of a time slot, no booking in the past, client self-cancel only with 2h notice, revenue auto-derived from the price embedded in each service label.

## Operating Context

- Client flow: `/register` → `/` (login) → `/dashboard` (book + list). Auth via JWT stored in `localStorage`; route guards redirect unauthenticated users to `/`.
- Admin flow: login routes `cargo === 'admin'` to `/admin`.
- Fixed service menu with prices in the label text (e.g. "Corte Degradê - R$ 45,00"). Revenue parses `R$ nn,nn` from completed appointments.
- Fixed time-slot grid (09:00–19:00, 30-min steps, lunch gap 12:00–13:00).
- WhatsApp reminders open `api.whatsapp.com` with a prefilled message.
- Backend on Render, Postgres on Neon. Frontend on Vercel (SPA rewrites in `vercel.json`).

## Capabilities and Constraints

- Stack: Vue 3 + Vite, vue-router, axios, SweetAlert2. Pure scoped CSS per `.vue` component (no CSS framework or UI library).
- Redesign must not change API calls, payload shapes, route paths, `localStorage` keys, or business logic. Visual/markup/CSS only.
- Statuses in data: `pendente`, `concluido`, `cancelado` (cancel currently deletes the row).
- Copy stays Portuguese (pt-BR), friendly tone.
- No real backend for account recovery, notifications, or payments — do not imply features that don't exist.

## Brand Commitments

- Name **BarberShop** and the 💈 mark are kept.
- Friendly, encouraging voice ("Te esperamos lá! ✂️", "Bem-vindo de volta!").

## Evidence on Hand

- Working deployed system (Render API responding, Neon connected as of last check).
- No testimonials, customer names, ratings, case studies, or press. Do not fabricate any.
- Author's real contact links live in `README.md` (LinkedIn, WhatsApp) — portfolio attribution, not product content.

## Product Principles

1. **Phone-first for clients.** The booking flow is thumb-driven; the slot grid is the centerpiece.
2. **One screen runs the day.** The admin never needs a second view to operate or to see money.
3. **Rules are visible, not surprising.** Past slots, taken slots, and the 2h cancel window are shown before the user acts, not just rejected after.
4. **Honest scope.** Show only what the backend truly supports.

## Accessibility & Inclusion

No formal standard set. Baseline: legible contrast, real focus states, keyboard-operable slot grid and forms, tap targets ≥ 44px.
