'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';

export interface CartItem extends Omit<Product, 'id'> {
  id: number | string;
  _id?: string;
  quantity: number;
}

// A product as passed to addToCart. Some API responses carry a string `_id`.
type CartProductInput = Product & { _id?: string };

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartProductInput) => void;
  removeFromCart: (productId: number | string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  isInCart: (productId: number | string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          }
        }
      }
    } catch (e) {
      console.warn('Could not read cart from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      }
    } catch (e) {
      console.warn('Could not write cart to localStorage:', e);
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product: CartProductInput) => {
    if (!product) return;
    const targetId = product._id || product.id;
    if (!targetId && targetId !== 0) return;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === targetId || item._id === targetId || item.id?.toString() === targetId?.toString()
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }

      const newItem: CartItem = {
        ...product,
        id: targetId,
        _id: product._id || (typeof targetId === 'string' ? targetId : undefined),
        quantity: 1,
      };

      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: number | string) => {
    if (!productId && productId !== 0) return;
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          item.id !== productId &&
          item._id !== productId &&
          item.id?.toString() !== productId?.toString()
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const isInCart = (productId: number | string) => {
    if (!productId && productId !== 0) return false;
    return cartItems.some(
      (item) =>
        item.id === productId ||
        item._id === productId ||
        item.id?.toString() === productId?.toString()
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalItems,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    // Provide a safe fallback if used outside provider so Header never crashes
    return {
      cartItems: [],
      addToCart: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      getTotalItems: () => 0,
      isInCart: () => false,
    };
  }
  return context;
}
