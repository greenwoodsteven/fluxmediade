// Route table: page id -> slug per language. Feeds generateStaticParams,
// hreflang, the language switcher and sitemap.xml (plan §3, "Routing on LAMP").
export const locales = ["de", "en"] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = "de";

export const pageIds = [
  "home", "services", "geo", "a11y", "relaunch", "wordpress", "landing", "chatbot", "automation",
  "analysis", "quote", "references", "about", "contact", "imprint", "privacy", "a11yStatement",
] as const;
export type PageId = (typeof pageIds)[number];

export const slugs: Record<PageId, Record<Lang, string>> = {
  home: { de: "", en: "" },
  services: { de: "leistungen", en: "services" },
  geo: { de: "leistungen/ki-sichtbarkeit", en: "services/ai-visibility" },
  a11y: { de: "leistungen/barrierefreiheit", en: "services/accessibility" },
  relaunch: { de: "leistungen/website-relaunch", en: "services/website-relaunch" },
  wordpress: { de: "leistungen/wordpress-optimierung", en: "services/wordpress-care" },
  landing: { de: "leistungen/landingpage", en: "services/landing-page" },
  chatbot: { de: "leistungen/ki-chatbot", en: "services/ai-chatbot" },
  automation: { de: "leistungen/automatisierung", en: "services/automation" },
  analysis: { de: "seo-analyse-kostenlos", en: "free-seo-analysis" },
  quote: { de: "angebot", en: "quote" },
  references: { de: "referenzen", en: "references" },
  about: { de: "ueber-uns", en: "about" },
  contact: { de: "kontakt", en: "contact" },
  imprint: { de: "impressum", en: "legal-notice" },
  privacy: { de: "datenschutz", en: "privacy" },
  a11yStatement: { de: "barrierefreiheit", en: "accessibility-statement" },
};

/** Path with trailing slash. German at root, English under /en/. */
export function pathFor(id: PageId, lang: Lang): string {
  const slug = slugs[id][lang];
  const prefix = lang === defaultLang ? "" : `/${lang}`;
  return `${prefix}/${slug}${slug ? "/" : ""}` || "/";
}

export function resolve(segments: string[] | undefined): { id: PageId; lang: Lang } | null {
  const parts = segments ?? [];
  const lang: Lang = parts[0] === "en" ? "en" : defaultLang;
  const slug = (lang === "en" ? parts.slice(1) : parts).join("/");
  for (const id of pageIds) if (slugs[id][lang] === slug) return { id, lang };
  return null;
}

export function allSegments(): string[][] {
  const out: string[][] = [];
  for (const lang of locales)
    for (const id of pageIds) {
      const s = slugs[id][lang].split("/").filter(Boolean);
      out.push(lang === defaultLang ? s : ["en", ...s]);
    }
  return out;
}

export const serviceIds = ["geo", "a11y", "relaunch", "wordpress", "landing", "chatbot", "automation"] as const;
export type ServiceId = (typeof serviceIds)[number];
