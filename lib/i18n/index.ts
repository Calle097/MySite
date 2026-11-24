import type { DemoSlug } from '../demos';
import { en } from './en';
import { it } from './it';

export type Lang = 'en' | 'it';

/** URL prefix for a language ('' for en, '/it' for it). */
export const prefix = (lang: Lang) => (lang === 'it' ? '/it' : '');

/** Every language, named in itself, in display order. */
export const LANGUAGES: readonly { lang: Lang; name: string }[] = [
  { lang: 'en', name: 'English' },
  { lang: 'it', name: 'Italiano' },
];

/**
 * The current page's path in another language: the English path first (any
 * /it prefix stripped, and only a whole /it segment, so /italy survives),
 * then the Italian one built from it, both with the trailing slash the site
 * uses.
 */
export function pathIn(lang: Lang, pathname: string) {
  const enPath = pathname.replace(/^\/it(?=\/|$)/, '') || '/';
  if (lang === 'en') return enPath;
  return enPath === '/' ? '/it/' : `/it${enPath}`;
}

/** Where the chosen language is kept (read back by ./locale-script.ts). */
export const LANG_KEY = 'site-lang';

/** Remembers a chosen language, so the root layouts' locale script keeps
    future visits on it. Private mode etc.: switching still works, it just
    isn't remembered. */
export function rememberLang(lang: Lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* not remembered, that's all */
  }
}

export interface Dict {
  /** After the name in the page title: "Mattia Callegher — {role}". */
  role: string;
  description: string;
  hero: {
    line1: string;
    line2: string;
    /** Plain shows all three; the fancier version, the first two. */
    metaRow: [place: string, wish: string, stack: string];
    blurb: string;
  };
  work: {
    header: string;
    items: { title: string; where: string; text: string }[];
    fullHistory: string;
    cvLabel: string;
  };
  /** write: the fancier version's "Write ↗" action next to the address. */
  contact: { header: string; copy: string; copied: string; write: string };
  playground: {
    title: string;
    intro: string;
    openLabel: string;
    sourceLabel: string;
    loading: string;
    /** The fancier home's playground teaser: "{open} · {count} →". */
    open: string;
    /** The fancier playground's line under the intro; counts the demos. */
    summary: string;
    /** Keyed by slug (order comes from DEMO_SLUGS), so a demo without both
        translations is a compile error. */
    items: Record<DemoSlug, { title: string; caption: string }>;
  };
  /** Strings inside the demos themselves. */
  demos: {
    driveIn: {
      scroll: string;
      hover: string;
      items: { title: string; text: string }[];
    };
    /** Shown by every demo that needs JavaScript (lib/demos.ts) when it is off. */
    noscript: string;
    css: { hint: string; button: string; card: string };
    sakura: { label: string };
    timePicker: {
      labels: { hours: string; minutes: string; now: string; ok: string };
      hint: string;
      picked: string;
    };
    composer: {
      hint: string;
      empty: string;
      serialized: string;
      plain: string;
      entities: string;
      clear: string;
      noResults: string;
      /** Screen-reader label for a chip's × button; {name} is the destination. */
      removeChip: string;
      editorLabel: string;
      resultsLabel: string;
    };
    transit: {
      hint: string;
      dropHint: string;
      walk: string;
      earlier: string;
      later: string;
      activities: { title: string; minutes: number }[];
      /** In minutes: the "1 h 25 min" label and the arrival time both come
          from it. */
      train: { from: string; to: string; minutes: number };
    };
  };
  projects: { header: string; items: { title: string; text: string; stack?: string }[] };
  /** Plain shows the parts' text as one block; the fancier version gives
      each part its own section, under its title. */
  about: { title: string; parts: { title: string; text: string }[] };
  stack: {
    title: string;
    sourcePre: string;
    sourceLabel: string;
    /** An item is the same in both versions, or (the JavaScript line) one
        text per version. */
    sections: { title: string; items: (string | { plain: string; fancier: string })[] }[];
    aiLine: string;
  };
  /** text/back: plain's line. title/where/hints: the fancier version's
      column and its "where to go" list, one hint per page. */
  notFound: {
    text: string;
    back: string;
    title: string;
    where: string;
    /** playground counts the demos. */
    hints: { home: string; about: string; playground: string; stack: string; cv: string };
  };
  /** Page names in words (plain's header uses /paths), and the parts of the
      fancier version's menu and index. */
  nav: {
    home: string;
    about: string;
    playground: string;
    stack: string;
    cv: string;
    menu: string;
    close: string;
    pages: string;
    onThisPage: string;
    index: string;
    /** The index's label on a demo page, which lists every demo. */
    demos: string;
    language: string;
  };
  /** The two versions: plain, and the fancier one (called "fancy" in the code). */
  mode: {
    /** Hero line in plain mode: "{plainNote} {showFancier}". */
    plainNote: string;
    showFancier: string;
    /** The switch in the plain header, next to the name. */
    getFancy: string;
    /** The fancier one's version switch: "{version}  {plain} · {fancier}". */
    version: string;
    plain: string;
    fancier: string;
  };
  /** elsewhere: screen-reader name of the footer's links. */
  footer: { location: string; email: string; github: string; source: string; elsewhere: string };
  skipToContent: string;
}

export const DICTS: Record<Lang, Dict> = { en, it };
