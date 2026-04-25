import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { WhatsappButton } from "@/components/WhatsappButton";
import { getGlobals, getProjects, getTestimonials } from "@/lib/cms";

export default async function HomePage() {
  const [globals, projects, testimonials] = await Promise.all([
    getGlobals(),
    getProjects({ featured: true }),
    getTestimonials()
  ]);

  return (
    <main>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <Image
          src="/images/dayaprima-hero.png"
          alt="Kawasan perumahan modern Dayaprima"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/48 to-transparent" />
        <div className="container-x relative flex min-h-[calc(100vh-4rem)] items-center py-20">
          <div className="max-w-2xl text-white">
            <p className="mb-5 inline-flex rounded-md bg-white/12 px-3 py-2 text-sm font-medium backdrop-blur">
              Developer Perumahan Terpercaya
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">Dayaprima</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/82">
              {globals.tagline}. Temukan proyek hunian strategis dengan lingkungan tertata dan proses konsultasi yang jelas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsappButton number={globals.whatsapp} />
              <Link href="#projects" className="btn-secondary bg-white/95">
                Lihat Perumahan <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="container-x py-16">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-gold">Proyek Unggulan</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">Pilihan hunian Dayaprima</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-ink/65">
            Semua proyek ditarik dari CMS sehingga tim admin dapat menambah unit, galeri, fasilitas, dan harga tanpa mengubah kode.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.slug} href={`/perumahan/${project.slug}`} className="group overflow-hidden rounded-md bg-white shadow-soft">
              <div className="relative aspect-[16/10]">
                <Image src={project.heroImage || "/images/dayaprima-hero.png"} alt={project.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-leaf"><MapPin size={16} /> {project.location}</div>
                <h3 className="mt-3 text-2xl font-semibold">{project.name}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/65">{project.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest">
                  Detail proyek <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="about" className="bg-white py-16">
        <div className="container-x grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-gold">Tentang Dayaprima</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Membangun kawasan yang mudah dihuni dan bernilai jangka panjang.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Lokasi strategis", "Akses harian lebih praktis"],
              ["Legalitas jelas", "Proses pembelian transparan"],
              ["Tim responsif", "Konsultasi cepat dan rapi"]
            ].map(([title, body]) => (
              <div key={title} className="rounded-md border border-ink/10 p-5">
                <ShieldCheck className="text-leaf" />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {["Dekat fasilitas publik", "Lingkungan tertata", "Pilihan tipe fleksibel"].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-md bg-white p-5 shadow-soft">
              <CheckCircle2 className="text-leaf" />
              <span className="font-semibold">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-forest py-16 text-white">
        <div className="container-x">
          <div className="mb-8 flex items-center gap-3">
            <Sparkles className="text-gold" />
            <h2 className="text-3xl font-semibold">Cerita pembeli</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {testimonials.map((item) => (
              <figure key={item.name} className="rounded-md bg-white/10 p-6">
                <blockquote className="text-lg leading-8 text-white/85">"{item.quote}"</blockquote>
                <figcaption className="mt-5 text-sm font-semibold">{item.name} - {item.role}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
