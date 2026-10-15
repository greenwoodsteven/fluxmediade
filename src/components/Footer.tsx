import Link from "next/link";
import { pathFor, serviceIds, type Lang } from "@/i18n/routes";
import { getContent } from "@/content";
import { site } from "@/content/site";

export function Footer({ lang }: { lang: Lang }) {
  const c = getContent(lang);
  const ui = c.ui;
  const a = site.address;
  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <address className="not-italic">
          <strong>{site.legalName}</strong><br />
          {a.street}<br />{a.zip} {a.city}<br />
          <a className="underline" href={`mailto:${site.email}`}>{site.email}</a><br />
          {site.phone}
        </address>
        <nav aria-label={ui.footer.services}>
          <p className="font-bold">{ui.footer.services}</p>
          <ul className="mt-2 space-y-1">
            {serviceIds.map((id) => (
              <li key={id}><Link className="underline" href={pathFor(id, lang)}>{c.services[id].title}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label={ui.footer.legal}>
          <p className="font-bold">{ui.footer.legal}</p>
          <ul className="mt-2 space-y-1">
            {(["imprint", "privacy", "a11yStatement"] as const).map((id) => (
              <li key={id}><Link className="underline" href={pathFor(id, lang)}>{c.pages[id].h1}</Link></li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-white/80">{ui.footer.hosting}</p>
        </nav>
      </div>
      <p className="border-t border-white/20 px-4 py-4 text-center text-sm text-white/80">
        © {new Date().getFullYear()} {site.legalName}. {ui.footer.rights}
      </p>
    </footer>
  );
}
