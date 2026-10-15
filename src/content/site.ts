// Single place for business data. Placeholders must be filled before the
// Impressum goes live and before Kleinanzeigen ads are posted (plan §10, item 13).
export const site = {
  name: "Fluxmedia",
  legalName: "Fluxmedia GbR",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fluxmedia.de",
  email: "greenwood@fluxmedia.de",
  phone: "[TELEFON]",
  address: { street: "[ADRESSE]", zip: "", city: "Überlingen", country: "DE" },
  region: "Bodensee",
  partners: ["Steven Greenwood", "Melanie Wein"],
  vatId: "[USt-IdNr.]",
} as const;
