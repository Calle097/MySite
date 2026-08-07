import type { Dict } from './index';

export const it: Dict = {
  description:
    'Sviluppatore frontend e QA engineer. React, Next.js, TypeScript, Playwright. Vivo in Italia e mi piacerebbe lavorare in Giappone.',
  hero: {
    line1: 'Sviluppatore frontend',
    line2: '& QA engineer',
    metaRow: ['Vivo in Italia', 'Mi piacerebbe lavorare in Giappone', 'React · Next.js · TypeScript · Tailwind · Playwright'],
    blurb:
      'Costruisco web app con React, Next.js e TypeScript. Ho lavorato in QA, quindi testo quello che costruisco. Ogni tanto faccio anche backend: TypeScript, Python e SQL.',
  },
  work: {
    header: 'Esperienza',
    items: [
      {
        title: 'Gestionale per una catena di palestre',
        where: '2020 — 2021',
        text: 'React + TypeScript, in produzione con oltre 500 utenti. Seguito dall’inizio alla fine: requisiti, sviluppo e deploy con Docker.',
      },
      {
        title: 'Piattaforma di smart metering per il settore energetico',
        where: '2020 — 2023',
        text: 'QA engineer, poi test manager. Piani di test, automazione con Playwright e coordinamento con diversi team di sviluppo.',
      },
      {
        title: 'Freelance',
        where: '2024 — oggi',
        text: 'Web app con Next.js e React, backend in TypeScript, automazioni e bot in Python.',
      },
    ],
    fullHistory: 'Percorso completo —',
    cvLabel: 'CV (PDF)',
  },
  contact: { header: 'Contatti' },
  playground: {
    title: 'Playground',
    intro:
      'Cose che ho costruito e che mi sembravano troppo interessanti — o troppo stupide — per buttarle via. Alcune sono finite in produzione, altre no.',
    demo: {
      title: 'Drive-in cards',
      caption:
        'Path SVG che si trasformano con lo scroll: gli elementi arrivano come furgoncini e diventano card quando si fermano. Passa il mouse su una card per riattivarla. Scorri dentro il riquadro.',
      open: 'Apri ↗',
      source: 'Codice ↗',
    },
  },
  demoDriveIn: {
    scroll: 'Scorri ↓',
    hover: 'Passa il mouse su una card',
    noscript: 'Questa demo ha bisogno di JavaScript: anima i path SVG mentre scorri.',
    items: [
      { title: 'Guidato dallo scroll', text: 'L’entrata segue lo scroll di questo riquadro.' },
      { title: 'Morphing di path', text: 'Un unico scheletro SVG passa da furgoncino a card.' },
    ],
  },
  stack: {
    title: 'Come è fatto questo sito',
    sourcePre: 'Il codice sorgente è',
    sourceLabel: 'su GitHub',
    sections: [
      {
        index: '01',
        title: 'Stack',
        items: [
          'Next.js 15, export statico — servito come semplici file',
          'React 19, TypeScript, Tailwind CSS 4',
          'Framer Motion, solo per il playground',
          'Wix Madefor Text + IBM Plex Mono, self-hosted — nessuna richiesta verso terze parti',
        ],
      },
      {
        index: '02',
        title: 'Hosting',
        items: [
          'Un piccolo VPS gestito da me, Caddy in Docker, DNS su Cloudflare',
          'Build e deploy automatici con GitHub Actions a ogni push',
        ],
      },
      {
        index: '03',
        title: 'Privacy',
        items: ['Niente analytics, niente cookie, niente tracciamento', 'Funziona anche senza JavaScript, playground escluso'],
      },
    ],
    aiLine: 'Costruito con l’aiuto di Claude Code, rivisto riga per riga',
  },
  footer: { location: 'Mattia Callegher — Italia', email: 'Email', github: 'GitHub', source: 'Codice' },
};
