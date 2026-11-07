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
- Never claim anything that is not `available` in `src/config/claims.ts`. A `soon` claim carries the
  word "soon" (قريبًا); a `hidden` claim appears nowhere. States change only when the product's claims register changes.
- No personal data is stored on this site and no third-party form service is used. The only form
  posts to the product's contact endpoint (`https://app.liwanos.com/api/v1/public/contact`).
- Brand assets (`public/brand/sadu`, `src/brand/mark.ts`) are copies from the product repository.
  Never redraw or edit them here; see `src/brand/SOURCE.md`.
- Never edit the product repository (`tariiq222/liwan`) from this project.
- User-facing copy speaks to the customer in outcome language. Internal labels, caveats and
  implementation notes never appear on a page.
- Decisions: `docs/decisions/2026-11-07-site-design.md` (section 1A overrides the rest).
