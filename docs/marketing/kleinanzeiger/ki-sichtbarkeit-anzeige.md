# Kleinanzeigen ad: SEO- & KI-Check (for the thumbnail `docs/marketing/thumbnails/ki-sichtbarkeit.*`)

Ready-to-paste text for the ad, the "Rechtliche Angaben" blocks and the settings. Technical drafting aid, **not legal
advice**; the open points in section 5 must be settled before the ad goes live. Sources: `docs/competition-kleinanzeiger.md`
(packages and prices), `docs/impressum-option-d.md` and `docs/widerruf-datenschutz-option-d.md` (legal blocks),
`src/content/de.json` (service wording), `config/site.local.json` (business data, same as the published Impressum).

## 1. Ad settings

| Field | Value |
|---|---|
| Category | **Dienstleistungen > Weitere Dienstleistungen**, or the web / IT services category if Kleinanzeigen offers one (choose in the ad wizard) |
| Type | Angebot |
| Seller type | **Gewerblich** (a business must not post as a private seller, UWG) |
| Price | **250 €** |
| Price type | **Festpreis** (not "VB"; the package table in the text shows the other two prices) |
| Location | 88662 Überlingen, with the radius extended so the ad also shows nationwide (remote service) |
| Thumbnail | `docs/marketing/thumbnails/ki-sichtbarkeit.jpg` (1200 × 900, 4:3) |
| Shipping | none |

**Title** (65 characters maximum, 64 used):

```text
SEO- & KI-Check für Ihre Website | 3 Pakete ab 250 € | Festpreis
```

Alternative if the price should not be in the title: `SEO- & KI-Check: Werden Sie in Google & KI-Antworten genannt`.

## 2. Ad text (Beschreibung)

```text
Wird Ihre Firma in Google, ChatGPT, Claude und Perplexity gefunden?

Ich prüfe Ihre Website technisch und inhaltlich, teste, wie Ihre Firma in KI-Antworten erscheint, und sage Ihnen,
was zu tun ist. Auf Wunsch setze ich die wichtigsten Punkte direkt um. Persönlich vom Webentwickler am Bodensee,
nicht automatisch erzeugt. Festpreis, kein Abo, 100 % remote.

ZUM KENNENLERNEN: KOSTENLOSER STARTSEITEN-CHECK
Kurzer PDF-Bericht zu Ihrer Startseite innerhalb von 48 Stunden (2 Werktage), unverbindlich. Die Anzahl pro Woche
ist begrenzt. Schreiben Sie mir einfach die Adresse Ihrer Website, oder nutzen Sie das Formular:
https://www.fluxmedia.de/seo-analyse-kostenlos/

DIE PAKETE

BASIC – 250 €
✓ Analyse von 3 Seiten: technisches SEO, Titel und Überschriften, interne Verlinkung, Indexierung
✓ Core Web Vitals, mit Lighthouse gemessen
✓ Strukturierte Daten (JSON-LD) geprüft
✓ Priorisierte Maßnahmenliste
(keine Umsetzung, keine erneute Prüfung)

STANDARD – 450 €
✓ Alles aus Basic, für die vereinbarten Seiten
✓ Strukturierte Daten korrigiert (JSON-LD)
✓ KI-Sichtbarkeitstest: Fragen, die zu Ihrem Geschäft passen, in ChatGPT, Claude, Perplexity, Gemini und
  Google-KI-Antworten, mit Datum dokumentiert
✓ Umsetzung der wichtigsten Maßnahmen
✓ Erneute Prüfung nach einigen Wochen, mit kurzem Vorher-nachher-Vergleich

KOMPLETT – 890 €
✓ Alles aus Standard, bis zu 8 Seiten
✓ Prüfung der Barrierefreiheit (BFSG / WCAG 2.2) inklusive; die Behebung der Mängel wird nach Aufwand extra abgerechnet
✓ Sicherheitscheck, rein passiv (Sicherheits-Header, Verschlüsselung, veraltete Software, öffentlich erreichbare Dateien)

EINZELN BUCHBAR
Barrierefreiheit (BFSG / WCAG 2.2) ab 400 €, Sicherheitscheck ca. 150 €.
Auf Anfrage: Website-Relaunch, Landingpage, WordPress-Optimierung, KI-Chatbot.

SO GEHT ES
1. Sie senden mir die Adresse Ihrer Website (und, falls gewünscht, Ihr Wunschpaket).
2. Optional: kostenloser Startseiten-Check.
3. Sie erhalten ein Festpreis-Angebot. Erst nach Ihrer Zusage beginne ich.
4. Analyse, Gespräch über die Ergebnisse, Umsetzung, erneute Prüfung (je nach Paket).

WICHTIG
• Eine bestimmte Platzierung bei Google oder eine Nennung in KI-Antworten kann nicht garantiert werden.
• Nicht im Angebot: Backlink-Pakete, Anzeigenverwaltung (Google Ads), Google-Unternehmensprofil.
• Preise ohne Ausweis von Umsatzsteuer gemäß § 19 UStG.

Mehr zur Leistung: https://www.fluxmedia.de/leistungen/ki-sichtbarkeit/
Referenzen: https://www.fluxmedia.de/referenzen/

Fluxmedia, Inhaber Steven Greenwood, Bodensee. Schreiben Sie mir einfach hier über Kleinanzeigen.
```

Notes on the wording:

- "Nicht automatisch erzeugt" and "persönlich vom Webentwickler" repeat the site's own claims (analysis page).
- No ranking promise appears anywhere; "wird empfohlen" is only in the thumbnail's mock chat and is illustrative. If the
  ad is challenged, the "Wichtig" block is the safeguard.
- The 48-hour and weekly-limit wording follows `pages.analysis` on the site.
- The links go to the site's own pages (no third-party tracking). With `trailingSlash` enabled, keep the final slash.

## 3. Rechtliche Angaben (three blocks, paste into the Kleinanzeigen fields)

Consumers are accepted (decision of 25.10.2026), so the full Widerrufsbelehrung is used and not the businesses-only
short block.

### 3.1 Impressum

```text
Impressum
Angaben gemäß § 5 DDG
Fluxmedia
Inhaber: Steven Greenwood
Sandbühl 31
88662 Überlingen
Deutschland

Kontakt:
Telefon: +49 160 1222388
E-Mail: info@fluxmedia.de
www.fluxmedia.de

Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE447203035

Verbraucherstreitbeilegung: Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer
Verbraucherschlichtungsstelle teilzunehmen.
```

Check against the website's Impressum: the Kleinanzeigen block must say the same (name, address, phone, VAT ID). The
insurance statement (§ 2 DL-InfoV) is not in the Impressum; it goes into the ad text, see 3.4. The Steuernummer is
**not** published.

### 3.2 Widerrufsrecht & Muster-Widerrufsformular

```text
Widerrufsrecht & Muster-Widerrufsformular
(gilt für Verbraucher im Sinne von § 13 BGB; für Unternehmer besteht kein gesetzliches Widerrufsrecht)

Widerrufsbelehrung

Widerrufsrecht
Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.
Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z. B. ein mit der Post
versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können
dafür das Online-Formular unter https://www.fluxmedia.de/widerruf/ oder das unten stehende Muster-Widerrufsformular
verwenden, das jedoch nicht vorgeschrieben ist.
Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor
Ablauf der Widerrufsfrist absenden.

Ihren Widerruf richten Sie an:
Fluxmedia, Inhaber: Steven Greenwood
Sandbühl 31, 88662 Überlingen
E-Mail: info@fluxmedia.de

Folgen des Widerrufs
Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich
und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses
Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der
ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in
keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so haben Sie uns einen
angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des
Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum
Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.

Vorzeitiges Erlöschen des Widerrufsrechts
Ihr Widerrufsrecht erlischt bei einem Vertrag über die Erbringung von Dienstleistungen, wenn wir die Dienstleistung
vollständig erbracht haben und mit der Ausführung der Dienstleistung erst begonnen haben, nachdem Sie dazu Ihre
ausdrückliche Zustimmung gegeben und gleichzeitig Ihre Kenntnis davon bestätigt haben, dass Sie Ihr Widerrufsrecht
bei vollständiger Vertragserfüllung durch uns verlieren.

Muster-Widerrufsformular
(Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es zurück.)

An: Fluxmedia, Inhaber: Steven Greenwood, Sandbühl 31, 88662 Überlingen, E-Mail: info@fluxmedia.de

Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden
Dienstleistung: ................................
Bestellt am (*) / erhalten am (*): ................................
Name des/der Verbraucher(s): ................................
Anschrift des/der Verbraucher(s): ................................
Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): ................................
Datum: ................................
(*) Unzutreffendes streichen.
```

This is the same text as the live page `/widerruf/` (`pages.withdrawal`), with the contact data filled in, so the ad and
the site cannot contradict each other. Open legal point: the early-expiry paragraph (§ 356 Abs. 4 BGB) and the
requirement that the customer expressly asks for work to start within the period must be matched by the quote text.
Add to every quote for consumers: "Ich verlange ausdrücklich, dass Sie vor Ablauf der Widerrufsfrist mit der
Ausführung beginnen." (lawyer check, to-do item 68).

### 3.3 Datenschutzerklärung

```text
Datenschutzerklärung

Verantwortlicher:
Fluxmedia, Inhaber: Steven Greenwood, Sandbühl 31, 88662 Überlingen, E-Mail: info@fluxmedia.de

Wenn Sie uns über Kleinanzeigen, per E-Mail, telefonisch oder über unser Kontakt-, Analyse- oder Angebotsformular
auf fluxmedia.de kontaktieren, verarbeiten wir Ihren Namen, Ihre Kontaktdaten, die Adresse Ihrer Website und den
Inhalt Ihrer Anfrage, um sie zu beantworten (Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage auf einen Vertrag
abzielt, sonst lit. f DSGVO, berechtigtes Interesse an der Beantwortung von Anfragen). Die Website wird bei der
netcup GmbH in Deutschland gehostet (Auftragsverarbeitungsvertrag); wir setzen keine Analyse- oder
Tracking-Werkzeuge ein.
Wir löschen Ihre Anfrage, sobald sie bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten
entgegenstehen. Kommt ein Vertrag zustande, bewahren wir die geschäftlichen Unterlagen entsprechend den handels- und
steuerrechtlichen Fristen auf (in der Regel sechs bis zehn Jahre).
Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und
Widerspruch sowie das Recht, sich bei einer Aufsichtsbehörde zu beschweren. Wenden Sie sich dazu an die oben genannte
E-Mail-Adresse. Die ausführliche Erklärung finden Sie unter https://www.fluxmedia.de/datenschutz/
Nachrichten über Kleinanzeigen verarbeitet die Plattform als eigene Verantwortliche; dafür gilt deren
Datenschutzerklärung.
```

### 3.4 Versicherungsangabe (separate line for the ad text or the Impressum field)

The Impressum block does not need it, but § 2 Abs. 1 Nr. 11 DL-InfoV requires the insurance information to be given to
the customer. The site gives it on the quote page and in the home FAQ; for the ad, add this line **at the end of the
description** (it is not a risk to show, and the ad is the first place the customer sees an offer):

```text
Haftpflichtversicherung: Vermögensschaden- und Betriebshaftpflicht (IT-Haftpflicht) bei der Markel Insurance SE,
Sophienstraße 26, 80333 München; räumlicher Geltungsbereich: weltweit für Vermögensschäden, für Personen- und
Sachschäden mit USA-Bezug gelten Einschränkungen.
```

## 4. Consistency checklist (ad against site)

| Item | Ad | Site today | Action |
|---|---|---|---|
| Packages 250 / 450 / 890 € | in the ad | the page `/leistungen/ki-sichtbarkeit/` still says "ab 450 €" | Update the site page **before or at the same time** as the ad, or the ad contradicts it |
| Hourly rate 70 € / 50 € | not in the ad | "ab 50 € pro Stunde" | Keep out of the ad; update site wording (see competition doc, section 7) |
| Security check, accessibility add-on | in the ad | not described as a package | Add to the site, and clear the passive security check with exali (to-do 52) |
| Free check, 48 h, weekly limit | in the ad | on `/seo-analyse-kostenlos/` | Same |
| Widerruf text | full block | `/widerruf/` | Same text, keep in sync |
| Impressum data | filled in | `/impressum/` | Same; the Steuernummer is not shown anywhere |

## 5. Open points before the ad goes live

1. **Prices**: 250 / 450 / 890 € and the security check price are proposals (competition doc, section 5). Confirm them.
2. **Site update**: the package table and the new wording on `services.geo` (not done yet, see competition doc, section
   7). Without it, the ad and the site show different prices.
3. **Insurance**: exali confirmation that the activity list covers the SEO / AI-visibility work and the passive security
   check (to-do 52); the active-testing exclusion stays in the ad ("rein passiv").
4. **Lawyer check (to-do 68)**: Widerruf for consumers with the early-expiry clause (§ 356 Abs. 4 versus Abs. 6 BGB), the
   Widerrufsbutton wording, price statements with § 19 UStG.
5. **Kleinanzeigen fields**: the platform has separate fields for Impressum, Widerruf and Datenschutz (as seen in the
   competitors' ads); paste 3.1, 3.2 and 3.3 there, and keep 3.4 in the description.
6. **Do not use the saved competitor HTML files** (they hold other people's contact data) for anything beyond this
   comparison; they are not part of the repository.
7. Phone number in the Impressum: `+49 160 1222388` is the number in the site configuration. Confirm it is the one meant
   for public display.
