import Link from "next/link";
import { getContent, type ServiceContent, type LegalSection } from "@/content";
import { pathFor, serviceIds, type Lang, type PageId, type ServiceId } from "@/i18n/routes";
import { site } from "@/content/site";
import { Picture } from "./Picture";
import { JsonLd } from "./JsonLd";
import { AnalysisForm, ContactForm, QuoteForm } from "./forms";

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
      <p className="mt-4 max-w-3xl text-lg">{lead}</p>
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
        provider: { "@type": "ProfessionalService", name: site.legalName, url: site.url }, areaServed: "DE",
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

export function Home({ lang }: { lang: Lang }) {
  const c = getContent(lang);
  const p = c.pages.home;
  const lead = ["geo", "wordpress", "relaunch", "a11y"] as const;
  const more = ["landing", "chatbot", "automation", "custom"] as const;
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white" aria-labelledby="hero">
        <Picture src="/images/hero.jpg" alt="" width={1280} height={960} priority variants={[{ suffix: "-768", w: 768 }]}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35" />
        <div className={`${wrap} py-20 md:py-32`}>
          <p className="text-lg uppercase tracking-wide">{p.sub}</p>
          <h1 id="hero" className="mt-4 max-w-3xl text-4xl font-bold text-white md:text-5xl">{p.h1}</h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn btn-light" href="#analyse">{c.ui.ctaAnalysis}</Link>
            <Link className="btn btn-outline border-white text-white hover:bg-white hover:text-ink" href={pathFor("quote", lang)}>{c.ui.ctaQuote}</Link>
          </div>
        </div>
      </section>

      <section id="analyse" className={`${wrap} ${section} grid gap-8 md:grid-cols-2`} aria-labelledby="ana">
        <div><h2 id="ana" className="text-2xl font-bold">{p.analysisTitle}</h2><p className="mt-3">{p.analysisText}</p></div>
        <AnalysisForm lang={lang} f={getContent(lang).ui.forms} submitLabel={getContent(lang).ui.ctaAnalysis} />
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
      <Faqs title={p.faqTitle} items={p.faq} />

      <section className={`${wrap} ${section} text-center`}>
        <h2 className="text-2xl font-bold">{p.closing}</h2><div className="flex justify-center"><Cta lang={lang} /></div>
      </section>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "ProfessionalService", name: site.legalName, url: site.url,
        email: site.email, areaServed: site.region, inLanguage: lang,
        address: { "@type": "PostalAddress", addressLocality: site.address.city, addressCountry: site.address.country },
        description: p.description,
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
  return (<><PageHead lang={lang} id="quote" h1={p.h1} lead={p.lead} /><div className={`${wrap} ${section} max-w-3xl`}><QuoteForm lang={lang} f={getContent(lang).ui.forms} q={p} /></div></>);
}

export function AboutPage({ lang }: { lang: Lang }) {
  const p = getContent(lang).pages.about;
  return (
    <>
      <PageHead lang={lang} id="about" h1={p.h1} lead={p.lead} />
      <div className={`${wrap} ${section} max-w-3xl`}>
        {p.body.map((t) => <p key={t} className="mt-4">{t}</p>)}
        <List items={p.values} /><Cta lang={lang} />
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Person", name: site.partners[0], worksFor: { "@type": "Organization", name: site.legalName }, inLanguage: lang }} />
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
          <address className="mt-3 not-italic">{site.legalName}<br />{site.address.street}<br />{site.address.zip} {site.address.city}<br />
            <a className="underline text-accent" href={`mailto:${site.email}`}>{site.email}</a><br />{site.phone}</address></section>
      </div>
    </>
  );
}

function fill(t: string) {
  const a = site.address;
  return t.replace("{legalName}", site.legalName).replace("{address}", `${a.street}, ${a.zip} ${a.city}`.replace(", ,", ","))
    .replace("{partners}", site.partners.join(", ")).replace("{phone}", site.phone).replace("{email}", site.email).replace("{vatId}", site.vatId);
}

export function LegalPage({ id, lang }: { id: "imprint" | "privacy" | "a11yStatement"; lang: Lang }) {
  const p = getContent(lang).pages[id] as { h1: string; note: string; sections: LegalSection[] };
  return (
    <>
      <PageHead lang={lang} id={id} h1={p.h1} lead={p.note} />
      <div className={`${wrap} ${section} prose-flux max-w-3xl`}>
        {p.sections.filter((s) => site.vatId || !s.p.some((t) => t.includes("{vatId}"))).map((s) => (
          <section key={s.h} className="mt-8"><h2 className="text-xl font-bold">{s.h}</h2>{s.p.map((t) => <p key={t}>{fill(t)}</p>)}</section>))}
      </div>
    </>
  );
}
