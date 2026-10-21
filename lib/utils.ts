import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null | undefined, currency: string = 'AED') {
  if (price == null) return 'Price on Request';
  return `${currency} ${price.toFixed(2)}`;
}
