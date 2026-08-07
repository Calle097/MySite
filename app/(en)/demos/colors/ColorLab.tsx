'use client';

import { useState, type CSSProperties } from 'react';

// Dev tool: try background / accent colors against real site pieces.
// Text, hairlines, and the gradient edge derive from the background —
// light text on dark backgrounds, dark text on light ones. The header is
// glass (blurred, semi-transparent background), so it has no color of its own.

function shade(hex: string, f: number): string {
  // f > 0 darkens toward black, f < 0 lightens toward white
  const n = hex.replace('#', '');
  const ch = (i: number) => {
    const v = parseInt(n.slice(i, i + 2), 16);
    const out = f >= 0 ? v * (1 - f) : v + (255 - v) * -f;
    return Math.round(Math.min(255, Math.max(0, out)));
  };
  return `#${[0, 2, 4].map((i) => ch(i).toString(16).padStart(2, '0')).join('')}`;
}

function luminance(hex: string): number {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const DEFAULTS = {
  background: '#001d38',
  accent: '#46a08e',
};

export function ColorLab() {
  const [background, setBackground] = useState(DEFAULTS.background);
  const [accent, setAccent] = useState(DEFAULTS.accent);
  const [copied, setCopied] = useState(false);

  const dark = luminance(background) < 0.45;
  const edge = shade(background, 0.06);
  const hairline = dark ? shade(background, -0.16) : shade(background, 0.17);
  const foreground = dark ? '#e8eef6' : '#141a1f';
  const muted = dark ? '#9fb3c8' : '#4e5e6c';

  const vars = {
    '--background': background,
    '--background-edge': edge,
    '--secondary-darker': hairline,
    '--brand-accent': accent,
    '--foreground': foreground,
    '--muted-foreground': muted,
  } as CSSProperties;

  const summary = `--background: ${background};\n--background-edge: ${edge};\n--foreground: ${foreground};\n--muted-foreground: ${muted};\n--secondary-darker: ${hairline};\n--brand-accent: ${accent};`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — values are visible in the summary anyway */
    }
  };

  const picker = (label: string, value: string, set: (v: string) => void) => (
    <label className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.15em]">
      <input type="color" value={value} onChange={(e) => set(e.target.value)} className="h-9 w-12 cursor-pointer" />
      <span>
        {label}
        <span className="ml-2 normal-case" style={{ color: 'var(--muted-foreground)' }}>
          {value}
        </span>
      </span>
    </label>
  );

  return (
    <div style={{ ...vars, color: 'var(--foreground)' }}>
      {/* controls */}
      <div
        className="gutter sticky top-0 z-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-b py-4"
        style={{ background: 'var(--background)', borderColor: 'var(--secondary-darker)' }}
      >
        {picker('Background', background, setBackground)}
        {picker('Accent', accent, setAccent)}
        <button
          onClick={copy}
          className="cursor-pointer font-mono text-xs uppercase tracking-[0.15em] underline underline-offset-4"
          style={{ color: 'var(--brand-accent)' }}
        >
          {copied ? 'Copied ✓' : 'Copy values'}
        </button>
      </div>

      {/* preview */}
      <div
        className="min-h-dvh pb-20"
        style={{ background: `linear-gradient(180deg, ${background} 0%, ${edge} 100%)` }}
      >
        {/* glass header */}
        <div
          className="gutter flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b py-5 backdrop-blur-md"
          style={{
            background: 'color-mix(in srgb, var(--background) 55%, transparent)',
            borderColor: 'color-mix(in srgb, var(--foreground) 10%, transparent)',
          }}
        >
          <span className="text-lg font-semibold tracking-tight">Mattia Callegher</span>
          <span className="flex gap-6 font-mono text-sm" style={{ color: 'var(--muted-foreground)' }}>
            <span>/playground</span>
            <span>/stack</span>
            <span>/cv ↓</span>
            <span style={{ color: 'var(--foreground)' }}>en</span>
          </span>
        </div>

        {/* hero */}
        <div className="gutter pt-14">
          <h1 className="font-semibold leading-[1.04] tracking-tight" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4.25rem)' }}>
            Frontend developer
            <br />
            &amp; QA engineer
            <span style={{ color: 'var(--brand-accent)' }}>.</span>
          </h1>
          <div className="mt-9 flex flex-wrap gap-x-10 gap-y-2 font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
            <span>Based in Italy</span>
            <span>Interested in working in Japan</span>
          </div>
          <p className="mt-8 max-w-[52ch] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            I build web apps with React, Next.js and TypeScript. I started in QA, so I also test what I build.
          </p>
        </div>

        {/* section header + work row */}
        <div className="mt-16">
          <div
            className="gutter flex items-baseline justify-between border-b pb-3 font-mono text-xs uppercase tracking-[0.15em]"
            style={{ borderColor: 'var(--secondary-darker)', color: 'var(--muted-foreground)' }}
          >
            <span>01</span>
            <span>Work</span>
          </div>
          <div
            className="gutter grid gap-x-10 gap-y-2 border-b py-7 lg:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1.3fr)]"
            style={{ borderColor: 'var(--secondary-darker)' }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
              2020 — 2021
            </span>
            <span className="text-xl font-semibold tracking-tight">Management system for a gym franchise</span>
            <span className="max-w-[55ch] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              React + TypeScript, in production with 500+ users.
            </span>
          </div>
        </div>

        {/* links + accent samples */}
        <div className="gutter mt-12 flex flex-wrap items-baseline gap-x-10 gap-y-4">
          <a href="#" className="underline underline-offset-4" style={{ color: 'var(--brand-accent)' }}>
            Accent link
          </a>
          <span className="font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
            Muted label
          </span>
          <span
            className="inline-block border px-4 py-2 text-sm"
            style={{ borderColor: 'var(--secondary-darker)', background: 'var(--background)' }}
          >
            Card surface with hairline
          </span>
          <span className="text-2xl font-semibold">
            Email link
            <span style={{ color: 'var(--brand-accent)' }}> ↗</span>
          </span>
        </div>
      </div>
    </div>
  );
}
