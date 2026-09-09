import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { stations } from "../src/stations.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = `${root}dist`;
const escapeHtml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const pageShell = ({ title, description, body, assetPrefix = "" }) => `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#173f35">
    <meta name="robots" content="noindex, nofollow">
    <meta name="description" content="${escapeHtml(description)}">
    <title>${escapeHtml(title)} · Schatzsuche</title>
    <link rel="stylesheet" href="${assetPrefix}assets/site.css">
  </head>
  <body>
    <main>${body}</main>
  </body>
</html>
`;

const stationPage = (station) => pageShell({
  title: `Station ${station.number}: ${station.title}`,
  description: `Rätsel der Station ${station.number}`,
  assetPrefix: "../",
  body: `
      <article class="card">
        <p class="eyebrow">Station ${station.number} von ${stations.length}</p>
        <img class="riddle-image" src="../assets/station-${station.number}.svg" alt="${escapeHtml(station.imageAlt)}" width="960" height="600">
        <div class="content">
          <h1>${escapeHtml(station.title)}</h1>
          <p class="lead">${escapeHtml(station.lead)}</p>
          <section class="question" aria-labelledby="frage-${station.number}">
            <h2 id="frage-${station.number}">Eure Aufgabe</h2>
            <p>${escapeHtml(station.question)}</p>
          </section>
          <details>
            <summary>Tipp anzeigen</summary>
            <p>${escapeHtml(station.hint)}</p>
          </details>
          <p class="next-step"><span aria-hidden="true">✦</span> ${escapeHtml(station.task)}</p>
        </div>
      </article>`
});

const illustration = ({ number, symbol, colors }) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 600" role="img" aria-labelledby="title desc">
  <title id="title">Station ${number}: ${escapeHtml(symbol)}</title>
  <desc id="desc">Dekorative Illustration für die Schatzsuche</desc>
  <defs>
    <radialGradient id="glow" cx="50%" cy="45%" r="60%">
      <stop offset="0" stop-color="${colors[1]}" stop-opacity=".65"/>
      <stop offset="1" stop-color="${colors[0]}" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="14" stdDeviation="15" flood-opacity=".25"/></filter>
  </defs>
  <rect width="960" height="600" fill="${colors[0]}"/>
  <circle cx="480" cy="270" r="300" fill="url(#glow)"/>
  <path d="M0 490 Q170 410 330 500 T670 485 T960 470 V600 H0Z" fill="#071a16" opacity=".6"/>
  <g fill="${colors[2]}" opacity=".7">
    <circle cx="130" cy="120" r="4"/><circle cx="790" cy="105" r="5"/><circle cx="850" cy="245" r="3"/><circle cx="205" cy="305" r="3"/>
  </g>
  <g filter="url(#shadow)">
    <circle cx="480" cy="265" r="152" fill="${colors[2]}"/>
    <circle cx="480" cy="265" r="132" fill="none" stroke="${colors[1]}" stroke-width="4" stroke-dasharray="4 13"/>
    <text x="480" y="285" text-anchor="middle" fill="${colors[0]}" font-family="system-ui, sans-serif" font-weight="800" font-size="86">${number}</text>
  </g>
  <text x="480" y="492" text-anchor="middle" fill="${colors[2]}" font-family="system-ui, sans-serif" font-weight="700" font-size="32" letter-spacing="8">${escapeHtml(symbol)}</text>
</svg>
`;

const css = `
:root { color-scheme: dark; font-family: Inter, ui-rounded, "SF Pro Rounded", system-ui, sans-serif; background: #071a16; color: #f5f1e8; }
* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; min-height: 100vh; background: radial-gradient(circle at top, #245c4d 0, #0d2b24 40rem, #071a16 100%); }
main { width: min(100% - 1.25rem, 46rem); margin-inline: auto; padding: 1.25rem 0 3rem; }
.card { overflow: hidden; border: 1px solid rgba(255,255,255,.13); border-radius: 1.4rem; background: rgba(8,28,23,.88); box-shadow: 0 1.5rem 5rem rgba(0,0,0,.32); }
.eyebrow { position: absolute; z-index: 1; margin: 1rem; padding: .45rem .7rem; border-radius: 999px; background: rgba(7,26,22,.82); color: #b7f7d8; font-size: .78rem; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; backdrop-filter: blur(8px); }
.riddle-image { display: block; width: 100%; height: auto; aspect-ratio: 8 / 5; object-fit: cover; }
.content { padding: clamp(1.25rem, 5vw, 2.4rem); }
h1 { margin: 0; color: #fffdf7; font-family: Georgia, serif; font-size: clamp(2rem, 10vw, 3.6rem); line-height: .98; letter-spacing: -.025em; }
.lead { margin: 1.4rem 0 1.75rem; color: #e7e1d5; font-family: Georgia, serif; font-size: clamp(1.15rem, 4.5vw, 1.45rem); line-height: 1.55; }
.question { padding: 1.1rem 1.15rem; border-left: .25rem solid #61d6a6; border-radius: .2rem .8rem .8rem .2rem; background: rgba(97,214,166,.09); }
.question h2 { margin: 0 0 .45rem; color: #8cf0c5; font-size: .78rem; letter-spacing: .12em; text-transform: uppercase; }
.question p, details p { margin: 0; line-height: 1.55; }
details { margin-top: 1.1rem; border-block: 1px solid rgba(255,255,255,.12); padding: 1rem 0; color: #d8d2c7; }
summary { min-height: 2.75rem; display: flex; align-items: center; color: #8cf0c5; cursor: pointer; font-weight: 750; }
details p { padding: .4rem 0 .2rem; }
.next-step { margin: 1.35rem 0 0; color: #fff0ae; font-weight: 700; line-height: 1.5; }
.welcome { min-height: calc(100vh - 4.25rem); display: grid; place-items: center; text-align: center; }
.welcome .card { padding: clamp(2rem, 8vw, 4.5rem) clamp(1.25rem, 7vw, 3.5rem); }
.mark { display: grid; width: 5rem; height: 5rem; margin: 0 auto 1.4rem; place-items: center; border: 1px solid #61d6a6; border-radius: 50%; color: #fff0ae; font-size: 2.25rem; }
.welcome p { max-width: 31rem; margin: 1.4rem auto 0; color: #d8d2c7; font-size: 1.08rem; line-height: 1.6; }
@media (min-width: 48rem) { main { padding-top: 2.5rem; } .card { border-radius: 2rem; } }
@media (prefers-reduced-motion: no-preference) { .card { animation: arrive .55s ease-out both; } @keyframes arrive { from { opacity: 0; transform: translateY(12px); } } }
`;

rmSync(dist, { recursive: true, force: true });
mkdirSync(`${dist}/assets`, { recursive: true });
writeFileSync(`${dist}/assets/site.css`, css.trimStart());
writeFileSync(`${dist}/.nojekyll`, "");
writeFileSync(`${dist}/robots.txt`, "User-agent: *\nDisallow: /\n");

for (const station of stations) {
  const directory = `${dist}/${station.route}`;
  mkdirSync(directory, { recursive: true });
  writeFileSync(`${directory}/index.html`, stationPage(station));
  writeFileSync(`${dist}/assets/station-${station.number}.svg`, illustration(station));
}

writeFileSync(`${dist}/index.html`, pageShell({
  title: "Geheime Schatzsuche",
  description: "Startseite der geheimen Schatzsuche",
  body: `
      <section class="welcome">
        <div class="card">
          <div class="mark" aria-hidden="true">⌖</div>
          <h1>Bereit für das Abenteuer?</h1>
          <p>Die Stationen dieser Schatzsuche sind nur über die verteilten QR-Codes erreichbar. Scannt euren ersten Code, um zu beginnen.</p>
        </div>
      </section>`
}));

writeFileSync(`${dist}/404.html`, pageShell({
  title: "Pfad nicht gefunden",
  description: "Diese Station wurde nicht gefunden",
  body: `
      <section class="welcome">
        <div class="card">
          <div class="mark" aria-hidden="true">?</div>
          <h1>Hier ist keine Station</h1>
          <p>Prüft den QR-Code und versucht es noch einmal.</p>
        </div>
      </section>`
}));

console.log(`Built ${stations.length} station pages in dist/`);
