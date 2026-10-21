import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { initialProducts } from '@/data/products';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let products;
    try {
      products = await db.product.findMany({
        where: category ? { category } : undefined,
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      // In case database table is not yet migrated/reachable, fall back to initial catalogue
      console.warn('Database query fallback to initial catalogue:', dbErr);
      products = category
        ? initialProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
        : initialProducts;
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, image, description, packing, price, capacity, material, color, features } = body;

    if (!name || !category || !image || !description || !packing) {
      return NextResponse.json(
        { success: false, error: 'Missing required product fields' },
        { status: 400 }
      );
    }

    const newProduct = await db.product.create({
      data: {
        name,
        category,
        image,
        description,
        packing,
        capacity: capacity || null,
        material: material || null,
        color: color || null,
        price: price ? parseFloat(price) : null,
        features: features || [],
      },
    });

    return NextResponse.json(
      { success: true, data: newProduct },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
