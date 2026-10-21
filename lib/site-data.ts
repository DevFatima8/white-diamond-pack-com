import { cache } from 'react';
import { DEFAULT_SETTINGS } from '@/data/default-settings';
import { getCategories, type CategoryItem } from '@/lib/categories';
import { getSettings, type Settings } from '@/lib/settings';

/**
 * Safe versions for public pages: if the database is down, log it and fall back
 * (no categories / default settings) instead of crashing the whole page.
 * cache() = called by the layout AND the page, but queried only once per request.
 */
export const getSiteCategories = cache(async (): Promise<CategoryItem[]> => {
  try {
    return await getCategories();
  } catch (err) {
    console.error('[site] categories unavailable:', err);
    return [];
  }
});

export const getSiteSettings = cache(async (): Promise<Settings> => {
  try {
    return await getSettings();
  } catch (err) {
    console.error('[site] settings unavailable:', err);
    return { ...DEFAULT_SETTINGS };
  }
});
