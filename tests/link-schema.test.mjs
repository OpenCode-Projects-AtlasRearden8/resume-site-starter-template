import { readFileSync } from "node:fs";
import { strict as assert } from "node:assert";

const root = new URL("..", import.meta.url);
const html = readFileSync(new URL("index.html", root), "utf8");
const css = readFileSync(new URL("styles.css", root), "utf8");

let passed = 0;
function test(name, fn) {
  fn();
  console.log(`ok  ${name}`);
  passed++;
}

const allowedExternal = new Set(["https://dylanasdale.github.io"]);

// ---- document structure / ATS-order ----
test("single h1 and it is the person's name", () => {
  const h1s = html.match(/<h1[^>]*>.*?<\/h1>/gs) ?? [];
  assert.equal(h1s.length, 1);
  assert.match(h1s[0], /Dylan Asdale/);
});

test("sections appear in ATS-friendly text order", () => {
  const ids = [...html.matchAll(/<section id="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(ids, ["summary", "experience", "projects", "skills", "education", "links"]);
});

test("every aria-labelledby id exists", () => {
  for (const m of html.matchAll(/aria-labelledby="([^"]+)"/g)) {
    assert.ok(new RegExp(`id="${m[1]}"`).test(html), `missing id: ${m[1]}`);
  }
});

test("zero JavaScript: only JSON-LD script tags allowed", () => {
  const scripts = html.match(/<script/g) ?? [];
  const ld = html.match(/<script type="application\/ld\+json"/g) ?? [];
  assert.equal(scripts.length, ld.length);
});

// ---- JSON-LD schema ----
const ldMatches = [...html.matchAll(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
)];
test("exactly one JSON-LD block that parses", () => {
  assert.equal(ldMatches.length, 1);
  JSON.parse(ldMatches[0][1]);
});

test("JSON-LD is schema.org with valid @graph entities", () => {
  const data = JSON.parse(ldMatches[0][1]);
  assert.equal(data["@context"], "https://schema.org");
  assert.ok(Array.isArray(data["@graph"]) && data["@graph"].length >= 2);
  const types = data["@graph"].map((n) => n["@type"]);
  for (const expected of ["Person", "Book"]) {
    assert.ok(types.includes(expected), `missing @type ${expected}`);
  }
  const person = data["@graph"].find((n) => n["@type"] === "Person");
  for (const prop of ["name", "url", "jobTitle", "worksFor"]) {
    assert.ok(person[prop] !== undefined, `Person missing ${prop}`);
  }
  const org = person.worksFor;
  assert.equal(org.name, "Asdale Dynamics, LLC");
  assert.equal(org["foundingDate"], "2026-10");
});

// ---- links ----
test("internal fragment links resolve to element ids", () => {
  for (const m of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(new RegExp(`id="${m[1]}"`).test(html), `dead anchor: #${m[1]}`);
  }
});

test("external links are HTTPS and from the allowed domain set", () => {
  for (const m of html.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
    const url = new URL(m[1]);
    assert.equal(url.protocol, "https:");
    assert.ok(
      allowedExternal.has(`${url.protocol}//${url.host}`),
      `unexpected external domain: ${url.host}`
    );
  }
});

test("stylesheet link points to an existing local file", () => {
  const m = html.match(/<link rel="stylesheet" href="([^"]+)">/);
  assert.ok(m, "no stylesheet link found");
  readFileSync(new URL(m[1], root), "utf8"); // throws if missing
});

// ---- print + dark-mode stylesheets ----
test("print stylesheet targets letter paper", () => {
  assert.match(css, /@page\s*{[^}]*size:\s*letter\s+portrait/s);
  assert.match(css, /@media print/);
  assert.match(css, /break-inside:\s*avoid/);
});

test("dark mode is opt-in via prefers-color-scheme, no JS", () => {
  assert.match(css, /@media \(prefers-color-scheme: dark\)/);
  assert.match(css, /color-scheme:\s*light dark/);
  assert.match(css, /@media print and \(prefers-color-scheme: dark\)/);
});

test("interactive styles present (links styled, no buttons needed)", () => {
  assert.match(css, /a:hover, a:focus/);
});

console.log(`\n${passed} tests passed, 0 failed`);
