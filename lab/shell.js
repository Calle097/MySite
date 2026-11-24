/*
  Lively mockups: the shared behaviour. Not part of the site build.

  A page brings its content in plain markup (see concepts.html and
  playground.html): a .stage with its .hero, and a .flow of sections
  marked [data-section], each with an <h2> and its .entry blocks. This
  script adds everything the pages share:
  - the markup of the shell: phone bar and menu, header, section index,
    version switch, footer, background canvas, lab bar;
  - the enhancements the content leaves out: numbered, masked titles,
    reveal and light-focus hooks;
  - the behaviour: index, menu, header, language, reveals, the liquid light
    and the lab bar's settings.
*/
(() => {
  const html = document.documentElement;
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nn = (i) => String(i + 1).padStart(2, '0');
  const masked = (inner, i = 0) => `<span class="mask"><span style="--i:${i}">${inner}</span></span>`;

  /* ---- the site's pages (lab files where they exist) ------------------ */
  const PAGES = [
    { id: 'home', name: 'Home', href: 'concepts.html' },
    { id: 'about', name: 'About', href: '#' },
    { id: 'playground', name: 'Playground', href: 'playground.html' },
    { id: 'stack', name: 'Stack', href: '#' },
    { id: 'cv', name: 'CV', menuName: 'CV ↓', href: '#' },
  ];
  const EMAIL = 'callegher.mattia00@gmail.com';
  const isCurrent = (p) => (p.id === html.dataset.page ? ' aria-current="page"' : '');
  // The name is the link home, so the header lists the other pages.
  const headerLinks = (stagger) =>
    PAGES.filter((p) => p.id !== 'home')
      .map((p, i) => `<a href="${p.href}"${isCurrent(p)}${stagger ? ` style="--i: ${i}"` : ''}>${p.name}</a>`)
      .join('');

  /* ---- the page's own sections ----------------------------------------- */
  const sections = [...document.querySelectorAll('[data-section]')];
  // Read before the titles get their numbers and masks.
  const names = sections.map((s) => s.dataset.name ?? s.querySelector('h2').textContent.trim());

  /* ---- the shell's markup --------------------------------------------- */
  const langToggle = (controls) =>
    `<button class="mono" data-lang-toggle aria-controls="${controls}" aria-expanded="false" aria-label="Language: English"><span class="code">EN</span> <span class="caret" aria-hidden="true">▾</span></button>`;
  const versionSwitch =
    '<div class="version" role="group" aria-label="Version"><button aria-pressed="false">Plain</button><span class="sep">·</span><button aria-pressed="true">Lively</button></div>';
  const sectionList = (id) =>
    `<ol class="sections" id="${id}">${names
      .map((name, i) => `<li style="--i:${i}"><a href="#${sections[i].id}" data-goto="${i}" data-focus><span class="mono">${nn(i)}</span><span class="t">${name}</span></a></li>`)
      .join('')}</ol>`;

  document.body.insertAdjacentHTML(
    'afterbegin',
    `<canvas id="bg" aria-hidden="true"></canvas>
    <header class="mbar">
      <a class="name" href="${PAGES[0].href}">Mattia Callegher</a>
      <button class="mono" data-menu-open aria-controls="menu" aria-expanded="false">Menu</button>
    </header>
    <div class="menu" id="menu" hidden>
      <div class="menu-top"><a class="name" href="${PAGES[0].href}">Mattia Callegher</a><button class="mono" id="menu-close">Close</button></div>
      <nav class="menu-group" aria-label="Pages">
        <span class="mono">Pages</span>
        <ul class="pages">${PAGES.map((p, i) => `<li><a href="${p.href}"${isCurrent(p)}>${masked(p.menuName ?? p.name, i)}</a></li>`).join('')}</ul>
      </nav>
      <div class="menu-swap">
        ${sections.length ? `<nav class="menu-group menu-index" aria-label="On this page"><span class="mono">On this page</span>${sectionList('menu-list')}</nav>` : ''}
        <nav class="menu-group menu-langs" id="menu-langs" aria-label="Language" inert>
          <span class="mono">Language</span>
          <ul class="lang-options langs-scroll" data-lang-list></ul>
        </nav>
      </div>
      <div class="menu-foot" style="--i: 6">${langToggle('menu-langs')}${versionSwitch}</div>
    </div>`,
  );

  const stage = document.querySelector('.stage');
  stage.insertAdjacentHTML(
    'afterbegin',
    `<header class="stage-top">
      <a class="name" href="${PAGES[0].href}" aria-label="Mattia Callegher, home">Mattia Callegher</a>
      <nav class="stage-nav" aria-label="Pages">${headerLinks(false)}</nav>
      <div class="tools">
        ${langToggle('header-langs')}
        <button class="mono menu-btn" aria-controls="stage-more" aria-expanded="false">Menu</button>
      </div>
      <nav class="stage-more" id="stage-more" aria-label="Pages" inert>${headerLinks(true)}</nav>
      <nav class="header-langs" id="header-langs" aria-label="Language" inert>
        <ul class="lang-options langs-scroll" data-lang-list></ul>
      </nav>
    </header>`,
  );
  stage.insertAdjacentHTML(
    'beforeend',
    `${
      sections.length
        ? `<nav class="index" aria-label="Sections">
            <div class="index-head">
              <span class="mono">Index</span>
              <span class="count" aria-hidden="true">
                <span class="roll"><span class="roll-inner" id="roll">${names.map((_, i) => `<span>${nn(i)}</span>`).join('')}</span></span>
                <span class="mono">/ ${String(names.length).padStart(2, '0')}</span>
              </span>
            </div>
            ${sectionList('index-list')}
          </nav>`
        : ''
    }
    <div class="stage-foot"><span class="mono">Version</span>${versionSwitch}</div>`,
  );

  document.querySelector('.flow').insertAdjacentHTML(
    'beforeend',
    `<footer class="foot">
      <span class="mono">Mattia Callegher · Italy</span>
      <nav class="foot-links" aria-label="Elsewhere"><a href="mailto:${EMAIL}">Email</a><a href="#">GitHub</a><a href="#">Source</a></nav>
    </footer>`,
  );
  document.body.insertAdjacentHTML('beforeend', '<div class="lab" id="lab"></div>');

  /* ---- what the content leaves out -------------------------------------- */
  // Headline lines rise from behind a clean edge; the rest of the hero fades in.
  document.querySelectorAll('.hero h1 > span').forEach((line, i) => {
    line.className = 'mask';
    line.innerHTML = `<span style="--i:${i}">${line.innerHTML}</span>`;
  });
  document.querySelectorAll('.hero > :not(h1)').forEach((el) => el.classList.add('fade'));
  // Section titles get their number and mask in; entries reveal, and the
  // light gathers behind the one you point at.
  sections.forEach((section, i) => {
    const title = section.querySelector('h2');
    title.dataset.reveal = '';
    title.innerHTML = `<span class="mono">${nn(i)}</span>${masked(title.innerHTML)}`;
    section.querySelectorAll('.entry').forEach((entry, j) => {
      entry.dataset.reveal = '';
      entry.dataset.focus = '';
      entry.style.setProperty('--i', j);
      for (const child of entry.children) {
        if (child.matches('.entry-title')) child.innerHTML = masked(child.innerHTML, j);
        else child.classList.add('fade');
      }
    });
  });

  // The golden spiral: dots placed with the golden angle, pulsing outward.
  document.querySelectorAll('[data-spiral]').forEach((el) => {
    const n = Number(el.dataset.spiral) || 150;
    const golden = Math.PI * (3 - Math.sqrt(5));
    let dots = '';
    for (let i = 0; i < n; i++) {
      const f = (i + 0.5) / n, r = Math.sqrt(f) * 46, a = (i + 0.5) * golden;
      dots += `<circle cx="${(50 + r * Math.cos(a)).toFixed(2)}" cy="${(50 + r * Math.sin(a)).toFixed(2)}" r="${(140 / Math.sqrt(n * 70)).toFixed(2)}" fill="currentColor" style="--d:${(-f * 3).toFixed(2)}s"/>`;
    }
    el.innerHTML = `<svg class="spiral" viewBox="0 0 100 100" aria-hidden="true"><g>${dots}</g></svg>`;
  });

  /* ---- which section is in the middle of the view ------------------- */
  let current = -1;
  function setCurrent(i) {
    if (i === current) return;
    current = i;
    document.getElementById('roll')?.style.setProperty('--n', i);
    document.querySelectorAll('[data-goto]').forEach((a) => a.setAttribute('aria-current', String(Number(a.dataset.goto) === i)));
  }
  if (sections.length) {
    const spy = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) setCurrent(sections.indexOf(e.target)); },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => spy.observe(s));
    setCurrent(0);
    // The last section may never reach the middle of the view on a short
    // page end; at the very bottom, it is the current one.
    addEventListener('scroll', () => {
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) setCurrent(sections.length - 1);
    }, { passive: true });
  }

  /* ---- the menu: opens as a circle from whichever button opened it --- */
  const menu = document.getElementById('menu');
  let opener = null;
  function circle(from, opening) {
    const r = from.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    menu.style.setProperty('--ox', `${x}px`);
    menu.style.setProperty('--oy', `${y}px`);
    if (reduce()) return null;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const frames = [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`];
    return menu.animate({ clipPath: opening ? frames : frames.reverse() }, { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
  }
  const closeButton = document.getElementById('menu-close');
  function openMenu(button) {
    opener = button;
    menu.hidden = false;
    // The page underneath stays put while the menu is open.
    html.style.setProperty('--scrollbar-w', `${innerWidth - html.clientWidth}px`);
    html.classList.add('menu-open');
    document.querySelectorAll('[data-menu-open]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
    circle(button, true);
    // A long section list scrolls inside the menu: start with the current one in view.
    const sectionsInMenu = document.getElementById('menu-list');
    if (sectionsInMenu) showCurrent(sectionsInMenu);
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('open')));
    closeButton.focus({ preventScroll: true });
  }
  function closeMenu() {
    if (menu.hidden) return;
    // Unlock first: a section link can start scrolling the page right
    // away, while the circle is still closing over it.
    html.classList.remove('menu-open');
    document.querySelectorAll('[data-menu-open]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    const done = () => {
      menu.hidden = true;
      menu.classList.remove('open');
      setMenuLangs(false);
      opener?.focus({ preventScroll: true });
    };
    const anim = circle(opener ?? menu, false);
    if (anim) anim.finished.then(done);
    else done();
  }
  document.querySelectorAll('[data-menu-open]').forEach((b) => b.addEventListener('click', () => openMenu(b)));
  closeButton.addEventListener('click', closeMenu);
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    // An open language list goes first, then the extended header, then the menu.
    const toggle = openLangToggle();
    if (toggle) {
      closeLangs();
      toggle.focus();
    } else if (headerExtended()) {
      setExtended(false);
      stageMenu.focus();
    } else closeMenu();
  });

  /* ---- the header growing out of its column ------------------------ */
  const stageTop = document.querySelector('.stage-top');
  // What the CSS needs to grow it: the window's width, and how far the
  // column's edge is from the window's.
  function measureHeader() {
    const width = document.documentElement.clientWidth;
    const columnEdge = stageTop.closest('.stage').getBoundingClientRect().right;
    stageTop.style.setProperty('--full', `${width}px`);
    stageTop.style.setProperty('--reach', `${width - columnEdge}px`);
  }

  // Sideways, with Menu (wide screen, column too narrow for the links).
  const stageMore = document.getElementById('stage-more');
  const stageMenu = stageTop.querySelector('.menu-btn');
  const headerExtended = () => stageTop.classList.contains('extended');
  function setExtended(open) {
    if (headerExtended() === open) return;
    if (open) measureHeader();
    stageTop.classList.toggle('extended', open);
    stageMore.inert = !open;
    stageMenu.setAttribute('aria-expanded', String(open));
    stageMenu.textContent = open ? 'Close' : 'Menu';
  }
  stageMenu.addEventListener('click', () => setExtended(!headerExtended()));

  // EN: the language list hanging from the header's line.
  const headerLangs = document.getElementById('header-langs');
  const headerLangsToggle = stageTop.querySelector('[aria-controls="header-langs"]');
  const headerLangsOpen = () => stageTop.classList.contains('langs-open');
  function setHeaderLangs(open) {
    if (headerLangsOpen() === open) return;
    stageTop.classList.toggle('langs-open', open);
    headerLangs.inert = !open;
    headerLangsToggle.setAttribute('aria-expanded', String(open));
    if (open) showCurrent(headerLangs.querySelector('[data-lang-list]'));
  }
  headerLangsToggle.addEventListener('click', () => setHeaderLangs(!headerLangsOpen()));

  // A new window size means new measurements (and maybe no folding).
  addEventListener('resize', () => {
    setExtended(false);
    setHeaderLangs(false);
  });

  /* ---- language ----------------------------------------------------- */
  // The mockup's text stays English: picking a language only moves the
  // selection, so "selected" vs "pointed at" can be judged. The lab bar's
  // "langs 8" fills the list to try the scrolling zone.
  const LANGUAGES = [
    ['en', 'English'], ['it', 'Italiano'], ['ja', '日本語'], ['de', 'Deutsch'],
    ['fr', 'Français'], ['es', 'Español'], ['pt', 'Português'], ['ko', '한국어'],
  ];
  let currentLang = 'en';
  function renderLangs() {
    const shown = LANGUAGES.slice(0, Number(html.dataset.langs) || 2);
    if (!shown.some(([code]) => code === currentLang)) currentLang = 'en';
    const items = shown
      .map(([code, name], i) => `<li style="--i:${i}"><a href="#" lang="${code}" hreflang="${code}" data-lang="${code}"${code === currentLang ? ' aria-current="true"' : ''}>${name}</a></li>`)
      .join('');
    const name = shown.find(([code]) => code === currentLang)[1];
    document.querySelectorAll('[data-lang-list]').forEach((ul) => (ul.innerHTML = items));
    document.querySelectorAll('[data-lang-toggle]').forEach((t) => {
      t.querySelector('.code').textContent = currentLang.toUpperCase();
      t.setAttribute('aria-label', `Language: ${name}`);
    });
  }
  // Opening a long list brings the selected language into view.
  function showCurrent(list) {
    const current = list.querySelector('[aria-current="true"]');
    if (!current) return;
    const top = current.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop;
    list.scrollTop = top - (list.clientHeight - current.offsetHeight) / 2;
  }

  // Menu: EN swaps "On this page" for the languages, in the same slot.
  const menuSwap = document.querySelector('.menu-swap');
  const menuIndex = menuSwap.querySelector('.menu-index');
  const menuLangs = document.getElementById('menu-langs');
  const menuLangsToggle = document.querySelector('[aria-controls="menu-langs"]');
  const menuLangsOpen = () => menuSwap.classList.contains('langs-open');
  function setMenuLangs(open) {
    if (menuLangsOpen() === open) return;
    menuSwap.classList.toggle('langs-open', open);
    // Only the one showing can be reached with the keyboard.
    menuLangs.inert = !open;
    // (A page without sections has no index here, only the languages.)
    if (menuIndex) menuIndex.inert = open;
    menuLangsToggle.setAttribute('aria-expanded', String(open));
    if (open) showCurrent(menuLangs.querySelector('[data-lang-list]'));
  }
  menuLangsToggle.addEventListener('click', () => setMenuLangs(!menuLangsOpen()));

  // Whichever list is open, by its toggle (for Escape and picking).
  const openLangToggle = () => (headerLangsOpen() ? headerLangsToggle : menuLangsOpen() ? menuLangsToggle : null);
  function closeLangs() {
    setHeaderLangs(false);
    setMenuLangs(false);
  }

  document.addEventListener('click', (e) => {
    const pick = e.target.closest('[data-lang]');
    if (pick) {
      e.preventDefault();
      const toggle = openLangToggle();
      currentLang = pick.dataset.lang;
      renderLangs();
      closeLangs();
      toggle?.focus({ preventScroll: true });
    }
    // A section link in the menu: close it, then glide to the section.
    const goto = e.target.closest('#menu [data-goto]');
    if (goto) {
      e.preventDefault();
      const target = sections[Number(goto.dataset.goto)];
      closeMenu();
      target.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', `#${target.id}`);
    }
    // The extended header closes on a click outside it, or on one of its links.
    if (!stageTop.contains(e.target) || e.target.closest('#stage-more a')) setExtended(false);
    // Language lists close on any click outside them.
    if (!headerLangs.contains(e.target) && !headerLangsToggle.contains(e.target)) setHeaderLangs(false);
    if (!menuLangs.contains(e.target) && !menuLangsToggle.contains(e.target)) setMenuLangs(false);
    const c = e.target.closest('[data-copy]');
    if (c) navigator.clipboard?.writeText(c.dataset.copy).then(() => { c.textContent = 'Copied'; setTimeout(() => (c.textContent = 'Copy'), 1600); });
  });

  /* ---- reveals ------------------------------------------------------- */
  const revealer = new IntersectionObserver(
    (entries) => { for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); revealer.unobserve(e.target); } },
    { rootMargin: '0px 0px -10% 0px' },
  );
  document.querySelectorAll('[data-reveal]').forEach((el) => revealer.observe(el));
  // Entrance: wait for the fonts, so lines rise with their real shapes.
  (document.fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(() => html.classList.add('ready')));

  /* ---- living background: liquid light ------------------------------ */
  // Smooth, isotropic noise. 2D simplex noise by Ian McEwan / Ashima Arts,
  // MIT licence (github.com/ashima/webgl-noise).
  const SIMPLEX = `
    vec3 permute(vec3 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m; m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    // Three octaves only: broad, silky shapes, nothing fine enough to shimmer.
    float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 3; i++){ v += a * snoise(p); p = p * 2.0 + vec2(17.0, 11.0); a *= 0.5; } return v; }`;

  const LIQUID = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uMouseOn;
    uniform vec4 uFocus; uniform float uFocusOn; uniform float uIntro;
    uniform vec3 uBg; uniform vec3 uLight; uniform vec3 uAccent;
    ${SIMPLEX}
    void main(){
      float aspect = uRes.x / uRes.y;
      vec2 uv = gl_FragCoord.xy / uRes;
      vec2 p = vec2(uv.x * aspect, uv.y);
      float t = uTime * 0.022;

      // The pointer: the field leans toward it and lifts softly around it.
      vec2 dm = p - vec2(uMouse.x * aspect, uMouse.y);
      float pull = exp(-dot(dm, dm) * 4.0) * uMouseOn;
      // A hovered entry: light gathers behind its whole shape.
      vec2 fd = (p - vec2(uFocus.x * aspect, uFocus.y)) / max(uFocus.zw * 1.6, vec2(0.04));
      float focus = exp(-dot(fd, fd) * 1.2) * uFocusOn;
      p -= dm * pull * 0.22;

      vec2 w = vec2(fbm(p * 0.9 + vec2(t, -t)), fbm(p * 0.9 + vec2(-t, t) + 4.3));
      float f = fbm(p * 0.7 + w * 0.85 + vec2(t * 0.5, 0.0)) * 0.5 + 0.5;

      vec3 col = mix(uBg, uLight, smoothstep(0.22, 0.82, f));
      col = mix(col, uLight * 1.4, smoothstep(0.62, 0.95, f) * 0.45);
      col = mix(col, uAccent, smoothstep(0.75, 1.0, f) * 0.07);
      col += (uLight * 1.3 - uBg) * (pull * 0.3 + focus * 1.0);
      col = mix(uBg, col, uIntro);

      // Dither by under one step of 8-bit colour: dark gradients no longer band.
      float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
      gl_FragColor = vec4(col + (n - 0.5) / 255.0, 1.0);
    }`;

  const canvas = document.getElementById('bg');
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  const S = {
    mouse: { x: 0.65, y: 0.55, tx: 0.65, ty: 0.55, on: 0, ton: 0 },
    focus: { v: [0.5, 0.5, 0.1, 0.05], t: [0.5, 0.5, 0.1, 0.05], on: 0, ton: 0, el: null },
    colors: {},
    born: performance.now(),
    raf: 0,
  };
  let prog = null;

  if (gl) {
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }');
    gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, LIQUID);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(fs));
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    gl.useProgram(p);
    const u = (n) => gl.getUniformLocation(p, n);
    prog = { p, a: gl.getAttribLocation(p, 'a'), uRes: u('uRes'), uTime: u('uTime'), uMouse: u('uMouse'), uMouseOn: u('uMouseOn'), uFocus: u('uFocus'), uFocusOn: u('uFocusOn'), uIntro: u('uIntro'), uBg: u('uBg'), uLight: u('uLight'), uAccent: u('uAccent') };
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(prog.a);
    gl.vertexAttribPointer(prog.a, 2, gl.FLOAT, false, 0, 0);
  } else {
    canvas.style.display = 'none';
  }

  const hex = (v) => { const h = v.trim().replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255); };
  function readColors() {
    const s = getComputedStyle(html);
    for (const k of ['bg', 'light', 'accent']) S.colors[k] = hex(s.getPropertyValue(`--${k}`));
  }
  function resize() {
    // Full CSS-pixel resolution: smooth gradients need no more, and the
    // dither works at this scale.
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
  }
  function focusTarget() {
    const el = S.focus.el;
    if (!el) return;
    const r = el.getBoundingClientRect();
    S.focus.t = [(r.left + r.width / 2) / innerWidth, 1 - (r.top + r.height / 2) / innerHeight, r.width / 2 / innerHeight, r.height / 2 / innerHeight];
  }

  function draw(now) {
    if (!prog) return;
    const m = S.mouse, f = S.focus, still = reduce();
    m.x += (m.tx - m.x) * 0.05;
    m.y += (m.ty - m.y) * 0.05;
    m.on += (m.ton - m.on) * 0.04;
    focusTarget();
    for (let i = 0; i < 4; i++) f.v[i] += (f.t[i] - f.v[i]) * 0.07;
    f.on += (f.ton - f.on) * 0.06;
    const age = (now - S.born) / 1000;
    gl.uniform2f(prog.uRes, canvas.width, canvas.height);
    gl.uniform1f(prog.uTime, still ? 20 : age + 20);
    gl.uniform2f(prog.uMouse, m.x, m.y);
    gl.uniform1f(prog.uMouseOn, still ? 0 : m.on);
    gl.uniform4f(prog.uFocus, f.v[0], f.v[1], f.v[2], f.v[3]);
    gl.uniform1f(prog.uFocusOn, still ? 0 : f.on);
    gl.uniform1f(prog.uIntro, still ? 1 : Math.min(1, age / 1.6));
    gl.uniform3fv(prog.uBg, S.colors.bg);
    gl.uniform3fv(prog.uLight, S.colors.light);
    gl.uniform3fv(prog.uAccent, S.colors.accent);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function loop(now) {
    draw(now);
    S.raf = !reduce() && !document.hidden && html.dataset.bg !== 'off' ? requestAnimationFrame(loop) : 0;
  }
  const restart = () => { cancelAnimationFrame(S.raf); S.raf = requestAnimationFrame(loop); };

  const point = (x, y) => { S.mouse.tx = x / innerWidth; S.mouse.ty = 1 - y / innerHeight; S.mouse.ton = 1; };
  addEventListener('pointermove', (e) => point(e.clientX, e.clientY), { passive: true });
  addEventListener('touchmove', (e) => point(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  html.addEventListener('pointerleave', () => { S.mouse.ton = 0; S.focus.ton = 0; });
  document.addEventListener('pointerover', (e) => {
    const el = e.target.closest?.('[data-focus]');
    S.focus.el = el ?? S.focus.el;
    S.focus.ton = el ? 1 : 0;
  });
  addEventListener('resize', () => { resize(); restart(); });
  document.addEventListener('visibilitychange', restart);

  /* ---- settings + lab bar ------------------------------------------ */
  const OPTIONS = {
    palette: ['forest', 'indigo', 'ink', 'plum', 'petrol', 'slate'],
    font: ['satoshi', 'general', 'switzer', 'jost', 'urbanist', 'outfit', 'figtree', 'albert', 'geist', 'manrope'],
    weight: ['light', 'regular'],
    bg: ['liquid', 'off'],
    langs: ['2', '8'],
  };
  const params = new URLSearchParams(location.search);
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('lively-split-v2') || '{}'); } catch {}
  for (const k of Object.keys(OPTIONS)) {
    const v = params.get(k) || saved[k];
    if (OPTIONS[k].includes(v)) html.dataset[k] = v;
  }
  const lab = document.getElementById('lab');
  function renderLab() {
    lab.innerHTML =
      `<button data-toggle>${lab.classList.contains('closed') ? 'Lab ▴' : 'Lab ▾'}</button>` +
      Object.entries(OPTIONS)
        .map(([k, vals]) => `<span class="group"><span class="label">${k}</span>${vals.map((v) => `<button data-k="${k}" data-v="${v}" aria-pressed="${html.dataset[k] === v}">${v}</button>`).join('')}</span>`)
        .join('');
  }
  lab.addEventListener('click', (e) => {
    if (e.target.closest('[data-toggle]')) { lab.classList.toggle('closed'); return renderLab(); }
    const b = e.target.closest('[data-k]');
    if (!b) return;
    html.dataset[b.dataset.k] = b.dataset.v;
    try { localStorage.setItem('lively-split-v2', JSON.stringify(Object.fromEntries(Object.keys(OPTIONS).map((k) => [k, html.dataset[k]])))); } catch {}
    readColors();
    restart();
    renderLab();
    renderLangs();
  });
  // Out of the way by default; open it when you want to switch things.
  lab.classList.add('closed');

  renderLab();
  renderLangs();
  readColors();
  resize();
  restart();
})();
