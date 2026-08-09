import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatHHmm, formatMinutes, parseHHmm, roundToGrid } from '../lib/time.ts';

test('parseHHmm accepts well-formed times', () => {
  assert.deepEqual(parseHHmm('10:30'), { h: 10, m: 30 });
  assert.deepEqual(parseHHmm('0:0'), { h: 0, m: 0 });
  assert.deepEqual(parseHHmm('23:59'), { h: 23, m: 59 });
});

test('parseHHmm rejects anything that is not a time', () => {
  // "12" once slipped through as { h: 12, m: undefined } and was re-emitted
  // as the string "12:undefined" — Number.isNaN(undefined) is false.
  assert.equal(parseHHmm('12'), null);
  assert.equal(parseHHmm('99:99'), null);
  assert.equal(parseHHmm('12abc:30'), null);
  assert.equal(parseHHmm('10:30:00'), null);
  assert.equal(parseHHmm('-1:00'), null);
  assert.equal(parseHHmm(''), null);
  assert.equal(parseHHmm(null), null);
  assert.equal(parseHHmm(undefined), null);
});

test('roundToGrid carries the hour instead of dropping it', () => {
  // The bug: (Math.round(58 / 5) * 5) % 60 is 0, and the hour was left alone,
  // so "now" at 10:58 produced 10:00 — 58 minutes in the past.
  assert.deepEqual(roundToGrid(new Date(2026, 0, 1, 10, 58), 5), { h: 11, m: 0 });
  assert.deepEqual(roundToGrid(new Date(2026, 0, 1, 23, 58), 5), { h: 0, m: 0 });
  assert.deepEqual(roundToGrid(new Date(2026, 0, 1, 10, 32), 5), { h: 10, m: 30 });
  assert.deepEqual(roundToGrid(new Date(2026, 0, 1, 10, 2), 5), { h: 10, m: 0 });
});

test('roundToGrid never returns a minute off the grid', () => {
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m++) {
      const got = roundToGrid(new Date(2026, 0, 1, h, m), 5);
      assert.equal(got.m % 5, 0, `minute off grid for ${h}:${m}`);
      assert.ok(got.h >= 0 && got.h < 24, `hour out of range for ${h}:${m}`);
      assert.ok(got.m >= 0 && got.m < 60, `minute out of range for ${h}:${m}`);
    }
  }
});

test('formatters pad and wrap', () => {
  assert.equal(formatHHmm(9, 5), '09:05');
  assert.equal(formatMinutes(9 * 60), '09:00');
  assert.equal(formatMinutes(13 * 60 + 40), '13:40');
  assert.equal(formatMinutes(25 * 60), '01:00'); // past midnight, for display
});

test('formatHHmm round-trips through parseHHmm', () => {
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 7, 30, 59]) {
      assert.deepEqual(parseHHmm(formatHHmm(h, m)), { h, m });
    }
  }
});
