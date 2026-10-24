/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { pathFor, locales, type Lang, type PageId } from "@/i18n/routes";
import { getContent } from "@/content";
import { LangLink } from "./LangLink";

const navIds: PageId[] = ["services", "analysis", "quote", "references", "about", "contact"];

export function Header({ lang, current }: { lang: Lang; current: PageId }) {
  const ui = getContent(lang).ui;
  const links = navIds.map((id) => (
    <li key={id}>
      <Link href={pathFor(id, lang)} aria-current={current === id ? "page" : undefined}
        className={`block px-3 py-2 hover:underline underline-offset-4 ${current === id ? "underline" : ""} ${id === "analysis" ? "font-bold" : ""}`}>
        {ui.nav[id as keyof typeof ui.nav]}
      </Link>
    </li>
  ));
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href={pathFor("home", lang)} aria-label="Fluxmedia – Startseite / Home">
          <img src="/images/logo_black.svg" alt="Fluxmedia" width={178} height={33} className="h-8 w-auto" />
        </Link>
        <nav aria-label={ui.mainNav} className="order-3 w-full md:order-none md:w-auto">
          <details className="md:hidden">
            <summary className="cursor-pointer px-3 py-2 font-bold">{ui.menu}</summary>
            <ul className="pb-2">{links}</ul>
          </details>
          <ul className="hidden items-center md:flex">{links}</ul>
        </nav>
        <ul aria-label={ui.langLabel} className="flex gap-1 text-sm">
          {locales.map((l) => (
            <li key={l}>
              <LangLink href={pathFor(current, l)} hrefLang={l} lang={l} aria-current={l === lang ? "true" : undefined}
                className={`px-2 py-1 uppercase ${l === lang ? "font-bold underline" : "hover:underline"}`}>
                <span aria-hidden="true">{l}</span><span className="sr-only">{ui.langName[l]}</span>
              </LangLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
