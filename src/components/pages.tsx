import type { ReactNode } from "react";
import Link from "next/link";
import { getContent, type ServiceContent, type LegalSection } from "@/content";
import { pathFor, serviceIds, type Lang, type PageId, type ServiceId } from "@/i18n/routes";
import { site } from "@/content/site";
import { technologies, analysisCloud } from "@/content/tech";
import { TechCloud3D } from "./TechCloud3D";
import { Picture } from "./Picture";
import { JsonLd } from "./JsonLd";
import { AnalysisForm, ContactForm, QuoteForm, WithdrawalForm } from "./forms";

const wrap = "mx-auto max-w-6xl px-4";
const section = "py-12 md:py-16";

type Faq = { q: string; a: string };

function Faqs({ title, items }: { title: string; items: Faq[] }) {
  return (
    <section className={`${wrap} ${section}`} aria-labelledby="faq">
      <h2 id="faq" className="text-2xl font-bold">{title}</h2>
      <div className="mt-4 divide-y divide-line border-y border-line">
        {items.map((f) => (
          <details key={f.q} className="py-3">
            <summary className="cursor-pointer font-bold text-ink">{f.q}</summary>
            <p className="mt-2">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }} />
    </section>
  );
}

const orgId = `${site.url}/#organization`;
const linkedIn = "https://www.linkedin.com/in/stevenhgreenwood";
// Optional profile URLs (config/site.local.json "sameAs": [...]); omitted when not set
const sameAs: string[] = (site as { sameAs?: string[] }).sameAs ?? [];

/** "from €450" / "ab 450 €" -> Offer with a minimum price; nothing when the text has no number. */
function offer(price: string) {
  const m = price.match(/\d[\d.,]*/);
  if (!m) return {};
  const amount = m[0].replace(/\.(?=\d{3}\b)/g, "").replace(",", ".");
  return { offers: { "@type": "Offer", priceCurrency: "EUR", priceSpecification: { "@type": "PriceSpecification", minPrice: amount, priceCurrency: "EUR" }, description: price, availability: "https://schema.org/InStock", seller: { "@id": orgId, name: site.legalName } } };
}

function PageHead({ lang, id, h1, lead }: { lang: Lang; id: PageId; h1: string; lead: string }) {
  const ui = getContent(lang).ui;
  const parent = (["geo", "a11y", "relaunch", "wordpress", "landing", "chatbot", "automation", "custom"] as PageId[]).includes(id);
  const crumbs = [{ name: ui.breadcrumbHome, path: pathFor("home", lang) },
    ...(parent ? [{ name: ui.nav.services, path: pathFor("services", lang) }] : []),
    { name: h1, path: pathFor(id, lang) }];
  return (
    <div className={`${wrap} pt-8`}>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap gap-1">
          {crumbs.map((c, i) => (
            <li key={c.path}>{i > 0 && <span aria-hidden="true">/ </span>}
              {i < crumbs.length - 1 ? <Link className="underline" href={c.path}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}</li>
          ))}
        </ol>
      </nav>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: site.url + c.path })),
      }} />
      <h1 className="mt-4 text-3xl font-bold md:text-4xl">{h1}</h1>
      {lead && <p className="mt-4 max-w-3xl text-lg">{lead}</p>}
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return <ul className="mt-3 list-disc space-y-1 pl-5">{items.map((i) => <li key={i}>{i}</li>)}</ul>;
}

function Cta({ lang }: { lang: Lang }) {
  const ui = getContent(lang).ui;
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link className="btn" href={pathFor("analysis", lang)}>{ui.ctaAnalysis}</Link>
      <Link className="btn btn-outline" href={pathFor("quote", lang)}>{ui.ctaQuote}</Link>
    </div>
  );
}

export function ServiceCard({ id, lang, small, as: H = "h3" }: { id: ServiceId; lang: Lang; small?: boolean; as?: "h2" | "h3" }) {
  const ui = getContent(lang).ui;
  const s = getContent(lang).services[id];
  return (
    <article className="flex flex-col rounded border border-line p-5">
      <H className={small ? "text-lg font-bold" : "text-xl font-bold"}>
        <Link href={pathFor(id, lang)} className="hover:underline">{s.title}</Link>
      </H>
      <p className="mt-2 flex-1">{s.card}</p>
      <p className="mt-3 font-bold text-ink">{s.price}</p>
      <Link href={pathFor(id, lang)} className="mt-2 underline text-accent">
        {ui.moreInfo}<span className="sr-only">: {s.title}</span>
      </Link>
    </article>
  );
}

export function ServicePage({ id, lang }: { id: ServiceId; lang: Lang }) {
  const c = getContent(lang);
  const ui = c.ui;
  const s: ServiceContent & { compare?: { title: string; cols: string[]; rows: string[][] }; freeCheck?: { title: string; text: string; link: string } } = c.services[id];
  return (
    <>
      <PageHead lang={lang} id={id} h1={s.title} lead={s.lead} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Service", name: s.title, description: s.description, inLanguage: lang,
        provider: { "@type": "ProfessionalService", "@id": orgId, name: site.legalName, url: site.url }, areaServed: "DE",
        ...offer(s.price),
      }} />
      <div className={`${wrap} mt-6`}><p className="font-bold text-ink">{s.price}</p><p className="text-sm text-muted">{ui.vatNote}</p><Cta lang={lang} /></div>
      {s.freeCheck && (
        <aside className={`${wrap} mt-6`} aria-labelledby="free">
          <div className="rounded border-2 border-accent p-4">
            <h2 id="free" className="text-lg font-bold text-ink">{s.freeCheck.title}</h2>
            <p className="mt-2">{s.freeCheck.text}</p>
            <p className="mt-2"><Link className="font-bold underline text-accent" href={pathFor("analysis", lang)}>{s.freeCheck.link}</Link></p>
          </div>
        </aside>
      )}
      <div className={`${wrap} grid gap-10 ${section} md:grid-cols-2`}>
        <section aria-labelledby="aud"><h2 id="aud" className="text-xl font-bold">{ui.audience}</h2><List items={s.audience} />
          <h3 className="mt-6 font-bold text-ink">{ui.notFor}</h3><List items={s.notFor} /></section>
        <section aria-labelledby="del"><h2 id="del" className="text-xl font-bold">{ui.deliverables}</h2><List items={s.deliverables} /></section>
        <section aria-labelledby="proc"><h2 id="proc" className="text-xl font-bold">{ui.process}</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5">{s.process.map((p) => <li key={p}>{p}</li>)}</ol></section>
        <section aria-labelledby="price"><h2 id="price" className="text-xl font-bold">{ui.priceDrivers}</h2><p className="mt-3">{s.priceDrivers}</p></section>
      </div>
      <section className={`${wrap} pb-10`} aria-labelledby="tech">
        <h2 id="tech" className="text-xl font-bold">{ui.technical}</h2>
        <List items={s.technical} />
      </section>
      {s.compare && (
        <section className={`${wrap} pb-10`} aria-labelledby="cmp">
          <h2 id="cmp" className="text-xl font-bold">{s.compare.title}</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead><tr>{s.compare.cols.map((h) => <th key={h} scope="col" className="border-b-2 border-ink p-2">{h}</th>)}</tr></thead>
              <tbody>{s.compare.rows.map((r) => (
                <tr key={r[0]}>{r.map((cell, i) => i === 0
                  ? <th key={cell} scope="row" className="border-b border-line p-2 font-bold">{cell}</th>
                  : <td key={cell} className="border-b border-line p-2">{cell}</td>)}</tr>))}</tbody>
            </table>
          </div>
        </section>
      )}
      <Faqs title={ui.faq} items={s.faq} />
      <section className={`${wrap} pb-4`} aria-labelledby="rel">
        <h2 id="rel" className="text-xl font-bold">{ui.related}</h2>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
          {serviceIds.filter((o) => o !== id).map((o) => (
            <li key={o}><Link className="underline text-accent" href={pathFor(o, lang)}>{c.services[o].title}</Link></li>))}
        </ul>
      </section>
    </>
  );
}

export function ServicesIndex({ lang }: { lang: Lang }) {
  const p = getContent(lang).pages.services;
  return (
    <>
      <PageHead lang={lang} id="services" h1={p.h1} lead={p.lead} />
      <div className={`${wrap} grid gap-5 ${section} sm:grid-cols-2 lg:grid-cols-3`}>
        {serviceIds.map((id) => <ServiceCard key={id} id={id} lang={lang} as="h2" />)}
      </div>
    </>
  );
}

function TechCloud({ lang }: { lang: Lang }) {
  const about = getContent(lang).pages.about;
  const hash = (t: string) => Array.from(t).reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 9973, 7);
  const items = analysisCloud.map((t) => ({ label: (lang === "en" && t.en) || t.de, w: t.w })).sort((a, b) => hash(a.label) - hash(b.label));
  return <TechCloud3D items={items} label={about.cloudTitle} />;
}

function TechBanner({ lang }: { lang: Lang }) {
  const title = getContent(lang).pages.about.techTitle;
  return (
    <section className="bg-ink text-white" aria-labelledby="tech-banner">
      <div className={`${wrap} py-8`}>
        <h2 id="tech-banner" className="text-xl font-bold text-white">{title}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {technologies.map((t) => <li key={t} className="rounded-full border border-white/40 px-3 py-1 text-sm transition-transform duration-150 motion-safe:hover:scale-110 hover:border-white">{t}</li>)}
        </ul>
      </div>
    </section>
  );
}

export function Home({ lang }: { lang: Lang }) {
  const c = getContent(lang);
  const p = c.pages.home;
  const lead = ["geo", "wordpress", "relaunch", "a11y"] as const;
  const more = ["landing", "chatbot", "automation", "custom"] as const;
  return (
    <>
      <section className="group relative isolate overflow-hidden bg-ink text-white" aria-labelledby="hero">
        <Picture src="/images/hero.jpg" alt="" width={1280} height={960} priority variants={[{ suffix: "-768", w: 768 }]}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35 transition-transform duration-700 ease-out motion-safe:group-hover:scale-105" />
        <div className={`${wrap} py-20 md:py-32`}>
          <p className="text-lg uppercase tracking-wide">{p.sub}</p>
          <h1 id="hero" className="mt-4 max-w-3xl text-4xl font-bold text-white md:text-5xl">{p.h1}</h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn btn-light" href="#analyse">{c.ui.ctaAnalysis}</Link>
            <Link className="btn btn-outline border-white text-white hover:bg-white hover:text-ink" href={pathFor("quote", lang)}>{c.ui.ctaQuote}</Link>
          </div>
        </div>
      </section>

      <section id="analyse" className={`${wrap} ${section} grid items-start gap-x-8 gap-y-8 md:grid-cols-2 md:grid-rows-[auto_1fr]`} aria-labelledby="ana">
        <div className="md:col-start-1 md:row-start-1"><h2 id="ana" className="text-2xl font-bold">{p.analysisTitle}</h2><p className="mt-3">{p.analysisText}</p></div>
        <div className="md:col-start-2 md:row-span-2 md:row-start-1"><AnalysisForm lang={lang} f={getContent(lang).ui.forms} submitLabel={getContent(lang).ui.ctaAnalysis} /></div>
        <div className="md:col-start-1 md:row-start-2"><TechCloud lang={lang} /></div>
      </section>

      <section className="bg-paper" aria-labelledby="svc">
        <div className={`${wrap} ${section}`}>
          <h2 id="svc" className="text-2xl font-bold">{p.leadServices}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{lead.map((id) => <ServiceCard key={id} id={id} lang={lang} />)}</div>
          <h3 className="mt-10 text-lg font-bold">{p.more}</h3>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{more.map((id) => <ServiceCard key={id} id={id} lang={lang} small />)}</div>
        </div>
      </section>

      <section className={`${wrap} ${section}`} aria-labelledby="steps">
        <h2 id="steps" className="text-2xl font-bold">{p.stepsTitle}</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-4">
          {p.steps.map((s, i) => (
            <li key={s} className="rounded border border-line p-4"><span className="text-3xl font-bold text-accent" aria-hidden="true">{i + 1}</span><p className="mt-1 font-bold text-ink">{s}</p></li>))}
        </ol>
      </section>

      <section className="bg-ink text-white" aria-label="Trust">
        <ul className={`${wrap} flex flex-wrap justify-center gap-x-8 gap-y-2 py-6 font-bold`}>{p.trust.map((t) => <li key={t}>{t}</li>)}</ul>
      </section>

      <References lang={lang} limit={3} heading={p.refsTitle} />
      <TechBanner lang={lang} />
      <Faqs title={p.faqTitle} items={p.faq} />

      <section className={`${wrap} ${section} text-center`}>
        <h2 className="text-2xl font-bold">{p.closing}</h2><div className="flex justify-center"><Cta lang={lang} /></div>
      </section>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "ProfessionalService", "@id": orgId, name: site.legalName, url: site.url,
            logo: `${site.url}/images/logo_black.svg`, image: `${site.url}/images/hero.jpg`,
            email: site.email, areaServed: site.region, inLanguage: lang,
            address: { "@type": "PostalAddress", addressLocality: site.address.city, addressCountry: site.address.country },
            description: p.description,
            ...(sameAs.length ? { sameAs } : {}),
          },
          { "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.name, inLanguage: lang, publisher: { "@id": orgId } },
        ],
      }} />
    </>
  );
}

function References({ lang, limit, heading, eager = 0 }: { lang: Lang; limit?: number; heading: string; eager?: number }) {
  const r = getContent(lang).pages.references;
  const items = r.items.slice(0, limit);
  return (
    <section className={`${wrap} ${section}`} aria-labelledby="refs">
      <h2 id="refs" className="text-2xl font-bold">{heading}</h2>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i, idx) => (
          <li key={i.name} className="overflow-hidden rounded border border-line">
            <Picture src={`/images/work/${i.image}`} alt="" width={720} height={480} className="h-auto w-full" priority={idx < eager}
              variants={[{ suffix: "-480", w: 480 }]} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
            <div className="p-4">
              <h3 className="font-bold text-ink">{i.name}</h3><p className="mt-1">{i.text}</p>
              <a className="mt-2 inline-block underline text-accent" href={i.url} rel="noopener noreferrer" target="_blank">
                {r.visit}<span className="sr-only">: {i.name}</span></a>
            </div>
          </li>))}
      </ul>
    </section>
  );
}

export function ReferencesPage({ lang }: { lang: Lang }) {
  const r = getContent(lang).pages.references;
  return (<><PageHead lang={lang} id="references" h1={r.h1} lead={r.lead} /><References lang={lang} heading={r.h1} eager={2} /></>);
}

export function AnalysisPage({ lang }: { lang: Lang }) {
  const p = getContent(lang).pages.analysis;
  return (
    <>
      <PageHead lang={lang} id="analysis" h1={p.h1} lead={p.lead} />
      <div className={`${wrap} ${section} grid gap-10 md:grid-cols-2`}>
        <section aria-labelledby="inc"><h2 id="inc" className="text-xl font-bold">{p.contentsTitle}</h2><List items={p.contents} />
          <p className="mt-4 font-bold text-ink">{p.honest}</p></section>
        <AnalysisForm lang={lang} f={getContent(lang).ui.forms} submitLabel={getContent(lang).ui.ctaAnalysis} />
      </div>
    </>
  );
}

export function QuotePage({ lang }: { lang: Lang }) {
  const p = getContent(lang).pages.quote;
  return (
    <>
      <PageHead lang={lang} id="quote" h1={p.h1} lead={p.lead} />
      <div className={`${wrap} ${section} max-w-3xl`}>
        <QuoteForm lang={lang} f={getContent(lang).ui.forms} q={p} />
        <section className="mt-12 border-t border-line pt-6 text-sm" aria-labelledby="qinfo">
          <h2 id="qinfo" className="text-lg font-bold">{p.infoTitle}</h2>
          <p className="mt-2">{p.provider} <Link className="underline text-accent" href={pathFor("imprint", lang)}>{p.providerLink}</Link>. <Link className="underline text-accent" href={pathFor("withdrawal", lang)}>{p.withdrawLink}</Link></p>
          <p className="mt-2">{p.insurance}</p>
        </section>
      </div>
    </>
  );
}

export function AboutPage({ lang }: { lang: Lang }) {
  const p = getContent(lang).pages.about;
  return (
    <>
      <PageHead lang={lang} id="about" h1={p.h1} lead={p.lead} />
      <div className={`${wrap} mt-4`}>
        <a href={linkedIn} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 font-bold text-accent underline">
          <Picture src="/images/LI-In-Bug.png" alt="" width={635} height={540} className="h-8 w-auto" />
          <span>{p.linkedinText}<span className="sr-only"> ({p.newTab})</span></span>
        </a>
      </div>
      <section className={`${wrap} ${section}`} aria-labelledby="focus">
        <h2 id="focus" className="text-3xl font-bold">{p.focusTitle}</h2>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {p.focus.map((f) => (
            <li key={f.h} className="rounded border border-line p-5">
              <h3 className="text-xl font-bold text-ink">{f.h}</h3>
              <p className="mt-2">{f.text}</p>
            </li>))}
        </ul>
      </section>
      <TechBanner lang={lang} />
      <div className={`${wrap} py-12 max-w-3xl`}>
        {p.body.map((t) => <p key={t} className="mt-4">{t}</p>)}
        <List items={p.values} /><Cta lang={lang} />
        <section className="mt-12" aria-labelledby="bg">
          <h2 id="bg" className="text-xl font-bold">{p.backgroundTitle}</h2>
          {p.background.map((t) => <p key={t} className="mt-3">{t}</p>)}
        </section>
      </div>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Person", name: site.owner, jobTitle: lang === "de" ? "Webentwickler" : "Web developer",
        url: site.url + pathFor("about", lang), sameAs: [linkedIn], worksFor: { "@id": orgId },
        address: { "@type": "PostalAddress", addressLocality: site.address.city, addressCountry: site.address.country }, inLanguage: lang,
      }} />
    </>
  );
}

export function ContactPage({ lang }: { lang: Lang }) {
  const p = getContent(lang).pages.contact;
  return (
    <>
      <PageHead lang={lang} id="contact" h1={p.h1} lead={p.lead} />
      <div className={`${wrap} ${section} grid gap-10 md:grid-cols-2`}>
        <ContactForm lang={lang} f={getContent(lang).ui.forms} />
        <section aria-labelledby="dir"><h2 id="dir" className="text-xl font-bold">{p.direct}</h2>
          <address className="mt-3 not-italic">{site.legalName}<br />
            <a className="underline text-accent" href={`mailto:${site.email}`}>{site.email}</a><br />{site.phone}</address></section>
      </div>
    </>
  );
}

function fill(t: string) {
  const line = (a: { street: string; zip: string; city: string }) => `${a.street}, ${a.zip} ${a.city}`;
  const g = site.gbr;
  const map: Record<string, string> = {
    legalName: site.legalName, owner: site.owner, address: line(site.address), phone: site.phone, email: site.email, vatId: site.vatId,
    gbrName: g.legalName, gbrPartners: g.partners.join(", "), gbrAddress: line(g.address), gbrPhone: g.phone, gbrEmail: g.email, gbrVatId: g.vatId,
  };
  return t.replace(/\{(\w+)\}/g, (m, k: string) => map[k] ?? m);
}

type LegalId = "imprint" | "privacy" | "a11yStatement" | "gbr" | "withdrawal";

export function LegalPage({ id, lang, children }: { id: LegalId; lang: Lang; children?: ReactNode }) {
  const p = getContent(lang).pages[id] as { h1: string; note: string; sections: LegalSection[] };
  const empty = (t: string) => (t.includes("{vatId}") && !site.vatId) || (t.includes("{gbrVatId}") && !site.gbr.vatId);
  return (
    <>
      <PageHead lang={lang} id={id} h1={p.h1} lead={p.note} />
      <div className={`${wrap} ${section} prose-flux max-w-3xl`}>
        {p.sections.filter((s) => !s.p.some(empty)).map((s) => (
          <section key={s.h} className="mt-8"><h2 className="text-xl font-bold">{s.h}</h2>{s.p.map((t) => <p key={t}>{fill(t)}</p>)}
            {s.link && <p><Link className="underline text-accent" href={pathFor(s.link.id as PageId, lang)}>{s.link.text}</Link></p>}</section>))}
        {children}
      </div>
    </>
  );
}

export function GbrPage({ lang }: { lang: Lang }) {
  return <LegalPage id="gbr" lang={lang} />;
}

export function WithdrawalPage({ lang }: { lang: Lang }) {
  const c = getContent(lang);
  const p = c.pages.withdrawal;
  return (
    <LegalPage id="withdrawal" lang={lang}>
      <section className="mt-10" aria-labelledby="wd-form">
        <h2 id="wd-form" className="text-xl font-bold">{p.formTitle}</h2>
        <p className="mt-2">{p.formIntro}</p>
        <div className="mt-4"><WithdrawalForm lang={lang} f={c.ui.forms} w={p} /></div>
      </section>
    </LegalPage>
  );
}
