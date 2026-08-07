'use client';

import { useEffect, useState } from 'react';
import { Flower } from 'lucide-react';

/**
 * A pill badge with cherry-blossom petals falling inside it. Petal positions
 * are randomized on the client only — generating them during render would
 * differ between server and client HTML and trip a hydration mismatch.
 */
export function SakuraBadge({ label }: { label: string }) {
  const [positions, setPositions] = useState<number[]>([]);

  useEffect(() => {
    setPositions(Array.from({ length: 14 }, () => Math.random() * 100));
  }, []);

  return (
    <span className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-pink-400 bg-pink-200 px-3 py-1.5 text-sm font-medium text-pink-700">
      <Flower className="h-4 w-4 text-pink-500" />
      {label}
      {positions.length > 0 && (
        <span className="pointer-events-none absolute inset-0">
          {positions.map((position, i) => (
            <span
              key={i}
              className="sakura-petal absolute h-1 w-1 rounded-full bg-pink-400"
              style={{ left: `${position}%`, top: '-2px', animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </span>
      )}
    </span>
  );
}
