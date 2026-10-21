import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** PKR price in whole rupees: 4500 → "Rs 4,500". */
export function formatPrice(price: number | null | undefined) {
  if (price == null) return 'Price on Request';
  return `Rs ${Math.round(price).toLocaleString('en-US')}`;
}
