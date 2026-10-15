import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static";

// CSS/JS are crawlable (the legacy robots.txt blocked them). AI crawlers are explicitly allowed (plan §5).
export default function robots(): MetadataRoute.Robots {
  const ai = ["GPTBot", "OAI-SearchBot", "PerplexityBot", "ClaudeBot", "Google-Extended"];
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }, ...ai.map((userAgent) => ({ userAgent, allow: "/" }))],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
