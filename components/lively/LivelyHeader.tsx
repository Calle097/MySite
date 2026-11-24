'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Lang } from '@/lib/i18n';
import { NavLink } from '../NavLink';
import { LanguageList } from './LanguageList';

export type HeaderLink = { href: string; label: string; /** A file, not a route: a plain <a>. */ file?: boolean };

/**
 * The header at the top of the column: the name (home), the pages, the
 * language and, when the column is too narrow for the pages, Menu.
 *
 * Menu grows the header sideways across the whole window (app/lively.css),
 * with the pages in the middle; EN opens the language list under the line.
 * Both close on Escape (the list first), on a click outside, and when the
 * window changes size (the measurements no longer hold).
 */
export function LivelyHeader({
  lang,
  homeHref,
  homeLabel,
  links,
  labels,
}: {
  lang: Lang;
  homeHref: string;
  homeLabel: string;
  links: readonly HeaderLink[];
  labels: { pages: string; menu: string; close: string; language: string; languageName: string };
}) {
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const langButton = useRef<HTMLButtonElement>(null);
  const langList = useRef<HTMLElement>(null);
  const [extended, setExtended] = useState(false);
  const [langsOpen, setLangsOpen] = useState(false);

  // What the CSS needs to grow the header out of its column: the window's
  // width, and how far the column's edge is from the window's.
  const measure = () => {
    const el = header.current;
    const column = el?.parentElement;
    if (!el || !column) return;
    const width = document.documentElement.clientWidth;
    el.style.setProperty('--full', `${width}px`);
    el.style.setProperty('--reach', `${width - column.getBoundingClientRect().right}px`);
  };

  useEffect(() => {
    if (!extended && !langsOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target instanceof Node)) return;
      if (langsOpen && !langList.current?.contains(e.target) && !langButton.current?.contains(e.target)) setLangsOpen(false);
      if (extended && !header.current?.contains(e.target)) setExtended(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (langsOpen) {
        setLangsOpen(false);
        langButton.current?.focus();
      } else {
        setExtended(false);
        menuButton.current?.focus();
      }
    };
    const onResize = () => {
      setExtended(false);
      setLangsOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    addEventListener('keydown', onKeyDown);
    addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      removeEventListener('keydown', onKeyDown);
      removeEventListener('resize', onResize);
    };
  }, [extended, langsOpen]);

  const pageLinks = (stagger: boolean, onClick?: () => void) =>
    links.map((l, i) => {
      const style = stagger ? ({ '--i': i } as CSSProperties) : undefined;
      return l.file ? (
        <a key={l.href} href={l.href} style={style} onClick={onClick}>
          {l.label}
        </a>
      ) : (
        <NavLink key={l.href} href={l.href} style={style} onClick={onClick}>
          {l.label}
        </NavLink>
      );
    });

  return (
    <header
      ref={header}
      className={['lv-header', 'only-lively', extended && 'is-extended', langsOpen && 'is-langs-open'].filter(Boolean).join(' ')}
    >
      <Link href={homeHref} className="lv-name" aria-label={homeLabel}>
        Mattia Callegher
      </Link>
      <nav className="lv-header-nav" aria-label={labels.pages}>
        {pageLinks(false)}
      </nav>
      <div className="lv-header-tools">
        <button
          ref={langButton}
          type="button"
          className="lv-mono lv-lang-toggle"
          aria-controls="lv-header-langs"
          aria-expanded={langsOpen}
          aria-label={`${labels.language}: ${labels.languageName}`}
          onClick={() => setLangsOpen((open) => !open)}
        >
          {lang.toUpperCase()} <span className="lv-caret" aria-hidden>▾</span>
        </button>
        <button
          ref={menuButton}
          type="button"
          className="lv-mono lv-menu-button"
          aria-controls="lv-header-more"
          aria-expanded={extended}
          onClick={() => {
            if (!extended) measure();
            setExtended(!extended);
          }}
        >
          {extended ? labels.close : labels.menu}
        </button>
      </div>
      <nav id="lv-header-more" className="lv-header-more" aria-label={labels.pages} inert={!extended}>
        {pageLinks(true, () => setExtended(false))}
      </nav>
      <nav id="lv-header-langs" ref={langList} className="lv-header-langs" aria-label={labels.language} inert={!langsOpen}>
        <LanguageList lang={lang} onPick={() => setLangsOpen(false)} />
      </nav>
    </header>
  );
}
