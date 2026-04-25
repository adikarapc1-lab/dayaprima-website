# Dayaprima Deployment Checklist

## Target Setup

- `dayaprima.id`: Next.js frontend on Vercel.
- `cms.dayaprima.id`: Strapi CMS on Railway.
- PostgreSQL: Railway managed database.
- Media uploads: Cloudinary.
- DNS: DomaiNesia.

## Cloudinary

Create a Cloudinary account and copy:

- Cloud name
- API key
- API secret

Use these variable names in Railway:

```bash
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
CLOUDINARY_FOLDER=dayaprima
```

Local development can leave these empty. Strapi will use `apps/cms/public/uploads` locally.

## Railway Strapi Variables

```bash
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://...
APP_KEYS=random_key_1,random_key_2
API_TOKEN_SALT=random_token_salt
ADMIN_JWT_SECRET=random_admin_secret
TRANSFER_TOKEN_SALT=random_transfer_salt
JWT_SECRET=random_jwt_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
CLOUDINARY_FOLDER=dayaprima
```

Generate random secrets locally with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Vercel Frontend Variables

```bash
NEXT_PUBLIC_SITE_URL=https://dayaprima.id
NEXT_PUBLIC_STRAPI_URL=https://cms.dayaprima.id
NEXT_PUBLIC_WHATSAPP_NUMBER=62xxxxxxxxxxx
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=
STRAPI_API_TOKEN=
```

Add `STRAPI_API_TOKEN` after creating a token in Strapi admin.

## DNS

Add the exact DNS records shown by Vercel and Railway inside DomaiNesia DNS management.

Common shape:

- `dayaprima.id` points to Vercel.
- `www.dayaprima.id` points to Vercel.
- `cms.dayaprima.id` points to Railway.

Always copy the final record values from Vercel/Railway because they can vary by account/project.
