import { ModeSwitch } from '../ModeSwitch';
import type { ChromeLabels } from './types';

/**
 * "Plain · Fancier" with the current one lit. Only the fancier version shows
 * it, so Plain is the one to press.
 */
export function VersionSwitch({ labels }: { labels: Pick<ChromeLabels, 'version' | 'plain' | 'fancier'> }) {
  return (
    <div className="fc-version" role="group" aria-label={labels.version}>
      <ModeSwitch className="fc-version-option fc-mono">{labels.plain}</ModeSwitch>
      <span className="fc-version-separator" aria-hidden>
        ·
      </span>
      <span className="fc-version-option fc-mono" aria-current="true">
        {labels.fancier}
      </span>
    </div>
  );
}
