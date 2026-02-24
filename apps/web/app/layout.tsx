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
            <div className="mx-auto grid min-h-screen w-full max-w-[1600px] grid-cols-1 gap-0 px-3 pb-8 pt-3 md:px-5 lg:grid-cols-[280px_1fr] lg:gap-5 lg:px-6 lg:pt-5">
              <aside className="hidden lg:block">
                <div className="sticky top-5 overflow-hidden rounded-[1.6rem] border border-slate-700/70 bg-[linear-gradient(140deg,rgba(7,16,39,0.9),rgba(9,20,46,0.82),rgba(8,14,32,0.94))] p-4">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(34,211,238,0.18),transparent_36%),radial-gradient(circle_at_88%_80%,rgba(99,102,241,0.14),transparent_38%)]" />
                  <div className="relative">
                    <BrandMark />
                  </div>
                  <div className="relative mt-4 border-t border-slate-700/70 pt-4">
                    <TopNav vertical />
                  </div>
                  <div className="relative mt-4 border-t border-slate-700/70 pt-4">
                    <HeaderActions />
                  </div>
                </div>
              </aside>

              <div className="min-w-0">
                <header className="mb-4 lg:hidden">
                  <div className="overflow-hidden rounded-[1.35rem] border border-slate-700/70 bg-[linear-gradient(130deg,rgba(8,18,42,0.9),rgba(10,22,46,0.82),rgba(8,14,32,0.94))] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <BrandMark />
                      <HeaderActions />
                    </div>
                    <div className="mt-3 border-t border-slate-700/70 pt-3">
                      <TopNav />
                    </div>
                  </div>
                </header>

                <main className="space-y-6">{children}</main>
                <SiteFooter />
              </div>
            </div>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
