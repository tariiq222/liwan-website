> Note: PR1 and PR2 of this plan are superseded by the product session's package P4c (spec section 1A of docs/decisions/2026-11-07-site-design.md). Prices come from the public pricing endpoint, not a build-time catalog or webhook.

# LiwanOS marketing site — execution plan

Date: 2026-11-07. Spec: [2026-11-07-liwan-marketing-site-design.md](../specs/2026-11-07-liwan-marketing-site-design.md).
Status: planned, nothing implemented. Domains confirmed by the owner: `liwanos.com` (site) and
`app.liwanos.com` (product). Release 1 sells CRM and customer messages; the free base (meetings,
documents, operations, AI) is described on the platform page, not priced.

Delegation follows AGENTS.md: the coordinator writes each brief and reads each patch; an
executor writes the bulk. One writer per file.

## Order and dependencies

```
PR1 public catalog endpoint  ──┐
PR2 UTM capture on /join     ──┼─> site repo (S1..S4) ──> deploy (D1..D2) ──> cleanup (C1)
                               ┘
```

PR1 and PR2 touch different files and can run in parallel. The site starts once PR1's
contract is merged (S1 may start from the contract draft).

## PR1 — public prices endpoint (this repo, area `cp`)

Owned files: `apps/control-plane/src/commercial/public-catalog.ts` (new), the public-route hook
in `apps/control-plane/src/http.ts`, the schema in `packages/commercial-contracts` (new
`publicCatalogSchema`), tests under `apps/control-plane/src/__tests__/`.

- `GET /v1/public/catalog`, anonymous, GET only, next to the invitation public routes.
- Select published and available plan and bundle revisions with `audience_customer_id IS NULL`.
  Reuse the selection logic of `customerCatalog` without the customer argument.
- Return whitelisted fields only (spec §3 and §3.1), including feature keys.
- `Cache-Control: public, max-age=60`; per-IP rate limit; no cookies; no CORS headers (the
  site reads it server-side at build time).
- Tests: draft hidden, unavailable hidden, customer-audience hidden, no extra fields (strict
  zod parse of the response), rate limit, feature keys present.
- Done: contract tests and control-plane tests pass; no `sudo`/baseline changes.
- Check: `npm -w packages/commercial-contracts run test` and `npm -w apps/control-plane run test`
  (heavy: through `tools/test_slot.py`, one group at a time).

## PR2 — UTM capture on sign-up (this repo, area `web`)

`apps/web/app/pages/join.vue` has no UTM handling today. Owned files: `join.vue`, the sign-up
request composable/contract it uses, the control-plane field that stores it.

- Read `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` and the referrer
  once on arrival; keep them through the sign-up steps; send them with the sign-up request.
- Store them with the account as typed columns (no JSON blob), whitelisted lengths. Schema
  change carries its version bump and migration per `docs/migrations.md`.
- Tests: values reach the stored account; unknown params are dropped; oversized values are
  rejected with 422.
- Open before starting: which service owns the new sign-up record (confirm in code before the
  brief is written).

## Site repo `liwan-site` (new, public, Astro)

- **S1 skeleton:** Astro static, `ar` default, RTL, layout, brand assets copied as files
  (colors #7843C6 family, fonts, Sadu pattern), `sitemap.xml`, `robots.txt`, OG tags,
  schema.org, redirects. No import from the product repo (UI1). CI: build, link check,
  Lighthouse budget.
- **S2 content system:** `content/apps/*.md` with `status`, `content/solutions/` (unused in
  release 1), generated menu/home grid/footer, `/apps` index, `/apps/[slug]` template.
- **S3 pricing:** build-time fetch of `/v1/public/catalog` (URL from an environment variable,
  never committed), join by feature key, "prices exclude VAT" notice. A failed fetch fails the
  build; the previous deployment keeps serving.
- **S4 pages and tracking:** home, platform, security, FAQ, contact (WhatsApp + `mailto:`),
  terms/privacy/refunds; consent banner gating GTM/GA4 and ad pixels, scripts through
  Partytown; every call-to-action links to `https://app.liwanos.com/join` or `/login` with
  UTM passed through.
- Contents for the two release-1 applications (CRM, customer messages): copy and screenshots
  are owner/content work, tracked separately from engineering.

## Deploy

- **D1:** new Openship project on OVH from the public repo, static container (Caddy), TLS,
  `liwanos.com` and `www`. The OVH "WebVue" WordPress project is not touched. Environment
  variables set in Openship, none in the repo.
- **D2:** price-change webhook: when a price is published in `apps/vendor-admin`, call the
  Openship deploy hook (secret in the control-plane environment) to rebuild. Add a nightly
  rebuild as a fallback.

## Cleanup

- **C1:** remove any marketing page or copy that exists in this repo after the site is live;
  no parallel copies (clean pre-release rule). Update `docs/WORKSPACE.md` with the new repo.

## Risks

- The public endpoint is the only new public surface: keep it read-only, whitelisted and
  rate-limited; review the diff with the `odoo-reviewer`/security pass.
- Release scope: if CRM or messages slip, the page `status` goes to `soon`; the site never
  claims an unreleased application.
- Pricing values are still marked unapproved in the seed; the site must not launch before the
  owner publishes real prices in the console.
