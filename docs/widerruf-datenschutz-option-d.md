# Widerrufsrecht and Datenschutzerklärung for Kleinanzeigen (simplified)

Simplified versions of the texts in the pdf-to-fax project (`docs/legal/legal-content-de.md`, sections 2 and 4, reviewed
by a lawyer on 26.08.2026 as a first assessment, not as model texts), adapted for Fluxmedia under option D (see
`impressum-option-d.md`). Technical drafting aid, **not legal advice**; a lawyer should check the final texts.

Placeholders in brackets as in `impressum-option-d.md`.

## 1. Decide first: businesses only or consumers too

| Choice | Effect |
|---|---|
| **Businesses only (recommended)** | The offer is for Unternehmer (§ 14 BGB). No statutory withdrawal right, so no instruction and no form are needed. Also avoids the new **Widerrufsbutton duty** (§ 356a BGB, in force since 19.06.2026 according to the pdf-to-fax lawyer): a visible, permanent button on the website for consumer contracts that carry a withdrawal right. The block in section 2 is enough |
| Consumers too | A distance contract for services gives a 14-day withdrawal right (§§ 312g, 355 BGB). Needs the full instruction and form (section 3), the express request to start within the period, the Wertersatz rule, **and** the Widerrufsbutton on the website. For bespoke projects the right does not expire early unless the work is completed in full |

If the ad says "nur für Unternehmer" the owner should still check each enquiry: a sole trader buying for a private
purpose is a consumer. Ask for the business purpose in the first reply (company name, VAT ID or trade).

## 2. Block "Widerrufsrecht" for businesses only (short)

```text
Widerrufsrecht
Unser Angebot richtet sich ausschließlich an Unternehmer im Sinne von § 14 BGB (Gewerbetreibende,
Freiberufler, Vereine und Organisationen, die zu gewerblichen oder selbstständigen Zwecken handeln).
Ein gesetzliches Widerrufsrecht für Verbraucher besteht daher nicht. Verträge mit Verbrauchern
schließen wir über diese Anzeige nicht.
```

## 3. Block "Widerrufsbelehrung & Muster-Widerrufsformular" if consumers are accepted

Adapted from pdf-to-fax section 4 (service contract). Complete trader data must appear **in the block itself**, the
lawyer asked for "die vollständigen Angaben des Vertragspartners".

```text
Widerrufsbelehrung

Widerrufsrecht
Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.
Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z. B. ein mit der
Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
Sie können dafür das unten stehende Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des
Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.

Ihren Widerruf richten Sie an:
Fluxmedia, Inhaber: [VOLLER NAME]
[ANSCHRIFT]
E-Mail: info@fluxmedia.de

Folgen des Widerrufs
Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben,
unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung
über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir
dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit
Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser
Rückzahlung Entgelte berechnet.
Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so haben Sie uns
einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der
Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten
Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.

Vorzeitiges Erlöschen des Widerrufsrechts
Ihr Widerrufsrecht erlischt bei einem Vertrag über die Erbringung von Dienstleistungen, wenn wir die
Dienstleistung vollständig erbracht haben und mit der Ausführung der Dienstleistung erst begonnen haben,
nachdem Sie dazu Ihre ausdrückliche Zustimmung gegeben und gleichzeitig Ihre Kenntnis davon bestätigt
haben, dass Sie Ihr Widerrufsrecht bei vollständiger Vertragserfüllung durch uns verlieren.

Muster-Widerrufsformular
(Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es zurück.)

An: Fluxmedia, Inhaber: [VOLLER NAME], [ANSCHRIFT], E-Mail: info@fluxmedia.de

Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der
folgenden Dienstleistung: ................................
Bestellt am (*) / erhalten am (*): ................................
Name des/der Verbraucher(s): ................................
Anschrift des/der Verbraucher(s): ................................
Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): ................................
Datum: ................................
(*) Unzutreffendes streichen.
```

Differences from pdf-to-fax:

- **Operator** is Fluxmedia, Inhaber, instead of the other business; no GbR.
- **Service wording**: "folgende Dienstleistung" is filled in per order (website, SEO audit, chatbot), the fax wording is gone.
- **Early expiry** (§ 356 Abs. 4 BGB for services): for a bespoke project the right normally lasts the full 14 days
  because the work is not finished within that time; the consumer must express the wish to start earlier, and then pays a
  proportional amount. pdf-to-fax relied on § 356 Abs. 6 BGB (digital content); that does **not** apply here. Confirm with
  the lawyer.
- **Widerrufsbutton** is not part of the text but a website feature (see section 1).

## 4. Block "Datenschutzerklärung" (short, for the ad)

Simplified from pdf-to-fax section 2; no payment provider, no fax carrier, no Cloudflare. Fluxmedia's actual processing
is in `src/content/de.json` (`pages.privacy`): netcup hosting in Germany, no analytics or third-party content, forms by
e-mail through netcup, no cookies except the language cookie.

```text
Datenschutzerklärung

Verantwortlicher:
Fluxmedia, Inhaber: [VOLLER NAME], [ANSCHRIFT], E-Mail: info@fluxmedia.de

Wenn Sie uns über Kleinanzeigen, per E-Mail, telefonisch oder über unser Kontakt- oder Angebotsformular
auf fluxmedia.de kontaktieren, verarbeiten wir Ihren Namen, Ihre Kontaktdaten und den Inhalt Ihrer
Anfrage, um sie zu beantworten (Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage auf einen Vertrag
abzielt, sonst lit. f DSGVO, berechtigtes Interesse an der Beantwortung von Anfragen). Die Website
wird bei der netcup GmbH in Deutschland gehostet (Auftragsverarbeitungsvertrag); wir setzen keine
Analyse- oder Tracking-Werkzeuge ein.
Wir löschen Ihre Anfrage, sobald sie bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten
entgegenstehen. Kommt ein Vertrag zustande, bewahren wir die geschäftlichen Unterlagen entsprechend den
handels- und steuerrechtlichen Fristen auf (in der Regel sechs bis zehn Jahre).
Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
Datenübertragbarkeit und Widerspruch sowie das Recht, sich bei einer Aufsichtsbehörde zu beschweren.
Wenden Sie sich dazu an die oben genannte E-Mail-Adresse. Die ausführliche Erklärung finden Sie unter
https://www.fluxmedia.de/datenschutz/
```

Checks:

- The full privacy page on fluxmedia.de must **name the new controller** (same switch as the Impressum), otherwise this
  block links to a text that names the GbR.
- Retention periods "sechs bis zehn Jahre" follow the website text; the Steuerberater confirms them for the owner's EÜR
  business (pdf-to-fax uses 10 years for transaction data under § 147 AO and § 257 HGB).
- Kleinanzeigen processes the chat messages as its own controller (its privacy policy applies to the platform).
- The GbR's contact page, if it collects data, needs its own short privacy block naming the GbR as controller.

## 5. Where each block goes

| Kleinanzeigen field | Text |
|---|---|
| Impressum | `impressum-option-d.md` section 4 |
| Widerrufsrecht & Muster-Widerrufsformular | Section 2 (businesses only) or section 3 (consumers too) |
| Datenschutzerklärung | Section 4 |
