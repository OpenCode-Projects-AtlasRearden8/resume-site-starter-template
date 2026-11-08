# STATUS.md — resume-site-starter-template

## What was built

A one-page personal resume as a zero-JavaScript static site, made and maintained by
Asdale Dynamics, LLC:

- `index.html` — semantic HTML in ATS-friendly text order (h1 name → tagline/contact →
  Summary → Experience → Projects → Skills → Education → Links), plus schema.org JSON-LD
  (`Person`, `Organization`, `Book`) for rich results. No executable JavaScript anywhere;
  the only `<script>` tag is `application/ld+json` (structured data, not JS).
- `styles.css` — serif typographic screen layout; optional dark mode via
  `@media (prefers-color-scheme: dark)` (reader's OS chooses; no toggle, no JS); print
  stylesheet with `@page { size: letter portrait }`, 0.55in × 0.65in margins, pt-based
  type, and `break-inside: avoid` so sections don't split mid-block. Includes a
  print+dark-mode override so dark readers still get a white page on paper.
- `LICENSE` — MIT, `Copyright (c) 2026 Asdale Dynamics, LLC`.
- `README.md` — credited to Asdale Dynamics, LLC; run/test/deploy instructions.
- `tests/link-schema.test.mjs` — zero-dependency Node test suite.

Distinct from ats-resume-checker-cli (parser/checker tool) and free-resume-pack (bundle
of free templates): this repo is one production-ready resume site, not a checker or a pack.

## How to run it

- Open `index.html` directly in a browser, or serve it:
  `python3 -m http.server 8000` then visit http://localhost:8000.
- Print check: Ctrl/Cmd+P — the print preview should show letter portrait with the
  resume fit to the page; sections break between, not inside.
- Deploy by link (GitHub Pages): push the repo, then Settings → Pages → Source
  "Deploy from a branch" → `main` / `/ (root)`. Pages publishes at
  `https://<user>.github.io/<repo>/` and updates on every push to `main`.
  Nothing has been pushed, published, or deployed from this workspace.

## How to test

```sh
node tests/link-schema.test.mjs
```

## Verification results (2026-11-08)

- `node tests/link-schema.test.mjs` → **12 tests passed, 0 failed**, covering:
  single h1; ATS section order; aria-labelledby IDs resolve; zero-JS claim (only
  JSON-LD script tags); JSON-LD parses and has `@context https://schema.org` with
  required Person/Org/Book properties; all internal fragment links resolve; all
  external links HTTPS on the allowed domain set; stylesheet link to an existing file;
  @page letter portrait + print rules present; prefers-color-scheme dark mode present;
  print+dark override present.
- Local serve check: `index.html` → HTTP 200, `styles.css` → HTTP 200.
- Git: repo initialized on `main`; commit `96ed741` by the existing git identity
  (Dylan Asdale / dylanasdale@users.noreply.github.com), plain message, no co-author
  trailers. No push, no remote, nothing published.
- No secrets, API keys, or personal data (no phone, email, or street address) in files.

## Known gaps

- Print fit is browser-dependent in the last resort; verified via `@page letter` +
  pt type + break rules, but confirm in Chrome/Firefox print preview once and adjust
  the 10.5pt base size if a future resume grows past one page.
- The nursing role intentionally shows "Prior years" with no dates and no employer
  name to avoid personal data; add approved details before real-world distribution.
- Link tests check structure, domain allowlist, and schema, but not live URL
  reachability (deliberately offline/local-first; add an optional network check later).
- No per-page timezone/locale meta, no sitemap/robots.txt (single page; low value).
