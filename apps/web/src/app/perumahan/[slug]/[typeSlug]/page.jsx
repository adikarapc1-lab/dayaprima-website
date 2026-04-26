import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, BedDouble, Car, CheckCircle2, Home, Layers } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { ImageGalleryCarousel } from "@/components/ImageGalleryCarousel";
import { WhatsappButton } from "@/components/WhatsappButton";
import { getGlobals, getHouseType, getProjects } from "@/lib/cms";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.flatMap((project) =>
    (project.houseTypes || []).map((type) => ({
      slug: project.slug,
      typeSlug: type.slug
    }))
  );
}

export async function generateMetadata({ params }) {
  const data = await getHouseType(params.slug, params.typeSlug);
  if (!data) return {};

  const { project, houseType } = data;
  return {
    title: `${houseType.name} ${project.name}`,
    description: `${houseType.name} ${project.name} - ${houseType.size}, ${houseType.price}`,
    openGraph: {
      title: `${houseType.name} ${project.name}`,
      description: houseType.description || project.excerpt,
      images: [houseType.floorPlanImage || project.heroImage]
    }
  };
}

export default async function HouseTypePage({ params }) {
  const [data, globals] = await Promise.all([
    getHouseType(params.slug, params.typeSlug),
    getGlobals()
  ]);

  if (!data) notFound();

  const { project, houseType } = data;
  const images = houseType.gallery?.length ? houseType.gallery : [project.heroImage];

  return (
    <main>
      <section className="bg-forest py-12 text-white">
        <div className="container-x">
          <Link href={`/perumahan/${project.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
            <ArrowLeft size={16} />
            Kembali ke {project.name}
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-gold">{project.name}</p>
              <h1 className="mt-3 text-4xl font-semibold md:text-6xl">{houseType.name}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/78">{houseType.description || `${houseType.size} dengan harga ${houseType.price}.`}</p>
            </div>
            <div className="rounded-md bg-white/10 p-5">
              <p className="text-sm text-white/70">Harga</p>
              <p className="mt-1 text-3xl font-semibold">{houseType.price}</p>
              <p className="mt-3 text-white/70">{houseType.size}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-10 py-14 lg:grid-cols-[1fr_380px]">
        <div className="space-y-12">
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              ["Kamar", houseType.bedrooms, BedDouble],
              ["Kamar Mandi", houseType.bathrooms, Bath],
              ["Lantai", houseType.floors, Layers],
              ["Carport", houseType.carport, Car]
            ].map(([label, value, Icon]) => (
              <div key={label} className="rounded-md border border-ink/10 bg-white p-5 shadow-soft">
                <Icon className="text-leaf" />
                <p className="mt-4 text-2xl font-semibold">{value || "-"}</p>
                <p className="mt-1 text-sm text-ink/60">{label}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold"><Home /> Denah Rumah</h2>
            <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-md bg-white p-4 shadow-soft">
              <Image src={houseType.floorPlanImage || project.heroImage} alt={`Denah ${houseType.name}`} fill className="object-contain p-6" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Fasilitas Tipe Rumah</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {(houseType.features?.length ? houseType.features : [
                `${houseType.bedrooms || "-"} kamar tidur`,
                `${houseType.bathrooms || "-"} kamar mandi`,
                `${houseType.floors || "-"} lantai`,
                `${houseType.carport || "-"} carport`
              ]).map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-md bg-white px-4 py-3 shadow-soft">
                  <CheckCircle2 size={18} className="shrink-0 text-leaf" />
                  <span className="text-sm font-medium text-ink/78">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Galeri Tipe</h2>
            <div className="mt-5">
              <ImageGalleryCarousel images={images} title={`${project.name} ${houseType.name}`} />
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <WhatsappButton number={globals.whatsapp} projectName={`${project.name} - ${houseType.name}`} className="btn-primary w-full" />
          <InquiryForm project={{ name: `${project.name} - ${houseType.name}` }} />
        </aside>
      </section>
    </main>
  );
}
