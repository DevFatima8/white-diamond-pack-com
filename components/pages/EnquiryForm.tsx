'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { z } from 'zod';
import { contactRequestSchema, type CONTACT_KINDS } from '@/lib/validation/order';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { usePageTexts } from './usePageTexts';

type Field = 'name' | 'phone' | 'email' | 'company' | 'subject' | 'quantity' | 'message';

/**
 * The form behind Contact, Customize Packaging and Careers → POST /api/contact →
 * Admin → Messages. Checked in the browser with the same zod schema as the server.
 * `subject` can be controlled by the parent (Careers: "Apply" on a job selects it).
 */
export default function EnquiryForm({
  kind,
  subjectLabel,
  subjectOptions,
  subject: controlledSubject,
  onSubjectChange,
  messageLabel,
  messagePlaceholder,
  showCompany = true,
  showQuantity = false,
  className,
}: {
  kind: (typeof CONTACT_KINDS)[number];
  subjectLabel?: string;
  subjectOptions?: string[];
  subject?: string;
  onSubjectChange?: (value: string) => void;
  messageLabel?: string;
  messagePlaceholder?: string;
  showCompany?: boolean;
  showQuantity?: boolean;
  className?: string;
}) {
  const { p } = usePageTexts();
  const tf = p.form;
  const empty = { name: '', phone: '', email: '', company: '', subject: subjectOptions?.[0] ?? '', quantity: '', message: '' };
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const subject = controlledSubject ?? values.subject;

  const set = (k: Field, v: string) => {
    if (k === 'subject' && onSubjectChange) onSubjectChange(v);
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const errorText = (key?: string) => (key ? ((tf.errors as Record<string, string>)[key] ?? tf.errors.generic) : undefined);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const payload = {
      kind,
      name: values.name,
      phone: values.phone,
      email: values.email,
      company: showCompany ? values.company : '',
      subject: subjectOptions ? subject : '',
      quantity: showQuantity && values.quantity ? Number(values.quantity) : undefined,
      message: values.message,
    };
    const check = contactRequestSchema.safeParse(payload);
    if (!check.success) {
      const fe = z.flattenError(check.error).fieldErrors as Record<string, string[] | undefined>;
      // quantity has no custom key in the schema → use our own
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, k === 'quantity' ? 'quantity' : v?.[0]])));
      return;
    }

    setState('sending');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => null);

    if (res?.ok) {
      setState('sent');
      return;
    }
    setState('idle');
    setFormError(res?.status === 429 ? tf.errors.too_many : tf.errors.generic);
  };

  const input = (invalid?: boolean) =>
    cn(
      'mt-1.5 h-12 w-full rounded-xl border bg-white px-4 text-sm font-normal text-brand-ink focus:border-brand-secondary focus:outline-none focus:ring-[3px] focus:ring-brand-secondary/15',
      invalid ? 'border-brand-primary' : 'border-brand-border',
    );
  const id = (f: Field) => `${kind}-${f}`;
  const err = (f: Field) =>
    errors[f] ? (
      <span id={`${id(f)}-error`} className="mt-1 block text-xs font-normal text-brand-primary">
        {errorText(errors[f])}
      </span>
    ) : null;
  const aria = (f: Field) => ({ 'aria-invalid': !!errors[f] || undefined, 'aria-describedby': errors[f] ? `${id(f)}-error` : undefined });
  const req = <span className="text-brand-primary" aria-hidden> *</span>;
  const opt = <span className="font-normal text-brand-muted"> {tf.optional}</span>;

  if (state === 'sent') {
    return (
      <div className={cn('flex flex-col items-center rounded-2xl bg-brand-tint px-6 py-12 text-center', className)} role="status">
        <CheckCircle2 className="mb-4 h-14 w-14 text-brand-secondary" aria-hidden />
        <p className="font-heading text-xl font-bold text-brand-navy">{tf.successTitle}</p>
        <p className="mt-2 max-w-md text-sm leading-6 text-brand-muted">{tf.successText}</p>
        <button
          type="button"
          onClick={() => {
            setValues(empty);
            setState('idle');
          }}
          className="mt-6 text-sm font-bold text-brand-secondary hover:text-brand-secondary-hover"
        >
          {tf.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={cn('space-y-5', className)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label htmlFor={id('name')} className="block text-[13px] font-semibold text-brand-ink">
          {tf.name}
          {req}
          <input id={id('name')} className={input(!!errors.name)} value={values.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" maxLength={120} {...aria('name')} />
          {err('name')}
        </label>
        <label htmlFor={id('phone')} className="block text-[13px] font-semibold text-brand-ink">
          {tf.phone}
          {req}
          <input
            id={id('phone')}
            className={input(!!errors.phone)}
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            inputMode="tel"
            autoComplete="tel"
            placeholder={tf.phoneHint}
            dir="ltr"
            maxLength={20}
            {...aria('phone')}
          />
          {err('phone')}
        </label>
        <label htmlFor={id('email')} className="block text-[13px] font-semibold text-brand-ink">
          {tf.email}
          {opt}
          <input id={id('email')} className={input(!!errors.email)} value={values.email} onChange={(e) => set('email', e.target.value)} inputMode="email" autoComplete="email" dir="ltr" maxLength={254} {...aria('email')} />
          {err('email')}
        </label>
        {showCompany && (
          <label htmlFor={id('company')} className="block text-[13px] font-semibold text-brand-ink">
            {tf.company}
            {opt}
            <input id={id('company')} className={input()} value={values.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" maxLength={150} />
          </label>
        )}
        {subjectOptions && (
          <label htmlFor={id('subject')} className="block text-[13px] font-semibold text-brand-ink">
            {subjectLabel ?? tf.subject}
            <select id={id('subject')} className={input()} value={subject} onChange={(e) => set('subject', e.target.value)}>
              {subjectOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        )}
        {showQuantity && (
          <label htmlFor={id('quantity')} className="block text-[13px] font-semibold text-brand-ink">
            {tf.quantity}
            {opt}
            <input
              id={id('quantity')}
              className={input(!!errors.quantity)}
              value={values.quantity}
              onChange={(e) => set('quantity', e.target.value.replace(/[^\d]/g, ''))}
              inputMode="numeric"
              dir="ltr"
              maxLength={8}
              {...aria('quantity')}
            />
            {err('quantity')}
          </label>
        )}
        <label htmlFor={id('message')} className="block text-[13px] font-semibold text-brand-ink sm:col-span-2">
          {messageLabel ?? tf.message}
          {req}
          <textarea
            id={id('message')}
            className={cn(input(!!errors.message), 'h-auto min-h-[132px] py-3')}
            value={values.message}
            onChange={(e) => set('message', e.target.value)}
            placeholder={messagePlaceholder}
            maxLength={3000}
            {...aria('message')}
          />
          {err('message')}
        </label>
      </div>

      {formError && (
        <p className="rounded-xl bg-[#FFF1F2] px-4 py-3 text-sm text-brand-primary" role="alert">
          {formError}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-brand-muted">
          <Link href={routes.privacy} className="underline-offset-2 hover:text-brand-secondary hover:underline">
            {tf.privacyNote}
          </Link>
        </p>
        <button
          type="submit"
          disabled={state === 'sending'}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-primary px-8 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover disabled:opacity-60"
        >
          {state === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden />}
          {state === 'sending' ? tf.sending : tf.send}
        </button>
      </div>
    </form>
  );
}
