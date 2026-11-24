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
 * The current page's path in another language. Strips any /it prefix to get
 * the English path, then builds the Italian one back from it, so both are
 * derived the same way and keep the trailing slash the rest of the site
 * uses (next.config `trailingSlash`); building them independently once
 * handed back a slashless '/it' for home, costing a redirect per switch.
 * The lookahead anchors on '/it' only when the next character ends the
 * segment, so a future '/italy' route would not be mangled.
 */
export function pathIn(lang: Lang, pathname: string) {
  const enPath = pathname.replace(/^\/it(?=\/|$)/, '') || '/';
  if (lang === 'en') return enPath;
  return enPath === '/' ? '/it/' : `/it${enPath}`;
}

/** Remembers a chosen language, so the root layouts' locale script keeps
    future visits on it. Private mode etc.: switching still works, it just
    isn't remembered. */
export function rememberLang(lang: Lang) {
  try {
    localStorage.setItem('site-lang', lang);
  } catch {
    /* not remembered, that's all */
  }
}

export interface Dict {
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
    /** The fancier playground's line under the intro. */
    summary: string;
    /** How each demo is listed on the playground page. Keyed by slug rather
        than ordered, so EN and IT cannot drift apart — display order comes
        from DEMO_SLUGS. Record<DemoSlug, …> means adding a demo without
        writing both translations is a compile error. */
    items: Record<DemoSlug, { title: string; caption: string }>;
  };
  /** Strings used *inside* the demos themselves, as opposed to
      `playground.items`, which is how they are listed on the index page. */
  demos: {
    driveIn: {
      scroll: string;
      hover: string;
      noscript: string;
      items: { title: string; text: string }[];
    };
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
      /** Journey length in minutes — the displayed "1 h 25 min" is derived
          from this, so the label and the arrival arithmetic cannot disagree. */
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
    hints: { home: string; about: string; playground: string; stack: string; cv: string };
  };
  /** The fancier version's header uses plain words instead of the /path labels; the
      rest names the parts of its menu and index. */
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
