import { cache } from 'react';
import db from '@/lib/db';
import { logDataError } from '@/lib/db-errors';
import { GALLERY_SETTING_KEY, gallerySchema, type GalleryItem } from '@/lib/gallery-types';

/** Raw gallery from the database (throws if the database is down). Used by the admin page. */
export async function getGallery(): Promise<GalleryItem[]> {
  const row = await db.setting.findUnique({ where: { key: GALLERY_SETTING_KEY } });
  if (!row) return [];
  try {
    const parsed = gallerySchema.safeParse(JSON.parse(row.value));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

/** Safe version for public pages: an empty list if the database can't be reached. */
export const getSiteGallery = cache(async (): Promise<GalleryItem[]> => {
  try {
    return await getGallery();
  } catch (err) {
    logDataError('site gallery', err);
    return [];
  }
});
