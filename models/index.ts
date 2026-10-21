import db from '@/lib/db';
import type { Product } from '@/types';

export type { Product };

export const ProductModel = {
  findMany: async (args?: Parameters<typeof db.product.findMany>[0]) => {
    return db.product.findMany(args);
  },
  findUnique: async (args: Parameters<typeof db.product.findUnique>[0]) => {
    return db.product.findUnique(args);
  },
  create: async (args: Parameters<typeof db.product.create>[0]) => {
    return db.product.create(args);
  },
  update: async (args: Parameters<typeof db.product.update>[0]) => {
    return db.product.update(args);
  },
  delete: async (args: Parameters<typeof db.product.delete>[0]) => {
    return db.product.delete(args);
  },
  count: async (args?: Parameters<typeof db.product.count>[0]) => {
    return db.product.count(args);
  },
};

export default ProductModel;
