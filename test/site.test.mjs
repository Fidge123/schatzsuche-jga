import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

import { defaultSiteUrl, printRoute, resolveSiteUrl } from "../src/config.mjs";
import { stations } from "../src/stations.mjs";

const read = (path) => readFileSync(path, "utf8");

test("exactly five stations have unique eight-character routes", () => {
  assert.equal(stations.length, 5);

  const routes = stations.map(({ route }) => route);
  assert.equal(new Set(routes).size, routes.length);
  assert.match(printRoute, /^[a-f0-9]{8}$/);
  assert.ok(!routes.includes(printRoute));

  for (const route of routes) {
    assert.match(route, /^[a-f0-9]{8}$/);
  }
});

test("the build creates a German, mobile-friendly page for every station", () => {
  for (const station of stations) {
    const file = `dist/${station.route}/index.html`;
    assert.ok(existsSync(file), `${file} is missing`);

    const html = read(file);
    assert.match(html, /<html lang="de">/);
    assert.match(html, /name="viewport" content="width=device-width, initial-scale=1"/);
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.match(html, new RegExp(`<h1[^>]*>${station.title}</h1>`));
    assert.match(html, /<img[^>]+alt="[^"]+"/);
  }
});

test("the public landing page does not reveal station routes", () => {
  const html = read("dist/index.html");

  for (const { route } of stations) {
    assert.doesNotMatch(html, new RegExp(route));
  }

  assert.doesNotMatch(html, new RegExp(printRoute));
});

test("the deployment files exist", () => {
  assert.ok(existsSync("dist/.nojekyll"));
  assert.ok(existsSync(".github/workflows/pages.yml"));
});

test("the deployment uses current GitHub Actions and Node LTS", () => {
  const workflow = read(".github/workflows/pages.yml");
  const packageJson = JSON.parse(read("package.json"));

  assert.match(workflow, /actions\/checkout@v7/);
  assert.match(workflow, /actions\/setup-node@v7/);
  assert.match(workflow, /node-version: 24/);
  assert.match(workflow, /actions\/configure-pages@v6/);
  assert.match(workflow, /actions\/upload-pages-artifact@v5/);
  assert.match(workflow, /actions\/deploy-pages@v5/);
  assert.equal(packageJson.engines.node, ">=24");
});

test("the unlinked print sheet contains a QR code for every station", () => {
  const html = read(`dist/${printRoute}/index.html`);
  const css = read("dist/assets/site.css");
  const baseUrl = resolveSiteUrl(process.env.SITE_URL ?? defaultSiteUrl);

  assert.equal((html.match(/class="qr-code"/g) ?? []).length, 5);
  assert.match(css, /@media print/);

  for (const station of stations) {
    const url = new URL(`${station.route}/`, baseUrl).href;
    assert.match(html, new RegExp(`data-url="${url}"`));
    assert.match(read(`dist/assets/qr-${station.number}.svg`), /<svg/);
  }
});
