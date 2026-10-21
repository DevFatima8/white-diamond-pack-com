'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, FolderTree, Pencil, Plus } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '@/context/ToastContext';
import { adminFetch, type FieldErrors } from '@/lib/admin/client';
import { slugify } from '@/lib/slug';
import { categoryFormSchema } from '@/lib/validation/admin';
import Modal from '@/components/ui/Modal';
import ImageUploader from './ImageUploader';
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, Textarea, Toggle } from './ui';

export interface CategoryRow {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  image: string | null;
  isActive: boolean;
  productCount: number;
}

interface FormValues {
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string | null;
  isActive: boolean;
}

const EMPTY: FormValues = { nameEn: '', nameAr: '', slug: '', descriptionEn: '', descriptionAr: '', image: null, isActive: true };

export default function CategoriesManager({ initial }: { initial: CategoryRow[] }) {
  const router = useRouter();
  const toast = useToast();
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState<CategoryRow | 'new' | null>(null);
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const openNew = () => {
    setValues(EMPTY);
    setErrors({});
    setSlugTouched(false);
    setEditing('new');
  };

  const openEdit = (row: CategoryRow) => {
    setValues({
      nameEn: row.nameEn,
      nameAr: row.nameAr,
      slug: row.slug,
      descriptionEn: row.descriptionEn ?? '',
      descriptionAr: row.descriptionAr ?? '',
      image: row.image,
      isActive: row.isActive,
    });
    setErrors({});
    setSlugTouched(true); // never change an existing slug automatically (it's in shop URLs)
    setEditing(row);
  };

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = categoryFormSchema.safeParse(values);
    if (!check.success) {
      setErrors(z.flattenError(check.error).fieldErrors);
      return;
    }
    setSaving(true);
    const isNew = editing === 'new';
    const res = await adminFetch<CategoryRow>(isNew ? '/api/admin/categories' : `/api/admin/categories/${(editing as CategoryRow).id}`, {
      method: isNew ? 'POST' : 'PUT',
      body: values,
    });
    setSaving(false);
    if (!res.ok) {
      if (res.fieldErrors) setErrors(res.fieldErrors);
      toast.error(res.error ?? 'Could not save the category');
      return;
    }
    toast.success(isNew ? `Category "${values.nameEn}" added` : 'Category saved');
    setEditing(null);
    router.refresh();
    // Update the list right away (the refresh brings fresh product counts a moment later).
    const saved = res.data!;
    setRows((r) =>
      isNew
        ? [...r, { ...saved, productCount: 0 }]
        : r.map((row) => (row.id === saved.id ? { ...row, ...saved } : row)),
    );
  };

  const toggleActive = async (row: CategoryRow, isActive: boolean) => {
    setRows((r) => r.map((x) => (x.id === row.id ? { ...x, isActive } : x)));
    const res = await adminFetch(`/api/admin/categories/${row.id}`, { method: 'PATCH', body: { isActive } });
    if (!res.ok) {
      setRows((r) => r.map((x) => (x.id === row.id ? { ...x, isActive: !isActive } : x)));
      toast.error(res.error ?? 'Could not update');
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const before = rows;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next); // show the new order immediately
    const res = await adminFetch('/api/admin/categories/reorder', { method: 'POST', body: { ids: next.map((r) => r.id) } });
    if (!res.ok) {
      setRows(before); // put it back
      toast.error(res.error ?? 'Could not save the new order');
    }
  };

  const err = (key: keyof FormValues) => errors[key]?.[0];

  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Categories"
        description="Use the arrows to change the order in the shop menu. Hidden categories disappear from the shop."
        actions={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" aria-hidden /> Add category
          </Button>
        }
      />

      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState icon={<FolderTree className="h-5 w-5" />} title="No categories yet">
            Add a category, then assign products to it.
          </EmptyState>
        ) : (
          <ul className="divide-y divide-brand-border">
            {rows.map((row, i) => (
              <li key={row.id} className={`flex items-center gap-3 px-4 py-3 sm:gap-4 ${row.isActive ? '' : 'bg-brand-surface/60'}`}>
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded p-1 text-brand-muted hover:bg-brand-tint hover:text-brand-secondary disabled:opacity-25"
                    aria-label={`Move ${row.nameEn} up`}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === rows.length - 1}
                    className="rounded p-1 text-brand-muted hover:bg-brand-tint hover:text-brand-secondary disabled:opacity-25"
                    aria-label={`Move ${row.nameEn} down`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-brand-border bg-brand-surface">
                  <Image src={row.image || '/images/product-placeholder.png'} alt="" fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-semibold ${row.isActive ? 'text-brand-ink' : 'text-brand-muted'}`}>{row.nameEn}</span>
                    <span dir="rtl" lang="ar" className="text-sm text-brand-muted">
                      {row.nameAr}
                    </span>
                    {!row.isActive && <Badge className="bg-slate-100 text-brand-muted">Hidden</Badge>}
                  </div>
                  <div className="text-xs text-brand-muted">
                    <span className="font-mono">/{row.slug}</span> · {row.productCount} product{row.productCount === 1 ? '' : 's'}
                  </div>
                </div>
                <Toggle checked={row.isActive} onChange={(v) => toggleActive(row, v)} label={`Show ${row.nameEn} in shop`} size="sm" />
                <button
                  type="button"
                  onClick={() => openEdit(row)}
                  className="rounded-lg p-2 text-brand-muted hover:bg-brand-tint hover:text-brand-secondary"
                  aria-label={`Edit ${row.nameEn}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal
        isOpen={editing !== null}
        onClose={() => !saving && setEditing(null)}
        title={editing === 'new' ? 'Add category' : 'Edit category'}
        size="lg"
      >
        <form onSubmit={save} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name (English)" htmlFor="c-nameEn" required error={err('nameEn')}>
              <Input
                id="c-nameEn"
                value={values.nameEn}
                onChange={(e) => {
                  const nameEn = e.target.value;
                  setValues((v) => ({ ...v, nameEn, slug: slugTouched ? v.slug : slugify(nameEn, 120) }));
                  setErrors((x) => ({ ...x, nameEn: undefined, slug: undefined }));
                }}
                invalid={!!err('nameEn')}
              />
            </Field>
            <Field label="Name (Arabic)" htmlFor="c-nameAr" required error={err('nameAr')}>
              <Input id="c-nameAr" dir="rtl" lang="ar" value={values.nameAr} onChange={(e) => set('nameAr', e.target.value)} invalid={!!err('nameAr')} />
            </Field>
            <Field label="URL slug" htmlFor="c-slug" required error={err('slug')} hint={<>Shop address: /category/<span className="font-mono">{values.slug || '…'}</span></>} className="sm:col-span-2">
              <Input
                id="c-slug"
                value={values.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set('slug', e.target.value.toLowerCase());
                }}
                invalid={!!err('slug')}
                className="font-mono"
              />
            </Field>
            <Field label="Description (English)" htmlFor="c-descEn" error={err('descriptionEn')}>
              <Textarea id="c-descEn" rows={3} value={values.descriptionEn} onChange={(e) => set('descriptionEn', e.target.value)} />
            </Field>
            <Field label="Description (Arabic)" htmlFor="c-descAr" error={err('descriptionAr')}>
              <Textarea id="c-descAr" rows={3} dir="rtl" lang="ar" value={values.descriptionAr} onChange={(e) => set('descriptionAr', e.target.value)} />
            </Field>
          </div>

          <Field label="Image" error={err('image')}>
            <ImageUploader value={values.image ? [values.image] : []} onChange={(imgs) => set('image', imgs[0] ?? null)} folder="categories" max={1} />
          </Field>

          <div className="flex items-center justify-between rounded-xl border border-brand-border p-4">
            <div>
              <div className="text-sm font-semibold">Show in shop</div>
              <div className="text-xs text-brand-muted">Hidden categories don&apos;t appear in the menu or filters</div>
            </div>
            <Toggle checked={values.isActive} onChange={(v) => set('isActive', v)} label="Show in shop" />
          </div>

          <div className="flex justify-end gap-2 border-t border-brand-border pt-5">
            <Button variant="secondary" onClick={() => setEditing(null)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing === 'new' ? 'Add category' : 'Save category'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
