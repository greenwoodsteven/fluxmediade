# Impressum, GbR contact page and Kleinanzeigen "Rechtliche Angaben" under option D

Draft texts for the case where **option D** in `legal-audit.md` section 9a is taken: Fluxmedia is run by the owner as a
sole trader ("Fluxmedia, Inhaber: Full Name"). The GbR is not dissolved. It stays available for freiberufliche orders
through a **separate contact page**, and the Impressum makes the split visible.

Technical review and drafting aid, **not legal advice**. Have the Steuerberater or a lawyer check the final texts
(order of work in `legal-audit.md` 9a). Withdrawal and privacy texts for Kleinanzeigen: `widerruf-datenschutz-option-d.md`.

## Decisions and status (owner, 2026-10-25)

- All work comes in through the Einzelunternehmer for now (insurance); specific jobs go through the GbR on its own contact page.
- Co-partner is passive and accepts the owner's decisions. Consumers are accepted (Widerruf page and button needed).
- The insurance statement goes into the **quote page and the home FAQ** (no AGB exist), not into the Impressum. The
  Impressum text in section 2 below shows the optional block for completeness; the live site does not use it.
- Data is in `config/site.local.json` (git-ignored): owner Steven Greenwood, address Sandbühl 31, 88662 Überlingen,
  USt-IdNr. DE447203035. The **Steuernummer is not published**. The GbR block uses the former GbR USt-IdNr. and
  `info@fluxmedia.de`.
- **Check:** the data you pasted lists `info@fluxmedia.de` as the business e-mail. The site and the Impressum use
  `mail@fluxmedia.de` (your earlier change) and use `info@fluxmedia.de` for the GbR. Say if the owner's address should be
  `info@` instead.
- Implemented in the code (built and tested locally, not committed or deployed): Impressum, `/kontakt-gbr/`, `/widerruf/`
  with online form and footer button, privacy controller change, quote-page information, FAQ, mail signature.
  Status per item: `development-todo.md` section 1a.

Square brackets are placeholders. Take them **word for word from the Gewerbeanmeldung and the Finanzamt letter**.

## 0a. Where the owner's name must appear (decision 2026-10-25: as little as possible)

The name is **not** needed in the footer, the copyright line, the contact page, the quote page, the GbR page or the
automatic replies. Required or advisable:

| Place | Why | Source |
|---|---|---|
| Impressum | Name of the provider; for a sole trader the full first and last name | § 5 Abs. 1 Nr. 1 DDG |
| Privacy policy | Name and contact details of the controller | Art. 13 Abs. 1 lit. a DSGVO |
| Widerrufsbelehrung and model form | Name and address of the trader to whom the withdrawal is sent | Art. 246a § 1 Abs. 2 EGBGB, Anlage 1 and 2 |
| Quote (the document), contract and invoice | Identity and address of the trader before the contract; invoice issuer's full name | Art. 246a § 1 Abs. 1 Nr. 2, 3 EGBGB; § 14 Abs. 4 Nr. 1 UStG |
| About me page | Voluntary: it is the page about the person | none |
| Withdrawal confirmation e-mail | Advisable: confirms receipt for the trader | none |

The quote *page* is only a request form; it links to the Impressum for the provider details. The binding quote
document you send must carry the full name and address. Not required for a Kleingewerbe: the extra business-letter data of
§ 37a HGB (that applies to registered merchants). Technical review, not legal advice.

## 1. Facts to fill in

| Placeholder | Source | Note |
|---|---|---|
| `[VOLLER NAME]` | Gewerbeanmeldung | Full first and last name. Required |
| `[ANSCHRIFT]` | Gewerbeanmeldung | Street, postcode, town. A **ladungsfähige Anschrift**, no P.O. box. The GbR's address (Sandbühl 31, Überlingen) and the policy address are the same today; if the owner's business address is the same, say so only once per page |
| `[TELEFON]` | existing | Second quick way to make contact next to the e-mail |
| `[USt-IdNr.]` | Bundeszentralamt für Steuern | Only if issued (§ 5 Abs. 1 Nr. 6 DDG). Not the Steuernummer. Leave the line out otherwise |
| Insurer | Versicherungsschein EX.MPI.52981 | Markel Insurance SE, Sophienstr. 26, 80333 München (the broker exali AG is not the insurer) |
| `[GELTUNGSBEREICH]` | Versicherungsbedingungen | Territorial scope is **not** in the Versicherungsschein; read it in the "IT-Haftpflicht Bedingungen exali 2026-03" |
| Register entry | none expected | A Kleingewerbe without Handelsregister entry: leave the line out |

"Fluxmedia" should be entered as business designation in the Gewerbeanmeldung.

## 2. Impressum for fluxmedia.de (German)

```text
Impressum

Angaben gemäß § 5 DDG

Fluxmedia
Inhaber: [VOLLER NAME]
[ANSCHRIFT]
Deutschland

Kontakt
Telefon: [TELEFON]
E-Mail: mail@fluxmedia.de

Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: [USt-IdNr.]

Berufshaftpflichtversicherung
Vermögensschaden- und Betriebshaftpflichtversicherung (IT-Haftpflicht) für den Inhaber
Versicherer: Markel Insurance SE, Sophienstraße 26, 80333 München
Räumlicher Geltungsbereich: [GELTUNGSBEREICH]

Verbraucherstreitbeilegung
Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer
Verbraucherschlichtungsstelle teilzunehmen.

Fluxmedia GbR
Die Fluxmedia GbR besteht weiterhin und steht für freiberufliche Aufträge zur Verfügung.
Diese Aufträge nimmt ausschließlich die GbR über ihre eigene Kontaktseite entgegen:
[Link: Kontakt Fluxmedia GbR]. Verträge über die auf dieser Website beschriebenen Leistungen
(Webentwicklung, KI-Sichtbarkeit & SEO, Chatbots, Automatisierung) schließt der oben genannte
Inhaber; die Fluxmedia GbR ist daran nicht beteiligt. Vertragspartner ist jeweils nur diejenige
Person oder Gesellschaft, die im Angebot ausdrücklich genannt ist. Bitte richten Sie Anfragen
und Aufträge deshalb nur an die dort genannte Adresse.
```

Notes:

- **Inhaber**: for a sole trader the Impressum names the natural person. No partner list.
- **Contact** (§ 5 Abs. 1 Nr. 2 DDG): e-mail plus a second quick way (phone). The forms are an additional channel.
- **Streitbeilegung** (§ 36 VSBG): up to 10 employees means no duty to take part, but a statement is required. Change
  the sentence if the owner would take part. The EU online platform closed on 20 July 2025, so no link is needed.
- **Kleinunternehmer** (§ 19 UStG): not an Impressum item. If no USt-IdNr. exists, drop the line. The note
  "Kein Ausweis von Umsatzsteuer gemäß § 19 UStG" belongs on invoices, and the net/gross statement on quotes.
- **Not needed**: Handelsregister, Aufsichtsbehörde, Kammer and Berufsrecht (not a regulated profession), and
  "Verantwortlich nach § 18 Abs. 2 MStV" unless there is editorial content.
- **Insurance block** (§ 2 Abs. 1 Nr. 11 DL-InfoV): see section 2a.
- **GbR block**: the sentence "Vertragspartner ist jeweils nur ..." is what makes the divergence clear. It must stay
  true: do not accept an order for the services listed under the GbR through the owner's address and vice versa.

### 2a. The insurance line

The duty comes from **§ 2 Abs. 1 Nr. 11 DL-InfoV**, not from § 5 DDG: a provider who has taken out a professional
liability insurance gives the insurer's name, address and the territorial scope of cover. The way is the provider's
choice (§ 2 Abs. 2): on their own initiative, on site, in an electronically available form, or in the information
documents sent to the customer. That a Vermögensschaden-Haftpflicht counts as Berufshaftpflichtversicherung is likely
but not settled in my recollection; confirm with the lawyer.

| Place | Verdict |
|---|---|
| Impressum | Allowed and common; the simplest way to meet the duty |
| Quote / AGB | Equally valid |
| Nowhere | Risky once the policy exists (Abmahnung for a missing mandatory information) |

Rules for the published line:

- The insurer is **Markel Insurance SE**; exali AG is the broker and is not named.
- The line says the policy is for **the owner (Inhaber)**. The policy does **not** cover the GbR (section 2, GbR block),
  so the insurance line must not appear on the GbR's contact page.
- Territorial scope: from the Bedingungen, not guessed. Do not state sums insured.
- The policy runs to 01.10.2027. Remove or update the line the day the cover changes or ends.
- The declared turnover band is 0 to 30,000 €. Report changes through the annual online change report (Jahresmeldung),
  otherwise the published statement may not match the cover.

### English courtesy version

```text
Legal notice

Information pursuant to § 5 DDG

Fluxmedia
Owner: [VOLLER NAME]
[ANSCHRIFT]
Germany

Contact
Phone: [TELEFON]
E-mail: mail@fluxmedia.de

VAT ID pursuant to § 27a UStG: [USt-IdNr.]

Professional liability insurance
Financial-loss and general liability insurance (IT liability) for the owner
Insurer: Markel Insurance SE, Sophienstraße 26, 80333 München, Germany
Territorial scope: [GELTUNGSBEREICH]

Consumer dispute resolution
We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.

Fluxmedia GbR
Fluxmedia GbR still exists and is available for freelance (freiberufliche) orders. These orders are taken only by the
GbR, through its own contact page: [link: Contact Fluxmedia GbR]. Contracts for the services described on this website
(web development, AI visibility & SEO, chatbots, automation) are concluded by the owner named above; Fluxmedia GbR is
not a party to them. The contracting party is always only the person or company named in the quote. Please send
enquiries and orders only to the address named there.
```

## 3. Separate contact page for Fluxmedia GbR

A separate page, for example `/kontakt-gbr/`, linked from the Impressum block and from the footer. It is a page of its
own, so it needs its own provider details (§ 5 DDG), and it must not reuse the owner's quote form.

```text
Kontakt Fluxmedia GbR (freiberufliche Aufträge)

Fluxmedia GbR
Gesellschafter: Steven Greenwood, Melanie Wein
Sandbühl 31, 88662 Überlingen
E-Mail: [info@fluxmedia.de oder andere Adresse der GbR]
Telefon: [TELEFON DER GBR]
Umsatzsteuer-Identifikationsnummer: [USt-IdNr. der GbR]

Diese Seite ist für freiberufliche Aufträge der Fluxmedia GbR. Für Webentwicklung, KI-Sichtbarkeit & SEO,
Chatbots und Automatisierung von Fluxmedia (Inhaber [VOLLER NAME]) nutzen Sie bitte die Kontaktseite
von Fluxmedia: [Link]. Verträge werden nur mit der im Angebot genannten Partei geschlossen.
```

Points to settle before it goes live:

| Point | Note |
|---|---|
| Co-partner | Melanie Wein must agree in writing to the wording and to being named |
| What counts as freiberuflich | The GbR page should list only work the Steuerberater accepts as freiberuflich (§ 18 EStG). Web development and SEO are often gewerblich; listing them there would repeat the Abfärbung risk. Wording: describe the actual freiberufliche activity, for example consulting, training or other work as agreed with the Steuerberater, not "web development" |
| Insurance | The current policy does not cover the GbR. The GbR needs its own cover before it takes orders; until then the page should say nothing about insured status |
| Form and mail | Do not reuse the owner's quote form or `mail@fluxmedia.de`; a separate address keeps the two flows apart. Contact form: new endpoint or plain mailto link |
| Privacy | The GbR is its own controller for what it collects. The privacy page names both controllers (owner for fluxmedia.de, GbR for the GbR page) |
| Same address | Both parties currently use the same street address. That is legal, but then the separate contact page, e-mail and the "never through the other party's address" sentence are what make the split clear |

## 4. Rechtliche Angaben for the Kleinanzeigen ad (Impressum block)

Layout follows the comparison seller (Impressum, Widerrufsrecht & Muster-Widerrufsformular, Datenschutzerklärung).

```text
Impressum
Angaben gemäß § 5 DDG
Fluxmedia
Inhaber: [VOLLER NAME]
[ANSCHRIFT]
Deutschland
Kontakt:
Telefon: [TELEFON]
E-Mail: mail@fluxmedia.de
www.fluxmedia.de
USt-IdNr.: [USt-IdNr.]
Berufshaftpflichtversicherung: Markel Insurance SE, Sophienstraße 26, 80333 München,
Geltungsbereich: [GELTUNGSBEREICH]
```

The Widerrufsrecht and Datenschutzerklärung blocks are in `widerruf-datenschutz-option-d.md`. Ad text rules:

- Mark the ad as **commercial** (gewerblich); a business posing as private seller breaks the UWG.
- Show the **price** and say whether it is net or gross (PAngV). For a Kleinunternehmer: "Preise ohne Ausweis von
  Umsatzsteuer gemäß § 19 UStG". For a VAT payer in a B2B-only offer: "zzgl. gesetzlicher Umsatzsteuer".
- Use the same price and scope wording as the website ("ab 50 € pro Stunde" with the volume note).
- No guarantee wording ("Platz 1", "garantiert in ChatGPT sichtbar").
- Name the owner and "Fluxmedia", not the GbR. Orders for the GbR's freiberufliche work do not go through this ad.

## 5. What the Finanzamt could gather from the switch

The Finanzamt does not read the website for assessment, but it can. What it would see, and the answer for each:

| Visible fact | Likely question | Answer |
|---|---|---|
| The Impressum names the owner as the operator of Fluxmedia, with a business activity in web, SEO and AI work | Is the activity registered and taxed? | Gewerbeanmeldung must list the activity; income goes into the existing EÜR; combined turnover counts for § 19 UStG |
| The GbR "remains available for freiberufliche orders" | Is the GbR still active, and what does it do? | It supports the GbR as active, which suits the plan only if the GbR really does freiberufliche work; do not claim activity that is not there |
| Same brand and domain used by two parties | Does the owner pay for the brand? Does income move out of the GbR? | Steuerberater: the owner says no transfer is required; confirm free use has no tax effect |
| The GbR page lists services | Gewerblich services in a freiberuflich GbR? | Abfärbung risk (§ 15 Abs. 3 Nr. 1 EStG) |

Do not word the Impressum for the Finanzamt; the filings and the Steuerberater's letter are the channel.

## 6. Other places that change together

1. Privacy policy: controllers (owner for fluxmedia.de, GbR for its page), processor contracts with netcup.
2. Quote form text and the confirmation e-mails (the `api/` auto-reply signs "Fluxmedia"; add the owner in the footer).
3. AGB or terms, if any (contracting party).
4. Invoice template: owner's full name, address, tax number or USt-IdNr., the § 19 UStG note if applicable.
5. JSON-LD (`legalName`, organisation node) and `config/site.local.json` (`legalName`, `partners`, `address`, `vatId`).
6. Accessibility statement (contact, responsible body).
7. External profiles: Kleinanzeigen, Google Business Profile, LinkedIn page, directories.
8. The GbR contact page, footer link and the Impressum block.

## 7. Open points for the owner

- The territorial scope and the declared activity list: add the "IT-Haftpflicht Bedingungen exali 2026-03" to
  `docs/insurance/` so the insurance line can be checked against it.
- Which freiberufliche work the GbR actually offers (Steuerberater to confirm the classification).
- GbR insurance, address, e-mail and phone for the separate contact page.
- Whether to publish the insurance line in the Impressum or only in the quote.
