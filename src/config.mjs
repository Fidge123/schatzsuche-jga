export const defaultSiteUrl = "https://fidge123.github.io/schatzsuche-jga/";
export const printRoute = "c4f8a2d1";

export const resolveSiteUrl = (value = defaultSiteUrl) =>
  new URL(value.endsWith("/") ? value : `${value}/`);
