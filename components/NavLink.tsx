'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** A nav link that marks itself as the current page (aria-current), which lively mode draws as a line of light. */
export function NavLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const pathname = usePathname() ?? '/';
  const withSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);

  return (
    <Link href={href} aria-current={withSlash(pathname) === withSlash(href) ? 'page' : undefined} className={className}>
      {children}
    </Link>
  );
}
