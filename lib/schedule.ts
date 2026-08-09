/**
 * The transit demo's domain: a day of activities split by a train journey.
 * Moving the train recomputes every downstream time.
 *
 * Times are minutes since midnight throughout and are formatted only at
 * render. An earlier version formatted to "HH:mm" and then parsed the
 * departure back out of that string, so a wrap past midnight silently lost a
 * day. Keeping the numbers means there is no round-trip to get wrong.
 */

/** Walking time between two consecutive activities. */
export const TRANSFER_MIN = 15;
/** Slack between the last morning activity and the train leaving. */
export const BOARDING_MIN = 20;
/** Everything starts at 09:00. */
export const DAY_START = 9 * 60;

export interface Activity {
  title: string;
  minutes: number;
}

export interface TimedActivity extends Activity {
  /** Minutes since midnight. */
  start: number;
  end: number;
}

/** Lay activities end to end from `startMin`, with a transfer between each. */
export function recalcTimes(items: Activity[], startMin: number): TimedActivity[] {
  let at = startMin;
  return items.map((item, idx) => {
    if (idx > 0) at += TRANSFER_MIN;
    const start = at;
    at += item.minutes;
    return { ...item, start, end: at };
  });
}

export interface DayPlan {
  before: TimedActivity[];
  after: TimedActivity[];
  /** Minutes since midnight. */
  dep: number;
  arr: number;
}

/**
 * Split `items` at `trainPosition` and time the whole day around the journey.
 * `trainPosition` is an insertion index: 0 puts the train first, items.length
 * puts it last.
 */
export function planDay(items: Activity[], trainPosition: number, trainMinutes: number): DayPlan {
  const before = recalcTimes(items.slice(0, trainPosition), DAY_START);
  const lastEnd = before.at(-1)?.end;
  const dep = lastEnd === undefined ? DAY_START : lastEnd + BOARDING_MIN;
  const arr = dep + trainMinutes;
  return { before, after: recalcTimes(items.slice(trainPosition), arr + TRANSFER_MIN), dep, arr };
}
