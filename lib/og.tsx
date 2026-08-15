import { ImageResponse } from 'next/og';
import { DICTS, type Lang } from './i18n';

/**
 * The social card, shared by both language trees — `app/(en)/opengraph-image.tsx`
 * and `app/(it)/opengraph-image.tsx` are two-line files that call this.
 *
 * Rendered to a PNG at build time and written into ./out, so nothing runs in
 * production. Copy comes from the dictionaries, so the card and the hero it
 * mirrors cannot drift apart.
 *
 * Satori (what powers ImageResponse) supports a subset of CSS: flexbox only,
 * `display: flex` spelled out on anything with more than one child, and no
 * Tailwind — hence the literal hex values instead of var(--color-*).
 */
/**
 * Drawn at 2x the 1200x630 the platforms ask for. They all downscale and
 * re-encode to JPEG, and the card is displayed around 600 CSS px wide — which
 * is 1200+ device pixels on any modern screen, leaving a 1200px asset with no
 * headroom at all and turning the small type to mush. Rendering at 2400x1260
 * gives their pipeline something to throw away. Facebook's own guidance says
 * to exceed 1200x630 for high-resolution devices; 2400x1260 is inside
 * LinkedIn's and Twitter's limits, and this is flat colour, so the PNG stays
 * small despite the pixel count.
 *
 * Every dimension below is written at 1x and passed through `px()`, so the
 * layout stays legible and the scale is one number to change.
 */
const SCALE = 2;
const px = (n: number) => n * SCALE;

export const size = { width: px(1200), height: px(630) };
export const contentType = 'image/png';

const BACKGROUND = '#182454';
const BACKGROUND_EDGE = '#17224f';
const FOREGROUND = '#e8eef6';
const MUTED = '#9fb3c8';
const ACCENT = '#46a08e';

export const ogAlt = (lang: Lang) =>
  `Mattia Callegher — ${DICTS[lang].hero.line1} ${DICTS[lang].hero.line2}`;

export function ogImage(lang: Lang) {
  const dict = DICTS[lang];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: `${px(72)}px ${px(80)}px`,
          backgroundColor: BACKGROUND,
          backgroundImage: `linear-gradient(180deg, ${BACKGROUND} 0%, ${BACKGROUND_EDGE} 100%)`,
          color: FOREGROUND,
        }}
      >
        <div style={{ display: 'flex', fontSize: px(30), fontWeight: 600, letterSpacing: '-0.02em' }}>
          Mattia Callegher
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: px(82), fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            {dict.hero.line1}
          </div>
          <div style={{ display: 'flex', fontSize: px(82), fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            {dict.hero.line2}
            <span style={{ color: ACCENT }}>.</span>
          </div>
        </div>

        {/* The hairline rule the site opens every section with. */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', height: px(1), backgroundColor: '#3d476f' }} />
          <div
            style={{
              display: 'flex',
              marginTop: px(24),
              fontSize: px(24),
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: MUTED,
            }}
          >
            {dict.hero.metaRow.join('  ·  ')}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
