import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * The White Diamond logo — image only. The artwork already contains the name,
 * so no text is ever placed next to it. It has a white outline, so it works on
 * navy and white backgrounds without a box behind it.
 * Height is set by the caller (e.g. "h-9 lg:h-12"); width follows the ~3:1 ratio.
 */
export default function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" className="inline-flex shrink-0 rounded-lg p-1" aria-label="White Diamond — home">
      <Image
        src="/images/logo-web.png"
        alt="White Diamond"
        width={800}
        height={267}
        priority={priority}
        sizes="200px"
        className={cn('w-auto', className)}
      />
    </Link>
  );
}
