/**
 * Plain / lively mode.
 *
 * The mode is one attribute on <html>: data-mode="lively" when on, absent
 * when plain. app/lively.css keys every lively style off it, so plain mode
 * never matches any of it.
 *
 * MODE_SCRIPT runs inline in <head> before the first paint (both root
 * layouts), so a visitor who chose lively never sees the plain page first.
 * It also sets data-js, which reveals the switches (they cannot work without
 * JavaScript), and re-applies on the `storage` event: that fires in every
 * other document of the site when the choice changes, so other tabs and the
 * playground's iframes follow the switch live.
 *
 * Components that care (the reveal observer, the light band) listen for
 * MODE_EVENT on window, fired whenever the mode changes in this document.
 *
 * TUNE_* is branch-only scaffolding for choosing the lively design. Remove
 * it together with components/lab/TuneBar.tsx once the design is decided.
 */

export const MODE_KEY = 'site-mode';
export const TUNE_KEY = 'lively-tune';
export const MODE_EVENT = 'site:mode';

export const TUNE_OPTIONS = {
  palette: ['indigo', 'ink', 'forest', 'plum', 'petrol', 'oxblood', 'slate'],
  hero: ['moderate', 'large'],
  grid: ['always', 'switch'],
} as const;

export type TuneKey = keyof typeof TUNE_OPTIONS;
export type Tune = { [K in TuneKey]: (typeof TUNE_OPTIONS)[K][number] };

export const TUNE_DEFAULTS: Tune = { palette: 'indigo', hero: 'moderate', grid: 'always' };

const TUNE_KEYS = Object.keys(TUNE_OPTIONS) as TuneKey[];

export const MODE_SCRIPT = `(function(){try{
var d=document.documentElement;
d.setAttribute('data-js','');
function apply(){var m=null,t={};
try{m=localStorage.getItem('${MODE_KEY}');t=JSON.parse(localStorage.getItem('${TUNE_KEY}')||'{}')||{};}catch(e){}
if(m==='lively')d.setAttribute('data-mode','lively');else d.removeAttribute('data-mode');
${TUNE_KEYS.map((k) => `d.setAttribute('data-${k}',t.${k}||'${TUNE_DEFAULTS[k]}');`).join('\n')}}
apply();
addEventListener('storage',function(e){if(e.key==='${MODE_KEY}'||e.key==='${TUNE_KEY}'){apply();dispatchEvent(new Event('${MODE_EVENT}'));}});
}catch(e){}})();`;

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
/** How long the entrance choreography runs after switching to lively;
    app/lively.css keys the grid lines' draw and the reveal delays off
    data-entering while it lasts. */
const ENTERING_MS = 1800;
let switching = false;

/**
 * Flip the mode with the circle reveal: the browser snapshots the page, the
 * attribute changes, and the new look grows from (x, y), or, going back to
 * plain, the lively look shrinks into it. Browsers without View Transitions,
 * and visitors who asked for reduced motion, get the change at once.
 */
export async function switchMode(x: number, y: number) {
  if (switching) return;
  switching = true;

  const html = document.documentElement;
  const toLively = html.dataset.mode !== 'lively';
  const apply = () => {
    if (toLively) {
      html.dataset.mode = 'lively';
      html.dataset.entering = '';
      setTimeout(() => delete html.dataset.entering, ENTERING_MS);
    } else {
      delete html.dataset.mode;
    }
    try {
      localStorage.setItem(MODE_KEY, toLively ? 'lively' : 'plain');
    } catch {
      /* private mode etc. — switching still works, just not remembered */
    }
    // Synchronous, inside the transition's update: listeners (the reveal
    // observer) put the page into its "before" state in time for the
    // browser's snapshot of the new look.
    window.dispatchEvent(new Event(MODE_EVENT));
  };

  try {
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply();
      return;
    }

    // Going back, the old (lively) picture has to sit on top so it can
    // shrink away; app/lively.css reads this attribute.
    html.dataset.vt = toLively ? 'in' : 'out';
    const transition = document.startViewTransition(apply);
    await transition.ready;

    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const circle = [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`];
    const reveal = html.animate(
      { clipPath: toLively ? circle : [...circle].reverse() },
      {
        duration: 800,
        easing: EASE,
        // Hold the last frame until the browser tears the transition down.
        // Without it, the shrinking lively picture snapped back to full size
        // for one frame first: the flash when returning to plain.
        fill: 'forwards',
        pseudoElement: toLively ? '::view-transition-new(root)' : '::view-transition-old(root)',
      },
    );
    await transition.finished;
    reveal.cancel();
  } catch {
    // A skipped transition rejects; the change itself has still been applied.
  } finally {
    delete html.dataset.vt;
    switching = false;
  }
}
