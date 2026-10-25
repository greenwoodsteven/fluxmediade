import de from "./de.json";
import en from "./en.json";
import type { Lang } from "@/i18n/routes";

export type Content = typeof de;
export type ServiceContent = Omit<Content["services"]["geo"], "freeCheck">;
export type LegalSection = { h: string; p: string[]; link?: { id: string; text: string } };

const dict: Record<Lang, Content> = { de, en: en as Content };
export const getContent = (lang: Lang): Content => dict[lang];
