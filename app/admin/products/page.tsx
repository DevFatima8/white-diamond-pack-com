'use client';

import { useState } from 'react';
import { Package, Plus, Search, Filter, CheckCircle2, XCircle } from 'lucide-react';
import { initialProducts, Product } from '@/data/products';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Products Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your Falcon Pack catalogue, inventory, specifications & prices
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E63946] hover:bg-[#E63946]/90 text-white font-semibold text-xs shadow-sm shadow-[#E63946]/20 transition">
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title or category..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#6366F1]"
          />
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-bold">{filtered.length}</span> products
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Packing</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-[#818CF8]" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-[11px] text-slate-400">{item.capacity || 'Standard Size'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[11px]">{item.packing}</td>
                  <td className="p-4 font-bold text-white">
                    {item.price ? `AED ${item.price.toFixed(2)}` : 'On Request'}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#818CF8]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-slate-400 hover:text-white mr-3 font-semibold text-[11px]">
                      Edit
                    </button>
                    <button className="text-rose-400 hover:text-rose-300 font-semibold text-[11px]">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
