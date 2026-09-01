# Handoff — what's left to do

Status as of **1 September 2026**. The site is built, deployed to a staging URL, and the contact form
is live. What remains is review, a hosting decision, and the DNS cutover.

**Staging URL:** https://jim0425.github.io/embolization-inc-site/
**Live domain:** https://www.embolizationinc.com — still served by the *old* site. Untouched.

Nothing here is urgent-broken. The old site stays up until someone deliberately switches DNS.

---

## 1. Review the content

The copy came across from the previous site. The clinical figures and the artifact measurement table
are new — they're the real measured data from the CT Imaging Comparison Report (TR 005017 / VP 004731),
and each caption states its actual artifact width and scan configuration.

Worth a careful read before go-live:

- **The measurement table** in the "Metal Coils Blind Your Follow-Up Imaging" section. Check the
  numbers against the source report.
- **Every figure caption.** They make specific claims (20%, 57%, 58%, 64% less artifact). They should
  match the figure directly above them.
- **The safety section** at the bottom — indications, contraindications, warnings, precautions,
  adverse events. Confirm it still matches the current IFU.
- **The team section.** Five people listed. Confirm titles and bios are current.

### Known content gaps

| Gap | Detail |
|---|---|
| No product photograph | There is no photo of the NED coil anywhere on the site. The previous site had one; the file was lost. Worth shooting or sourcing. |
| No deployment video | Same story — the previous site had a deployment animation. |
| GLP sheep section has no image | **Intentional.** All available imagery is bench phantom or human in-vivo CT; none is from the sheep study that section describes. It presents the data table alone. Only genuine sheep study imagery belongs there — see the rule in `README.md`. |

---

## 2. Decide where it's hosted

It's a static site — plain HTML, CSS and JS with no build step — so it runs anywhere.

**Currently:** GitHub Pages, serving from `main` at the repo root. Free, already working, zero config.

**Alternative — Vercel.** `vercel.json` is already in the repo (asset caching, clean URLs, security
headers). Import the repo at vercel.com and it deploys on every push. Note: the Vercel connector was
unable to create projects under Jim's teams — a permissions issue on the Vercel account that needs
sorting first if you go this route.

Either is fine. GitHub Pages is already working, so the lower-effort path is to leave it.

---

## 3. The DNS cutover

This is the actual go-live step, and the only one that changes what the public sees.

**Where things live:**

| | |
|---|---|
| Registrar | Squarespace Domains |
| DNS | **Cloudflare** — this is where the change happens |
| Current `www` record | `CNAME → cname.manus.space` |
| Mail | Microsoft 365 — **do not touch the MX or TXT/SPF records** |

⚠️ **Leave the MX record and the `v=spf1` TXT record exactly as they are.** Changing them breaks
company email. Only the `www` and apex records need to move.

### If staying on GitHub Pages

1. Add a file named `CNAME` at the repo root containing exactly:
   ```
   www.embolizationinc.com
   ```
2. In Cloudflare, change the `www` record to `CNAME → jim0425.github.io`.
3. For the apex (`embolizationinc.com`), point A records at the GitHub Pages addresses:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
4. Set those records to **DNS only** (grey cloud, not orange) at first — Cloudflare's proxy can block
   GitHub's certificate issuance. Once HTTPS is working, proxying can be turned back on.
5. In the repo's Settings → Pages, set the custom domain and tick "Enforce HTTPS" once the
   certificate is issued. It can take up to an hour.

### If moving to Vercel

Add the domain in the Vercel project settings and follow the records it gives you — usually
`CNAME → cname.vercel-dns.com` for `www`. Vercel handles the certificate.

### Rollback

The old site is still published on Manus. If anything goes wrong, set the `www` record back to
`CNAME → cname.manus.space` and it returns.

---

## 4. Confirm the contact form is delivering

The form posts to FormSubmit, which was activated on 1 September 2026. It should now deliver to
`inquire@embolizationinc.com`.

**Please verify it end to end:** submit the form on the staging URL with your own email in the message,
and confirm the email arrives at `inquire@embolizationinc.com`. Do this again after the DNS cutover,
since the sending domain changes.

The endpoint is one constant at the top of `assets/js/main.js`:

```js
var FORM_ENDPOINT = 'https://formsubmit.co/ajax/inquire@embolizationinc.com';
```

Swap that line to move to any other provider. If the endpoint ever fails, the form falls back to a
pre-filled `mailto:` link rather than silently dropping the submission.

---

## 5. Worth raising with Jim

This site currently lives in a personal GitHub account (`jim0425`). Embolization Inc is its own
company, and the reason this rebuild was necessary in the first place is that the previous site
existed in exactly one person's vendor account with no copy anywhere else.

Moving the repo to an organization owned by Embolization Inc — rather than an individual — would mean
it survives any one person losing access. That's a decision for Jim, not a technical task.
