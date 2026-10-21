'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/**
 * A number that counts up from 0 when it scrolls into view: <CountUp value={1200} suffix="+" />
 *
 * The server renders the FINAL number (so it's correct without JavaScript and for
 * search engines). In the browser, once visible, it animates 0 → value by writing the
 * text directly — no React re-render per frame. With "reduce motion" on, it just shows the value.
 */
export default function CountUp({
  value,
  suffix = '',
  prefix = '',
  duration = 1.6,
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduceMotion = useReducedMotion();
  const format = (n: number) => `${prefix}${Math.round(n).toLocaleString('en-US')}${suffix}`;

  useEffect(() => {
    if (!inView || reduceMotion || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1], // fast start, gentle finish
      onUpdate: (n) => {
        node.textContent = format(n);
      },
    });
    return () => controls.stop();
    // format only depends on props already listed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion, value, duration]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
