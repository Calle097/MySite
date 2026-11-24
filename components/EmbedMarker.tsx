// The playground loads each demo as <iframe src=".../#embed">: this element
// is then the :target, which the CSS reads to tell a framed demo apart, with
// no JavaScript. position: fixed matters: jumping to a target scrolls it into
// view, and that scroll would reach the playground itself as each frame
// loads; a fixed element is always in view, so nothing scrolls.
export function EmbedMarker() {
  return <span id="embed" aria-hidden className="fixed left-0 top-0" />;
}
