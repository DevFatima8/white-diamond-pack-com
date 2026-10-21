import type { Metadata } from 'next';
import SiteChrome from '@/components/layout/SiteChrome';
import NotFoundView from '@/components/pages/NotFoundView';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } };

/** 404 for URLs that match no route at all; adds the header and footer itself. */
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundView />
    </SiteChrome>
  );
}
