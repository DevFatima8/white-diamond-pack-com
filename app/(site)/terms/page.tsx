import type { Metadata } from 'next';
import LegalView from '@/components/pages/LegalView';

export const metadata: Metadata = {
  title: 'Terms of Sale',
  description: 'Terms that apply to orders placed with White Diamond: orders, prices in PKR, payment, delivery and liability.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return <LegalView page="terms" />;
}
