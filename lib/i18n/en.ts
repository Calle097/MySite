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
        title: 'Frontend developer & IT consultant',
        where: '2020 — 2024',
        text: 'Employed at an IT company. React + TypeScript web apps, including a management system for a gym franchise used by 500+ people.',
      },
      {
        title: 'QA engineer, on dispatch',
        where: '2020 — 2023',
        text: 'Dispatched by the same company to work as QA on a smart metering platform in the energy sector, later as test manager.',
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
      'Simple things I built and found too interesting, or too silly, to throw away. Some shipped, some never left the sketchbook.',
    openLabel: 'Open ↗',
    sourceLabel: 'Source ↗',
    loading: 'loading',
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
          '500 dots placed with the golden angle, the same packing a sunflower uses. A pulse ripples outward forever. No libraries, just SVG.',
      },
      {
        slug: 'css-effects',
        title: 'CSS-only effects',
        caption:
          'A jelly button hover and a spinning highlight ring carved out of a conic gradient with mask-composite. Obviously pure CSS, no JavaScript at all.',
      },
      {
        slug: 'sakura',
        title: 'Sakura badge',
        caption:
          'A little badge with cherry-blossom petals falling inside it. Petal positions are randomized client-side to avoid hydration mismatches.',
      },
      {
        slug: 'time-picker',
        title: 'Time picker',
        caption:
          'Built for a client project after every free time picker I looked into misbehaved somewhere — controlled values, mobile scrolling, popover clipping. Writing one was faster: staged selection, a “now” shortcut, per-slot disabling.',
      },
      {
        slug: 'chip-composer',
        title: 'Entity-chip composer',
        caption:
          'Type @ and pick a destination: it becomes a chip the caret can’t split. Built on raw DOM Ranges and Selection, no editor library. The palette anchors to the caret and the panel below shows how the message serializes.',
      },
      {
        slug: 'transit-drag',
        title: 'Transit drag',
        caption:
          'A day of activities with a train in the middle. Drag the train (or use the arrows) and every later time recalculates: transfers, departure, the whole afternoon.',
      },
    ],
  },
  demoNoscript: 'This demo needs JavaScript.',
  demoCss: {
    hint: 'Everything here is CSS, no JavaScript.',
    button: 'Hover me',
    card: 'Attention ring',
  },
  demoSakura: { label: 'Cherry blossoms' },
  demoTimePicker: {
    labels: { hours: 'Hours', minutes: 'Minutes', now: 'Now', ok: 'OK' },
    hint: 'Pick a time',
    picked: 'Picked:',
  },
  demoComposer: {
    hint: 'Type @ to insert a destination',
    empty: 'Write something, then type @ …',
    serialized: 'Serialized',
    plain: 'Plain text',
    entities: 'Entities',
    clear: 'Clear',
    noResults: 'No match',
  },
  demoTransit: {
    hint: 'Drag the train, or use the arrows. Every time recalculates',
    dropHint: 'Drop the train here',
    walk: '15 min transfer',
    activities: [
      { title: 'Old town walk', minutes: 60 },
      { title: 'Market & coffee', minutes: 45 },
      { title: 'Harbor lighthouse', minutes: 40 },
      { title: 'Botanical garden', minutes: 60 },
      { title: 'Thermal baths', minutes: 90 },
    ],
    train: { from: 'Verona', to: 'Venice', duration: '1 h 25 min' },
  },
  projects: {
    header: 'Recent projects',
    items: [
      {
        title: 'Travel-planning platform',
        text: 'Frontend and some backend on a large Next.js 15 app: streaming AI chat over SSE, a persistent MapLibre map in a parallel route that survives navigation, modals as real URLs via intercepting routes, Stripe checkout, REST integrations for transit and hotel booking, six locales, IndexedDB-persisted query cache.',
        stack: 'Stack: TypeScript · Tailwind · Zustand · TanStack Query · react-map-gl · Firebase auth · Playwright',
      },
      {
        title: 'Camper-van rental site',
        text: 'Marketing and booking site for a camper-van rental service. The playground vans started here, though the project never went through.',
        stack: 'Stack: Next.js · Tailwind · Framer Motion',
      },
    ],
  },
  about: {
    title: 'About',
    paragraphs: [
      'I studied film and media at university. Then I taught myself how to program, and it stuck.',
      'My first tech job was at an IT company: frontend work with React, while also being dispatched as QA on a large smart metering system: manual testing first, then Playwright automation, eventually coordinating the QA side.',
      'Now I freelance from Italy, and I would like to move to Japan for work.',
    ],
  },
  demoDriveIn: {
    scroll: 'Scroll ↓',
    hover: 'Hover a parked card',
    noscript: 'This demo needs JavaScript. It animates SVG paths as you scroll.',
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
          'English and Italian without an i18n library: one static route tree per language, TypeScript dictionaries, a tiny script for detection and saved preference',
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
  skipToContent: 'Skip to content',
};
