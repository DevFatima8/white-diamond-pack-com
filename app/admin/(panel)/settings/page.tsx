import type { Metadata } from 'next';
import { getSettings } from '@/lib/settings';
import { PageHeader } from '@/components/admin/ui';
import SettingsForm from '@/components/admin/SettingsForm';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader eyebrow="Store" title="Settings" description="Changes apply to the website immediately after saving." />
      <SettingsForm initial={settings} />
    </>
  );
}
