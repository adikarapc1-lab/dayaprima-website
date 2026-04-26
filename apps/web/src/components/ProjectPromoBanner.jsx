import { Phone } from "lucide-react";

function LogoBlock({ title, accent = "leaf" }) {
  const color = accent === "orange" ? "text-clay" : "text-leaf";

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className={`grid size-12 shrink-0 place-items-center rounded-md bg-white/88 text-lg font-black ${color}`}>
        {title.split(" ").map((word) => word[0]).join("").slice(0, 2)}
      </span>
      <div className="min-w-0 leading-none">
        {title.split(" ").map((word, index) => (
          <p key={word} className={`truncate text-xl font-bold ${index === 0 ? color : "text-white"}`}>
            {word}
          </p>
        ))}
      </div>
    </div>
  );
}

function PromoPrice({ label, value, boxClass }) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_1fr] md:items-center">
      <div className="text-white">
        <p className="text-2xl font-bold md:text-4xl">Harga Mulai</p>
        <div className="mt-1 flex items-end gap-3">
          <span className="text-7xl font-black leading-none tracking-normal md:text-8xl">{value}</span>
          <span className="[writing-mode:vertical-rl] text-xl font-semibold tracking-normal">Jutaan</span>
        </div>
      </div>
      <div className={`rounded-sm p-5 text-yellow-300 shadow-soft ${boxClass}`}>
        <p className="text-3xl font-black md:text-5xl">FREE PPN*</p>
        <p className="mt-2 text-sm font-semibold text-yellow-100">Mulai Dari</p>
        <div className="flex items-end gap-2">
          <span className="text-7xl font-black leading-none md:text-8xl">{label}</span>
          <span className="[writing-mode:vertical-rl] text-xl font-semibold">Jutaan</span>
        </div>
      </div>
    </div>
  );
}

export function ProjectPromoBanner({ project, globals }) {
  const promo = project.promo || {};
  const price = promo.priceStart || "408";
  const ppn = promo.ppnStart || "34";
  const phone = promo.phone || globals.phone;
  const address = promo.address || globals.address;

  return (
    <section className="overflow-hidden rounded-md bg-forest shadow-soft">
      <div className="relative min-h-32 bg-[url('/images/dayaprima-hero-2.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-mist/78" />
        <div className="relative grid gap-6 p-6 md:grid-cols-2 md:items-center md:p-8">
          <LogoBlock title={project.name} />
          <LogoBlock title="Dayaprima Nusawisesa" accent="orange" />
        </div>
      </div>
      <div className="grid gap-8 bg-forest p-6 md:grid-cols-2 md:p-8">
        <PromoPrice value={price} label={ppn} boxClass="bg-clay" />
        <div className="flex flex-col justify-between gap-6">
          <div className="rounded-sm bg-leaf/70 p-5 text-yellow-300">
            <p className="text-4xl font-black md:text-5xl">FREE PPN*</p>
            <p className="mt-2 text-sm font-semibold text-yellow-100">Program terbatas</p>
            <p className="mt-3 text-sm leading-6 text-white/82">Konsultasikan ketersediaan unit dan promo terbaru dengan tim pemasaran.</p>
          </div>
          <div className="grid gap-4 text-white md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-2xl font-bold">Kantor Pemasaran</p>
              <p className="mt-1 max-w-xl text-sm leading-6 text-white/82">{address}</p>
            </div>
            <div className="flex items-center gap-3 rounded-md bg-white/12 px-4 py-3">
              <Phone size={24} />
              <div className="text-lg font-bold leading-tight">{phone}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
