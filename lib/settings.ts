import db from '@/lib/db';
import { DEFAULT_SETTINGS, type SettingKey } from '@/data/default-settings';

export type Settings = Record<SettingKey, string>;

/**
 * All settings as one object. Keys missing from the database fall back to the
 * defaults, so the site keeps working even before the seed has run.
 */
export async function getSettings(): Promise<Settings> {
  const rows = await db.setting.findMany();
  const settings: Settings = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    if (row.key in settings) settings[row.key as SettingKey] = row.value;
  }
  return settings;
}

/** Number value of a numeric setting (e.g. delivery charge), 0 if empty/invalid. */
export function settingNumber(settings: Settings, key: SettingKey): number {
  const n = Number(settings[key]);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}
