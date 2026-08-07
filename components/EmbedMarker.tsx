// The playground embeds demos as <iframe src=".../#embed">. When this element
// is the URL's :target, CSS hides the page's scrollbar rail — iframe
// detection with no JavaScript at all. "Open ↗" links omit the fragment, so
// standalone visits keep their scrollbar.
export function EmbedMarker() {
  return <span id="embed" aria-hidden className="absolute left-0 top-0" />;
}
