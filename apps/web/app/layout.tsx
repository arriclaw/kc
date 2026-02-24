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
              <div className="mx-auto w-full max-w-7xl">
                <div className="top-nav-shell relative flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-slate-600/60 px-4 py-3 backdrop-blur-2xl">
                  <div className="absolute inset-0 rounded-[1.4rem] bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.16),transparent_35%),radial-gradient(circle_at_88%_78%,rgba(99,102,241,0.14),transparent_40%)]" />
                  <div className="relative z-10">
                    <BrandMark />
                  </div>
                  <div className="relative z-10 order-3 w-full lg:order-2 lg:w-auto lg:flex-1">
                    <TopNav />
                  </div>
                  <div className="relative z-10 order-2 lg:order-3">
                    <HeaderActions />
                  </div>
                </div>
                <div className="mt-2 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />
              </div>
            </header>
            <main className="mx-auto w-full max-w-7xl px-4 py-5 md:py-6">{children}</main>
            <SiteFooter />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
