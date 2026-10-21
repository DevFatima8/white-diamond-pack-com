export interface Product {
  id: string;
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
  inStock: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  itemCount?: number;
}

export interface CartItem extends Omit<Product, 'id'> {
  id: string | number;
  _id?: string;
  quantity: number;
}

export interface AdminUser {
  id?: string;
  email: string;
  username: string;
  role: 'admin';
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
