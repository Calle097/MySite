import { SOURCE_URL } from './site';

/**
 * The playground's demos. The slug joins the route folder, the dictionaries'
 * entries and the details below; it's a union, so a missing or misspelled
 * entry anywhere is a compile error. The order here is the playground's.
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

const REPO = `${SOURCE_URL}/blob/main`;

interface Demo {
  /** Frame height in the playground — scroll-driven demos need the room. */
  height: string;
  /** File the "Source ↗" link opens. */
  source: string;
  /** What it is built with, shown under the demo in the fancier version. */
  tech: string;
  /** Without JavaScript it shows nothing useful, so DemoLayout says so. */
  needsJs: boolean;
}

export const DEMOS: Record<DemoSlug, Demo> = {
  'drive-in': {
    height: 'h-[400px] sm:h-[540px]',
    source: `${REPO}/components/demos/DriveInCards.tsx`,
    tech: 'SVG · Framer Motion',
    needsJs: true,
  },
  spiral: {
    height: 'h-[380px] sm:h-[420px]',
    source: `${REPO}/components/demos/SpiralDots.tsx`,
    tech: 'SVG',
    needsJs: true,
  },
  'css-effects': {
    height: 'h-[340px]',
    source: `${REPO}/components/demos/css-effects.css`,
    tech: 'CSS',
    needsJs: false,
  },
  sakura: {
    height: 'h-[260px]',
    source: `${REPO}/components/demos/SakuraBadge.tsx`,
    tech: 'React · CSS',
    needsJs: false,
  },
  'time-picker': {
    height: 'h-[420px]',
    source: `${REPO}/components/demos/TimePicker.tsx`,
    tech: 'React',
    needsJs: true,
  },
  'chip-composer': {
    height: 'h-[480px]',
    source: `${REPO}/components/demos/ChipComposer.tsx`,
    tech: 'DOM Ranges',
    needsJs: true,
  },
  'transit-drag': {
    height: 'h-[560px] sm:h-[640px]',
    source: `${REPO}/components/demos/TransitDragDemo.tsx`,
    tech: 'Drag and drop',
    needsJs: true,
  },
};
