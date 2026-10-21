'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  let headerClass = 'transparent scroll-light';
  const useHeaderInner = false;
  const isHomepage = pathname === '/' || pathname.startsWith('/homepage-');

  if (!isHomepage) {
    headerClass = 'transparent header-light';
  }

  return <Header className={headerClass} useHeaderInner={useHeaderInner} />;
}
