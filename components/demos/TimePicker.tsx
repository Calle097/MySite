'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { formatHHmm, pad, parseHHmm, roundToGrid } from '@/lib/time';

/**
 * Scrollable hour/minute picker. Built for a client project after every free
 * time-picker library misbehaved somewhere (mobile scrolling, controlled
 * values, popover clipping) — writing one was faster. Selection is staged
 * until OK; "now" applies immediately; hours/minutes can be disabled per slot.
 */

export interface TimePickerLabels {
  hours: string;
  minutes: string;
  now: string;
  ok: string;
}

export interface TimePickerProps {
  /** Time value in "HH:mm" format */
  value?: string | null;
  onChange?: (time: string) => void;
  placeholder?: string;
  labels: TimePickerLabels;
  shouldDisableHour?: (hour: number) => boolean;
  shouldDisableMinute?: (minute: number) => boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
/** The minute column's granularity; "now" rounds to the same grid. */
const MINUTE_STEP = 5;
const MINUTES = Array.from({ length: 60 / MINUTE_STEP }, (_, i) => i * MINUTE_STEP); // 0,5,10 … 55
const ITEM_HEIGHT = 32;
const POPOVER_WIDTH = 168;
/** Rows shown per column; the popover height is derived from it. */
const VISIBLE_ITEMS = 7;
/** Column header + its bottom rule. */
const COLUMN_HEADER_HEIGHT = 34;
/** The "now" / OK row under the columns. Deliberately a touch generous: it
    only feeds the "is there room below?" test, and over-estimating flips the
    popover above the trigger slightly early, which is harmless. Under-
    estimating would let it overlap the trigger, which is not. */
const FOOTER_HEIGHT = 40;

/** Stable option ids for aria-activedescendant; useId keeps two pickers on
    the same page from colliding. */
const optionId = (prefix: string, value: number) => `${prefix}-${value}`;

function ScrollColumn({
  items,
  selected,
  onSelect,
  isDisabled,
  label,
  idPrefix,
  visibleItems = VISIBLE_ITEMS,
}: {
  items: number[];
  selected: number;
  onSelect: (v: number) => void;
  isDisabled?: (v: number) => boolean;
  label: string;
  idPrefix: string;
  visibleItems?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Arrow / Home / End move the selection, so reaching hour 23 costs a held
  // key rather than 23 Tab presses. Focus stays on the listbox itself and
  // aria-activedescendant reports which option is current.
  const onColumnKeyDown = (e: React.KeyboardEvent) => {
    // -1 when a controlled value sits off the 5-minute grid; treat that as
    // "before the first row" so ArrowDown still enters the list.
    const idx = items.indexOf(selected);
    const from = idx === -1 ? -1 : idx;

    // Each key is "start here, then step this way until a row is selectable".
    const move = {
      ArrowDown: { start: from, step: 1 },
      ArrowUp: { start: from, step: -1 },
      Home: { start: -1, step: 1 },
      End: { start: items.length, step: -1 },
    }[e.key];
    if (!move) return;
    e.preventDefault();
    const { start, step } = move;

    // Walk past disabled rows instead of stopping on the first one — landing
    // on a blocked slot and refusing to move left the arrows wedged there,
    // with the native scroll suppressed too.
    for (let i = start + step; i >= 0 && i < items.length; i += step) {
      const value = items[i];
      if (!isDisabled?.(value)) {
        onSelect(value);
        return;
      }
    }
  };

  // Centre the selected row in the visible area: put its midpoint
  // (idx * H + H/2) at the midpoint of the viewport (visibleItems * H / 2).
  const firstScroll = useRef(true);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const idx = items.indexOf(selected);
    if (idx === -1) return;
    const target = idx * ITEM_HEIGHT + ITEM_HEIGHT / 2 - (visibleItems * ITEM_HEIGHT) / 2;
    // Jump on open, glide on later changes — smooth-scrolling from 0 every
    // time the popover mounts animates the list out from under the finger.
    el.scrollTo({ top: Math.max(0, target), behavior: firstScroll.current ? 'auto' : 'smooth' });
    firstScroll.current = false;
  }, [selected, items, visibleItems]);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div
        className="select-none border-b py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.15em] border-secondary-darker text-muted-foreground"
      >
        {label}
      </div>
      <div
        ref={containerRef}
        role="listbox"
        aria-label={label}
        aria-activedescendant={items.includes(selected) ? optionId(idPrefix, selected) : undefined}
        tabIndex={0}
        onKeyDown={onColumnKeyDown}
        className="flex-1 overflow-y-auto [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-brand-accent"
        style={{ maxHeight: ITEM_HEIGHT * visibleItems }}
      >
        {items.map((v) => {
          const disabled = isDisabled?.(v);
          const active = v === selected;
          return (
            <button
              key={v}
              id={optionId(idPrefix, v)}
              role="option"
              aria-selected={active}
              // aria-disabled, not the disabled attribute: a disabled button
              // drops out of the accessibility tree entirely, so a screen
              // reader can't tell an unavailable slot from one that isn't there.
              aria-disabled={disabled || undefined}
              type="button"
              tabIndex={-1}
              onClick={() => !disabled && onSelect(v)}
              // aria-disabled:, not disabled:, to match the attribute above —
              // the disabled: variants stopped applying the moment the real
              // attribute came off, leaving blocked slots looking available.
              className={`w-full cursor-pointer text-center text-sm tabular-nums transition-colors aria-disabled:cursor-not-allowed aria-disabled:opacity-30 ${
                active && !disabled ? 'font-semibold' : ''
              }`}
              style={{
                height: ITEM_HEIGHT,
                lineHeight: `${ITEM_HEIGHT}px`,
                background: active && !disabled ? 'var(--color-brand-accent)' : undefined,
                color: active && !disabled ? 'var(--color-background)' : 'var(--color-foreground)',
              }}
            >
              {pad(v)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TimePicker({
  value,
  onChange,
  placeholder = 'HH:mm',
  labels,
  shouldDisableHour,
  shouldDisableMinute,
}: TimePickerProps) {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const [localHour, setLocalHour] = useState(() => parseHHmm(value)?.h ?? 12);
  const [localMinute, setLocalMinute] = useState(() => parseHHmm(value)?.m ?? 0);

  // Re-sync staged state when opening or when the value changes externally
  useEffect(() => {
    const p = parseHHmm(value);
    if (p) {
      setLocalHour(p.h);
      setLocalMinute(p.m);
    }
  }, [value, open]);

  const updatePosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const margin = 8;
    // Centered under the trigger, clamped to the viewport
    let left = rect.left + rect.width / 2 - POPOVER_WIDTH / 2;
    left = Math.min(left, window.innerWidth - margin - POPOVER_WIDTH);
    left = Math.max(left, margin);

    // Flip above the trigger when there isn't room below. The popover is
    // position: fixed, so an overflowing one can't be scrolled into view —
    // it would simply be unreachable. Horizontal was already clamped; this
    // is the matching vertical case.
    const height = ITEM_HEIGHT * VISIBLE_ITEMS + COLUMN_HEADER_HEIGHT + FOOTER_HEIGHT;
    const below = rect.bottom + 4;
    const top = below + height + margin > window.innerHeight ? Math.max(margin, rect.top - 4 - height) : below;

    setPosition((prev) => (prev && prev.top === top && prev.left === left ? prev : { top, left }));
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

  const close = useCallback(() => {
    setOpen(false);
    // Send focus back where it came from; without this it fell to <body>, and
    // the popover portals to the end of the document. preventScroll because
    // this also runs on outside-click: if the trigger has been scrolled out of
    // view, restoring focus would otherwise yank the page back to it.
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  // Focus the popover once per opening, so Tab lands on the columns next
  // rather than walking the rest of the page. Latched: `position` is a
  // dependency because the portal isn't mounted on the first pass, but it also
  // changes on every scroll and resize — without the latch, scrolling the page
  // stole focus back from whichever column the user had tabbed into.
  const focusedThisOpen = useRef(false);
  useEffect(() => {
    if (!open) {
      focusedThisOpen.current = false;
      return;
    }
    if (focusedThisOpen.current || !popoverRef.current) return;
    popoverRef.current.focus({ preventScroll: true });
    focusedThisOpen.current = true;
  }, [open, position]);

  // Outside click + Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (
        !popoverRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        close();
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  /** The columns render disabled slots — nothing used to stop OK or "now"
      from committing one anyway. */
  const isBlocked = (h: number, m: number) => !!shouldDisableHour?.(h) || !!shouldDisableMinute?.(m);
  const okBlocked = isBlocked(localHour, localMinute);

  const handleOk = () => {
    if (okBlocked) return;
    onChange?.(formatHHmm(localHour, localMinute));
    close();
  };

  const handleNow = () => {
    const { h, m } = roundToGrid(new Date(), MINUTE_STEP);
    // If now lands on a blocked slot, stage it so the user can see which part
    // is unavailable rather than silently committing it.
    if (isBlocked(h, m)) {
      setLocalHour(h);
      setLocalMinute(m);
      return;
    }
    onChange?.(formatHHmm(h, m));
    close();
  };

  return (
    <>
      <div className="relative inline-block w-40">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`${labels.hours} / ${labels.minutes}${value ? `: ${value}` : ''}`}
          onClick={() => setOpen((p) => !p)}
          className="w-full cursor-pointer border py-2 pl-3 pr-9 text-left text-sm transition-colors"
          style={{
            borderColor: 'var(--color-secondary-darker)',
            background: 'color-mix(in srgb, var(--color-foreground) 5%, transparent)',
            color: value ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
          }}
        >
          <span className={value ? 'tabular-nums' : ''}>{value || placeholder}</span>
        </button>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>

      {open &&
        position &&
        createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            tabIndex={-1}
            aria-label={`${labels.hours} / ${labels.minutes}`}
            className="fixed z-50 flex flex-col border shadow-2xl"
            style={{
              top: position.top,
              left: position.left,
              width: POPOVER_WIDTH,
              background: 'var(--color-background)',
              borderColor: 'var(--color-secondary-darker)',
            }}
          >
            <div className="flex px-1.5 pt-1.5" style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS + COLUMN_HEADER_HEIGHT }}>
              <ScrollColumn
                label={labels.hours}
                items={HOURS}
                selected={localHour}
                onSelect={setLocalHour}
                isDisabled={shouldDisableHour}
                idPrefix={`${uid}-h`}
              />
              <div className="w-px shrink-0 bg-secondary-darker" />
              <ScrollColumn
                label={labels.minutes}
                items={MINUTES}
                selected={localMinute}
                onSelect={setLocalMinute}
                isDisabled={shouldDisableMinute}
                idPrefix={`${uid}-m`}
              />
            </div>
            <div
              className="flex items-center justify-between border-t px-2 py-1.5 border-secondary-darker">
              <button
                type="button"
                onClick={handleNow}
                className="cursor-pointer font-mono text-xs underline underline-offset-4 text-brand-accent">
                {labels.now}
              </button>
              <button
                type="button"
                onClick={handleOk}
                disabled={okBlocked}
                className="cursor-pointer px-3 py-1 font-mono text-xs font-semibold bg-brand-accent text-background disabled:cursor-not-allowed disabled:opacity-40"
              >
                {labels.ok}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
