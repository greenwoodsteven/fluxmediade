import "../globals.css";
import { resolve } from "@/i18n/routes";
import { getContent } from "@/content";

// Root layout lives inside the dynamic segment so <html lang> follows the page language.
export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const lang = resolve(slug)?.lang ?? "de";
  return (
    <html lang={lang}>
      <head>
        <link rel="preload" href="/fonts/inter-var-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <a href="#main" className="skip-link">{getContent(lang).ui.skip}</a>
        {children}
      </body>
    </html>
  );
}
