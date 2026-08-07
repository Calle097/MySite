import type { Metadata } from 'next';
import {
  Assistant,
  Commissioner,
  Epilogue,
  Familjen_Grotesk,
  Geologica,
  Jost,
  Karla,
  Libre_Franklin,
  Mulish,
  Nunito_Sans,
  Onest,
  Reddit_Sans,
  Source_Sans_3,
  Wix_Madefor_Text,
  Work_Sans,
} from 'next/font/google';

// Temporary font sampler, round 3 — lighter, humanist faces in the
// Work Sans neighborhood. Headings render at weight 500 (not 600) to show
// the lighter feel. Visit /demos/fonts/, pick one, page gets deleted.
export const metadata: Metadata = {
  title: 'Font sampler',
  robots: { index: false },
};

const workSans = Work_Sans({ subsets: ['latin'] });
const sourceSans = Source_Sans_3({ subsets: ['latin'] });
const nunitoSans = Nunito_Sans({ subsets: ['latin'] });
const mulish = Mulish({ subsets: ['latin'] });
const karla = Karla({ subsets: ['latin'] });
const libreFranklin = Libre_Franklin({ subsets: ['latin'] });
const assistant = Assistant({ subsets: ['latin'] });
const commissioner = Commissioner({ subsets: ['latin'] });
const epilogue = Epilogue({ subsets: ['latin'] });
const jost = Jost({ subsets: ['latin'] });
const redditSans = Reddit_Sans({ subsets: ['latin'] });
const wixMadefor = Wix_Madefor_Text({ subsets: ['latin'] });
const familjen = Familjen_Grotesk({ subsets: ['latin'] });
const geologica = Geologica({ subsets: ['latin'] });
const onest = Onest({ subsets: ['latin'] });

const CANDIDATES = [
  { name: 'Work Sans (your benchmark)', font: workSans },
  { name: 'Source Sans 3', font: sourceSans },
  { name: 'Nunito Sans', font: nunitoSans },
  { name: 'Mulish', font: mulish },
  { name: 'Karla', font: karla },
  { name: 'Libre Franklin', font: libreFranklin },
  { name: 'Assistant', font: assistant },
  { name: 'Commissioner', font: commissioner },
  { name: 'Epilogue', font: epilogue },
  { name: 'Jost', font: jost },
  { name: 'Reddit Sans', font: redditSans },
  { name: 'Wix Madefor Text', font: wixMadefor },
  { name: 'Familjen Grotesk', font: familjen },
  { name: 'Geologica', font: geologica },
  { name: 'Onest (current)', font: onest },
];

export default function FontSampler() {
  return (
    <div className="gutter py-10">
      <p className="font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
        Font sampler — {CANDIDATES.length} lighter/humanist typefaces, headings at weight 500. Pick one.
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
          <h1 className="mt-4 text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl">
            Frontend developer
            <br />
            &amp; QA engineer.
          </h1>
          <h3 className="mt-6 text-xl font-medium tracking-tight">
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
