// ─── EVENTS ──────────────────────────────────────────────────────────────────
export type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  place: string;
  category: "kultura" | "sport" | "kino" | "úřad" | "trhy";
  description: string;
  free: boolean;
  price?: string;
};

export const events: Event[] = [
  {
    id: 1,
    title: "Vimperský jarmark",
    date: "2026-04-05",
    time: "09:00",
    place: "Náměstí Svobody",
    category: "trhy",
    description: "Tradiční jarní jarmark s místními řemeslníky, jídlem a zábavou pro děti.",
    free: true,
  },
  {
    id: 2,
    title: "Kino: Anatole — CZ dabing",
    date: "2026-03-28",
    time: "17:30",
    place: "Kino Vimperk",
    category: "kino",
    description: "Animovaná rodinná komedie pro děti i rodiče.",
    free: false,
    price: "130 Kč",
  },
  {
    id: 3,
    title: "Kino: Rival — CZ titulky",
    date: "2026-03-28",
    time: "20:00",
    place: "Kino Vimperk",
    category: "kino",
    description: "Sportovní drama nominované na Oscara.",
    free: false,
    price: "160 Kč",
  },
  {
    id: 4,
    title: "Hokejový turnaj mládeže",
    date: "2026-03-29",
    time: "10:00",
    place: "Zimní stadion Vimperk",
    category: "sport",
    description: "Turnaj kategorie U12 a U14. Vstup zdarma pro diváky.",
    free: true,
  },
  {
    id: 5,
    title: "Přednáška: Šumavská příroda",
    date: "2026-04-02",
    time: "18:00",
    place: "Kulturní dům Vimperk",
    category: "kultura",
    description: "Přednáška fotografa Petra Nováka o životě zvířat v NP Šumava.",
    free: false,
    price: "80 Kč",
  },
  {
    id: 6,
    title: "Veřejné zastupitelstvo",
    date: "2026-04-07",
    time: "17:00",
    place: "Radnice Vimperk",
    category: "úřad",
    description: "Zasedání zastupitelstva města. Veřejnost vítána.",
    free: true,
  },
];

// ─── BUS SCHEDULES ────────────────────────────────────────────────────────────
export type BusLine = {
  id: number;
  number: string;
  from: string;
  to: string;
  departures: string[];
  note?: string;
};

export const busLines: BusLine[] = [
  {
    id: 1,
    number: "190",
    from: "Vimperk",
    to: "České Budějovice",
    departures: ["05:15", "06:30", "07:45", "09:00", "11:30", "13:00", "15:15", "17:30", "19:00"],
    note: "Přes Prachatice",
  },
  {
    id: 2,
    number: "191",
    from: "Vimperk",
    to: "Prachatice",
    departures: ["06:00", "08:00", "10:30", "12:00", "14:30", "16:00", "17:45", "19:30"],
  },
  {
    id: 3,
    number: "195",
    from: "Vimperk",
    to: "Kašperské Hory",
    departures: ["07:20", "09:45", "12:15", "14:00", "16:20", "18:00"],
    note: "Šumava Express",
  },
  {
    id: 4,
    number: "197",
    from: "Vimperk",
    to: "Volary",
    departures: ["06:45", "09:15", "11:00", "13:30", "15:00", "17:00", "19:15"],
  },
];

// ─── DIRECTORY ────────────────────────────────────────────────────────────────
export type DirectoryItem = {
  id: number;
  name: string;
  category: "taxi" | "restaurace" | "lékař" | "lékárna" | "opravna" | "sport" | "ubytování" | "obchod" | "město";
  phone: string;
  address: string;
  hours?: string;
  rating?: number;
  note?: string;
  email?: string;
  website?: string;
  sourceUrl?: string;
};

export const directory: DirectoryItem[] = [
  // Taxi
  {
    id: 1,
    name: "Taxi Vimperk — Pavel Kotal",
    category: "taxi",
    phone: "602 111 222",
    address: "Vimperk",
    hours: "0–24 hod",
    rating: 4.8,
    note: "Disponibilní 24/7, odvoz na letiště Praha",
  },
  {
    id: 2,
    name: "Taxi Šumava",
    category: "taxi",
    phone: "777 333 444",
    address: "Vimperk",
    hours: "6:00–22:00",
    rating: 4.5,
  },
  // Restaurace
  {
    id: 3,
    name: "Hotel a restaurace Terasa",
    category: "restaurace",
    phone: "602 323 297",
    address: "Pasovská 34, Vimperk 385 01",
    note: "Tradiční česká kuchyně, terasa, parkování na místě",
    email: "info@hotelterasa.cz",
    website: "http://www.hotelterasa.cz",
    sourceUrl: "https://www.vimperk.cz/hotel-a-restaurace-terasa/os-1399",
  },
  {
    id: 4,
    name: "Pizzerie Marco",
    category: "restaurace",
    phone: "388 412 059",
    address: "Pivovarská 88/21, Vimperk 385 01",
    note: "Pizzerie v historickém centru, možnost telefonické objednávky",
    email: "info@pizzerie-marco.cz",
    website: "http://www.pizzerie-marco.cz",
    sourceUrl: "https://www.vimperk.cz/pizzerie-marco/os-1370",
  },
  {
    id: 5,
    name: "Hotel a restaurace Zlatá hvězda",
    category: "restaurace",
    phone: "602 323 297",
    address: "1. máje 103, Vimperk 385 01",
    note: "Tradiční česká i mezinárodní kuchyně, bowling bar",
    email: "info@hotelzlatahvezda.cz",
    website: "http://www.hotelzlatahvezda.cz",
    sourceUrl: "https://www.vimperk.cz/hotel-a-restaurace-zlata-hvezda/os-1398",
  },
  // Lékaři
  {
    id: 6,
    name: "MUDr. Jana Procházková — Praktický lékař",
    category: "lékař",
    phone: "388 412 300",
    address: "Nemocniční 430, Vimperk",
    hours: "Po-Pá 7:30–12:00, Po+St 13:00–16:30",
    rating: 4.7,
  },
  {
    id: 7,
    name: "MUDr. Tomáš Kovář — Dětský lékař",
    category: "lékař",
    phone: "388 412 310",
    address: "Nemocniční 430, Vimperk",
    hours: "Po-Pá 7:30–12:00",
    rating: 4.9,
  },
  {
    id: 8,
    name: "MUDr. Eva Horáková — Zubař",
    category: "lékař",
    phone: "388 412 350",
    address: "Náměstí Svobody 18, Vimperk",
    hours: "Po-Čt 8:00–12:00, 13:00–16:00",
    rating: 4.4,
  },
  // Lékárny
  {
    id: 9,
    name: "Lékárna Dobrá zdraví",
    category: "lékárna",
    phone: "388 412 400",
    address: "Náměstí Svobody 2, Vimperk",
    hours: "Po-Pá 8:00–17:30, So 9:00–12:00",
    rating: 4.5,
  },
  // Opravny
  {
    id: 11,
    name: "Opravna obuvi Novák",
    category: "opravna",
    phone: "388 412 600",
    address: "Náměstí Svobody 8, Vimperk",
    hours: "Po-Pá 8:00–17:00",
    rating: 4.7,
    note: "Opravy bot, klíče, rytí",
  },
  {
    id: 12,
    name: "Autoservis Málek",
    category: "opravna",
    phone: "602 456 789",
    address: "Průmyslová 12, Vimperk",
    hours: "Po-Pá 7:00–17:00, So 8:00–12:00",
    rating: 4.4,
    note: "STK, pneuservis, klimatizace",
  },
  {
    id: 13,
    name: "PC Servis Šumava",
    category: "opravna",
    phone: "773 555 666",
    address: "Steinbrenerova 5, Vimperk",
    hours: "Po-Pá 9:00–17:00",
    rating: 4.8,
    note: "Opravy notebooků, telefonů, tabletů",
  },
  // Ubytování
  {
    id: 14,
    name: "Hotel Vodník",
    category: "ubytování",
    phone: "776 069 756",
    address: "K Vodníku 614, Vimperk 385 01",
    note: "Boutique hotel, 6 pokojů a 4 mezonetové apartmány",
    email: "rezervace@vimperk-vodnik.cz",
    website: "https://www.vimperk-vodnik.cz/",
    sourceUrl: "https://www.vimperk.cz/hotel-vodnik/os-1533",
  },
  {
    id: 15,
    name: "Penzion Volyňka",
    category: "ubytování",
    phone: "728 666 609",
    address: "Pasovská 114, Vimperk 385 01",
    note: "Komfortní pokoje, bar, konferenční prostory, parkování v areálu",
    email: "inforecepce@seznam.cz",
    website: "http://www.penzion-vimperk.cz",
    sourceUrl: "https://www.vimperk.cz/penzion-volynka/os-1310",
  },
  // Obchody
  {
    id: 16,
    name: "Penny Market Vimperk",
    category: "obchod",
    phone: "388 412 800",
    address: "1. máje 15, Vimperk",
    hours: "Po-Ne 7:00–21:00",
    rating: 3.9,
  },
  {
    id: 17,
    name: "Kaufland Vimperk",
    category: "obchod",
    phone: "388 412 810",
    address: "Průmyslová 4, Vimperk",
    hours: "Po-Ne 7:00–21:00",
    rating: 4.1,
    note: "Hypermarket, pekárna, drogerie",
  },
  // Sport
  {
    id: 10,
    name: "Aquapark Vimperk",
    category: "sport",
    phone: "388 412 500",
    address: "Špidrova 1, Vimperk",
    hours: "Po-Ne 9:00–21:00",
    rating: 4.2,
    note: "Krytý bazén, sauna, whirlpool",
  },
  {
    id: 18,
    name: "Fitness centrum Šumava",
    category: "sport",
    phone: "731 222 111",
    address: "Sportovní 6, Vimperk",
    hours: "Po-Pá 6:00–22:00, So-Ne 8:00–20:00",
    rating: 4.5,
    note: "Posilovna, kardio, skupinové lekce, spinning",
  },
  {
    id: 19,
    name: "CrossFit Vimperk",
    category: "sport",
    phone: "722 333 444",
    address: "Průmyslová 8, Vimperk",
    hours: "Po-Pá 6:30–21:00, So 8:00–14:00",
    rating: 4.7,
    note: "CrossFit, osobní trenér, výživa",
  },
  {
    id: 20,
    name: "Zimní stadion Vimperk",
    category: "sport",
    phone: "388 412 550",
    address: "Na Zlatém potoce 1, Vimperk",
    hours: "Říjen–Březen Po-Ne 9:00–21:00",
    rating: 4.0,
    note: "Hokej, bruslení veřejnost, hry",
  },
  {
    id: 21,
    name: "Tenisový klub Vimperk",
    category: "sport",
    phone: "603 111 555",
    address: "Sokolská 3, Vimperk",
    hours: "Duben–Říjen 8:00–20:00",
    rating: 4.3,
    note: "4 antukové kurty, půjčovna raket",
  },
  // Město a veřejné služby — doplněno podle vimperk.cz
  {
    id: 22,
    name: "Městský úřad Vimperk",
    category: "město",
    phone: "388 402 231",
    address: "Steinbrenerova 6/2, 385 17 Vimperk",
    hours: "Po 7:30–11:30, 12:30–17:00 · St 7:30–11:30, 12:30–17:00 · Pá 7:30–11:30",
    note: "Úřední hodiny hlavních odborů",
    email: "urad@mesto.vimperk.cz",
    website: "https://www.vimperk.cz",
    sourceUrl: "https://www.vimperk.cz/mestsky-urad-vimperk-kontakty/os-10",
  },
  {
    id: 23,
    name: "Informační centrum Vimperk",
    category: "město",
    phone: "388 402 230",
    address: "Náměstí Svobody 42, 385 01 Vimperk",
    hours: "Kontaktní a otevírací doba dle infocentra",
    note: "Turistické informace a služby pro návštěvníky",
    email: "infocentrum@mesto.vimperk.cz",
    website: "https://www.vimperk.cz/ic/",
    sourceUrl: "https://www.vimperk.cz/turisticky-portal-vimperk/os-901",
  },
  {
    id: 24,
    name: "Městská policie Vimperk",
    category: "město",
    phone: "388 414 365",
    address: "Vimperk",
    note: "Hlídka ve službě: 778 410 790",
    sourceUrl: "https://www.vimperk.cz/mestske-organizace/os-1048",
  },
  {
    id: 25,
    name: "Městská knihovna Vimperk",
    category: "město",
    phone: "778 748 996",
    address: "1. máje 194, 385 01 Vimperk",
    hours: "Po–Čt 9:00–11:30, 12:30–17:00",
    note: "Oddělení pro dospělé · děti: 778 747 437",
    email: "knihovna@mesto.vimperk.cz",
    website: "https://www.knihovna.vimperk.cz",
    sourceUrl: "https://www.vimperk.cz/mestska-knihovna-vimperk/os-1054",
  },
  {
    id: 26,
    name: "Městské služby Vimperk, s.r.o.",
    category: "město",
    phone: "725 593 583",
    address: "Vimperk",
    note: "Jednatel: Mgr. Bc. Radek Rubeš",
    email: "msl.vimperk@volny.cz",
    sourceUrl: "https://www.vimperk.cz/mestske-organizace/os-1048",
  },
  {
    id: 27,
    name: "Městské kulturní středisko Vimperk",
    category: "město",
    phone: "775 955 043",
    address: "Johnova 226, 385 01 Vimperk",
    note: "Ředitel: Tomáš Jiřička · hlavní kontakt kulturních akcí",
    email: "info@kulturavimperk.cz",
    website: "https://www.kulturavimperk.cz",
    sourceUrl: "https://www.vimperk.cz/mestske-kulturni-stredisko-vimperk/os-1053",
  },
];

// ─── NEWS ─────────────────────────────────────────────────────────────────────
export type NewsItem = {
  id: number;
  title: string;
  summary: string;
  date: string;
  category: "radnice" | "sport" | "kultura" | "upozornění" | "komunita";
  urgent?: boolean;
  image: string;
};

export const news: NewsItem[] = [
  {
    id: 1,
    title: "Uzavírka ulice Pivovarská — od 28. března",
    summary: "Z důvodu opravy vodovodu bude ulice Pivovarská uzavřena pro dopravu od 28. 3. do 15. 4. 2026. Objízdná trasa přes ulici Steinbrenerovu.",
    date: "2026-03-25",
    category: "upozornění",
    urgent: true,
    image: "/news/upozorneni.svg",
  },
  {
    id: 2,
    title: "Nová hřiště v parku Blanice — hlasování spuštěno",
    summary: "Radnice spustila hlasování o podobě nových dětských hřišť v parku Blanice. Vyberte ze tří variant — hlasování trvá do 10. dubna.",
    date: "2026-03-24",
    category: "radnice",
    image: "/news/radnice.svg",
  },
  {
    id: 3,
    title: "HC Vimperk slaví postup do krajské ligy!",
    summary: "Hokejisté Vimperka porazili v neděli Klatovy 4:2 a zajistili si postup do vyšší soutěže. Gratulujeme!",
    date: "2026-03-23",
    category: "sport",
    image: "/news/sport.svg",
  },
  {
    id: 4,
    title: "Jarní svoz nebezpečného odpadu — 5. dubna",
    summary: "Město Vimperk organizuje svoz nebezpečného odpadu. Přistavení kontejnerů proběhne 5. dubna na náměstí Svobody od 9:00 do 13:00.",
    date: "2026-03-22",
    category: "radnice",
    image: "/news/radnice.svg",
  },
  {
    id: 5,
    title: "Turistická sezóna na Šumavě se blíží",
    summary: "NP Šumava hlásí, že od 1. dubna budou otevřeny všechny pěší trasy v okolí Vimperka. Připravte si boty!",
    date: "2026-03-20",
    category: "kultura",
    image: "/news/kultura.svg",
  },
];

// ─── POLLS ────────────────────────────────────────────────────────────────────
export type PollOption = {
  id: number;
  text: string;
  votes: number;
};

export type Poll = {
  id: number;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endsAt: string;
  category: "infrastruktura" | "kultura" | "doprava" | "obecné";
};

export const polls: Poll[] = [
  {
    id: 1,
    question: "Jakou podobu hřiště v parku Blanice preferujete?",
    options: [
      { id: 1, text: "Moderní prolézačky a lezecká stěna", votes: 187 },
      { id: 2, text: "Tradiční houpačky a pískoviště", votes: 94 },
      { id: 3, text: "Multifunkční sportoviště (basketbal + pingpong)", votes: 211 },
    ],
    totalVotes: 492,
    endsAt: "2026-04-10",
    category: "infrastruktura",
  },
  {
    id: 2,
    question: "Jak jste spokojeni s frekvencí autobusů do Prachatic?",
    options: [
      { id: 4, text: "Velmi spokojen/a", votes: 43 },
      { id: 5, text: "Spíše spokojen/a", votes: 89 },
      { id: 6, text: "Spíše nespokojen/a", votes: 156 },
      { id: 7, text: "Velmi nespokojen/a", votes: 201 },
    ],
    totalVotes: 489,
    endsAt: "2026-04-15",
    category: "doprava",
  },
];

// ─── EMERGENCY CONTACTS ───────────────────────────────────────────────────────
export const emergencyContacts = [
  { name: "Tísňová linka", number: "112", icon: "phone" },
  { name: "Záchranná služba", number: "155", icon: "heart" },
  { name: "Hasiči", number: "150", icon: "flame" },
  { name: "Policie ČR", number: "158", icon: "shield" },
  { name: "Městská policie Vimperk", number: "388 402 110", icon: "shield" },
  { name: "Pohotovost Vimperk", number: "388 402 200", icon: "heart" },
];
