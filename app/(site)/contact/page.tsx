'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const endpoint =
    process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT ||
    process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ||
    'https://formspree.io/f/meeywwzr';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center py-12 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <span className="text-[#6366F1] font-bold text-xs uppercase tracking-widest">
            Contact & Support
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1E1B4B] mt-2 font-heading">
            Get in Touch With Our Team
          </h1>
          <p className="text-[#64748B] mt-2 text-sm md:text-base">
            Reach out for product specifications, bulk quotations, or distribution inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Info Card */}
          <div className="bg-[#1E1B4B] text-white p-8 md:p-10 rounded-2xl flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-2xl font-bold mb-4 font-heading">Head Office & Inquiries</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                Our sales engineers and support team are available Monday through Saturday.
              </p>

              <div className="space-y-6 text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#818CF8] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">Office Address</span>
                    <span>Industrial Area, UAE & International Hubs</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#818CF8] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">Telephone</span>
                    <span>+971 6 534 8888</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#818CF8] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-white">Email Address</span>
                    <span>info@falconpack.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-slate-400">
              Bulk trade inquiry response within 24 hours.
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#EEF2FF] p-8 md:p-10 rounded-2xl border border-[#6366F1]/20 shadow-sm">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-[#E63946] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1E1B4B]">Thank you!</h3>
                <p className="text-sm text-[#64748B] mt-2">
                  Your inquiry has been submitted. Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#6366F1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@company.com"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#6366F1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+971 50 123 4567"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#6366F1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1">
                    Message / RFQ Details
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell us about the products and estimated order volume..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#6366F1]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-[#E63946] hover:bg-[#C92A37] text-white font-bold text-sm transition shadow-md"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
