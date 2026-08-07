'use client';

import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';

export interface DriveInItem {
    icon: LucideIcon;
    title: string;
    text: string;
}

/**
 * Ported from the kigumi/vanety-web dev lab (a camper-van rental project —
 * hence the vans).
 *
 * Two paths that share ONE command skeleton so framer-motion can tween the `d`
 * attribute directly (it interpolates each number when the letters + arity
 * match). REST is a tall rounded rectangle: the wheel arcs are flattened
 * (ry≈0) and the front is raised to a flat top. VAN grows the wheels and
 * slopes the windshield back in. The shapes are inverted against motion: each
 * item is a VAN while it drives into view, then settles into a REST card once
 * it reaches position — and hover/tap morphs a settled card back into a van.
 */
const REST_PATH =
    'M 40 96 H 60 ' +
    'A 31 0.01 0 0 0 122 96 ' +
    'H 262 ' +
    'A 31 0.01 0 0 0 324 96 ' +
    'H 392 Q 410 96 410 80 L 410 26 Q 410 12 396 12 L 384 12 ' +
    'L 318 12 Q 312 12 302 12 ' +
    'L 48 12 Q 28 12 28 32 L 28 88 Q 28 96 40 96 Z';

const VAN_PATH =
    'M 40 96 H 60 ' +
    'A 31 16 0 0 0 122 96 ' +   // rear wheel — convex, inside the box
    'H 262 ' +
    'A 31 16 0 0 0 324 96 ' +   // front wheel
    'H 392 Q 410 96 410 80 L 410 72 Q 410 60 396 56 L 384 54 ' +
    'L 318 15 Q 312 12 302 12 ' +
    'L 48 12 Q 28 12 28 32 L 28 88 Q 28 96 40 96 Z';

/** The front side-window pane — crossfades in over the icon chip on morph. */
const WINDOW_PATH =
    'M 327 22 L 380 53 Q 386 57 377 57 L 332 57 Q 322 57 322 47 L 322 30 Q 322 19 327 22 Z';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Below this |x| the item is treated as parked → it settles from van to card. */
const SETTLE_PX = 4;

function VehicleCard({ item, index, distance, wide, progress }: {
    item: DriveInItem;
    index: number;
    distance: number;
    wide: boolean;
    progress: MotionValue<number>;
}) {
    const reduce = useReducedMotion();
    const [hover, setHover] = useState(false);
    const [tapped, setTapped] = useState(false);

    // Desktop: left column faces + drives right, right column mirrors. Mobile
    // is a single column, so keep every card aligned the same way.
    const facingRight = wide ? index % 2 === 0 : true;
    const fromX = facingRight ? -distance : distance;
    const delay = Math.floor(index / 2) * 0.14;
    const x = useTransform(progress, [delay, 1], [reduce ? 0 : fromX, 0], { clamp: true });
    const opacity = useTransform(progress, [delay, Math.min(delay + 0.45, 1)], [reduce ? 1 : 0, 1]);

    // Inverted morph: an item is a van *while it drives in*, then settles into a
    // card once it parks at its resting position (x ≈ 0). Scrubbed by scroll, so
    // scrolling back up un-parks it and it becomes a van again.
    const [settled, setSettled] = useState(() => Math.abs(x.get()) < SETTLE_PX);
    useMotionValueEvent(x, 'change', (v) => {
        const next = Math.abs(v) < SETTLE_PX;
        setSettled((prev) => (prev === next ? prev : next));
    });

    // Desktop morphs on hover; mobile toggles on tap (hover is unreliable on touch).
    const on = !reduce && (wide ? hover : tapped);

    // Show the van shape while moving OR on interaction; the parked, idle state
    // is the card.
    const van = !settled || on;

    return (
        <motion.div
            style={{ x, opacity }}
            onHoverStart={() => wide && setHover(true)}
            onHoverEnd={() => wide && setHover(false)}
            onTap={() => !wide && setTapped((v) => !v)}
            animate={{ y: on ? -5 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="relative aspect-[420/130] w-full max-w-[360px] cursor-pointer touch-manipulation select-none lg:cursor-default"
        >
            <svg
                className="absolute inset-0 h-full w-full overflow-visible"
                viewBox="0 0 420 120"
                preserveAspectRatio="none"
                style={{ transform: facingRight ? undefined : 'scaleX(-1)' }}
                aria-hidden
            >
                {/* the card body — rounded rectangle that morphs into a van */}
                <motion.path
                    d={REST_PATH}
                    animate={{ d: van ? VAN_PATH : REST_PATH }}
                    transition={{ duration: 0.4, ease: EASE }}
                    fill="var(--background)"
                    vectorEffect="non-scaling-stroke"
                    style={{
                        stroke: 'var(--secondary-darker)',
                        strokeWidth: 1.5,
                        transition: 'filter 0.25s ease',
                        filter: on
                            ? 'drop-shadow(0 10px 18px rgba(0,0,0,0.10))'
                            : 'drop-shadow(0 4px 10px rgba(0,0,0,0.05))',
                    }}
                />

                {/* wheels — filled hubs that fade in as the arcs bulge out */}
                {[91, 293].map((cx) => (
                    <motion.circle
                        key={cx}
                        cx={cx}
                        cy={96}
                        r={7}
                        fill="var(--secondary-darker)"
                        animate={{ opacity: van ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                    />
                ))}

                {/* windshield pane — crossfades in where the icon chip was */}
                <motion.path
                    d={WINDOW_PATH}
                    fill="color-mix(in srgb, var(--brand-accent) 16%, transparent)"
                    animate={{ opacity: van ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                />
            </svg>

            {/* icon chip — a tinted square at rest that fades out as the pane fades
                in; the icon itself stays put in both states */}
            <span
                className="pointer-events-none absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ left: facingRight ? '82.5%' : '17.5%', top: '40%' }}
            >
                <motion.span
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'color-mix(in srgb, var(--brand-accent) 12%, transparent)' }}
                    animate={{ opacity: van ? 0 : 1 }}
                    transition={{ duration: 0.25, ease: EASE }}
                />
                <item.icon className="relative h-5 w-5" style={{ color: 'var(--brand-accent)' }} />
            </span>

            <div className={`pointer-events-none relative flex h-full flex-col justify-center pb-4 ${facingRight ? 'pl-8 pr-24' : 'pl-24 pr-8'}`}>
                <h3 className="text-[15px] font-semibold" style={{ color: 'var(--foreground)' }}>{item.title}</h3>
                <p className="mt-1 text-xs leading-snug" style={{ color: 'var(--muted-foreground)' }}>{item.text}</p>
            </div>
        </motion.div>
    );
}

/**
 * Feature items as sleek van silhouettes that drive in from the sides as the
 * section scrolls into view, then settle into rounded feature cards once parked.
 * Hover (desktop) or tap (mobile) morphs a parked card back into a van. Static
 * under reduced motion.
 */
export function DriveInCards({ items }: { items: DriveInItem[] }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.92', 'center 0.55'] });

    // Short drive-in on small screens: a 340px entry on a ~380px viewport
    // strands the cards outside the section clip mid-flight.
    const [wide, setWide] = useState(true);
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)');
        const update = () => setWide(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    return (
        <div ref={ref} className="grid justify-items-center gap-x-10 gap-y-6 lg:grid-cols-2">
            {items.map((item, i) => (
                <VehicleCard key={item.title} item={item} index={i} distance={wide ? 240 : 100} wide={wide} progress={scrollYProgress} />
            ))}
        </div>
    );
}
