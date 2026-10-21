'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Search, Filter, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { initialProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';

const categoriesList = [
  'All Products',
  'Aluminum Containers',
  'Eco-Friendly Packaging',
  'Plastic Containers',
  'Paper Bags & Wraps',
];

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [selectedCat, setSelectedCat] = useState('All Products');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = initialProducts.filter((p) => {
    const matchCat =
      selectedCat === 'All Products' ||
      p.category.toLowerCase() === selectedCat.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

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
              Comprehensive Food Packaging
            </h1>
            <p className="text-slate-300 mt-3 text-sm md:text-base">
              Explore over 3,000 packaging items manufactured to international standards.
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCat === cat
                    ? 'bg-[#E63946] text-white shadow-sm'
                    : 'bg-[#EEF2FF] text-[#1E1B4B] hover:bg-[#E0E7FF]'
                }`}
              >
                {cat}
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-[#6366F1] transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-44 rounded-xl bg-[#EEF2FF] flex items-center justify-center relative overflow-hidden mb-4">
                  <Package className="w-16 h-16 text-[#6366F1]/30" />
                  <span className="absolute top-3 left-3 bg-[#E63946] text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                    {product.category}
                  </span>
                </div>

                <h3 className="font-bold text-[#1E1B4B] text-base line-clamp-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>

                <div className="mt-3 text-[11px] text-gray-600 space-y-0.5">
                  <div>Packing: <span className="font-medium text-[#1E1B4B]">{product.packing}</span></div>
                  {product.capacity && <div>Capacity: <span className="font-medium text-[#1E1B4B]">{product.capacity}</span></div>}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">Unit Price</span>
                  <span className="text-lg font-bold text-[#E63946]">
                    {product.price ? `AED ${product.price.toFixed(2)}` : 'On Request'}
                  </span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="inline-flex items-center justify-center p-2.5 rounded-xl bg-[#E63946] hover:bg-[#C92A37] text-white transition-colors duration-200 shadow-sm"
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
