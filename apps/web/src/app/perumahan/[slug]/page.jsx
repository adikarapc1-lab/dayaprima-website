import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home, MapPin } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
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

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="relative min-h-[58vh] overflow-hidden">
        <Image src={project.heroImage} alt={project.name} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/82 via-ink/45 to-transparent" />
        <div className="container-x relative flex min-h-[58vh] items-end pb-12 text-white">
          <div className="max-w-3xl">
            <nav className="mb-5 flex items-center gap-2 text-sm text-white/75">
              <Link href="/">Home</Link><ChevronRight size={15} /> <span>{project.name}</span>
            </nav>
            <h1 className="text-4xl font-semibold md:text-6xl">{project.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">{project.excerpt}</p>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-10 py-14 lg:grid-cols-[1fr_380px]">
        <div className="space-y-12">
          <article className="prose prose-lg max-w-none">
            <h2>Deskripsi Proyek</h2>
            <p>{project.description}</p>
          </article>

          <div>
            <h2 className="text-2xl font-semibold">Galeri</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {(project.gallery?.length ? project.gallery : [project.heroImage]).map((image, index) => (
                <a key={image} href={image} className="relative aspect-[4/3] overflow-hidden rounded-md bg-white shadow-soft">
                  <Image src={image} alt={`${project.name} gallery ${index + 1}`} fill className="object-cover transition hover:scale-105" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Tipe Rumah</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {project.houseTypes.map((type) => (
                <div key={type.name} className="rounded-md border border-ink/10 bg-white p-5">
                  <Home className="text-leaf" />
                  <h3 className="mt-4 text-xl font-semibold">{type.name}</h3>
                  <p className="mt-2 text-sm text-ink/60">{type.size}</p>
                  <p className="mt-4 font-semibold text-forest">{type.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Fasilitas</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {project.facilities.map((facility) => (
                <span key={facility} className="rounded-md bg-white px-4 py-3 text-sm font-medium shadow-soft">{facility}</span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold"><MapPin /> Lokasi</h2>
            <p className="mt-3 text-ink/65">{project.location}</p>
            <iframe title={`Lokasi ${project.name}`} src={project.mapEmbedUrl} className="mt-5 h-80 w-full rounded-md border-0 shadow-soft" loading="lazy" />
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
