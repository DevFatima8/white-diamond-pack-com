'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * reducedMotion="user": when the visitor has "reduce motion" turned on in their OS,
 * framer-motion skips movement (slides, scaling) for every animation inside.
 */
export default function SiteMotion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
