'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Fades + slides its content up a little when it scrolls into view (once).
 * "Reduce motion" is handled site-wide by <MotionConfig reducedMotion="user"> in the
 * site layout: the slide is dropped and only a quick fade remains. (Branching on
 * useReducedMotion here would render differently on server and client → hydration error.)
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
