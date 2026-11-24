/** The first Tab stop on every page: past plain's header and the fancier
    version's column header, to the page's own content (PageLayout's #content). */
export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#content"
      className="site-chrome sr-only font-mono text-sm focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:px-4 focus:py-2 bg-brand-accent text-background"
    >
      {label}
    </a>
  );
}
