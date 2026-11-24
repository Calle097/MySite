# mysite

Personal site — Next.js 15 static export, React 19, TypeScript, Tailwind 4,
Framer Motion. Self-hosted as static files behind Caddy and Cloudflare.

[DEPLOY.md](DEPLOY.md) is a generic guide to replicating this setup on any VPS.

## Develop

```bash
pnpm install   # lifecycle scripts are disabled via .npmrc (supply-chain hardening)
pnpm dev       # http://localhost:3000
pnpm build     # static export → out/
pnpm start     # serve out/ locally: a rough preview, without the server's
               # 404 rewrites or cache headers (see deploy/Caddyfile)
pnpm type-check
```

## Structure

- `app/(en)/` — English tree, served at the root
- `app/(it)/it/` — Italian mirror, served under `/it`
- `components/pages/` — one component per page, rendered by both language trees
- `components/` — plain's chrome: header, footer, mobile menu, section header
- `components/fancy/` — the fancier version's frame: the column, its header,
  the index, the phone menu, the version switch, the light
- `app/fancy.css`, `app/fancy/` — the fancier version's styles, one file per part
- `components/demos/` — the playground's showcase components
- `lib/i18n/` — `en.ts`, `it.ts`, and the `Dict` type they both satisfy
- `lib/pages.ts` — the page list every menu and the sitemap are built from
- `lib/demos.ts` — the demo registry (slugs, frame heights, source links)
- `lib/mode.ts` — the switch between the two versions
- `lib/site.ts` — the site's origin, name, email and links
- `app/(en)/not-found/` — the 404 page, a real route rather than Next's
  `not-found.tsx`: with one root layout per language there is no `app/layout.tsx`
  for Next to wrap `/_not-found` in, so its own export is unstyled. Caddy
  rewrites unmatched paths to this one (`/it/not-found/` for the Italian tree)
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

## Two looks

The site has a plain version (the default, and it works without
JavaScript) and a fancier one, chosen with a switch and remembered in
`localStorage`. One attribute on `<html>`, `data-mode="fancy"`, set before the
first paint by an inline script (`lib/mode.ts`), selects it.

Both looks render from the same markup, so nothing flashes on load. Every
page is wrapped in `components/fancy/PageLayout.tsx`, which plain leaves
unstyled; the fancier styles in `app/fancy/` restyle the shared markup from
their own cascade layer, declared last in `app/globals.css`. Markup that only
one look shows carries `only-plain` or `only-fancy`. The fancier styles hook
onto `data-part`, `data-entry`, `data-section` and `data-reveal` attributes
in the page components.

## Adding a demo

1. Component in `components/demos/`
2. Page component in `components/pages/<Name>DemoPage.tsx`, wrapped in
   `<DemoLayout>` (the frame both looks use, and the `#embed` marker the
   playground's iframes rely on)
3. Route files under `app/(en)/demos/<slug>/` and `app/(it)/it/demos/<slug>/`
4. Add the slug to `DEMO_SLUGS` and `DEMOS` in `lib/demos.ts` (with `needsJs`:
   the demo frame shows a note when JavaScript is off)
5. Add `playground.items.<slug>` and any in-demo strings to both dictionaries

Steps 4 and 5 are enforced by the type checker — miss one and `pnpm
type-check` tells you which. No new CSS is needed for either look.

## Adding a page

1. Page component in `components/pages/`, wrapped in `<PageLayout>`
2. Route files in both trees, as for the others: their metadata is
   `pageMetadata(lang, page)` (`lib/metadata.ts`)
3. Add it to `PAGES` in `lib/pages.ts`: every menu, the 404's list and the
   sitemap follow
4. Add `nav.<page>`, `pageDescriptions.<page>` and `notFound.hints.<page>` to
   both dictionaries (the type checker asks for them)

## Dependency policy

Exact-pinned versions only, `ignore-scripts=true`, transitive pins where
needed via pnpm overrides. After any install, audit the lockfile against
currently known-compromised packages before committing it.
