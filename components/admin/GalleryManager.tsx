'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Images, Trash2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { adminFetch } from '@/lib/admin/client';
import { GALLERY_GROUPS, GALLERY_GROUP_LABEL, type GalleryGroup, type GalleryItem } from '@/lib/gallery-types';
import { cn } from '@/lib/utils';
import ImageUploader from './ImageUploader';
import { Button, Card, CardHeader, EmptyState, Field, Input, Select } from './ui';

const newId = () => `g${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/**
 * Admin → Gallery: upload photos into Office / Production / Finished products,
 * add captions (English + optional Arabic), reorder, delete. "Save gallery" stores
 * the whole list; the About page shows it immediately.
 */
export default function GalleryManager({ initial }: { initial: GalleryItem[] }) {
  const router = useRouter();
  const toast = useToast();
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const [group, setGroup] = useState<GalleryGroup>('production');
  const [pending, setPending] = useState<string[]>([]); // uploaded, not yet added
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const change = (next: GalleryItem[]) => {
    setItems(next);
    setDirty(true);
  };
  const update = (id: string, patch: Partial<GalleryItem>) => change(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const remove = (id: string) => change(items.filter((it) => it.id !== id));
  const move = (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[index], next[j]] = [next[j], next[index]];
    change(next);
  };

  // Uploaded photos are added to the chosen group straight away
  const onUploaded = (urls: string[]) => {
    const fresh = urls.filter((u) => !items.some((it) => it.image === u));
    if (fresh.length) change([...items, ...fresh.map((image) => ({ id: newId(), image, caption: '', captionAr: '', group }))]);
    setPending([]);
  };

  const save = async () => {
    setSaving(true);
    const res = await adminFetch('/api/admin/gallery', { method: 'PUT', body: items });
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? 'Could not save the gallery');
      return;
    }
    setDirty(false);
    toast.success(`Gallery saved (${items.length} photos)`);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Add photos"
          description="Choose the group first, then upload. JPG, PNG or WebP. Photos appear on the About page under “Our plant & distribution network”."
        />
        <div className="grid gap-5 p-5 sm:grid-cols-[220px_1fr]">
          <Field label="Group" htmlFor="gallery-group">
            <Select id="gallery-group" value={group} onChange={(e) => setGroup(e.target.value as GalleryGroup)}>
              {GALLERY_GROUPS.map((g) => (
                <option key={g} value={g}>
                  {GALLERY_GROUP_LABEL[g]}
                </option>
              ))}
            </Select>
          </Field>
          <ImageUploader value={pending} onChange={onUploaded} folder="gallery" max={20} />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader
          title={`Photos (${items.length})`}
          description="The first photo of each group is shown large. Use the arrows to change the order."
          actions={
            <Button onClick={save} loading={saving} disabled={!dirty}>
              Save gallery
            </Button>
          }
        />
        {items.length === 0 ? (
          <EmptyState icon={<Images className="h-5 w-5" />} title="No photos yet">
            Until you add photos, the website shows the standard plant photos.
          </EmptyState>
        ) : (
          <ul className="divide-y divide-brand-border">
            {items.map((it, i) => (
              <li key={it.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-brand-surface sm:w-36">
                  <Image src={it.image} alt="" fill sizes="144px" className="object-cover" />
                </div>
                <div className="grid flex-1 gap-3 sm:grid-cols-3">
                  <Field label="Group" htmlFor={`g-${it.id}`}>
                    <Select id={`g-${it.id}`} value={it.group} onChange={(e) => update(it.id, { group: e.target.value as GalleryGroup })}>
                      {GALLERY_GROUPS.map((g) => (
                        <option key={g} value={g}>
                          {GALLERY_GROUP_LABEL[g]}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Caption (English)" htmlFor={`c-${it.id}`}>
                    <Input id={`c-${it.id}`} value={it.caption} maxLength={120} placeholder="e.g. Foil rewinding line" onChange={(e) => update(it.id, { caption: e.target.value })} />
                  </Field>
                  <Field label="Caption (Arabic, optional)" htmlFor={`a-${it.id}`}>
                    <Input id={`a-${it.id}`} dir="rtl" value={it.captionAr} maxLength={120} onChange={(e) => update(it.id, { captionAr: e.target.value })} />
                  </Field>
                </div>
                <div className="flex shrink-0 gap-1 self-end sm:self-center">
                  <Button variant="ghost" size="sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                    <ArrowUp className="h-4 w-4" aria-hidden />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">
                    <ArrowDown className="h-4 w-4" aria-hidden />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => remove(it.id)} aria-label="Delete photo">
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {dirty && (
          <p className={cn('border-t border-brand-border bg-brand-tint px-5 py-3 text-sm text-brand-secondary')}>
            You have unsaved changes — click “Save gallery”.
          </p>
        )}
      </Card>
    </div>
  );
}
