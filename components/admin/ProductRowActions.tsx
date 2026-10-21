'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { adminFetch } from '@/lib/admin/client';
import ConfirmDialog from './ConfirmDialog';
import { Toggle } from './ui';

type ToggleField = 'isFeatured' | 'isActive';

/** Featured / Active switch for one product. Flips immediately, rolls back if saving fails. */
export function ProductToggle({
  productId,
  field,
  initial,
  label,
}: {
  productId: string;
  field: ToggleField;
  initial: boolean;
  label: string;
}) {
  const toast = useToast();
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);

  const change = async (next: boolean) => {
    setValue(next); // "optimistic": show the new state right away
    setSaving(true);
    const res = await adminFetch(`/api/admin/products/${productId}`, { method: 'PATCH', body: { [field]: next } });
    setSaving(false);
    if (!res.ok) {
      setValue(!next); // roll back
      toast.error(res.error ?? 'Could not save');
      return;
    }
    router.refresh(); // update counts elsewhere on the page
  };

  return <Toggle checked={value} onChange={change} label={label} disabled={saving} size="sm" />;
}

/** Edit link + Delete button (with confirmation) for one product row. */
export function ProductRowActions({ productId, productName }: { productId: string; productName: string }) {
  const toast = useToast();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    setDeleting(true);
    const res = await adminFetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
    setDeleting(false);
    if (!res.ok) {
      toast.error(res.error ?? 'Could not delete');
      return;
    }
    setConfirming(false);
    toast.success(`"${productName}" was deleted`);
    router.refresh();
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/admin/products/${productId}`}
        className="rounded-lg p-2 text-brand-muted hover:bg-brand-tint hover:text-brand-secondary"
        aria-label={`Edit ${productName}`}
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg p-2 text-brand-muted hover:bg-[#FFF1F2] hover:text-brand-primary"
        aria-label={`Delete ${productName}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <ConfirmDialog
        open={confirming}
        title="Delete product?"
        confirmLabel="Delete product"
        loading={deleting}
        onConfirm={remove}
        onCancel={() => setConfirming(false)}
      >
        <p>
          <span className="font-semibold text-brand-ink">{productName}</span> will be removed from the shop and the admin
          panel. This can&apos;t be undone.
        </p>
        <p className="mt-2">Past orders keep their own copy of the name and price, so they are not affected.</p>
        <p className="mt-2">Tip: to hide a product temporarily, switch off &quot;Active&quot; instead.</p>
      </ConfirmDialog>
    </div>
  );
}
