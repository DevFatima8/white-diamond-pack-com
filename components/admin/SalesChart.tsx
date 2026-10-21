'use client';

import { useState } from 'react';
import { cn, formatPrice } from '@/lib/utils';

export interface DailySales {
  day: string; // "YYYY-MM-DD" (PKT)
  label: string; // "21 Oct"
  revenue: number; // PKR
  orders: number;
}

/** 12500 → "12.5K", 1250000 → "1.3M" (axis ticks only). */
function compact(n: number): string {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${+(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/** A "nice" axis maximum: 0–37,300 → 40,000, so ticks land on round numbers. */
function niceMax(value: number): number {
  if (value <= 0) return 1000;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * magnitude >= value)! * magnitude;
  return step;
}

/**
 * Daily revenue as columns (one series → one colour, no legend; the card title names it).
 * Built with plain HTML/CSS so it stretches to any width. Spec (dataviz skill):
 * bars ≤ 24px with 4px rounded tops and a 2px gap, 1px solid recessive gridlines,
 * a tooltip per bar on hover AND keyboard focus, and a table view so no value is hover-only.
 */
export default function SalesChart({ data }: { data: DailySales[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  const max = niceMax(Math.max(...data.map((d) => d.revenue)));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));
  const best = data.reduce((iBest, d, i) => (d.revenue > data[iBest].revenue ? i : iBest), 0);
  const hasSales = data.some((d) => d.revenue > 0);

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="text-xs font-semibold text-brand-secondary hover:underline"
          aria-expanded={showTable}
        >
          {showTable ? 'View as chart' : 'View as table'}
        </button>
      </div>

      {showTable ? (
        <div className="max-h-[260px] overflow-y-auto rounded-lg border border-brand-border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-brand-surface text-left text-xs text-brand-muted">
              <tr>
                <th className="px-3 py-2 font-semibold">Day</th>
                <th className="px-3 py-2 text-right font-semibold">Orders</th>
                <th className="px-3 py-2 text-right font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {[...data].reverse().map((d) => (
                <tr key={d.day} className="border-t border-brand-border">
                  <td className="px-3 py-1.5">{d.label}</td>
                  <td className="px-3 py-1.5 text-right">{d.orders}</td>
                  <td className="px-3 py-1.5 text-right">{formatPrice(d.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex gap-2">
          {/* Y axis */}
          <div className="relative h-[220px] w-11 shrink-0 text-right text-[11px] tabular-nums text-brand-muted" aria-hidden>
            {ticks.map((t) => (
              // `bottom` puts the label's bottom edge on the gridline; +50% moves it down so it's centred on it.
              <span key={t} className="absolute right-0 translate-y-1/2" style={{ bottom: `${(t / max) * 100}%` }}>
                {compact(t)}
              </span>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <div className="relative h-[220px]">
              {/* Gridlines: 1px, solid, one step off the surface */}
              {ticks.map((t) => (
                <div key={t} className="absolute inset-x-0 h-px bg-brand-border" style={{ bottom: `${(t / max) * 100}%` }} aria-hidden />
              ))}

              {!hasSales && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-brand-muted">
                  No sales in the last 30 days yet
                </div>
              )}

              {/* Columns */}
              <div className="absolute inset-0 flex items-end gap-[2px]" role="list" aria-label="Revenue per day">
                {data.map((d, i) => {
                  const pct = (d.revenue / max) * 100;
                  const isActive = active === i;
                  return (
                    <button
                      key={d.day}
                      type="button"
                      role="listitem"
                      aria-label={`${d.label}: ${formatPrice(d.revenue)} from ${d.orders} order${d.orders === 1 ? '' : 's'}`}
                      onPointerEnter={() => setActive(i)}
                      onPointerLeave={() => setActive((a) => (a === i ? null : a))}
                      onFocus={() => setActive(i)}
                      onBlur={() => setActive((a) => (a === i ? null : a))}
                      // The hit target is the whole column height, not just the painted bar.
                      className="group relative flex h-full flex-1 items-end justify-center focus-visible:outline-none"
                    >
                      <span
                        className={cn(
                          'block w-full max-w-[24px] rounded-t-[4px] transition-colors',
                          isActive ? 'bg-brand-secondary-hover' : 'bg-brand-secondary',
                          'group-focus-visible:ring-2 group-focus-visible:ring-brand-secondary/40 group-focus-visible:ring-offset-2',
                        )}
                        style={{ height: d.revenue > 0 ? `max(${pct}%, 2px)` : 0 }}
                      />
                      {/* Direct label on the single best day only */}
                      {i === best && d.revenue > 0 && !isActive && (
                        <span
                          className="pointer-events-none absolute whitespace-nowrap text-[11px] font-semibold tabular-nums text-brand-ink"
                          style={{ bottom: `calc(${pct}% + 4px)` }}
                        >
                          {compact(d.revenue)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tooltip: value first (strong), date second */}
              {active !== null && (
                <div
                  className={cn(
                    'pointer-events-none absolute z-10 rounded-lg bg-brand-navy-dark px-3 py-2 text-white shadow-level-3',
                    // Near the edges, anchor the tooltip so it stays inside the card.
                    active < 4 ? 'translate-x-0' : active > data.length - 5 ? '-translate-x-full' : '-translate-x-1/2',
                  )}
                  style={{
                    left: `${((active + 0.5) / data.length) * 100}%`,
                    bottom: `calc(${Math.min((data[active].revenue / max) * 100, 78)}% + 10px)`,
                  }}
                  role="status"
                >
                  <div className="font-heading text-sm font-semibold tabular-nums">{formatPrice(data[active].revenue)}</div>
                  <div className="whitespace-nowrap text-[11px] text-white/70">
                    {data[active].label} · {data[active].orders} order{data[active].orders === 1 ? '' : 's'}
                  </div>
                </div>
              )}
            </div>

            {/* X axis: first, middle and last day only, so labels never collide */}
            <div className="mt-2 flex justify-between text-[11px] text-brand-muted" aria-hidden>
              <span>{data[0]?.label}</span>
              <span>{data[Math.floor(data.length / 2)]?.label}</span>
              <span>{data[data.length - 1]?.label}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
