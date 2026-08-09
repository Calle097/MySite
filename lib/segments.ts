/**
 * Serializing a contenteditable subtree into typed segments — the thing the
 * chip composer's readout displays, and the part of that demo that has been
 * wrong most often. Kept out of the component so test/segments.test.ts can
 * drive the real function against the DOM shapes browsers actually produce.
 */

export const ZWSP = '​';
export const MARKER_ATTR = 'data-marker';
export const CHIP_ATTR = 'data-chip-id';

/** Elements contenteditable uses to start a new line. */
const BLOCK_TAGS = new Set(['DIV', 'P', 'LI', 'BLOCKQUOTE', 'PRE', 'H1', 'H2', 'H3']);

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

export type Segment = { type: 'text'; value: string } | { type: 'chip'; id: string; name: string };

export function readSegments(root: Node): Segment[] {
  const segments: Segment[] = [];

  const pushText = (value: string) => {
    const clean = value.replaceAll(ZWSP, '');
    if (!clean) return;
    const last = segments.at(-1);
    if (last?.type === 'text') last.value += clean;
    else segments.push({ type: 'text', value: clean });
  };

  // Browsers disagree about how a new line is represented. Firefox emits bare
  // <br>s; Chrome wraps each line in a <div> and puts a filler <br> inside an
  // empty one. So a line break is "entering a block after the first" OR "a
  // <br> that has something after it" — a trailing <br> exists only to give an
  // empty block height, and counting it too doubled every blank line.
  let blocksSeen = 0;

  const walk = (node: Node) => {
    if (node.nodeType === TEXT_NODE) return pushText(node.textContent ?? '');
    // nodeType rather than `instanceof HTMLElement`: instanceof is bound to one
    // realm, so it silently fails for nodes from another document — and it also
    // makes this function impossible to exercise outside a browser.
    if (node.nodeType !== ELEMENT_NODE) return;
    const el = node as Element;

    if (el.getAttribute(MARKER_ATTR) !== null) return;

    const chipId = el.getAttribute(CHIP_ATTR);
    if (chipId !== null) {
      segments.push({ type: 'chip', id: chipId, name: el.getAttribute('data-chip-name') ?? '' });
      return;
    }

    if (el.tagName === 'BR') {
      if (el.nextSibling) pushText('\n');
      return;
    }

    if (BLOCK_TAGS.has(el.tagName)) {
      if (blocksSeen > 0 || segments.length > 0) pushText('\n');
      blocksSeen++;
    }

    el.childNodes.forEach(walk);
  };

  root.childNodes.forEach(walk);
  return segments;
}

/** The segments rendered as the plain text the demo's readout shows. */
export const toPlainText = (segments: Segment[]) =>
  segments.map((s) => (s.type === 'text' ? s.value : `@${s.name}`)).join('');
