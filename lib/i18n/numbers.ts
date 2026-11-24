import type { Lang } from './index';

const WORDS: Record<Lang, readonly string[]> = {
  en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'],
  it: ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci', 'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove', 'venti'],
};

/** A count as the copy writes it, opening a sentence: "Seven", "Sette".
    Words up to twenty, digits past it. */
export function countWord(lang: Lang, n: number) {
  const word = WORDS[lang][n] ?? String(n);
  return word.charAt(0).toUpperCase() + word.slice(1);
}
