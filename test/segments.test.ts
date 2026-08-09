import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHIP_ATTR, MARKER_ATTR, ZWSP, readSegments, toPlainText } from '../lib/segments.ts';

/**
 * Minimal stand-ins for DOM nodes. readSegments deliberately checks `nodeType`
 * rather than `instanceof HTMLElement`, so it can be driven without a browser
 * — these satisfy exactly the surface it touches.
 */
type Stub = { nodeType: number; textContent?: string; tagName?: string; attrs?: Record<string, string>; childNodes: Stub[]; nextSibling?: Stub | null };

const text = (value: string): Stub => ({ nodeType: 3, textContent: value, childNodes: [] });

const el = (tagName: string, children: Stub[] = [], attrs: Record<string, string> = {}): Stub => {
  children.forEach((c, i) => {
    c.nextSibling = children[i + 1] ?? null;
  });
  return { nodeType: 1, tagName, attrs, childNodes: children };
};

const br = () => el('BR');
const chip = (id: string, name: string) => el('SPAN', [], { [CHIP_ATTR]: id, 'data-chip-name': name });
const marker = () => el('SPAN', [text(ZWSP)], { [MARKER_ATTR]: '1' });

/** Give the stub tree the two Element methods readSegments calls, then run it. */
const plain = (root: Stub) => {
  const decorate = (n: Stub) => {
    (n as unknown as Element).getAttribute = (name: string) => n.attrs?.[name] ?? null;
    n.childNodes.forEach(decorate);
  };
  decorate(root);
  return toPlainText(readSegments(root as unknown as Node));
};

test('an empty editor produces nothing', () => {
  assert.equal(plain(el('ROOT')), '');
});

test('a lone filler <br> is not content', () => {
  // Matters for the placeholder: an "empty" editor must parse to no segments,
  // or the placeholder stays hidden forever after the first edit.
  assert.equal(plain(el('ROOT', [br()])), '');
  assert.equal(plain(el('ROOT', [el('DIV', [br()])])), '');
});

test('plain text passes through', () => {
  assert.equal(plain(el('ROOT', [text('hello')])), 'hello');
});

test('chrome represents lines as divs', () => {
  assert.equal(plain(el('ROOT', [text('a'), el('DIV', [text('b')])])), 'a\nb');
  assert.equal(plain(el('ROOT', [el('DIV', [text('a')]), el('DIV', [text('b')])])), 'a\nb');
});

test('firefox represents lines as bare <br>s', () => {
  assert.equal(plain(el('ROOT', [text('a'), br(), text('b')])), 'a\nb');
  assert.equal(plain(el('ROOT', [text('a'), br(), br(), text('b')])), 'a\n\nb');
});

test('a blank line counts once, not twice', () => {
  // The regression: chrome writes an empty line as <div><br></div>, and the
  // block boundary and the filler <br> each emitted a newline.
  assert.equal(plain(el('ROOT', [text('a'), el('DIV', [br()]), el('DIV', [text('b')])])), 'a\n\nb');
});

test('a leading blank line is preserved', () => {
  assert.equal(plain(el('ROOT', [el('DIV', [br()]), el('DIV', [text('a')])])), '\na');
});

test('a trailing filler <br> adds nothing', () => {
  assert.equal(plain(el('ROOT', [text('a'), br()])), 'a');
});

test('chips serialize as entities and survive line breaks', () => {
  assert.equal(plain(el('ROOT', [text('to '), chip('paris', 'Paris'), text(' now')])), 'to @Paris now');
  assert.equal(plain(el('ROOT', [text('a'), el('DIV', [chip('rome', 'Rome')])])), 'a\n@Rome');
});

test('the invisible query marker is never serialized', () => {
  assert.equal(plain(el('ROOT', [text('a'), marker(), text('@b')])), 'a@b');
});

test('zero-width spaces are stripped from text', () => {
  assert.equal(plain(el('ROOT', [text(`a${ZWSP}b`)])), 'ab');
});

test('adjacent text nodes merge into one segment', () => {
  const segs = readSegments(
    (() => {
      const root = el('ROOT', [text('a'), text('b')]);
      const decorate = (n: Stub) => {
        (n as unknown as Element).getAttribute = (name: string) => n.attrs?.[name] ?? null;
        n.childNodes.forEach(decorate);
      };
      decorate(root);
      return root as unknown as Node;
    })(),
  );
  assert.deepEqual(segs, [{ type: 'text', value: 'ab' }]);
});
