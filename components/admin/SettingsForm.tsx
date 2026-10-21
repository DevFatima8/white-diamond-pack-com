'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '@/context/ToastContext';
import { adminFetch, type FieldErrors } from '@/lib/admin/client';
import { settingsSchema } from '@/lib/validation/admin';
import { formatPrice } from '@/lib/utils';
import type { Settings } from '@/lib/settings';
import type { SettingKey } from '@/data/default-settings';
import { Button, Card, CardHeader, Field, Input, Textarea } from './ui';

const SOCIALS: { key: SettingKey; label: string; placeholder: string }[] = [
  { key: 'social_facebook', label: 'Facebook', placeholder: 'https://facebook.com/…' },
  { key: 'social_instagram', label: 'Instagram', placeholder: 'https://instagram.com/…' },
  { key: 'social_linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/…' },
  { key: 'social_youtube', label: 'YouTube', placeholder: 'https://youtube.com/@…' },
  { key: 'social_tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@…' },
];

export default function SettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  const set = (key: SettingKey, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const err = (key: SettingKey) => errors[key]?.[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = settingsSchema.safeParse(values);
    if (!check.success) {
      setErrors(z.flattenError(check.error).fieldErrors);
      toast.error('Please fix the highlighted fields');
      return;
    }
    setSaving(true);
    const res = await adminFetch('/api/admin/settings', { method: 'PUT', body: values });
    setSaving(false);
    if (!res.ok) {
      if (res.fieldErrors) setErrors(res.fieldErrors);
      toast.error(res.error ?? 'Could not save settings');
      return;
    }
    setSaved(values);
    toast.success('Settings saved');
    router.refresh();
  };

  const charge = Number(values.delivery_charge) || 0;
  const threshold = Number(values.free_delivery_threshold) || 0;

  return (
    <form onSubmit={submit} noValidate className="space-y-6 pb-8">
      <Card>
        <CardHeader title="Delivery" description="Used at checkout. Whole rupees." />
        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <Field label="Delivery charge (Rs)" htmlFor="delivery_charge" required error={err('delivery_charge')}>
            <Input id="delivery_charge" inputMode="numeric" value={values.delivery_charge} onChange={(e) => set('delivery_charge', e.target.value.replace(/[^\d]/g, ''))} invalid={!!err('delivery_charge')} />
          </Field>
          <Field label="Free delivery from (Rs)" htmlFor="free_delivery_threshold" required error={err('free_delivery_threshold')} hint="Set 0 to never give free delivery">
            <Input id="free_delivery_threshold" inputMode="numeric" value={values.free_delivery_threshold} onChange={(e) => set('free_delivery_threshold', e.target.value.replace(/[^\d]/g, ''))} invalid={!!err('free_delivery_threshold')} />
          </Field>
          <p className="rounded-xl bg-brand-tint px-4 py-3 text-sm text-brand-navy sm:col-span-2">
            Customers pay <strong>{charge === 0 ? 'no delivery charge' : formatPrice(charge)}</strong>
            {charge > 0 && threshold > 0 && (
              <>
                , and delivery is <strong>free</strong> for orders of <strong>{formatPrice(threshold)}</strong> or more
              </>
            )}
            .
          </p>
        </div>
      </Card>

      <Card>
        <CardHeader title="Bank transfer details" description="Shown to customers who choose Bank Transfer, and on invoices" />
        <div className="p-5">
          <Field label="Bank details" htmlFor="bank_details" error={err('bank_details')} hint="One item per line (bank, account title, account number, IBAN…)">
            <Textarea id="bank_details" rows={6} value={values.bank_details} onChange={(e) => set('bank_details', e.target.value)} invalid={!!err('bank_details')} className="font-mono text-[13px]" />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Contact details" description="Shown in the header, footer, contact page and invoices" />
        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <Field label="WhatsApp number" htmlFor="whatsapp_number" required error={err('whatsapp_number')} hint="International format without + or spaces, e.g. 923216293333">
            <Input id="whatsapp_number" inputMode="numeric" value={values.whatsapp_number} onChange={(e) => set('whatsapp_number', e.target.value.replace(/[^\d]/g, ''))} invalid={!!err('whatsapp_number')} className="font-mono" />
          </Field>
          <Field label="Phone (as displayed)" htmlFor="contact_phone" required error={err('contact_phone')}>
            <Input id="contact_phone" value={values.contact_phone} onChange={(e) => set('contact_phone', e.target.value)} invalid={!!err('contact_phone')} />
          </Field>
          <Field label="Email" htmlFor="contact_email" required error={err('contact_email')}>
            <Input id="contact_email" type="email" value={values.contact_email} onChange={(e) => set('contact_email', e.target.value)} invalid={!!err('contact_email')} />
          </Field>
          <Field label="Address" htmlFor="contact_address" required error={err('contact_address')}>
            <Input id="contact_address" value={values.contact_address} onChange={(e) => set('contact_address', e.target.value)} invalid={!!err('contact_address')} />
          </Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Social media" description="Leave a link empty to hide that icon on the website" />
        <div className="grid gap-5 p-5 sm:grid-cols-2">
          {SOCIALS.map((s) => (
            <Field key={s.key} label={s.label} htmlFor={s.key} error={err(s.key)}>
              <Input id={s.key} type="url" value={values[s.key]} onChange={(e) => set(s.key, e.target.value)} invalid={!!err(s.key)} placeholder={s.placeholder} />
            </Field>
          ))}
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3">
        {dirty && <span className="text-sm font-semibold text-brand-primary">Unsaved changes</span>}
        <Button type="submit" loading={saving} disabled={!dirty}>
          {!saving && <Save className="h-4 w-4" aria-hidden />} Save settings
        </Button>
      </div>
    </form>
  );
}
