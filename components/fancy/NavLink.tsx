'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { CSSProperties, ReactNode } from 'react';

/**
 * A link in the fancier version's page lists (the header, the phone menu).
 * A route marks itself as the current page (aria-current), which the lists
 * draw in the full text colour. A file (the CV) is a plain <a>: a Next
 * <Link> would prefetch it as an RSC payload.
 */
export function NavLink({
  href,
  file,
  style,
  onClick,
  children,
}: {
  href: string;
  file?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
  children: ReactNode;
}) {
  const pathname = usePathname() ?? '/';
  if (file) {
    return (
      <a href={href} style={style} onClick={onClick}>
        {children}
      </a>
    );
  }
  const withSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);

  return (
    <Link
      href={href}
      aria-current={withSlash(pathname) === withSlash(href) ? 'page' : undefined}
      style={style}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
