# Deploying the site

The site is a static Astro build (`dist/`) hosted on OVH through the self-hosted Openship
instance, separate from the product (`app.liwanos.com`).

## Staging

| Item | Value |
|---|---|
| Openship project | `liwan-website-staging` (`proj_uj_gA_CHfFZrSoL3`) |
| Server | "This Server" (OVH, `57.129.1.204`) |
| Source | `tariiq222/liwan-website`, branch `main` |
| Build | `Dockerfile`: `npm ci && npm run build` (Node 22), then nginx serves `dist/` |
| Auto-deploy | On: every push to `main` redeploys |
| URL | `https://liwan-staging.57.129.1.204.sslip.io/` |

The Openship default free domain (`*.opsh.io`) needs Openship Cloud, which is not connected
on this instance. Staging therefore uses an `sslip.io` hostname that resolves to the server IP,
so no DNS change is needed anywhere. When Cloud is connected or a real staging hostname exists,
swap the domain in the Openship project (Domains tab).

Do not touch the other projects on the server (in particular WebVue).

## Serving rules

Openship's built-in static mode falls back to `index.html` for unknown paths (200, no `404.html`)
and sends a second `Cache-Control` for `/_astro/*`. So the project is built from the `Dockerfile`
and served by nginx with `nginx.conf.template`:

- Astro emits `<path>/index.html` (`trailingSlash: "always"`); unknown paths return `404` with
  the site's own `404.html`.
- `/_astro/*`: `Cache-Control: public, max-age=31536000, immutable`.
- Everything else (HTML): `Cache-Control: public, max-age=0, must-revalidate`.
- Security headers: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and a CSP that
  allows `self`, Google Fonts, Cloudflare Turnstile and `https://app.liwanos.com`
  (fetch and form posts).
- `X-Robots-Tag` comes from the `ROBOTS_TAG` environment variable. Staging sets it to
  `noindex, nofollow` in the Openship project env. Production leaves it unset (empty, header not sent).
- The container listens on port 80.

Test locally:

```bash
docker build -t liwan-site .
docker run --rm -p 8080:80 -e ROBOTS_TAG="noindex, nofollow" liwan-site
```

## Staging domain on liwanos.com (owner chose `staging.liwanos.com`)

The owner adds one web record; nothing else on `liwanos.com` changes:

| Type | Name | Value |
|---|---|---|
| A | `staging` | `57.129.1.204` |

After it resolves, attach the domain to `liwan-website-staging` in Openship (Domains → connect
`staging.liwanos.com`, HTTP-01) and run Verify. The `sslip.io` hostname can then be removed.

## Production domain (later, owner decision)

Do not change anything until the owner approves. `liwanos.com` mail records (DKIM, SPF, DMARC,
null MX) must stay untouched; only the web records below change.

Create a separate production project (same repo, branch `main`, `ROBOTS_TAG` not set), then add
the domains `liwanos.com` and `www.liwanos.com` in it and set:

| Type | Name | Value |
|---|---|---|
| A | `@` (liwanos.com) | `57.129.1.204` |
| A (or CNAME to `liwanos.com`) | `www` | `57.129.1.204` |

Then in Openship run Verify for each domain (HTTP-01; port 80 must reach the server). It issues
the Let's Encrypt certificate. Remove any existing `A`/`AAAA`/`CNAME` on `@` and `www` first
(a CNAME cannot coexist with other records). Do not add or edit `MX`, `TXT`, DKIM or DMARC records.
Choose one canonical host (apex or `www`) and redirect the other with a redirect endpoint.

`app.liwanos.com` is the product and is not part of this site.

## Rolling back

1. Openship dashboard: project `liwan-website-staging` → Deployments → pick the last good
   deployment → ⋮ → **Rollback to this version**.
2. Or via MCP/CLI: `get_deployments_by_id_restore_plan`, then `post_deployments_by_id_rollback`
   on the *target* (older, good) deployment; CLI: `openship deployment rollback <id>`.
3. Rollback restores code only. Auto-deploy stays on, so the next push to `main` deploys again.
   To hold a rollback, disable auto-deploy first (`post_projects_by_id_auto_deploy`
   `{"enabled": false}`), fix `main`, then re-enable it.

Alternative: revert the bad commit on `main`; auto-deploy ships the revert.

## Checking a deploy

```bash
curl -sI https://liwan-staging.57.129.1.204.sslip.io/
curl -sI https://liwan-staging.57.129.1.204.sslip.io/apps/crm/
curl -sI https://liwan-staging.57.129.1.204.sslip.io/pricing/
curl -sI https://liwan-staging.57.129.1.204.sslip.io/nope/    # expect 404
```
