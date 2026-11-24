/**
 * Lively mode's background: a slow liquid light (WebGL), designed in lab/.
 *
 * Smooth and uniform on purpose: simplex noise (no grid creases), three
 * octaves at low frequency (nothing fine enough to shimmer), full CSS-pixel
 * resolution, and a sub-step dither against 8-bit banding in the dark
 * gradients. It leans toward the pointer and gathers behind the entry under
 * it, and fades in on start. Under reduced motion it draws one still frame.
 *
 * Loaded only when lively mode is on (components/lively/LiquidBackground.tsx
 * imports this module dynamically), so plain visitors never download it.
 */

// 2D simplex noise by Ian McEwan / Ashima Arts, MIT licence
// (github.com/ashima/webgl-noise).
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

const FRAGMENT = `
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
    // The entry under the pointer: light gathers behind its whole shape.
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

const VERTEX = 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }';

/** What the light gathers behind: entries, and the index's links. */
const FOCUS = '[data-entry], [data-focus]';

type Vec3 = [number, number, number];

/** A #rrggbb custom property of <html>, as 0..1 RGB. */
function readColor(name: string): Vec3 {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace('#', '');
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as Vec3;
}

/**
 * Starts the light on a canvas; returns the function that stops it and
 * removes every listener it added. Returns a no-op (and leaves the canvas
 * empty) where WebGL isn't available.
 */
export function startLiquidLight(canvas: HTMLCanvasElement): () => void {
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  if (!gl) return () => {};

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return () => {};
  gl.useProgram(program);
  const u = (name: string) => gl.getUniformLocation(program, name);
  const uniforms = {
    res: u('uRes'),
    time: u('uTime'),
    mouse: u('uMouse'),
    mouseOn: u('uMouseOn'),
    focus: u('uFocus'),
    focusOn: u('uFocusOn'),
    intro: u('uIntro'),
    bg: u('uBg'),
    light: u('uLight'),
    accent: u('uAccent'),
  };
  // One triangle covering the screen.
  const position = gl.getAttribLocation(program, 'a');
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const colors = { bg: readColor('--lv-bg'), light: readColor('--lv-light'), accent: readColor('--lv-accent') };
  // Eased toward their targets every frame, so nothing jumps.
  const mouse = { x: 0.65, y: 0.55, tx: 0.65, ty: 0.55, on: 0, ton: 0 };
  const focus = { v: [0.5, 0.5, 0.1, 0.05], t: [0.5, 0.5, 0.1, 0.05], on: 0, ton: 0, el: null as Element | null };
  const born = performance.now();
  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frame = 0;

  const resize = () => {
    // Full CSS-pixel resolution: smooth gradients need no more, and the
    // dither works at this scale.
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  const draw = (now: number) => {
    const quiet = still();
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    mouse.on += (mouse.ton - mouse.on) * 0.04;
    if (focus.el) {
      const r = focus.el.getBoundingClientRect();
      focus.t = [
        (r.left + r.width / 2) / innerWidth,
        1 - (r.top + r.height / 2) / innerHeight,
        r.width / 2 / innerHeight,
        r.height / 2 / innerHeight,
      ];
    }
    for (let i = 0; i < 4; i++) focus.v[i] += (focus.t[i] - focus.v[i]) * 0.07;
    focus.on += (focus.ton - focus.on) * 0.06;
    const age = (now - born) / 1000;

    gl.uniform2f(uniforms.res, canvas.width, canvas.height);
    gl.uniform1f(uniforms.time, quiet ? 20 : age + 20);
    gl.uniform2f(uniforms.mouse, mouse.x, mouse.y);
    gl.uniform1f(uniforms.mouseOn, quiet ? 0 : mouse.on);
    gl.uniform4f(uniforms.focus, focus.v[0], focus.v[1], focus.v[2], focus.v[3]);
    gl.uniform1f(uniforms.focusOn, quiet ? 0 : focus.on);
    gl.uniform1f(uniforms.intro, quiet ? 1 : Math.min(1, age / 1.6));
    gl.uniform3fv(uniforms.bg, colors.bg);
    gl.uniform3fv(uniforms.light, colors.light);
    gl.uniform3fv(uniforms.accent, colors.accent);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  // Runs while the page is visible and motion is welcome; otherwise the
  // last frame stays.
  const loop = (now: number) => {
    draw(now);
    frame = !still() && !document.hidden ? requestAnimationFrame(loop) : 0;
  };
  const restart = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(loop);
  };

  const onPointerMove = (e: PointerEvent) => {
    mouse.tx = e.clientX / innerWidth;
    mouse.ty = 1 - e.clientY / innerHeight;
    mouse.ton = 1;
  };
  const onTouchMove = (e: TouchEvent) => {
    mouse.tx = e.touches[0].clientX / innerWidth;
    mouse.ty = 1 - e.touches[0].clientY / innerHeight;
    mouse.ton = 1;
  };
  const onPointerLeave = () => {
    mouse.ton = 0;
    focus.ton = 0;
  };
  const onPointerOver = (e: PointerEvent) => {
    const el = e.target instanceof Element ? e.target.closest(FOCUS) : null;
    focus.el = el ?? focus.el;
    focus.ton = el ? 1 : 0;
  };
  const onResize = () => {
    resize();
    restart();
  };

  const html = document.documentElement;
  addEventListener('pointermove', onPointerMove, { passive: true });
  addEventListener('touchmove', onTouchMove, { passive: true });
  html.addEventListener('pointerleave', onPointerLeave);
  document.addEventListener('pointerover', onPointerOver);
  addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', restart);
  resize();
  restart();

  return () => {
    cancelAnimationFrame(frame);
    removeEventListener('pointermove', onPointerMove);
    removeEventListener('touchmove', onTouchMove);
    html.removeEventListener('pointerleave', onPointerLeave);
    document.removeEventListener('pointerover', onPointerOver);
    removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', restart);
  };
}
