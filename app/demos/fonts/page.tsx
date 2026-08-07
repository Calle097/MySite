import type { Metadata } from 'next';
import {
  Albert_Sans,
  Archivo,
  DM_Sans,
  Figtree,
  Geist,
  Hanken_Grotesk,
  Inter_Tight,
  Lexend,
  Manrope,
  Onest,
  Outfit,
  Plus_Jakarta_Sans,
  Public_Sans,
  Rubik,
  Schibsted_Grotesk,
  Sora,
  Space_Grotesk,
  Urbanist,
  Work_Sans,
} from 'next/font/google';

// Temporary font sampler — visit /demos/fonts/, pick one, then this page
// gets deleted and the winner is wired into the root layout.
export const metadata: Metadata = {
  title: 'Font sampler',
  robots: { index: false },
};

const onest = Onest({ subsets: ['latin'] });
const interTight = Inter_Tight({ subsets: ['latin'] });
const figtree = Figtree({ subsets: ['latin'] });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });
const sora = Sora({ subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });
const urbanist = Urbanist({ subsets: ['latin'] });
const dmSans = DM_Sans({ subsets: ['latin'] });
const workSans = Work_Sans({ subsets: ['latin'] });
const publicSans = Public_Sans({ subsets: ['latin'] });
const albert = Albert_Sans({ subsets: ['latin'] });
const lexend = Lexend({ subsets: ['latin'] });
const geist = Geist({ subsets: ['latin'] });
const space = Space_Grotesk({ subsets: ['latin'] });
const hanken = Hanken_Grotesk({ subsets: ['latin'] });
const manrope = Manrope({ subsets: ['latin'] });
const schibsted = Schibsted_Grotesk({ subsets: ['latin'] });
const rubik = Rubik({ subsets: ['latin'] });
const archivo = Archivo({ subsets: ['latin'] });

const CANDIDATES = [
  { name: 'Onest (current)', font: onest },
  { name: 'Inter Tight', font: interTight },
  { name: 'Figtree', font: figtree },
  { name: 'Plus Jakarta Sans', font: jakarta },
  { name: 'Sora', font: sora },
  { name: 'Outfit', font: outfit },
  { name: 'Urbanist', font: urbanist },
  { name: 'DM Sans', font: dmSans },
  { name: 'Work Sans', font: workSans },
  { name: 'Public Sans', font: publicSans },
  { name: 'Albert Sans', font: albert },
  { name: 'Lexend', font: lexend },
  { name: 'Geist', font: geist },
  { name: 'Space Grotesk', font: space },
  { name: 'Hanken Grotesk', font: hanken },
  { name: 'Manrope', font: manrope },
  { name: 'Schibsted Grotesk', font: schibsted },
  { name: 'Rubik', font: rubik },
  { name: 'Archivo', font: archivo },
];

export default function FontSampler() {
  return (
    <div className="gutter py-10">
      <p className="font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
        Font sampler — same content, {CANDIDATES.length} typefaces. Pick one.
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
