/**
 * The one registry of playground demos.
 *
 * A demo's slug is the join key across four places: the route folder
 * (app/(en)/demos/<slug>/), the dictionary entry that titles and captions it,
 * and the frame height + source link below. It used to be a bare string in
 * three separate `Record<string, …>` maps, where a typo fell back to a default
 * height and silently dropped the "Source ↗" link — the build stayed green.
 *
 * `DemoSlug` is a union, so every lookup is a `Record<DemoSlug, …>` and a
 * missing or misspelled entry is a compile error instead.
 *
 * Order here is display order in the playground, which is also where the
 * section numbers come from — so the two languages can't drift apart.
 */
export const DEMO_SLUGS = [
  'drive-in',
  'spiral',
  'css-effects',
  'sakura',
  'time-picker',
  'chip-composer',
  'transit-drag',
] as const;

export type DemoSlug = (typeof DEMO_SLUGS)[number];

const REPO = 'https://github.com/Calle097/MySite/blob/main';

interface Demo {
  /** Frame height in the playground — scroll-driven demos need the room. */
  height: string;
  /** File the "Source ↗" link opens. */
  source: string;
  /** What it is built with, shown under the demo in the fancier version. */
  tech: string;
}

export const DEMOS: Record<DemoSlug, Demo> = {
  'drive-in': {
    height: 'h-[400px] sm:h-[540px]',
    source: `${REPO}/components/demos/DriveInCards.tsx`,
    tech: 'SVG · Framer Motion',
  },
  spiral: {
    height: 'h-[380px] sm:h-[420px]',
    source: `${REPO}/components/demos/SpiralDots.tsx`,
    tech: 'SVG',
  },
  'css-effects': {
    height: 'h-[340px]',
    source: `${REPO}/components/demos/css-effects.css`,
    tech: 'CSS',
  },
  sakura: {
    height: 'h-[260px]',
    source: `${REPO}/components/demos/SakuraBadge.tsx`,
    tech: 'React · CSS',
  },
  'time-picker': {
    height: 'h-[420px]',
    source: `${REPO}/components/demos/TimePicker.tsx`,
    tech: 'React',
  },
  'chip-composer': {
    height: 'h-[480px]',
    source: `${REPO}/components/demos/ChipComposer.tsx`,
    tech: 'DOM Ranges',
  },
  'transit-drag': {
    height: 'h-[560px] sm:h-[640px]',
    source: `${REPO}/components/demos/TransitDragDemo.tsx`,
    tech: 'Drag and drop',
  },
};
