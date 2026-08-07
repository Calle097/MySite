'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // 0,5,10 … 55
const ITEM_HEIGHT = 32;
const POPOVER_WIDTH = 168;

const pad = (n: number) => String(n).padStart(2, '0');

function parseHHmm(v?: string | null): { h: number; m: number } | null {
  if (!v) return null;
  const [h, m] = v.split(':').map((x) => parseInt(x, 10));
  return Number.isNaN(h) || Number.isNaN(m) ? null : { h, m };
}

function ScrollColumn({
  items,
  selected,
  onSelect,
  isDisabled,
  label,
  visibleItems = 7,
}: {
  items: number[];
  selected: number;
  onSelect: (v: number) => void;
  isDisabled?: (v: number) => boolean;
  label: string;
  visibleItems?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Center the selected item in the visible area
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const idx = items.indexOf(selected);
    if (idx === -1) return;
    const target = idx * ITEM_HEIGHT - (ITEM_HEIGHT * (visibleItems - 1)) / 2 + ITEM_HEIGHT / 2;
    el.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
  }, [selected, items, visibleItems]);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div
        className="select-none border-b py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.15em]"
        style={{ borderColor: 'var(--secondary-darker)', color: 'var(--muted-foreground)' }}
      >
        {label}
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto [scrollbar-width:thin]"
        style={{ maxHeight: ITEM_HEIGHT * visibleItems }}
      >
        {items.map((v) => {
          const disabled = isDisabled?.(v);
          const active = v === selected;
          return (
            <button
              key={v}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelect(v)}
              className={`w-full cursor-pointer text-center text-sm tabular-nums transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                active && !disabled ? 'font-semibold' : ''
              }`}
              style={{
                height: ITEM_HEIGHT,
                lineHeight: `${ITEM_HEIGHT}px`,
                background: active && !disabled ? 'var(--brand-accent)' : undefined,
                color: active && !disabled ? 'var(--background)' : 'var(--foreground)',
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
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const parsed = useMemo(() => parseHHmm(value), [value]);
  const [localHour, setLocalHour] = useState(parsed?.h ?? 12);
  const [localMinute, setLocalMinute] = useState(parsed?.m ?? 0);

  useEffect(() => setMounted(true), []);

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
    setPosition({ top: rect.bottom + 4, left });
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

  const close = useCallback(() => setOpen(false), []);

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

  const handleOk = () => {
    onChange?.(`${pad(localHour)}:${pad(localMinute)}`);
    close();
  };

  const handleNow = () => {
    const now = new Date();
    const h = now.getHours();
    const m = (Math.round(now.getMinutes() / 5) * 5) % 60;
    onChange?.(`${pad(h)}:${pad(m)}`);
    close();
  };

  return (
    <>
      <div className="relative inline-block w-40">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="w-full cursor-pointer border py-2 pl-3 pr-9 text-left text-sm transition-colors"
          style={{
            borderColor: 'var(--secondary-darker)',
            background: 'color-mix(in srgb, var(--foreground) 5%, transparent)',
            color: value ? 'var(--foreground)' : 'var(--muted-foreground)',
          }}
        >
          <span className={value ? 'tabular-nums' : ''}>{value || placeholder}</span>
        </button>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{ color: 'var(--muted-foreground)' }}
          viewBox="0 0 24 24"
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

      {mounted &&
        open &&
        position &&
        createPortal(
          <div
            ref={popoverRef}
            className="fixed z-50 flex flex-col border shadow-2xl"
            style={{
              top: position.top,
              left: position.left,
              width: POPOVER_WIDTH,
              background: 'var(--background)',
              borderColor: 'var(--secondary-darker)',
            }}
          >
            <div className="flex px-1.5 pt-1.5" style={{ height: ITEM_HEIGHT * 7 + 34 }}>
              <ScrollColumn
                label={labels.hours}
                items={HOURS}
                selected={localHour}
                onSelect={setLocalHour}
                isDisabled={shouldDisableHour}
              />
              <div className="w-px shrink-0" style={{ background: 'var(--secondary-darker)' }} />
              <ScrollColumn
                label={labels.minutes}
                items={MINUTES}
                selected={localMinute}
                onSelect={setLocalMinute}
                isDisabled={shouldDisableMinute}
              />
            </div>
            <div
              className="flex items-center justify-between border-t px-2 py-1.5"
              style={{ borderColor: 'var(--secondary-darker)' }}
            >
              <button
                type="button"
                onClick={handleNow}
                className="cursor-pointer font-mono text-xs underline underline-offset-4"
                style={{ color: 'var(--brand-accent)' }}
              >
                {labels.now}
              </button>
              <button
                type="button"
                onClick={handleOk}
                className="cursor-pointer px-3 py-1 font-mono text-xs font-semibold"
                style={{ background: 'var(--brand-accent)', color: 'var(--background)' }}
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
