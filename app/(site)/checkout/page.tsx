'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price ? item.price * item.quantity : 0),
    0
  );

  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center py-12 bg-[#EEF2FF]/60 w-full">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-extrabold text-[#1E1B4B] mb-8 font-heading">
          Shopping Cart & Checkout
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center shadow-sm">
            <ShoppingBag className="w-16 h-16 text-[#6366F1]/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1E1B4B]">Your cart is empty</h3>
            <p className="text-sm text-gray-500 mt-2 mb-6">
              Browse our catalog to add items to your cart.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E63946] text-white font-semibold text-sm hover:bg-[#C92A37] transition shadow-md"
            >
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Order Items</span>
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-500 hover:underline cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 border-b border-gray-50 text-sm"
                >
                  <div>
                    <h4 className="font-bold text-[#1E1B4B]">{item.name}</h4>
                    <span className="text-xs text-gray-500">
                      Qty: {item.quantity} × {item.price ? `AED ${item.price.toFixed(2)}` : 'RFQ'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[#1E1B4B]">
                      {item.price ? `AED ${(item.price * item.quantity).toFixed(2)}` : 'On Request'}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 h-fit shadow-sm">
              <h3 className="font-bold text-[#1E1B4B] text-lg mb-4 font-heading">Summary</h3>
              <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-[#1E1B4B]">AED {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                <span className="text-gray-600">VAT (5%)</span>
                <span className="font-bold text-[#1E1B4B]">AED {(total * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base py-3 font-extrabold text-[#E63946]">
                <span>Total</span>
                <span>AED {(total * 1.05).toFixed(2)}</span>
              </div>

              <Link
                href="/contact"
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E63946] hover:bg-[#C92A37] text-white font-bold text-sm transition shadow-md"
              >
                Proceed to Order RFQ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
