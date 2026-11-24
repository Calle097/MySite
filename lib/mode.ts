/**
 * Plain / fancy: the site's two looks (on screen the fancy one is called
 * "the fancier one").
 *
 * The mode is one attribute on <html>: data-mode="fancy" when on, absent
 * when plain. app/fancy.css keys every fancy style off it, so plain mode
 * never matches any of it.
 *
 * MODE_SCRIPT runs inline in <head> before the first paint (both root
 * layouts), so a visitor who chose fancy never sees the plain page first.
 * It also sets data-js, which reveals the switches (they cannot work without
 * JavaScript), and re-applies on the `storage` event: that fires in every
 * other document of the site when the choice changes, so other tabs and the
 * playground's iframes follow the switch live.
 *
 * Components that care (the reveal observer, the light, the menus) listen
 * for MODE_EVENT on window, fired whenever the mode changes in this
 * document.
 */

import { EASE, circleFrames, reducedMotion } from './motion';

export const MODE_KEY = 'site-mode';
export const MODE_EVENT = 'site:mode';

export const MODE_SCRIPT = `(function(){try{
var d=document.documentElement;
d.setAttribute('data-js','');
function apply(){var m=null;
try{m=localStorage.getItem('${MODE_KEY}');}catch(e){}
if(m==='fancy')d.setAttribute('data-mode','fancy');else d.removeAttribute('data-mode');}
apply();
addEventListener('storage',function(e){if(e.key==='${MODE_KEY}'){apply();dispatchEvent(new Event('${MODE_EVENT}'));}});
}catch(e){}})();`;

/** How long the entrance choreography runs after switching to fancy;
    app/fancy.css can key entrance delays off data-entering while it lasts. */
const ENTERING_MS = 1800;
let switching = false;

/**
 * Flip the mode with the circle reveal: the browser snapshots the page, the
 * attribute changes, and the new look grows from (x, y), or, going back to
 * plain, the fancy look shrinks into it. Browsers without View Transitions,
 * and visitors who asked for reduced motion, get the change at once.
 */
export async function switchMode(x: number, y: number) {
  if (switching) return;
  switching = true;

  const html = document.documentElement;
  const toFancy = html.dataset.mode !== 'fancy';
  const apply = () => {
    if (toFancy) {
      html.dataset.mode = 'fancy';
      html.dataset.entering = '';
      setTimeout(() => delete html.dataset.entering, ENTERING_MS);
    } else {
      delete html.dataset.mode;
    }
    try {
      localStorage.setItem(MODE_KEY, toFancy ? 'fancy' : 'plain');
    } catch {
      /* private mode etc. — switching still works, just not remembered */
    }
    // Synchronous, inside the transition's update: listeners (the reveal
    // observer) put the page into its "before" state in time for the
    // browser's snapshot of the new look.
    window.dispatchEvent(new Event(MODE_EVENT));
  };

  try {
    if (!document.startViewTransition || reducedMotion()) {
      apply();
      return;
    }

    // Going back, the old (fancy) picture has to sit on top so it can
    // shrink away; app/fancy.css reads this attribute.
    html.dataset.vt = toFancy ? 'in' : 'out';
    const transition = document.startViewTransition(apply);
    await transition.ready;

    const circle = circleFrames(x, y);
    const reveal = html.animate(
      { clipPath: toFancy ? circle : [...circle].reverse() },
      {
        duration: 800,
        easing: EASE,
        // Hold the last frame until the browser tears the transition down.
        // Without it, the shrinking fancy picture snapped back to full size
        // for one frame first: the flash when returning to plain.
        fill: 'forwards',
        pseudoElement: toFancy ? '::view-transition-new(root)' : '::view-transition-old(root)',
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
