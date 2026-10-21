'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { cartStore, type CartLine } from '@/lib/cart-store';

/** Product details for cart display — always loaded fresh from /api/products. */
export interface CartProduct {
  id: string;
  slug: string | null;
  name: string;
  nameAr: string | null;
  image: string;
  price: number | null;
  salePrice: number | null;
  unit: string;
  minOrderQty: number;
  stockQty: number | null;
  inStock: boolean;
}

export interface CartItem extends CartLine {
  product: CartProduct;
  unitPrice: number; // sale price if any, else price (0 = price on request)
  lineTotal: number;
}

interface CartContextValue {
  lines: CartLine[];
  /** Lines joined with fresh product data (only products that still exist and are active). */
  items: CartItem[];
  count: number; // total quantity, for the header badge
  subtotal: number;
  loadingProducts: boolean;
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Reads localStorage on the client; renders an empty cart on the server (no hydration mismatch).
  const lines = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const [products, setProducts] = useState<Record<string, CartProduct>>({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load product details whenever the SET of product ids changes (not on quantity changes).
  const idsKey = useMemo(() => lines.map((l) => l.productId).sort().join(','), [lines]);
  useEffect(() => {
    if (!idsKey) {
      setLoadingProducts(false);
      return;
    }
    const controller = new AbortController();
    let cancelled = false; // set when ids change or the page unmounts — a newer request takes over
    const timer = setTimeout(() => controller.abort(), 10000); // safety: never show "loading" forever

    const load = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch(`/api/products?ids=${encodeURIComponent(idsKey)}`, { signal: controller.signal });
        if (!res.ok) return; // keep showing what we had; checkout re-checks on the server anyway
        const json: { data: CartProduct[] } = await res.json();
        if (cancelled) return;
        setProducts(Object.fromEntries(json.data.map((p) => [p.id, p])));
        // Products that were deleted or hidden are removed from the cart.
        cartStore.keepOnly(new Set(json.data.map((p) => p.id)));
      } catch {
        // timed out or offline — ignore
      } finally {
        clearTimeout(timer);
        // Only the latest request may end the loading state (otherwise the cart flashes "empty").
        if (!cancelled) setLoadingProducts(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [idsKey]);

  const items = useMemo<CartItem[]>(
    () =>
      lines.flatMap((line) => {
        const product = products[line.productId];
        if (!product) return [];
        const unitPrice = Math.round(product.salePrice ?? product.price ?? 0);
        return [{ ...line, product, unitPrice, lineTotal: unitPrice * line.quantity }];
      }),
    [lines, products],
  );

  const add = useCallback((productId: string, quantity = 1) => cartStore.add(productId, quantity), []);
  const value: CartContextValue = {
    lines,
    items,
    count: lines.reduce((sum, l) => sum + l.quantity, 0),
    subtotal: items.reduce((sum, i) => sum + i.lineTotal, 0),
    loadingProducts: loadingProducts && items.length < lines.length,
    add,
    setQuantity: cartStore.setQuantity,
    remove: cartStore.remove,
    clear: cartStore.clear,
    drawerOpen,
    openDrawer: useCallback(() => setDrawerOpen(true), []),
    closeDrawer: useCallback(() => setDrawerOpen(false), []),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
