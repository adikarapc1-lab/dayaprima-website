import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsappButton } from "@/components/WhatsappButton";
import { getGlobals } from "@/lib/cms";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Dayaprima Nusawisesa | Developer Perumahan Modern",
    template: "%s | Dayaprima Nusawisesa"
  },
  description: "Dayaprima Nusawisesa adalah developer perumahan modern dengan proyek hunian strategis, nyaman, dan bernilai untuk keluarga Indonesia.",
  openGraph: {
    title: "Dayaprima Nusawisesa",
    description: "Developer perumahan modern dengan proyek hunian strategis dan nyaman.",
    images: ["/images/dayaprima-hero.png"]
  }
};

export default async function RootLayout({ children }) {
  const globals = await getGlobals();

  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans antialiased">
        <Analytics />
        <Header />
        {children}
        <Footer globals={globals} />
        <div className="fixed bottom-5 right-5 z-50">
          <WhatsappButton number={globals.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER} />
        </div>
      </body>
    </html>
  );
}
