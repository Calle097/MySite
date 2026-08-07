import type { Metadata } from 'next';
import { SkillsDemo } from './SkillsDemo';

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Small interactive experiments.',
};

export default function Playground() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Playground</h1>
      <p className="mt-4 max-w-2xl leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
        Small things I built and liked. Scroll down, then hover a card (tap on a phone).
      </p>

      {/* Spacer: the demo is scroll-driven, so it must start below the fold —
          without this the page has no scroll room and the animation never plays. */}
      <div className="flex h-[55vh] items-end justify-center pb-10" aria-hidden>
        <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          ↓
        </span>
      </div>

      <section>
        <div className="my-10">
          <SkillsDemo />
        </div>

        <noscript>
          <p className="max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            This demo needs JavaScript. The short version: I do frontend (React,
            Next.js, TypeScript) and QA (Playwright). Everything else on this
            site works without JavaScript.
          </p>
        </noscript>

        <p className="max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          Two SVG paths share the same command skeleton, so Framer Motion can
          tween the <code>d</code> attribute between van and card. Scroll
          position drives the entry.
        </p>
      </section>

      {/* Room below so the scroll scrub can reach 100% before the page ends. */}
      <div className="h-[25vh]" aria-hidden />
    </div>
  );
}
