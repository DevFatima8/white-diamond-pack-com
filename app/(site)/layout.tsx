import React from 'react';
import PageTransition from '@/components/ui/PageTransition';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageTransition className="flex-1 w-full flex flex-col">
      {children}
    </PageTransition>
  );
}
