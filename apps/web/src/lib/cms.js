import {
  sampleArticles,
  sampleGlobals,
  sampleProjects,
  sampleTestimonials
} from "@/data/sample-content";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const API_TOKEN = process.env.STRAPI_API_TOKEN;

function headers() {
  return API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {};
}

function mediaUrl(value) {
  if (!value) return "/images/dayaprima-hero.png";
  if (typeof value === "string") return value;
  const url = value?.url || value?.data?.attributes?.url;
  if (!url) return "/images/dayaprima-hero.png";
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

function mediaList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(mediaUrl);
  if (Array.isArray(value?.data)) return value.data.map((image) => mediaUrl(image.attributes || image));
  return [];
}

function unwrapCollection(json) {
  return json?.data?.map((item) => ({ id: item.id, ...(item.attributes || item) })) || [];
}

async function fetchJson(path, fallback) {
  try {
    const res = await fetch(`${STRAPI_URL}${path}`, {
      headers: headers(),
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error(`CMS ${res.status}`);
    return await res.json();
  } catch {
    return fallback;
  }
}

export async function getGlobals() {
  const json = await fetchJson("/api/global-setting?populate=*", null);
  const attrs = json?.data?.attributes || json?.data;
  return attrs || sampleGlobals;
}

export async function getProjects({ featured } = {}) {
  const query = featured ? "&filters[featured][$eq]=true" : "";
  const json = await fetchJson(
    `/api/projects?populate=*&sort=publishedAt:desc${query}`,
    null
  );
  if (!json) return featured ? sampleProjects.filter((project) => project.featured) : sampleProjects;

  return unwrapCollection(json).map((project) => ({
    ...project,
    heroImage: mediaUrl(project.heroImage),
    gallery: mediaList(project.gallery),
    houseTypes: project.houseTypes || [],
    facilities: project.facilities?.map((facility) => facility.label || facility) || []
  }));
}

export async function getProject(slug) {
  const json = await fetchJson(`/api/projects?filters[slug][$eq]=${slug}&populate=*`, null);
  const project = json ? unwrapCollection(json)[0] : sampleProjects.find((item) => item.slug === slug);
  if (!project) return null;

  return {
    ...project,
    heroImage: mediaUrl(project.heroImage),
    gallery: mediaList(project.gallery),
    facilities: project.facilities?.map((facility) => facility.label || facility) || []
  };
}

export async function getArticles() {
  const json = await fetchJson("/api/articles?populate=*&sort=publishedAt:desc", null);
  if (!json) return sampleArticles;
  return unwrapCollection(json).map((article) => ({
    ...article,
    coverImage: mediaUrl(article.coverImage)
  }));
}

export async function getArticle(slug) {
  const json = await fetchJson(`/api/articles?filters[slug][$eq]=${slug}&populate=*`, null);
  const article = json ? unwrapCollection(json)[0] : sampleArticles.find((item) => item.slug === slug);
  if (!article) return null;
  return { ...article, coverImage: mediaUrl(article.coverImage) };
}

export async function getTestimonials() {
  const json = await fetchJson("/api/testimonials?sort=publishedAt:desc", null);
  return json ? unwrapCollection(json) : sampleTestimonials;
}

export async function submitLead(payload) {
  const res = await fetch(`${STRAPI_URL}/api/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers()
    },
    body: JSON.stringify({ data: payload })
  });

  if (!res.ok) {
    throw new Error(`Unable to submit lead: ${res.status}`);
  }

  return res.json();
}
