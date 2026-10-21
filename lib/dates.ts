/**
 * Dates are shown and grouped in Pakistan time (PKT = UTC+5, no daylight saving),
 * no matter where the server runs. Without this, an order placed at 1 am in
 * Faisalabad could show up under "yesterday" on a server set to UTC.
 */
export const TIME_ZONE = 'Asia/Karachi';
const PKT_OFFSET = '+05:00';

const dateFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, day: '2-digit', month: 'short', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, hour: 'numeric', minute: '2-digit' });
const keyFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' });

/** 21 Oct 2026 */
export function formatDate(date: Date): string {
  return dateFmt.format(date);
}

/** 21 Oct 2026, 3:45 PM */
export function formatDateTime(date: Date): string {
  return `${dateFmt.format(date)}, ${timeFmt.format(date)}`;
}

/** "2026-10-21" — the PKT calendar day a moment falls on (for grouping by day). */
export function dayKey(date: Date): string {
  return keyFmt.format(date); // en-CA formats as YYYY-MM-DD
}

/** Midnight PKT at the start of a "YYYY-MM-DD" day. */
export function startOfDayPKT(day: string): Date {
  return new Date(`${day}T00:00:00${PKT_OFFSET}`);
}

/** Midnight PKT at the start of the NEXT day (use as an exclusive end: createdAt < this). */
export function endOfDayPKT(day: string): Date {
  return new Date(startOfDayPKT(day).getTime() + 24 * 60 * 60 * 1000);
}

/** The last `n` PKT days as "YYYY-MM-DD", oldest first, ending today. */
export function lastNDays(n: number, now = new Date()): string[] {
  const today = startOfDayPKT(dayKey(now)).getTime();
  return Array.from({ length: n }, (_, i) => dayKey(new Date(today - (n - 1 - i) * 86_400_000 + 12 * 3_600_000)));
}

/** Is this a valid "YYYY-MM-DD" string? */
export function isDayString(value: string | undefined | null): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(startOfDayPKT(value).getTime());
}
