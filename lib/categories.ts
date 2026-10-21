import db from '@/lib/db';
import { initialProducts } from '@/data/products';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count?: number;
  description?: string;
  image?: string;
}

export const fallbackCategories: CategoryItem[] = [
  {
    id: 'aluminum-containers',
    name: 'Aluminum Containers',
    slug: 'aluminum-containers',
    description: 'Heavy duty, heat resistant containers for takeaways & baking',
    image: '/images/products/foil-container.jpg',
  },
  {
    id: 'eco-friendly',
    name: 'Eco-Friendly Packaging',
    slug: 'eco-friendly-packaging',
    description: '100% compostable sugarcane bagasse and biodegradable solutions',
    image: '/images/products/bagasse-box.jpg',
  },
  {
    id: 'plastic-containers',
    name: 'Plastic Containers',
    slug: 'plastic-containers',
    description: 'Ultra-clear PET salad bowls & microwave-safe PP deli boxes',
    image: '/images/products/pet-bowl.jpg',
  },
  {
    id: 'paper-bags',
    name: 'Paper Bags & Wraps',
    slug: 'paper-bags-wraps',
    description: 'Virgin kraft paper bags, burger boxes & greaseproof wraps',
    image: '/images/products/kraft-bag.jpg',
  },
  {
    id: 'foil-rolls',
    name: 'Foil Rolls & Cling Film',
    slug: 'foil-rolls-cling-film',
    description: 'Commercial catering aluminium foil rolls & PVC stretch wraps',
    image: '/images/heavy-duty-foil.png',
  },
  {
    id: 'hygiene-disposables',
    name: 'Hygiene & Disposables',
    slug: 'hygiene-disposables',
    description: 'Nitrile gloves, bamboo skewers, cutlery & thermal rolls',
    image: '/images/bamboo-sticks.png',
  },
];

export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const products = await db.product.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    if (products && products.length > 0) {
      // Map distinct DB categories
      const distinctNames = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
      if (distinctNames.length > 0) {
        return distinctNames.map((name) => {
          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          const existing = fallbackCategories.find(
            (c) => c.name.toLowerCase() === name.toLowerCase() || c.slug === slug
          );
          return {
            id: slug,
            name,
            slug,
            description: existing?.description || `Premium food packaging products in ${name}`,
            image: existing?.image || '/images/food-containers.png',
          };
        });
      }
    }
  } catch (err) {
    console.warn('Database query for categories fallback to defaults:', err);
  }

  // Fallback from initial static products or predefined list
  const initialCategoryNames = Array.from(
    new Set(initialProducts.map((p) => p.category).filter(Boolean))
  );

  const merged = [...fallbackCategories];
  for (const name of initialCategoryNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!merged.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      merged.push({
        id: slug,
        name,
        slug,
        description: `Explore quality packaging in ${name}`,
        image: '/images/food-containers.png',
      });
    }
  }

  return merged;
}
