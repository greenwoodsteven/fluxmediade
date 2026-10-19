// Business data comes from config/site.local.json (git-ignored; template: config/site.example.json).
// scripts/site-config.mjs validates it and writes site.generated.json before dev, build and lint.
// Placeholders must be filled before the Impressum goes live (deploy.sh refuses to deploy otherwise).
import data from "./site.generated.json";

export const site = {
  ...data,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fluxmedia.de",
};
