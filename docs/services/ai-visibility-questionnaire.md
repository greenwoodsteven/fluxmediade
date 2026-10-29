# AI visibility: customer questionnaire (sent with the quote)

Where the input for the AI visibility test comes from (`ai-visibility.md` section 2.3, step 1). Decision 2026-10-29:
the quote wizard stays at four steps and collects no question set. Instead the studio sends this short questionnaire
**together with the written quote** for every AI visibility order (Standard and Komplett need all items; Basic needs
items 1 to 3 only, because it has no AI test). The quote auto-reply announces it (`api/quote.php`), and the process step
on `/leistungen/ki-sichtbarkeit/` mentions it.

Free check (home page only): no questionnaire. The 3 test questions are written from the home page itself (industry
and region are visible there).

## What the studio does with the answers

| Item | Used for |
|---|---|
| 1 Brand and services | the brand question ("What is [firm]?"), fact checks (name, services spelled correctly) |
| 2 Region | local-intent questions, location setting in the tools |
| 3 Pages | which pages are covered (Basic 3, Standard as agreed, Komplett up to 8) |
| 4 Customer questions | the question set: 15 or more questions, mixed types (local intent, comparison, brand) |
| 5 Competitors | which names to look for in the answers; competitors named by the assistants but missing here are noted |
| 6 Languages | language of the questions and the report |

The studio writes the final question set, shows it to the customer for approval **before** the first run (the same set
is reused for the re-test), and stores it with the log.

## E-mail text (German)

```text
Betreff: Fragebogen zu Ihrem Angebot (KI-Sichtbarkeit)

Guten Tag [Name],

zu Ihrem Angebot brauche ich ein paar Angaben, damit der KI-Sichtbarkeitstest zu Ihrem Geschäft passt. Kurze
Stichworte genügen; was Sie nicht wissen, lassen Sie einfach offen.

1. Firmenname und wofür Sie stehen (Leistungen in einem Satz)
2. Wo sind Ihre Kunden? (Ort, Region oder bundesweit)
3. Welche Seiten sollen geprüft werden? (Startseite und welche weiteren, bei Basic bis zu 3)
4. Was fragen Ihre Kunden, bevor sie bei Ihnen anrufen? 3 bis 5 Fragen in deren Worten, zum Beispiel
   „Welcher Zahnarzt in Konstanz hat samstags offen?“
5. Welche 2 bis 3 Mitbewerber sehen Sie? (optional)
6. In welcher Sprache sollen die Fragen gestellt werden? (Deutsch, Englisch oder beides)

Aus Ihren Antworten schreibe ich die Fragen für den Test und schicke sie Ihnen zur Freigabe, bevor ich beginne.
Dieselben Fragen verwende ich später für die erneute Prüfung, damit der Vergleich stimmt.

Ich verwende nur öffentliche Geschäftsdaten; bitte senden Sie keine Kundendaten oder Zugangsdaten.
(Zugang zur Website für die Umsetzung besprechen wir separat.)

Freundliche Grüße
[Signatur]
```

## E-mail text (English)

```text
Subject: Questionnaire for your quote (AI visibility)

Hello [name],

for your quote I need a few details so the AI visibility test fits your business. Short notes are enough; leave
out anything you don't know.

1. Company name and what you stand for (your services in one sentence)
2. Where are your customers? (town, region or nationwide)
3. Which pages should be checked? (home page and others; up to 3 for Basic)
4. What do your customers ask before they call you? 3 to 5 questions in their words, for example
   "Which dentist in Konstanz is open on Saturdays?"
5. Which 2 to 3 competitors do you see? (optional)
6. In which language should the questions be asked? (German, English or both)

From your answers I write the questions for the test and send them to you for approval before I start. I reuse the
same questions for the re-test later so the comparison holds.

I only use public business data; please do not send customer data or login details. (We discuss website access for
the implementation separately.)

Kind regards
[signature]
```

## Notes

- No personal data of the customer's own customers belongs in the answers (questions are phrased generically).
- Keep the answers with the order documents; delete them with the order data after the retention period
  (`docs/privacy-actions.md`).
- A web form for the questionnaire is not planned. If order volume grows, a small form at an unlisted URL with the same
  six items is the next step.
