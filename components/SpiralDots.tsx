'use client';

import { useEffect, useRef } from 'react';

interface SpiralDotsProps {
  totalDots?: number;
  size?: number;
  dotRadius?: number;
  margin?: number;
  duration?: number;
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
  margin = 2,
  duration = 3,
  className = '',
}: SpiralDotsProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
    const CENTER = size / 2;
    const MAX_RADIUS = CENTER - margin - dotRadius;
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

      const animR = document.createElementNS(svgNS, 'animate');
      animR.setAttribute('attributeName', 'r');
      animR.setAttribute('values', `${dotRadius * 0.5};${dotRadius * 1.5};${dotRadius * 0.5}`);
      animR.setAttribute('dur', `${duration}s`);
      animR.setAttribute('begin', `${frac * duration}s`);
      animR.setAttribute('repeatCount', 'indefinite');
      animR.setAttribute('calcMode', 'spline');
      animR.setAttribute('keySplines', '0.4 0 0.6 1;0.4 0 0.6 1');
      c.appendChild(animR);

      const animO = document.createElementNS(svgNS, 'animate');
      animO.setAttribute('attributeName', 'opacity');
      animO.setAttribute('values', '0.25;1;0.25');
      animO.setAttribute('dur', `${duration}s`);
      animO.setAttribute('begin', `${frac * duration}s`);
      animO.setAttribute('repeatCount', 'indefinite');
      animO.setAttribute('calcMode', 'spline');
      animO.setAttribute('keySplines', '0.4 0 0.6 1;0.4 0 0.6 1');
      c.appendChild(animO);
    }
  }, [totalDots, size, dotRadius, margin, duration]);

  return <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} aria-hidden="true" />;
}
