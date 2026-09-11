# Design — BarberShop

<!-- impeccable:design-schema 1 -->
Recorded from the shipped build (code-led). World: **"Cartão do Gravador"** — an engraved
trade-card. Light, committed, no dark mode.

## Ground & color

Warm ivory stock in three value steps, engraver ink, brushed-steel structure, one
barber-pole crimson as the only signal (committing actions, current selection,
`pendente` stamp, links).

| Token | Value | Role |
|---|---|---|
| `--page` | `#ece5d7` | app background |
| `--paper` | `#f6f1e8` | card face |
| `--paper-deep` | `#ebe3d2` | inputs, option rows, tickets |
| `--struck` | `#e6ddc9` | a claimed / struck time slot |
| `--ink` | `#1c1a17` | primary text |
| `--ink-soft` | `#574f45` | secondary text |
| `--label` | `#5f5849` | engraved SMALL-CAPS labels (≥4.5:1 at 11px) |
| `--steel` | `#8a8578` | hairline rules, icon rest state — never text |
| `--steel-line` / `--steel-faint` | `#b3ac9c` / `#d8d0be` | structural / internal rules |
| `--crimson` / `--crimson-deep` | `#b5231f` / `#8f1611` | signal, hover |

Shadows: `--shadow-raise` (offset + blur) lifts cards; `--shadow-struck` (inset) presses
the selected slot. No zero-blur block shadows.

## Type

- **Display / wordmark / client names / ticket service / dialog titles:** `EB Garamond`
  (Google, loaded in `style.css`), weight 600, letter-spacing ~0.
- **UI / body / controls / values:** `Archivo`, 400–700.
- **Labels:** `.engraved-label` — Archivo 11px, weight 600, `letter-spacing: 0.16em`,
  uppercase, color `--label`.
- Numerals (times, dates, prices, money, counts) carry `.tnum`
  (`font-variant-numeric: tabular-nums`).

## Components

- **`.card`** — `--paper` face, 1px `--steel-line` border, plus an inset 1px
  `--steel-faint` keyline via `::before` (the double engraved frame). `--shadow-raise`.
- **`.hallmark`** — 30px ruled roundel holding the pinned 💈; `.wordmark` "BarberShop"
  in EB Garamond beside it. A masthead SMALL-CAPS role label sits after a 1px divider.
- **`.btn`** — 2px radius. `--primary` = crimson fill / white; `--ghost` = transparent /
  steel border; `--sm` for row actions. Disabled primary = `--paper-deep` / `--steel`.
- **`.field` / `.control`** — `--paper-deep` fill, 1px `--steel-line`, focus =
  crimson border + `inset 0 0 0 1px` crimson. `.reveal` eye toggle, steel → crimson.
- **`.record`** (client) — ruled dt/dd rows; a set value turns `--ink` and gets an
  animated crimson underline (`@keyframes strike`, exponential ease-out).
- **`.timeplate` / `.slot`** — one fixed module, 3-wide (4-wide ≥560px), hairline grid.
  `.struck` = `--struck` fill + `--shadow-struck` + wiping crimson underline. Past slots
  for *today* are filtered out client-side, never shown disabled.
- **`.ticket`** — `--paper-deep` slip with a punched left edge (`radial-gradient`
  `.ticket__perf`), calendar icon, `.stamp` status, ghost Cancelar.
- **`.stamp`** — SMALL-CAPS 10px in a 1px box. `--open` crimson, `--done` steel,
  `--void` steel + strike-through.
- **`.daybook`** (admin) — hairline-ruled ledger; folds to bordered per-row slips
  ≤720px via `td[data-col]::before`. Closes with `.rule--double` then `.cashup`
  (the till tallied at the foot — two figures, not hero cards).
- **Icons** — authored inline SVG, `stroke-width: 1.5`, `currentColor`. 💈 is brand
  only. SweetAlert2 is themed to the card in `style.css`.

## Motion

One authored moment: the **strike** — selecting a service/day/time animates a crimson
rule in from the left (`scaleX 0→1`, `cubic-bezier(0.16,1,0.3,1)`). Everything else is
short color/border transitions. Full `prefers-reduced-motion` off-switch.

## Browser surfaces

`::selection`, `:focus-visible`, `caret-color`, and scrollbars are all painted from the
palette in `style.css`.

## Scope note

Visual/markup/CSS only. API calls, routes, `localStorage` keys, and business logic are
unchanged from before the redesign. See `.impeccable/surfaces/src-views-dashboard-vue.md`
for the direction contract.
