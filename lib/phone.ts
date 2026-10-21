/**
 * Pakistani mobile numbers.
 * Stored as 03XXXXXXXXX (11 digits). WhatsApp links need the international form 923XXXXXXXXX.
 */

export const PK_MOBILE_REGEX = /^03\d{9}$/;

/** Accepts "0321-6293333", "+92 321 6293333", "923216293333" … → "03216293333" (or null if invalid). */
export function normalizePkMobile(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('0092')) digits = digits.slice(4);
  if (digits.startsWith('92') && digits.length === 12) digits = `0${digits.slice(2)}`;
  if (digits.length === 10 && digits.startsWith('3')) digits = `0${digits}`;
  return PK_MOBILE_REGEX.test(digits) ? digits : null;
}

/** "03216293333" → "923216293333" (for wa.me links). Returns the digits unchanged if not a PK mobile. */
export function toInternational(phone: string): string {
  const local = normalizePkMobile(phone);
  return local ? `92${local.slice(1)}` : phone.replace(/\D/g, '');
}

/** https://wa.me/923216293333?text=... */
export function whatsappLink(phone: string, message?: string): string {
  const base = `https://wa.me/${toInternational(phone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** "03216293333" → "0321 6293333" for display. */
export function formatPkMobile(phone: string): string {
  const local = normalizePkMobile(phone);
  return local ? `${local.slice(0, 4)} ${local.slice(4)}` : phone;
}
