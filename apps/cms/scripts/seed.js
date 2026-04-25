console.log(`
Dayaprima CMS seed content is available in apps/web/src/data/sample-content.js.

For the first local run:
1. Start Strapi with npm run dev.
2. Create an admin user at http://localhost:1337/admin.
3. Add the sample projects, articles, testimonials, and global settings through the admin panel.
4. In Settings > Users & Permissions > Roles > Public, enable find/findOne for projects, articles, testimonials, and global-setting.
5. For leads, either enable public create or create a Strapi API token and set STRAPI_API_TOKEN in apps/web/.env.local.
`);
