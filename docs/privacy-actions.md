# Privacy: analysis and required actions

Status: **2026-10-19**, commit `169e8e3`. Companion to `docs/legal-audit.md` (section 4). This is a technical analysis and a
to-do list, **not legal advice**: have the policy and the open points reviewed by a lawyer or data-protection officer.

The policy text lives in `src/content/{de,en}.json` under `pages.privacy` and is shown at `/datenschutz/` and
`/en/privacy/`. It names the controller (Fluxmedia GbR), the processor (netcup GmbH) and the supervisory authority
(Baden-Württemberg commissioner).

## 1. What the policy promises vs. what the system does

| # | Processing | Policy says | The system does (code) | Match |
|---|---|---|---|---|
| 1 | Server logs | netcup logs IP, time, URL, status, user agent, referrer; deleted "after a short time"; processor agreement exists | done by netcup, not by us | **to verify** at netcup (retention, agreement) |
| 2 | Cookies, tracking, third parties | none | no cookies, no browser storage, requests only to the same host (CSP `'self'`) | yes (confirm once in a browser) |
| 3 | Contact and quote forms | data sent by email, auto-reply, stored in the mailbox, deleted when done; statutory retention if a contract follows | `api/contact.php`, `quote.php` send two mails through netcup SMTP; nothing else is stored; the mail contains the form fields plus language and `ref` | yes; deletion in the mailbox is manual (see action 6) |
| 4 | Free analysis, pending data | stored until the email is confirmed, link valid 48 h, then deleted automatically (daily clean-up) | `pending/<hash of token>` file; removed on confirmation, when opened after expiry, by `audit_cleanup()` (cron) and opportunistically | yes **if the cron job runs** (action 3) |
| 5 | Free analysis, domain | domain kept 90 days only as a hash | `domains/<sha256(host)>`; removed after `domain_days` by `audit_cleanup()` and on registration | yes (cron) |
| 6 | Free analysis, weekly cap | confirmed requests counted without personal data | empty marker files in `confirmed/`, 7 days | yes |
| 7 | Proof of work | browser task, no data to third parties, no cookies | `challenge.php` returns a signed random value; used values kept as hashes for 1 h | yes |
| 8 | Abuse protection | salted hash of the IP and request times, deleted after one day at the latest | `ratelimit/<hash(smtp password + IP)>` holds timestamps; cleared by `audit_cleanup()` and randomly on requests | yes (cron) |
| 9 | Email | delivered and stored via netcup mail server; unencrypted transport possible | PHPMailer over SMTP/TLS to the netcup mail server | yes |
| 10 | No advertising use of analysis addresses without consent | stated | no mailing list, no export | yes: this is a **commitment** to keep |
| 11 | Recipients / third countries | only us and netcup; no transfer outside EU/EEA | no other services contacted by the server or the browser | yes (re-check after every new integration) |
| 12 | External links | no data sent before a click | plain `<a href>` links, no embeds | yes |
| 13 | Automated decisions | none | none | yes |

## 2. Required actions

Priority: **A** before you rely on the policy, **B** soon, **C** when the event happens.

| # | Prio | Action | How | Owner | Status |
|---|---|---|---|---|---|
| 1 | A | Confirm the **processor agreement (AVV) with netcup** and keep the confirmation | netcup customer control panel (data protection / contracts); download and file the PDF | you | open |
| 2 | A | Find out **how long netcup keeps server logs** and which IP handling applies; put the real period in the policy if it is long | netcup documentation or support; update the "Hosting und Server-Logfiles" section | you | open |
| 3 | A | Set up the **daily cron job** for `api/cleanup.php` | customer panel, cron job: `php /full/path/to/httpdocs/_fluxmediade/api/cleanup.php`; run it once over SSH and expect "cleanup done"; see `deploy/README.md` (One time, step 8) | you | open |
| 4 | A | Make sure `storage_dir` in `api/config.php` is **outside the webroot** and the folder has mode 700 | `deploy/README.md`, One time, step 3; check `ls -ld` on the folder | you | open |
| 5 | A | **Legal review** of the policy text (German version is authoritative) | lawyer or DPO; send them `src/content/de.json` section `pages.privacy` and this file | you | open |
| 6 | B | Define the **mailbox retention rule** for requests ("delete after completion, keep business records for the statutory period") and apply it | a yearly clean-up of the mailbox; mark requests that became contracts | you | open |
| 7 | B | Confirm the **supervisory authority** for the registered seat | register entry or Gewerbeanmeldung gives the seat; compare with the authority named in the policy | you | open |
| 8 | B | Check the **small print of the forms**: consent text is shown, the terms of the free analysis are shown, the privacy link works | open `/kontakt/`, `/angebot/`, `/seo-analyse-kostenlos/` in both languages | you | open |
| 9 | B | Create the **processing register (Art. 30)** from section 4 of this file and file it | one page, keep it with the AVV | you | open |
| 10 | B | Write a **short procedure for data-subject requests** and for a **data breach** | section 5 of this file as a start | you | open |
| 11 | B | Browser check: **no cookies, no storage, requests only to fluxmedia.de** | developer tools, *Application* and *Network* tabs, on the live site | you | open |
| 12 | C | When **adding any feature** that touches personal data (see section 6), update the policy first | checklist in section 6 | whoever changes the site | standing |
| 13 | C | When a client or visitor asks for **deletion or access** | procedure in section 5 | you | standing |

## 3. Retention periods in one place

| Data | Where | Kept | Deleted by |
|---|---|---|---|
| Server logs | netcup | per netcup setting (to find out) | netcup |
| Contact/quote email | mailbox | until the request is done; statutory period (6 to 10 years) if a contract results | you, manually |
| Pending analysis request (name, email, website, terms, optional fields) | `storage/pending` | link valid 48 h | confirmation, expiry on opening, `cleanup.php` daily |
| Confirmed analysis request | mailbox (as above) | as contact email | you |
| Domain hash | `storage/domains` | 90 days | `cleanup.php`, registration |
| Weekly-cap marker (no personal data) | `storage/confirmed` | 7 days | `cleanup.php` |
| Proof-of-work marker (hash of a random value) | `storage/pow` | 1 hour | `cleanup.php`, randomly |
| IP hash and request times | `storage/ratelimit` | 1 hour window, file removed within a day | `cleanup.php`, randomly |

## 4. Draft entries for the processing register (Art. 30)

Controller: Fluxmedia GbR, address and email as in the Impressum. Processor: netcup GmbH (hosting and email).

| Processing activity | Purpose | Data subjects | Data categories | Recipients | Retention | Security measures |
|---|---|---|---|---|---|---|
| Website operation | secure delivery of the website | visitors | IP address, time, URL, user agent, referrer | netcup (processor) | per netcup | HTTPS, HSTS, security headers, CSP, no third parties |
| Handling contact and quote requests | answer enquiries, prepare offers | enquirers (businesses, individuals) | name, email, message, project data | netcup mail (processor) | as above | TLS to the mail server, mailbox access protected, form spam protection |
| Free website analysis | deliver the requested report | enquirers | name, email, website, search terms, optional business data | netcup mail (processor) | as above | double confirmation by email, proof of work, per-domain limit, weekly cap, storage outside the webroot, deletion by cron |
| Abuse protection | prevent automated misuse | senders of form requests | salted hash of IP, timestamps | none | one day at the latest | salted hash, folder not served, deletion by cron |
| Client work (separate for each client) | deliver the contracted service | the client's users | depends on the project | depends | per contract | processor agreement with the client required |

## 5. Procedures

### Request from a data subject (access, deletion, correction)
1. Reply within **one month**. Check who is asking (reply to the address on file, not to a new one).
2. Search the mailbox for the person's address and name; collect what you hold.
3. Pending analysis requests expire after 48 hours and are named by a hash, so they cannot be searched by email. If the request is recent, tell the person it will be deleted automatically within about two days, or delete the files in `storage/pending` by hand if you must act at once.
4. For deletion: delete the mails unless a statutory retention duty applies (tax and commercial records); tell the person what you keep and why.
5. Note date, request and answer in a short log.

### Suspected data breach
1. Stop the cause (change the SMTP and `secret` values, disable the form, restore a clean release).
2. Record what happened, when, which data, how many people.
3. If there is a risk to the people concerned, notify the supervisory authority **within 72 hours** of finding out, and inform the people affected if the risk is high. Ask your lawyer or DPO immediately.
4. Rotate credentials: SMTP password, `secret`, GitHub deploy key, FTP/SSH passwords.

## 6. Change checklist: update the policy before you add any of these

| Feature | What changes in the policy |
|---|---|
| Analytics or tracking tool | cookies and consent, recipients, legal basis; probably a consent banner |
| Newsletter or follow-up emails | purpose, legal basis (consent), retention, unsubscribe |
| Stripe, PayPal or other payment | recipients, third countries, legal basis, retention (tax law) |
| Voicemail / telephone line (provider such as Telnyx or a German SIP provider) | recording, provider, third countries |
| LinkedIn or other social link | external links section (a plain link is enough; an embed or share button is not) |
| Chat widget, chatbot, AI features | recipients, third countries, AI labelling, retention of chats |
| New form field or a new form | form section, retention |
| Fonts, maps, videos from another host | third-party content, consent |
| Changing the hosting provider or the mail provider | hosting and email sections, agreement |
| Moving or changing the seat | controller, supervisory authority |

## 7. How to verify the setup

```bash
# on the server (SSH), after the first deploy
php /full/path/to/api/cleanup.php                       # prints "cleanup done"
ls -ld /full/path/to/fluxmedia-storage                  # drwx------ (700), outside httpdocs
ls /full/path/to/fluxmedia-storage                      # pending domains confirmed pow ratelimit

# from any machine
curl -s https://www.fluxmedia.de/api/cleanup.php -o /dev/null -w '%{http_code}\n'   # 404: not runnable over the web
curl -sI https://www.fluxmedia.de/api/lib/bootstrap.php | head -1                   # 403
curl -sI https://www.fluxmedia.de/api/config.php | head -1                          # 403
```

Test the full flow once with your own address: send the free analysis, check the confirmation mail, confirm, check the
notification; then check that `storage/pending` is empty again.
