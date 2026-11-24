'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import type { Lang } from '@/lib/i18n';
import { useCurrentSection } from '@/lib/lively/current-section';
import { NavLink } from '../NavLink';
import { LanguageList } from './LanguageList';
import { SectionList, type IndexItem } from './SectionList';
import type { HeaderLink } from './LivelyHeader';
import { VersionSwitch } from './VersionSwitch';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
/** Where the column's header takes over (app/lively.css, narrow screens). */
const WIDE = 900;

/**
 * Narrow screens: one bar (name · Menu) and a full-screen menu that opens
 * as a circle from its button. While it is open the page underneath can't
 * move: overflow is locked on <html>, with the scrollbar's width put back as
 * padding so nothing shifts sideways.
 *
 * Inside: the pages, then one slot that shows either the index or, while
 * EN is open, the languages (so the menu never grows), then EN and the
 * version switch. A section link closes the menu, then glides to the
 * section. Escape closes the language list first, then the menu.
 */
export function PhoneMenu({
  lang,
  homeHref,
  pages,
  index,
  labels,
}: {
  lang: Lang;
  homeHref: string;
  pages: readonly HeaderLink[];
  index: { label: string; items: readonly IndexItem[]; follow: boolean; fixedCurrent?: number };
  labels: {
    menu: string;
    close: string;
    pages: string;
    language: string;
    languageName: string;
    version: string;
    plain: string;
    lively: string;
  };
}) {
  const menu = useRef<HTMLDivElement>(null);
  const sectionList = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [langsOpen, setLangsOpen] = useState(false);
  const followed = useCurrentSection();
  const current = index.follow ? followed : (index.fixedCurrent ?? -1);

  // The circle, from (and back into) the button that opened the menu.
  const circle = (opening: boolean) => {
    const el = menu.current;
    const from = opener.current;
    if (!el || !from) return null;
    const r = from.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    el.style.setProperty('--ox', `${x}px`);
    el.style.setProperty('--oy', `${y}px`);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const frames = [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`];
    return el.animate({ clipPath: opening ? frames : [...frames].reverse() }, { duration: 650, easing: EASE });
  };

  const lock = (on: boolean) => {
    const html = document.documentElement;
    if (on) html.style.setProperty('--scrollbar-w', `${innerWidth - html.clientWidth}px`);
    html.classList.toggle('lv-menu-open', on);
  };

  const openMenu = (button: HTMLButtonElement) => {
    opener.current = button;
    lock(true);
    setOpen(true);
  };

  const closeMenu = () => {
    // Unlock first: a section link can start scrolling the page right away,
    // while the circle is still closing over it.
    lock(false);
    setShown(false);
    const done = () => {
      setOpen(false);
      setLangsOpen(false);
      opener.current?.focus({ preventScroll: true });
    };
    const anim = circle(false);
    if (anim) anim.finished.then(done, done);
    else done();
  };

  // Opening: once the menu is in the page, grow the circle, start the
  // items' entrance, and bring the current section into view.
  useEffect(() => {
    if (!open) return;
    circle(true);
    closeButton.current?.focus({ preventScroll: true });
    const list = sectionList.current?.querySelector('ol');
    const currentItem = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (list && currentItem) {
      list.scrollTop = currentItem.offsetTop - list.offsetTop - (list.clientHeight - currentItem.offsetHeight) / 2;
    }
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    return () => cancelAnimationFrame(frame);
    // Runs once per opening (circle() and the list read refs only).
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (langsOpen) setLangsOpen(false);
      else closeMenu();
    };
    // Wide enough for the column's header: the menu has no place there.
    const onResize = () => {
      if (innerWidth >= WIDE) closeMenu();
    };
    addEventListener('keydown', onKeyDown);
    addEventListener('resize', onResize);
    return () => {
      removeEventListener('keydown', onKeyDown);
      removeEventListener('resize', onResize);
    };
  }, [open, langsOpen]);

  // Leaving the page (a link in the menu) must not leave it locked.
  useEffect(() => () => lock(false), []);

  const goToSection = (i: number, e: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(index.items[i].href.slice(1));
    if (!target) return;
    e.preventDefault();
    closeMenu();
    target.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
    history.replaceState(null, '', `#${target.id}`);
  };

  return (
    <>
      <header className="lv-phone-bar only-lively">
        <Link href={homeHref} className="lv-name">
          Mattia Callegher
        </Link>
        <button
          type="button"
          className="lv-mono"
          aria-controls="lv-menu"
          aria-expanded={open}
          onClick={(e) => openMenu(e.currentTarget)}
        >
          {labels.menu}
        </button>
      </header>

      <div
        ref={menu}
        id="lv-menu"
        className={['lv-menu', 'only-lively', shown && 'is-open'].filter(Boolean).join(' ')}
        hidden={!open}
      >
        <div className="lv-menu-top">
          <Link href={homeHref} className="lv-name">
            Mattia Callegher
          </Link>
          <button ref={closeButton} type="button" className="lv-mono" onClick={closeMenu}>
            {labels.close}
          </button>
        </div>

        <nav className="lv-menu-group" aria-label={labels.pages}>
          <span className="lv-mono">{labels.pages}</span>
          <ul className="lv-menu-pages">
            {pages.map((page, i) => {
              const text = (
                <span className="lv-mask">
                  <span style={{ '--i': i } as CSSProperties}>{page.label}</span>
                </span>
              );
              return (
                <li key={page.href}>
                  {page.file ? <a href={page.href}>{text}</a> : <NavLink href={page.href}>{text}</NavLink>}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* One slot: the index, or the languages while EN is open. */}
        <div className={['lv-menu-slot', langsOpen && 'is-langs-open'].filter(Boolean).join(' ')}>
          {index.items.length > 0 && (
            <nav ref={sectionList} className="lv-menu-group lv-menu-index" aria-label={index.label} inert={langsOpen}>
              <span className="lv-mono">{index.label}</span>
              <SectionList items={index.items} current={current} onGo={index.follow ? goToSection : undefined} />
            </nav>
          )}
          <nav id="lv-menu-langs" className="lv-menu-group lv-menu-langs" aria-label={labels.language} inert={!langsOpen}>
            <span className="lv-mono">{labels.language}</span>
            <LanguageList lang={lang} onPick={() => setLangsOpen(false)} />
          </nav>
        </div>

        <div className="lv-menu-foot" style={{ '--i': 6 } as CSSProperties}>
          <button
            type="button"
            className="lv-mono lv-lang-toggle"
            aria-controls="lv-menu-langs"
            aria-expanded={langsOpen}
            aria-label={`${labels.language}: ${labels.languageName}`}
            onClick={() => setLangsOpen((o) => !o)}
          >
            {lang.toUpperCase()} <span className="lv-caret" aria-hidden>▾</span>
          </button>
          <VersionSwitch label={labels.version} plain={labels.plain} lively={labels.lively} />
        </div>
      </div>
    </>
  );
}
