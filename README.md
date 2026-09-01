# embolizationinc.com

The Embolization, Inc. website. Plain static HTML, CSS and JavaScript — no framework, no build
step, no dev server. Open `index.html` in a browser and it works.

Keeping it that way is a deliberate choice: the site should be openable, editable and recoverable by
anyone with the repo, without a toolchain or a vendor account.

**Picking this up for the first time? Start with [NEXT-STEPS.md](NEXT-STEPS.md)** — what's done, what's
left, and how the DNS cutover works.

---

## Layout

```
index.html              the entire site — one page, anchor navigation
assets/css/styles.css   all styling
assets/js/main.js       nav, scroll reveals, stat counters, contact form
assets/img/             CT and MRI figures + brand mark
robots.txt  sitemap.xml  vercel.json
```

## Local preview

No server required — double-click `index.html`.

To serve it over HTTP instead:

```bash
python -m http.server 8899 --directory .
```

---

## The contact form

`assets/js/main.js` defines the endpoint in one place:

```js
var FORM_ENDPOINT = 'https://formsubmit.co/ajax/inquire@embolizationinc.com';
```

It posts JSON, shows an inline success state, and on any failure falls back to a pre-filled
`mailto:` link so a visitor is never left with a dead button.

**Activation:** FormSubmit requires the destination address to be confirmed once. This was completed
on 1 September 2026, so the form delivers to `inquire@embolizationinc.com`. If the destination address
ever changes, the new address needs the same one-time confirmation.

To move to another provider — Formspree, HubSpot, a serverless function — change that one constant.
Nothing else depends on it.

A hidden `_honey` honeypot field filters bots. Real visitors never see it; submissions with it filled
are dropped client-side.

---

## The clinical imagery — read before editing

**Every image in the clinical sections is a real measured figure, and each caption states its actual
measurement and scan configuration. Never substitute decorative, stock or generated artwork under a
clinical caption.** If a figure is unavailable, remove the figure and leave the supporting data
table — do not fill the space with an illustration.

| File | Figure | What it shows |
|---|---|---|
| `ct-fig1-small-coil-20pct.webp` | Fig 1 | NED 2–3 mm vs IDC-18 3 mm, parallel 16 × 1.2 — 20% less (12.54 vs 15.68 mm) |
| `ct-fig2-larger-coil-64pct.webp` | Fig 2 | NED 4–5 mm vs IDC-18 6 mm, parallel 16 × 1.2 — 64% less (12.02 vs 33.44 mm) |
| `ct-fig3-highres-58pct.webp` | Fig 3 | Same pairing at 64 × 0.6 collimation — 58% less (15.17 vs 36.03 mm) |
| `ct-fig4-coronal-visibility.webp` | Fig 4 | Coronal plane — NED silhouette visible, predicate buried in streak |
| `ct-fig5-worstcase-57pct.webp` | Fig 5 | Perpendicular sagittal, high resolution — 57% less (20.18 vs 46.88 mm) |
| `invivo-fluoro-scout.webp` | Fig 6a | Fluoroscopic scout, conventional metal coil mass |
| `invivo-axial-starburst.webp` | Fig 6b | Axial CT, starburst from metal coil |
| `invivo-axial-degraded.webp` | Fig 6c | Axial CT, adjacent anatomy degraded |
| `invivo-ned-vs-nester.webp` | — | Same-patient in-vivo CT, NED vs Cook Nester |
| `mri-fig7-artifact.webp` | Fig 7 | MRI image artifact, gradient echo transverse — NED 4.5 mm vs IDC-18 4.7 mm |

Source: Embolization Inc. *CT Imaging Comparison Report*, drawn from test report **TR 005017** and
protocol **VP 004731**. CT artifact testing performed at the Colorado State University Translational
Medicine Institute on a Siemens SOMATOM Definition AS in a water phantom; artifact width quantified
in ImageJ at the ASTM ±30% pixel-intensity boundary. MRI testing performed at BDC Laboratories
(ISO/IEC 17025 accredited) on a 3.0 T Siemens Skyra.

**The GLP sheep section intentionally has no image.** All available imagery is bench phantom or human
in-vivo CT; none is from the sheep study the section describes. It presents the data table alone
until genuine study imagery exists.

---

## Deploying

The site is static, so any host works. `vercel.json` sets long cache lifetimes on `/assets`, clean
URLs, and basic security headers for Vercel deployments.

The domain is registered at Squarespace Domains with DNS on Cloudflare. Repointing
`www.embolizationinc.com` means changing the `www` record in Cloudflare.

---

## Conventions

- No build step and no framework. Keep it that way.
- One page. Sections are `<section id="…">`; the nav uses anchors.
- Colours, spacing and fonts are CSS custom properties at the top of `styles.css`.
- Every image needs a real `alt` description and explicit `width`/`height`.
- `prefers-reduced-motion` is respected — animations and counters are skipped.
