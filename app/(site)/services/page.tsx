import Link from 'next/link';
import { Truck, ShieldCheck, Factory, Award, ArrowRight } from 'lucide-react';

const services = [
  {
    title: 'Foil Containers Supply',
    desc: 'Automated high-capacity manufacturing lines producing heat-sealable and curled-rim foil trays.',
    icon: Factory,
  },
  {
    title: 'Custom Packaging & Private Labeling',
    desc: 'Full-service tooling, mold creation, and customized brand printing for national chains and airlines.',
    icon: Award,
  },
  {
    title: 'Bulk Order & Global Logistics',
    desc: 'Export management and scheduled recurring pallet shipments across 70+ countries worldwide.',
    icon: Truck,
  },
  {
    title: 'Quality & Hygiene Compliance',
    desc: 'Rigorous laboratory testing ensuring complete compliance with international food contact standards.',
    icon: ShieldCheck,
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#6366F1] font-bold text-xs uppercase tracking-widest">
            Capabilities
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1E1B4B] mt-2 font-heading">
            Industries We Serve & Services
          </h1>
          <p className="text-[#64748B] mt-4 text-sm md:text-base">
            Delivering robust end-to-end supply chain packaging solutions for commercial food production, catering, and retail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl border border-gray-200 bg-white shadow-card hover:border-[#6366F1] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] border border-[#6366F1]/15 flex items-center justify-center text-[#6366F1] mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1E1B4B] mb-2">{item.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#E63946] hover:bg-[#C92A37] text-white font-bold text-sm transition shadow-md"
          >
            Inquire for Contract Manufacturing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
