import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { serverError } from '@/lib/api';

type RouteContext = { params: Promise<{ id: string }> };

const notFound = () =>
  NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });

// Public, read-only: one active product, from the database only.
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  try {
    const product = await db.product.findFirst({
      where: { id, isActive: true },
      include: { categoryRef: { select: { slug: true, nameEn: true, nameAr: true } } },
    });
    return product ? NextResponse.json({ success: true, data: product }) : notFound();
  } catch (err) {
    return serverError('product GET', err, 'Catalogue is temporarily unavailable', 503);
  }
}
