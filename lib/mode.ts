/**
 * Plain / fancy, the site's two looks: one attribute on <html>,
 * data-mode="fancy", which every fancier style is scoped to.
 *
 * MODE_SCRIPT runs in <head> before the first paint, so a visitor who chose
 * fancy never sees plain first. It also sets data-js (the switches need
 * JavaScript, so they show only with it) and follows the `storage` event, so
 * other tabs and the playground's iframes switch along. MODE_EVENT fires on
 * window whenever the mode changes in this document.
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

let switching = false;

/**
 * Flips the mode with a circle that grows from (x, y) over the old look or,
 * going back to plain, shrinks the fancy look into it. Without View
 * Transitions, or with reduced motion, the change is immediate.
 */
export async function switchMode(x: number, y: number) {
  if (switching) return;
  switching = true;

  const html = document.documentElement;
  const toFancy = html.dataset.mode !== 'fancy';
  const apply = () => {
    if (toFancy) html.dataset.mode = 'fancy';
    else delete html.dataset.mode;
    try {
      localStorage.setItem(MODE_KEY, toFancy ? 'fancy' : 'plain');
    } catch {
      // Private mode: the switch works, it just isn't remembered.
    }
    // Inside the transition's update, so listeners (the reveal observer) set
    // the page's "before" state in time for the snapshot of the new look.
    window.dispatchEvent(new Event(MODE_EVENT));
  };

  try {
    if (!document.startViewTransition || reducedMotion()) {
      apply();
      return;
    }

    // Going back, the old picture must sit on top to shrink away (base.css).
    if (!toFancy) html.dataset.vt = 'out';
    const transition = document.startViewTransition(apply);
    await transition.ready;

    const circle = circleFrames(x, y);
    const reveal = html.animate(
      { clipPath: toFancy ? circle : [...circle].reverse() },
      {
        duration: 800,
        easing: EASE,
        // Holds the last frame until the transition ends; otherwise the
        // shrunk picture flashes back to full size for one frame.
        fill: 'forwards',
        pseudoElement: toFancy ? '::view-transition-new(root)' : '::view-transition-old(root)',
      },
    );
    await transition.finished;
    reveal.cancel();
  } catch {
    // A skipped transition rejects; the change itself is already applied.
  } finally {
    delete html.dataset.vt;
    switching = false;
  }
}
