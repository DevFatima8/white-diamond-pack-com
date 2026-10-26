import type { MetadataRoute } from 'next';

/** Web app manifest: name, colours and the square diamond icon (Android home screen, Google). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'White Diamond — Food Packaging',
    short_name: 'White Diamond',
    description: 'Aluminium foil, food containers, cling film, baking paper and food packaging — Faisalabad, Pakistan.',
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#C1121F',
    icons: [
      { src: '/images/logo-icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/favicon.ico', sizes: '64x64 48x48 32x32 16x16', type: 'image/x-icon' },
    ],
  };
}
