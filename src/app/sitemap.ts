import type { MetadataRoute } from "next";
import { pageIds, locales, defaultLang, pathFor } from "@/i18n/routes";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const last = new Date();
  return pageIds.flatMap((id) =>
    locales.map((lang) => ({
      url: site.url + pathFor(id, lang),
      lastModified: last,
      alternates: { languages: { ...Object.fromEntries(locales.map((l) => [l, site.url + pathFor(id, l)])), "x-default": site.url + pathFor(id, defaultLang) } },
    })),
  );
}
