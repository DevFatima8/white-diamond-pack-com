import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/categories';
import { serverError } from '@/lib/api';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    return serverError('categories GET', err, 'Failed to fetch categories');
  }
}
