'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Eye, Package, Sparkles } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/data/products';

export interface ProductCardProps {
  product: Product;
  className?: string;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  onQuickView,
}) => {
  const { addToCart } = useCart();
  const { t, isRTL } = useLanguage();
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const imageSrc =
    imageError || !product.image
      ? '/images/food-containers.png'
      : product.image;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative flex flex-col bg-white dark:bg-[#141815] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300',
        className
      )}
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full bg-slate-50 dark:bg-black/30 overflow-hidden flex items-center justify-center p-4">
        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EEF2FF] dark:bg-[#1E1B4B]/70 text-[#6366F1] dark:text-[#818CF8] border border-[#6366F1]/20 backdrop-blur-md">
            {product.category}
          </span>
        </div>

        {/* In Stock Badge */}
        {product.inStock !== false && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-[#6366F1] dark:bg-[#1E1B4B] dark:text-[#818CF8] border border-[#6366F1]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-pulse" />
              {t.common.inStock}
            </span>
          </div>
        )}

        <img
          src={imageSrc}
          alt={product.name}
          onError={() => setImageError(true)}
          className="h-full w-full object-contain p-2 group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Quick View Overlay Button */}
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            className="absolute bottom-3 right-3 z-10 p-2.5 rounded-xl bg-white/90 dark:bg-black/80 hover:bg-[#E63946] hover:text-white text-slate-700 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
            title="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5">
        <Link
          href={`/products?search=${encodeURIComponent(product.name)}`}
          className="group-hover:text-[#E63946] dark:group-hover:text-[#818CF8] transition-colors"
        >
          <h3 className="font-bold text-[#1E1B4B] dark:text-white text-base line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Specs snippet */}
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#64748B] dark:text-slate-400">
          {product.capacity && (
            <span className="bg-[#EEF2FF] dark:bg-white/5 text-[#1E1B4B] dark:text-white px-2 py-0.5 rounded-md font-medium">
              {product.capacity}
            </span>
          )}
          {product.packing && (
            <span className="bg-[#EEF2FF] dark:bg-white/5 text-[#1E1B4B] dark:text-white px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
              <Package className="w-3 h-3 text-[#64748B]" />
              {product.packing}
            </span>
          )}
          {product.material && (
            <span className="bg-[#EEF2FF] dark:bg-white/5 text-[#1E1B4B] dark:text-white px-2 py-0.5 rounded-md font-medium">
              {product.material}
            </span>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-white/5">
          <div>
            <div className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">
              Price
            </div>
            <div className="text-base font-extrabold text-[#E63946] dark:text-[#F87171]">
              {formatPrice(product.price)}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer',
              isAdded
                ? 'bg-[#6366F1] text-white shadow-sm shadow-[#6366F1]/30'
                : 'bg-[#E63946] hover:bg-[#C92A37] text-white shadow-sm hover:shadow'
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.common.addedToCart}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{t.common.addToCart}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
