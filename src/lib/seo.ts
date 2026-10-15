import type { Metadata } from "next";
import { locales, defaultLang, pathFor, type PageId, type Lang } from "@/i18n/routes";
import { site } from "@/content/site";

export function buildMetadata(id: PageId, lang: Lang, title: string, description: string): Metadata {
  const url = (l: Lang) => `${site.url}${pathFor(id, l)}`;
  return {
    metadataBase: new URL(site.url),
    title,
    description,
    alternates: {
      canonical: url(lang),
      languages: { ...Object.fromEntries(locales.map((l) => [l, url(l)])), "x-default": url(defaultLang) },
    },
    openGraph: { title, description, url: url(lang), siteName: site.name, locale: lang === "de" ? "de_DE" : "en_GB", type: "website" },
    icons: { icon: [{ url: "/favicon-32x32.png", sizes: "32x32" }, { url: "/favicon-16x16.png", sizes: "16x16" }], apple: "/apple-touch-icon.png" },
    robots: { index: true, follow: true },
  };
}
