import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/lib/cms";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, images: [article.coverImage] }
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <main>
      <div className="relative h-[46vh] min-h-80">
        <Image src={article.coverImage || "/images/dayaprima-hero.png"} alt={article.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-ink/45" />
      </div>
      <article className="container-x prose prose-lg max-w-3xl py-12">
        <p className="text-sm font-semibold text-gold">{article.publishedAt}</p>
        <h1>{article.title}</h1>
        <p>{article.content}</p>
      </article>
    </main>
  );
}
