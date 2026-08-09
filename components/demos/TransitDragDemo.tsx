'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical, TrainFront } from 'lucide-react';
import { DICTS, type Lang } from '@/lib/i18n';
import { formatMinutes as fmt } from '@/lib/time';
import { planDay, type TimedActivity } from '@/lib/schedule';

/**
 * A day of activities split by a train. Move the train — by dragging it or
 * with the arrow buttons (touch-friendly) — and every downstream time
 * recomputes: 15-minute transfers between activities, the train departing 20
 * minutes after the previous activity ends, the whole afternoon shifting.
 */

/** Marks a drag as ours, so drops of foreign text/links/files are ignored. */
const DRAG_PAYLOAD = 'train';

function ActivityRow({ activity }: { activity: TimedActivity }) {
  return (
    <div
      className="flex items-baseline justify-between gap-4 border px-4 py-3"
      style={{
        borderColor: 'var(--color-secondary-darker)',
        background: 'color-mix(in srgb, var(--color-foreground) 4%, transparent)',
      }}
    >
      <span className="text-sm font-semibold">{activity.title}</span>
      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
        {fmt(activity.start)} — {fmt(activity.end)}
      </span>
    </div>
  );
}

export function TransitDragDemo({ lang }: { lang: Lang }) {
  const dict = DICTS[lang].demos.transit;
  const [trainPosition, setTrainPosition] = useState(3);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const items = dict.activities;

  const { before, after, dep, arr } = useMemo(
    () => planDay(items, trainPosition, dict.train.minutes),
    [items, trainPosition, dict.train.minutes],
  );

  const move = (position: number) => {
    setTrainPosition(Math.max(0, Math.min(items.length, position)));
    setDropTarget(null);
  };

  const dropZone = (position: number) => {
    if (position === trainPosition) return null;
    const active = dropTarget === position;
    return (
      <div
        // dragover, not dragenter, owns the highlight. It fires continuously
        // while the pointer is anywhere over this zone — including over the
        // hint span this zone renders once active — so it re-asserts the
        // target that a child's dragleave, or an adjacent zone's enter firing
        // before our leave, would otherwise have cleared. Setting the same
        // number again is a no-op re-render, so this doesn't churn.
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          setDropTarget(position);
        }}
        // Only clear when the pointer genuinely leaves this zone's subtree;
        // moving onto a child fires dragleave with relatedTarget inside it.
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setDropTarget((current) => (current === position ? null : current));
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          // Ignore anything that isn't our train — text, links and files
          // dragged in from elsewhere would otherwise move it.
          if (e.dataTransfer.getData('text/plain') !== DRAG_PAYLOAD) {
            setDropTarget(null);
            return;
          }
          move(position);
        }}
        className={`my-1 flex items-center justify-center transition-all duration-200 ${
          active ? 'h-12 border-2 border-dashed' : dragging ? 'h-6 border border-dashed opacity-60' : 'h-2'
        }`}
        style={{ borderColor: active || dragging ? 'var(--color-brand-accent)' : undefined }}
      >
        {active && (
          <span className="label text-brand-accent">
            {dict.dropHint}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <p className="mb-5 text-center label text-muted-foreground">
        {dict.hint}
      </p>

      {dropZone(0)}
      {before.map((a, i) => (
        <div key={a.title}>
          {i > 0 && (
            <p className="py-1 pl-4 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              · {dict.walk}
            </p>
          )}
          <ActivityRow activity={a} />
          {dropZone(i + 1)}
        </div>
      ))}

      {/* the train — draggable, plus arrows for touch/keyboard */}
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', DRAG_PAYLOAD);
          e.dataTransfer.effectAllowed = 'move';
          setDragging(true);
        }}
        onDragEnd={() => {
          setDragging(false);
          setDropTarget(null);
        }}
        className="my-2 flex cursor-grab items-center gap-3 border-2 px-4 py-3 active:cursor-grabbing"
        style={{
          borderColor: 'var(--color-brand-accent)',
          background: 'color-mix(in srgb, var(--color-brand-accent) 10%, transparent)',
        }}
      >
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <TrainFront className="h-4 w-4 shrink-0 text-brand-accent" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {dict.train.from} → {dict.train.to}
          </p>
          <p className="font-mono text-xs tabular-nums text-muted-foreground">
            {fmt(dep)} — {fmt(arr)} · {Math.floor(dict.train.minutes / 60)} h {dict.train.minutes % 60} min
          </p>
        </div>
        <span className="flex shrink-0 flex-col">
          <button
            type="button"
            aria-label={dict.earlier}
            disabled={trainPosition === 0}
            onClick={() => move(trainPosition - 1)}
            className="cursor-pointer p-0.5 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={dict.later}
            disabled={trainPosition === items.length}
            onClick={() => move(trainPosition + 1)}
            className="cursor-pointer p-0.5 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </span>
      </div>

      {/* The demo's thesis — "every later time recalculates" — happens with no
          visual focus change, so assistive tech gets it as a polite update. */}
      <p aria-live="polite" className="sr-only">
        {dict.train.from} → {dict.train.to}: {fmt(dep)} — {fmt(arr)}
      </p>

      {after.map((a, i) => {
        const globalIndex = trainPosition + i;
        return (
          <div key={a.title}>
            {i > 0 && (
              <p className="py-1 pl-4 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                · {dict.walk}
              </p>
            )}
            <ActivityRow activity={a} />
            {dropZone(globalIndex + 1)}
          </div>
        );
      })}
    </div>
  );
}
