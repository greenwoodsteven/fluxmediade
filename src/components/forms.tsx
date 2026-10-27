"use client";

import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import type { Content } from "@/content";
import { pathFor, type Lang } from "@/i18n/routes";
import { site } from "@/content/site";
import { QUOTE_NEED_KEY } from "./QuoteLink";

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

type Pow = { salt: string; sig: string; nonce: number };

/** Proof of work against bots: find a nonce so that SHA-256("salt:nonce") starts with `bits` zero bits (~0.3 s). */
async function solvePow(): Promise<Pow | null> {
  try {
    const res = await fetch("/api/challenge.php", { headers: { Accept: "application/json" } });
    const c = await res.json();
    const enc = new TextEncoder();
    for (let nonce = 0; nonce < 5_000_000; nonce++) {
      const h = new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(`${c.salt}:${nonce}`)));
      let bits = 0;
      for (const b of h) { if (b === 0) { bits += 8; continue; } bits += Math.clz32(b) - 24; break; }
      if (bits >= c.bits) return { salt: c.salt, sig: c.sig, nonce };
    }
  } catch {}
  return null;
}

function Shell({ endpoint, lang, f, children, submitLabel, hideSubmit, pow, okMessage, notice, consent = true, hideConsent, actions }: {
  endpoint: string; lang: Lang; f: F; children: ReactNode; submitLabel?: string; hideSubmit?: boolean;
  pow?: boolean; okMessage?: string; notice?: string; consent?: boolean; hideConsent?: boolean; actions?: ReactNode;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState("");
  const powRef = useRef<Promise<Pow | null> | null>(null);
  const startPow = () => { if (pow) powRef.current ??= solvePow(); };
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const okRef = useRef<HTMLParagraphElement>(null);

  // The form unmounts on success, which would drop keyboard focus onto <body>: move it to the confirmation.
  useEffect(() => { if (status === "ok") okRef.current?.focus(); }, [status]);

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
    if (status === "sending") return; // the button stays focusable (aria-disabled), so guard here
    if (!validate()) return;
    const fd = new FormData(e.currentTarget);
    fd.set("lang", lang);
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) fd.set("ref", ref);
    setStatus("sending");
    try {
      if (pow) {
        startPow();
        const solved = await powRef.current;
        powRef.current = null; // a challenge can be used once
        if (solved) { fd.set("pow_salt", solved.salt); fd.set("pow_sig", solved.sig); fd.set("pow_nonce", String(solved.nonce)); }
      }
      const res = await fetch(endpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } });
      const json = await res.json().catch(() => ({}));
      setErrorKey(res.ok && json.ok ? "" : json.error ?? "");
      setStatus(res.ok && json.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok")
    return <p ref={okRef} tabIndex={-1} role="status" className="rounded border-2 border-accent p-4 font-bold text-ink">{okMessage ?? f.ok}</p>;

  const count = Object.keys(errors).length;
  return (
    <ErrorsCtx.Provider value={errors}>
      <form ref={formRef} onSubmit={onSubmit} onInput={onInput} onFocus={startPow} noValidate className="space-y-4">
        <p className="text-sm text-muted">{f.required}</p>
        {children}
        {notice && <p className="text-sm text-muted">{notice}</p>}
        {/* honeypot: hidden from people and assistive tech, bots fill it */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px" }}>
          <label>Company<input type="text" name="company" tabIndex={-1} autoComplete="off" /></label>
        </div>
        {consent && (
        <div hidden={hideConsent}>
          <label className="flex items-start gap-2">
            <input type="checkbox" name="consent" value="1" required className="mt-1 size-5"
              aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? "consent-error" : undefined} />
            <span>{f.consent.split(/<a>|<\/a>/).map((part, i) =>
              i === 1 ? <Link key={i} className="underline" href={pathFor("privacy", lang)}>{part}</Link> : <span key={i}>{part}</span>)}</span>
          </label>
          {errors.consent && <p id="consent-error" className="mt-1 font-bold text-accent">{errors.consent}</p>}
        </div>
        )}
        <div aria-live="polite">
          {count > 0 && <p className="font-bold text-accent">{f.errSummary}</p>}
          {status === "sending" && <p className="sr-only">{f.sending}</p>}
          {status === "error" && (
            <p role="alert" className="font-bold text-red-800">{errorKey === "domain" ? f.errDomain : errorKey === "email" ? f.errEmailUsed : errorKey === "capacity" ? f.errCapacity : f.error} <a className="underline" href={`mailto:${site.email}`}>{site.email}</a></p>
          )}
        </div>
        {!hideSubmit && (
          <div className="flex flex-wrap gap-3">
            {actions}
            <button type="submit" aria-disabled={status === "sending" || undefined} className="btn">
              {status === "sending" ? f.sending : submitLabel ?? f.send}
            </button>
          </div>
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
    <Shell endpoint="/api/analysis.php" lang={lang} f={f} submitLabel={submitLabel} pow okMessage={f.okAnalysis} notice={f.analysisTerms}>
      <Field id="url" label={f.url} type="url" required />
      <Field id="terms" label={f.terms} required hint={f.termsHint} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label={f.name} required autoComplete="name" />
        <Field id="email" label={f.email} type="email" required autoComplete="email" />
      </div>
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
  const wizardRef = useRef<HTMLDivElement>(null);
  const stepChanged = useRef(false);
  const goTo = (n: number) => { stepChanged.current = true; setStep(n); };
  // After a step change the old button may vanish (on the last step "Next" does): put focus on the new step's first control.
  useEffect(() => {
    if (!stepChanged.current) return;
    wizardRef.current?.querySelector<HTMLElement>("[data-panel]:not([hidden]) input")?.focus();
  }, [step]);
  const last = q.stepTitles.length - 1;
  const backBtn = step > 0 ? <button type="button" className="btn btn-outline" onClick={() => goTo(step - 1)}>{f.back}</button> : null;

  const [needIdx, setNeedIdx] = useState(0);
  // A service page's quote button leaves the need in sessionStorage (no URL parameter); take it once.
  useEffect(() => {
    let n = NaN;
    try { n = Number(sessionStorage.getItem(QUOTE_NEED_KEY)); sessionStorage.removeItem(QUOTE_NEED_KEY); } catch {}
    if (!Number.isInteger(n) || n < 0 || n >= q.needs.length) return;
    setNeedIdx(n);
    wizardRef.current?.querySelectorAll<HTMLInputElement>('input[name="need"]')[n]?.click();
  }, [q.needs.length]);
  const [hasSite, setHasSite] = useState(true);
  const [platformIdx, setPlatformIdx] = useState(0);
  const geo = needIdx === q.needs.length - 2;   // "AI visibility & SEO" (second to last, before "Something else")

  const choice = (name: string, options: string[], legend: string, onPick?: (i: number) => void) => (
    <fieldset key={name + options.length}>
      <legend className="label">{legend}</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map((o, i) => (
          <label key={o} className="flex items-center gap-2 rounded border border-line p-3">
            <input type="radio" name={name} value={o} required defaultChecked={i === 0} className="size-5" onChange={() => onPick?.(i)} />{o}
          </label>
        ))}
      </div>
    </fieldset>
  );

  // All steps stay in the DOM (hidden) so one native FormData collects everything.
  const panel = (i: number, body: ReactNode) => <div data-panel hidden={step !== i}>{body}</div>;

  return (
    <div ref={wizardRef}>
      <p className="mb-4 font-bold text-ink" aria-live="polite">
        {f.step} {step + 1} {f.of} {q.stepTitles.length}: {q.stepTitles[step]}
      </p>
      <Shell endpoint="/api/quote.php" lang={lang} f={f} hideSubmit={step !== last} hideConsent={step !== last} actions={backBtn}>
        {panel(0, choice("need", q.needs, q.stepTitles[0], setNeedIdx))}
        {panel(1, (
          <div className="space-y-4">
            {choice("site", q.sites, q.siteQ, (i) => setHasSite(i === 0))}
            {hasSite ? (
              <>
                <Field id="platform_existing" label={q.existingLabel} hint={q.existingHint} />
                {choice("access", q.access, q.accessQ)}
              </>
            ) : (
              <>
                {choice("platform", q.platforms, q.platformQ, setPlatformIdx)}
                {platformIdx === q.platforms.length - 1 && <Field id="platform_other" label={q.otherLabel} />}
              </>
            )}
          </div>
        ))}
        {panel(2, geo
          ? <>{choice("scope", q.scopesGeo, q.scopeGeoQ)}<p className="mt-3 text-sm text-muted">{q.geoNote}</p></>
          : <>{choice("scope", q.scopes, q.scopeQ)}<p className="mt-3 text-sm text-muted">{q.extra}</p></>)}
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
        {step > 0 && step < last && backBtn}
        {step < last && <button type="button" className="btn" onClick={() => goTo(step + 1)}>{f.next}</button>}
      </div>
    </div>
  );
}

/** Online withdrawal (§ 356a BGB): footer link "Vertrag widerrufen" -> this form -> button "Widerruf bestätigen". */
export function WithdrawalForm({ lang, f, w }: { lang: Lang; f: F; w: Content["pages"]["withdrawal"] }) {
  return (
    <Shell endpoint="/api/withdrawal.php" lang={lang} f={f} submitLabel={w.confirm} okMessage={w.ok} consent={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label={f.name} required autoComplete="name" />
        <Field id="email" label={f.email} type="email" required autoComplete="email" />
      </div>
      <Field id="contract" label={w.contract} required hint={w.contractHint} />
      <Field id="message" label={w.note2} multiline rows={3} />
    </Shell>
  );
}
