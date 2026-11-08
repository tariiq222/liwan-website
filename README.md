# liwan-website

The public marketing site of LiwanOS (https://liwanos.com). Accounts, trials, payment and
customer data live in the product (https://app.liwanos.com), never here.

## Stack

Astro 7, static output, plain CSS (no UI framework). Arabic is the default locale and the
design is RTL-first; English lives under `/en`. Content collection `apps` (`src/content/apps`)
drives navigation and the application pages.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the build |

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `PRICING_URL` | `https://app.liwanos.com/api/v1/public/pricing` | Product pricing endpoint, read at build time. If it fails, pages show "Contact us" instead of numbers. |

## Where decisions live

- `docs/brand.md`: the visual identity (colours, application colours, type, corners). The only
  source for how the site looks; `src/styles/tokens.css` follows it.
- `docs/decisions/2026-11-07-site-design.md`: approved site decisions (section 1A overrides the rest;
  its colour notes are superseded by `docs/brand.md`).
- `docs/plan.md`: execution plan (its PR1 and PR2 are superseded by the product's package P4c).
- `src/brand/SOURCE.md`: where the brand assets were copied from.

## Rules

- Claims follow the product's claims register. A claim is published only when its state in
  `src/config/claims.ts` is `available`; states change only when the register changes.
- Prices come from the pricing endpoint. They are never hardcoded.
