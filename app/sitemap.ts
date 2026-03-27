import type { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vimperk.app";

const routes = [
  "",
  "/instalace",
  "/ochrana-soukromi",
  "/podminky",
  "/zpravodaj",
  "/kalendar",
  "/kontakty",
  "/mesto",
  "/hlasovani",
  "/zhlasit",
  "/ai",
  "/adresar",
  "/akce",
  "/sport",
  "/napsat-mestu",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${appUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
