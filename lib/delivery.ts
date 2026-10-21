/**
 * Delivery charge rule, shared by the cart, checkout and the order API so they always agree:
 * free when the subtotal reaches the threshold (threshold 0 = never free), otherwise the flat charge.
 */
export function deliveryFor(subtotal: number, charge: number, threshold: number): number {
  if (subtotal <= 0) return 0;
  return threshold > 0 && subtotal >= threshold ? 0 : charge;
}

export interface DeliverySettings {
  charge: number;
  threshold: number;
}
