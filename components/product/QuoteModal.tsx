'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import { useLanguage } from '@/context/LanguageContext';
import { quoteRequestSchema } from '@/lib/validation/order';
import { cn } from '@/lib/utils';

type Field = 'name' | 'phone' | 'email' | 'company' | 'quantity' | 'message';

/** "Request bulk quote" form → POST /api/quote → appears in Admin → Messages. */
export default function QuoteModal({
  open,
  onClose,
  productId,
  productName,
  defaultQuantity,
}: {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  defaultQuantity: number;
}) {
  const { t, isRTL } = useLanguage();
  const tq = t.product.quote;
  const [values, setValues] = useState({ name: '', phone: '', email: '', company: '', quantity: String(defaultQuantity * 10), message: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const set = (k: Field, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  // Error keys from the shared schema → translated messages
  const errorText = (key: string | undefined) =>
    key ? (tq.errors as Record<string, string>)[key] ?? tq.errors.generic : undefined;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...values, productId, quantity: values.quantity ? Number(values.quantity) : undefined };
    const check = quoteRequestSchema.safeParse(payload);
    if (!check.success) {
      const fe = z.flattenError(check.error).fieldErrors as Record<string, string[] | undefined>;
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0]])));
      return;
    }
    setState('sending');
    const res = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => null);
    setState(res?.ok ? 'sent' : 'error');
  };

  const input = (invalid?: boolean) =>
    cn(
      'h-11 w-full rounded-xl border px-4 text-sm focus:border-brand-secondary focus:outline-none focus:ring-[3px] focus:ring-brand-secondary/15',
      invalid ? 'border-brand-primary' : 'border-brand-border',
    );

  return (
    <Modal isOpen={open} onClose={onClose} title={tq.title} description={productName} size="md" className="text-brand-ink">
      {state === 'sent' ? (
        <div className="flex flex-col items-center py-6 text-center" role="status">
          <CheckCircle2 className="mb-3 h-12 w-12 text-brand-secondary" aria-hidden />
          <p className="font-heading text-lg font-bold">{tq.success}</p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
          <p className="text-sm text-brand-muted">{tq.intro}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-[13px] font-semibold">
              {tq.name} <span className="text-brand-primary">*</span>
              <input className={cn(input(!!errors.name), 'mt-1.5 font-normal')} value={values.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
              {errors.name && <span className="mt-1 block text-xs text-brand-primary">{errorText(errors.name)}</span>}
            </label>
            <label className="block text-[13px] font-semibold">
              {tq.phone} <span className="text-brand-primary">*</span>
              <input className={cn(input(!!errors.phone), 'mt-1.5 font-normal')} value={values.phone} onChange={(e) => set('phone', e.target.value)} inputMode="tel" autoComplete="tel" placeholder={tq.phoneHint} dir="ltr" />
              {errors.phone && <span className="mt-1 block text-xs text-brand-primary">{errorText(errors.phone)}</span>}
            </label>
            <label className="block text-[13px] font-semibold">
              {tq.email}
              <input className={cn(input(!!errors.email), 'mt-1.5 font-normal')} value={values.email} onChange={(e) => set('email', e.target.value)} inputMode="email" autoComplete="email" dir="ltr" />
              {errors.email && <span className="mt-1 block text-xs text-brand-primary">{errorText(errors.email)}</span>}
            </label>
            <label className="block text-[13px] font-semibold">
              {tq.company}
              <input className={cn(input(), 'mt-1.5 font-normal')} value={values.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" />
            </label>
            <label className="block text-[13px] font-semibold sm:col-span-2">
              {tq.quantity}
              <input className={cn(input(!!errors.quantity), 'mt-1.5 font-normal')} value={values.quantity} onChange={(e) => set('quantity', e.target.value.replace(/[^\d]/g, ''))} inputMode="numeric" />
            </label>
            <label className="block text-[13px] font-semibold sm:col-span-2">
              {tq.message} <span className="text-brand-primary">*</span>
              <textarea
                className={cn(input(!!errors.message), 'mt-1.5 h-auto min-h-[96px] py-3 font-normal')}
                value={values.message}
                onChange={(e) => set('message', e.target.value)}
                placeholder={tq.messagePlaceholder}
              />
              {errors.message && <span className="mt-1 block text-xs text-brand-primary">{errorText(errors.message)}</span>}
            </label>
          </div>
          {state === 'error' && (
            <p className="rounded-xl bg-[#FFF1F2] px-4 py-3 text-sm text-brand-primary" role="alert">
              {tq.errors.generic}
            </p>
          )}
          <button
            type="submit"
            disabled={state === 'sending'}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-primary text-sm font-bold text-white hover:bg-brand-primary-hover disabled:opacity-60"
          >
            {state === 'sending' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {tq.submit}
          </button>
        </form>
      )}
    </Modal>
  );
}
