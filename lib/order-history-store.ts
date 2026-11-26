/**
 * Orders the customer placed on THIS browser — saved as order number + access token
 * (same token as the confirmation link). No login: the list lives in localStorage only.
 */

export interface SavedOrder {
  orderNumber: string;
  token: string;
  savedAt: string; // ISO — when we added it to the list
}

const STORAGE_KEY = 'wd_order_history';
const MAX_ENTRIES = 50;
const EMPTY: SavedOrder[] = [];

let cache: SavedOrder[] | null = null;
const listeners = new Set<() => void>();

function read(): SavedOrder[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(raw)) return EMPTY;
    const entries = raw
      .filter(
        (e): e is SavedOrder =>
          typeof e?.orderNumber === 'string' &&
          /^WD-\d{1,9}$/i.test(e.orderNumber) &&
          typeof e?.token === 'string' &&
          e.token.length > 0 &&
          e.token.length <= 64 &&
          typeof e?.savedAt === 'string',
      )
      .map((e) => ({ orderNumber: e.orderNumber.toUpperCase(), token: e.token, savedAt: e.savedAt }));
    return entries.length ? entries : EMPTY;
  } catch {
    return EMPTY;
  }
}

function write(entries: SavedOrder[]) {
  cache = entries.length ? entries : EMPTY;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // storage full or blocked
  }
  listeners.forEach((l) => l());
}

export const orderHistoryStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        cache = read();
        listener();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  },

  getSnapshot(): SavedOrder[] {
    if (cache === null) cache = read();
    return cache;
  },

  getServerSnapshot(): SavedOrder[] {
    return EMPTY;
  },

  /** Remember an order after checkout (moves it to the top; dedupes by order number). */
  add(orderNumber: string, token: string) {
    const number = orderNumber.toUpperCase();
    if (!/^WD-\d{1,9}$/.test(number) || !token) return;
    const rest = orderHistoryStore.getSnapshot().filter((e) => e.orderNumber !== number);
    write([{ orderNumber: number, token, savedAt: new Date().toISOString() }, ...rest].slice(0, MAX_ENTRIES));
  },

  remove(orderNumber: string) {
    const number = orderNumber.toUpperCase();
    write(orderHistoryStore.getSnapshot().filter((e) => e.orderNumber !== number));
  },

  clear() {
    write(EMPTY);
  },
};