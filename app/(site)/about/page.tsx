import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center py-12 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <span className="text-[#6366F1] font-bold text-xs uppercase tracking-widest block text-center">
          Our Company
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#1E1B4B] text-center mt-2 mb-8 font-heading">
          Pioneering Excellence in Food Packaging
        </h1>

        <div className="prose prose-lg text-slate-700 mx-auto space-y-6 leading-relaxed">
          <p>
            Falcon Pack is a premier manufacturer and distributor of disposable food packaging
            products. With state-of-the-art manufacturing facilities and distribution centers, we deliver
            unrivaled quality, hygiene, and supply reliability to top hotels, restaurants, institutions, and retailers.
          </p>

          <p>
            Our diverse portfolio exceeds 3,000 products spanning aluminum foils, cling films, foam tableware,
            plastic food containers, eco-friendly sugarcane bagasse trays, paper bags, and hygiene disposables.
          </p>

          <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
            {[
              'Advanced Manufacturing Technologies',
              'Environmentally Conscious Solutions',
              'ISO 9001, BRCGS & HACCP Standards',
              'Global Supply Chain & Logistics Hubs',
            ].map((pt, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-[#EEF2FF] rounded-xl text-[#1E1B4B] border border-[#6366F1]/15 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#E63946] shrink-0" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
