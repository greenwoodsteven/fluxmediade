// Technologies from the CV (docs/about-me/2026-10-22_cv-greenwood.html), duplicates removed.
// Order: the skills line first, then the technology lines of the two newest jobs (new entries only), then the rest.
// Product names are the same in both languages, only the heading is translated (about.techTitle).
export const technologies = [
  "JavaScript", "TypeScript", "Node.js", "React", "Next.js", "PHP",
  "Payload", "Storybook", "MongoDB", "Redis", "MySQL", "Docker", "AWS", "HTML5", "CSS3", "Scrum", "Git", "Confluence", "Jira", "IntelliJ",
  "jQuery", "Kafka", "Ansible", "LimeSurvey", "Bitbucket", "Raspberry Pi", "Biosignalsplux",
  "RequireJS", "Bootstrap", "Responsive Design", "WordPress", "Drupal", "Magento", "Apache Solr", "Linux", "Cloudflare",
  "GitLab", "Jenkins", "Grafana", "Mocha", "Lighthouse", "PageSpeed", "Google Analytics", "JSON-LD",
  "PayPal", "Apple Pay", "Stripe", "Emarsys", "Claude Code", "Tobii",
] as const;

/**
 * Tag cloud next to the free SEO & AI analysis on the start page: technologies and topics that relate to that analysis
 * (measuring, structured data, crawlability, accessibility, tooling). Source: the "Technical Skills" and technology lines of the CV.
 * Size: 4 = most relevant, 1 = background. Names that are the same in both languages are written once.
 */
type Term = { de: string; en?: string; w: 1 | 2 | 3 | 4 };
export const analysisCloud: Term[] = [
  { de: "Lighthouse", w: 4 }, { de: "PageSpeed", w: 4 }, { de: "JSON-LD", w: 4 }, { de: "GEO", w: 4 }, { de: "AEO", w: 4 },
  { de: "Barrierefreiheit", en: "Accessibility compliance", w: 4 },
  { de: "WCAG 2.2", w: 3 }, { de: "BFSG", w: 3 }, { de: "Crawler-Zugriff", en: "Crawler access", w: 3 },
  { de: "Performance-Audits", en: "Performance audits", w: 3 }, { de: "Google Analytics", w: 3 }, { de: "Claude Code", w: 3 },
  { de: "Next.js", w: 3 }, { de: "WordPress", w: 3 }, { de: "HTML5", w: 3 }, { de: "JavaScript", w: 3 },
  { de: "Sicherheitsprüfungen", en: "Security assessments", w: 2 }, { de: "KI-Chatbots", en: "AI chatbots", w: 2 },
  { de: "Node.js", w: 2 }, { de: "Cloudflare", w: 2 }, { de: "CSS3", w: 2 }, { de: "Responsive Design", w: 2 },
  { de: "TypeScript", w: 2 }, { de: "React", w: 2 }, { de: "PHP", w: 2 },
  { de: "Mocha", w: 1 }, { de: "Apache Solr", w: 1 },
];
