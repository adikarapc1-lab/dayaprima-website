# Dayaprima Real Estate Platform

Full-stack local development setup for the Dayaprima corporate website, project showcase, lead generation, blog, and Strapi CMS admin panel.

## Stack

- `apps/web`: Next.js App Router, Tailwind CSS, SEO metadata, sitemap, robots, inquiry API, analytics helpers.
- `apps/cms`: Strapi CMS with SQLite for local development, media library, project/blog/lead content types.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment files:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/cms/.env.example apps/cms/.env
```

3. Start both apps:

```bash
npm run dev
```

- Website: `http://localhost:3000`
- Strapi admin: `http://localhost:1337/admin`

4. Create the first Strapi admin user in the browser, then add projects, articles, testimonials, and global settings.

## Content Model

Projects, house types, facilities, gallery images, articles, testimonials, and leads are managed in Strapi. The frontend fetches from Strapi through `apps/web/src/lib/cms.js`; sample data is used only as a local development fallback when Strapi is not running yet.

## Environment

Set these in `apps/web/.env.local`:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_STRAPI_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_GTM_ID`
- `STRAPI_API_TOKEN` for server-side lead submission if you keep Strapi public permissions locked down.

Set these in production for `apps/cms`:

- `DATABASE_CLIENT=postgres`
- `DATABASE_URL`
- `CLOUDINARY_NAME`
- `CLOUDINARY_KEY`
- `CLOUDINARY_SECRET`
- `CLOUDINARY_FOLDER=dayaprima`

## Production Notes

- Use PostgreSQL for Strapi in production.
- Media uploads are configured for Cloudinary when `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, and `CLOUDINARY_SECRET` are present.
- Add a Strapi API token for frontend read and lead create permissions.
- Deploy `apps/web` to Vercel and Strapi to a Node-capable host.
