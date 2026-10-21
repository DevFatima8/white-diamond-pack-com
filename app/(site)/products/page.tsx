'use client';

// Temporary shop page: same layout as before, but the data now comes from the
// database through /api/products and /api/categories. Rebuilt properly in Phase 5.

import { Suspense, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Search, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/utils';
import type { CategoryItem } from '@/lib/categories';

const PLACEHOLDER = '/images/product-placeholder.png';

/** The fields of a product (as returned by /api/products) that this page uses. */
interface ShopProduct {
  id: string;
  name: string;
  nameAr: string | null;
  category: string;
  categoryRef: { slug: string; nameEn: string; nameAr: string } | null;
  image: string;
  description: string;
  features: unknown;
  packing: string;
  capacity: string | null;
  price: number | null;
  salePrice: number | null;
}

type LoadState = 'loading' | 'ready' | 'error';

function ProductsCatalog() {
  const { addToCart } = useCart();
  const { isRTL } = useLanguage();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  // Header links open this page with ?category=<slug>
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') ?? 'all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    Promise.all([fetch('/api/products'), fetch('/api/categories')])
      .then(async ([productsRes, categoriesRes]) => {
        if (!productsRes.ok || !categoriesRes.ok) throw new Error('Catalogue unavailable');
        const [p, c] = await Promise.all([productsRes.json(), categoriesRes.json()]);
        setProducts(p.data);
        setCategories(c.data);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter((p) => {
      const matchCat = selectedCat === 'all' || p.categoryRef?.slug === selectedCat;
      const matchSearch =
        p.name.toLowerCase().includes(term) ||
        (p.nameAr ?? '').includes(searchTerm) ||
        p.description.toLowerCase().includes(term);
      return matchCat && matchSearch;
    });
  }, [products, selectedCat, searchTerm]);

  const pills = [{ slug: 'all', label: isRTL ? 'كل المنتجات' : 'All Products' }].concat(
    categories.map((c) => ({ slug: c.slug, label: isRTL ? c.nameAr : c.name })),
  );

  return (
    <div className="min-h-[calc(100vh-76px)] py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Banner */}
        <div className="rounded-3xl bg-[#1E1B4B] text-white p-8 md:p-14 mb-12 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="text-[#818CF8] font-bold text-xs uppercase tracking-widest">
              Catalog & Supplies
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mt-2 font-heading">
              Food Packaging & Disposables
            </h1>
            <p className="text-slate-300 mt-3 text-sm md:text-base">
              Wholesale prices in PKR, delivered across Pakistan from Faisalabad.
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {pills.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCat(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCat === cat.slug
                    ? 'bg-[#6366F1] text-white shadow-sm'
                    : 'bg-[#EEF2FF] text-[#6366F1] hover:bg-[#E0E7FF]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs focus:outline-none focus:border-[#6366F1]"
            />
          </div>
        </div>

        {state === 'loading' && <p className="text-sm text-gray-500">Loading products…</p>}
        {state === 'error' && (
          <p className="text-sm text-[#E63946]">The catalogue is temporarily unavailable. Please try again later.</p>
        )}
        {state === 'ready' && filtered.length === 0 && (
          <p className="text-sm text-gray-500">No products found.</p>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const categoryLabel = product.categoryRef
              ? isRTL
                ? product.categoryRef.nameAr
                : product.categoryRef.nameEn
              : product.category;
            const price = product.salePrice ?? product.price;
            return (
              <div
                key={product.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-[#6366F1] transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-full aspect-[4/3] rounded-xl bg-[#F8FAFC] relative overflow-hidden mb-4">
                    <Image
                      src={product.image || PLACEHOLDER}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-contain"
                    />
                    <span className="absolute top-3 left-3 bg-[#EEF2FF] text-[#6366F1] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                      {categoryLabel}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#1E1B4B] text-base line-clamp-1">
                    {isRTL && product.nameAr ? product.nameAr : product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>

                  <div className="mt-3 text-[11px] text-gray-600 space-y-0.5">
                    <div>Packing: <span className="font-medium text-[#1E1B4B]">{product.packing}</span></div>
                    {product.capacity && (
                      <div>Capacity: <span className="font-medium text-[#1E1B4B]">{product.capacity}</span></div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block">Unit Price</span>
                    <span className="text-lg font-bold text-[#E63946]">{formatPrice(price)}</span>
                    {product.salePrice != null && product.price != null && (
                      <span className="ml-2 text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      addToCart({
                        ...product,
                        price,
                        features: Array.isArray(product.features) ? (product.features as string[]) : [],
                      })
                    }
                    className="inline-flex items-center justify-center p-2.5 rounded-xl bg-[#E63946] hover:bg-[#C92A37] text-white transition-colors duration-200 shadow-sm"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// useSearchParams needs a Suspense boundary in the App Router.
export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsCatalog />
    </Suspense>
  );
}
