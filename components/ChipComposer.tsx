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

type Segment = { type: 'text'; value: string } | { type: 'chip'; id: string; name: string };

function search(query: string): Destination[] {
  const q = query.trim().toLowerCase();
  if (!q) return DESTINATIONS.slice(0, 6);
  return DESTINATIONS.map((d) => {
    let score = -1;
    if (d.name.toLowerCase().startsWith(q)) score = 0;
    else if (d.name.toLowerCase().includes(q)) score = 1;
    else if (d.keywords.includes(q)) score = 2;
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
    const width = 232;
    const left = Math.max(8, Math.min(base.left - shellRect.left, shellRect.width - width - 8));
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
    requestAnimationFrame(updateAnchor);
  };

  const readQuery = () => {
    const marker = getMarker();
    const sel = window.getSelection();
    if (!marker || !sel || sel.rangeCount === 0) return null;
    const live = sel.getRangeAt(0);
    if (!editorRef.current?.contains(live.startContainer)) return null;
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
    x.setAttribute('aria-label', `Remove ${dest.name}`);
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
      if (e.key === 'Enter' || e.key === 'Tab') {
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

  // The @ trigger lives on beforeinput, not keydown: virtual keyboards on
  // mobile report keydown as "Unidentified", but beforeinput always carries
  // the actual character about to be inserted.
  const onBeforeInput = (e: React.FormEvent<HTMLDivElement>) => {
    const data = (e.nativeEvent as InputEvent).data;
    if (!open && data === '@') {
      e.preventDefault();
      openPalette();
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

  const onMouseDown = (e: React.MouseEvent) => {
    const target = e.target;
    if (target instanceof HTMLElement && target.hasAttribute('data-remove')) {
      e.preventDefault();
      target.closest(`[${CHIP_ATTR}]`)?.remove();
      sync();
    }
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
      <p className="mb-4 text-center font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
        {strings.hint}
      </p>

      <div ref={shellRef} className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          data-placeholder={strings.empty}
          className="composer-editor min-h-24 w-full border p-3 text-sm leading-relaxed outline-none"
          style={{
            borderColor: 'var(--secondary-darker)',
            background: 'color-mix(in srgb, var(--foreground) 5%, transparent)',
          }}
          onKeyDown={onKeyDown}
          onBeforeInput={onBeforeInput}
          onInput={onInput}
          onMouseDown={onMouseDown}
          onKeyUp={() => {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.getRangeAt(0).commonAncestorContainer)) {
              savedRangeRef.current = sel.getRangeAt(0).cloneRange();
            }
          }}
          onBlur={() => {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.getRangeAt(0).commonAncestorContainer)) {
              savedRangeRef.current = sel.getRangeAt(0).cloneRange();
            }
          }}
        />

        {open && anchor && (
          <div
            className="absolute z-20 w-58 border shadow-2xl"
            style={{
              top: anchor.top,
              left: anchor.left,
              width: 232,
              background: 'var(--background)',
              borderColor: 'var(--secondary-darker)',
            }}
          >
            {results.length === 0 && (
              <p className="px-3 py-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {strings.noResults}
              </p>
            )}
            {results.map((d, i) => (
              <button
                key={d.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertChip(d);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className="block w-full cursor-pointer px-3 py-2 text-left text-sm"
                style={{
                  background: i === activeIndex ? 'color-mix(in srgb, var(--brand-accent) 18%, transparent)' : undefined,
                }}
              >
                {d.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 space-y-2 font-mono text-xs" style={{ color: 'var(--muted-foreground)' }}>
        <p className="break-all">
          <span className="uppercase tracking-[0.15em]">{strings.serialized}</span>{' '}
          <span style={{ color: 'var(--brand-accent)' }}>{serialized || '—'}</span>
        </p>
        <p className="break-all">
          <span className="uppercase tracking-[0.15em]">{strings.plain}</span> {plain || '—'}
        </p>
        <p>
          <span className="uppercase tracking-[0.15em]">{strings.entities}</span> {chips.length}
          <button
            type="button"
            onClick={clear}
            className="ml-6 cursor-pointer underline underline-offset-4"
            style={{ color: 'var(--brand-accent)' }}
          >
            {strings.clear}
          </button>
        </p>
      </div>
    </div>
  );
}
