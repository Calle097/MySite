import { ImageResponse } from 'next/og';
import { DICTS, type Lang } from './i18n';
import { NAME } from './site';

/**
 * The social card for both language trees, rendered to a PNG at build time
 * from the dictionaries. Satori draws it: flexbox only (`display: flex` on
 * anything with several children) and no Tailwind, hence the hex values.
 *
 * Drawn at 2x the 1200x630 the platforms ask for, so their downscaling and
 * re-encoding leaves the small type sharp on high-density screens. Sizes are
 * written at 1x and go through px().
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
  `${NAME} — ${DICTS[lang].hero.line1} ${DICTS[lang].hero.line2}`;

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
          {NAME}
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
