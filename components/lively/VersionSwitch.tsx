import { ModeSwitch } from '../ModeSwitch';

/**
 * "Plain · Lively" with the current one lit (a placeholder design, to be
 * revisited). Only lively mode shows it, so Plain is the one to press.
 */
export function VersionSwitch({ label, plain, lively }: { label: string; plain: string; lively: string }) {
  return (
    <div className="lv-version" role="group" aria-label={label}>
      <ModeSwitch className="lv-version-option">{plain}</ModeSwitch>
      <span className="lv-version-separator" aria-hidden>
        ·
      </span>
      <span className="lv-version-option" aria-current="true">
        {lively}
      </span>
    </div>
  );
}
