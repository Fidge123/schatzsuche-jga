import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

import { stations } from "../src/stations.mjs";

const read = (path) => readFileSync(path, "utf8");

test("exactly five stations have unique, hard-to-guess routes", () => {
  assert.equal(stations.length, 5);

  const routes = stations.map(({ route }) => route);
  assert.equal(new Set(routes).size, routes.length);

  for (const route of routes) {
    assert.match(route, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(route.length >= 24, `${route} is too short`);
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
});

test("the deployment files exist", () => {
  assert.ok(existsSync("dist/.nojekyll"));
  assert.ok(existsSync(".github/workflows/pages.yml"));
});
