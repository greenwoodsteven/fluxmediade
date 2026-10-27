"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/** Remembers which service the visitor came from, so the quote form can preselect it. Kept in sessionStorage: nothing in the URL, nothing sent to the server. */
export const QUOTE_NEED_KEY = "fm_quote_need";

export function QuoteLink({ href, need, className, children }: { href: string; need?: number; className?: string; children: ReactNode }) {
  const remember = () => {
    try {
      if (need === undefined) sessionStorage.removeItem(QUOTE_NEED_KEY);
      else sessionStorage.setItem(QUOTE_NEED_KEY, String(need));
    } catch {}
  };
  return <Link className={className} href={href} onClick={remember}>{children}</Link>;
}
