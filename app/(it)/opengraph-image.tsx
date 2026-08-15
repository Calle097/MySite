import { ogAlt, ogImage, contentType, size } from '@/lib/og';

// Required with output: export — metadata routes must opt into static.
export const dynamic = 'force-static';

export const alt = ogAlt('it');
export { contentType, size };

export default function Image() {
  return ogImage('it');
}
