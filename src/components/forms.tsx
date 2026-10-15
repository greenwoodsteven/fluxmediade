"use client";

import { createContext, useContext, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import type { Content } from "@/content";
import { pathFor, type Lang } from "@/i18n/routes";
import { site } from "@/content/site";

// Strings are passed in from server components so the client bundle does not ship both language files.
type F = Content["ui"]["forms"];
type Status = "idle" | "sending" | "ok" | "error";
type Errors = Record<string, string>;

const ErrorsCtx = createContext<Errors>({});

/** Message for the first failed constraint of a control, or "" when valid. */
function messageFor(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, f: F): string {
  if (el.validity.valid) return "";
  if (el.validity.valueMissing) return el.name === "consent" ? f.errConsent : f.errRequired;
  if (el.validity.typeMismatch || el.validity.patternMismatch) return (el as HTMLInputElement).type === "email" ? f.errEmail : f.errUrl;
  return el.validationMessage;
}

function Shell({ endpoint, lang, f, children, submitLabel, hideSubmit }: {
  endpoint: string; lang: Lang; f: F; children: ReactNode; submitLabel?: string; hideSubmit?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);

  /** Own validation (the form has noValidate, so no browser bubbles). Returns true when everything is valid. */
  function validate(): boolean {
    const next: Errors = {};
    let first: HTMLElement | null = null;
    for (const el of Array.from(formRef.current!.elements) as HTMLInputElement[]) {
      if (!el.name || el.type === "submit" || el.type === "button" || next[el.name] !== undefined) continue;
      const msg = messageFor(el, f);
      if (msg) { next[el.name] = msg; first ??= el; }
    }
    setErrors(next);
    first?.focus();
    return !first;
  }

  function onInput(e: FormEvent<HTMLFormElement>) {
    const el = e.target as HTMLInputElement;
    if (el.name && errors[el.name] !== undefined) {
      const msg = messageFor(el, f);
      setErrors((prev) => { const n = { ...prev }; if (msg) n[el.name] = msg; else delete n[el.name]; return n; });
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    const fd = new FormData(e.currentTarget);
    fd.set("lang", lang);
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) fd.set("ref", ref);
    setStatus("sending");
    try {
      const res = await fetch(endpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } });
      const json = await res.json().catch(() => ({}));
      setStatus(res.ok && json.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok")
    return <p role="status" className="rounded border-2 border-accent p-4 font-bold text-ink">{f.ok}</p>;

  const count = Object.keys(errors).length;
  return (
    <ErrorsCtx.Provider value={errors}>
      <form ref={formRef} onSubmit={onSubmit} onInput={onInput} noValidate className="space-y-4">
        <p className="text-sm text-muted">{f.required}</p>
        {children}
        {/* honeypot: hidden from people and assistive tech, bots fill it */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px" }}>
          <label>Company<input type="text" name="company" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <div>
          <label className="flex items-start gap-2">
            <input type="checkbox" name="consent" value="1" required className="mt-1 size-5"
              aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? "consent-error" : undefined} />
            <span>{f.consent.split(/<a>|<\/a>/).map((part, i) =>
              i === 1 ? <Link key={i} className="underline" href={pathFor("privacy", lang)}>{part}</Link> : <span key={i}>{part}</span>)}</span>
          </label>
          {errors.consent && <p id="consent-error" className="mt-1 font-bold text-accent">{errors.consent}</p>}
        </div>
        <div aria-live="polite">
          {count > 0 && <p className="font-bold text-accent">{f.errSummary}</p>}
          {status === "error" && (
            <p role="alert" className="font-bold text-red-800">{f.error} <a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p>
          )}
        </div>
        {!hideSubmit && (
          <button type="submit" disabled={status === "sending"} className="btn">
            {status === "sending" ? f.sending : submitLabel ?? f.send}
          </button>
        )}
      </form>
    </ErrorsCtx.Provider>
  );
}

function Field({ id, label, type = "text", required, hint, autoComplete, multiline, rows = 4 }: {
  id: string; label: string; type?: string; required?: boolean; hint?: string; autoComplete?: string; multiline?: boolean; rows?: number;
}) {
  const error = useContext(ErrorsCtx)[id];
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const common = { id, name: id, required, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, className: "field" } as const;
  return (
    <div>
      <label htmlFor={id} className="label">{label}{required && " *"}</label>
      {multiline ? <textarea {...common} rows={rows} /> : <input {...common} type={type} autoComplete={autoComplete} />}
      {hint && <p id={`${id}-hint`} className="mt-1 text-sm text-muted">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1 font-bold text-accent">{error}</p>}
    </div>
  );
}

export function AnalysisForm({ lang, f, submitLabel }: { lang: Lang; f: F; submitLabel: string }) {
  return (
    <Shell endpoint="/api/analysis.php" lang={lang} f={f} submitLabel={submitLabel}>
      <Field id="url" label={f.url} type="url" required />
      <Field id="terms" label={f.terms} required hint={f.termsHint} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label={f.name} required autoComplete="name" />
        <Field id="email" label={f.email} type="email" required autoComplete="email" />
      </div>
      <Field id="business" label={f.businessType} />
      <div>
        <label htmlFor="platform" className="label">{f.platform}</label>
        <select id="platform" name="platform" className="field">{f.platforms.map((p) => <option key={p}>{p}</option>)}</select>
      </div>
      <Field id="budget" label={f.budget} />
      <Field id="source" label={f.source} />
    </Shell>
  );
}

export function ContactForm({ lang, f }: { lang: Lang; f: F }) {
  return (
    <Shell endpoint="/api/contact.php" lang={lang} f={f}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label={f.name} required autoComplete="name" />
        <Field id="email" label={f.email} type="email" required autoComplete="email" />
      </div>
      <Field id="message" label={f.message} required multiline rows={6} />
    </Shell>
  );
}

export function QuoteForm({ lang, f, q }: { lang: Lang; f: F; q: Content["pages"]["quote"] }) {
  const [step, setStep] = useState(0);
  const last = q.stepTitles.length - 1;

  const choice = (name: string, options: string[], legend: string) => (
    <fieldset>
      <legend className="label">{legend}</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map((o, i) => (
          <label key={o} className="flex items-center gap-2 rounded border border-line p-3">
            <input type="radio" name={name} value={o} required defaultChecked={i === 0} className="size-5" />{o}
          </label>
        ))}
      </div>
    </fieldset>
  );

  // All steps stay in the DOM (hidden) so one native FormData collects everything.
  const panel = (i: number, body: ReactNode) => <div hidden={step !== i}>{body}</div>;

  return (
    <div>
      <p className="mb-4 font-bold text-ink" aria-live="polite">
        {f.step} {step + 1} {f.of} {q.stepTitles.length}: {q.stepTitles[step]}
      </p>
      <Shell endpoint="/api/quote.php" lang={lang} f={f} hideSubmit={step !== last}>
        {panel(0, choice("need", q.needs, q.stepTitles[0]))}
        {panel(1, choice("platform", q.platforms, q.platformQ))}
        {panel(2, <>{choice("scope", q.scopes, q.scopeQ)}<p className="mt-3 text-sm text-muted">{q.extra}</p></>)}
        {panel(3, (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="name" label={f.name} required autoComplete="name" />
              <Field id="email" label={f.email} type="email" required autoComplete="email" />
            </div>
            <Field id="url" label={f.url} type="url" />
            <Field id="message" label={f.message} multiline />
          </div>
        ))}
      </Shell>
      <div className="mt-4 flex gap-3">
        {step > 0 && <button type="button" className="btn btn-outline" onClick={() => setStep(step - 1)}>{f.back}</button>}
        {step < last && <button type="button" className="btn" onClick={() => setStep(step + 1)}>{f.next}</button>}
      </div>
    </div>
  );
}
