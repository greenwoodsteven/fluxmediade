"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import type { Lang } from "@/i18n/routes";

// Remembers an explicit language choice. Apache (public/.htaccess) reads this cookie on "/" and then
// skips the Accept-Language redirect. It is only ever set from the switcher, never on first visit.
export const LANG_COOKIE = "fm_lang";

function rememberLang(lang: Lang) {
  try {
    document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; SameSite=Lax; Secure`;
  } catch {
    // Cookies blocked: the switch itself still works, only the preference is not kept.
  }
}

export function LangLink({ lang, ...props }: ComponentProps<typeof Link> & { lang: Lang }) {
  return <Link {...props} lang={lang} onClick={() => rememberLang(lang)} />;
}
