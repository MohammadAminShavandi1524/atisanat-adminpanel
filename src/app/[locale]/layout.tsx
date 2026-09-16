import "../globals.css";
import "../../Webfonts/fontiran.css";

import "maplibre-gl/dist/maplibre-gl.css";

import { notFound } from "next/navigation";
import { Locale, hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Inter } from "next/font/google";

import { Metadata } from "next";

import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/theme/Providers";
import AppToaster from "@/components/AppToaster";

import { CustomToastProvider } from "@/components/ui/custom-toast";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Sidebar from "@/components/layout/Sidebar";


const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: Omit<LayoutProps<"/[locale]">, "children">,
): Promise<Metadata> {
  const { locale } = await props.params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "LocaleLayout",
  });

  return {
    title: t("title"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir={locale === "en" ? "ltr" : "rtl"}
      suppressHydrationWarning
    >
      <body
        className={cn(
          inter.variable,
          locale === "fa"
            ? "font-IRANYekanX"
            : "font-[family-name:var(--font-inter)]",
        )}
      >
        <NextIntlClientProvider>
          <ThemeProvider>
            <AppToaster />

            <div className="bg-background text-foreground flex h-screen overflow-hidden">
              <Sidebar />
              <main className="flex flex-1 flex-col overflow-hidden">
                <CustomToastProvider>
                  <SmoothScrollProvider>{children}</SmoothScrollProvider>
                </CustomToastProvider>
              </main>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
