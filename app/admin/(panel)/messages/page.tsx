import type { Metadata } from 'next';
import Link from 'next/link';
import type { MessageType, Prisma } from '@prisma/client';
import { Building2, Inbox, Mail, MessageCircle, Package, Phone } from 'lucide-react';
import db from '@/lib/db';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/dates';
import { formatPkMobile, whatsappLink } from '@/lib/phone';
import { Badge, Card, EmptyState, PageHeader, buttonClass } from '@/components/admin/ui';
import MessageReadToggle from '@/components/admin/MessageReadToggle';
import Pagination, { parsePage } from '@/components/admin/Pagination';

export const metadata: Metadata = { title: 'Messages' };

const PAGE_SIZE = 15;

const TYPE_LABEL: Record<MessageType, string> = { CONTACT: 'Contact form', QUOTE: 'Quote request', CAREER: 'Job application' };

type SearchParams = Promise<{ type?: string; show?: string; page?: string }>;

export default async function MessagesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const type = sp.type === 'CONTACT' || sp.type === 'QUOTE' || sp.type === 'CAREER' ? (sp.type as MessageType) : undefined;
  const unreadOnly = sp.show === 'unread';

  const where: Prisma.MessageWhereInput = { ...(type && { type }), ...(unreadOnly && { isRead: false }) };
  const [total, unreadCount] = await Promise.all([db.message.count({ where }), db.message.count({ where: { isRead: false } })]);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(parsePage(sp.page), pageCount);
  const messages = await db.message.findMany({
    where,
    orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }], // unread first
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const tabs = [
    { label: 'All', href: '/admin/messages', active: !type && !unreadOnly },
    { label: `Unread (${unreadCount})`, href: '/admin/messages?show=unread', active: unreadOnly && !type },
    { label: 'Quote requests', href: '/admin/messages?type=QUOTE', active: type === 'QUOTE' },
    { label: 'Contact form', href: '/admin/messages?type=CONTACT', active: type === 'CONTACT' },
    { label: 'Job applications', href: '/admin/messages?type=CAREER', active: type === 'CAREER' },
  ];

  return (
    <>
      <PageHeader eyebrow="Inbox" title="Messages" description="Contact form messages and bulk quote requests from the website." />

      <div className="mb-4 flex flex-wrap gap-2" role="tablist">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            role="tab"
            aria-selected={t.active}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
              t.active ? 'bg-brand-secondary text-white' : 'bg-brand-tint text-brand-secondary hover:bg-[#FCE8E9]',
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <Card className="overflow-hidden">
        {messages.length === 0 ? (
          <EmptyState icon={<Inbox className="h-5 w-5" />} title="No messages here">
            New contact and quote requests from the website will show up in this list.
          </EmptyState>
        ) : (
          <ul className="divide-y divide-brand-border">
            {messages.map((m) => (
              <li key={m.id} className={cn('p-5', !m.isRead && 'bg-brand-tint/40')}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {!m.isRead && <span className="h-2 w-2 rounded-full bg-brand-primary" aria-label="Unread" />}
                      <span className="font-semibold">{m.name}</span>
                      <Badge className={m.type === 'QUOTE' ? 'bg-brand-secondary text-white' : 'bg-brand-tint text-brand-secondary'}>
                        {TYPE_LABEL[m.type]}
                      </Badge>
                      <span className="text-xs text-brand-muted">{formatDateTime(m.createdAt)}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-muted">
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Phone className="h-3.5 w-3.5" aria-hidden /> {formatPkMobile(m.phone)}
                      </span>
                      {m.email && (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" aria-hidden /> {m.email}
                        </span>
                      )}
                      {m.company && (
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" aria-hidden /> {m.company}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <a href={`tel:${m.phone}`} className={buttonClass({ variant: 'ghost', size: 'sm' })} aria-label={`Call ${m.name}`}>
                      <Phone className="h-4 w-4" aria-hidden /> Call
                    </a>
                    <a
                      href={whatsappLink(m.phone, `Assalam-o-Alaikum ${m.name}, this is White Diamond replying to your ${m.type === 'QUOTE' ? 'quote request' : m.type === 'CAREER' ? 'job application' : 'message'}.`)}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonClass({ variant: 'ghost', size: 'sm' })}
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
                    </a>
                    {m.email && (
                      <a href={`mailto:${m.email}?subject=${encodeURIComponent('White Diamond — reply to your message')}`} className={buttonClass({ variant: 'ghost', size: 'sm' })}>
                        <Mail className="h-4 w-4" aria-hidden /> Email
                      </a>
                    )}
                    <MessageReadToggle messageId={m.id} initial={m.isRead} />
                  </div>
                </div>

                {m.subject && (
                  <p className="mt-3 text-sm font-semibold text-brand-navy">
                    <span className="text-brand-muted">Subject:</span> {m.subject}
                  </p>
                )}
                {m.type === 'QUOTE' && (m.productName || m.quantity) && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs ring-1 ring-brand-border">
                    <Package className="h-3.5 w-3.5 text-brand-secondary" aria-hidden />
                    {m.productName ?? 'Product'}
                    {m.quantity ? <span className="font-semibold">× {m.quantity}</span> : null}
                  </div>
                )}
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-brand-ink">{m.message}</p>
              </li>
            ))}
          </ul>
        )}
        <Pagination
          basePath="/admin/messages"
          params={{ type, show: unreadOnly ? 'unread' : undefined }}
          page={page}
          pageCount={pageCount}
          total={total}
          pageSize={PAGE_SIZE}
        />
      </Card>
    </>
  );
}
