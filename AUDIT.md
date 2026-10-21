# Comprehensive Audit & Design System Specification: FalconPack.com

**Target Reference:** https://falconpack.com/  
**Audit Date:** October 2026  
**Audited By:** Antigravity Pair Programmer

---

## 1. Executive Summary & Page Inventory

FalconPack.com is an enterprise-grade food packaging and institutional hygiene manufacturer portal built with Angular and Tailwind CSS, featuring sophisticated sticky sections, side-rotated vertical labels, count-up statistics, video backgrounds, and bilingual (English & Arabic) RTL navigation.

### Page Inventory & Navigation Structure
| Navigation Menu Item | Target Route | Function & Layout Description |
| :--- | :--- | :--- |
| **OUR COMPANY** | `/about` | Dropdown containing: About Us, Chairman Message, Board Members, Awards, Infrastructure, Quality & Safety. |
| **CATEGORIES** | `/products` / `/category/[slug]` | Multi-column mega menu featuring Aluminum, Bagasse & Bio, PET & PP Plastics, Paper Bags & Boxes, Films, Hygiene. |
| **INDUSTRY WE SERVE** | `/services` / `/industries/[slug]` | Dedicated solutions for HORECA, Food Processors, Cloud Kitchens, Retail, Healthcare. |
| **BUSINESS DIVISIONS** | `/business-divisions` | Deep dive into Falcon Packaging (disposables) and Falcon Detergents (commercial chemicals). |
| **CAREERS** | `/careers` | Job postings list, corporate culture overview, application form with CV upload. |
| **OUR PRESENCE** | `/our-presence` | Regional hubs (UAE, KSA, Oman, Kuwait, Qatar, Bahrain) & export reach across 65+ countries. |
| **CUSTOMIZE PACKAGING**| `/customize-packaging` | Bespoke tooling, logo embossing, multi-color flexo printing, RFQ submission form. |
| **SHOP ONLINE** | `/products` / `/shop` | Full ecommerce catalogue with search, category filtering, product specifications, cart & checkout. |
| **LANGUAGE (EN / AR)**| In-place toggle | Instant switch between English (`dir="ltr"`) and Arabic (`dir="rtl"`) with Arabic font (`Cairo`). |

---

## 2. Design System Tokens (Extracted from Live DOM & Styles)

### A. Color Palette
```css
:root {
  /* Brand Primary */
  --falcon-green: #006a2a;        /* rgb(0, 106, 42) - Primary brand deep emerald */
  --falcon-green-dark: #09401c;   /* Button hover & active dark states */
  --falcon-green-light: #128a3c;  /* Subtle highlights */

  /* Brand Accent */
  --falcon-parrot: #7dc242;       /* rgb(125, 194, 66) - Vibrant Falcon parrot green */
  --falcon-parrot-hover: #6eb037; /* Accent button hover */
  --falcon-parrot-alt: #7cc041;   /* Used in spinners & loader accents */

  /* Neutrals & Surfaces */
  --falcon-black: #0e130d;        /* rgb(14, 19, 13) - Deep brand dark background */
  --falcon-header: #101110;       /* Desktop & mobile sticky header */
  --falcon-footer: #1d221e;       /* Institutional dark footer */
  --falcon-sage: #ebf1ea;         /* rgb(235, 241, 234) - Light tint backgrounds */
  --falcon-sage-light: #f4f7f4;   /* Section alternate background */
  --falcon-gray: #6b7280;         /* Secondary text */
  --falcon-scrollbar: #425538;    /* Custom branded scrollbar thumb */
}
```

### B. Typography
- **Heading Fonts:** `OrkneyBold` (700), `GothamBold` (700), `GothamBlack` (900), `Outfit`
- **Body Fonts:** `GothamBookRegular` (400), `Plus Jakarta Sans` (400, 500, 600), `Arial`, `sans-serif`
- **Arabic Typography:** `Cairo` (400, 600, 700, 800) with automatic RTL ligature rendering.
- **Fluid Type Scale:**
  - `Hero Title`: `clamp(2rem, 5vw, 4.5rem)` (32px – 72px), `line-height: 1.12`
  - `Section Title`: `clamp(1.75rem, 3.5vw, 3rem)` (28px – 48px), `line-height: 1.2`
  - `Subheading`: `clamp(1.125rem, 2vw, 1.5rem)` (18px – 24px)
  - `Body Large`: `1.125rem` (18px), `line-height: 1.6`
  - `Body Regular`: `1rem` (16px), `line-height: 1.5`
  - `Menu Nav Items`: `13px`, `font-weight: 700`, uppercase, letter-spacing: `0.5px`
  - `Microcopy / Badges`: `10px – 12px`, uppercase, tracking-wider

### C. Breakpoints & Grid Containers
- **CSS Breakpoints:**
  - `sm`: `640px`
  - `md`: `768px`
  - `lg`: `1024px`
  - `xl`: `1280px`
  - `2xl`: `1536px`
- **Container Widths:**
  - Mobile: `w-[90%] mx-auto`
  - Tablet: `w-[85%] mx-auto`
  - Desktop: `w-[80%] mx-auto` (max-width `1280px` / `1440px`)

---

## 3. Structural Section-by-Section Breakdown

### 1. Sticky Header (`<app-header>`)
- **Height:** 64px on desktop (`xl:block`), 60px on mobile (`xl:hidden`).
- **Background:** `#0e130d` / `#101110` with bottom border `rgba(255, 255, 255, 0.08)`.
- **Layout:**
  - **Left (10% width):** Brand logo (White Diamond / Falcon Pack).
  - **Middle (58% width):** `OrkneyBold` navigation:
    - `OUR COMPANY` (hover opens dropdown card with rounded-xl buttons).
    - `CATEGORIES` (mega menu linking to distinct product categories).
    - `INDUSTRY WE SERVE` (dropdown).
    - `BUSINESS DIVISIONS` (dropdown).
    - `CAREERS` (direct link).
    - `SHOP ONLINE` (highlighted in `#7dc242`).
  - **Right (16% width):** Pill search input (`bg-white/30 rounded-full px-3 py-1`).
  - **Far Right (10% width):** Language switch pill toggle (`EN` / `AR`).
  - **Mobile:** Hamburger button on left/right opens sliding drawer with search, accordion submenus, and contact links.

### 2. Hero / Banner Slider (`<app-hero>`)
- High-impact widescreen banner slider / video presentation.
- Title with dual-color gradient accent (`#7dc242` parrot green).
- Primary CTA (`Explore Product Range`) & Secondary CTA (`Request Bulk Quote`).
- Autoplay interval: 6,000ms with pause on hover, manual pagination controls, and slide numbers (`01 / 03`).

### 3. Business Verticals (`<app-business-verticals>`)
- **Signature Feature:** Side-pinned `-rotate-90 OrkneyBold` vertical text: `BUSINESS VERTICALS`.
- **Vertical 1 (FALCON PACKAGING):**
  - Text: Left (55% width on desktop) | Image + Overlapping Badge Icon: Right (45% width).
  - Title: `FALCON PACKAGING` (FALCON in `#006a2a`, PACKAGING in `#7dc242`).
  - Copy: Diversified catalogue exceeding 3,000 packaging SKUs.
  - "Read more" link in `#7dc242`.
- **Vertical 2 (FALCON DETERGENTS):**
  - Alternate layout (Image on right/left) with overlapping hygiene chemical icon.
  - Title: `FALCON DETERGENTS` (FALCON in `#006a2a`, DETERGENTS in `#7dc242`).
  - Copy: Commercial and institutional cleaning chemicals, kitchen hygiene, disinfectants.
  - "Read more" link in `#7dc242`.

### 4. Over Three Decades of Expertise (`<app-our-presence>`)
- **Background:** Deep green surface (`bg-falconUS-bg`) with global presence map graphic on right.
- **Side Label:** `-rotate-90 OrkneyBold "OUR PRESENCE"`.
- **Headlines:**
  - `OVER THREE DECADES OF EXPERTISE IN DEVELOPING & MARKETING PREMIUM DISPOSABLE PRODUCTS`.
  - Massive Counter: `65+ COUNTRIES` in `#7dc242`.
- **CTA:** `READ MORE` button (`bg-[#7dc242] text-white px-4 py-2 rounded-lg`) with arrow pointing to `/our-presence`.

### 5. Customize Your Packaging (`<app-customize-your-packaging>`)
- **Background:** Immersive full-screen visual / video (`h-screen bg-cover bg-bottom`).
- **Side Label:** `-rotate-90 OrkneyBold "CUSTOMIZE YOUR PACKAGING"`.
- **Headlines:** `CUSTOMIZE` (`#7dc242`) `YOUR PACKAGING` (White).
- **Core Message:** Custom logo embossing, bespoke portion sizing, multi-color printing, fast delivery, flexible payment terms.
- **Action:** Direct quote inquiry button.

### 6. Global Presence (`<app-global-presence>`)
- **Side Label:** `-rotate-90 OrkneyBold "GLOBAL PRESENCE"`.
- **Background Video:** Looping background video showing worldwide operations.
- **Floating Overlay Card:**
  - **8 BRANCHES** (`GothamBlack text-xl text-[#006a2a]`, icon badge).
  - **24 SALES CENTERS** (`GothamBlack text-xl text-[#006a2a]`, icon badge).
  - Location Search Box: `"Select your nearby location"` dropdown input.

### 7. Global Footer (`<app-footer>`)
- `#1d221e` dark background with 4 columns:
  - Column 1: Logo, company mission statement, social media round icons.
  - Column 2: Quick Links (Home, Services, Products, Checkout, Contact).
  - Column 3: Core Service Offerings (Foil Containers, Bamboo Sticks, Thermal Paper, Catering).
  - Column 4: Location address, phone number, email contact.
  - Subfooter: Copyright and developer credits.

---

## 4. Key Fixes & Implementation Guidelines for Subsequent Phases

1. **Fix Horizontal Stacking ("kuch row wal col mein show ho raha ha"):**
   - In Tailwind, ensure responsive classes use `flex flex-col xl:flex-row items-center` with explicit desktop widths (`w-full xl:w-[55%]` and `xl:w-[45%]`).
   - Remove any conflicting Bootstrap styles where `.row` or `.col` unintentionally enforces vertical wrapping.
   - Global Presence stats must sit side-by-side in a horizontal row (`flex justify-between items-center w-[85%]`).
2. **Prevent Image Tiling:**
   - Always use `<img className="w-full h-full object-cover object-center" />` or explicit `bg-no-repeat bg-cover bg-center` to eliminate repeating tiles on ultrawide viewports.
3. **Database Architecture:**
   - Models: `Category` (nested, multilingual), `Product` (specs, price, packing, category), `Order`, `Banner`, `QuoteRequest`, `ContactMessage`, `Settings`.
   - Seed scripts ready for initial catalogue and PDF import.
4. **Playwright Visual Verification:**
   - Script `scripts/capture.ts` configured across all 5 standard viewports (1920, 1440, 1024, 768, 390) and RTL mode.
