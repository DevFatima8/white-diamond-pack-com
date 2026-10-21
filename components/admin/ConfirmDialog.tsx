'use client';

import type { ReactNode } from 'react';
import Modal from '@/components/ui/Modal';
import { Button } from './ui';

/** "Are you sure?" dialog for destructive actions. */
export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = 'Delete',
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal isOpen={open} onClose={loading ? () => {} : onCancel} title={title} size="sm">
      <div className="text-sm text-brand-muted">{children}</div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
