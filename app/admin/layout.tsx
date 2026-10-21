import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · White Diamond Admin' },
  robots: { index: false, follow: false }, // keep the admin out of Google
};

// Shared by every /admin page (login, panel, invoice). The sidebar lives in (panel)/layout.tsx.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
