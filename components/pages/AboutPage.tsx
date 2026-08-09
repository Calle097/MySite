import { DICTS, type Lang } from '@/lib/i18n';

export function AboutPage({ lang }: { lang: Lang }) {
  const dict = DICTS[lang];

  return (
    <div className="gutter rise pt-8 sm:pt-12">
      <h1 className="font-semibold tracking-tight" style={{ fontSize: 'clamp(2rem, 3.6vw, 3.25rem)' }}>
        {dict.about.title}
      </h1>
      <div className="mt-8 max-w-[58ch] space-y-5 leading-relaxed text-muted-foreground">
        {dict.about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
