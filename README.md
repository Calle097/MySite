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

- `app/(en)/` — English tree, served at the root
- `app/(it)/it/` — Italian mirror, served under `/it`
- `components/pages/` — one component per page, rendered by both language trees
- `components/` — site chrome: header, footer, nav, section header
- `components/demos/` — the playground's showcase components
- `lib/i18n/` — `en.ts`, `it.ts`, and the `Dict` type they both satisfy
- `lib/demos.ts` — the demo registry (slugs, frame heights, source links)
- `deploy/` — Caddyfile + docker-compose for the server
- `.github/workflows/deploy.yml` — build + rsync on push to main

## Two languages, two route trees

Each page exists twice: `app/(en)/(site)/about/page.tsx` and
`app/(it)/it/(site)/about/page.tsx`. Both are thin — they set the locale's
`Metadata` and render the same component from `components/pages/` with a
`lang` prop. The page body is written once; only the metadata is duplicated.

This is deliberate rather than accidental. A single `app/[lang]/` segment
would collapse the file count, but per-locale `Metadata` literals are worth
more than the saved files at two languages. At three it stops being worth it.

Copy lives in `lib/i18n/en.ts` and `it.ts`, which both satisfy the `Dict`
interface — so a string added to one language fails the build until the other
has it too. Demos are registered once in `lib/demos.ts`; `DemoSlug` is a
union, so a mistyped slug is a compile error rather than a missing
"Source ↗" link.

## Adding a demo

1. Component in `components/demos/`
2. Page component in `components/pages/<Name>DemoPage.tsx`, rendering `<EmbedMarker />`
3. Route files under `app/(en)/demos/<slug>/` and `app/(it)/it/demos/<slug>/`
4. Add the slug to `DEMO_SLUGS` and `DEMOS` in `lib/demos.ts`
5. Add `playground.items.<slug>` and any in-demo strings to both dictionaries

Steps 4 and 5 are enforced by the type checker — miss one and `pnpm
type-check` tells you which.

## Dependency policy

Exact-pinned versions only, `ignore-scripts=true`, transitive pins where
needed via pnpm overrides. After any install, audit the lockfile against
currently known-compromised packages before committing it.
