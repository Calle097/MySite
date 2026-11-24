/** The easing of the circles (version switch, phone menu). */
export const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * clip-path keyframes for a circle that grows from (x, y) until it covers
 * the whole window. Reverse them to shrink it back into the point.
 */
export function circleFrames(x: number, y: number) {
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  return [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`];
}
