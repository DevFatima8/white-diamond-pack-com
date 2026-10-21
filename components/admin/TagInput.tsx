'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Type a tag and press Enter or comma to add it. Backspace on an empty box removes the last tag. */
export default function TagInput({
  id,
  value,
  onChange,
  placeholder = 'Type and press Enter…',
  max = 30,
  invalid,
}: {
  id?: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  max?: number;
  invalid?: boolean;
}) {
  const [draft, setDraft] = useState('');

  // Adds one or more tags in a single update (skips empties and duplicates, respects `max`).
  const add = (...raw: string[]) => {
    const next = [...value];
    for (const r of raw) {
      const tag = r.trim().slice(0, 100);
      if (!tag || next.length >= max) continue;
      if (next.some((t) => t.toLowerCase() === tag.toLowerCase())) continue;
      next.push(tag);
    }
    if (next.length !== value.length) onChange(next);
  };

  return (
    <div
      className={cn(
        'flex min-h-11 flex-wrap items-center gap-2 rounded-xl border bg-white px-3 py-2 focus-within:border-brand-secondary focus-within:ring-[3px] focus-within:ring-brand-secondary/15',
        invalid ? 'border-brand-primary' : 'border-brand-border',
      )}
    >
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-brand-tint py-1 pl-3 pr-1.5 text-xs font-medium text-brand-secondary">
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="rounded-full p-0.5 hover:bg-brand-secondary/15"
            aria-label={`Remove ${tag}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => {
          // Pasting "a, b, c" adds three tags at once.
          if (e.target.value.includes(',')) {
            const parts = e.target.value.split(',');
            add(...parts.slice(0, -1));
            setDraft(parts.pop() ?? '');
          } else {
            setDraft(e.target.value);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault(); // don't submit the whole form
            add(draft);
            setDraft('');
          } else if (e.key === 'Backspace' && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => {
          add(draft);
          setDraft('');
        }}
        placeholder={value.length >= max ? `Max ${max} reached` : placeholder}
        disabled={value.length >= max}
        className="min-w-[140px] flex-1 border-0 bg-transparent py-1 text-sm focus:outline-none"
      />
    </div>
  );
}
