import { useSyncExternalStore } from 'react';

/**
 * Which of the page's sections is in the middle of the view (lively mode).
 * One value, written by the section index as you scroll and read by every
 * list that shows the sections (the column's index, the phone menu), so the
 * two can never disagree.
 */
let current = 0;
const listeners = new Set<() => void>();

export function setCurrentSection(i: number) {
  if (i === current) return;
  current = i;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useCurrentSection() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => 0,
  );
}
