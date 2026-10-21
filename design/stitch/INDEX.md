# Stitch Design Index

White Diamond Food Packaging. 17 screens organized, copied from `design/stitch-raw/` and `design/Mobile versions + Arabic/`. The originals are untouched.

No `code.html`, `DESIGN.md` or zip files were found anywhere in `design/`. All screens are PNG only.

The images are downscaled so their longest side is 1600px. A full-length desktop page can therefore come out narrow and tall. Desktop or mobile was decided from the layout (top nav vs. hamburger and bottom tab bar), not only from the size ratio.

| Folder | What the screen shows | Desktop/Mobile | Language | Size (px) | Original file | Notes |
|---|---|---|---|---|---|---|
| `home/` | Landing page: hero, industry categories, divisions, best sellers, OEM section, stats, footer | Desktop | English | 345×1600 | `stitch-raw/screen.png` | **Low-res** (full desktop page squeezed to 345px wide; text barely readable). The size ratio looks like mobile, but the layout is desktop. |
| `shop/` | "Direct Commercial Store" catalog: filter sidebar, 4-col product grid, pagination, bulk CTA | Desktop | English | 781×1600 | `stitch-raw/screen (2).png` | |
| `product/` | Product detail: Heavy Duty Foil Container 450ml, gallery, tier pricing, specs, tabs, bundle, related products | Desktop | English | 560×1600 | `stitch-raw/screen (3).png` | Small text (long page) |
| `cart/` | "Your Commercial Shopping Cart": line-item table, order summary, promo code | Desktop | English | 1273×1600 | `stitch-raw/screen (4).png` | Shows an "Empty State Preview" toggle, but only the filled cart is designed |
| `checkout/` | "Secure Commercial Checkout": 3-step stepper, delivery form, payment modes, order summary | Desktop | English | 1600×2730 | `stitch-raw/screen (5).png` | |
| `order-success/` | "Thank you! Your order #WD-1024 has been placed": dispatch details, items, tracking stepper | Desktop | English | 1600×3872 | `stitch-raw/screen (6).png` | |
| `admin-login/` | "Commercial Mill & ERP Management Portal" sign-in card | Desktop | English | 1600×1170 | `stitch-raw/screen (9).png` | Card is cut off at the bottom edge |
| `admin-dashboard/` | "Executive Operations Overview": KPI cards, revenue chart, category donut, recent orders | Desktop | English | 762×1600 | `stitch-raw/screen (8).png` | |
| `admin-products/` | "Packaging Inventory & Catalog Management": SKU table, filters, bulk actions | Desktop | English | 992×1600 | `stitch-raw/screen (11).png` | |
| `admin-product-form/` | "Edit Packaging Specification & Product Details": edit form, pricing tiers, stock, badges | Desktop | English | 1063×1600 | `stitch-raw/screen (7).png` | Edit mode (no separate "new product" design) |
| `admin-orders/` | "Commercial Orders & Dispatch Management": status cards, orders table, consignment detail panel | Desktop | English | 970×1600 | `stitch-raw/screen (10).png` | |
| `mobile/home/` | Mobile home: hero, category grid, best sellers, trust points, bottom tab bar | Mobile | English | 189×1600 | `Mobile versions + Arabic/screen (15).png` | **Low-res**; identified from layout |
| `mobile/shop/` | Mobile "Commercial Store": filter chips, 2-col product grid, bottom tab bar | Mobile | English | 257×1600 | `Mobile versions + Arabic/screen (17).png` | **Low-res** (mostly readable) |
| `mobile/product/` | Mobile "Product Details": gallery, tier pricing, spec grid, sticky add-to-cart bar | Mobile | English | 353×1600 | `Mobile versions + Arabic/screen (12).png` | |
| `mobile/cart/` | Mobile "Quote Cart": line items, contract code, procurement summary, sticky checkout | Mobile | English | 370×1600 | `Mobile versions + Arabic/screen (13).png` | |
| `mobile/checkout/` | Mobile "Secure Commercial Checkout": stepper, delivery form, payment options, sticky Place Order | Mobile | English | 293×1600 | `Mobile versions + Arabic/screen (14).png` | |
| `arabic/mobile/home/` | Arabic RTL mobile home: hero, categories, best sellers, WhatsApp CTA, footer | Mobile | Arabic | 199×1600 | `Mobile versions + Arabic/screen (16).png` | **Low-res**. The bottom of the page has a second footer that is still in English (an untranslated leftover?) |

No duplicates. Every page/type has exactly one image, so there are no `screen-v2.png` files. No image contains several screens side by side.

## MISSING

**Desktop pages:** none. All 11 have a design.

**Mobile (English):** none. Home, shop, product, cart and checkout all have a design.

**Arabic:**
- **Arabic desktop home**: missing. Only the Arabic *mobile* home exists.

**Other gaps (not required, for your info):**
- `DESIGN.md`: none exists anywhere in `design/`.
- No design for the admin **Categories** and **Settings** pages, although both appear in the admin sidebar.
- No mobile versions of order-success or any admin page. No Arabic versions of any page except mobile home.
- No empty-cart state and no "add new product" variant of the admin form.
