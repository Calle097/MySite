'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Lang } from '@/lib/i18n';
import { NAME } from '@/lib/site';
import { MODE_EVENT } from '@/lib/mode';
import { LanguageList, LanguageToggle } from './LanguageList';
import { NavLink } from './NavLink';
import type { ChromeLabels, PageLink } from './types';

/**
 * The header at the top of the column: the name (home), the pages, the
 * language and, when the column is too narrow for the pages, Menu.
 *
 * Menu grows the header sideways across the whole window (app/fancy.css),
 * with the pages in the middle; EN opens the language list under the line.
 * Both close on Escape (the list first), on a click outside, when the
 * window changes size (the measurements no longer hold), and when the
 * version changes.
 */
export function FancyHeader({
  lang,
  homeHref,
  links,
  labels,
}: {
  lang: Lang;
  homeHref: string;
  /** The pages but home: the name is the way there. */
  links: readonly PageLink[];
  labels: ChromeLabels;
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
    const closeBoth = () => {
      setExtended(false);
      setLangsOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    addEventListener('keydown', onKeyDown);
    addEventListener('resize', closeBoth);
    addEventListener(MODE_EVENT, closeBoth);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      removeEventListener('keydown', onKeyDown);
      removeEventListener('resize', closeBoth);
      removeEventListener(MODE_EVENT, closeBoth);
    };
  }, [extended, langsOpen]);

  const pageLinks = (stagger: boolean, onClick?: () => void) =>
    links.map((l, i) => (
      <NavLink
        key={l.href}
        href={l.href}
        file={l.file}
        style={stagger ? ({ '--i': i } as CSSProperties) : undefined}
        onClick={onClick}
      >
        {l.label}
      </NavLink>
    ));

  return (
    <header
      ref={header}
      className={['fc-header', 'only-fancy', extended && 'is-extended', langsOpen && 'is-langs-open'].filter(Boolean).join(' ')}
    >
      <Link href={homeHref} className="fc-name" aria-label={`${NAME}, ${labels.home}`}>
        {NAME}
      </Link>
      <nav className="fc-header-nav" aria-label={labels.pages}>
        {pageLinks(false)}
      </nav>
      <div className="fc-header-tools">
        <LanguageToggle
          ref={langButton}
          lang={lang}
          controls="fc-header-langs"
          open={langsOpen}
          labels={labels}
          onToggle={() => setLangsOpen((open) => !open)}
        />
        <button
          ref={menuButton}
          type="button"
          className="fc-mono fc-menu-button"
          aria-controls="fc-header-more"
          aria-expanded={extended}
          onClick={() => {
            if (!extended) measure();
            setExtended(!extended);
          }}
        >
          {extended ? labels.close : labels.menu}
        </button>
      </div>
      <nav id="fc-header-more" className="fc-header-more" aria-label={labels.pages} inert={!extended}>
        {pageLinks(true, () => setExtended(false))}
      </nav>
      <nav id="fc-header-langs" ref={langList} className="fc-header-langs" aria-label={labels.language} inert={!langsOpen}>
        <LanguageList lang={lang} onPick={() => setLangsOpen(false)} />
      </nav>
    </header>
  );
}
