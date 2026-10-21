import { permanentRedirect } from 'next/navigation';
import { routes } from '@/lib/routes';

/** Old URL — the content now lives on /industries. 308 keeps links and search rankings. */
export default function ServicesPage() {
  permanentRedirect(routes.industries);
}
