import { Resend } from 'resend';
import { formatPrice } from '@/lib/utils';
import { formatDateTime } from '@/lib/dates';
import { PAYMENT_METHOD_LABEL } from '@/lib/orders';
import { formatPkMobile } from '@/lib/phone';
import type { PaymentMethod } from '@prisma/client';

/** Escape text before putting it into HTML, so a customer can't inject markup into the email. */
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export interface OrderEmailData {
  orderNumber: string;
  createdAt: Date;
  customerName: string;
  phone: string;
  email: string | null;
  city: string;
  address: string;
  notes: string | null;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  items: { productName: string; unitPrice: number; quantity: number; lineTotal: number }[];
}

/**
 * Email the shop owner about a new order — only if RESEND_API_KEY and ORDER_NOTIFY_EMAIL
 * are set; otherwise it silently does nothing. It never throws: a failed email must not
 * fail the customer's order (the order is already saved when this runs).
 */
export async function notifyNewOrder(order: OrderEmailData, adminUrl?: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 8px;border-bottom:1px solid #E2E8F0">${esc(i.productName)}</td>` +
        `<td style="padding:6px 8px;border-bottom:1px solid #E2E8F0;text-align:right">${i.quantity}</td>` +
        `<td style="padding:6px 8px;border-bottom:1px solid #E2E8F0;text-align:right">${formatPrice(i.lineTotal)}</td></tr>`,
    )
    .join('');

  const html = `
  <div style="font-family:Arial,sans-serif;color:#0F172A;max-width:600px">
    <h2 style="color:#1E1B4B;margin:0 0 4px">New order ${esc(order.orderNumber)}</h2>
    <p style="margin:0 0 16px;color:#64748B">${esc(formatDateTime(order.createdAt))} · ${esc(PAYMENT_METHOD_LABEL[order.paymentMethod])}</p>
    <p style="margin:0"><b>${esc(order.customerName)}</b> · ${esc(formatPkMobile(order.phone))}${order.email ? ` · ${esc(order.email)}` : ''}</p>
    <p style="margin:4px 0 16px">${esc(order.address)}, <b>${esc(order.city)}</b></p>
    ${order.notes ? `<p style="background:#EEF2FF;padding:8px 12px;border-radius:8px">Note: ${esc(order.notes)}</p>` : ''}
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <thead><tr style="background:#F8FAFC"><th style="text-align:left;padding:6px 8px">Product</th><th style="text-align:right;padding:6px 8px">Qty</th><th style="text-align:right;padding:6px 8px">Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="text-align:right;margin:12px 0 0">Subtotal: ${formatPrice(order.subtotal)}<br>Delivery: ${order.deliveryCharge === 0 ? 'Free' : formatPrice(order.deliveryCharge)}<br><b style="font-size:16px;color:#E63946">Total: ${formatPrice(order.total)}</b></p>
    ${adminUrl ? `<p><a href="${esc(adminUrl)}" style="color:#6366F1">Open the order in the admin panel</a></p>` : ''}
  </div>`;

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: process.env.ORDER_NOTIFY_FROM || 'White Diamond <onboarding@resend.dev>',
      to: to.split(',').map((s) => s.trim()),
      subject: `New order ${order.orderNumber} — ${formatPrice(order.total)} (${order.city})`,
      html,
    });
    if (error) console.error('[notify] order email failed:', error);
  } catch (err) {
    console.error('[notify] order email failed:', err);
  }
}
