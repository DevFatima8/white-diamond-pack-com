'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Banknote, Check, Landmark, Loader2, Lock, MapPin, Pencil, ShoppingBag } from 'lucide-react';
import { z } from 'zod';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { PK_CITIES } from '@/lib/cities';
import { deliveryFor, type DeliverySettings } from '@/lib/delivery';
import { fill, translations } from '@/lib/i18n/translations';
import { unitName } from '@/lib/i18n/units';
import { formatPkMobile } from '@/lib/phone';
import { orderHref, routes } from '@/lib/routes';
import { cn, formatPrice } from '@/lib/utils';
import { orderCustomerSchema } from '@/lib/validation/order';
import CartSummary from '@/components/cart/CartSummary';

type Step = 1 | 2 | 3;
type Payment = 'COD' | 'BANK_TRANSFER';
type FieldKey = 'name' | 'phone' | 'email' | 'city' | 'address';
const OTHER = '__other__';

export default function CheckoutView({ delivery, bankDetails }: { delivery: DeliverySettings; bankDetails: string }) {
  const router = useRouter();
  const { items, lines, subtotal, loadingProducts, clear } = useCart();
  const { t, isRTL } = useLanguage();
  const tk = t?.checkout || translations.en.checkout;

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', otherCity: '', address: '', notes: '' });
  const [payment, setPayment] = useState<Payment>('COD');
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [placed, setPlaced] = useState(false); // order saved, waiting for the confirmation page

  const total = subtotal + deliveryFor(subtotal, delivery.charge, delivery.threshold);
  const city = form.city === OTHER ? form.otherCity : form.city;
  const customer = { name: form.name, phone: form.phone, email: form.email, city, address: form.address, notes: form.notes };

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === 'otherCity' || k === 'city') setErrors((e) => ({ ...e, city: undefined }));
    else setErrors((e) => ({ ...e, [k]: undefined }));
  };

  /** Check the details form with the same schema the server uses. */
  const validateDetails = () => {
    const check = orderCustomerSchema.safeParse(customer);
    if (check.success) return true;
    const fe = z.flattenError(check.error).fieldErrors as Record<string, string[] | undefined>;
    setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0]])) as Partial<Record<FieldKey, string>>);
    setTimeout(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0);
    return false;
  };

  const goTo = (s: Step) => {
    setSubmitError('');
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const placeOrder = async () => {
    if (!validateDetails()) return goTo(2);
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, paymentMethod: payment, items: lines }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.data) {
        setPlaced(true); // show a spinner instead of the (now empty) cart
        clear(); // the order is saved — empty the cart
        router.replace(orderHref(json.data.orderNumber, json.data.token));
        return; // keep the button busy while the confirmation page loads
      }
      if (res.status === 429) setSubmitError(tk.errors.tooMany);
      else if (res.status === 409) {
        // a product sold out / was hidden, or a quantity is below its minimum → back to the cart
        setSubmitError(tk.errors.generic);
        goTo(1);
      } else if (res.status === 400) {
        validateDetails();
        goTo(2);
      } else setSubmitError(tk.errors.generic);
    } catch {
      setSubmitError(tk.errors.generic);
    }
    setSubmitting(false);
  };

  const err = (k: FieldKey) => (errors[k] ? (tk.errors as Record<string, string>)[errors[k]!] ?? tk.errors.generic : undefined);
  const inputClass = (invalid: boolean) =>
    cn(
      'h-12 w-full rounded-xl border bg-white px-4 text-sm text-brand-ink focus:border-brand-secondary focus:outline-none focus:ring-[3px] focus:ring-brand-secondary/15',
      invalid ? 'border-brand-primary' : 'border-brand-border',
    );

  if (placed) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-brand-muted" role="status">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> {t.common.loading}
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <div className="mx-auto mb-4 w-fit rounded-full bg-brand-tint p-5 text-brand-secondary">
          <ShoppingBag className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="font-heading text-2xl font-bold">{t.cart.empty}</h1>
        <p className="mt-1 text-sm text-brand-muted">{t.cart.emptyText}</p>
        <Link href={routes.shop} className="mt-6 inline-flex rounded-full bg-brand-primary px-7 py-3 text-sm font-bold text-white hover:bg-brand-primary-hover">
          {t.cart.startShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-surface py-10 lg:py-14">
      <div className="mx-auto max-w-site px-5 sm:px-6 lg:px-12">
        {/* Header + stepper */}
        <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-brand-border bg-white p-6 shadow-level-1 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-secondary">
              <Lock className="h-3 w-3" aria-hidden /> {t.shop.eyebrow}
            </span>
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">{tk.title}</h1>
          </div>
          <ol className="flex items-center gap-2 sm:gap-3" aria-label={tk.title}>
            {tk.steps.map((label, i) => {
              const n = (i + 1) as Step;
              const done = n < step;
              const current = n === step;
              return (
                <li key={label} className="flex items-center gap-2 sm:gap-3" aria-current={current ? 'step' : undefined}>
                  {i > 0 && <span className={cn('h-0.5 w-6 rounded-full sm:w-10', done || current ? 'bg-brand-secondary' : 'bg-brand-border')} aria-hidden />}
                  <span
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                      done ? 'bg-brand-secondary text-white' : current ? 'bg-brand-navy text-white' : 'bg-brand-tint text-brand-muted',
                    )}
                  >
                    {done ? <Check className="h-4 w-4" aria-hidden /> : n}
                  </span>
                  <span className={cn('text-xs font-semibold sm:text-sm', current ? 'text-brand-ink' : 'text-brand-muted', !current && 'hidden sm:inline')}>{label}</span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-level-1 sm:p-8">
            {submitError && (
              <p className="mb-6 rounded-xl bg-[#FFF1F2] px-4 py-3 text-sm font-medium text-brand-primary" role="alert">
                {submitError}
              </p>
            )}

            {/* Step 1: cart review */}
            {step === 1 && (
              <section aria-labelledby="step1">
                <div className="mb-5 flex items-center justify-between">
                  <h2 id="step1" className="font-heading text-xl font-bold">{tk.steps[0]}</h2>
                  <Link href={routes.cart} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-secondary hover:underline">
                    <Pencil className="h-3.5 w-3.5" aria-hidden /> {tk.editCart}
                  </Link>
                </div>
                {loadingProducts && items.length === 0 ? (
                  <p className="flex items-center gap-2 text-sm text-brand-muted">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> {t.cart.loading}
                  </p>
                ) : (
                  <ItemList />
                )}
                <div className="mt-8 flex justify-end">
                  <button type="button" onClick={() => goTo(2)} disabled={items.length === 0} className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-primary px-8 text-sm font-bold text-white hover:bg-brand-primary-hover disabled:opacity-50">
                    {tk.continue} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                  </button>
                </div>
              </section>
            )}

            {/* Step 2: delivery details */}
            {step === 2 && (
              <form
                aria-labelledby="step2"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  if (validateDetails()) goTo(3);
                }}
              >
                <h2 id="step2" className="mb-6 flex items-center gap-2 font-heading text-xl font-bold">
                  <MapPin className="h-5 w-5 text-brand-secondary" aria-hidden /> {tk.detailsTitle}
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="name" label={tk.name} error={err('name')} required>
                    <input id="name" className={inputClass(!!errors.name)} value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" aria-invalid={!!errors.name || undefined} />
                  </Field>
                  <Field id="phone" label={tk.phone} hint={tk.phoneHint} error={err('phone')} required>
                    <input id="phone" className={inputClass(!!errors.phone)} value={form.phone} onChange={(e) => set('phone', e.target.value)} inputMode="tel" autoComplete="tel" placeholder="03XXXXXXXXX" dir="ltr" aria-invalid={!!errors.phone || undefined} />
                  </Field>
                  <Field id="email" label={tk.email} error={err('email')}>
                    <input id="email" type="email" className={inputClass(!!errors.email)} value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" dir="ltr" aria-invalid={!!errors.email || undefined} />
                  </Field>
                  <Field id="city" label={tk.city} error={err('city')} required>
                    <select id="city" className={cn(inputClass(!!errors.city), 'cursor-pointer')} value={form.city} onChange={(e) => set('city', e.target.value)} aria-invalid={!!errors.city || undefined}>
                      <option value="">{tk.cityPlaceholder}</option>
                      {PK_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value={OTHER}>{tk.otherCity}</option>
                    </select>
                  </Field>
                  {form.city === OTHER && (
                    <Field id="otherCity" label={tk.otherCityName} required className="sm:col-span-2">
                      <input id="otherCity" className={inputClass(!!errors.city)} value={form.otherCity} onChange={(e) => set('otherCity', e.target.value)} autoComplete="address-level2" />
                    </Field>
                  )}
                  <Field id="address" label={tk.address} error={err('address')} required className="sm:col-span-2">
                    <textarea id="address" className={cn(inputClass(!!errors.address), 'h-auto min-h-[88px] py-3')} value={form.address} onChange={(e) => set('address', e.target.value)} placeholder={tk.addressPlaceholder} autoComplete="street-address" aria-invalid={!!errors.address || undefined} />
                  </Field>
                  <Field id="notes" label={tk.notes} className="sm:col-span-2">
                    <textarea id="notes" className={cn(inputClass(false), 'h-auto min-h-[80px] py-3')} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder={tk.notesPlaceholder} />
                  </Field>
                </div>
                <div className="mt-8 flex justify-between gap-3">
                  <button type="button" onClick={() => goTo(1)} className="inline-flex h-12 items-center gap-2 rounded-full border border-brand-border px-6 text-sm font-semibold text-brand-navy hover:bg-brand-tint">
                    <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden /> {tk.back}
                  </button>
                  <button type="submit" className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-primary px-8 text-sm font-bold text-white hover:bg-brand-primary-hover">
                    {tk.continue} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: review, payment, place order */}
            {step === 3 && (
              <section aria-labelledby="step3">
                <h2 id="step3" className="mb-6 font-heading text-xl font-bold">{tk.confirmTitle}</h2>

                <div className="mb-6 rounded-xl border border-brand-border p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-secondary">{tk.deliverTo}</span>
                    <button type="button" onClick={() => goTo(2)} className="text-xs font-semibold text-brand-secondary hover:underline">
                      <Pencil className="me-1 inline h-3 w-3" aria-hidden />
                      {tk.back}
                    </button>
                  </div>
                  <p className="font-semibold">{form.name}</p>
                  <p className="text-sm text-brand-muted" dir="ltr">{formatPkMobile(form.phone)}{form.email ? ` · ${form.email}` : ''}</p>
                  <p className="mt-1 whitespace-pre-line text-sm">{form.address}</p>
                  <p className="text-sm font-semibold">{city}</p>
                </div>

                <fieldset>
                  <legend className="mb-3 font-heading text-base font-bold">{tk.payment}</legend>
                  <div className="space-y-3">
                    {(
                      [
                        { value: 'COD', title: tk.cod, desc: tk.codDesc, icon: Banknote },
                        { value: 'BANK_TRANSFER', title: tk.bank, desc: tk.bankDesc, icon: Landmark },
                      ] as const
                    ).map(({ value, title, desc, icon: Icon }) => (
                      <label
                        key={value}
                        className={cn(
                          'flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-colors',
                          payment === value ? 'border-brand-secondary bg-brand-tint/50' : 'border-brand-border hover:border-brand-secondary/40',
                        )}
                      >
                        <input type="radio" name="payment" value={value} checked={payment === value} onChange={() => setPayment(value)} className="mt-1 h-5 w-5 accent-brand-secondary" />
                        <span className="rounded-lg bg-white p-2 text-brand-secondary shadow-sm">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <span>
                          <span className="block font-semibold">{title}</span>
                          <span className="block text-sm text-brand-muted">{desc}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  {payment === 'BANK_TRANSFER' && bankDetails && (
                    <div className="mt-3 rounded-xl bg-brand-navy p-4 text-sm text-white">
                      <p className="mb-1 font-semibold">{tk.bankDetails}</p>
                      <p className="whitespace-pre-line text-[#DAE2FD]" dir="ltr">{bankDetails}</p>
                    </div>
                  )}
                </fieldset>

                <p className="mt-6 text-xs text-brand-muted">{tk.agree}</p>
                <div className="mt-4 flex flex-col-reverse justify-between gap-3 sm:flex-row">
                  <button type="button" onClick={() => goTo(2)} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-brand-border px-6 text-sm font-semibold text-brand-navy hover:bg-brand-tint">
                    <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden /> {tk.back}
                  </button>
                  <button
                    type="button"
                    onClick={placeOrder}
                    disabled={submitting || items.length === 0}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-primary px-8 text-sm font-bold text-white shadow-md hover:bg-brand-primary-hover disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Lock className="h-4 w-4" aria-hidden />}
                    {fill(tk.placeOrder, { total: formatPrice(total) })}
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* Summary */}
          <aside className="rounded-2xl border border-brand-border bg-white p-6 shadow-level-1 lg:sticky lg:top-28">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold">{tk.summary}</h2>
              <Link href={routes.cart} className="text-xs font-semibold text-brand-secondary hover:underline">{tk.editCart}</Link>
            </div>
            <ul className="mb-5 space-y-3 border-b border-brand-border pb-5">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3 text-sm">
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-surface">
                    <Image src={item.product.image || '/images/product-placeholder.png'} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-1 font-semibold">{isRTL && item.product.nameAr ? item.product.nameAr : item.product.name}</span>
                    <span className="text-xs text-brand-muted">
                      {item.quantity} × {formatPrice(item.unitPrice)}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums">{formatPrice(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <CartSummary subtotal={subtotal} delivery={delivery}>
              <p className="flex items-start gap-2 text-[11px] text-brand-muted">
                <Lock className="mt-0.5 h-3 w-3 shrink-0" aria-hidden /> {tk.secure}
              </p>
            </CartSummary>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({ id, label, hint, error, required, className, children }: { id: string; label: string; hint?: string; error?: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-brand-ink">
        {label} {required && <span className="text-brand-primary">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs font-medium text-brand-primary" role="alert">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-brand-muted">{hint}</p>
      )}
    </div>
  );
}

/** Read-only list of the cart lines for step 1. */
function ItemList() {
  const { items } = useCart();
  const { isRTL } = useLanguage();
  return (
    <ul className="divide-y divide-brand-border rounded-xl border border-brand-border">
      {items.map((item) => (
        <li key={item.productId} className="flex items-center gap-4 p-4">
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-brand-surface">
            <Image src={item.product.image || '/images/product-placeholder.png'} alt="" fill sizes="64px" className="object-cover" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="line-clamp-2 font-semibold leading-snug">{isRTL && item.product.nameAr ? item.product.nameAr : item.product.name}</span>
            <span className="text-sm text-brand-muted">
              {item.quantity} × {formatPrice(item.unitPrice)} / {unitName(item.product.unit, isRTL ? 'ar' : 'en')}
            </span>
          </span>
          <span className="font-heading font-bold tabular-nums">{formatPrice(item.lineTotal)}</span>
        </li>
      ))}
    </ul>
  );
}
