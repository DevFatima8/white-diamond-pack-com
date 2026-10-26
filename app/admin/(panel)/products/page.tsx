import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { Prisma } from '@prisma/client';
import { Package, Plus, Search, Star } from 'lucide-react';
import db from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { Badge, ButtonLink, Card, EmptyState, Input, PageHeader, buttonClass } from '@/components/admin/ui';
import AutoSubmitSelect from '@/components/admin/AutoSubmitSelect';
import Pagination, { parsePage } from '@/components/admin/Pagination';
import { ProductRowActions, ProductToggle } from '@/components/admin/ProductRowActions';

export const metadata: Metadata = { title: 'Products' };

const PAGE_SIZE = 20;
const LOW_STOCK = 20;
const PLACEHOLDER = '/images/product-placeholder.png';

type SearchParams = Promise<{ q?: string; category?: string; status?: string; page?: string }>;

const STATUS_FILTERS: Record<string, { label: string; where: Prisma.ProductWhereInput }> = {
  active: { label: 'Active', where: { isActive: true } },
  hidden: { label: 'Hidden (inactive)', where: { isActive: false } },
  featured: { label: 'Featured', where: { isFeatured: true } },
  low: { label: `Low stock (≤ ${LOW_STOCK})`, where: { stockQty: { not: null, lte: LOW_STOCK } } },
};

function StockCell({ stockQty, unit }: { stockQty: number | null; unit: string }) {
  if (stockQty === null) return <span className="text-xs text-brand-muted">Not tracked</span>;
  if (stockQty === 0) return <Badge className="bg-[#FDECEC] text-brand-primary ring-1 ring-brand-primary/25">Out of stock</Badge>;
  if (stockQty <= LOW_STOCK)
    return (
      <Badge className="bg-[#FDECEC] text-brand-primary">
        Low · {stockQty} {unit}s
      </Badge>
    );
  return (
    <span className="text-sm tabular-nums text-brand-ink">
      {stockQty.toLocaleString('en-US')} <span className="text-xs text-brand-muted">{unit}s</span>
    </span>
  );
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const { q = '', category = '', status = '', page: pageParam } = await searchParams;
  const query = q.trim().slice(0, 100);

  // Build the database filter from the URL.
  const where: Prisma.ProductWhereInput = {};
  if (query) {
    where.OR = [{ name: { contains: query } }, { sku: { contains: query } }, { slug: { contains: query } }, { nameAr: { contains: query } }];
  }
  if (category === 'none') where.categoryId = null;
  else if (category) where.categoryId = category;
  if (STATUS_FILTERS[status]) Object.assign(where, STATUS_FILTERS[status].where);

  const total = await db.product.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(parsePage(pageParam), pageCount);

  const [products, categories, counts] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { categoryRef: { select: { nameEn: true } } },
    }),
    db.category.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, nameEn: true } }),
    db.product.groupBy({ by: ['isActive'], _count: true }),
  ]);
  const activeCount = counts.find((c) => c.isActive)?._count ?? 0;
  const hiddenCount = counts.find((c) => !c.isActive)?._count ?? 0;
  const filtered = Boolean(query || category || status);

  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Products"
        description={`${activeCount} active · ${hiddenCount} hidden`}
        actions={
          <ButtonLink href="/admin/products/new">
            <Plus className="h-4 w-4" aria-hidden /> Add product
          </ButtonLink>
        }
      />

      <Card className="overflow-hidden">
        {/* Filters: a plain GET form → the filters live in the URL */}
        <form method="GET" className="flex flex-col gap-3 border-b border-brand-border p-4 md:flex-row md:items-center" role="search">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <Input name="q" type="search" defaultValue={query} placeholder="Search by name, SKU or slug…" className="pl-10" aria-label="Search products" />
          </div>
          <AutoSubmitSelect name="category" defaultValue={category} className="md:w-56" aria-label="Category">
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameEn}
              </option>
            ))}
            <option value="none">— No category —</option>
          </AutoSubmitSelect>
          <AutoSubmitSelect name="status" defaultValue={status} className="md:w-48" aria-label="Status">
            <option value="">Any status</option>
            {Object.entries(STATUS_FILTERS).map(([key, f]) => (
              <option key={key} value={key}>
                {f.label}
              </option>
            ))}
          </AutoSubmitSelect>
          <div className="flex gap-2">
            <button type="submit" className={buttonClass({ variant: 'navy' })}>
              Filter
            </button>
            {filtered && (
              <Link href="/admin/products" className={buttonClass({ variant: 'ghost' })}>
                Clear
              </Link>
            )}
          </div>
        </form>

        {products.length === 0 ? (
          <EmptyState icon={<Package className="h-5 w-5" />} title={filtered ? 'No products match these filters' : 'No products yet'}>
            {filtered ? 'Try a different search or clear the filters.' : 'Add your first product to start selling.'}
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead className="bg-brand-surface text-left text-[11px] uppercase tracking-wider text-brand-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 text-right font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 text-center font-semibold">Featured</th>
                  <th className="px-4 py-3 text-center font-semibold">Active</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {products.map((p) => (
                  <tr key={p.id} className={p.isActive ? 'hover:bg-brand-surface/60' : 'bg-brand-surface/50 text-brand-muted'}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-brand-border bg-brand-surface">
                          <Image src={p.image || PLACEHOLDER} alt="" fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <Link href={`/admin/products/${p.id}`} className="line-clamp-1 font-semibold text-brand-ink hover:text-brand-secondary">
                            {p.name}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-brand-muted">
                            {p.sku && <span className="font-mono">{p.sku}</span>}
                            <span>{p.packing}</span>
                            {p.isFeatured && <Star className="h-3 w-3 fill-brand-primary text-brand-primary" aria-label="Featured" />}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.categoryRef ? (
                        <Badge className="bg-brand-tint text-brand-secondary">{p.categoryRef.nameEn}</Badge>
                      ) : (
                        <span className="text-xs text-brand-primary">No category</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {p.salePrice != null ? (
                        <>
                          <div className="font-semibold text-brand-primary">{formatPrice(p.salePrice)}</div>
                          <div className="text-xs text-brand-muted line-through">{formatPrice(p.price)}</div>
                        </>
                      ) : (
                        <div className="font-semibold">{formatPrice(p.price)}</div>
                      )}
                      <div className="text-[11px] text-brand-muted">per {p.unit}</div>
                    </td>
                    <td className="px-4 py-3">
                      <StockCell stockQty={p.stockQty} unit={p.unit} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ProductToggle productId={p.id} field="isFeatured" initial={p.isFeatured} label={`Featured: ${p.name}`} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ProductToggle productId={p.id} field="isActive" initial={p.isActive} label={`Active: ${p.name}`} />
                    </td>
                    <td className="px-4 py-3">
                      <ProductRowActions productId={p.id} productName={p.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          basePath="/admin/products"
          params={{ q: query, category, status }}
          page={page}
          pageCount={pageCount}
          total={total}
          pageSize={PAGE_SIZE}
        />
      </Card>
    </>
  );
}
