import type { Dict } from './index';

export const it: Dict = {
  description:
    'Sviluppatore frontend e QA engineer. React, Next.js, TypeScript, Playwright. Vivo in Italia e mi piacerebbe lavorare in Giappone.',
  hero: {
    line1: 'Sviluppatore frontend',
    line2: '& QA engineer',
    metaRow: ['Vivo in Italia', 'Mi piacerebbe lavorare in Giappone', 'React · Next.js · TypeScript · Playwright'],
    blurb:
      'Costruisco web app con React, Next.js e TypeScript. Ho lavorato a lungo in QA, quindi quello che costruisco lo testo anche.',
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
      'Cose che ho costruito e che trovavo troppo interessanti — o troppo assurde — per buttarle via. Alcune sono finite in produzione, altre non sono mai uscite dal cassetto.',
    demo: {
      title: 'Drive-in cards',
      caption:
        'Morphing di path SVG guidato dallo scroll: gli elementi arrivano come furgoncini e parcheggiano trasformandosi in card. Al passaggio del mouse una card parcheggiata si risveglia. Scorri all’interno del riquadro.',
      open: 'Apri ↗',
      source: 'Codice ↗',
    },
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
          'Onest + IBM Plex Mono, self-hosted — nessuna richiesta verso terze parti',
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
