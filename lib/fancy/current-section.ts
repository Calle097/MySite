import { useSyncExternalStore } from 'react';

/**
 * Which section is in the middle of the view: one value, written by the
 * column's index, read by it and by the phone menu, so they always agree.
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
