import { DICTS, type Lang } from '@/lib/i18n';
import { TimePickerDemo } from '@/components/demos/TimePickerDemo';
import { EmbedMarker } from '@/components/EmbedMarker';

// Chrome hides itself when embedded (iframe src carries #embed); a
// standalone visit keeps the header and footer.
export function TimePickerDemoPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang].demos;

  return (
    <div className="px-6">
      <EmbedMarker />
      <noscript>
        <p className="mx-auto mt-10 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
          {dict.noscript}
        </p>
      </noscript>
      <TimePickerDemo strings={dict.timePicker} />
    </div>
  );
}
