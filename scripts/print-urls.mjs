import { stations } from "../src/stations.mjs";

const fallback = "https://fidge123.github.io/schatzsuche-jga/";
const baseUrl = new URL(process.argv[2] ?? fallback);

for (const station of stations) {
  console.log(`Station ${station.number}: ${new URL(`${station.route}/`, baseUrl)}`);
}
