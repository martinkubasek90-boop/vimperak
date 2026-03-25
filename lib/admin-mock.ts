// Mock data for admin panel (will be replaced by Supabase queries)

export const news = [
  { id: 1, title: "Uzavírka ulice Pivovarská — od 28. března", summary: "Objízdná trasa přes Steinbrenerovu.", category: "upozornění", urgent: true, date: "2026-03-25" },
  { id: 2, title: "Nová hřiště v parku Blanice — hlasování spuštěno", summary: "Hlasování trvá do 10. dubna.", category: "radnice", urgent: false, date: "2026-03-24" },
  { id: 3, title: "HC Vimperk slaví postup do krajské ligy!", summary: "Hokejisté Vimperka porazili Klatovy 4:2.", category: "sport", urgent: false, date: "2026-03-23" },
  { id: 4, title: "Jarní svoz nebezpečného odpadu — 5. dubna", summary: "Kontejnery na náměstí Svobody od 9:00 do 13:00.", category: "radnice", urgent: false, date: "2026-03-22" },
];

export const events = [
  { id: 1, title: "Vimperský jarmark",          date: "2026-04-05", time: "09:00", place: "Náměstí Svobody",     category: "trhy",    free: true,  price: "" },
  { id: 2, title: "Kino: Anatole — CZ dabing",  date: "2026-03-28", time: "17:30", place: "Kino Vimperk",        category: "kino",    free: false, price: "130 Kč" },
  { id: 3, title: "Hokejový turnaj mládeže",     date: "2026-03-29", time: "10:00", place: "Zimní stadion",       category: "sport",   free: true,  price: "" },
  { id: 4, title: "Přednáška: Šumavská příroda", date: "2026-04-02", time: "18:00", place: "Kulturní dům",        category: "kultura", free: false, price: "80 Kč" },
  { id: 5, title: "Veřejné zastupitelstvo",       date: "2026-04-07", time: "17:00", place: "Radnice Vimperk",     category: "úřad",    free: true,  price: "" },
];

export const reports = [
  { id: 1, title: "Výtluk na Steinbrenerově",       description: "Velký výtluk u č. 8, hluboký cca 10 cm.", category: "komunikace",        status: "v řešení", date: "2026-03-22" },
  { id: 2, title: "Rozbitá lampa u parku Blanice",  description: "Lampa nesvítí, riziko úrazu v noci.",    category: "veřejné osvětlení", status: "přijato",  date: "2026-03-21" },
  { id: 3, title: "Popadaný strom na cyklostezce",  description: "Strom blokuje průjezd za parkem.",       category: "zeleň",             status: "vyřešeno", date: "2026-03-18" },
  { id: 4, title: "Nepořádek u kontejnerů na Máji", description: "Odpad rozhozený kolem kontejnerů.",      category: "odpad",             status: "přijato",  date: "2026-03-17" },
];
