import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BOARDING_MIN, DAY_START, TRANSFER_MIN, planDay, recalcTimes, type Activity } from '../lib/schedule.ts';
import { formatMinutes } from '../lib/time.ts';

const ACTIVITIES: Activity[] = [
  { title: 'a', minutes: 60 },
  { title: 'b', minutes: 45 },
  { title: 'c', minutes: 40 },
  { title: 'd', minutes: 60 },
  { title: 'e', minutes: 45 },
];

/** Every moment of the day, in the order the page lays them out. */
const timeline = (plan: ReturnType<typeof planDay>) => [
  ...plan.before.flatMap((a) => [a.start, a.end]),
  plan.dep,
  plan.arr,
  ...plan.after.flatMap((a) => [a.start, a.end]),
];

test('recalcTimes lays activities end to end with a transfer between', () => {
  const timed = recalcTimes(ACTIVITIES.slice(0, 2), DAY_START);
  assert.equal(formatMinutes(timed[0].start), '09:00');
  assert.equal(formatMinutes(timed[0].end), '10:00');
  assert.equal(timed[1].start, timed[0].end + TRANSFER_MIN);
  assert.equal(formatMinutes(timed[1].start), '10:15');
});

test('recalcTimes has no transfer before the first activity', () => {
  assert.equal(recalcTimes(ACTIVITIES.slice(0, 1), DAY_START)[0].start, DAY_START);
});

test('recalcTimes handles an empty list', () => {
  assert.deepEqual(recalcTimes([], DAY_START), []);
});

test('the train can sit at either end', () => {
  const first = planDay(ACTIVITIES, 0, 85);
  assert.equal(first.before.length, 0);
  assert.equal(first.dep, DAY_START, 'with nothing before it, the train leaves at the start of the day');
  assert.equal(first.after.length, ACTIVITIES.length);

  const last = planDay(ACTIVITIES, ACTIVITIES.length, 85);
  assert.equal(last.after.length, 0);
  assert.equal(last.before.length, ACTIVITIES.length);
  assert.equal(last.dep, last.before.at(-1)!.end + BOARDING_MIN);
});

test('the journey takes exactly the length it is given', () => {
  for (const minutes of [1, 85, 240]) {
    const plan = planDay(ACTIVITIES, 2, minutes);
    assert.equal(plan.arr - plan.dep, minutes);
  }
});

test('every train position produces a strictly forward timeline', () => {
  for (let pos = 0; pos <= ACTIVITIES.length; pos++) {
    const seq = timeline(planDay(ACTIVITIES, pos, 85));
    for (let i = 1; i < seq.length; i++) {
      assert.ok(seq[i] >= seq[i - 1], `time went backwards at index ${i} with the train at ${pos}`);
    }
  }
});

test('no activity is lost or duplicated wherever the train sits', () => {
  for (let pos = 0; pos <= ACTIVITIES.length; pos++) {
    const plan = planDay(ACTIVITIES, pos, 85);
    const titles = [...plan.before, ...plan.after].map((a) => a.title);
    assert.deepEqual(titles, ACTIVITIES.map((a) => a.title), `train at ${pos}`);
  }
});

test('a long day stays ordered past midnight', () => {
  // Formatting wraps at 24h for display; the underlying minutes must not, or
  // the afternoon would appear to happen before the morning.
  const marathon: Activity[] = Array.from({ length: 12 }, (_, i) => ({ title: `x${i}`, minutes: 90 }));
  for (const pos of [0, 6, marathon.length]) {
    const seq = timeline(planDay(marathon, pos, 85));
    for (let i = 1; i < seq.length; i++) {
      assert.ok(seq[i] >= seq[i - 1], `time went backwards at index ${i} with the train at ${pos}`);
    }
    assert.ok(seq.at(-1)! > 24 * 60, `fixture should run past midnight with the train at ${pos}`);
  }
});

test('the departure itself is not wrapped', () => {
  // Guards the specific shape of the old bug: the departure was derived by
  // re-parsing an already-formatted "HH:mm", so a morning that ran past
  // midnight sent the train backwards to the start of the day.
  const marathon: Activity[] = Array.from({ length: 12 }, (_, i) => ({ title: `x${i}`, minutes: 90 }));
  const plan = planDay(marathon, marathon.length, 85);
  const lastBefore = plan.before.at(-1)!;
  assert.ok(lastBefore.end > 24 * 60, 'fixture should end the morning past midnight');
  assert.equal(plan.dep, lastBefore.end + BOARDING_MIN);
  assert.ok(plan.dep > lastBefore.end, 'the train must leave after the activity before it');
  assert.ok(plan.arr > plan.dep, 'the train must arrive after it departs');
});
