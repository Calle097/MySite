// When a demo page runs inside the playground iframe, hide its scrollbar
// rail (scrolling still works). Standalone visits keep the scrollbar.
// Inline script, not an effect: it runs during HTML parse, before first
// paint, so the scrollbar never flashes while the bundle loads.
const SCRIPT = `if(self!==top)document.documentElement.classList.add('embedded');`;

export function EmbedFrameTweaks() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
