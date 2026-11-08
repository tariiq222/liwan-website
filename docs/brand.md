# Brand guide (website copy)

The website's copy of the LiwanOS identity, as of 2026-11-08.

**Source.** The identity belongs to the product repository `tariiq222/liwan`. This file copies
its values from branch `codex/web-identity-tokens` at commit `1171fd29`, which is not merged into
the product's `main` yet:

- `packages/ui/app/assets/css/tokens.css`
- `packages/ui/app/assets/css/app-identity.css`

If the product changes a value, the product wins. Update this file and record the new commit.
Never change a value here first.

**Status on the site.** This guide is the single source for how the site looks. Since
2026-11-08 every page uses it. Where `docs/decisions/2026-11-07-site-design.md` still names
lavender, sand backgrounds or gradients, this guide wins.

## In code

- `src/styles/tokens.css` holds every value below as a token. Components read roles, not hex
  values: `--accent` (ink), `--on-accent`, `--bg`, `--surface`, `--surface-muted`, `--text`,
  `--text-mid`, `--text-muted`, `--border`, the status tokens, `--font-display` and the radius
  tokens `--radius-sm` (8), `--radius` (12), `--radius-card` (18), `--radius-lg` (24).
- `src/lib/app-color.ts` gives an application's tile, text-on-tile and button colours from its
  `slug` and `plan`. Use it for every application icon, dot and button.
- `/brand-kit/` (not linked, noindex) shows all of this.

## Mark and pattern

The site uses the mark only. The Sadu pattern is not used on the site (owner, 2026-11-08); its
files stay in `public/brand/sadu` as copies from the product. The mark (`src/brand/mark.ts`) and
the Sadu pattern (`public/brand/sadu`)
are copies from the product. Never redraw or edit them here; see `src/brand/SOURCE.md`.

## Colour

### Brand ink

| Role | Light | Dark |
|---|---|---|
| Brand ink: primary buttons, titles, numbers, free-app tiles | `#14102a` | `#f3f3f6` |
| Text on ink | `#ffffff` | `#0a0a0c` |
| Ink hover | `#2b2545` | n/a |
| Ink pressed | `#3a3550` | n/a |

Lavender is no longer a brand colour. Do not use it for buttons, links or accents.

### Neutrals

| Role | Light | Dark |
|---|---|---|
| Page background | `#ffffff` | `#27272e` |
| Muted surface (chips, table heads, inputs) | `#f4f4f5` | `#2f2f37` |
| Hairline border | `#e8e8eb` | `#3a3a44` |
| Main text | `#14102a` | `#f3f3f6` |
| Mid-tone text | `#3a3550` | n/a |
| Secondary text | `#6b6b76` | `#a9a9b5` |

### Status

| Status | Colour |
|---|---|
| Success | `#16a34a` |
| Info | `#1d4ed8` |
| Warning | `#d97706` |
| Error | `#dc2626` |

## Application colours

Every application has one fixed colour. Use it for its icon tile, its dot in lists and its
buttons. Never invent a colour for an application.

**Free applications use the brand ink.** These are Liwan AI, chat, tasks, meetings, documents
and operations. Their tile is ink with a white icon (an inverse icon in dark mode).

**Each paid application has its own colour.** The tile colour sits behind a white icon. The
button shade is a deeper version, so white text on it stays readable.

| Application (`slug`) | Tile, light | Tile, dark | Button |
|---|---|---|---|
| `crm` | `#5b8def` | `#78a3f5` | `#2f62c9` |
| `inbox` | `#2ad67a` | `#3ee08a` | `#15803d` |
| `projects` | `#4f5bd5` | `#7480ee` | `#3d47b8` |
| `hr` | `#e0644f` | `#ef7d6a` | `#c2412d` |
| `finance` | `#1f8a5b` | `#34b07a` | `#166c47` |
| `appointments` | `#8bb513` | `#9fca2a` | `#557309` |

Application names always come from `name` in `src/content/apps`. Only `crm` and `inbox` exist
there today. Show the other paid applications only when they exist in content and are allowed
by `src/config/claims.ts`.

## Type

- **IBM Plex Sans Arabic** is used for all text: body, buttons, navigation, forms, tables.
- **Rubik**, weights 600 to 800, is for large display text only: page titles, the hero
  headline, section titles and big numbers. It is never used for buttons, navigation, tables or
  small text. Rubik falls back to IBM Plex Sans Arabic.
- Numbers use Latin digits everywhere (see `AGENTS.md`).

## Corners

There is one radius system, in four sizes:

| Name | Size | Use |
|---|---|---|
| inner | 8px | Pieces nested inside a control group, small chips |
| control | 12px | Buttons, inputs, icon tiles in the product |
| card | 18px | Cards |
| surface | 24px | Large panels and windows |

The marketing site uses larger tiles in places. For example, the home-page icon strip uses
96px tiles with a 26px radius. Keep those proportions; do not add new radius values.

## Website-specific choices (approved mock, 2026-11-08)

These come from `.mocks/home-v4.html` and apply to the site only, not the product.

- **Hero background.** A light sky gradient that fades to white, with no cloud shapes and no
  white patches:
  `linear-gradient(180deg, #d4e9fb 0%, #e2f0fc 35%, #eff7fe 68%, #f8fbff 88%, #fff 100%)`.
  The headline and buttons on it stay ink. The same sky (`--hero-sky`) sits behind the top of the
  application pages and the pricing page.
- **Buttons.** The primary button is solid ink with white text. The secondary button is white
  with a 1.5px ink border. Buttons are 52px tall, or 38px in the small size.
- **Application icon strip.** Each tile uses its application colour from the table above. The
  strip's ends fade out with a CSS mask (`mask-image`), not with white overlays, so it works in
  both directions and on any background. Leave room under the strip so the tile shadows are not
  cut off.

- **Light only (owner, 2026-11-08).** The site has no dark mode and no theme switch; it always
  shows the light column of the tables above. The dark columns are the product's values, kept
  here for reference.
- **No Sadu (owner, 2026-11-08).** No Sadu bands, motifs or marks on any page, including the
  footer and section titles.

## Language and naming

Naming, digits, claims and copy tone follow the project rules in `AGENTS.md`. This guide does
not repeat them.
