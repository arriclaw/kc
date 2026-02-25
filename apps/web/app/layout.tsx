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
            <header className="sticky top-0 z-40 px-3 py-3 md:px-6">
              <div className="top-nav-shell mx-auto flex w-full max-w-[1480px] flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-600/60 bg-slate-900/55 px-4 py-3 shadow-[0_10px_34px_rgba(2,6,23,0.48)] backdrop-blur-2xl">
                <BrandMark />
                <TopNav />
                <HeaderActions />
              </div>
            </header>
            <main className="mx-auto w-full max-w-[1480px] px-4 py-6 lg:px-6">{children}</main>
            <SiteFooter />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
