import { getProjects } from "@/lib/cms";
import { parsePrice } from "@/lib/price";
import { PerumahanList } from "@/components/PerumahanList";

export const metadata = {
  title: "Daftar Perumahan",
  description:
    "Jelajahi semua perumahan Dayaprima Nusawisesa di Makassar. Bandingkan lokasi, tipe rumah, dan harga dalam satu halaman.",
  alternates: { canonical: "/perumahan" }
};

export default async function PerumahanIndexPage() {
  const projects = await getProjects();

  const items = projects.map((project) => {
    const prices = (project.houseTypes || [])
      .map((type) => parsePrice(type.price, null))
      .filter((value) => typeof value === "number" && value > 0);
    const bedrooms = (project.houseTypes || []).map((type) => Number(type.bedrooms) || 0);

    return {
      slug: project.slug,
      name: project.name,
      excerpt: project.excerpt,
      location: project.location || "",
      heroImage: project.heroImage,
      minPrice: prices.length ? Math.min(...prices) : null,
      typeCount: (project.houseTypes || []).length,
      maxBedrooms: bedrooms.length ? Math.max(...bedrooms) : 0
    };
  });

  return (
    <main>
      <section className="bg-forest py-14 text-white">
        <div className="container-x">
          <p className="text-sm font-semibold uppercase text-gold">Dayaprima Nusawisesa</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">Daftar Perumahan</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">
            Temukan perumahan yang paling sesuai. Saring berdasarkan lokasi, jumlah kamar, dan harga.
          </p>
        </div>
      </section>

      <section className="container-x py-12">
        <PerumahanList items={items} />
      </section>
    </main>
  );
}
