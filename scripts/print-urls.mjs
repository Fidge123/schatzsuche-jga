import { stations } from "../src/stations.mjs";
import { defaultSiteUrl, printRoute, resolveSiteUrl } from "../src/config.mjs";

const baseUrl = resolveSiteUrl(process.argv[2] ?? defaultSiteUrl);

for (const station of stations) {
  console.log(`Station ${station.number}: ${new URL(`${station.route}/`, baseUrl)}`);
}

console.log(`Druckbogen: ${new URL(`${printRoute}/`, baseUrl)}`);
