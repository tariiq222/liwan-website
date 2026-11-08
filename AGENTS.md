## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project rules

- Arabic is the default locale and the layout is RTL-first. English is complete under `/en`.
- Never hardcode a price. Prices come from the product's pricing endpoint (`src/lib/pricing.ts`);
  on failure the page shows "contact us". For local design work only, the dev server reads
  `fixtures/pricing.sample.json` (the contract's seed shape) when `PRICING_FIXTURE` points at it;
  a production build never reads it.
- Naming (owner, 2026-11-07), the single rule for every page:
  - The product is «منصة ليوان» everywhere it is named: the header, the footer, page titles,
    sharing cards and sentences (`brand.platform` in `src/i18n`). Only the copyright line keeps
    «© ليوان». English: "LiwanOS".
  - The assistant is «ليوان AI». It is part of the platform, not an application, so it never
    takes the word «تطبيق».
  - Every application is «تطبيق …» (for example «تطبيق إدارة العملاء», «تطبيق رسائل العملاء»,
    «تطبيق المهام»), always taken from its `name` in `src/content/apps`, never retyped.
  - «تطبيقاتك كلها في ليوان واحد» keeps «ليوان» as the courtyard image, not the product name.
- Numbers (owner, 2026-11-08): every number uses Latin digits (0–9), Arabic pages included.
  Format numbers and money with `NUMBER_LOCALE` from `src/lib/numbers.ts`; never type Arabic-Indic
  digits (٠–٩) into copy.
- Never claim anything that is not `available` in `src/config/claims.ts`. A `soon` claim carries the
  word "soon" (قريبًا); a `hidden` claim appears nowhere. States change only when the product's claims register changes.
- No personal data is stored on this site and no third-party form service is used. The only form
  posts to the product's contact endpoint (`https://app.liwanos.com/api/v1/public/contact`).
- The site is light only and uses no Sadu pattern (owner, 2026-11-08); see `docs/brand.md`.
- Brand assets (`public/brand/sadu`, `src/brand/mark.ts`) are copies from the product repository.
  Never redraw or edit them here; see `src/brand/SOURCE.md`.
- Never edit the product repository (`tariiq222/liwan`) from this project.
- User-facing copy speaks to the customer in outcome language. Internal labels, caveats and
  implementation notes never appear on a page.
- Visual identity (owner, 2026-11-08): `docs/brand.md` is the single source for colours,
  application colours, type and corners. Pages read tokens from `src/styles/tokens.css` and an
  application's colour from `src/lib/app-color.ts`; never type a brand or application hex value
  into a component. Lavender is no longer a brand colour.
- Decisions: `docs/decisions/2026-11-07-site-design.md` (section 1A overrides the rest; its colour
  notes are superseded by `docs/brand.md`).
