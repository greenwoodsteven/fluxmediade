// One config for every "ab €" slot. Leave a value empty and the figure is hidden
// automatically; the placeholder text is shown until prices are decided.
export const prices: Record<string, string> = {
  geo: "",
  a11y: "",
  relaunch: "",
  wordpress: "",
  landing: "",
  chatbot: "",
  automation: "",
};

export function priceLabel(id: string, lang: "de" | "en"): string {
  const v = prices[id];
  const from = lang === "de" ? "ab" : "from";
  return v ? `${from} ${v}` : `${from} € [${lang === "de" ? "PREIS" : "PRICE"}]`;
}
