import type { Metadata } from 'next';
import { getGallery } from '@/lib/gallery';
import { PageHeader } from '@/components/admin/ui';
import GalleryManager from '@/components/admin/GalleryManager';

export const metadata: Metadata = { title: 'Gallery' };

export default async function GalleryPage() {
  const items = await getGallery();
  return (
    <>
      <PageHeader eyebrow="Website" title="Gallery" description="Office, production and finished-product photos shown on the About page." />
      <GalleryManager initial={items} />
    </>
  );
}
