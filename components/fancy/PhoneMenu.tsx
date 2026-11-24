'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import type { Lang } from '@/lib/i18n';
import { useCurrentSection } from '@/lib/fancy/current-section';
import { MODE_EVENT } from '@/lib/mode';
import { EASE, circleFrames, reducedMotion } from '@/lib/motion';
import { NAME } from '@/lib/site';
import { LanguageList, LanguageToggle } from './LanguageList';
import { NavLink } from './NavLink';
import { SectionList, type IndexItem } from './SectionList';
import type { ChromeLabels, PageLink } from './types';
import { VersionSwitch } from './VersionSwitch';

/** Where the column's header takes over: keep in step with the 900px
    breakpoints in app/fancy/ (narrow.css and the short-screen queries). */
const WIDE = 900;

/**
 * Narrow screens: one bar (name · Menu) and a full-screen menu that opens
 * as a circle from its button. It is a modal dialog: while it is open the
 * page underneath can't move, take focus or be read.
 *
 * Inside: the pages, then one slot that shows either the index or, while
 * EN is open, the languages (so the menu never grows), then EN and the
 * version switch. A section link closes the menu, then glides to the
 * section. Escape closes the language list first, then the menu; switching
 * versions closes both.
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
  pages: readonly PageLink[];
  /** `current`: a fixed current item (a demo page lists every demo); without
      it the items are the page's own sections, following the scroll. */
  index: { label: string; items: readonly IndexItem[]; current?: number };
  labels: ChromeLabels;
}) {
  const menu = useRef<HTMLDivElement>(null);
  const sectionList = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closing = useRef(false);
  const held = useRef<HTMLElement[]>([]);
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [langsOpen, setLangsOpen] = useState(false);
  const followed = useCurrentSection();
  const follows = index.current === undefined;
  const current = index.current ?? followed;

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
    if (reducedMotion()) return null;
    const frames = circleFrames(x, y);
    return el.animate({ clipPath: opening ? frames : [...frames].reverse() }, { duration: 650, easing: EASE });
  };

  // The page under the open menu: overflow locked on <html> (the
  // scrollbar's width put back as padding, so nothing shifts sideways), and
  // everything around the menu inert. Only what this made inert is released.
  const holdPage = (on: boolean) => {
    const html = document.documentElement;
    if (on) html.style.setProperty('--scrollbar-w', `${innerWidth - html.clientWidth}px`);
    html.classList.toggle('fc-menu-open', on);
    held.current.forEach((el) => (el.inert = false));
    held.current = [];
    if (!on) return;
    for (let el: HTMLElement | null = menu.current; el && el !== document.body; el = el.parentElement) {
      for (const sibling of el.parentElement?.children ?? []) {
        if (sibling !== el && sibling instanceof HTMLElement && !sibling.inert) {
          sibling.inert = true;
          held.current.push(sibling);
        }
      }
    }
  };

  const openMenu = (button: HTMLButtonElement) => {
    opener.current = button;
    holdPage(true);
    setOpen(true);
  };

  const closeMenu = () => {
    if (closing.current) return;
    closing.current = true;
    // Release first: a section link can start scrolling the page right
    // away, while the circle is still closing over it.
    holdPage(false);
    setShown(false);
    const done = () => {
      closing.current = false;
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
    // Switching to plain closes it at once, without the circle (plain never
    // shows the menu), so switching back finds it closed.
    const onModeChange = () => {
      holdPage(false);
      setShown(false);
      setOpen(false);
      setLangsOpen(false);
    };
    addEventListener('keydown', onKeyDown);
    addEventListener('resize', onResize);
    addEventListener(MODE_EVENT, onModeChange);
    return () => {
      removeEventListener('keydown', onKeyDown);
      removeEventListener('resize', onResize);
      removeEventListener(MODE_EVENT, onModeChange);
    };
  }, [open, langsOpen]);

  // Leaving the page (a link in the menu) must not leave it held.
  useEffect(() => () => holdPage(false), []);

  const goToSection = (i: number, e: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(index.items[i].href.slice(1));
    if (!target) return;
    e.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${target.id}`);
  };

  return (
    <>
      <header className="fc-phone-bar only-fancy">
        <Link href={homeHref} className="fc-name">
          {NAME}
        </Link>
        <button
          type="button"
          className="fc-mono"
          aria-controls="fc-menu"
          aria-expanded={open}
          onClick={(e) => openMenu(e.currentTarget)}
        >
          {labels.menu}
        </button>
      </header>

      <div
        ref={menu}
        id="fc-menu"
        role="dialog"
        aria-modal="true"
        aria-label={labels.menu}
        className={['fc-menu', 'only-fancy', shown && 'is-open'].filter(Boolean).join(' ')}
        hidden={!open}
      >
        <div className="fc-menu-top">
          <Link href={homeHref} className="fc-name">
            {NAME}
          </Link>
          <button ref={closeButton} type="button" className="fc-mono" onClick={closeMenu}>
            {labels.close}
          </button>
        </div>

        <nav className="fc-menu-group" aria-label={labels.pages}>
          <span className="fc-mono">{labels.pages}</span>
          <ul className="fc-menu-pages">
            {pages.map((page, i) => {
              const text = (
                <span className="fc-mask">
                  <span style={{ '--i': i } as CSSProperties}>
                    {page.label}
                    {page.file && ' ↓'}
                  </span>
                </span>
              );
              return (
                <li key={page.href}>
                  <NavLink href={page.href} file={page.file}>
                    {text}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* One slot: the index, or the languages while EN is open. */}
        <div className={['fc-menu-slot', langsOpen && 'is-langs-open'].filter(Boolean).join(' ')}>
          {index.items.length > 0 && (
            <nav ref={sectionList} className="fc-menu-group fc-menu-index" aria-label={index.label} inert={langsOpen}>
              <span className="fc-mono">{index.label}</span>
              <SectionList items={index.items} current={current} onGo={follows ? goToSection : undefined} />
            </nav>
          )}
          <nav id="fc-menu-langs" className="fc-menu-group fc-menu-langs" aria-label={labels.language} inert={!langsOpen}>
            <span className="fc-mono">{labels.language}</span>
            <LanguageList lang={lang} onPick={() => setLangsOpen(false)} />
          </nav>
        </div>

        {/* Enters a beat after the last page. */}
        <div className="fc-menu-foot" style={{ '--i': pages.length + 1 } as CSSProperties}>
          <LanguageToggle
            lang={lang}
            controls="fc-menu-langs"
            open={langsOpen}
            labels={labels}
            onToggle={() => setLangsOpen((o) => !o)}
          />
          <VersionSwitch labels={labels} />
        </div>
      </div>
    </>
  );
}
