# White Diamond — Website & Shop

Next.js 16 · React 19 · TypeScript · Tailwind CSS · Prisma (MySQL / MariaDB) · English + Arabic (Bilingual LTR / RTL).  
Food packaging & disposables manufacturer & supplier based in Faisalabad, Pakistan.

---

## 1. Quick Start (Local Development)

### Prerequisites
* **Node.js**: v20.x or v22.x LTS
* **Docker Desktop**: for local MariaDB (or an existing MySQL / MariaDB instance)
* **npm**: v10+

### Setup Steps
```bash
# 1. Install dependencies
npm install

# 2. Configure local environment
# Create .env.local (gitignored) with:
# DATABASE_URL="mysql://whitediamond:whitediamond_local@127.0.0.1:3307/whitediamond"

# 3. Start local MariaDB database in Docker
npm run db:up

# 4. Push Prisma schema to the local database
npm run db:push

# 5. Seed categories, starter products, and default settings
npm run db:seed -- --confirm

# (Optional) Seed demo orders and test contact messages
npm run db:seed-demo

# 6. Start the development server (runs on port 3001)
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.  
*(Port 3000 is intentionally kept free for other local projects).*

---

## 2. Environment Variables Reference

Create a `.env` file for production and `.env.local` for local development.

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **Yes** | MySQL / MariaDB connection URI. | `mysql://user:pass@127.0.0.1:3307/whitediamond` |
| `ADMIN_USERNAME` | **Yes** | Admin login username. | `admin` |
| `ADMIN_EMAIL` | **Yes** | Admin login fallback email. | `admin@yourdomain.pk` |
| `ADMIN_PASSWORD_HASH` | **Yes** | Bcrypt hash generated via `npm run hash-password`. | `\$2a\$12\$eXampleHash...` |
| `ADMIN_PASSWORD` | No | Plain text password fallback if hash is unset (local development only). | `a-long-random-password` |
| `ADMIN_JWT_SECRET` | **Yes** | Random 32+ character string to sign admin session tokens. | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Canonical domain for sitemaps, canonical tags, and Open Graph. | `https://whitediamond.pk` |
| `ORDER_LINK_SECRET` | No | Secret token for signing customer order receipt links (defaults to `ADMIN_JWT_SECRET`). | Random 32+ characters |
| `CLOUDINARY_CLOUD_NAME` | Optional | Cloudinary cloud name for admin product photo uploads. | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Optional | Cloudinary API Key. | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Optional | Cloudinary API Secret. | `your_api_secret` |
| `RESEND_API_KEY` | Optional | API key from [resend.com](https://resend.com) for new order email alerts. | `re_xxx` |
| `ORDER_NOTIFY_EMAIL` | Optional | Destination email address(es) for order notifications. | `orders@whitediamond.com` |

---

## 3. Admin Setup & Password Hashing

To secure the admin panel, generate a salted bcrypt hash:

```bash
npm run hash-password
```
Type your chosen password when prompted. The script outputs a pre-escaped line:
```env
ADMIN_PASSWORD_HASH="\$2a\$12\$..."
```
Copy and paste this line into your `.env` file.

### Accessing the Backoffice
* **URL**: [http://localhost:3001/admin/login](http://localhost:3001/admin/login) (or `https://yourdomain.com/admin/login`)
* Log in with `ADMIN_USERNAME` (or `ADMIN_EMAIL`) and the password from your `.env`. There is no default password.

---

## 4. Database Commands & Seeding

* `npm run db:up`: Launch local MariaDB container (`wd-mysql`) on port `3307`.
* `npm run db:push`: Push Prisma schema to the database (safe additive updates).
* `npm run db:seed -- --confirm`: Seeds categories, products, and default site settings. Safe to run repeatedly (only adds missing records).
* `npm run db:seed -- --confirm --overwrite`: Updates existing seed-owned categories and products with values from `data/catalog.ts` (preserves orders, messages, and custom products).
* `npm run db:seed-demo`: Inserts sample orders and enquiries for testing.
* `npm run db:studio`: Opens visual Prisma database inspector at `http://localhost:5555`.

> **Safety Guard**: Prisma commands and seed scripts will automatically refuse to run against remote databases unless `ALLOW_REMOTE_DB=1` is explicitly specified.

---

## 5. Deployment Guide: Hostinger (Node.js Application)

Hostinger supports Next.js applications via **Node.js Selector** in hPanel / cPanel.

### Step 1: Create Database on Hostinger
1. Go to **hPanel** $\rightarrow$ **Databases** $\rightarrow$ **MySQL Databases**.
2. Create a new database (e.g. `u123456_whitediamond`) and user with a strong password.
3. Note the database name, username, and password.

### Step 2: Configure Node.js Application
1. In hPanel, go to **Websites** $\rightarrow$ **Node.js**.
2. Click **Create Application**:
   * **Node.js Version**: Select `20.x` or `22.x` LTS.
   * **Application Mode**: `Production`.
   * **Application Root**: e.g. `public_html` or a subfolder.
   * **Application Startup File**: `server.js` or `node_modules/next/dist/bin/next` with argument `start`.
3. Save the application.

### Step 3: Deploy Project Files
You can deploy using Git or FTP:
* **Option A (Git repository)**: Use Hostinger's Git deployment feature to clone directly into the application root.
* **Option B (ZIP upload)**: Build locally or upload the repository files (excluding `node_modules`, `.next/dev`, and `.git`).

### Step 4: Configure Production `.env`
Inside the application root on Hostinger, create a `.env` file:
```env
NODE_ENV=production
DATABASE_URL="mysql://u123456_user:YourStrongPassword@localhost:3306/u123456_whitediamond"
NEXT_PUBLIC_SITE_URL=https://whitediamond.pk

ADMIN_USERNAME=admin
ADMIN_EMAIL=contact@whitediamond.pk
ADMIN_PASSWORD_HASH="\$2a\$12\$..."
ADMIN_JWT_SECRET="generate_a_random_32_char_secret_here"

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Step 5: Install, Push Schema & Build
In the Hostinger Terminal or SSH session:
```bash
# 1. Install production dependencies
npm install

# 2. Push database schema to live database
ALLOW_REMOTE_DB=1 npm run db:push

# 3. Seed initial catalogue & settings
ALLOW_REMOTE_DB=1 npm run db:seed -- --confirm

# 4. Build optimized Next.js production bundle
npm run build
```

### Step 6: Start Application
Restart the application in hPanel Node.js dashboard. Your site is live!

---

## 6. Pre-Launch Content Checklist (Client Verification)

Before replacing dummy data with live owner information, verify the following:

| Item / Claim | Location on Site | File Reference |
| :--- | :--- | :--- |
| Founding year ("10+ years") | Homepage Hero Badge | `lib/i18n/translations.ts` $\rightarrow$ `home.hero.experience` |
| "50+ cities served nationwide" | Presence Section | `components/home/PresenceSection.tsx` & translations |
| Regional hubs & delivery hubs | Presence Section & Map | `components/home/PakistanMap.tsx` |
| Dispatch time ("24–48 hours") | Presence Section | `home.presence.dispatchValue` |
| Production capacity ("10,000+ tons") | Presence Section | `home.presence.capacityValue` |
| Bank account title, number & IBAN | Checkout / Settings | Admin $\rightarrow$ Settings $\rightarrow$ `bank_details` |
| WhatsApp number & Contact phone | Header, Footer, Contact | Admin $\rightarrow$ Settings $\rightarrow$ `whatsapp_number`, `contact_phone` |
| Social media links | Footer | Admin $\rightarrow$ Settings |
| Real product photos | Catalog / Shop | Admin $\rightarrow$ Products (upload high-res originals) |
