'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { CSSProperties } from 'react';

/** A nav link that marks itself as the current page (aria-current), which the fancier version draws in the full text colour. */
export function NavLink({
  href,
  className,
  style,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? '/';
  const withSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);

  return (
    <Link
      href={href}
      aria-current={withSlash(pathname) === withSlash(href) ? 'page' : undefined}
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
