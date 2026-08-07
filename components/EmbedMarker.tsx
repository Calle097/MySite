// The playground embeds demos as <iframe src=".../#embed">. When this element
// is the URL's :target, CSS hides the page's scrollbar rail — iframe
// detection with no JavaScript at all. "Open ↗" links omit the fragment, so
// standalone visits keep their scrollbar.
//
// position: fixed is load-bearing: fragment navigation scrolls the target
// into view — and propagates that scroll to the PARENT page, yanking the
// playground down as each iframe loads. A fixed element is always "in view",
// so no scroll happens anywhere, while :target still matches.
export function EmbedMarker() {
  return <span id="embed" aria-hidden className="fixed left-0 top-0" />;
}
