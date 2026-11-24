import { ModeSwitch } from './ModeSwitch';

/**
 * Plain's "plain / fancier", after "en / it" and in its form: the current
 * one lit, the other switches. Hidden without JavaScript, which it needs.
 */
export function PlainVersionSwitch({ label, plain, fancier }: { label: string; plain: string; fancier: string }) {
  return (
    <span role="group" aria-label={label} className="needs-js flex gap-1.5">
      <span aria-current="true" className="lowercase text-foreground">
        {plain}
      </span>
      <span aria-hidden>/</span>
      <ModeSwitch className="lowercase transition-colors hover:text-brand-accent">{fancier}</ModeSwitch>
    </span>
  );
}
