import Link from "next/link";
import { Building2 } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-mist/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold text-ink">
          <span className="grid size-10 place-items-center rounded-md bg-forest text-white">
            <Building2 size={20} />
          </span>
          <span className="text-lg">Dayaprima Nusawisesa</span>
        </Link>
        <nav className="flex items-center gap-4 text-xs font-medium text-ink/70 sm:gap-6 sm:text-sm">
          <Link href="/#projects" className="hover:text-forest">Perumahan</Link>
          <Link href="/blog" className="hover:text-forest">Blog</Link>
          <Link href="/#contact" className="btn-primary px-3 py-2 sm:px-4">Kontak</Link>
        </nav>
      </div>
    </header>
  );
}
