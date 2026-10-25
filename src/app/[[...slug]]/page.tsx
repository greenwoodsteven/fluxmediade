import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { allSegments, resolve, serviceIds, type ServiceId } from "@/i18n/routes";
import { getContent } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Home, ServicePage, ServicesIndex, AnalysisPage, QuotePage, ReferencesPage, AboutPage, ContactPage, GbrPage, WithdrawalPage, LegalPage } from "@/components/pages";

type Props = { params: Promise<{ slug?: string[] }> };

export const dynamicParams = false;
export const generateStaticParams = () => allSegments().map((slug) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = resolve((await params).slug);
  if (!r) return {};
  const c = getContent(r.lang);
  const isService = (serviceIds as readonly string[]).includes(r.id);
  const meta = isService ? c.services[r.id as ServiceId] : (c.pages as Record<string, { seoTitle: string; description: string }>)[r.id];
  return buildMetadata(r.id, r.lang, meta.seoTitle, meta.description);
}

export default async function Page({ params }: Props) {
  const r = resolve((await params).slug);
  if (!r) notFound();
  const { id, lang } = r;
  let body;
  if ((serviceIds as readonly string[]).includes(id)) body = <ServicePage id={id as ServiceId} lang={lang} />;
  else if (id === "home") body = <Home lang={lang} />;
  else if (id === "services") body = <ServicesIndex lang={lang} />;
  else if (id === "analysis") body = <AnalysisPage lang={lang} />;
  else if (id === "quote") body = <QuotePage lang={lang} />;
  else if (id === "references") body = <ReferencesPage lang={lang} />;
  else if (id === "about") body = <AboutPage lang={lang} />;
  else if (id === "contact") body = <ContactPage lang={lang} />;
  else if (id === "gbr") body = <GbrPage lang={lang} />;
  else if (id === "withdrawal") body = <WithdrawalPage lang={lang} />;
  else body = <LegalPage id={id as "imprint" | "privacy" | "a11yStatement"} lang={lang} />;
  return (<><Header lang={lang} current={id} /><main key={`${lang}-${id}`} id="main" tabIndex={-1} className="page-enter">{body}</main><Footer lang={lang} /></>);
}
