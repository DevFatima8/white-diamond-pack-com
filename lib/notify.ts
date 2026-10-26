import { formatPrice } from '@/lib/utils';
import { formatDateTime } from '@/lib/dates';
import { PAYMENT_METHOD_LABEL } from '@/lib/orders';
import { formatPkMobile } from '@/lib/phone';
import type { MessageType, PaymentMethod } from '@prisma/client';
import { sendShopEmail } from '@/lib/mailer';

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
 * Email the shop owner about a new order (see lib/mailer.ts for how email is configured).
 * It never throws: a failed email must not fail the customer's order (already saved).
 */
export async function notifyNewOrder(order: OrderEmailData, adminUrl?: string): Promise<void> {
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
    <h2 style="color:#2B1212;margin:0 0 4px">New order ${esc(order.orderNumber)}</h2>
    <p style="margin:0 0 16px;color:#64748B">${esc(formatDateTime(order.createdAt))} · ${esc(PAYMENT_METHOD_LABEL[order.paymentMethod])}</p>
    <p style="margin:0"><b>${esc(order.customerName)}</b> · ${esc(formatPkMobile(order.phone))}${order.email ? ` · ${esc(order.email)}` : ''}</p>
    <p style="margin:4px 0 16px">${esc(order.address)}, <b>${esc(order.city)}</b></p>
    ${order.notes ? `<p style="background:#FDF3F3;padding:8px 12px;border-radius:8px">Note: ${esc(order.notes)}</p>` : ''}
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <thead><tr style="background:#F8FAFC"><th style="text-align:left;padding:6px 8px">Product</th><th style="text-align:right;padding:6px 8px">Qty</th><th style="text-align:right;padding:6px 8px">Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="text-align:right;margin:12px 0 0">Subtotal: ${formatPrice(order.subtotal)}<br>Delivery: ${order.deliveryCharge === 0 ? 'Free' : formatPrice(order.deliveryCharge)}<br><b style="font-size:16px;color:#C1121F">Total: ${formatPrice(order.total)}</b></p>
    ${adminUrl ? `<p><a href="${esc(adminUrl)}" style="color:#8B1414">Open the order in the admin panel</a></p>` : ''}
  </div>`;

  await sendShopEmail({
    subject: `New order ${order.orderNumber} — ${formatPrice(order.total)} (${order.city})`,
    html,
    replyTo: order.email,
  });
}

const MESSAGE_LABEL: Record<MessageType, string> = { CONTACT: 'Contact message', QUOTE: 'Quote request', CAREER: 'Job application' };

export interface MessageEmailData {
  type: MessageType;
  name: string;
  phone: string;
  email: string | null;
  company?: string | null;
  subject?: string | null;
  productName?: string | null;
  quantity?: number | null;
  message: string;
}

/** Email the shop owner about a new contact message, quote request or job application. */
export async function notifyNewMessage(m: MessageEmailData, adminUrl?: string): Promise<void> {
  const label = MESSAGE_LABEL[m.type];
  const line = (k: string, v?: string | number | null) => (v ? `<p style="margin:2px 0"><b>${k}:</b> ${esc(String(v))}</p>` : '');
  const html = `
  <div style="font-family:Arial,sans-serif;color:#1A1212;max-width:600px">
    <h2 style="color:#8B1414;margin:0 0 12px">${esc(label)} from ${esc(m.name)}</h2>
    ${line('Phone', formatPkMobile(m.phone))}${line('Email', m.email)}${line('Company', m.company)}${line('Subject', m.subject)}${line('Product', m.productName)}${line('Quantity', m.quantity)}
    <p style="background:#FDF3F3;padding:12px;border-radius:8px;white-space:pre-line;margin-top:12px">${esc(m.message)}</p>
    ${adminUrl ? `<p><a href="${esc(adminUrl)}" style="color:#8B1414">Open Messages in the admin panel</a></p>` : ''}
  </div>`;
  await sendShopEmail({ subject: `${label} — ${m.name}${m.subject ? ` (${m.subject})` : ''}`, html, replyTo: m.email });
}
