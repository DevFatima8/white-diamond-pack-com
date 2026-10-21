import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const VIEWPORTS = [
  { width: 1920, height: 1080, name: '1920' },
  { width: 1440, height: 900, name: '1440' },
  { width: 1024, height: 768, name: '1024' },
  { width: 768, height: 1024, name: '768' },
  { width: 390, height: 844, name: '390' },
];

const PAGES_TO_CAPTURE = [
  { path: '/', name: 'home-en' },
  { path: '/', name: 'home-ar', isRTL: true },
  { path: '/products', name: 'products' },
  { path: '/services', name: 'services' },
  { path: '/about', name: 'about' },
  { path: '/contact', name: 'contact' },
  { path: '/our-presence', name: 'our-presence' },
];

async function capture() {
  const targetBaseUrl = process.env.CAPTURE_URL || 'http://localhost:3001';
  const outDir = process.env.CAPTURE_OUT_DIR || path.join(process.cwd(), 'reference');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`Starting capture for ${targetBaseUrl} into ${outDir}...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\nCapturing viewport ${vp.name} (${vp.width}x${vp.height})...`);
      const page = await context.newPage();
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const p of PAGES_TO_CAPTURE) {
        const fullUrl = `${targetBaseUrl}${p.path}`;
        const screenshotPath = path.join(outDir, `${p.name}-${vp.name}.png`);

        try {
          console.log(`  Visiting ${fullUrl}...`);
          await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });

          if (p.isRTL) {
            // Switch to Arabic if button available or set dir="rtl"
            await page.evaluate(() => {
              document.documentElement.setAttribute('dir', 'rtl');
              document.documentElement.setAttribute('lang', 'ar');
            });
          }

          // Trigger smooth scroll down to ensure lazy loaded items & scroll reveals load
          await page.evaluate(async () => {
            const distance = 400;
            const delay = 100;
            while (document.scrollingElement && document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
              window.scrollBy(0, distance);
              await new Promise((r) => setTimeout(r, delay));
            }
            window.scrollTo(0, 0);
          });

          await page.waitForTimeout(1000);
          await page.screenshot({ path: screenshotPath, fullPage: true });
          console.log(`  Saved screenshot: ${screenshotPath}`);
        } catch (err) {
          console.warn(`  Warning capturing ${fullUrl}: ${err instanceof Error ? err.message : err}`);
        }
      }

      await page.close();
    }
  } finally {
    await browser.close();
  }

  console.log('\nCapture completed successfully.');
}

if (require.main === module) {
  capture().catch((err) => {
    console.error('Fatal capture error:', err);
    process.exit(1);
  });
}

export { capture };
