import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer({ globals }) {
  return (
    <footer id="contact" className="bg-ink text-white">
      <div className="container-x grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-semibold">{globals.companyName}</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
            Developer hunian yang membangun kawasan bernilai, nyaman, dan mudah dijangkau untuk keluarga Indonesia.
          </p>
        </div>
        <div className="space-y-3 text-sm text-white/75">
          <p className="font-semibold text-white">Kontak</p>
          <p className="flex gap-3"><Phone size={18} /> {globals.phone}</p>
          <p className="flex gap-3"><Mail size={18} /> {globals.email}</p>
          <p className="flex gap-3"><MapPin size={18} /> {globals.address}</p>
        </div>
        <div className="space-y-3 text-sm text-white/75">
          <p className="font-semibold text-white">Navigasi</p>
          <Link className="block hover:text-gold" href="/#projects">Perumahan</Link>
          <Link className="block hover:text-gold" href="/blog">Artikel</Link>
          <Link className="block hover:text-gold" href="/#contact">Hubungi Kami</Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/55">
        &copy; {new Date().getFullYear()} {globals.companyName}. All rights reserved.
      </div>
    </footer>
  );
}
