/**
 * Turn a name into a URL-safe slug: "Foil Container 450ml + Lid" → "foil-container-450ml-lid".
 * Non-Latin characters (e.g. Arabic) are dropped, so always slugify the English name.
 */
export function slugify(input: string, maxLength = 120): string {
  const slug = input
    .normalize('NFKD') // split accented letters: "é" → "e" + accent
    .replace(/[̀-ͯ]/g, '') // remove the accents
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/×/g, ' x ') // 45cm × 100m → 45cm-x-100m
    .replace(/(\d)\s*(?:"|”|″)/g, '$1 inch ') // 7" → 7-inch
    .replace(/[^a-z0-9]+/g, '-') // anything else → "-"
    .replace(/^-+|-+$/g, '') // trim dashes at the ends
    .slice(0, maxLength)
    .replace(/-+$/g, '');
  return slug || 'item';
}

/**
 * Returns `base`, or `base-2`, `base-3`, … — the first one `isTaken` says is free.
 */
export async function uniqueSlug(
  base: string,
  isTaken: (slug: string) => Promise<boolean>,
): Promise<string> {
  let candidate = base;
  for (let n = 2; await isTaken(candidate); n++) {
    candidate = `${base}-${n}`;
  }
  return candidate;
}
