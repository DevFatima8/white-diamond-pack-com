import type { Locale } from './translations';

/**
 * Units are stored in English in the database ("carton", "pack", …). This shows the
 * common ones in Arabic; anything else (a custom unit typed in the admin) is shown as stored.
 */
const AR_UNITS: Record<string, string> = {
  carton: 'كرتونة',
  pack: 'عبوة',
  bundle: 'حزمة',
  box: 'صندوق',
  roll: 'لفة',
  piece: 'قطعة',
  kg: 'كغ',
};

export function unitName(unit: string, locale: Locale): string {
  return locale === 'ar' ? (AR_UNITS[unit.trim().toLowerCase()] ?? unit) : unit;
}
