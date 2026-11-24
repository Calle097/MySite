import { ModeSwitch } from '../ModeSwitch';

/**
 * "Plain · Fancier" with the current one lit (a placeholder design, to be
 * revisited). Only the fancier version shows it, so Plain is the one to press.
 */
export function VersionSwitch({ label, plain, fancier }: { label: string; plain: string; fancier: string }) {
  return (
    <div className="fc-version" role="group" aria-label={label}>
      <ModeSwitch className="fc-version-option">{plain}</ModeSwitch>
      <span className="fc-version-separator" aria-hidden>
        ·
      </span>
      <span className="fc-version-option" aria-current="true">
        {fancier}
      </span>
    </div>
  );
}
