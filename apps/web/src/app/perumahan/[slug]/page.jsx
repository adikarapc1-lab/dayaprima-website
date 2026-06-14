import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bath, BedDouble, Car, ExternalLink, Home, Layers, MapPin, Ruler } from "lucide-react";
import { FaqAccordion } from "@/components/FaqAccordion";
import { GalleryGrid } from "@/components/GalleryGrid";
import { InquiryForm } from "@/components/InquiryForm";
import { KprSimulator } from "@/components/KprSimulator";
import { ProjectHeroCarousel } from "@/components/ProjectHeroCarousel";
import { WhatsappButton } from "@/components/WhatsappButton";
import { getGlobals, getProject, getProjects } from "@/lib/cms";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const project = await getProject(slug);
  if (!project) return {};

  return {
    title: project.seoTitle || project.name,
    description: project.seoDescription || project.excerpt,
    openGraph: {
      title: project.seoTitle || project.name,
      description: project.seoDescription || project.excerpt,
      images: [project.heroImage]
    }
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = params;
  const [project, globals] = await Promise.all([getProject(slug), getGlobals()]);
  if (!project) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: project.name,
    description: project.seoDescription || project.excerpt,
    image: project.heroImage,
    address: project.location,
    brand: { "@type": "Organization", name: "Dayaprima" }
  };

  const faqSchema = project.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: project.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer }
        }))
      }
    : null;

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {faqSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}
      <ProjectHeroCarousel project={project} />

      <section className="container-x grid gap-10 py-14 lg:grid-cols-[1fr_380px]">
        <div className="space-y-12">
          <article className="prose prose-lg max-w-none">
            <h2>Informasi Perumahan</h2>
            <p>{project.description}</p>
          </article>

          <div>
            <h2 className="text-2xl font-semibold">Tipe Rumah</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {project.houseTypes.map((type) => (
                <Link key={type.slug || type.name} href={`/perumahan/${project.slug}/${type.slug}`} className="group overflow-hidden rounded-md border border-ink/10 bg-white shadow-soft transition hover:-translate-y-1 hover:border-gold">
                  <div className="relative aspect-[16/9] bg-forest/10">
                    <Image src={type.gallery?.[0] || type.floorPlanImage || project.heroImage} alt={type.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute left-5 top-5 rounded-full bg-ink/55 px-4 py-2 text-xs font-semibold text-white backdrop-blur">Residential</span>
                  </div>
                  <div className="bg-[#eaf0f7] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-clay">{project.name}</p>
                      <span className="flex items-center gap-1 text-xs text-ink/45"><MapPin size={14} /> {project.location?.split(",")[0]}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-ink">{type.name}</h3>
                    <div className="mt-5 grid grid-cols-2 gap-4 text-sm text-ink/62">
                      <span className="flex items-center gap-2"><Ruler size={16} /> {type.size?.split("/")[0]?.trim() || type.size}</span>
                      <span className="flex items-center gap-2"><Home size={16} /> {type.size?.split("/")[1]?.trim() || "-"}</span>
                      <span className="flex items-center gap-2"><Layers size={16} /> {type.floors || "-"} Lantai</span>
                      <span className="flex items-center gap-2"><BedDouble size={16} /> {type.bedrooms || "-"} Kamar</span>
                      <span className="flex items-center gap-2"><Bath size={16} /> {type.bathrooms || "-"} KM</span>
                      <span className="flex items-center gap-2"><Car size={16} /> {type.carport || "-"} Carport</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 bg-mist px-5 py-4">
                    <span className="text-sm text-ink/55">Mulai dari</span>
                    <span className="text-lg font-bold text-clay">{type.price}</span>
                  </div>
                  <div className="px-5 pb-5">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-forest">
                      Detail tipe <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <KprSimulator
            priceText={project.houseTypes?.[0]?.price}
            whatsapp={globals.whatsapp}
            contextName={project.name}
            interestRate={globals.kprInterestRate}
            tenorYears={globals.kprTenorYears}
            dpPercent={globals.kprDpPercent}
          />

          <div>
            <h2 className="text-2xl font-semibold">Fasilitas Perumahan</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {project.facilities.map((facility) => (
                <span key={facility} className="rounded-md bg-white px-4 py-3 text-sm font-medium shadow-soft">{facility}</span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Video</h2>
            {project.video ? (
              <div className="mt-5 overflow-hidden rounded-md bg-black shadow-soft">
                <video
                  controls
                  preload="metadata"
                  className="aspect-video w-full"
                  src={project.video}
                >
                  Browser Anda tidak mendukung pemutaran video.
                </video>
              </div>
            ) : (
              <div className="mt-5 rounded-md border border-ink/10 bg-white p-5 text-sm text-ink/65 shadow-soft">
                Video perumahan belum tersedia saat ini.
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Galeri Perumahan</h2>
            <div className="mt-5">
              <GalleryGrid
                images={project.gallery?.length ? project.gallery : [project.heroImage]}
                title={project.name}
              />
            </div>
          </div>

          {project.faqs?.length ? (
            <div>
              <h2 className="text-2xl font-semibold">Pertanyaan yang Sering Diajukan</h2>
              <FaqAccordion faqs={project.faqs} />
            </div>
          ) : null}

          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold"><MapPin /> Lokasi</h2>
            <p className="mt-3 text-ink/65">{project.location}</p>
            {project.mapUrl ? (
              <a href={project.mapUrl} target="_blank" rel="noreferrer" className="btn-secondary mt-5">
                Buka Google Maps <ExternalLink size={16} />
              </a>
            ) : null}
            {project.mapEmbedUrl ? (
              <iframe title={`Lokasi ${project.name}`} src={project.mapEmbedUrl} className="mt-5 h-80 w-full rounded-md border-0 shadow-soft" loading="lazy" />
            ) : null}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <WhatsappButton number={globals.whatsapp} projectName={project.name} className="btn-primary w-full" />
          <InquiryForm project={project} />
        </aside>
      </section>
    </main>
  );
}
