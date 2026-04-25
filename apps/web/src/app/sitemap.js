import { getArticles, getProjects } from "@/lib/cms";

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [projects, articles] = await Promise.all([getProjects(), getArticles()]);

  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/blog`, lastModified: new Date() },
    ...projects.map((project) => ({ url: `${siteUrl}/perumahan/${project.slug}`, lastModified: new Date() })),
    ...articles.map((article) => ({ url: `${siteUrl}/blog/${article.slug}`, lastModified: new Date() }))
  ];
}
