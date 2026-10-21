'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, MailOpen } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { adminFetch } from '@/lib/admin/client';
import { Button } from './ui';

export default function MessageReadToggle({ messageId, initial }: { messageId: string; initial: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [isRead, setIsRead] = useState(initial);
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    const next = !isRead;
    setIsRead(next);
    setSaving(true);
    const res = await adminFetch(`/api/admin/messages/${messageId}`, { method: 'PATCH', body: { isRead: next } });
    setSaving(false);
    if (!res.ok) {
      setIsRead(!next);
      toast.error(res.error ?? 'Could not update');
      return;
    }
    router.refresh(); // update the unread badge in the sidebar
  };

  return (
    <Button variant={isRead ? 'ghost' : 'secondary'} size="sm" onClick={toggle} disabled={saving}>
      {isRead ? <Mail className="h-4 w-4" aria-hidden /> : <MailOpen className="h-4 w-4" aria-hidden />}
      {isRead ? 'Mark unread' : 'Mark as read'}
    </Button>
  );
}
