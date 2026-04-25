import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getArticles } from "@/lib/cms";

export const metadata = {
  title: "Blog",
  description: "Artikel Dayaprima tentang hunian, investasi properti, dan tips memilih rumah."
};

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <main className="container-x py-14">
      <h1 className="text-4xl font-semibold">Blog Dayaprima</h1>
      <p className="mt-4 max-w-2xl text-ink/65">Insight properti dan panduan memilih hunian yang dikelola dari CMS.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.slug} href={`/blog/${article.slug}`} className="group overflow-hidden rounded-md bg-white shadow-soft">
            <div className="relative aspect-[16/10]">
              <Image src={article.coverImage || "/images/dayaprima-hero.png"} alt={article.title} fill className="object-cover transition group-hover:scale-105" />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold text-gold">{article.publishedAt}</p>
              <h2 className="mt-3 text-xl font-semibold">{article.title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink/60">{article.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest">Baca <ArrowRight size={16} /></span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
