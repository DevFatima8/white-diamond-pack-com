/**
 * The cart, stored in the browser's localStorage.
 *
 * Only { productId, quantity } is stored — never names or prices. Prices are always
 * loaded fresh from the server (and the server recalculates them again at checkout),
 * so an old or edited localStorage value can't change what a customer pays.
 *
 * This is a tiny "external store" for React's useSyncExternalStore:
 *  - subscribe(): React listens for changes
 *  - getSnapshot(): the current cart (the SAME array object until something changes)
 *  - getServerSnapshot(): what the server renders (always empty — it can't see localStorage)
 */

export interface CartLine {
  productId: string;
  quantity: number;
}

const STORAGE_KEY = 'wd_cart';
const LEGACY_KEY = 'cart'; // old format (full product objects) — discarded
const MAX_QTY = 100_000;
const EMPTY: CartLine[] = [];

let cache: CartLine[] | null = null;
const listeners = new Set<() => void>();

/** Parse and clean whatever is in storage; anything malformed is dropped. */
function read(): CartLine[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(raw)) return EMPTY;
    const lines = raw
      .filter(
        (l): l is CartLine =>
          typeof l?.productId === 'string' && l.productId.length > 0 && l.productId.length <= 40 && Number.isInteger(l.quantity) && l.quantity > 0,
      )
      .map((l) => ({ productId: l.productId, quantity: Math.min(l.quantity, MAX_QTY) }));
    return lines.length ? lines : EMPTY;
  } catch {
    return EMPTY; // storage blocked (private mode) or corrupted JSON
  }
}

function write(lines: CartLine[]) {
  cache = lines.length ? lines : EMPTY;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // storage full or blocked — the cart still works until the page is closed
  }
  listeners.forEach((l) => l());
}

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    // Another tab changed the cart → refresh ours too
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

  getSnapshot(): CartLine[] {
    if (cache === null) cache = read();
    return cache;
  },

  getServerSnapshot(): CartLine[] {
    return EMPTY;
  },

  /** Add `quantity` of a product (adds to what's already in the cart). */
  add(productId: string, quantity = 1) {
    const lines = cartStore.getSnapshot();
    const existing = lines.find((l) => l.productId === productId);
    write(
      existing
        ? lines.map((l) => (l.productId === productId ? { ...l, quantity: Math.min(l.quantity + quantity, MAX_QTY) } : l))
        : [...lines, { productId, quantity: Math.min(quantity, MAX_QTY) }],
    );
  },

  /** Set an exact quantity; 0 or less removes the line. */
  setQuantity(productId: string, quantity: number) {
    if (quantity <= 0) return cartStore.remove(productId);
    write(cartStore.getSnapshot().map((l) => (l.productId === productId ? { ...l, quantity: Math.min(Math.floor(quantity), MAX_QTY) } : l)));
  },

  remove(productId: string) {
    write(cartStore.getSnapshot().filter((l) => l.productId !== productId));
  },

  /** Drop lines whose products no longer exist / are hidden. */
  keepOnly(productIds: Set<string>) {
    const lines = cartStore.getSnapshot();
    const kept = lines.filter((l) => productIds.has(l.productId));
    if (kept.length !== lines.length) write(kept);
  },

  clear() {
    write(EMPTY);
  },
};
