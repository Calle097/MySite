# mysite

Personal site of Mattia Callegher — Next.js 15 static export, React 19,
TypeScript, Tailwind 4, Framer Motion. Self-hosted on a VPS behind Caddy and
Cloudflare. See `/colophon` on the site, or [DEPLOY.md](DEPLOY.md) for the
hosting story.

## Develop

```bash
pnpm install   # lifecycle scripts are disabled via .npmrc (supply-chain hardening)
pnpm dev       # http://localhost:3000
pnpm build     # static export → out/
pnpm type-check
```

## Structure

- `app/` — pages: home, `playground/` (animated components), `colophon/`
- `components/DriveInCards.tsx` — scroll-driven SVG morph (vans → cards)
- `deploy/` — Caddyfile + docker-compose for the VPS
- `.github/workflows/deploy.yml` — build + rsync to VPS on push to main

## To do before going live

- [ ] Drop the CV at `public/cv.pdf` (the nav links to it). Consider a
      web-safe version without phone number / birth date — the PDF will be
      public and scrapeable.
- [ ] Create the GitHub repo and check the `Source` links in
      `app/layout.tsx` / `app/colophon/page.tsx` point at it.
- [ ] Buy the domain (Cloudflare Registrar) and put it in `deploy/Caddyfile`.
- [ ] Follow [DEPLOY.md](DEPLOY.md).

## Dependency policy

Exact-pinned versions only (all published months before the Aug 2026 npm worm),
`ignore-scripts=true`, transitive pins for `motion-dom`/`motion-utils` via pnpm
overrides. Audit after any install:

```bash
grep -E "keyv|cacheable|ecto|flat-cache|file-entry-cache|cache-manager" pnpm-lock.yaml
```
