# one-page resume site

A one-page personal resume as a zero-JavaScript static site: clean typographic layout, a print stylesheet that lands on US letter paper, ATS-friendly text order via plain semantic HTML, and optional dark mode driven by the reader's system preference.

Made and maintained by **Asdale Dynamics, LLC**. Style: clear, warm, polished, tested, local-first — no JavaScript, no secrets, no personal data.

## Files

- `index.html` — the whole resume. Semantic HTML in ATS-reader text order: header (name/title/contact), Summary, Experience, Projects, Skills, Education, Links. Includes schema.org JSON-LD (`Person`, `Organization`, `Book`) that strengthens the page's rich results without affecting plain text extraction.
- `styles.css` — screen typography, `@media (prefers-color-scheme: dark)` dark mode (opt-in by the reader's OS, no toggle, no JS), and a `@media print` sheet with `@page { size: letter }`, conservative margins, pt-based type, and `break-inside: avoid` so sections never split mid-block.

## Run it locally

Any static file server works, or just open the file:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Print to letter paper

Open the page and print (Ctrl/Cmd+P). The print stylesheet targets letter portrait with 0.55in × 0.65in page margins and pt-based typography; sections are set to avoid page breaks. Verify in the browser print preview — no JavaScript involved.

## Test it

Link and schema tests, zero dependencies (Node 18+):

```sh
node tests/link-schema.test.mjs
```

Covers: structural checks (single `h1`, section order), zero-JavaScript claim (no `<script>` other than JSON-LD), JSON-LD schema validity (`@context`, required `Person` properties), internal anchor resolution, and HTTPS-only external links.

## Deploy (GitHub Pages, by link)

1. Push this folder to a repository (e.g. a repo named after the site).
2. In the repo: **Settings → Pages → Build and deployment**, set *Source* to "Deploy from a branch", choose `main` and `/ (root)`.
3. Within a minute, Pages publishes at `https://<user>.github.io/<repo>/` — the deploy "link" is that Pages URL; every push to `main` updates it automatically.

This project is MIT licensed — see `LICENSE` (`Copyright (c) 2026 Asdale Dynamics, LLC`).
