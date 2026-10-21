'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Save } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '@/context/ToastContext';
import { adminFetch, type FieldErrors } from '@/lib/admin/client';
import { slugify } from '@/lib/slug';
import { productFormSchema, type ProductFormInput } from '@/lib/validation/product';
import ImageUploader from './ImageUploader';
import TagInput from './TagInput';
import { Button, ButtonLink, Card, CardHeader, Field, Input, Select, Textarea, Toggle } from './ui';

/**
 * What the form holds while editing. Number fields are kept as TEXT (exactly what
 * the admin typed) and converted to numbers only when saving — otherwise clearing
 * a number box would turn it into 0.
 */
export interface ProductFormValues {
  name: string;
  nameAr: string;
  slug: string;
  sku: string;
  categoryId: string;
  description: string;
  descriptionAr: string;
  images: string[];
  price: string;
  salePrice: string;
  unit: string;
  packing: string;
  capacity: string;
  material: string;
  color: string;
  features: string[];
  stockQty: string;
  minOrderQty: string;
  isFeatured: boolean;
  isActive: boolean;
}

export const EMPTY_PRODUCT: ProductFormValues = {
  name: '',
  nameAr: '',
  slug: '',
  sku: '',
  categoryId: '',
  description: '',
  descriptionAr: '',
  images: [],
  price: '',
  salePrice: '',
  unit: 'carton',
  packing: '',
  capacity: '',
  material: '',
  color: '',
  features: [],
  stockQty: '',
  minOrderQty: '1',
  isFeatured: false,
  isActive: true,
};

const UNITS = ['carton', 'pack', 'bundle', 'box', 'roll', 'piece', 'kg'];

/** "" → null, "12" → 12, "abc" → NaN (zod then reports "must be a number"). */
const toNumberOrNull = (s: string) => (s.trim() === '' ? null : Number(s));

function toPayload(v: ProductFormValues): ProductFormInput {
  return {
    ...v,
    price: Number(v.price.trim() === '' ? NaN : v.price),
    salePrice: toNumberOrNull(v.salePrice),
    stockQty: toNumberOrNull(v.stockQty),
    minOrderQty: Number(v.minOrderQty.trim() === '' ? NaN : v.minOrderQty),
  };
}

export default function ProductForm({
  mode,
  productId,
  initial,
  categories,
}: {
  mode: 'create' | 'edit';
  productId?: string;
  initial: ProductFormValues;
  categories: { id: string; nameEn: string; isActive: boolean }[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState(initial);
  const [saved, setSaved] = useState(initial); // last saved version, to detect unsaved changes
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  // New products: the slug follows the name until the admin edits the slug themselves.
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');

  const dirty = useMemo(() => JSON.stringify(values) !== JSON.stringify(saved), [values, saved]);

  // Warn before closing the tab / reloading with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onNameChange = (name: string) => {
    setValues((v) => ({ ...v, name, slug: slugTouched ? v.slug : slugify(name) }));
    if (errors.name || errors.slug) setErrors((e) => ({ ...e, name: undefined, slug: undefined }));
  };

  const err = (key: keyof ProductFormValues) => errors[key]?.[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = toPayload(values);

    // 1. Check in the browser first, for instant feedback.
    const check = productFormSchema.safeParse(payload);
    if (!check.success) {
      setErrors(z.flattenError(check.error).fieldErrors);
      toast.error('Please fix the highlighted fields');
      document.querySelector('[aria-invalid="true"], [data-field-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // 2. Save. The server validates again — that's the check that really protects the data.
    setSaving(true);
    const res = await adminFetch<{ id: string }>(mode === 'create' ? '/api/admin/products' : `/api/admin/products/${productId}`, {
      method: mode === 'create' ? 'POST' : 'PUT',
      body: payload,
    });
    setSaving(false);

    if (!res.ok) {
      if (res.fieldErrors) setErrors(res.fieldErrors);
      toast.error(res.error ?? 'Could not save the product');
      return;
    }

    setSaved(values);
    if (mode === 'create') {
      toast.success(`"${values.name}" was added`);
      router.push('/admin/products');
    } else {
      toast.success('Changes saved');
      router.refresh();
    }
  };

  return (
    <form onSubmit={submit} noValidate className="pb-24">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Main column ── */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Basic information" description="Name, web address and category" />
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <Field label="Product name (English)" htmlFor="name" required error={err('name')} className="sm:col-span-2">
                <Input id="name" value={values.name} onChange={(e) => onNameChange(e.target.value)} invalid={!!err('name')} placeholder="e.g. Foil Container 450ml with Lid" />
              </Field>
              <Field label="Product name (Arabic)" htmlFor="nameAr" error={err('nameAr')} className="sm:col-span-2">
                <Input id="nameAr" dir="rtl" lang="ar" value={values.nameAr} onChange={(e) => set('nameAr', e.target.value)} invalid={!!err('nameAr')} className="font-[family-name:var(--font-arabic)]" />
              </Field>
              <Field
                label="URL slug"
                htmlFor="slug"
                required
                error={err('slug')}
                hint={<>Shop address: /product/<span className="font-mono">{values.slug || '…'}</span></>}
              >
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    value={values.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set('slug', e.target.value.toLowerCase());
                    }}
                    invalid={!!err('slug')}
                    className="font-mono"
                  />
                  <Button
                    variant="secondary"
                    className="h-11 w-11 shrink-0 px-0"
                    onClick={() => set('slug', slugify(values.name))}
                    aria-label="Generate slug from name"
                    title="Generate from name"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </Field>
              <Field label="SKU" htmlFor="sku" error={err('sku')} hint="Optional, must be unique">
                <Input id="sku" value={values.sku} onChange={(e) => set('sku', e.target.value.toUpperCase())} invalid={!!err('sku')} className="font-mono" placeholder="WD-FC-450" />
              </Field>
              <Field label="Category" htmlFor="categoryId" required error={err('categoryId')} className="sm:col-span-2">
                <Select id="categoryId" value={values.categoryId} onChange={(e) => set('categoryId', e.target.value)} invalid={!!err('categoryId')}>
                  <option value="">Choose a category…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameEn}
                      {c.isActive ? '' : ' (hidden)'}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Description" description="Shown on the product page" />
            <div className="space-y-5 p-5">
              <Field label="Description (English)" htmlFor="description" required error={err('description')}>
                <Textarea id="description" value={values.description} onChange={(e) => set('description', e.target.value)} invalid={!!err('description')} rows={5} />
              </Field>
              <Field label="Description (Arabic)" htmlFor="descriptionAr" error={err('descriptionAr')}>
                <Textarea id="descriptionAr" dir="rtl" lang="ar" value={values.descriptionAr} onChange={(e) => set('descriptionAr', e.target.value)} invalid={!!err('descriptionAr')} rows={5} className="font-[family-name:var(--font-arabic)]" />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Images" description="The first image is the main image. Hover an image to make it main or remove it." />
            <div className="p-5">
              <ImageUploader value={values.images} onChange={(imgs) => set('images', imgs)} folder="products" invalid={!!err('images')} />
              {err('images') && (
                <p className="mt-2 text-xs font-medium text-brand-primary" role="alert" data-field-error>
                  {err('images')}
                </p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Specifications" description="Packing and technical details" />
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <Field label="Packing" htmlFor="packing" required error={err('packing')} hint="e.g. 500 sets / carton">
                <Input id="packing" value={values.packing} onChange={(e) => set('packing', e.target.value)} invalid={!!err('packing')} />
              </Field>
              <Field label="Sold per (unit)" htmlFor="unit" required error={err('unit')} hint="Price is per this unit">
                <Input id="unit" list="unit-options" value={values.unit} onChange={(e) => set('unit', e.target.value)} invalid={!!err('unit')} />
                <datalist id="unit-options">
                  {UNITS.map((u) => (
                    <option key={u} value={u} />
                  ))}
                </datalist>
              </Field>
              <Field label="Capacity / size" htmlFor="capacity" error={err('capacity')}>
                <Input id="capacity" value={values.capacity} onChange={(e) => set('capacity', e.target.value)} placeholder="e.g. 450 ml" />
              </Field>
              <Field label="Material" htmlFor="material" error={err('material')}>
                <Input id="material" value={values.material} onChange={(e) => set('material', e.target.value)} placeholder="e.g. Aluminium alloy 8011" />
              </Field>
              <Field label="Colour" htmlFor="color" error={err('color')}>
                <Input id="color" value={values.color} onChange={(e) => set('color', e.target.value)} placeholder="e.g. Silver" />
              </Field>
              <Field label="Features" htmlFor="features" error={err('features')} hint="Press Enter after each one" className="sm:col-span-2">
                <TagInput id="features" value={values.features} onChange={(f) => set('features', f)} invalid={!!err('features')} placeholder="e.g. Oven safe" />
              </Field>
            </div>
          </Card>
        </div>

        {/* ── Side column ── */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Pricing" description="Whole rupees (PKR)" />
            <div className="space-y-5 p-5">
              <Field label={`Price per ${values.unit || 'unit'}`} htmlFor="price" required error={err('price')}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-muted">Rs</span>
                  <Input id="price" inputMode="numeric" value={values.price} onChange={(e) => set('price', e.target.value.replace(/[^\d]/g, ''))} invalid={!!err('price')} className="pl-11 text-base font-semibold tabular-nums" />
                </div>
              </Field>
              <Field label="Sale price" htmlFor="salePrice" error={err('salePrice')} hint="Optional — leave empty for no discount">
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-muted">Rs</span>
                  <Input id="salePrice" inputMode="numeric" value={values.salePrice} onChange={(e) => set('salePrice', e.target.value.replace(/[^\d]/g, ''))} invalid={!!err('salePrice')} className="pl-11 tabular-nums" />
                </div>
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Stock & ordering" />
            <div className="space-y-5 p-5">
              <Field label="Stock quantity" htmlFor="stockQty" error={err('stockQty')} hint="Leave empty if you don't track stock">
                <Input id="stockQty" inputMode="numeric" value={values.stockQty} onChange={(e) => set('stockQty', e.target.value.replace(/[^\d]/g, ''))} invalid={!!err('stockQty')} className="tabular-nums" />
              </Field>
              <Field label="Minimum order quantity" htmlFor="minOrderQty" required error={err('minOrderQty')}>
                <Input id="minOrderQty" inputMode="numeric" value={values.minOrderQty} onChange={(e) => set('minOrderQty', e.target.value.replace(/[^\d]/g, ''))} invalid={!!err('minOrderQty')} className="tabular-nums" />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Visibility" />
            <div className="divide-y divide-brand-border">
              <div className="flex items-center justify-between gap-4 p-5">
                <div>
                  <div className="text-sm font-semibold">Active</div>
                  <div className="text-xs text-brand-muted">Visible in the shop</div>
                </div>
                <Toggle checked={values.isActive} onChange={(v) => set('isActive', v)} label="Active" />
              </div>
              <div className="flex items-center justify-between gap-4 p-5">
                <div>
                  <div className="text-sm font-semibold">Featured</div>
                  <div className="text-xs text-brand-muted">Shown in “Best Selling” on the homepage</div>
                </div>
                <Toggle checked={values.isFeatured} onChange={(v) => set('isFeatured', v)} label="Featured" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-brand-border bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-sm text-brand-muted" aria-live="polite">
            {dirty ? (
              <span className="inline-flex items-center gap-2 font-semibold text-brand-primary">
                <span className="h-2 w-2 rounded-full bg-brand-primary" /> Unsaved changes
              </span>
            ) : mode === 'edit' ? (
              'All changes saved'
            ) : (
              'New product'
            )}
          </p>
          <div className="flex gap-2">
            <ButtonLink href="/admin/products" variant="secondary">
              {dirty ? 'Discard' : 'Back'}
            </ButtonLink>
            <Button type="submit" loading={saving} disabled={mode === 'edit' && !dirty}>
              {!saving && <Save className="h-4 w-4" aria-hidden />}
              {mode === 'create' ? 'Create product' : 'Save changes'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
