'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * An @-mention composer built directly on DOM Range/Selection — no Lexical,
 * no Slate. Typing @ inserts an invisible zero-width marker span; a palette
 * opens anchored to the caret's client rect; the live query is read by
 * building a Range from the marker to the caret. Picking a destination
 * replaces that range with an atomic contenteditable=false chip. The DOM is
 * re-serialized into typed segments after every change.
 */

export interface ComposerStrings {
  hint: string;
  empty: string;
  serialized: string;
  plain: string;
  entities: string;
  clear: string;
  noResults: string;
  /** Chip remove button label; '{name}' is replaced with the destination. */
  removeChip: string;
  editorLabel: string;
  resultsLabel: string;
}

type Destination = { id: string; name: string; keywords: string };

const DESTINATIONS: Destination[] = [
  { id: 'paris', name: 'Paris', keywords: 'louvre seine france' },
  { id: 'london', name: 'London', keywords: 'thames tube england' },
  { id: 'rome', name: 'Rome', keywords: 'colosseum italy' },
  { id: 'berlin', name: 'Berlin', keywords: 'wall germany' },
  { id: 'madrid', name: 'Madrid', keywords: 'prado spain' },
  { id: 'lisbon', name: 'Lisbon', keywords: 'tram hills portugal' },
  { id: 'vienna', name: 'Vienna', keywords: 'opera austria' },
  { id: 'prague', name: 'Prague', keywords: 'bridge castle czech' },
  { id: 'amsterdam', name: 'Amsterdam', keywords: 'canals netherlands' },
  { id: 'athens', name: 'Athens', keywords: 'acropolis greece' },
  { id: 'dublin', name: 'Dublin', keywords: 'pubs ireland' },
  { id: 'oslo', name: 'Oslo', keywords: 'fjord norway' },
  { id: 'warsaw', name: 'Warsaw', keywords: 'old town poland' },
  { id: 'budapest', name: 'Budapest', keywords: 'danube baths hungary' },
  { id: 'zurich', name: 'Zurich', keywords: 'lake switzerland' },
  { id: 'porto', name: 'Porto', keywords: 'douro wine portugal' },
];

const ZWSP = '​';
const MARKER_ATTR = 'data-marker';
const CHIP_ATTR = 'data-chip-id';

/** Palette width. One definition — it was previously stated three times (a
    local const, a `w-58` class, and an inline style that silently won). */
const PALETTE_WIDTH = 232;
const LISTBOX_ID = 'composer-destinations';
const optionId = (id: string) => `composer-option-${id}`;

type Segment = { type: 'text'; value: string } | { type: 'chip'; id: string; name: string };

function search(query: string): Destination[] {
  const q = query.trim().toLowerCase();
  if (!q) return DESTINATIONS.slice(0, 6);
  return DESTINATIONS.map((d) => {
    let score = -1;
    if (d.name.toLowerCase().startsWith(q)) score = 0;
    else if (d.name.toLowerCase().includes(q)) score = 1;
    else if (d.keywords.toLowerCase().includes(q)) score = 2;
    return { d, score };
  })
    .filter((r) => r.score >= 0)
    .sort((a, b) => a.score - b.score)
    .slice(0, 6)
    .map((r) => r.d);
}

function readSegments(root: HTMLElement): Segment[] {
  const segments: Segment[] = [];
  const pushText = (value: string) => {
    const clean = value.replaceAll(ZWSP, '');
    if (!clean) return;
    const last = segments.at(-1);
    if (last?.type === 'text') last.value += clean;
    else segments.push({ type: 'text', value: clean });
  };
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) return pushText(node.textContent ?? '');
    if (!(node instanceof HTMLElement)) return;
    if (node.hasAttribute(MARKER_ATTR)) return;
    const chipId = node.getAttribute(CHIP_ATTR);
    if (chipId) {
      segments.push({ type: 'chip', id: chipId, name: node.getAttribute('data-chip-name') ?? '' });
      return;
    }
    if (node.tagName === 'BR') return pushText('\n');
    node.childNodes.forEach(walk);
  };
  root.childNodes.forEach(walk);
  return segments;
}

export function ChipComposer({ strings }: { strings: ComposerStrings }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const [segments, setSegments] = useState<Segment[]>([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(null);

  const results = useMemo(() => search(query), [query]);
  useEffect(() => setActiveIndex(0), [query]);

  const sync = () => {
    if (editorRef.current) setSegments(readSegments(editorRef.current));
  };

  // Latest-value refs so the native listeners registered once below always
  // call through to the current render's closures.
  const openRef = useRef(open);
  openRef.current = open;

  const getMarker = () => editorRef.current?.querySelector<HTMLElement>(`[${MARKER_ATTR}]`) ?? null;

  const getRange = (): Range | null => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.getRangeAt(0).commonAncestorContainer)) {
      return sel.getRangeAt(0).cloneRange();
    }
    return savedRangeRef.current?.cloneRange() ?? null;
  };

  const updateAnchor = () => {
    const shell = shellRef.current;
    const range = getRange();
    if (!shell || !range) return;
    const shellRect = shell.getBoundingClientRect();
    const rects = Array.from(range.getClientRects());
    const rect = rects.at(-1) ?? range.getBoundingClientRect();
    const base = rect.width > 0 || rect.height > 0 ? rect : editorRef.current!.getBoundingClientRect();
    const left = Math.max(8, Math.min(base.left - shellRect.left, shellRect.width - PALETTE_WIDTH - 8));
    setAnchor({ top: base.bottom - shellRect.top + 6, left });
  };

  const closePalette = (removeMarker = true) => {
    if (removeMarker) getMarker()?.remove();
    setOpen(false);
    setQuery('');
    setAnchor(null);
    sync();
  };

  const openPalette = () => {
    const range = getRange();
    if (!range) return;
    const sel = window.getSelection();
    // Typing @ over a selection replaces it. Range.insertNode alone would
    // insert at the start and leave the selected text in place ("@hello").
    range.deleteContents();
    sel?.removeAllRanges();
    sel?.addRange(range);

    getMarker()?.remove();
    const marker = document.createElement('span');
    marker.setAttribute(MARKER_ATTR, '1');
    marker.contentEditable = 'false';
    marker.className = 'inline-block w-0 overflow-hidden align-baseline';
    marker.textContent = ZWSP;

    const prefix = document.createTextNode('@');
    range.insertNode(prefix);
    range.insertNode(marker);

    const next = document.createRange();
    next.setStart(prefix, 1);
    next.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(next);
    savedRangeRef.current = next.cloneRange();

    setQuery('');
    setOpen(true);
    sync();
    requestAnimationFrame(updateAnchor);
  };

  const readQuery = () => {
    const marker = getMarker();
    const sel = window.getSelection();
    if (!marker || !sel || sel.rangeCount === 0) return null;
    const live = sel.getRangeAt(0);
    if (!editorRef.current?.contains(live.startContainer)) return null;

    // A caret that has moved *behind* the marker is no longer typing a query.
    // Range.setEnd would silently collapse in that case and hand back an empty
    // string, which reads as "empty query" rather than "dismiss me" — so the
    // palette used to hang around showing the default results forever.
    const afterMarker = document.createRange();
    afterMarker.setStartAfter(marker);
    afterMarker.collapse(true);
    if (live.compareBoundaryPoints(Range.START_TO_START, afterMarker) < 0) return null;

    const qr = document.createRange();
    qr.setStartAfter(marker);
    try {
      qr.setEnd(live.startContainer, live.startOffset);
    } catch {
      return null;
    }
    const raw = qr.toString().replaceAll(ZWSP, '');
    return raw.startsWith('@') ? raw.slice(1) : raw;
  };

  const insertChip = (dest: Destination) => {
    const marker = getMarker();
    const sel = window.getSelection();
    if (!marker || !sel || sel.rangeCount === 0) return;
    const live = sel.getRangeAt(0);
    const replace = document.createRange();
    replace.setStartAfter(marker);
    try {
      replace.setEnd(live.startContainer, live.startOffset);
    } catch {
      replace.collapse(true);
    }
    replace.deleteContents();
    marker.remove();

    const chip = document.createElement('span');
    chip.contentEditable = 'false';
    chip.setAttribute(CHIP_ATTR, dest.id);
    chip.setAttribute('data-chip-name', dest.name);
    chip.className = 'composer-chip mx-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 text-sm font-medium';

    const label = document.createElement('span');
    label.className = 'pointer-events-none';
    label.textContent = dest.name;
    const x = document.createElement('button');
    x.type = 'button';
    x.setAttribute('data-remove', '1');
    x.setAttribute('aria-label', strings.removeChip.replace('{name}', dest.name));
    x.className = 'composer-chip-x cursor-pointer leading-none';
    x.textContent = '×';
    chip.append(label, x);
    replace.insertNode(chip);

    const next = document.createRange();
    next.setStartAfter(chip);
    next.collapse(true);
    sel.removeAllRanges();
    sel.addRange(next);
    savedRangeRef.current = next.cloneRange();

    closePalette(false);
    editorRef.current?.focus();
  };

  // Backspace/Delete next to a chip removes the whole chip atomically.
  const removeAdjacentChip = (direction: 'backward' | 'forward'): boolean => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !sel.isCollapsed) return false;
    const range = sel.getRangeAt(0);
    if (!editorRef.current?.contains(range.startContainer)) return false;

    let chip: HTMLElement | null = null;
    const isChip = (n: Node | null): n is HTMLElement => n instanceof HTMLElement && n.hasAttribute(CHIP_ATTR);

    if (range.startContainer.nodeType === Node.TEXT_NODE) {
      const t = range.startContainer as Text;
      if (direction === 'backward' && range.startOffset === 0 && isChip(t.previousSibling)) chip = t.previousSibling;
      if (direction === 'forward' && range.startOffset === (t.textContent?.length ?? 0) && isChip(t.nextSibling)) chip = t.nextSibling;
    } else if (range.startContainer instanceof Element) {
      const idx = direction === 'backward' ? range.startOffset - 1 : range.startOffset;
      const candidate = range.startContainer.childNodes.item(idx);
      if (isChip(candidate)) chip = candidate;
    }
    if (!chip) return false;
    chip.remove();
    sync();
    return true;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (open) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
      // Shift+Tab is "leave the field backwards", not "commit". And while an
      // IME composition is open, Enter commits the candidate — stealing it
      // would insert a chip instead of the character the user is typing.
      if (e.key === 'Enter' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        if (results[activeIndex]) insertChip(results[activeIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        closePalette();
        return;
      }
    }
    if (e.key === 'Backspace' && removeAdjacentChip('backward')) e.preventDefault();
    if (e.key === 'Delete' && removeAdjacentChip('forward')) e.preventDefault();
  };

  const closePaletteRef = useRef(closePalette);
  closePaletteRef.current = closePalette;
  const openPaletteRef = useRef(openPalette);
  openPaletteRef.current = openPalette;
  const readQueryRef = useRef(readQuery);
  readQueryRef.current = readQuery;

  // The @ trigger listens for the NATIVE beforeinput, not React's onBeforeInput.
  // React synthesises that one from textInput/keypress/composition events, so
  // e.nativeEvent is not an InputEvent and on the keypress fallback path it
  // carries no .data at all — the palette would simply never open there. The
  // native event always reports the character, which is the whole reason this
  // lives on beforeinput instead of keydown: mobile virtual keyboards report
  // keydown as "Unidentified".
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const handler = (e: InputEvent) => {
      if (openRef.current || e.isComposing) return;
      if (e.inputType === 'insertText' && e.data === '@') {
        e.preventDefault();
        openPaletteRef.current();
      }
    };
    el.addEventListener('beforeinput', handler);
    return () => el.removeEventListener('beforeinput', handler);
  }, []);

  // Dismissal. The palette previously had none of this: arrow keys move the
  // caret without firing `input`, so it would sit there with a stale query,
  // and clicking elsewhere on the page left it open indefinitely.
  useEffect(() => {
    if (!open) return;

    const onSelectionChange = () => {
      // Arrow keys move the caret without firing `input`, so this is the only
      // place the query can be re-read. null means the caret has left the
      // query entirely — dismiss; otherwise track it, since moving the caret
      // back through the text narrows what was typed.
      const q = readQueryRef.current();
      if (q === null) closePaletteRef.current();
      else setQuery(q);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!shellRef.current?.contains(e.target as Node)) closePaletteRef.current();
    };

    document.addEventListener('selectionchange', onSelectionChange);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  // Remember where the caret was, so the palette can still act on it after
  // focus moves to a palette button. Same body on keyup and blur — it used to
  // be inlined twice, verbatim.
  const saveRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.getRangeAt(0).commonAncestorContainer)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const onInput = () => {
    sync();
    if (open) {
      const q = readQuery();
      if (q === null) closePalette();
      else {
        setQuery(q);
        requestAnimationFrame(updateAnchor);
      }
    }
  };

  // The chip's × is a real <button>, so Enter/Space fire `click` but never
  // `mousedown` — removal has to live on click. mousedown only preventDefaults,
  // to stop the press from collapsing the selection before we act.
  const onMouseDown = (e: React.MouseEvent) => {
    const target = e.target;
    if (target instanceof HTMLElement && target.closest('[data-remove]')) e.preventDefault();
  };

  const onClick = (e: React.MouseEvent) => {
    const remove = (e.target as HTMLElement | null)?.closest?.('[data-remove]');
    if (!remove) return;
    e.preventDefault();
    remove.closest(`[${CHIP_ATTR}]`)?.remove();
    sync();
  };

  // contenteditable accepts arbitrary pasted HTML — links, images, inline
  // styles — which both breaks the design and confuses readSegments. Plain
  // text only; `plaintext-only` on the host isn't an option because it would
  // strip the chips too.
  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    if (!text) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    saveRange();
    sync();
  };

  const clear = () => {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = '';
    savedRangeRef.current = null;
    closePalette();
    setSegments([]);
    editorRef.current.focus();
  };

  const serialized = segments
    .map((s) => (s.type === 'text' ? s.value : `{${s.name}|${s.id}}`))
    .join('');
  const plain = segments.map((s) => (s.type === 'text' ? s.value : s.name)).join('');
  const chips = segments.filter((s) => s.type === 'chip');

  return (
    <div className="mx-auto w-full max-w-xl">
      <p className="mb-4 text-center label text-muted-foreground">
        {strings.hint}
      </p>

      <div ref={shellRef} className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          // Combobox over a listbox: the editor owns the text, the palette is
          // the popup, and aria-activedescendant points at the highlighted
          // option without moving DOM focus off the editor.
          role="combobox"
          aria-multiline="true"
          aria-label={strings.editorLabel}
          aria-expanded={open}
          aria-controls={LISTBOX_ID}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-activedescendant={open && results[activeIndex] ? optionId(results[activeIndex].id) : undefined}
          // Driven by parsed state rather than CSS :empty — contenteditable
          // leaves a stray <br> or empty text node behind after the first
          // edit, which defeats :empty and lost the placeholder for good.
          data-placeholder={strings.empty}
          data-empty={segments.length === 0 || undefined}
          className="composer-editor min-h-24 w-full border p-3 text-sm leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          style={{
            borderColor: 'var(--color-secondary-darker)',
            background: 'color-mix(in srgb, var(--color-foreground) 5%, transparent)',
          }}
          onKeyDown={onKeyDown}
          onInput={onInput}
          onMouseDown={onMouseDown}
          onClick={onClick}
          onPaste={onPaste}
          onKeyUp={saveRange}
          onBlur={saveRange}
        />

        {open && anchor && (
          <div
            id={LISTBOX_ID}
            role="listbox"
            aria-label={strings.resultsLabel}
            className="absolute z-20 border border-secondary-darker bg-background shadow-2xl"
            style={{ top: anchor.top, left: anchor.left, width: PALETTE_WIDTH }}
          >
            {results.length === 0 && <p className="px-3 py-2 text-sm text-muted-foreground">{strings.noResults}</p>}
            {results.map((d, i) => (
              <button
                key={d.id}
                id={optionId(d.id)}
                role="option"
                aria-selected={i === activeIndex}
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertChip(d);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className="block w-full cursor-pointer px-3 py-2 text-left text-sm"
                style={{
                  background: i === activeIndex ? 'color-mix(in srgb, var(--color-brand-accent) 18%, transparent)' : undefined,
                }}
              >
                {d.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 space-y-2 font-mono text-xs text-muted-foreground">
        <p className="break-all">
          <span className="uppercase tracking-[0.15em]">{strings.serialized}</span>{' '}
          <span className="text-brand-accent">{serialized || '—'}</span>
        </p>
        <p className="break-all">
          <span className="uppercase tracking-[0.15em]">{strings.plain}</span> {plain || '—'}
        </p>
        <p>
          <span className="uppercase tracking-[0.15em]">{strings.entities}</span> {chips.length}
          <button
            type="button"
            onClick={clear}
            className="ml-6 cursor-pointer underline underline-offset-4 text-brand-accent">
            {strings.clear}
          </button>
        </p>
      </div>
    </div>
  );
}
