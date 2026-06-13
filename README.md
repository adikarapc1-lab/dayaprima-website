# Dayaprima Real Estate Platform

Monorepo for the **Dayaprima Nusawisesa** corporate website — a property developer based in Makassar. It contains a Next.js marketing frontend (project showcase, house-type detail pages, blog, lead capture) and a Strapi CMS that powers all editable content.

> **For AI agents / new contributors:** this README is the source of truth for how the repo is wired. The most important thing to understand is the **graceful-fallback data flow**: the frontend always renders even when Strapi is down, because [`apps/web/src/lib/cms.js`](apps/web/src/lib/cms.js) falls back to static sample data in [`apps/web/src/data/sample-content.js`](apps/web/src/data/sample-content.js). See [Data flow](#data-flow).

## Stack

| Area | Tech |
| --- | --- |
| Monorepo | npm workspaces + `concurrently` |
| Frontend (`apps/web`) | Next.js 14 (App Router), React 18, Tailwind CSS 3, `lucide-react`, `@tailwindcss/typography` |
| CMS (`apps/cms`) | Strapi 5, SQLite locally / PostgreSQL in prod, Cloudinary upload provider |
| Language | JavaScript (no TypeScript), `.jsx` for React components |

## Repository layout

```
dayaprima-website/
├── package.json              # workspace root; dev/build/lint/seed scripts
├── DEPLOYMENT.md             # production deploy checklist (Vercel + Railway + Cloudinary)
├── ASSET_SIZE_GUIDE.md       # image/asset sizing reference
├── DENAH_REFERENCE_EXTRACTION.md
├── apps/
│   ├── web/                  # Next.js frontend
│   │   ├── .env.example
│   │   └── src/
│   │       ├── app/                      # App Router routes
│   │       │   ├── layout.jsx            # root layout; loads globals, Header/Footer/WhatsApp
│   │       │   ├── page.jsx              # homepage
│   │       │   ├── robots.js / sitemap.js
│   │       │   ├── blog/                 # /blog and /blog/[slug]
│   │       │   ├── perumahan/            # /perumahan/[slug] and /perumahan/[slug]/[typeSlug]
│   │       │   └── api/
│   │       │       ├── leads/route.js    # POST lead → Strapi, falls back to .local/leads.json
│   │       │       └── brochure/route.js # GET generated PDF brochure (no deps, hand-built PDF)
│   │       ├── components/               # Header, Footer, carousels, InquiryForm, WhatsappButton, Analytics
│   │       ├── lib/
│   │       │   ├── cms.js                # all Strapi fetching + sample-data fallback
│   │       │   └── analytics.js          # GA/GTM helpers
│   │       └── data/sample-content.js    # fallback content used when Strapi is unreachable
│   └── cms/                  # Strapi CMS
│       ├── .env.example
│       ├── scripts/seed.js   # `npm run seed`
│       └── src/
│           ├── api/          # content types: project, article, testimonial, lead, global-setting
│           └── components/   # project.house-type, project.house-feature, project.facility, shared.social-link
```

## Local setup

Requirements: Node.js 18+ and npm. Run everything from the repo root.

1. Install dependencies (installs all workspaces):

   ```bash
   npm install
   ```

2. Copy environment files:

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   cp apps/cms/.env.example apps/cms/.env
   ```

3. Start both apps together:

   ```bash
   npm run dev
   ```

   - Website: `http://localhost:3000`
   - Strapi admin: `http://localhost:1337/admin`

4. Create the first Strapi admin user in the browser, then add projects, articles, testimonials, and global settings.

> The frontend works **before** Strapi has any data — it renders the sample content from `apps/web/src/data/sample-content.js`. Strapi only needs to be running/populated to serve real CMS content.

### Root npm scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Runs web + cms concurrently |
| `npm run dev:web` | Next.js dev server only (`apps/web`) |
| `npm run dev:cms` | Strapi `develop` only (`apps/cms`) |
| `npm run build` | Production build of the frontend |
| `npm run lint` | `next lint` on the frontend |
| `npm run clean:web` | Remove the frontend `.next` cache |
| `npm run seed` | Run `apps/cms/scripts/seed.js` against Strapi |

Note: `apps/web` has a `predev` step that deletes `.next` before each `dev` run.

## Data flow

The frontend never calls Strapi directly from components — everything goes through [`apps/web/src/lib/cms.js`](apps/web/src/lib/cms.js):

- Exposes `getGlobals`, `getProjects({ featured })`, `getProject(slug)`, `getHouseType(projectSlug, typeSlug)`, `getArticles`, `getArticle(slug)`, `getTestimonials`, and `submitLead(payload)`.
- Each read uses `fetchJson()`, which calls Strapi with a **2.5s timeout** and `next: { revalidate: 60 }` (ISR). On any failure (timeout, non-200, network) it returns `null`, and the caller substitutes the matching sample dataset. This is why the site stays up when the CMS is down.
- Strapi v5 responses are flattened via `unwrapCollection()`, and media is resolved with `mediaUrl()` / `mediaList()` (prefixes relative Strapi paths with `NEXT_PUBLIC_STRAPI_URL`, passes through absolute Cloudinary URLs). House types are reshaped by `normalizeHouseType()`.
- Project reads use a fixed deep-populate query (`PROJECT_POPULATE`) so hero image, promo banner, video, gallery, house types (with floor plan + gallery + features), and facilities all come back in one call.

Lead submission flow ([`apps/web/src/app/api/leads/route.js`](apps/web/src/app/api/leads/route.js)): the client POSTs to `/api/leads` → `submitLead()` POSTs to Strapi `/api/leads`. If Strapi rejects/unreachable, the lead is appended to `apps/web/.local/leads.json` so no submission is lost.

The brochure endpoint ([`apps/web/src/app/api/brochure/route.js`](apps/web/src/app/api/brochure/route.js)) generates a minimal PDF in pure JS (no library) and returns it as a download.

## CMS content model

Content types live under `apps/cms/src/api/*` (each with `content-types`, `controllers`, `routes`, `services`):

| Content type | Notes |
| --- | --- |
| `project` (collection) | Main showcase entity. Draft & publish enabled. Fields: `name`, `slug` (uid), `excerpt`, `description` (richtext), `heroImage`, `promoBanner`, `video`, `gallery`, `houseTypes[]`, `facilities[]`, `location`, `mapUrl`, `mapEmbedUrl`, `featured`, `promoPriceStart`, `promoPpnStart`, `promoPhone`, `promoAddress`, `seoTitle`, `seoDescription`. |
| `article` (collection) | Blog posts (`/blog`). |
| `testimonial` (collection) | Customer testimonials. |
| `lead` (collection) | Inquiry submissions from the website. |
| `global-setting` (single) | Site-wide settings (e.g. WhatsApp number, social links) consumed in `layout.jsx`. |

Reusable components under `apps/cms/src/components/`:

- `project.house-type` — `name`, `slug`, `size`, `price`, `description`, `bedrooms`, `bathrooms`, `floors`, `carport`, `features[]`, `floorPlanImage`, `gallery`.
- `project.house-feature` — single `label`.
- `project.facility` — facility entry.
- `shared.social-link` — social link entry.

If you change a schema here, also update the populate/normalize logic in `apps/web/src/lib/cms.js` **and** the matching shape in `apps/web/src/data/sample-content.js` so the fallback stays in sync.

## Environment variables

### Frontend — `apps/web/.env.local`

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (used by metadata, sitemap, robots) |
| `NEXT_PUBLIC_STRAPI_URL` | Strapi base URL (defaults to `http://localhost:1337`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Fallback WhatsApp number for the floating button |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID (optional) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager ID (optional) |
| `STRAPI_API_TOKEN` | Server-side token for reads/lead creation when Strapi permissions are locked down |

### CMS — `apps/cms/.env`

Local defaults use SQLite (`DATABASE_CLIENT=sqlite`, `DATABASE_FILENAME=.tmp/data.db`) and require the Strapi secrets (`APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`). Cloudinary vars can be left empty locally — uploads then go to `apps/cms/public/uploads`.

In production set:

- `DATABASE_CLIENT=postgres` and `DATABASE_URL`
- `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`, `CLOUDINARY_FOLDER=dayaprima`

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full checklist. Summary:

- Frontend → **Vercel** (`dayaprima.id`).
- Strapi → **Railway** (`cms.dayaprima.id`) with managed PostgreSQL.
- Media → **Cloudinary** (enabled automatically when the Cloudinary vars are present).
- Generate Strapi secrets with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.
- After deploying Strapi, create an API token and set `STRAPI_API_TOKEN` in Vercel for frontend reads and lead creation.
