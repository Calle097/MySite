import type { Dict } from './index';

export const en: Dict = {
  description:
    'Frontend developer & QA engineer. React, Next.js, TypeScript, Playwright. Based in Italy, interested in working in Japan.',
  hero: {
    line1: 'Frontend developer',
    line2: '& QA engineer',
    metaRow: ['Based in Italy', 'Interested in working in Japan', 'React · Next.js · TypeScript · Tailwind · Playwright'],
    blurb:
      'I build web apps with React, Next.js and TypeScript. I started in QA, so I also test what I build. I dabble in backend too — TypeScript, Python, SQL.',
  },
  work: {
    header: 'Work',
    items: [
      {
        title: 'Management system for a gym franchise',
        where: '2020 — 2021',
        text: 'React + TypeScript, in production with 500+ users. Handled end to end: requirements, development, Docker deployment.',
      },
      {
        title: 'Smart metering platform, energy sector',
        where: '2020 — 2023',
        text: 'QA engineer, later test manager. Test plans, Playwright automation, coordination with several development teams.',
      },
      {
        title: 'Freelance',
        where: '2024 — now',
        text: 'Web apps with Next.js and React, TypeScript backends, Python automation and bots.',
      },
    ],
    fullHistory: 'Full history —',
    cvLabel: 'CV (PDF)',
  },
  contact: { header: 'Contact' },
  playground: {
    title: 'Playground',
    intro:
      'Things I built and found too interesting — or too silly — to throw away. Some shipped, some never left the sketchbook.',
    openLabel: 'Open ↗',
    sourceLabel: 'Source ↗',
    demos: [
      {
        slug: 'drive-in',
        title: 'Drive-in cards',
        caption:
          'SVG path morph driven by scroll: items arrive as vans, park as cards. Hover a parked card to wake it. Scroll inside the frame.',
      },
      {
        slug: 'spiral',
        title: 'Golden spiral',
        caption:
          '500 dots placed with the golden angle — the same packing a sunflower uses. A pulse ripples outward forever. No libraries, just SVG.',
      },
    ],
  },
  demoNoscript: 'This demo needs JavaScript.',
  about: {
    title: 'About',
    paragraphs: [
      'I studied film and media at university. Then I taught myself how to program, and it stuck.',
      'My first tech job was QA on a large smart metering system — manual testing first, then Playwright automation, eventually coordinating the QA side. Building web apps with React started as a side thing and became the main one.',
      'Now I freelance from Italy, and I would like to move to Japan for work.',
    ],
  },
  demoDriveIn: {
    scroll: 'Scroll ↓',
    hover: 'Hover a parked card',
    noscript: 'This demo needs JavaScript — it animates SVG paths as you scroll.',
    items: [
      { title: 'Scroll-scrubbed', text: 'Entry follows the scroll position of this frame.' },
      { title: 'Path morphing', text: 'One SVG skeleton tweens between van and card.' },
    ],
  },
  stack: {
    title: 'How this site is built',
    sourcePre: 'The source is',
    sourceLabel: 'on GitHub',
    sections: [
      {
        index: '01',
        title: 'Stack',
        items: [
          'Next.js 15, static export — served as plain files',
          'React 19, TypeScript, Tailwind CSS 4',
          'Framer Motion, playground only',
          'Wix Madefor Text + IBM Plex Mono, self-hosted — no third-party requests',
        ],
      },
      {
        index: '02',
        title: 'Hosting',
        items: [
          'A small VPS I manage myself, Caddy in Docker, Cloudflare DNS',
          'Built and deployed by GitHub Actions on every push',
        ],
      },
      {
        index: '03',
        title: 'Privacy',
        items: ['No analytics, cookies, or tracking', 'Works without JavaScript, except the playground'],
      },
    ],
    aiLine: 'Built with help from Claude Code, reviewed line by line',
  },
  footer: { location: 'Mattia Callegher — Italy', email: 'Email', github: 'GitHub', source: 'Source' },
};
