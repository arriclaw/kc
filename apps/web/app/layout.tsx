import type { Metadata } from "next";
import { Manrope, Montserrat } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/session-provider";
import { BrandMark } from "@/components/layout/brand";
import { HeaderActions } from "@/components/layout/header-actions";
import { TopNav } from "@/components/layout/top-nav";
import { SiteFooter } from "@/components/layout/footer";
import { BackgroundOrbs } from "@/components/effects/background-orbs";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "Kilómetro Claro",
  description: "Historial vehicular inteligente, verificable y listo para compartir."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-UY">
      <body className={`${manrope.variable} ${montserrat.variable}`}>
        <BackgroundOrbs />
        <AuthProvider>
          <QueryProvider>
            <header className="sticky top-0 z-40 px-3 pt-3 md:px-6 md:pt-4">
              <div className="mx-auto w-full max-w-6xl space-y-2">
                <div className="top-nav-shell flex items-center justify-between rounded-2xl border border-slate-600/60 px-4 py-3 backdrop-blur-2xl">
                  <BrandMark />
                  <HeaderActions />
                </div>
                <div className="top-nav-shell rounded-2xl border border-slate-600/60 px-3 py-2.5 backdrop-blur-2xl">
                  <TopNav />
                </div>
              </div>
            </header>
            <main className="mx-auto w-full max-w-6xl px-4 py-5 md:py-6">{children}</main>
            <SiteFooter />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
