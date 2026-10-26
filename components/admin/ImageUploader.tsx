'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Loader2, Star, Trash2, UploadCloud } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024; // must match /api/admin/upload

interface Uploading {
  id: string;
  preview: string; // local blob: URL shown while the real upload runs
}

/** Upload one file to Cloudinary through our API. Returns the image URL. */
async function uploadFile(file: File, folder: 'products' | 'categories' | 'gallery'): Promise<string> {
  const body = new FormData();
  body.append('file', file);
  const res = await fetch(`/api/admin/upload?folder=${folder}`, { method: 'POST', body });
  if (res.status === 401) {
    window.location.href = `/admin/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
    throw new Error('Session expired');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.url) throw new Error(json.error || 'Upload failed');
  return json.url as string;
}

/**
 * Image gallery editor: drag & drop or browse, preview, remove, and "set as main".
 * The first image in the list is the main image (shown on product cards).
 */
export default function ImageUploader({
  value,
  onChange,
  folder,
  max = 10,
  invalid,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  folder: 'products' | 'categories' | 'gallery';
  max?: number;
  invalid?: boolean;
}) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState<Uploading[]>([]);
  // Keep the latest list in a ref: uploads finish one by one, after `value` has gone stale.
  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  }, [value]);

  const single = max === 1;
  const room = max - value.length - uploading.length;

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    let files = Array.from(fileList);

    const rejected = files.filter((f) => !ALLOWED.includes(f.type) || f.size > MAX_BYTES);
    if (rejected.length) {
      toast.error(`${rejected.map((f) => f.name).join(', ')}: only JPG, PNG or WEBP up to 5 MB`);
      files = files.filter((f) => !rejected.includes(f));
    }
    if (!single && files.length > room) {
      toast.warning(`Only ${Math.max(room, 0)} more image(s) allowed (max ${max})`);
      files = files.slice(0, Math.max(room, 0));
    }
    if (single) files = files.slice(0, 1);
    if (!files.length) return;

    // Upload one after another so the order stays as chosen.
    for (const file of files) {
      const item = { id: crypto.randomUUID(), preview: URL.createObjectURL(file) };
      setUploading((u) => [...u, item]);
      try {
        const url = await uploadFile(file, folder);
        onChange(single ? [url] : [...latest.current, url]);
      } catch (err) {
        toast.error(`${file.name}: ${err instanceof Error ? err.message : 'upload failed'}`);
      } finally {
        URL.revokeObjectURL(item.preview);
        setUploading((u) => u.filter((x) => x.id !== item.id));
      }
    }
  };

  const remove = (url: string) => onChange(value.filter((v) => v !== url));
  const makeMain = (url: string) => onChange([url, ...value.filter((v) => v !== url)]);

  return (
    <div>
      {(room > 0 || single) && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            'flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors',
            dragging ? 'border-brand-secondary bg-brand-tint' : invalid ? 'border-brand-primary/60 bg-[#FDECEC]/40' : 'border-brand-border bg-brand-surface',
          )}
        >
          <div className="mb-3 rounded-full bg-white p-3 text-brand-secondary shadow-level-1">
            <UploadCloud className="h-6 w-6" aria-hidden />
          </div>
          <p className="text-sm font-semibold text-brand-ink">Drag & drop {single ? 'an image' : 'images'} here</p>
          <p className="mt-1 text-xs text-brand-muted">JPG, PNG or WEBP · up to 5 MB{single ? '' : ` · max ${max} images`}</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2 text-sm font-semibold text-brand-navy hover:border-brand-secondary hover:bg-brand-tint"
          >
            <ImagePlus className="h-4 w-4" aria-hidden /> Browse files
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED.join(',')}
            multiple={!single}
            className="sr-only"
            onChange={(e) => {
              void handleFiles(e.target.files);
              e.target.value = ''; // allow choosing the same file again
            }}
          />
        </div>
      )}

      {(value.length > 0 || uploading.length > 0) && (
        <ul className={cn('mt-4 grid gap-3', single ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4')}>
          {value.map((url, i) => (
            <li key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-brand-border bg-brand-surface">
              <Image src={url} alt={`Image ${i + 1}`} fill sizes="200px" className="object-cover" />
              {i === 0 && !single && (
                <span className="absolute left-2 top-2 rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  Main
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-brand-navy-dark/70 to-transparent p-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => makeMain(url)}
                    className="rounded-lg bg-white/90 p-1.5 text-brand-navy hover:bg-white"
                    aria-label={`Make image ${i + 1} the main image`}
                    title="Set as main image"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(url)}
                  className="rounded-lg bg-white/90 p-1.5 text-brand-primary hover:bg-white"
                  aria-label={`Remove image ${i + 1}`}
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
          {uploading.map((u) => (
            <li key={u.id} className="relative aspect-square overflow-hidden rounded-xl border border-brand-border bg-brand-surface">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob: preview, next/image can't load it */}
              <img src={u.preview} alt="" className="h-full w-full object-cover opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-brand-secondary" aria-label="Uploading" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
