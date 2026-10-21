export interface Product {
  id: string | number;
  name: string;
  category: string;
  image: string;
  capacity?: string | null;
  description: string;
  features: string[] | Record<string, any>;
  packing: string;
  material?: string | null;
  color?: string | null;
  price?: number | null;
  inStock?: boolean;
}

export const initialProducts: Product[] = [
  {
    id: 'fp-1',
    name: 'Aluminum Foil Containers with Lids',
    category: 'Aluminum Containers',
    image: '/images/products/foil-container.jpg',
    capacity: '450 ml',
    description: 'Heavy duty, heat resistant aluminum food containers ideal for takeaways and baking.',
    features: ['Heat resistant', '100% Recyclable', 'Oven Safe'],
    packing: '500 pcs/carton',
    material: 'Food-grade Aluminum',
    color: 'Silver',
    price: 45.0,
    inStock: true,
  },
  {
    id: 'fp-2',
    name: 'Biodegradable Sugarcane Bagasse Meal Box',
    category: 'Eco-Friendly Packaging',
    image: '/images/products/bagasse-box.jpg',
    capacity: '850 ml',
    description: 'Eco-conscious compostable meal packaging designed for hot and cold food delivery.',
    features: ['Compostable', 'Microwave Safe', 'Oil Proof'],
    packing: '250 pcs/carton',
    material: 'Sugarcane Bagasse',
    color: 'Natural White',
    price: 65.0,
    inStock: true,
  },
  {
    id: 'fp-3',
    name: 'Crystal Clear PET Hinged Salad Bowls',
    category: 'Plastic Containers',
    image: '/images/products/pet-bowl.jpg',
    capacity: '750 ml',
    description: 'Airtight leak-resistant clear containers for salads, deli, and bakery items.',
    features: ['Ultra-clear', 'Leak resistant seal', 'BPA Free'],
    packing: '300 pcs/carton',
    material: 'PET',
    color: 'Transparent',
    price: 52.0,
    inStock: true,
  },
  {
    id: 'fp-4',
    name: 'Premium Kraft Paper Takeaway Bags',
    category: 'Paper Bags & Wraps',
    image: '/images/products/kraft-bag.jpg',
    capacity: 'Medium',
    description: 'Reinforced twisted handle kraft bags made from sustainably sourced recyclable paper.',
    features: ['Heavy Duty Base', 'Twisted Paper Handles', 'Eco-friendly'],
    packing: '200 pcs/carton',
    material: 'Virgin Kraft Paper',
    color: 'Natural Brown',
    price: 38.0,
    inStock: true,
  },
];
