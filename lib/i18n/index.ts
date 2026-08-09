import type { DemoSlug } from '../demos';
import { en } from './en';
import { it } from './it';

export type Lang = 'en' | 'it';

/** URL prefix for a language ('' for en, '/it' for it). */
export const prefix = (lang: Lang) => (lang === 'it' ? '/it' : '');

export interface Dict {
  description: string;
  hero: {
    line1: string;
    line2: string;
    metaRow: string[];
    blurb: string;
  };
  work: {
    header: string;
    items: { title: string; where: string; text: string }[];
    fullHistory: string;
    cvLabel: string;
  };
  contact: { header: string };
  playground: {
    title: string;
    intro: string;
    openLabel: string;
    sourceLabel: string;
    loading: string;
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
  about: { title: string; paragraphs: string[] };
  stack: {
    title: string;
    sourcePre: string;
    sourceLabel: string;
    sections: { title: string; items: string[] }[];
    aiLine: string;
  };
  footer: { location: string; email: string; github: string; source: string };
  skipToContent: string;
}

export const DICTS: Record<Lang, Dict> = { en, it };
