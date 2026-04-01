// Mock data for admin panel (will be replaced by Supabase queries)

export const directory = [
  { id: 22, name: "Městský úřad Vimperk — podatelna", category: "město", cityDepartment: "central", phone: "388 402 111", address: "Steinbrenerova 6, Vimperk", hours: "Po, St 7:30–17:00 · Út, Čt 7:30–15:00 · Pá 7:30–14:00", email: "podatelna@mesto.vimperk.cz" },
  { id: 24, name: "Městská policie Vimperk", category: "město", cityDepartment: "bezpecnost", phone: "388 402 110", address: "Nad Stadionem 199, Vimperk", hours: "Nepřetržitý provoz", email: "mp@mesto.vimperk.cz" },
  { id: 3, name: "Hotel a restaurace Terasa", category: "restaurace", phone: "602 323 297", address: "Pasovská 34, Vimperk 385 01", email: "info@hotelterasa.cz", website: "http://www.hotelterasa.cz", note: "Tradiční česká kuchyně, terasa, parkování na místě" },
  { id: 6, name: "MUDr. Jana Procházková — Praktický lékař", category: "lékař", phone: "388 412 300", address: "Nemocniční 430, Vimperk", hours: "Po-Pá 7:30–12:00, Po+St 13:00–16:30" },
];

export const news = [
  { id: 1, title: "Uzavírka ulice Pivovarská — od 28. března", summary: "Objízdná trasa přes Steinbrenerovu.", category: "upozornění", urgent: true, date: "2026-03-25", workflowStatus: "live" },
  { id: 2, title: "Nová hřiště v parku Blanice — hlasování spuštěno", summary: "Hlasování trvá do 10. dubna.", category: "radnice", urgent: false, date: "2026-03-24", workflowStatus: "ready" },
  { id: 3, title: "HC Vimperk slaví postup do krajské ligy!", summary: "Hokejisté Vimperka porazili Klatovy 4:2.", category: "sport", urgent: false, date: "2026-03-23", workflowStatus: "review" },
  { id: 4, title: "Jarní svoz nebezpečného odpadu — 5. dubna", summary: "Kontejnery na náměstí Svobody od 9:00 do 13:00.", category: "radnice", urgent: false, date: "2026-03-22", workflowStatus: "draft" },
];

export const events = [
  { id: 1, title: "Vimperský jarmark", date: "2026-04-05", time: "09:00", place: "Náměstí Svobody", category: "trhy", free: true, price: "", workflowStatus: "live" },
  { id: 2, title: "Kino: Anatole — CZ dabing", date: "2026-03-28", time: "17:30", place: "Kino Vimperk", category: "kino", free: false, price: "130 Kč", workflowStatus: "ready" },
  { id: 3, title: "Hokejový turnaj mládeže", date: "2026-03-29", time: "10:00", place: "Zimní stadion", category: "sport", free: true, price: "", workflowStatus: "review" },
  { id: 4, title: "Přednáška: Šumavská příroda", date: "2026-04-02", time: "18:00", place: "Kulturní dům", category: "kultura", free: false, price: "80 Kč", workflowStatus: "draft" },
  { id: 5, title: "Veřejné zastupitelstvo", date: "2026-04-07", time: "17:00", place: "Radnice Vimperk", category: "úřad", free: true, price: "", workflowStatus: "live" },
];

export const polls = [
  {
    id: 1,
    question: "Jakou podobu hřiště v parku Blanice preferujete?",
    category: "infrastruktura",
    endsAt: "2026-04-10",
    totalVotes: 492,
    workflowStatus: "live",
    options: [
      { id: 1, text: "Moderní prolézačky a lezecká stěna", votes: 187 },
      { id: 2, text: "Tradiční houpačky a pískoviště", votes: 94 },
      { id: 3, text: "Multifunkční sportoviště", votes: 211 },
    ],
  },
  {
    id: 2,
    question: "Jak jste spokojeni s frekvencí autobusů do Prachatic?",
    category: "doprava",
    endsAt: "2026-04-15",
    totalVotes: 489,
    workflowStatus: "review",
    options: [
      { id: 4, text: "Velmi spokojen/a", votes: 43 },
      { id: 5, text: "Spíše spokojen/a", votes: 89 },
      { id: 6, text: "Spíše nespokojen/a", votes: 156 },
      { id: 7, text: "Velmi nespokojen/a", votes: 201 },
    ],
  },
];

export const reports = [
  { id: 1, title: "Výtluk na Steinbrenerově", description: "Velký výtluk u č. 8, hluboký cca 10 cm.", category: "komunikace", status: "v řešení", date: "2026-03-22" },
  { id: 2, title: "Rozbitá lampa u parku Blanice", description: "Lampa nesvítí, riziko úrazu v noci.", category: "veřejné osvětlení", status: "přijato", date: "2026-03-21" },
  { id: 3, title: "Popadaný strom na cyklostezce", description: "Strom blokuje průjezd za parkem.", category: "zeleň", status: "vyřešeno", date: "2026-03-18" },
  { id: 4, title: "Nepořádek u kontejnerů na Máji", description: "Odpad rozhozený kolem kontejnerů.", category: "odpad", status: "přijato", date: "2026-03-17" },
];

export const auditLog = [
  { id: "a1", entityType: "directory", entityId: "22", action: "workflow", summary: "Kontakt podatelny přešel do live", actorEmail: "admin@vimperk.cz", createdAt: "2026-03-26T09:15:00Z" },
  { id: "a2", entityType: "news", entityId: "1", action: "create", summary: "Vytvořena urgentní zpráva o uzavírce", actorEmail: "redakce@vimperk.cz", createdAt: "2026-03-25T08:00:00Z" },
  { id: "a3", entityType: "report", entityId: "2", action: "status", summary: "Závada přešla do přijatého stavu", actorEmail: "dispecink@vimperk.cz", createdAt: "2026-03-21T13:20:00Z" },
];
