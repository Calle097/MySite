/** "01", "02"… — section numbering, everywhere it appears (both versions). */
export const twoDigits = (n: number) => String(n).padStart(2, '0');

/** A section's anchor, from its English title ("First job" → "first-job"),
    so both languages' pages share the same ids. */
export const sectionId = (englishTitle: string) =>
  englishTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
