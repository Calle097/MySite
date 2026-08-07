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
    demos: { slug: string; title: string; caption: string }[];
  };
  demoDriveIn: {
    scroll: string;
    hover: string;
    noscript: string;
    items: { title: string; text: string }[];
  };
  demoNoscript: string;
  demoCss: { hint: string; button: string; card: string };
  demoSakura: { label: string };
  projects: { header: string; items: { title: string; text: string }[] };
  about: { title: string; paragraphs: string[] };
  stack: {
    title: string;
    sourcePre: string;
    sourceLabel: string;
    sections: { index: string; title: string; items: string[] }[];
    aiLine: string;
  };
  footer: { location: string; email: string; github: string; source: string };
}

export const DICTS: Record<Lang, Dict> = { en, it };
