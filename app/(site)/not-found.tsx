import type { Metadata } from 'next';
import NotFoundView from '@/components/pages/NotFoundView';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } };

/** 404 for notFound() inside public pages (e.g. unknown product) — the site layout is already around it. */
export default function SiteNotFound() {
  return <NotFoundView />;
}
