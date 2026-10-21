# Project Context: White Diamond (Dentia Next)

> **Persistent Architecture, Styling & Convention Reference**  
> *Consult this file before beginning any task. Do not perform redundant full-project scans.*

---

## 1. Technology Stack

- **Framework**: Next.js 16.1.6 (App Router, Turbopack / Webpack support)
- **Runtime & UI**: React 19.2.3, React DOM 19.2.3, TypeScript 5.9.3
- **Styling**: Tailwind CSS 3.4.19, PostCSS 8.5.29, Autoprefixer 10.6.1, Vanilla CSS Variables (`app/globals.css`), Legacy Theme Assets (`public/css/style.css`, `public/css/bootstrap.min.css`)
- **Animation & Transitions**: Framer Motion 14.1.0
- **Icons**: Lucide React 1.55.0, FontAwesome / ET-Line (legacy imports)
- **Database & ORM**: Prisma 6.3.0 with SQLite/PostgreSQL support
- **State & Context**: React Context (`LanguageContext`, `CartContext`, `ToastContext`)
- **Internationalization (i18n)**: Custom context with English (`ltr`) and Arabic (`rtl`, Cairo font) support + `next-intl` (4.14.9)
- **Validation**: Zod 4.6.5
- **Utilities**: `clsx` 2.1.1, `tailwind-merge` 3.7.0 (`cn` utility in `lib/utils.ts`)

---

## 2. Project Architecture & Directory Structure

```
whitediamond/
├── app/                        # Next.js App Router root
│   ├── (site)/                 # Public-facing storefront & brand routes
│   │   ├── page.tsx            # Main landing / home page
│   │   ├── about/              # About Us & Company details
│   │   ├── checkout/           # Cart checkout & order submission
│   │   ├── contact/            # Contact form & branch inquiries
│   │   ├── our-presence/       # Regional & international distribution map
│   │   ├── products/           # Product catalog with filterable categories
│   │   ├── services/           # Industry solutions (HORECA, healthcare, etc.)
│   │   └── layout.tsx          # Site sub-layout
│   ├── admin/                  # Backoffice management routes
│   │   ├── layout.tsx          # Admin sidebar & header layout
│   │   ├── login/              # Admin authentication screen
│   │   └── products/           # Admin product management & CRUD
│   ├── api/                    # Route handlers (auth, categories, health, products, upload)
│   ├── globals.css             # Tailwind base & CSS theme tokens
│   └── layout.tsx              # Root HTML layout with providers and fonts
├── components/                 # Shared UI and layout components
│   ├── Header.tsx              # Top contact bar + sticky navigation + mega-menus
│   ├── HeaderWrapper.tsx       # Route-aware header wrapper
│   ├── Footer.tsx              # Brand footer with links, socials, newsletter
│   └── ui/                     # Reusable design system components
│       ├── Breadcrumb.tsx      # Breadcrumb navigation
│       ├── Button.tsx          # Standardized button variants (primary, accent, secondary, etc.)
│       ├── Container.tsx       # Standard width layout wrapper
│       ├── Counter.tsx         # Animated numerical count-up
│       ├── Loader.tsx          # Loading spinners
│       ├── Modal.tsx           # Accessible modal dialog
│       ├── PageTransition.tsx  # Route transition wrapper
│       ├── ProductCard.tsx     # E-commerce product card with cart actions
│       ├── ScrollReveal.tsx    # Scroll animation trigger
│       ├── SectionTitle.tsx    # Section titles with badges and subtitles
│       ├── Skeleton.tsx        # Skeleton loaders
│       └── Toast.tsx           # Toast notification alerts
├── context/                    # Global React state providers
│   ├── CartContext.tsx         # Shopping cart state & local storage sync
│   ├── LanguageContext.tsx     # Bilingual language toggle (EN/AR) & RTL direction
│   └── ToastContext.tsx        # Dynamic toast notifications
├── lib/                        # Core utilities and data helpers
│   ├── auth.ts                 # JWT / session authentication
│   ├── categories.ts           # Product categories taxonomy & icons
│   ├── content.ts              # Static content & translations data
│   ├── db.ts                   # Prisma client instance
│   ├── i18n/                   # Translation dictionaries
│   └── utils.ts                # Class merging helper (`cn`)
├── public/                     # Static media and legacy stylesheets
│   ├── css/                    # Legacy templates, style.css, scheme-01.css
│   └── images/                 # Product and banner images
├── tailwind.config.ts          # Tailwind theme tokens & color extensions
└── tsconfig.json               # TypeScript path alias `@/*` mapping
```

---

## 3. Styling & Theme System

### Design Palette Specification: Red, White & Bluish Purple

| Token / Color | HEX | Tailwind Role | Purpose / Application |
|---|---|---|---|
| **Primary Red** | `#E63946` | `bg-primary`, `text-primary`, `theme-red` | Primary CTAs, high-priority actions, badges, prominent highlights |
| **Pure White** | `#FFFFFF` | `bg-background`, `bg-card`, `text-white` | Dominant surfaces, cards, main backgrounds, contrast text |
| **Bluish Purple** | `#6366F1` | `bg-accent`, `text-accent`, `theme-purple` | Secondary CTAs, active navigation items, subtle accents, interactive icons |
| **Dark Navy** | `#1E1B4B` | `bg-secondary`, `theme-navy` | Main typography headings, dark headers, dark hero overlays, dark footers |
| **Light Lavender** | `#EEF2FF` | `bg-muted`, `theme-lavender` | Soft section backdrops, subtle card borders, pill tag backgrounds |
| **Neutral Gray** | `#64748B` | `text-muted-foreground`, `theme-gray` | Secondary body text, borders, placeholders, inactive states |

### Centralized CSS Variables (`app/globals.css`)
- `--primary`: `#E63946` (hover: `#D62839`, rgb: `230, 57, 70`)
- `--secondary`: `#1E1B4B` (hover: `#2E2A72`)
- `--accent`: `#6366F1` (hover: `#4F46E5`, rgb: `99, 102, 241`)
- `--background`: `#FFFFFF`
- `--foreground`: `#1E1B4B`
- `--muted`: `#EEF2FF`
- `--muted-foreground`: `#64748B`
- `--card`: `#FFFFFF`
- `--card-foreground`: `#1E1B4B`
- `--border`: `#E2E8F0`
- `--ring`: `#E63946`

---

## 4. Reusable UI Components & Conventions

1. **Button (`components/ui/Button.tsx`)**:
   - `primary`: Red button (`#E63946`) with hover dark red, white text.
   - `accent`: Bluish Purple button (`#6366F1`) with white text.
   - `secondary`: Dark Navy (`#1E1B4B`) with white text.
   - `outline`: Border `#CBD5E1` with Dark Navy text and Light Lavender hover.
   - `ghost`: Transparent with Light Lavender hover.
2. **ProductCard (`components/ui/ProductCard.tsx`)**:
   - Displays image, category badge (Lavender with Bluish Purple text), price (Primary Red or Navy), and Add-to-Cart CTA button.
3. **SectionTitle (`components/ui/SectionTitle.tsx`)**:
   - Badge pill: Light Lavender backdrop with Bluish Purple border/text.
   - Title: Dark Navy heading with optional Red or Purple gradient accent.
4. **Header (`components/Header.tsx`)**:
   - Top contact bar: Dark Navy (`#1E1B4B`) with Bluish Purple accents and Red emergency/quote badges.
   - Main nav bar: High-contrast white/glassmorphism or Dark Navy, with Bluish Purple active indicators and Red CTA buttons.
5. **Footer (`components/Footer.tsx`)**:
   - Dark Navy background (`#1E1B4B`), pure white headings, soft lavender/gray text, Bluish Purple hover states, Red subscription button.

---

## 5. Development Rules & Workflow Conventions

1. **Do Not Scan Entire Project Repeatedly**:
   - Always reference this `PROJECT_CONTEXT.md` first.
   - Inspect only files needed for the current task.
2. **Preserve Business Logic & Functionality**:
   - Keep shopping cart, language switching, forms, APIs, and routing intact.
   - Only modify styling classes, CSS variables, and design tokens.
3. **Responsive Design**:
   - Verify layout on mobile (375px), tablet (768px), and desktop (1280px+).
4. **Accessible Color Contrast**:
   - White text on Red (`#E63946`), Bluish Purple (`#6366F1`), and Dark Navy (`#1E1B4B`).
   - Dark Navy (`#1E1B4B`) or Neutral Gray (`#64748B`) text on Pure White (`#FFFFFF`) and Light Lavender (`#EEF2FF`).

---

## 6. Completed Theme Migration & Validation Log

### Theme Transition Summary
- **Palette**: Red (`#E63946`), Pure White (`#FFFFFF`), Bluish Purple (`#6366F1` / `#818CF8`), Dark Navy (`#1E1B4B`), Light Lavender (`#EEF2FF`).
- **Backward Compatibility**: Legacy `falcon` tokens (`falcon-green`, `falcon-parrot`, `falcon-black`, `falcon-sage`) mapped to the new palette in `tailwind.config.ts` and `app/globals.css`, ensuring zero breaks on unmigrated legacy elements.

### Modified Files
1. **Config & Theme Foundations**:
   - [tailwind.config.ts](file:///d:/heapware/whitedia/whitediamond/tailwind.config.ts)
   - [app/globals.css](file:///d:/heapware/whitedia/whitediamond/app/globals.css)
   - [app/layout.tsx](file:///d:/heapware/whitedia/whitediamond/app/layout.tsx)
   - [public/css/colors/scheme-01.css](file:///d:/heapware/whitedia/whitediamond/public/css/colors/scheme-01.css)
   - [reference/tokens.json](file:///d:/heapware/whitedia/whitediamond/reference/tokens.json)
2. **Shared UI Components**:
   - [components/ui/Button.tsx](file:///d:/heapware/whitedia/whitediamond/components/ui/Button.tsx)
   - [components/ui/ProductCard.tsx](file:///d:/heapware/whitedia/whitediamond/components/ui/ProductCard.tsx)
   - [components/ui/SectionTitle.tsx](file:///d:/heapware/whitedia/whitediamond/components/ui/SectionTitle.tsx)
   - [components/ui/Loader.tsx](file:///d:/heapware/whitedia/whitediamond/components/ui/Loader.tsx)
   - [components/ui/Breadcrumb.tsx](file:///d:/heapware/whitedia/whitediamond/components/ui/Breadcrumb.tsx)
   - [components/Header.tsx](file:///d:/heapware/whitedia/whitediamond/components/Header.tsx)
   - [components/Footer.tsx](file:///d:/heapware/whitedia/whitediamond/components/Footer.tsx)
3. **Storefront Routes (`app/(site)`)**:
   - [app/(site)/page.tsx](file:///d:/heapware/whitedia/whitediamond/app/(site)/page.tsx)
   - [app/(site)/products/page.tsx](file:///d:/heapware/whitedia/whitediamond/app/(site)/products/page.tsx)
   - [app/(site)/about/page.tsx](file:///d:/heapware/whitedia/whitediamond/app/(site)/about/page.tsx)
   - [app/(site)/contact/page.tsx](file:///d:/heapware/whitedia/whitediamond/app/(site)/contact/page.tsx)
   - [app/(site)/services/page.tsx](file:///d:/heapware/whitedia/whitediamond/app/(site)/services/page.tsx)
   - [app/(site)/our-presence/page.tsx](file:///d:/heapware/whitedia/whitediamond/app/(site)/our-presence/page.tsx)
   - [app/(site)/checkout/page.tsx](file:///d:/heapware/whitedia/whitediamond/app/(site)/checkout/page.tsx)
4. **Admin Dashboard Routes (`app/admin`)**:
   - [app/admin/layout.tsx](file:///d:/heapware/whitedia/whitediamond/app/admin/layout.tsx)
   - [app/admin/login/page.tsx](file:///d:/heapware/whitedia/whitediamond/app/admin/login/page.tsx)
   - [app/admin/products/page.tsx](file:///d:/heapware/whitedia/whitediamond/app/admin/products/page.tsx)
5. **Persistent Memory & Rules**:
   - [PROJECT_CONTEXT.md](file:///d:/heapware/whitedia/whitediamond/PROJECT_CONTEXT.md)
   - [.cursor/rules/project-context.mdc](file:///d:/heapware/whitedia/whitediamond/.cursor/rules/project-context.mdc)

### Validation
- **TypeScript**: `npx tsc --noEmit` passed with 0 errors.
- **Functionality**: Shopping cart, language switcher, forms, APIs, and routing preserved completely.

### Full-Screen (100vh) Section Architecture
- Every major section on the home page (`app/(site)/page.tsx`) is styled with `min-h-screen lg:h-screen flex items-center justify-center relative snap-start` (Hero: `min-h-[calc(100vh-76px)] lg:h-[calc(100vh-76px)]` to account for sticky header).
- Business Verticals are presented side-by-side in a responsive 2-column grid (`grid grid-cols-1 lg:grid-cols-2`) so the entire division overview fits cleanly within 1 screen height without vertical overflow.
- Sub-pages (`about`, `contact`, `services`, `checkout`, `products`, `our-presence`) updated to `min-h-[calc(100vh-76px)] flex items-center justify-center` ensuring a full-viewport layout experience.

### Zero Green Policy Enforcement
- Removed all remaining green/emerald traces:
  - Replaced legacy greenish hero background `bg-[#0a120c]` with Dark Navy `bg-[#12102E]`.
  - Replaced WhatsApp green `bg-[#25D366]` with Primary Red `bg-[#E63946]`.
  - Replaced ProductCard `emerald` in-stock and added-state indicators with Bluish Purple `bg-[#6366F1]` / Light Lavender `bg-[#EEF2FF]`.
  - Replaced ToastContext success notification greens with Dark Navy & Bluish Purple (`#12102E` / `#6366F1`).
  - Replaced admin products table `text-emerald-400` with Bluish Purple `text-[#818CF8]`.
- Cleared Next.js compilation cache (`.next/dev`) to guarantee immediate live styling reflection.
