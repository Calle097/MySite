import type { Metadata } from 'next';
import {
  Archivo,
  Hanken_Grotesk,
  Manrope,
  Onest,
  Schibsted_Grotesk,
  Space_Grotesk,
} from 'next/font/google';

// Temporary font sampler — visit /demos/fonts/, pick one, then this page
// gets deleted and the winner is wired into the root layout.
export const metadata: Metadata = {
  title: 'Font sampler',
  robots: { index: false },
};

const archivo = Archivo({ subsets: ['latin'] });
const manrope = Manrope({ subsets: ['latin'] });
const onest = Onest({ subsets: ['latin'] });
const hanken = Hanken_Grotesk({ subsets: ['latin'] });
const schibsted = Schibsted_Grotesk({ subsets: ['latin'] });
const space = Space_Grotesk({ subsets: ['latin'] });

const CANDIDATES = [
  { name: 'Archivo (current)', font: archivo },
  { name: 'Manrope', font: manrope },
  { name: 'Onest', font: onest },
  { name: 'Hanken Grotesk', font: hanken },
  { name: 'Schibsted Grotesk', font: schibsted },
  { name: 'Space Grotesk', font: space },
];

export default function FontSampler() {
  return (
    <div className="gutter py-10">
      <p className="font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
        Font sampler — same content, six typefaces. Pick one.
      </p>

      {CANDIDATES.map((c) => (
        <section
          key={c.name}
          className={`${c.font.className} mt-12 border-t pt-8`}
          style={{ borderColor: 'var(--secondary-darker)' }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--brand-accent)' }}>
            {c.name}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl">
            Frontend developer
            <br />
            &amp; QA engineer.
          </h1>
          <h3 className="mt-6 text-xl font-semibold tracking-tight">
            Management system for a gym franchise
          </h3>
          <p className="mt-3 max-w-[52ch] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            I build web apps with React, Next.js and TypeScript. I started in
            QA, so I also test what I build. React + TypeScript, in production
            with 500+ users.
          </p>
        </section>
      ))}
    </div>
  );
}
