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
        title: 'Sviluppatore frontend e consulente IT',
        where: '2020 — 2024',
        text: 'Dipendente di un’azienda informatica. Web app in React + TypeScript, tra cui un gestionale per una catena di palestre usato da più di 500 persone.',
      },
      {
        title: 'QA engineer, in distacco',
        where: '2020 — 2023',
        text: 'In distacco per conto della stessa azienda come QA su una piattaforma di smart metering nel settore energetico, poi come test manager.',
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
      'Cose che ho costruito e che mi sembravano troppo interessanti, o troppo "uniche", per farle sparire. Alcune sono finite in produzione, altre no.',
    openLabel: 'Apri ↗',
    sourceLabel: 'Codice ↗',
    loading: 'caricamento',
    demos: [
      {
        slug: 'drive-in',
        title: 'Drive-in cards',
        caption:
          'Path SVG che si trasformano con lo scroll: gli elementi arrivano come furgoncini e diventano card quando si fermano. Passa il mouse su una card per riattivarla. Scorri dentro il riquadro.',
      },
      {
        slug: 'spiral',
        title: 'Spirale aurea',
        caption:
          '500 punti disposti secondo l’angolo aureo, lo stesso schema dei semi di girasole. Un impulso si propaga verso l’esterno all’infinito. Nessuna libreria, solo SVG.',
      },
      {
        slug: 'css-effects',
        title: 'Effetti solo CSS',
        caption:
          'Un bottone con effetto gelatina e un anello di evidenziazione che ruota, ritagliato da un gradiente conico con mask-composite. Solo CSS, niente JavaScript.',
      },
      {
        slug: 'sakura',
        title: 'Badge sakura',
        caption:
          'Un piccolo badge con petali di ciliegio che cadono al suo interno. Le posizioni dei petali sono casuali e generate lato client per evitare problemi di hydration.',
      },
      {
        slug: 'time-picker',
        title: 'Time picker',
        caption:
          'Fatto per un progetto cliente dopo che tutti i time picker gratuiti che ho provato avevano qualche problema: valori controllati, scroll su mobile, popover tagliati. Era più veloce scriverne uno: selezione confermata con OK, scorciatoia “adesso”, fasce orarie disabilitabili.',
      },
      {
        slug: 'chip-composer',
        title: 'Composer con chip',
        caption:
          'Scrivi @ e scegli una destinazione: diventa una chip che il cursore non può spezzare. Fatto con Range e Selection del DOM, senza librerie per editor — la palette si aggancia al cursore e il pannello sotto mostra come viene serializzato il messaggio.',
      },
      {
        slug: 'transit-drag',
        title: 'Transit drag',
        caption:
          'Una giornata di attività con un treno in mezzo. Trascina il treno (o usa le frecce) e tutti gli orari successivi si ricalcolano: trasferimenti, partenza, l’intero pomeriggio.',
      },
    ],
  },
  demoNoscript: 'Questa demo ha bisogno di JavaScript.',
  demoCss: {
    hint: 'Qui è tutto CSS — niente JavaScript.',
    button: 'Passaci sopra',
    card: 'Anello di evidenziazione',
  },
  demoSakura: { label: 'Fioritura dei ciliegi' },
  demoTimePicker: {
    labels: { hours: 'Ore', minutes: 'Minuti', now: 'Adesso', ok: 'OK' },
    hint: 'Scegli un orario',
    picked: 'Scelto:',
  },
  demoComposer: {
    hint: 'Scrivi @ per inserire una destinazione',
    empty: 'Scrivi qualcosa — poi digita @ …',
    serialized: 'Serializzato',
    plain: 'Testo semplice',
    entities: 'Entità',
    clear: 'Pulisci',
    noResults: 'Nessun risultato',
  },
  demoTransit: {
    hint: 'Trascina il treno, o usa le frecce: tutti gli orari si ricalcolano',
    dropHint: 'Sposta il treno qui',
    walk: '15 min di trasferimento',
    activities: [
      { title: 'Giro del centro storico', minutes: 60 },
      { title: 'Mercato e caffè', minutes: 45 },
      { title: 'Santuario sul mare', minutes: 40 },
      { title: 'Giardino botanico', minutes: 60 },
      { title: 'Onsen', minutes: 90 },
    ],
    train: { from: 'Kamakura', to: 'Hakone', duration: '1 h 25 min' },
  },
  projects: {
    header: 'Progetti recenti',
    items: [
      {
        title: 'Piattaforma per pianificare viaggi',
        text: 'Frontend e un po’ di backend su una grande app Next.js 15: chat AI in streaming via SSE, una mappa MapLibre persistente in una parallel route che sopravvive alla navigazione, modali con URL reali tramite intercepting routes, pagamenti con Stripe, integrazioni REST per trasporti e hotel, sei lingue, cache delle query persistita su IndexedDB.',
        stack: 'Stack: TypeScript · Tailwind · Zustand · TanStack Query · react-map-gl · autenticazione Firebase · Playwright',
      },
      {
        title: 'Sito per il noleggio di camper',
        text: 'Sito vetrina e prenotazioni per un servizio di noleggio camper. I furgoncini del playground nascono qui, ma non sono mai stati pubblicati.',
        stack: 'Stack: Next.js · Tailwind · Framer Motion',
      },
    ],
  },
  about: {
    title: 'Chi sono',
    paragraphs: [
      'All’università ho studiato cinema e media. Poi ho imparato a programmare da autodidatta, e non ho più smesso.',
      'Il mio primo lavoro tech è stato in un’azienda informatica: sviluppo frontend con React e, in parallelo, il distacco come QA su un grande sistema di smart metering — prima test manuali, poi automazione con Playwright, fino a coordinare la parte QA.',
      'Oggi lavoro come freelance dall’Italia e mi piacerebbe trasferirmi in Giappone per lavoro.',
    ],
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
  skipToContent: 'Vai al contenuto',
};
