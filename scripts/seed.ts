/**
 * Seed the database with categories, dummy products, default settings
 * and the order-number counter.
 *
 *   npm run db:seed -- --confirm               (safe: only adds what's missing)
 *   npm run db:seed -- --confirm --overwrite   (also resets seed products/categories to this file's values)
 *
 * Which database? The same one `npm run dev` uses: DATABASE_URL from .env.local
 * (local Docker MySQL) if present, otherwise .env. A non-local database is refused
 * unless ALLOW_REMOTE_DB=1 is also set.
 *
 * Idempotent = safe to run many times. Records are matched by slug (categories,
 * products) or key (settings), so a second run never creates duplicates.
 *
 * Default mode never changes existing rows, so edits made in the admin panel
 * (prices, stock, settings) survive a re-run. `--overwrite` updates seed-owned
 * categories/products (matched by slug) but still never touches settings,
 * orders or messages.
 */
import './load-env'; // must stay first: loads .env.local before PrismaClient is created
import { PrismaClient } from '@prisma/client';
import { seedCategories, seedProducts } from '../data/catalog';
import { DEFAULT_SETTINGS } from '../data/default-settings';
import { slugify, uniqueSlug } from '../lib/slug';
import { describeDatabaseUrl, isLocalDatabaseUrl, remoteDatabaseAllowed } from '../lib/db-safety';

const ORDER_COUNTER_START = 1000; // first order will be WD-1001

const args = new Set(process.argv.slice(2));
const OVERWRITE = args.has('--overwrite');

const prisma = new PrismaClient();

async function seedCategoryRows() {
  let created = 0;
  let updated = 0;
  for (const c of seedCategories) {
    const data = {
      nameEn: c.nameEn,
      nameAr: c.nameAr,
      descriptionEn: c.descriptionEn,
      descriptionAr: c.descriptionAr,
      image: c.image,
      sortOrder: c.sortOrder,
    };
    const existing = await prisma.category.findUnique({ where: { slug: c.slug } });
    if (!existing) {
      await prisma.category.create({ data: { slug: c.slug, ...data } });
      created++;
    } else if (OVERWRITE) {
      await prisma.category.update({ where: { slug: c.slug }, data });
      updated++;
    }
  }
  console.log(`  categories: ${created} created, ${updated} updated, ${seedCategories.length - created - updated} unchanged`);
}

async function seedProductRows() {
  // slug → id, so products can be linked to their category
  const categories = await prisma.category.findMany({ select: { id: true, slug: true, nameEn: true } });
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

  let created = 0;
  let updated = 0;
  for (const p of seedProducts) {
    const category = categoryBySlug.get(p.categorySlug);
    if (!category) throw new Error(`Product "${p.slug}" uses unknown category "${p.categorySlug}"`);

    const data = {
      sku: p.sku,
      name: p.name,
      nameAr: p.nameAr,
      description: p.description,
      descriptionAr: p.descriptionAr,
      category: category.nameEn, // old text column, kept in sync for compatibility
      categoryId: category.id,
      image: p.image,
      images: [p.image],
      price: p.price,
      salePrice: p.salePrice ?? null,
      unit: p.unit,
      packing: p.packing,
      capacity: p.capacity ?? null,
      material: p.material ?? null,
      color: p.color ?? null,
      features: p.features,
      stockQty: p.stockQty,
      inStock: p.stockQty > 0,
      minOrderQty: p.minOrderQty,
      isFeatured: p.isFeatured,
      isActive: true,
    };

    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      await prisma.product.create({ data: { slug: p.slug, ...data } });
      created++;
    } else if (OVERWRITE) {
      await prisma.product.update({ where: { slug: p.slug }, data });
      updated++;
    }
  }
  console.log(`  products:   ${created} created, ${updated} updated, ${seedProducts.length - created - updated} unchanged`);
}

/**
 * Products that existed before this schema change have no slug and no categoryId.
 * Give each a unique slug from its name, and link it to a category whose English
 * name matches its old `category` text (if any). Nothing else is changed.
 */
async function backfillLegacyProducts() {
  const legacy = await prisma.product.findMany({
    where: { OR: [{ slug: null }, { categoryId: null }] },
    select: { id: true, name: true, slug: true, category: true, categoryId: true },
  });
  if (legacy.length === 0) {
    console.log('  legacy products: none to backfill');
    return;
  }

  const categories = await prisma.category.findMany({ select: { id: true, nameEn: true } });
  const categoryByName = new Map(categories.map((c) => [c.nameEn.toLowerCase(), c.id]));

  let updated = 0;
  let unmatched = 0;
  for (const p of legacy) {
    const categoryId = p.categoryId ?? categoryByName.get(p.category.toLowerCase()) ?? null;
    if (!categoryId) unmatched++;
    // Already has a slug and still no category match → nothing new to write.
    if (p.slug && categoryId === p.categoryId) continue;

    const slug =
      p.slug ??
      (await uniqueSlug(slugify(p.name), async (s) => (await prisma.product.count({ where: { slug: s } })) > 0));
    await prisma.product.update({ where: { id: p.id }, data: { slug, categoryId } });
    updated++;
  }
  console.log(
    `  legacy products: ${updated} backfilled` +
      (unmatched ? ` (${unmatched} without a matching category — assign one in the admin panel)` : ''),
  );
}

async function seedSettings() {
  let created = 0;
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    // Only create missing keys — if the key exists, leave the admin's value alone.
    const before = await prisma.setting.findUnique({ where: { key } });
    if (!before) {
      await prisma.setting.create({ data: { key, value } });
      created++;
    }
  }
  console.log(`  settings:   ${created} created, ${Object.keys(DEFAULT_SETTINGS).length - created} already set`);
}

async function seedOrderCounter() {
  const existing = await prisma.counter.findUnique({ where: { name: 'order' } });
  if (existing) {
    console.log(`  order counter: already at ${existing.value} (next order WD-${existing.value + 1})`);
    return;
  }
  await prisma.counter.create({ data: { name: 'order', value: ORDER_COUNTER_START } });
  console.log(`  order counter: created (first order will be WD-${ORDER_COUNTER_START + 1})`);
}

async function main() {
  const url = process.env.DATABASE_URL;
  const target = describeDatabaseUrl(url);

  // Safety switch 1: never write to a remote (live) database by accident.
  if (!isLocalDatabaseUrl(url) && !remoteDatabaseAllowed()) {
    console.error(`Refusing to seed non-local database ${target}.`);
    console.error('Point .env.local at the local Docker database, or set ALLOW_REMOTE_DB=1 if you really mean it.');
    process.exitCode = 1;
    return;
  }

  // Safety switch 2: nothing is written without --confirm.
  if (!args.has('--confirm')) {
    console.log(`Target database: ${target}`);
    console.log('Nothing was written. Re-run with --confirm to seed this database:');
    console.log('  npm run db:seed -- --confirm');
    return;
  }

  console.log(`Seeding ${target}${OVERWRITE ? ' (overwrite mode)' : ''} ...`);
  await seedCategoryRows();
  await seedProductRows();
  await backfillLegacyProducts();
  await seedSettings();
  await seedOrderCounter();
  console.log('Done.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
