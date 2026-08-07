'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical, TrainFront } from 'lucide-react';
import { DICTS, type Lang } from '@/lib/i18n';

/**
 * A day of activities split by a train. Move the train — by dragging it or
 * with the arrow buttons (touch-friendly) — and every downstream time
 * recomputes: 15-minute transfers between activities, the train departing 20
 * minutes after the previous activity ends, the whole afternoon shifting.
 */

const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (h: number, m: number) => `${pad(h)}:${pad(m)}`;

type Timed = { title: string; minutes: number; start: string; end: string };

function recalcTimes(items: { title: string; minutes: number }[], startH: number, startM: number): Timed[] {
  let h = startH;
  let m = startM;
  return items.map((item, idx) => {
    if (idx > 0) {
      m += 15;
      if (m >= 60) { h++; m -= 60; }
    }
    const start = fmt(h, m);
    m += item.minutes;
    while (m >= 60) { h++; m -= 60; }
    return { ...item, start, end: fmt(h, m) };
  });
}

function ActivityRow({ activity }: { activity: Timed }) {
  return (
    <div
      className="flex items-baseline justify-between gap-4 border px-4 py-3"
      style={{
        borderColor: 'var(--secondary-darker)',
        background: 'color-mix(in srgb, var(--foreground) 4%, transparent)',
      }}
    >
      <span className="text-sm font-semibold">{activity.title}</span>
      <span className="shrink-0 font-mono text-xs tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
        {activity.start} — {activity.end}
      </span>
    </div>
  );
}

export function TransitDragDemo({ lang }: { lang: Lang }) {
  const dict = DICTS[lang].demoTransit;
  const [trainPosition, setTrainPosition] = useState(3);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const items = dict.activities;

  const before = useMemo(() => recalcTimes(items.slice(0, trainPosition), 9, 0), [items, trainPosition]);

  const { after, dep, arr } = useMemo(() => {
    let dh = 9;
    let dm = 0;
    if (before.length > 0) {
      const [eh, em] = before[before.length - 1].end.split(':').map(Number);
      dh = eh;
      dm = em + 20;
      if (dm >= 60) { dh++; dm -= 60; }
    }
    const depTime = fmt(dh, dm);
    let ah = dh + 1;
    let am = dm + 25;
    if (am >= 60) { ah++; am -= 60; }
    const arrTime = fmt(ah, am);
    am += 15;
    if (am >= 60) { ah++; am -= 60; }
    return { after: recalcTimes(items.slice(trainPosition), ah, am), dep: depTime, arr: arrTime };
  }, [items, trainPosition, before]);

  const move = (position: number) => {
    setTrainPosition(Math.max(0, Math.min(items.length, position)));
    setDropTarget(null);
  };

  const dropZone = (position: number) => {
    if (position === trainPosition) return null;
    const active = dropTarget === position;
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDropTarget(position);
        }}
        onDragLeave={() => setDropTarget(null)}
        onDrop={(e) => {
          e.preventDefault();
          move(position);
        }}
        onClick={() => dragging && move(position)}
        className={`my-1 flex items-center justify-center transition-all duration-200 ${
          active ? 'h-12 border-2 border-dashed' : dragging ? 'h-6 border border-dashed opacity-60' : 'h-2'
        }`}
        style={{ borderColor: active || dragging ? 'var(--brand-accent)' : undefined }}
      >
        {active && (
          <span className="font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--brand-accent)' }}>
            {dict.dropHint}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <p className="mb-5 text-center font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
        {dict.hint}
      </p>

      {dropZone(0)}
      {before.map((a, i) => (
        <div key={a.title}>
          {i > 0 && (
            <p className="py-1 pl-4 font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
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
          e.dataTransfer.setData('text/plain', 'train');
          e.dataTransfer.effectAllowed = 'move';
          setDragging(true);
        }}
        onDragEnd={() => {
          setDragging(false);
          setDropTarget(null);
        }}
        className="my-2 flex cursor-grab items-center gap-3 border-2 px-4 py-3 active:cursor-grabbing"
        style={{
          borderColor: 'var(--brand-accent)',
          background: 'color-mix(in srgb, var(--brand-accent) 10%, transparent)',
        }}
      >
        <GripVertical className="h-4 w-4 shrink-0" style={{ color: 'var(--muted-foreground)' }} aria-hidden />
        <TrainFront className="h-4 w-4 shrink-0" style={{ color: 'var(--brand-accent)' }} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {dict.train.from} → {dict.train.to}
          </p>
          <p className="font-mono text-xs tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
            {dep} — {arr} · {dict.train.duration}
          </p>
        </div>
        <span className="flex shrink-0 flex-col">
          <button
            type="button"
            aria-label="Move train earlier"
            disabled={trainPosition === 0}
            onClick={() => move(trainPosition - 1)}
            className="cursor-pointer p-0.5 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Move train later"
            disabled={trainPosition === items.length}
            onClick={() => move(trainPosition + 1)}
            className="cursor-pointer p-0.5 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </span>
      </div>

      {after.map((a, i) => {
        const globalIndex = trainPosition + i;
        return (
          <div key={a.title}>
            {i > 0 && (
              <p className="py-1 pl-4 font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: 'var(--muted-foreground)' }}>
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
