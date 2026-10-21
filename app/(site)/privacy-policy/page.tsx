import type { Metadata } from 'next';
import LegalView from '@/components/pages/LegalView';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How White Diamond collects, uses and protects your personal information when you order or contact us.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return <LegalView page="privacy" />;
}
