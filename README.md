# mysite

Personal site — Next.js 15 static export, React 19, TypeScript, Tailwind 4,
Framer Motion. Self-hosted as static files behind Caddy and Cloudflare.

[DEPLOY.md](DEPLOY.md) is a generic guide to replicating this setup on any VPS.

## Develop

```bash
pnpm install   # lifecycle scripts are disabled via .npmrc (supply-chain hardening)
pnpm dev       # http://localhost:3000
pnpm build     # static export → out/
pnpm type-check
```

## Structure

- `app/(site)/` — pages with site chrome: home, `playground/`, `stack/`
- `app/demos/` — bare component demos, embedded by the playground via iframes
- `components/` — shared components
- `deploy/` — Caddyfile + docker-compose for the server
- `.github/workflows/deploy.yml` — build + rsync on push to main

## Dependency policy

Exact-pinned versions only, `ignore-scripts=true`, transitive pins where
needed via pnpm overrides. After any install, audit the lockfile against
currently known-compromised packages before committing it.
