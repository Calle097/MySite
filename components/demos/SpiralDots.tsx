'use client';

import { useEffect, useRef } from 'react';
import { reducedMotion } from '@/lib/motion';

/** Room between the outermost dots and the edge. */
const MARGIN = 2;
/** One pulse, in seconds; the wave takes as long to cross the spiral. */
const DURATION = 3;

interface SpiralDotsProps {
  totalDots?: number;
  size?: number;
  dotRadius?: number;
  className?: string;
}

/**
 * Phyllotaxis spiral: dots placed by the golden angle (the packing a
 * sunflower head uses), each pulsing with a SMIL animation whose start time
 * is its fractional index — so a wave spirals outward forever. No libraries.
 * Dots use currentColor, so the parent's text color paints the spiral.
 */
export function SpiralDots({
  totalDots = 500,
  size = 200,
  dotRadius = 1.5,
  className = '',
}: SpiralDotsProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    // SMIL <animate> ignores prefers-reduced-motion — a CSS media query can't
    // reach it — so the preference is honoured by simply not emitting the
    // animation elements. The spiral itself still renders, just static.
    const still = reducedMotion();
    const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
    const CENTER = size / 2;
    const MAX_RADIUS = CENTER - MARGIN - dotRadius;
    const svgNS = 'http://www.w3.org/2000/svg';

    svg.innerHTML = '';

    for (let i = 0; i < totalDots; i++) {
      const idx = i + 0.5;
      const frac = idx / totalDots;
      const r = Math.sqrt(frac) * MAX_RADIUS;
      const theta = idx * GOLDEN_ANGLE;
      const x = CENTER + r * Math.cos(theta);
      const y = CENTER + r * Math.sin(theta);

      const c = document.createElementNS(svgNS, 'circle');
      c.setAttribute('cx', x.toString());
      c.setAttribute('cy', y.toString());
      c.setAttribute('r', dotRadius.toString());
      c.setAttribute('fill', 'currentColor');
      c.setAttribute('opacity', '0.6');
      svg.appendChild(c);

      if (still) continue;

      const animR = document.createElementNS(svgNS, 'animate');
      animR.setAttribute('attributeName', 'r');
      animR.setAttribute('values', `${dotRadius * 0.5};${dotRadius * 1.5};${dotRadius * 0.5}`);
      animR.setAttribute('dur', `${DURATION}s`);
      animR.setAttribute('begin', `${frac * DURATION}s`);
      animR.setAttribute('repeatCount', 'indefinite');
      animR.setAttribute('calcMode', 'spline');
      animR.setAttribute('keySplines', '0.4 0 0.6 1;0.4 0 0.6 1');
      c.appendChild(animR);

      const animO = document.createElementNS(svgNS, 'animate');
      animO.setAttribute('attributeName', 'opacity');
      animO.setAttribute('values', '0.25;1;0.25');
      animO.setAttribute('dur', `${DURATION}s`);
      animO.setAttribute('begin', `${frac * DURATION}s`);
      animO.setAttribute('repeatCount', 'indefinite');
      animO.setAttribute('calcMode', 'spline');
      animO.setAttribute('keySplines', '0.4 0 0.6 1;0.4 0 0.6 1');
      c.appendChild(animO);
    }
  }, [totalDots, size, dotRadius]);

  return <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} aria-hidden="true" />;
}
