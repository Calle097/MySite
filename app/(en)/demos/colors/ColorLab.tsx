'use client';

import { useState, type CSSProperties } from 'react';

// Dev tool: try header / accent / background colors against real site
// pieces. Hairlines and the gradient edge are derived from the background
// automatically, like the real theme.

function darken(hex: string, f: number): string {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => Math.round(parseInt(n.slice(i, i + 2), 16) * (1 - f)));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

const DEFAULTS = {
  background: '#d7e6f5',
  header: '#16202b',
  accent: '#ec9a5e',
};

export function ColorLab() {
  const [background, setBackground] = useState(DEFAULTS.background);
  const [header, setHeader] = useState(DEFAULTS.header);
  const [accent, setAccent] = useState(DEFAULTS.accent);
  const [copied, setCopied] = useState(false);

  const edge = darken(background, 0.06);
  const hairline = darken(background, 0.17);

  const vars = {
    '--background': background,
    '--background-edge': edge,
    '--secondary-darker': hairline,
    '--brand-accent': accent,
    '--header-bg': header,
  } as CSSProperties;

  const summary = `--background: ${background};\n--background-edge: ${edge};\n--secondary-darker: ${hairline};\n--brand-accent: ${accent};\n--header-bg: ${header};`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — values are visible below anyway */
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
    <div style={vars}>
      {/* controls */}
      <div
        className="gutter sticky top-0 z-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-b py-4"
        style={{ background: 'var(--background)', borderColor: 'var(--secondary-darker)' }}
      >
        {picker('Background', background, setBackground)}
        {picker('Header', header, setHeader)}
        {picker('Accent', accent, setAccent)}
        <button
          onClick={copy}
          className="cursor-pointer font-mono text-xs uppercase tracking-[0.15em] underline underline-offset-4"
          style={{ color: 'var(--brand-accent)' }}
        >
          {copied ? 'Copied ✓' : 'Copy values'}
        </button>
      </div>

      {/* preview: representative site pieces */}
      <div
        className="min-h-dvh pb-20"
        style={{ background: `linear-gradient(180deg, ${background} 0%, ${edge} 100%)`, color: 'var(--foreground)' }}
      >
        {/* header band */}
        <div
          className="gutter flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-5"
          style={{ background: 'var(--header-bg)', color: '#e9f0f7' }}
        >
          <span className="text-lg font-semibold tracking-tight">Mattia Callegher</span>
          <span className="flex gap-6 font-mono text-sm" style={{ color: '#94a7ba' }}>
            <span>/playground</span>
            <span>/stack</span>
            <span>/cv ↓</span>
            <span style={{ color: '#e9f0f7' }}>en</span>
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
