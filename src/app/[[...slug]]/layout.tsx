import "../globals.css";
import { preload } from "react-dom";
import { resolve } from "@/i18n/routes";
import { getContent } from "@/content";

// Root layout lives inside the dynamic segment so <html lang> follows the page language.
export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  // One preload tag (a hand-written <link> was rendered twice next to React's hoisted one)
  preload("/fonts/inter-var-latin.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  const lang = resolve(slug)?.lang ?? "de";
  return (
    <html lang={lang}>
      <body>
        <a href="#main" className="skip-link">{getContent(lang).ui.skip}</a>
        {children}
      </body>
    </html>
  );
}
