/**
 * LOCAL-ONLY demo data: ~30 orders spread over the last 30 days + a few messages,
 * so the admin dashboard, orders and messages pages have something to show.
 *
 *   npm run db:seed-demo
 *
 * Refuses to run against any non-local database — there is NO override,
 * because fake orders must never reach the live shop.
 * Refuses to run twice (if orders already exist) unless you pass --force.
 */
import './load-env'; // must stay first
import { PrismaClient, type OrderStatus, type PaymentMethod } from '@prisma/client';
import { describeDatabaseUrl, isLocalDatabaseUrl } from '../lib/db-safety';
import { nextOrderNumber } from '../lib/orders';

const prisma = new PrismaClient();

// Tiny seeded random generator, so every run produces the same demo data.
let seed = 20261021;
const rand = () => ((seed = (seed * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32);
const pick = <T>(list: readonly T[]): T => list[Math.floor(rand() * list.length)];
const int = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));

const NAMES = ['Muhammad Usman', 'Ayesha Khan', 'Ali Raza', 'Fatima Noor', 'Hamza Sheikh', 'Zainab Malik', 'Bilal Ahmed', 'Sana Tariq', 'Imran Qureshi', 'Hira Javed', 'Kashif Mehmood', 'Mehwish Iqbal'];
const COMPANIES = ['Punjab Culinary Services', 'Lahore Grill House', 'Karachi Bakers', 'Faisal Caterers', 'Model Town Café', null, null];
const CITIES = [
  ['Faisalabad', 'Plot 14, Small Industrial Estate, Sargodha Road'],
  ['Lahore', '22-B, Main Boulevard, Gulberg III'],
  ['Karachi', 'Shop 5, Tariq Road, PECHS Block 2'],
  ['Islamabad', 'House 9, Street 12, F-8/3'],
  ['Rawalpindi', 'Saddar Bazaar, near GPO Chowk'],
  ['Multan', 'Bosan Road, near Chungi No. 9'],
] as const;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!isLocalDatabaseUrl(url)) {
    console.error(`Refusing: demo data is for the LOCAL database only (target: ${describeDatabaseUrl(url)}).`);
    process.exitCode = 1;
    return;
  }

  const existing = await prisma.order.count();
  if (existing > 0 && !process.argv.includes('--force')) {
    console.log(`There are already ${existing} orders. Nothing added (use --force to add more).`);
    return;
  }

  const products = await prisma.product.findMany({ where: { isActive: true }, select: { id: true, name: true, price: true, salePrice: true } });
  if (products.length === 0) throw new Error('No products — run `npm run db:seed -- --confirm` first.');

  const settings = Object.fromEntries((await prisma.setting.findMany()).map((s) => [s.key, s.value]));
  const deliveryCharge = Number(settings.delivery_charge ?? 250);
  const freeFrom = Number(settings.free_delivery_threshold ?? 15000);

  const now = Date.now();
  const DAY = 86_400_000;
  const orderCount = 30;

  // Random moments in the last 30 days, oldest first — so order numbers go up with time like real orders.
  const moments = Array.from({ length: orderCount }, () => now - rand() * 29.5 * DAY).sort((x, y) => x - y);

  for (const moment of moments) {
    const createdAt = new Date(moment);
    const daysAgo = Math.floor((now - moment) / DAY);
    // Older orders are mostly delivered; the newest ones are still pending.
    const status: OrderStatus =
      daysAgo <= 1 ? pick(['PENDING', 'PENDING', 'CONFIRMED'] as const)
      : daysAgo <= 4 ? pick(['CONFIRMED', 'SHIPPED', 'PENDING'] as const)
      : pick(['DELIVERED', 'DELIVERED', 'DELIVERED', 'SHIPPED', 'CANCELLED'] as const);
    const paymentMethod: PaymentMethod = rand() < 0.7 ? 'COD' : 'BANK_TRANSFER';

    const lines = Array.from({ length: int(1, 4) }, () => pick(products));
    const unique = [...new Map(lines.map((p) => [p.id, p])).values()];
    const items = unique.map((p) => {
      const unitPrice = Math.round(p.salePrice ?? p.price ?? 0);
      const quantity = int(1, 6);
      return { productId: p.id, productName: p.name, unitPrice, quantity, lineTotal: unitPrice * quantity };
    });
    const subtotal = items.reduce((s, it) => s + it.lineTotal, 0);
    const delivery = freeFrom > 0 && subtotal >= freeFrom ? 0 : deliveryCharge;
    const [city, address] = pick(CITIES);
    const name = pick(NAMES);

    await prisma.$transaction(async (tx) => {
      const orderNumber = await nextOrderNumber(tx);
      await tx.order.create({
        data: {
          orderNumber,
          customerName: name,
          phone: `03${int(0, 4)}${int(0, 9)}${String(int(1000000, 9999999))}`,
          email: rand() < 0.5 ? `${name.split(' ')[0].toLowerCase()}${int(1, 99)}@example.com` : null,
          city,
          address,
          notes: rand() < 0.25 ? 'Please call before delivery. Loading bay at the back.' : null,
          paymentMethod,
          status,
          subtotal,
          deliveryCharge: delivery,
          total: subtotal + delivery,
          createdAt,
          items: { create: items },
        },
      });
    });
  }

  const messages = [
    { type: 'QUOTE' as const, productName: 'Foil Container 450ml with Lid', quantity: 50, message: 'We need 50 cartons every month for our catering business. Can you offer a better rate and delivery to Lahore?' },
    { type: 'QUOTE' as const, productName: 'Kraft Paper Bag with Twisted Handle (Medium)', quantity: 20, message: 'Is custom logo printing possible on these bags? We need 20 cartons for a new restaurant opening.' },
    { type: 'CONTACT' as const, message: 'Do you deliver to Gujranwala? What are the delivery charges?' },
    { type: 'CONTACT' as const, message: 'Please send me your full price list on WhatsApp.' },
    { type: 'QUOTE' as const, productName: 'Thermal Paper Roll 80mm × 80m', quantity: 10, message: 'Need thermal rolls for 6 branches of our pharmacy chain.' },
    { type: 'CONTACT' as const, message: 'Are you hiring for sales positions in Karachi?' },
  ];
  for (const [i, m] of messages.entries()) {
    await prisma.message.create({
      data: {
        ...m,
        name: pick(NAMES),
        phone: `03${int(0, 4)}${int(0, 9)}${String(int(1000000, 9999999))}`,
        email: rand() < 0.6 ? `contact${i}@example.com` : null,
        company: pick(COMPANIES),
        isRead: i >= 3,
        createdAt: new Date(now - i * 0.7 * DAY),
      },
    });
  }

  console.log(`Added ${orderCount} demo orders and ${messages.length} messages to ${describeDatabaseUrl(url)}.`);
}

main()
  .catch((err) => {
    console.error('Demo seed failed:', err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
